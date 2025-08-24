package podrzime.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import podrzime.classes.Admin;

public interface AdminRepository extends JpaRepository<Admin, String> {
    Admin findByusername(String username);
}
