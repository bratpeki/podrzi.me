package podrzime.dtos;

public class ActionOwnerDTO {
    private Integer idUser;
    private String displayName;
    private Boolean isCollab;
    private String imagePath;

    public ActionOwnerDTO(Integer idUser, Boolean isCollab, String displayName, String imagePath) {
        this.idUser = idUser;
        this.isCollab = isCollab;
        this.displayName = displayName;
        this.imagePath = imagePath;
    }

    public String getImagePath() {
        return imagePath;
    }
    public void setImagePath(String imagePath) {
        this.imagePath = imagePath;
    }
    public String getDisplayName() {
        return displayName;
    }
    public void setDisplayName(String displayName) {
        this.displayName = displayName;
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