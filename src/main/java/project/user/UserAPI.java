package project.user;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
public class UserAPI {
    private final UserRepository userRepository;

    public UserAPI (UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @GetMapping("/getusers")
    public List<String> GetUsers() {
        List<User> list = userRepository.findAll();
        return list.stream().map(User::getDisplayName).toList();
    }

    @GetMapping("/userauth")
    public Boolean LoginUser(@RequestParam String username, @RequestParam String password) {
        User u = userRepository.findByusername(username);
        return u.getPassword().equals(password);
    }

    @PostMapping("/adduser")
    public User SetUser(@RequestBody User user) {
        return userRepository.save(user);
    }


}
