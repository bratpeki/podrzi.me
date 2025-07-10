package project.action;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/actions")
public class ActionAPI {
    private final ActionRepository actionRepository;

    public ActionAPI (ActionRepository actionRepository) {
        this.actionRepository = actionRepository;
    }

    @GetMapping("/getvisibleactions")
    public List<ActionDTO> GetVisibleActions() {
        List<Action> list = actionRepository.findAll().stream().filter(a->a.getVisible() == true).toList();
        return list.stream().map(a->new ActionDTO(a.getName(), a.getGoal(), a.getCollected(), a.getDesc(), a.getImagepath())).toList();
    }

    @PostMapping("/addaction")
    public String SetAction(@RequestBody Action action) {
        if (actionRepository.findByname(action.getName()) != null && actionRepository.findByname(action.getName()).getVisible() == true)
            return "taken";



        actionRepository.save(action);
        return "success";
    }
}
