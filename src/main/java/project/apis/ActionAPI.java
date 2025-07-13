package project.apis;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import project.classes.Action;
import project.dtos.ActionDTO;
import project.repositories.ActionRepository;

import java.util.List;

@RestController
@RequestMapping("/api/actions")
public class ActionAPI {
    private final ActionRepository actionRepository;

    public ActionAPI (ActionRepository actionRepository) {
        this.actionRepository = actionRepository;
    }

    @GetMapping("/getaction")
    public ResponseEntity<?> GetAction(@RequestParam Integer id) {
        Action a = actionRepository.findByidAction(id);
        return ResponseEntity.ok(new ActionDTO(a.getName(), a.getGoal(), a.getCollected(), a.getDesc(), a.getPrimaryimage(), a.getIdAction()));
    }

    @GetMapping("/getvisibleactions")
    public List<ActionDTO> GetVisibleActions() {
        List<Action> list = actionRepository.findAll().stream().filter(a->a.getVisible() == 1).toList();
        return list.stream().map(a->new ActionDTO(a.getName(), a.getGoal(), a.getCollected(), a.getDesc(), a.getPrimaryimage(), a.getIdAction())).toList();
    }

    @PostMapping("/addaction")
    public ResponseEntity<?> SetAction(@RequestBody Action action) {
        if (actionRepository.findByname(action.getName()) != null && actionRepository.findByname(action.getName()).getVisible() == 1)
            return ResponseEntity.badRequest().body("taken");

        action.setCollected(0.0f);
        action.setVisible(1);

        actionRepository.save(action);
        return ResponseEntity.ok(action.getIdAction());
    }
}
