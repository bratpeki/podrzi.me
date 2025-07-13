package project.classes;

import jakarta.persistence.*;

@Entity
public class ActionOwner {
    @EmbeddedId
    private ActionOwnerId idAO;

    @ManyToOne
    @MapsId("idUser")
    @JoinColumn(name = "idUser")
    private User user;

    @ManyToOne
    @MapsId("idAction")
    @JoinColumn(name = "idAction")
    private Action action;

    @Column(columnDefinition ="TINYINT")
    private Boolean isCollab = false;

    public Boolean getOwner() {
        return isCollab;
    }
    public void setOwner(Boolean owner) {
        isCollab = owner;
    }
    public ActionOwnerId getIdAO() {
        return idAO;
    }
    public void setIdAO(ActionOwnerId idAO) {
        this.idAO = idAO;
    }
    public User getUser() {
        return user;
    }
    public void setUser(User user) {
        this.user = user;
    }
    public Action getAction() {
        return action;
    }
    public void setAction(Action action) {
        this.action = action;
    }
}
