package project.classes;

import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
public class Notification {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer idNotification;
    @ManyToOne
    @JoinColumn(name = "idUserReceiver")
    private User user;
    private String text;
    private LocalDateTime created = LocalDateTime.now();
    @Column(columnDefinition ="TINYINT")
    private Boolean seen = false;
    private Integer type; // 0 - collab, 1 - alert (kraj akcije itd...

    public Integer getIdNotification() {
        return idNotification;
    }
    public void setIdNotification(Integer idNotification) {
        this.idNotification = idNotification;
    }
    public User getUser() {
        return user;
    }
    public void setUser(User user) {
        this.user = user;
    }
    public String getText() {
        return text;
    }
    public void setText(String text) {
        this.text = text;
    }
    public LocalDateTime getCreated() {
        return created;
    }
    public void setCreated(LocalDateTime created) {
        this.created = created;
    }
    public Boolean getSeen() {
        return seen;
    }
    public void setSeen(Boolean seen) {
        this.seen = seen;
    }
    public Integer getType() {
        return type;
    }
    public void setType(Integer type) {
        this.type = type;
    }
}
