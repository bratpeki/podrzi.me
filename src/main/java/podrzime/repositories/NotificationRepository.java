package podrzime.repositories;

import jakarta.transaction.*;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import podrzime.classes.Action;
import podrzime.classes.Notification;

import java.util.List;

public interface NotificationRepository extends JpaRepository<Notification, Integer> {
    List<Notification> findAllByUser_idUser (Integer idUser);

    @Modifying
    @Transactional
    @Query("UPDATE Notification n SET n.seen = true WHERE n.idNotification IN :ids AND n.user.idUser = :idUser")
    void markAsSeenByUser(@Param("ids") List<Integer> ids, @Param("idUser") Integer idUser);

    List<Notification> findByaction_idAction(Integer idAction);

    Notification findByidNotification (Integer idNotification);

    @Query("SELECT n FROM Notification n WHERE n.user.idUser = :idUser ORDER BY n.created DESC")
    List<Notification> findTop10ByUserIdOrderByCreatedDesc(@Param("idUser") Integer idUser);
}
