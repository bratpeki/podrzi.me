package project.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import project.classes.Review;

public interface ReviewRepository extends JpaRepository<Review, Integer> {
    Review findByidUser(int idUser);
}
