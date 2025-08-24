package podrzime.classes;

import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
public class Comment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer idComment;
    private String text;
    private LocalDateTime created = LocalDateTime.now();
    @ManyToOne
    @JoinColumn(name = "idUser")
    private User user;
    @ManyToOne
    @JoinColumn(name = "idAction")
    private Action action;
    @Column(name = "idAction", insertable = false, updatable = false)
    private Integer idAction;
    private Boolean edited;

    public Boolean getEdited() {
        return edited;
    }
    public void setEdited(Boolean edited) {
        this.edited = edited;
    }
    public Integer getIdAction() {
        return idAction;
    }
    public void setIdAction(Integer idAction) {
        this.idAction = idAction;
    }
    public Integer getIdComment() { return idComment; }
    public void setIdComment(Integer idComment) { this.idComment = idComment; }
    public String getText() { return text; }
    public void setText(String text) { this.text = text; }
    public LocalDateTime getCreated() { return created; }
    public void setCreated(LocalDateTime created) { this.created = created; }
    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }
    public Action getAction() { return action; }
    public void setAction(Action action) { this.action = action; }
}
