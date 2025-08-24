package podrzime.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import podrzime.classes.User;
import java.util.List;

public interface UserRepository extends JpaRepository<User, Integer> {
    User findByidUser(Integer idUser);
    User findByusername(String username);
    User findByemail(String email);
    User findBydisplayName(String dn);

    @Query("SELECT u.idUser, u.displayName, u.state FROM User u WHERE u.idUser <> :excludedId")
    List<Object[]> findAllUsersForAdmin(@Param("excludedId") Integer excludedId);
}
