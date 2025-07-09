package project;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.handler.UserRoleAuthorizationInterceptor;

import java.util.List;

@SpringBootApplication
@RestController
@RequestMapping("/api")
public class Main {

	private final UserRepository userRepository;

	public Main (UserRepository userRepository) {
		this.userRepository = userRepository;
	}

	public static void main(String[] args) {
		SpringApplication.run(Main.class, args);
	}

	@GetMapping("/hello")
	public String Hello() {
		return "hi";
	}

	@GetMapping("/getusers")
	public List<String> GetUsers() {
		List<User> list = userRepository.findAll();
		return list.stream().map(User::GetDisplayname).toList();
	}
}
