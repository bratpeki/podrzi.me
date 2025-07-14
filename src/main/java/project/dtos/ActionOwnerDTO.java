package project.dtos;

public class ActionOwnerDTO {
    private Integer idUser;
    private Boolean iscollab;

    public ActionOwnerDTO(Integer idUser, Boolean iscollab) {
        this.idUser = idUser;
        this.iscollab = iscollab;
    }

    public Integer getIdUser() {
        return idUser;
    }
    public void setIdUser(Integer idUser) {
        this.idUser = idUser;
    }
    public Boolean getIscollab() {
        return iscollab;
    }
    public void setIscollab(Boolean iscollab) {
        this.iscollab = iscollab;
    }
}