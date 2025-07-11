package project.admin;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin")
public class AdminAPI {
    private final AdminRepository adminRepository;

    public AdminAPI (AdminRepository adminRepository) {
        this.adminRepository = adminRepository;
    }

    @PostMapping("/")
    public String AdminLogin(@RequestBody Admin admin) {

        return "success";
    }
}
