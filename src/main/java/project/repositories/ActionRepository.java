package project.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import project.classes.Action;

public interface ActionRepository extends JpaRepository<Action, Integer> {
    Action findByidAction(Integer idAction);
    Action findByname(String name);
}