package podrzime.classes;

import jakarta.persistence.*;

@Entity
public class ActionOwner {
    @EmbeddedId
    private ActionOwnerId idAO = new ActionOwnerId();

    @ManyToOne
    @MapsId("idUser")
    @JoinColumn(name = "idUser")
    private User user;
    @Column(name = "idUser", insertable = false, updatable = false)
    private Integer idUser;

    @ManyToOne
    @MapsId("idAction")
    @JoinColumn(name = "idAction")
    private Action action;
    @Column(name = "idAction", insertable = false, updatable = false)
    private Integer idAction;

    @Column(columnDefinition ="TINYINT")
    private Boolean isCollab = false;

    public Integer getIdUser() {
        return idUser;
    }

    public void setIdUser(Integer idUser) {
        this.idUser = idUser;
    }

    public Integer getIdAction() {
        return idAction;
    }

    public void setIdAction(Integer idAction) {
        this.idAction = idAction;
    }

    public Boolean getCollab() {
        return isCollab;
    }

    public void setCollab(Boolean collab) {
        isCollab = collab;
    }

    public Boolean getIsCollab() {
        return isCollab;
    }
    public void setIsCollab(Boolean owner) {
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
