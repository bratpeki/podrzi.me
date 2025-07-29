package project.apis;

import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import project.repositories.ActionRepository;
import project.repositories.UserRepository;
import project.repositories.ActionOwnerRepository;

import java.io.File;
import java.io.IOException;
import java.net.URI;
import java.nio.file.*;
import java.util.List;
import java.util.Map;
import java.util.stream.Stream;
import project.classes.Action;
import project.utilities.JWT;

@RestController
@RequestMapping("/api/images")
public class FileAPI {

    private static final String UPLOAD_LINK = "http://podrzime.ddns.net:8080/uploads";
    //  private static final String UPLOAD_LINK = "http://localhost:8080/uploads";

    private final ActionRepository actionRepository;
    private final UserRepository userRepository;
    private final ActionOwnerRepository actionOwnerRepository;
    private final JWT jwt;

    public FileAPI(ActionRepository actionRepository, UserRepository userRepository, ActionOwnerRepository actionOwnerIdRepository, JWT jwt) {
        this.actionRepository = actionRepository;
        this.userRepository = userRepository;
        this.actionOwnerRepository = actionOwnerIdRepository;
        this.jwt = jwt;
    }
    private static final String UPLOAD_FOLDER;

    static {
        try {
            UPLOAD_FOLDER = new File(".").getCanonicalPath() + "/uploads";
        } catch (IOException ex) {
            throw new RuntimeException(ex);
        }
    }

    @PostMapping("/removeactionimage")
    public ResponseEntity<?> removeActionImage(@RequestHeader Map<String, String> token, @RequestParam Integer idAction, @RequestParam String url, @RequestParam Boolean isPrimary) {
        if (!actionOwnerRepository.findByidAO_IdAction(idAction).getUser().getUsername().equals(jwt.extractUsername(token.get("token"))))
            return ResponseEntity.ok("invalidUserError");

        String folderPath = UPLOAD_FOLDER + "images/actions/" + idAction + "/";
        Path dirPath = Paths.get(folderPath);

        String filen = Paths.get(URI.create(url).getPath()).getFileName().toString();
        Path filePath = Paths.get(folderPath, filen);

        if (isPrimary == true)
            return ResponseEntity.ok("primaryImageError");
        else {
            try {
                Files.deleteIfExists(filePath);
            } catch (IOException e) {
                throw new RuntimeException(e);
            }
            return ResponseEntity.ok("success");
        }

    }

    @PostMapping("/uploadactionimage")
    public ResponseEntity<?> uploadActionImage(@RequestParam Integer idAction, @RequestParam("file") MultipartFile filen, @RequestParam Boolean isPrimary) throws IOException {
        String file = filen.getOriginalFilename();

        if (!(file.endsWith(".jpg") || file.endsWith(".png") || file.endsWith(".jpeg")))
            return ResponseEntity.ok("invalidFileError");

        String folderPath = UPLOAD_FOLDER + "/images/actions/" + idAction + "/";
        Path dirPath = Paths.get(folderPath);
        Files.createDirectories(dirPath);

        Path filePath = dirPath.resolve(file);

        if (!Files.exists(filePath))
            Files.copy(filen.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

        if (isPrimary == true){
            Action a = actionRepository.findByidAction(idAction);
            a.setPrimaryImage(UPLOAD_LINK+"/images/actions/"+idAction+"/"+file);
            actionRepository.save(a);
        }

        return ResponseEntity.ok("success");
    }

    @PostMapping("/uploaduserimage")
    public ResponseEntity<?> uploadUserImage(@RequestParam Integer idUser, @RequestParam("file") MultipartFile filen) throws IOException {
        String file = filen.getOriginalFilename();
        if (!(file.endsWith(".jpg") || file.endsWith(".png") || file.endsWith(".jpeg")))
            return ResponseEntity.ok("invalidFileError");

        String folderPath = UPLOAD_FOLDER + "/images/users/" + idUser + "/";
        Path dirPath = Paths.get(folderPath);
        Files.createDirectories(dirPath);

        Path filePath = dirPath.resolve(file);

        if (!Files.exists(filePath))
            Files.copy(filen.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

        Files.copy(filen.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

        return ResponseEntity.ok(UPLOAD_LINK+"/images/users/"+idUser+"/"+file);
    }

    @GetMapping("/getactionimages")
    public ResponseEntity<?> GetActionImages(@RequestParam Integer idAction) throws IOException {
        Path path = Paths.get(UPLOAD_FOLDER + "/images/actions/" + idAction + "/");
        if (!Files.exists(path))
            return ResponseEntity.ok("noActionError");

        Stream<Path> files = Files.list(path);
        List<String> urls = files.filter(Files::isRegularFile).map(p -> UPLOAD_LINK + "/images/actions/" + idAction + "/" + p.getFileName().toString()).toList();

        return ResponseEntity.ok(urls);
    }

    @GetMapping("/getprimaryimage")
    public ResponseEntity<?> GetPrimaryImage(@RequestParam Integer idAction) {
        return ResponseEntity.ok(actionRepository.findByidAction(idAction).getPrimaryImage());
    }
}