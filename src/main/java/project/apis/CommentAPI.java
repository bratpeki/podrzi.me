package project.apis;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import project.classes.Comment;
import project.dtos.CommentDTO;
import project.repositories.ActionRepository;
import project.repositories.CommentRepository;
import project.repositories.UserRepository;
import project.utilities.JWT;
import project.classes.*;

import java.time.LocalDateTime;
import java.util.Map;

@RestController
@RequestMapping("/api/comments")
public class CommentAPI {
    private final CommentRepository commentRepository;
    private final ActionRepository actionRepository;
    private final UserRepository userRepository;
    private final JWT jwt;

    public CommentAPI(CommentRepository commentRepository, ActionRepository actionRepository, UserRepository userRepository, JWT jwt) {
        this.commentRepository = commentRepository;
        this.actionRepository = actionRepository;
        this.userRepository = userRepository;
        this.jwt = jwt;
    }

    @PostMapping("/add")
    public ResponseEntity<?> add(@RequestHeader Map<String, String> token, @RequestBody CommentDTO com) {
        User u = userRepository.findByidUser(jwt.extractId(token.get("token")));
        if (u == null)
            return ResponseEntity.ok("notLoggedIn");
        Action a = actionRepository.findByidAction(com.getIdAction());

        Comment comm = new Comment();
        comm.setAction(a);
        comm.setUser(u);
        comm.setText(com.getText());
        comm.setCreated(LocalDateTime.now());
        commentRepository.save(comm);

        return ResponseEntity.ok("success");
    }

    @PostMapping("/remove")
    public ResponseEntity<?> remove(@RequestHeader Map<String, String> token, @RequestParam Integer idComment) {
        User u = userRepository.findByidUser(jwt.extractId(token.get("token")));
        if (u == null)
            return ResponseEntity.ok("notLoggedIn");
        Comment c = commentRepository.findByidComment(idComment);

        commentRepository.delete(c);
        return ResponseEntity.ok("success");
    }
}
