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

    public NotificationAPI(NotificationRepository notificationRepository, JWT jwt, UserRepository userRepository, ActionRepository actionRepository) {
        this.notificationRepository = notificationRepository;
        this.jwt = jwt;
        this.userRepository = userRepository;
        this.actionRepository = actionRepository;
    }

    @PostMapping("/seen")
    public ResponseEntity<?> seenNotif(@RequestHeader Map<String,String> token, @RequestBody List<Integer> idNotification) {
        Integer idUser = jwt.extractId(token.get("token"));
        notificationRepository.markAsSeenByUser(idNotification, idUser);
        return ResponseEntity.ok("success");
    }

    @GetMapping("/get")
    public ResponseEntity<?> getNotifications(@RequestHeader Map<String, String> token) {
        List<Notification> n = notificationRepository.findAllByUser_idUser(jwt.extractId(token.get("token")));
        return ResponseEntity.ok(n.stream().map(a->new NotificationDTO(a.getUser().getIdUser(), a.getText(), a.getType(), a.getUser().getDisplayName(), a.getUser().getImagePath(), a.getIdNotification()))
        );
    }

    @PostMapping("/send")
    public ResponseEntity<?> sendNotification(@RequestHeader Map<String, String> token, @RequestBody NotificationDTO notif, @RequestParam(value="idAction", required = false) Integer idAction) {
        User u = userRepository.findByidUser(jwt.extractId(token.get("token")));
        Notification n = new Notification();

        if (notif.getType() == 0)
            n.setText(u.getDisplayName() + " vas je pozvao da budete kolaborator na akciji " + actionRepository.findByidAction(idAction).getName());
        else if (notif.getType() == 0 && idAction == null)
            return ResponseEntity.ok("missingIdActionError");
        else if (notif.getType() == 1)
            n.setText(notif.getText());

        n.setCreated(LocalDateTime.now());
        n.setSeen(false);
        n.setType(notif.getType());
        n.setUser(userRepository.findByidUser(notif.getIdUser()));

        return ResponseEntity.ok("success");
    }

    @PostMapping("/sendall")
    public ResponseEntity<?> sendNotificationsAll() {

        return ResponseEntity.ok("success");
    }
}
