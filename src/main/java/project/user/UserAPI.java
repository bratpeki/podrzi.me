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
        return list.stream().map(User::getDisplayname).toList();
    }

    @PostMapping("/userauth")
    public Boolean LoginUser(@RequestBody UserLoginDTO uldto) {
        User u = userRepository.findByusername(uldto.getUsername());
        return u.getPassword().equals(uldto.getPassword());
    }

    @PostMapping("/adduser")
    public String SetUser(@RequestBody User user) {

        if (userRepository.findByemail(user.getEmail()) != null)
            return "emailerror";

        if (userRepository.findByusername(user.getUsername()) != null)
            return "usernameerror";

        if (userRepository.findBydisplayname(user.getDisplayname()) != null)
            return "displaynameerror";

        userRepository.save(user);
        return "success";
    }


}
