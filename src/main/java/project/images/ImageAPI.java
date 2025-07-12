package project.images;

import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import project.action.ActionRepository;
import project.user.UserRepository;

import java.io.IOException;
import java.nio.file.*;
import java.util.List;
import java.util.stream.Stream;

@RestController
@RequestMapping("/api/images")
public class ImageAPI {
    private final ActionRepository actionRepository;
    private final UserRepository userRepository;

    public ImageAPI(ActionRepository actionRepository, UserRepository userRepository) {
        this.actionRepository = actionRepository;
        this.userRepository = userRepository;
    }
    private static final String UPLOAD_FOLDER = "/home/root1/podrzi.me/uploads/images";

    @PostMapping("/uploadaction")
    public Boolean UploadActionImage(@RequestParam String idAction, @RequestParam("file") MultipartFile filen) throws IOException {
        String file = filen.getOriginalFilename().toLowerCase();

        if (!file.endsWith(".jpg") || !file.endsWith(".png") || !file.endsWith(".jpeg") && filen.getSize() > 5000000)
            return false;

        String folderPath = UPLOAD_FOLDER + "/actions/" + idAction + "/";
        Path dirPath = Paths.get(folderPath);
        Files.createDirectories(dirPath);

        Path filePath = dirPath.resolve(file);
        Files.copy(filen.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

        return true;
    }

    @PostMapping("/uploaduser")
    public Boolean UploadUserImage(@RequestParam String idUser, @RequestParam("file") MultipartFile filen) throws IOException {
        String file = filen.getOriginalFilename().toLowerCase();

        if (!file.endsWith(".jpg") || !file.endsWith(".png") || !file.endsWith(".jpeg") && filen.getSize() > 5000000)
            return false;

        String folderPath = UPLOAD_FOLDER + "/users/" + idUser + "/";
        Path dirPath = Paths.get(folderPath);
        Files.createDirectories(dirPath);

        Path filePath = dirPath.resolve(file);
        Files.copy(filen.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

        return true;
    }

    @GetMapping("/getuserimage")
    public ResponseEntity<Resource> GetUserImage(@RequestParam Integer idUser) throws IOException {
        Path path = Paths.get(UPLOAD_FOLDER + "/users/" + idUser + "/");
        if (!Files.exists(path))
            return ResponseEntity.notFound().build();

        String file = userRepository.findByidUser(idUser).getImagepath();
        Resource res = new UrlResource(path.toUri());

        String content = Files.probeContentType(path);
        if (content == null)
            content = "application/octet-stream";

        return ResponseEntity.ok().contentType(MediaType.parseMediaType(content)).body(res);
    }

    @GetMapping("/getactionprimary")
    public ResponseEntity<Resource> GetActionPrimary(@RequestParam Integer idAction) throws IOException {
        Path path = Paths.get(UPLOAD_FOLDER + "/actions/" + idAction + "/");
        if (!Files.exists(path))
            return ResponseEntity.notFound().build();

        String file = actionRepository.findByidAction(idAction).getPrimaryimage();
        Resource res = new UrlResource(path.toUri());

        String content = Files.probeContentType(path);
        if (content == null)
            content = "application/octet-stream";

        return ResponseEntity.ok().contentType(MediaType.parseMediaType(content)).body(res);
    }

@   GetMapping("/getactionimages")
    public ResponseEntity<List<String>> GetActionImages(@RequestParam Integer idAction) throws IOException {
        Path path = Paths.get(UPLOAD_FOLDER + "/actions/" + idAction + "/");
        if (!Files.exists(path))
            return ResponseEntity.notFound().build();

        Stream<Path> files = Files.list(path);
        List<String> urls = files.filter(Files::isRegularFile).map(p -> {
            String filename = path.getFileName().toString();
            return "http://localhost:8080/api/uploads/images/actions/"+idAction+"/"+filename;
        }).toList();

        return ResponseEntity.ok(urls);
    }

    @GetMapping("/getactionimage")
    public ResponseEntity<Resource> GetActionImage(@RequestParam String url) throws IOException {
        Path path = Paths.get(url.replace("http://localhost:8080/api", "").toString());
        Resource res = new UrlResource(path.toUri());

        String content = Files.probeContentType(path);
        if (content == null)
            content = "application/octet-stream";

        return ResponseEntity.ok().contentType(MediaType.parseMediaType(content)).body(res);
    }
}