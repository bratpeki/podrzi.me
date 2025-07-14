package project.dtos;

public class ActionOwnerDTO {
    private Integer idUser;
    private Integer idAction;
    private Boolean iscollab;

    public ActionOwnerDTO(Integer idUser, Integer idAction, Boolean iscollab) {
        this.idUser = idUser;
        this.idAction = idAction;
        this.iscollab = iscollab;
    }

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
    public Boolean getIscollab() {
        return iscollab;
    }
    public void setIscollab(Boolean iscollab) {
        this.iscollab = iscollab;
    }
}