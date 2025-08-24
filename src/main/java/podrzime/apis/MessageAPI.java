package podrzime.apis;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.*;

import podrzime.classes.Message;
import podrzime.dtos.MessageDTO;
import podrzime.repositories.AdminRepository;
import podrzime.repositories.MessageRepository;
import podrzime.utilities.*;
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
            return ResponseEntity.ok("emailError");

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
