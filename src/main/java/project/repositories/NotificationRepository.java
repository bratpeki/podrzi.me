package project.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import project.classes.Notification;

import java.util.List;

public interface NotificationRepository extends JpaRepository<Notification, Integer> {
    List<Notification> findAllByUser_idUser (Integer idUser);
}
