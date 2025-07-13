package project.apis;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import project.classes.User;
import project.dtos.UserLoginDTO;
import project.dtos.UserProfileDTO;
import project.repositories.UserRepository;
import project.utilities.JWT;

import java.util.Map;
import java.util.regex.Pattern;

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
    public ResponseEntity<?> GetUsers() {
        return ResponseEntity.ok(userRepository.findAll());
    }

    @PostMapping("/userauth")
    public ResponseEntity<?> LoginUser(@RequestBody UserLoginDTO uldto) {
        if (uldto.getUsername().isBlank() && uldto.getPassword().isBlank())
            return ResponseEntity.ok("loginerror");
        if (userRepository.findByusername(uldto.getUsername()) == null)
            return ResponseEntity.ok("loginerror");
        if (!uldto.getPassword().equals(userRepository.findByusername(uldto.getUsername()).getPassword()))
            return ResponseEntity.ok("loginerror");

        String jwtt = jwt.generateToken(uldto.getUsername());
        return ResponseEntity.ok(jwtt);
    }

    @PostMapping("/adduser")
    public ResponseEntity<?> AddUser(@RequestBody User user) {
        if (!Pattern.compile("^[a-zA-Z0-9_!#$%&'*+/=?`{|}~^.-]+@[a-zA-Z0-9.-]+$").matcher(user.getEmail()).matches() || user.getEmail().isBlank() || user.getUsername().isBlank() || user.getDisplayname().isBlank())
            return ResponseEntity.badRequest().body("invaliddataerror");

        if (userRepository.findByemail(user.getEmail()) != null)
            return ResponseEntity.badRequest().body("emailerror");

        if (userRepository.findByusername(user.getUsername()) != null)
            return ResponseEntity.badRequest().body("usernameerror");

        if (userRepository.findBydisplayname(user.getDisplayname()) != null)
            return ResponseEntity.badRequest().body("displaynameerror");

        userRepository.save(user);
        return ResponseEntity.ok("success");
    }

    @GetMapping("/showprofile")
    public ResponseEntity<?> ShowProfile(@RequestHeader Map<String, String> token) {
        if (!jwt.validateToken(token.get("token")))
            return ResponseEntity.badRequest().body("invalidtoken");

        User user = userRepository.findByidUser(jwt.extractId(token.get("token")));
        UserProfileDTO updto = new UserProfileDTO("",  user.getEmail(), user.getDisplayname(), user.getDesc(), user.getImagepath());
        return ResponseEntity.ok(updto);
    }

    @PostMapping("/updateprofile")
    public ResponseEntity<?> ShowProfile(@RequestHeader Map<String, String> token, @RequestBody UserProfileDTO updto) {
        if (!jwt.validateToken(token.get("token")))
            return ResponseEntity.badRequest().body("invalidtoken");

        String email = updto.getEmail();
        if (!Pattern.compile("^[a-zA-Z0-9_!#$%&'*+/=?`{|}~^.-]+@[a-zA-Z0-9.-]+$").matcher(email).matches())
            return ResponseEntity.badRequest().body("invalidemail");

       User user = userRepository.findByidUser(jwt.extractId(token.get("token")));
       user.setEmail(updto.getEmail());
       user.setPassword(updto.getPassword());
       user.setDesc(updto.getDesc());
       user.setDisplayname(updto.getDisplayname());
       user.setImagepath(updto.getImagepath());
       userRepository.save(user);

        return ResponseEntity.ok("success");
    }
}