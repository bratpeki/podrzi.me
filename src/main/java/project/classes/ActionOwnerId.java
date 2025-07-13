package project.classes;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;

import java.io.Serializable;
import java.util.Objects;

@Embeddable
public class ActionOwnerId implements Serializable {
    @Column(insertable = false, updatable = false)
    private Integer idAction;
    @Column(insertable = false, updatable = false)
    private Integer idUser;

    public ActionOwnerId() {
    }
    public ActionOwnerId(Integer idAction, Integer idUser) {
        this.idAction = idAction;
        this.idUser = idUser;
    }

    public Integer getIdAction() {
        return idAction;
    }
    public void setIdAction(Integer idAction) {
        this.idAction = idAction;
    }
    public Integer getIdUser() {
        return idUser;
    }
    public void setIdUser(Integer idUser) {
        this.idUser = idUser;
    }
    @Override
    public boolean equals(Object o) {
        if (!(o instanceof ActionOwnerId that)) return false;
        return Objects.equals(idAction, that.idAction) && Objects.equals(idUser, that.idUser);
    }
    @Override
    public int hashCode() {
        return Objects.hash(idAction, idUser);
    }
}
