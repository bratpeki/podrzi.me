package project.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import project.classes.ActionOwner;

public interface ActionOwnerRepository extends JpaRepository<ActionOwner, Integer> {
}
