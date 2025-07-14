package project.apis;

import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.nio.file.*;

@RestController
@RequestMapping("/uploads")
public class ServeAPI {

    @GetMapping("/images/actions/{id}/{filename}")
    public ResponseEntity<?> ServeAction(@PathVariable String id, @PathVariable String filename) throws IOException {
        Path file = Paths.get("/home/root1/podrzi.me/uploads/images/actions/", id, filename);
        Resource resource = new UrlResource(file.toUri());

        String contentType = Files.probeContentType(file);
        if (contentType == null) {
            contentType = "application/octet-stream";
        }

        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(contentType))
                .body(resource);
    }

    @GetMapping("/images/users/{id}/{filename}")
    public ResponseEntity<?> ServeUser(@PathVariable String id, @PathVariable String filename) throws IOException {
        Path file = Paths.get("/home/root1/podrzi.me/uploads/images/users/", id, filename);
        Resource resource = new UrlResource(file.toUri());

        String contentType = Files.probeContentType(file);
        if (contentType == null) {
            contentType = "application/octet-stream";
        }

        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(contentType))
                .body(resource);
    }
}
