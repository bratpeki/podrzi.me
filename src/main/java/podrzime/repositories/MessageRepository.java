package podrzime.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import podrzime.classes.Message;

public interface MessageRepository extends JpaRepository<Message, Integer> {
}
