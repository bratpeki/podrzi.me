package podrzime.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import podrzime.classes.Action;
import java.util.List;

public interface ActionRepository extends JpaRepository<Action, Integer> {
    Action findByidAction(Integer idAction);
    Action findByname(String name);
    List<Action> findTop5BynameContainingIgnoreCase(String name);

}