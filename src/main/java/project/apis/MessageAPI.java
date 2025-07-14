package project.apis;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.*;

import project.classes.Message;
import project.dtos.MessageDTO;
import project.repositories.AdminRepository;
import project.repositories.MessageRepository;
import project.utilities.*;
import java.util.regex.Pattern;

@RestController
@RequestMapping("/api/messages")
public class MessageAPI {
    private final JWT jwt;
    private final MessageRepository messageRepository;
    private final AdminRepository adminRepository;

    public MessageAPI(MessageRepository messageRepository, AdminRepository adminRepository, JWT jwt) {
        this.jwt = jwt;
        this.messageRepository = messageRepository;
        this.adminRepository = adminRepository;
    }

    @PostMapping("/send")
    private ResponseEntity<?> SendMessage(@RequestBody MessageDTO messDTO) {
        if (!Pattern.compile("^[a-zA-Z0-9_!#$%&'*+/=?`{|}~^.-]+@[a-zA-Z0-9.-]+$").matcher(messDTO.getEmail()).matches())
            return ResponseEntity.badRequest().body("emailerror");

        Message mess = new Message();
        mess.setEmail(messDTO.getEmail());
        mess.setMessageText(messDTO.getMessageText());
        mess.setName(messDTO.getName());

        messageRepository.save(mess);
        return ResponseEntity.ok("success");
    }

    @PostMapping("/getall")
    private ResponseEntity<?> GetAllMessages(@RequestHeader Map<String, String> token, @RequestBody Map<String, String> admin) {

        return ResponseEntity.ok(messageRepository.findAll());
    }
}
