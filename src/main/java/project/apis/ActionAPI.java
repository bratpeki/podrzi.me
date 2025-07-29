package project.apis;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import project.classes.*;
import project.dtos.*;
import project.repositories.ActionOwnerRepository;
import project.repositories.ActionRepository;
import project.repositories.CommentRepository;
import project.repositories.UserRepository;
import project.utilities.JWT;

import java.util.ArrayList;
import java.util.Map;
import java.util.List;

@RestController
@RequestMapping("/api/actions")
public class ActionAPI {
    private final ActionRepository actionRepository;
    private final UserRepository  userRepository;
    private final ActionOwnerRepository actionOwnerRepository;
    private final CommentRepository commentRepository;
    private final JWT jwt;

    public ActionAPI (ActionRepository actionRepository, ActionOwnerRepository actionOwnerRepository, JWT jwt, UserRepository userRepository, CommentRepository commentRepository) {
        this.actionRepository = actionRepository;
        this.actionOwnerRepository = actionOwnerRepository;
        this.jwt = jwt;
        this.userRepository = userRepository;
        this.commentRepository = commentRepository;
    }

    @GetMapping("/getaction")
    public ResponseEntity<?> getAction(@RequestParam Integer idAction) {
        Action a = actionRepository.findByidAction(idAction);
        List<Comment> lc = commentRepository.findByaction_idAction(idAction);
        List<CommentDTO> coms = lc.stream().map(c->new CommentDTO(c.getText(), c.getAction().getIdAction(), c.getCreated(), c.getUser().getIdUser(), c.getUser().getDisplayName(), c.getUser().getImagePath(), c.getIdComment())).toList();
        List<ActionOwnerDTO> AOs = actionOwnerRepository.findAll().stream().filter(ao->ao.getAction().getIdAction().equals(idAction)).map(ao->new ActionOwnerDTO(ao.getUser().getIdUser(), ao.getIsCollab(), ao.getUser().getDisplayName(), ao.getUser().getImagePath())).toList();
        return ResponseEntity.ok(new ActionDTO(a.getName(), a.getGoal(), a.getCollected(), a.getDesc(), a.getPrimaryImage(), a.getIdAction(), AOs, coms, a.getEndTime(), a.getTags(), a.getCategory(), a.getSubtitle(), a.getLocation(), a.getVideoLink()));
    }

    @GetMapping("/getvisibleactions")
    public ResponseEntity<?> getVisibleActions(@RequestHeader Map<String, String> token) {
        List<Action> list = actionRepository.findAll().stream().filter(a->a.getVisible() == 1).toList();
        return ResponseEntity.ok(list.stream().map(a->new ActionDTO(a.getName(), a.getGoal(), a.getCollected(), a.getDesc(), a.getPrimaryImage(), a.getIdAction(), null, null, null, a.getTags(), a.getCategory(), a.getSubtitle(), a.getLocation(), null)).toList());
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
    public ResponseEntity<?> updateAction(@RequestHeader Map<String, String> token, @RequestBody ActionUpdateDTO adto) {
        List<ActionOwner> ao = actionOwnerRepository.findAllByidAO_IdAction(adto.getIdAction());
        String requesterUsername = jwt.extractUsername(token.get("token"));
        boolean isOwner = ao.stream()
                .anyMatch(a -> a.getUser().getUsername().equals(requesterUsername));

        if (!isOwner)
            return ResponseEntity.ok("invalidUserError");

        //TODO: provjeriti da li postoji akcija sa novim imenom

        Action a  =  actionRepository.findByidAction(adto.getIdAction());

        if (!adto.getLocation().equals(a.getLocation()))
            a.setLocation(adto.getLocation());

        if (!adto.getCategory().equals(a.getCategory()))
            a.setCategory(adto.getCategory());

        if (!adto.getTags().equals(a.getTags()))
            a.setTags(adto.getTags());

        if (!adto.getVideoLink().equals(a.getVideoLink()))
            a.setVideoLink(adto.getVideoLink());

        if (!adto.getSubtitle().equals(a.getSubtitle()))
            a.setSubtitle(adto.getSubtitle());

        if (!adto.getDesc().equals(a.getDesc()))
            a.setDesc(adto.getDesc());

        if (!adto.getGoal().equals(a.getGoal()))
            a.setGoal(adto.getGoal());

        if (adto.getPrimaryImage() != null)
            if (!(adto.getPrimaryImage().equals(a.getPrimaryImage()) || adto.getPrimaryImage().isBlank()))
                a.setPrimaryImage(adto.getPrimaryImage());

        actionRepository.save(a);
        return ResponseEntity.ok("success");
    }

    @GetMapping("/validateuser")
    public ResponseEntity<?> ValidateUser(@RequestHeader Map<String, String> token, @RequestParam Integer idAction) {
        return ResponseEntity.ok(actionOwnerRepository.findByidAO_IdAction(idAction).getUser().getUsername().equals(jwt.extractUsername(token.get("token"))));
    }

    @PostMapping("/removeaction")
    public ResponseEntity<?> removeAction(@RequestHeader Map<String, String> token, @RequestParam Integer idAction, @RequestParam String password) {
        User u = userRepository.findByidUser(jwt.extractId(token.get("token")));
        if (u.getPassword().equals(password)) {
            Action a = actionRepository.findByidAction(idAction);
            ActionOwner ao = actionOwnerRepository.findByidAO_IdAction(idAction);
            actionOwnerRepository.delete(ao);
            actionRepository.delete(a);
            return ResponseEntity.ok("success");
        }
        else
            return ResponseEntity.ok("wrongPasswordError");
    }

    @GetMapping("/searchactions")
    public ResponseEntity<?> searchActions(@RequestParam String input) {
        return ResponseEntity.ok(actionRepository.findTop5BynameContainingIgnoreCase(input).stream().toList());
    }

    @GetMapping("/getuseractions")
    public ResponseEntity<?> getUserActions(@RequestHeader Map<String, String> token, @RequestParam Integer idUser) {
        List<ActionOwner> aol = actionOwnerRepository.findAllByuser_idUser(idUser);
        List<ActionDTO> al = new ArrayList<>();
        for (ActionOwner a : aol)
            al.add(new ActionDTO(a.getAction().getName(), a.getAction().getGoal(),a.getAction().getCollected(), a.getAction().getDesc(), a.getAction().getPrimaryImage(), a.getAction().getIdAction(), null, null, null, null, null, a.getAction().getSubtitle(), a.getAction().getLocation(), null));

        return ResponseEntity.ok(al);
    }

}

