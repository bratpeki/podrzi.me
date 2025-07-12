package project.user;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import project.utilities.JWT;

import java.util.List;

@RestController
@RequestMapping("/api/users")
public class UserAPI {
    private final AuthenticationManager authenticationManager;
    private final JWT jwt;
    private final UserRepository userRepository;

    public UserAPI (UserRepository userRepository, AuthenticationManager authenticationManager, JWT jwt) {
        this.userRepository = userRepository;
        this.authenticationManager = authenticationManager;
        this.jwt = jwt;
    }

    @GetMapping("/getusers")
    public List<String> GetUsers() {
        List<User> list = userRepository.findAll();
        return list.stream().map(User::getDisplayname).toList();
    }

    @PostMapping("/userauth")
    public ResponseEntity<?> LoginUser(@RequestBody UserLoginDTO uldto) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(uldto.getUsername(), uldto.getPassword())
            );
            SecurityContextHolder.getContext().setAuthentication(authentication);

            String jwtt = jwt.generateToken(uldto.getUsername());

            return ResponseEntity.ok(jwtt);
        }
        catch (AuthenticationException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Neispravno korisnicko ime ili sifra!");
        }
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


}
