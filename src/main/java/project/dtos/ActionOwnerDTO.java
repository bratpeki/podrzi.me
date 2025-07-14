package project.dtos;

public class ActionOwnerDTO {
    private Integer idUser;
    private Boolean isCollab;

    public ActionOwnerDTO(Integer idUser, Boolean iscollab) {
        this.idUser = idUser;
        this.isCollab = iscollab;
    }

    public Integer getIdUser() {
        return idUser;
    }
    public void setIdUser(Integer idUser) {
        this.idUser = idUser;
    }
    public Boolean getIsCollab() {
        return isCollab;
    }
    public void setIsCollab(Boolean isCollab) {
        this.isCollab = isCollab;
    }
}