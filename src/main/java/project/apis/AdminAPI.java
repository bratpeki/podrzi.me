package project.apis;

import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import project.classes.*;
import project.repositories.*;
import project.utilities.*;
import project.dtos.*;

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

    public AdminAPI (AdminRepository adminRepository, JWT jwt, UserRepository userRepository, MailService mailService, ActionRepository actionRepository, ActionOwnerRepository actionOwnerRepository, CommentRepository commentRepository, PasswordEncoder passwordEncoder) {
        this.adminRepository = adminRepository;
        this.jwt = jwt;
        this.userRepository = userRepository;
        this.mailService = mailService;
        this.actionRepository = actionRepository;
        this.actionOwnerRepository = actionOwnerRepository;
        this.commentRepository = commentRepository;
        this.passwordEncoder = passwordEncoder;
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
        if (!passwordEncoder.matches(admin.getPassword(), passwordEncoder.encode("69")))
            return ResponseEntity.ok("passwordError");

        String jwtt = jwt.generateTokenAdmin(admin.getUsername());

        return ResponseEntity.ok(jwtt);
    }

    @PostMapping("/suspenduser")
    public ResponseEntity<?> suspendUser(@RequestParam String reason, @RequestParam Integer idUser) {
        User u = userRepository.findByidUser(idUser);

        if (u != null && u.getState() == 0) {
            u.setState(1);
            userRepository.save(u);

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
}
