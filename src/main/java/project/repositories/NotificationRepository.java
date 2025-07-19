package project.repositories;

import jakarta.transaction.*;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import project.classes.Notification;

import java.util.List;

public interface NotificationRepository extends JpaRepository<Notification, Integer> {
    List<Notification> findAllByUser_idUser (Integer idUser);

    @Modifying
    @Transactional
    @Query("UPDATE Notification n SET n.seen = true WHERE n.idNotification IN :ids AND n.user.idUser = :idUser")
    void markAsSeenByUser(@Param("ids") List<Integer> ids, @Param("idUser") Integer idUser);

    List<Notification> findByaction_idAction(Integer idAction);

    Notification findByidNotification (Integer idNotification);
}
