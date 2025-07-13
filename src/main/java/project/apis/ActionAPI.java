package project.apis;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import project.classes.Action;
import project.classes.ActionOwner;
import project.classes.ActionOwnerId;
import project.dtos.ActionDTO;
import project.repositories.ActionOwnerRepository;
import project.repositories.ActionRepository;
import project.repositories.UserRepository;
import project.utilities.JWT;
import java.util.Map;
import java.util.List;

@RestController
@RequestMapping("/api/actions")
public class ActionAPI {
    private final ActionRepository actionRepository;
    private final UserRepository  userRepository;
    private final ActionOwnerRepository actionOwnerRepository;
    private final JWT jwt;

    public ActionAPI (ActionRepository actionRepository, ActionOwnerRepository actionOwnerRepository, JWT jwt, UserRepository userRepository) {
        this.actionRepository = actionRepository;
        this.actionOwnerRepository = actionOwnerRepository;
        this.jwt = jwt;
        this.userRepository = userRepository;
    }

    @GetMapping("/getaction")
    public ResponseEntity<?> GetAction(@RequestParam Integer idAction) {
        Action a = actionRepository.findByidAction(idAction);
        return ResponseEntity.ok(new ActionDTO(a.getName(), a.getGoal(), a.getCollected(), a.getDesc(), a.getPrimaryimage(), a.getIdAction()));
    }

    @GetMapping("/getvisibleactions")
    public List<ActionDTO> GetVisibleActions(@RequestHeader Map<String, String> token) {
        List<Action> list = actionRepository.findAll().stream().filter(a->a.getVisible() == 1).toList();
        return list.stream().map(a->new ActionDTO(a.getName(), a.getGoal(), a.getCollected(), a.getDesc(), a.getPrimaryimage(), a.getIdAction())).toList();
    }

    @PostMapping("/addaction")
    public ResponseEntity<?> SetAction(@RequestHeader Map<String, String> token, @RequestBody Action action) {
        if (actionRepository.findByname(action.getName()) != null && actionRepository.findByname(action.getName()).getVisible() == 1)
            return ResponseEntity.badRequest().body("taken");

        action.setCollected(0.0f);
        action.setVisible(1);

        actionRepository.save(action);

        ActionOwner ao = new ActionOwner();
        ao.setAction(action);
        ao.setIdAO(new ActionOwnerId(action.getIdAction(), jwt.extractId(token.get("token"))));
        ao.setUser(userRepository.findBydisplayname(jwt.extractUsername(token.get("token"))));
        actionOwnerRepository.save(ao);

        return ResponseEntity.ok(action.getIdAction());
    }

    @PostMapping("/setprimaryimage")
    public ResponseEntity<?> SetPrimaryImage(@RequestHeader Map<String, String> token, @RequestParam String imagePath, @RequestParam Integer idAction) {
        Action a = actionRepository.findByidAction(idAction);
        a.setPrimaryimage(imagePath);
        actionRepository.save(a);
        return ResponseEntity.ok("success");
    }
}