package project.apis;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import project.classes.*;
import project.repositories.*;
import project.dtos.*;
import project.utilities.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/notifications")
public class NotificationAPI {

    private final JWT jwt;
    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;
    private final ActionRepository actionRepository;
    private final ActionOwnerRepository actionOwnerRepository;

    public NotificationAPI(NotificationRepository notificationRepository, JWT jwt, UserRepository userRepository, ActionRepository actionRepository, ActionOwnerRepository actionOwnerRepository) {
        this.notificationRepository = notificationRepository;
        this.jwt = jwt;
        this.userRepository = userRepository;
        this.actionRepository = actionRepository;
        this.actionOwnerRepository = actionOwnerRepository;
    }

    @PostMapping("/seen")
    public ResponseEntity<?> seenNotif(@RequestHeader Map<String,String> token, @RequestBody List<Integer> idNotification) {
        Integer idUser = jwt.extractId(token.get("token"));
        notificationRepository.markAsSeenByUser(idNotification, idUser);
        return ResponseEntity.ok("success");
    }

    @GetMapping("/get")
    public ResponseEntity<?> getNotifications(@RequestHeader Map<String, String> token) {
        List<Notification> n = notificationRepository.findTop10ByUserIdOrderByCreatedDesc(jwt.extractId(token.get("token")));
        return ResponseEntity.ok(n.stream().map(a->
                new NotificationDTO(a.getAction().getIdAction(),
                        a.getText(),
                        a.getType(),
                        a.getAction().getName(),
                        a.getAction().getPrimaryImage(),
                        a.getIdNotification(),
                        a.getUserSender().getIdUser(),
                        a.getUserSender().getDisplayName(),
                        a.getSeen(),
                        null))
        );
    }

    @PostMapping("/send")
    public ResponseEntity<?> sendNotification(@RequestHeader Map<String, String> token, @RequestBody NotificationSendCollabDTO notif) {
        User u = userRepository.findByidUser(jwt.extractId(token.get("token")));
        Notification n = new Notification();

        if (!actionOwnerRepository.findAll().stream().filter(ao->ao.getUser().getIdUser().equals(notif.getIdUser()) && ao.getAction().getIdAction().equals(notif.getIdAction())).toList().isEmpty())
            return ResponseEntity.ok("existsAOError");

        n.setText(u.getDisplayName() + " vas je pozvao da budete kolaborator na akciji " + actionRepository.findByidAction(notif.getIdAction()).getName());
        if (notif.getIdAction() == null)
            return ResponseEntity.ok("missingIdActionError");

        n.setCreated(LocalDateTime.now());
        n.setSeen(false);
        n.setType(notif.getType());
        n.setUserSender(u);
        n.setUser(userRepository.findByidUser(notif.getIdUser()));
        n.setAction(actionRepository.findByidAction(notif.getIdAction()));

        notificationRepository.save(n);
        return ResponseEntity.ok("success");
    }

    @PostMapping("/sendall")
    public ResponseEntity<?> sendNotificationsAll() {

        return ResponseEntity.ok("success");
    }

    @PostMapping("/acceptcollab")
    public ResponseEntity<?> acceptCollab(@RequestHeader Map<String, String> token, @RequestParam Integer idAction, @RequestParam Integer idNotification) {
        User u = userRepository.findByidUser(jwt.extractId(token.get("token")));
        Action a = actionRepository.findByidAction(idAction);
        Notification n = notificationRepository.findByidNotification(idNotification);

        if (!(n.getAction().getIdAction().equals(idAction) && n.getUser().getIdUser().equals(u.getIdUser())))
            return ResponseEntity.ok("invalidActionError");
        else {
            ActionOwner ao = new ActionOwner();
            ao.setIsCollab(true);
            ao.setUser(u);
            ao.setAction(a);
            actionOwnerRepository.save(ao);
            notificationRepository.delete(n);

            return ResponseEntity.ok("success");
        }
    }

    @PostMapping("/denycollab")
    public ResponseEntity<?> denyCollab(@RequestHeader Map<String, String> token, @RequestParam Integer idNotification) {
        notificationRepository.delete(notificationRepository.findByidNotification(idNotification));
        return ResponseEntity.ok("success");
    }
}
