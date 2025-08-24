package podrzime.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import podrzime.classes.Review;

public interface ReviewRepository extends JpaRepository<Review, Integer> {
    Review findByidUser(int idUser);
}
