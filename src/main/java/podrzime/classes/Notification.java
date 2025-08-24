package podrzime.classes;

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

    @ManyToOne
    @JoinColumn(name ="idActionSender")
    private Action action;
    @Column(name = "idActionSender", insertable = false, updatable = false)
    private Integer idAction;

    @ManyToOne
    @JoinColumn(name = "idUserSender")
    private User userSender;

    public Integer getIdAction() {
        return idAction;
    }
    public void setIdAction(Integer idAction) {
        this.idAction = idAction;
    }
    public User getUserSender() {
        return userSender;
    }
    public void setUserSender(User userSender) {
        this.userSender = userSender;
    }
    public Action getAction() {
        return action;
    }
    public void setAction(Action action) {
        this.action = action;
    }
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
