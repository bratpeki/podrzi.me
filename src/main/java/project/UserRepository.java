package project;

import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Integer> {
    User findByidUser(Integer idUser);
    User findByusername(String username);
}
