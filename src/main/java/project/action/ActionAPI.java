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

    @GetMapping("/getactions")
    public List<String> GetActions() {
        List<Action> list = actionRepository.findAll();
        return list.stream().map(Action::getName).toList();
    }

    @GetMapping("/getactionmissing")
    public Float GetMissing(@RequestParam Integer idAction) {
        Action a = actionRepository.findByidAction(idAction);
        return a.GetMissing();
    }

    @GetMapping("/getactionvisible")
    public Boolean GetVisible(@RequestParam Integer idAction) {
        Action a = actionRepository.findByidAction(idAction);
        return a.getVisible();
    }

    @GetMapping("/getvisibleactions")
    public List<Action> GetVisibleActions() {
        List<Action> list = actionRepository.findAll();
        return list.stream().filter(a -> a.getVisible() == true).toList();
    }

    @PostMapping("/addaction")
    public Action SetAction(@RequestBody Action action) {
        return actionRepository.save(action);
    }
}
