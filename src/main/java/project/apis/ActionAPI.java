package project.apis;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import project.classes.Action;
import project.classes.ActionOwner;
import project.dtos.ActionDTO;
import project.dtos.ActionOwnerDTO;
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
    public ResponseEntity<?> getAction(@RequestParam Integer idAction) {
        Action a = actionRepository.findByidAction(idAction);
        List<ActionOwnerDTO> AOs = actionOwnerRepository.findAll().stream().filter(ao->ao.getAction().getIdAction().equals(idAction)).map(ao->new ActionOwnerDTO(ao.getUser().getIdUser(), ao.getIsCollab(), ao.getUser().getDisplayName(), ao.getUser().getImagePath())).toList();
        return ResponseEntity.ok(new ActionDTO(a.getName(), a.getGoal(), a.getCollected(), a.getDesc(), a.getPrimaryImage(), a.getIdAction(), AOs));
    }

    @GetMapping("/getvisibleactions")
    public ResponseEntity<?> getVisibleActions(@RequestHeader Map<String, String> token) {
        List<Action> list = actionRepository.findAll().stream().filter(a->a.getVisible() == 1).toList();
        return ResponseEntity.ok(list.stream().map(a->new ActionDTO(a.getName(), a.getGoal(), a.getCollected(), a.getDesc(), a.getPrimaryImage(), a.getIdAction(), null)).toList());
    }

    @PostMapping("/addaction")
    public ResponseEntity<?> setAction(@RequestHeader Map<String, String> token, @RequestBody Action action) {
        if (actionRepository.findByname(action.getName()) != null && actionRepository.findByname(action.getName()).getVisible() == 1)
            return ResponseEntity.ok("nameTakenError");

        action.setCollected(0.0f);
        action.setVisible(1);

        actionRepository.save(action);
        actionRepository.flush();

        ActionOwner ao = new ActionOwner();
        ao.setAction(action);
        ao.setIsCollab(false);
        ao.setUser(userRepository.findByusername(jwt.extractUsername(token.get("token"))));
        actionOwnerRepository.save(ao);

        return ResponseEntity.ok(action.getIdAction());
    }

    @PostMapping("/setprimaryimage")
    public ResponseEntity<?> setPrimaryImage(@RequestHeader Map<String, String> token, @RequestParam String imagePath, @RequestParam Integer idAction) {
        Action a = actionRepository.findByidAction(idAction);
        a.setPrimaryImage(imagePath);
        actionRepository.save(a);
        return ResponseEntity.ok("success");
    }

    @PostMapping("/updateaction")
    public ResponseEntity<?> updateAction(@RequestHeader Map<String, String> token, @RequestBody ActionDTO adto) {
        ActionOwner ao = actionOwnerRepository.findByidAO_IdAction(adto.getIdAction());
        if (!ao.getUser().getUsername().equals(jwt.extractUsername(token.get("token")))  ) {
            return ResponseEntity.ok("invalidUserError");
        }

        //TODO: provjeriti da li postoji akcija sa novim imenom

        Action a  =  actionRepository.findByidAction(adto.getIdAction());

        if (!adto.getName().equals(a.getName()))
            a.setName(adto.getName());

        if (!adto.getDesc().equals(a.getDesc()))
            a.setDesc(adto.getDesc());

        if (!adto.getGoal().equals(a.getGoal()))
            a.setGoal(adto.getGoal());

        if (!adto.getPrimaryImage().equals(a.getPrimaryImage()))
            a.setPrimaryImage(adto.getPrimaryImage());

        actionRepository.save(a);
        return ResponseEntity.ok("success");
    }
}