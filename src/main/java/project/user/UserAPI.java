package project.user;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import project.utilities.JWT;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
public class UserAPI {
    private final JWT jwt;
    private final UserRepository userRepository;

    public UserAPI (UserRepository userRepository, JWT jwt) {
        this.userRepository = userRepository;
        this.jwt = jwt;
    }

    @GetMapping("/getusers")
    public List<String> GetUsers() {
        List<User> list = userRepository.findAll();
        return list.stream().map(User::getDisplayname).toList();
    }

    @PostMapping("/userauth")
    public ResponseEntity<?> LoginUser(@RequestBody UserLoginDTO uldto) {
        if (uldto.getUsername().isBlank() || uldto.getPassword().isBlank() || (userRepository.findByusername(uldto.getUsername()) == null)
        && !uldto.getPassword().equals(userRepository.findByusername(uldto.getUsername()).getPassword()))
            return ResponseEntity.ok("loginerror");

        String jwtt = jwt.generateToken(uldto.getUsername());
        return ResponseEntity.ok(jwtt);
    }

    @PostMapping("/adduser")
    public String SetUser(@RequestBody User user) {
        if (!user.getEmail().contains("@") || !user.getEmail().contains(".") || user.getEmail().isBlank() || user.getUsername().isBlank() || user.getDisplayname().isBlank())
            return "invaliddataerror";

        if (userRepository.findByemail(user.getEmail()) != null)
            return "emailerror";

        if (userRepository.findByusername(user.getUsername()) != null)
            return "usernameerror";

        if (userRepository.findBydisplayname(user.getDisplayname()) != null)
            return "displaynameerror";

        userRepository.save(user);
        return "success";
    }

    @PostMapping("/validate")
    public ResponseEntity<?> Validate(@RequestHeader Map<String, String> token) {
        if (jwt.validateToken(token.get("token")))
            return ResponseEntity.ok("success");
        else
            return ResponseEntity.badRequest().body("invalidtoken");
    }
}