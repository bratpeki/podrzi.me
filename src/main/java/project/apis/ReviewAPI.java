package project.apis;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import project.classes.Review;
import project.dtos.ReviewDTO;
import project.repositories.ReviewRepository;
import project.utilities.JWT;

import java.util.Map;

@RestController
@RequestMapping("/api/reviews")
public class ReviewAPI {
    private final ReviewRepository reviewRepository;
    private final JWT jwt;

    public ReviewAPI(ReviewRepository reviewRepository, JWT jwt) {
        this.reviewRepository = reviewRepository;
        this.jwt = jwt;
    }

    @PostMapping("/addreview")
    public ResponseEntity<?> addReview(@RequestHeader Map<String, String> token, @RequestBody ReviewDTO rev) {
        if (rev.getStars() == null || rev.getStars() == 0 || rev.getText() == null || rev.getText().isBlank())
            return ResponseEntity.ok("invalidDataError");

        if (reviewRepository.findByidUser(jwt.extractId(token.get("token"))) == null) {
            Review review = new Review();
            review.setText(rev.getText());
            review.setStars(rev.getStars());
            review.setIdUser(jwt.extractId(token.get("token")));

            reviewRepository.save(review);
            return ResponseEntity.ok("success");
        }
        else
            return ResponseEntity.ok("reviewExistsError");
    }

    @GetMapping("/getall")
    public ResponseEntity<?> getAllReviews() {
        return ResponseEntity.ok(reviewRepository.findAll());
    }
}
