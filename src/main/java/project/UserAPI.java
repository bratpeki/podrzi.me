package project;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api")
public class UserAPI {
    private final UserRepository userRepository;

    public UserAPI (UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @GetMapping("/getusers")
    public List<String> GetUsers() {
        List<User> list = userRepository.findAll();
        return list.stream().map(User::GetDisplayName).toList();
    }
}
