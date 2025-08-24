package podrzime.apis;

import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import podrzime.classes.*;
import podrzime.repositories.*;
import podrzime.utilities.*;
import podrzime.dtos.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admins")
public class AdminAPI {
    private final AdminRepository adminRepository;
    private final JWT jwt;
    private final UserRepository userRepository;
    private final MailService mailService;
    private final ActionRepository actionRepository;
    private final ActionOwnerRepository actionOwnerRepository;
    private final CommentRepository commentRepository;
    private final PasswordEncoder passwordEncoder;
    private final NotificationRepository notificationRepository;
    private final ReportRepository reportRepository;
    private final RefundRepository refundRepository;

    public AdminAPI (AdminRepository adminRepository, JWT jwt, UserRepository userRepository, MailService mailService, ActionRepository actionRepository, ActionOwnerRepository actionOwnerRepository, CommentRepository commentRepository, PasswordEncoder passwordEncoder, NotificationRepository notificationRepository, ReportRepository reportRepository, RefundRepository refundRepository) {
        this.adminRepository = adminRepository;
        this.jwt = jwt;
        this.userRepository = userRepository;
        this.mailService = mailService;
        this.actionRepository = actionRepository;
        this.actionOwnerRepository = actionOwnerRepository;
        this.commentRepository = commentRepository;
        this.passwordEncoder = passwordEncoder;
        this.notificationRepository = notificationRepository;
        this.reportRepository = reportRepository;
        this.refundRepository = refundRepository;
    }

    @GetMapping("/getowner")
    public ResponseEntity<?> getOwner(@RequestHeader Map<String, String> token) {
        return ResponseEntity.ok(adminRepository.findByusername(jwt.extractUsername(token.get("token"))).getOwner());
    }

    @PostMapping("/addadmin")
    public ResponseEntity<?> addAdmin(@RequestBody Admin admin) {
        admin.setPassword(passwordEncoder.encode(admin.getPassword()));
        admin.setOwner(false);
        adminRepository.save(admin);
        return ResponseEntity.ok("success");
    }

    @PostMapping("/adminauth")
    public ResponseEntity<?> adminLogin(@RequestBody AdminLoginDTO admin) {
        if (admin.getUsername().isBlank() && admin.getPassword().isBlank())
            return ResponseEntity.ok("invalidDataError");
        if (adminRepository.findByusername(admin.getUsername()) == null)
            return ResponseEntity.ok("usernameError");
        if (!passwordEncoder.matches(admin.getPassword(), adminRepository.findByusername(admin.getUsername()).getPassword()))
            return ResponseEntity.ok("passwordError");

        String jwtt = jwt.generateTokenAdmin(admin.getUsername());

        return ResponseEntity.ok(jwtt);
    }

    @PostMapping("/suspenduser")
    public ResponseEntity<?> suspendUser(@RequestParam(required = false) String reason, @RequestParam Integer idUser) {
        User u = userRepository.findByidUser(idUser);

        if (u != null && u.getState() == 0) {
            u.setState(1);
            userRepository.save(u);
            if (reason == null)
                reason = "Prijavljeni ste za neprikladno ponasanje!";

            mailService.send(u.getEmail(), "Suspenzija naloga",
                    "Vas nalog " + u.getUsername()+ " (" + u.getDisplayName() + ") " + " je suspendovan sa nase platforme!\nRazlog za suspenziju: " + reason);

            return ResponseEntity.ok("success");
        }

        return ResponseEntity.ok("userNotValid");
    }

    @PostMapping("/removeaction")
    public ResponseEntity<?> removeAction(@RequestParam Integer idAction) {
        Action a = actionRepository.findByidAction(idAction);
        List<ActionOwner> ao = actionOwnerRepository.findAllByidAO_IdAction(idAction);

        for(ActionOwner a1 : ao)
            actionOwnerRepository.delete(a1);
        actionRepository.delete(a);

        return ResponseEntity.ok("success");
    }

    @PostMapping("/removecomment")
    public ResponseEntity<?> removeComment(@RequestParam Integer idComment) {

        Comment a = commentRepository.findByidComment(idComment);
        commentRepository.delete(a);

        return ResponseEntity.ok("success");
    }

    @PostMapping("/unsuspenduser")
    public ResponseEntity<?> unsuspendUser(@RequestParam Integer idUser) {
        User u = userRepository.findByidUser(idUser);
        if (u != null && u.getState() == 1) {
            u.setState(0);
            userRepository.save(u);

            mailService.send(u.getEmail(), "Suspenzija naloga",
                    "Suspenzija za Vas nalog " + u.getUsername()+ " (" + u.getDisplayName() + ") " + " je uklonjena!");

            return ResponseEntity.ok("success");
        }

        return ResponseEntity.ok("userNotValid");
    }

    @PostMapping("/sendall")
    public ResponseEntity<?> sendAllNotification(@RequestParam String text) {
        List<User> lu = userRepository.findAll();

        for (User u : lu) {
            Notification n = new Notification();
            n.setUser(u);
            n.setUserSender(null);
            n.setSeen(false);
            n.setType(2);
            n.setAction(null);
            n.setCreated(LocalDateTime.now());
            n.setText(text);
            notificationRepository.save(n);
        }

        return ResponseEntity.ok("success");
    }

    @PostMapping("/handle")
    public ResponseEntity<?> handleReport(@RequestHeader Map<String, String> token, @RequestParam(required = false) Integer idReport,
                                          @RequestParam(required = false) Integer idRefund, @RequestParam(required = false) Integer idUser) {
        Admin a = adminRepository.findByusername(jwt.extractUsername(token.get("token")));
        if (idReport != null) {
            Report r = reportRepository.findByidReport(idReport);
            r.setAdmin(a);
            reportRepository.save(r);
        } else if (idRefund != null) {
            Refund r = refundRepository.findByidRefund(idRefund);
            r.setAdmin(a);
            refundRepository.save(r);
        } else if (idUser != null) {
            User u = userRepository.findByidUser(idUser);
            u.setAdmin(a);
            userRepository.save(u);
        } else
            return ResponseEntity.ok("error");

        return ResponseEntity.ok("success");
    }
}
