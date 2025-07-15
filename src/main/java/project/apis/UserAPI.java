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
            return ResponseEntity.ok("missingInfoError");
        if (userRepository.findByusername(uldto.getUsername()) == null)
            return ResponseEntity.ok("usernameError");
        if (!uldto.getPassword().equals(userRepository.findByusername(uldto.getUsername()).getPassword()))
            return ResponseEntity.ok("passwordError");

        String jwtt = jwt.generateToken(uldto.getUsername());
        return ResponseEntity.ok(jwtt);
    }

    @PostMapping("/adduser")
    public ResponseEntity<?> AddUser(@RequestBody User user) {
        if (!Pattern.compile("^[a-zA-Z0-9_!#$%&'*+/=?`{|}~^.-]+@[a-zA-Z0-9.-]+$").matcher(user.getEmail()).matches() || user.getEmail().isBlank() || user.getUsername().isBlank() || user.getDisplayName().isBlank())
            return ResponseEntity.ok("invalidDataError");

        if (userRepository.findByemail(user.getEmail()) != null)
            return ResponseEntity.ok("emailError");

        if (userRepository.findByusername(user.getUsername()) != null)
            return ResponseEntity.ok("usernameError");

        if (userRepository.findBydisplayName(user.getDisplayName()) != null)
            return ResponseEntity.ok("displayNameError");

        userRepository.save(user);
        return ResponseEntity.ok("success");
    }

    @GetMapping("/showprofile")
    public ResponseEntity<?> ShowProfile(@RequestHeader Map<String, String> token) {
        User user = userRepository.findByidUser(jwt.extractId(token.get("token")));
        UserProfileDTO updto = new UserProfileDTO("",  user.getEmail(), user.getDisplayName(), user.getDesc(), user.getImagePath(), user.getUsername(), "", user.getIdUser());
        return ResponseEntity.ok(updto);
    }

    @PostMapping("/updateprofile")
    public ResponseEntity<?> ShowProfile(@RequestHeader Map<String, String> token, @RequestBody UserProfileDTO updto) {
        String email = updto.getEmail();
        if (!Pattern.compile("^[a-zA-Z0-9_!#$%&'*+/=?`{|}~^.-]+@[a-zA-Z0-9.-]+$").matcher(email).matches())
            return ResponseEntity.ok("invalidEmailError");

       User user = userRepository.findByidUser(jwt.extractId(token.get("token")));

       if (!(updto.getEmail() == null || updto.getEmail().isBlank())) {
           user.setEmail(updto.getEmail());
       }

       if (!(updto.getOldPassword() == null || updto.getPassword() == null || updto.getPassword().isBlank() || updto.getOldPassword().isBlank())) {
           if (updto.getOldPassword().equals(user.getPassword()))
               user.setPassword(updto.getPassword());
           else
               return ResponseEntity.ok("passNotMatchingError");
       }

        if (!(updto.getDesc() == null || updto.getDesc().isBlank()))
            user.setDesc(updto.getDesc());

        if (!(updto.getDisplayName() == null || updto.getDisplayName().isBlank()))
            user.setDisplayName(updto.getDisplayName());

        if (!(updto.getImagePath() == null || updto.getImagePath().isBlank()))
            user.setImagePath(updto.getImagePath());

        if (updto.getOldPassword().equals(user.getPassword())) {
            userRepository.save(user);
            return ResponseEntity.ok("success");
        }
        else {
            return ResponseEntity.ok("wrongPasswordError");
        }
    }
}