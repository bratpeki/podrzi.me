package podrzime.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import podrzime.classes.Comment;
import java.util.List;

public interface CommentRepository extends JpaRepository<Comment, Integer> {
    Comment findByidComment(Integer idComment);
    List<Comment> findByaction_idAction(Integer idAction);
}
