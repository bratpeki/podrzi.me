package project.action;

import org.springframework.data.jpa.repository.JpaRepository;

public interface ActionRepository extends JpaRepository<Action, Integer> {
    Action findByidAction(Integer idAction);
}