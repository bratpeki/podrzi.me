package project.admin;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import project.utilities.*;

import java.util.Map;

@RestController
@RequestMapping("/api/admins")
public class AdminAPI {
    private final AdminRepository adminRepository;
    private final JWT jwt;

    public AdminAPI (AdminRepository adminRepository, JWT jwt) {
        this.adminRepository = adminRepository;
        this.jwt = jwt;
    }

    @PostMapping("/addadmin")
    public ResponseEntity<?> addAdmin(@RequestParam Map<String, String> token, @RequestBody Admin admin) {
        if (!jwt.validateToken(token.get("token")))
            return ResponseEntity.badRequest().body("invalidtoken");

        admin.setOwner(false);
        adminRepository.save(admin);
        return ResponseEntity.ok("success");
    }

    @PostMapping("/adminauth")
    public ResponseEntity<?> AdminLogin(@RequestBody Admin admin) {
        if (admin.getUsername().isBlank() && admin.getPassword().isBlank())
            return ResponseEntity.ok("loginerror");
        if (adminRepository.findByusername(admin.getUsername()) == null)
            return ResponseEntity.ok("loginerror");
        if (!admin.getPassword().equals(adminRepository.findByusername(admin.getUsername()).getPassword()))
            return ResponseEntity.ok("loginerror");

        String token = jwt.generateToken(admin.getUsername());
        return ResponseEntity.ok(token);
    }
}
