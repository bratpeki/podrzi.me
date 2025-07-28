package project.apis;

import project.utilities.LimitedInputStream;
import org.springframework.core.io.InputStreamResource;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.nio.file.*;

@RestController
@RequestMapping("/uploads")
public class ServeAPI {

    private static final String UPLOAD_FOLDER;

    static {
        try {
            UPLOAD_FOLDER = new File(".").getCanonicalPath() + "/uploads";
        } catch (IOException ex) {
            throw new RuntimeException(ex);
        }
    }

    @GetMapping("/images/actions/{id}/{filename}")
    public ResponseEntity<?> ServeAction(@PathVariable String id, @PathVariable String filename) throws IOException {
        Path file = Paths.get(UPLOAD_FOLDER+"/images/actions/", id, filename);
        Resource resource = new UrlResource(file.toUri());

        String contentType = Files.probeContentType(file);
        if (contentType == null) {
            contentType = "application/octet-stream";
        }

        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(contentType))
                .body(resource);
    }

    @GetMapping("/videos/actions/{id}/{filename}")
    public ResponseEntity<?> ServeActionVideo(@PathVariable String id, @PathVariable String filename, @RequestHeader(value = "Range", required = false) String rangeHeader) throws IOException {
        Path filePath = Paths.get(UPLOAD_FOLDER + "/videos/actions/", id, filename);
        if (!Files.exists(filePath)) {
            return ResponseEntity.notFound().build();
        }

        long fileLength = Files.size(filePath);
        String contentType = Files.probeContentType(filePath);
        if (contentType == null) {
            contentType = "video/mp4";
        }

        Resource resource = new UrlResource(filePath.toUri());

        if (rangeHeader == null) {
            return ResponseEntity.ok()
                    .contentType(MediaType.parseMediaType(contentType))
                    .contentLength(fileLength)
                    .body(resource);
        }

        long rangeStart = 0;
        long rangeEnd = fileLength - 1;

        String[] ranges = rangeHeader.replace("bytes=", "").split("-");
        try {
            rangeStart = Long.parseLong(ranges[0]);
            if (ranges.length > 1 && !ranges[1].isEmpty()) {
                rangeEnd = Long.parseLong(ranges[1]);
            }
        } catch (NumberFormatException e) {
            return ResponseEntity.status(HttpStatus.REQUESTED_RANGE_NOT_SATISFIABLE).build();
        }

        if (rangeStart > rangeEnd || rangeEnd >= fileLength) {
            return ResponseEntity.status(HttpStatus.REQUESTED_RANGE_NOT_SATISFIABLE).build();
        }

        long contentLength = rangeEnd - rangeStart + 1;

        InputStream inputStream = Files.newInputStream(filePath);
        inputStream.skip(rangeStart);
        InputStreamResource inputStreamResource = new InputStreamResource(new LimitedInputStream(inputStream, contentLength));

        return ResponseEntity.status(HttpStatus.PARTIAL_CONTENT)
                .header("Content-Range", String.format("bytes %d-%d/%d", rangeStart, rangeEnd, fileLength))
                .header("Accept-Ranges", "bytes")
                .contentLength(contentLength)
                .contentType(MediaType.parseMediaType(contentType))
                .body(inputStreamResource);
    }

    @GetMapping("/images/users/{id}/{filename}")
    public ResponseEntity<?> ServeUser(@PathVariable String id, @PathVariable String filename) throws IOException {
        Path file = Paths.get(UPLOAD_FOLDER+"/images/users/", id, filename);
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
