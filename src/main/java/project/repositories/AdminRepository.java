package project.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import project.classes.Admin;

public interface AdminRepository extends JpaRepository<Admin, String> {
    Admin findByusername(String username);
}
