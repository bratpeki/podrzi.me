package podrzime.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import podrzime.classes.ActionOwner;
import podrzime.classes.User;
import java.util.List;

public interface ActionOwnerRepository extends JpaRepository<ActionOwner, Integer> {
    ActionOwner findByidAO_IdUser(Integer idUser);
    ActionOwner findByidAO_IdAction(Integer idAction);
    List<ActionOwner> findAllByidAO_IdAction(Integer idAction);
    List<ActionOwner> findAllByuser_idUser(Integer idUser);
}
