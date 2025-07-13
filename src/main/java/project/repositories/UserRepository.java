package project.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import project.classes.User;

public interface UserRepository extends JpaRepository<User, Integer> {
    User findByidUser(Integer idUser);
    User findByusername(String username);
    User findByemail(String email);
    User findBydisplayname(String dn);
}
