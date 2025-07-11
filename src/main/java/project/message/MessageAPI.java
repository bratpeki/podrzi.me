package project.message;

import org.springframework.web.bind.annotation.*;
import java.util.*;

import project.admin.*;

@RestController
@RequestMapping("/api/messages")
public class MessageAPI {
    private final MessageRepository messageRepository;
    private final AdminRepository adminRepository;

    public MessageAPI(MessageRepository messageRepository, AdminRepository adminRepository) {
        this.messageRepository = messageRepository;
        this.adminRepository = adminRepository;
    }

    @PostMapping("/send")
    private String SendMessage(@RequestBody MessageDTO messDTO) {
        if (!messDTO.getEmail().contains("@"))
            return "emailerror";

        Message mess = new Message();
        mess.setEmail(messDTO.getEmail());
        mess.setMessagetext(messDTO.getMessagetext());
        mess.setName(messDTO.getName());

        messageRepository.save(mess);
        return "success";
    }

    @PostMapping("/getall")
    private List<Message> GetAllMessages(@RequestBody Map<String, String> admin) {
        List<Admin> list = adminRepository.findAll();

        //TODO: FIX
        //if (!list.contains(admin.get("adminusername")))
        //    return "usernameerror";

        return messageRepository.findAll();
    }
}
