package project;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api")
public class ActionAPI {
    private final ActionRepository actionRepository;

    public ActionAPI (ActionRepository actionRepository) {
        this.actionRepository = actionRepository;
    }

    @GetMapping("/getactions")
    public List<String> GetActions() {
        List<Action> list = actionRepository.findAll();
        return list.stream().map(Action::GetName).toList();
    }

    @GetMapping("/getactionmissing")
    public Float GetMissing(@RequestParam Integer idAction) {
        Action a = actionRepository.findByidAction(idAction);
        return a.GetMissing();
    }

    @GetMapping("/getactionvisible")
    public Boolean GetVisible(@RequestParam Integer idAction) {
        Action a = actionRepository.findByidAction(idAction);
        return a.GetVisible();
    }
}
