package project.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import project.classes.ActionOwner;
import project.classes.User;

public interface ActionOwnerRepository extends JpaRepository<ActionOwner, Integer> {
    ActionOwner findByidAO_IdUser(Integer idUser);

    ActionOwner findByidAO_IdAction(Integer idAction);
}
