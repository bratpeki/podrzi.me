package project.apis;

import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import project.classes.Admin;
import project.repositories.AdminRepository;
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

    public AdminAPI (AdminRepository adminRepository, JWT jwt) {
        this.adminRepository = adminRepository;
        this.jwt = jwt;
    }

    @PostMapping("/addadmin")
    public ResponseEntity<?> addAdmin(@RequestBody Admin admin) {
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
        if (!admin.getPassword().equals(adminRepository.findByusername(admin.getUsername()).getPassword()))
            return ResponseEntity.ok("passwordError");

        List<SimpleGrantedAuthority> authorities = new ArrayList<>();
        authorities.add(new SimpleGrantedAuthority("ROLE_ADMIN"));

        UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(admin.getUsername(), null, authorities);
        SecurityContextHolder.getContext().setAuthentication(authentication);
        System.out.println(authentication);

        return ResponseEntity.ok("success");
    }
}
