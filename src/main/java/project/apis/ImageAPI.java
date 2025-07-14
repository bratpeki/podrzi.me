package project.apis;

import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import project.repositories.ActionRepository;
import project.repositories.UserRepository;

import java.io.File;
import java.io.IOException;
import java.nio.file.*;
import java.util.List;
import java.util.stream.Stream;
import project.classes.Action;

@RestController
@RequestMapping("/api/images")
public class ImageAPI {
    private final ActionRepository actionRepository;
    private final UserRepository userRepository;

    public ImageAPI(ActionRepository actionRepository, UserRepository userRepository) {
        this.actionRepository = actionRepository;
        this.userRepository = userRepository;
    }
    private static final String UPLOAD_FOLDER;

    static {
        try {
            UPLOAD_FOLDER = new File(".").getCanonicalPath() + "/uploads/images";
        } catch (IOException ex) {
            throw new RuntimeException(ex);
        }
    }

    private static final String UPLOAD_LINK = "http://podrzime.ddns.net:8080/uploads/images";
    //  private static final String UPLOAD_LINK = "http://localhost:8080/uploads/images";

    @PostMapping("/uploadaction")
    public ResponseEntity<?> uploadActionImage(@RequestParam Integer idAction, @RequestParam("file") MultipartFile filen, @RequestParam Boolean isPrimary) throws IOException {
        String file = filen.getOriginalFilename();

        if (!(file.endsWith(".jpg") || file.endsWith(".png") || file.endsWith(".jpeg")))
            return ResponseEntity.badRequest().body("invalidfile");

        String folderPath = UPLOAD_FOLDER + "/actions/" + idAction + "/";
        Path dirPath = Paths.get(folderPath);
        Files.createDirectories(dirPath);

        Path filePath = dirPath.resolve(file);

        if (!Files.exists(filePath))
            Files.copy(filen.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

        if (isPrimary == true){
            Action a = actionRepository.findByidAction(idAction);
            a.setPrimaryImage(UPLOAD_LINK+"/actions/"+idAction+"/"+file);
            actionRepository.save(a);
            actionRepository.flush();
        }

        return ResponseEntity.ok("success");
    }

    @PostMapping("/uploaduser")
    public ResponseEntity<?> uploadUserImage(@RequestParam Integer idUser, @RequestParam("file") MultipartFile filen) throws IOException {
        String file = filen.getOriginalFilename();
        if (!(file.endsWith(".jpg") || file.endsWith(".png") || file.endsWith(".jpeg")))
            return ResponseEntity.badRequest().body("invalidfile");

        String folderPath = UPLOAD_FOLDER + "/users/" + idUser + "/";
        Path dirPath = Paths.get(folderPath);
        Files.createDirectories(dirPath);

        Path filePath = dirPath.resolve(file);

        if (!Files.exists(filePath))
            Files.copy(filen.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

        Files.copy(filen.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

        return ResponseEntity.ok(UPLOAD_LINK+"/users/"+idUser+"/"+file);
    }

    @GetMapping("/getactionimages")
    public ResponseEntity<List<String>> GetActionImages(@RequestParam Integer idAction) throws IOException {
        Path path = Paths.get(UPLOAD_FOLDER + "/actions/" + idAction + "/");
        if (!Files.exists(path))
            return ResponseEntity.notFound().build();

        Stream<Path> files = Files.list(path);
        List<String> urls = files.filter(Files::isRegularFile).map(p -> UPLOAD_LINK + "/actions/" + idAction + "/" + p.getFileName().toString()).toList();

        return ResponseEntity.ok(urls);
    }
}