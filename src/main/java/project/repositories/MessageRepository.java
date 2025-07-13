package project.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import project.classes.Message;

public interface MessageRepository extends JpaRepository<Message, Integer> {
}
