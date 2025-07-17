package project.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import project.classes.Comment;

public interface CommentRepository extends JpaRepository<Comment, Integer> {
    Comment findByidComment(Integer idComment);
}
