package podrzime.dtos;

import java.time.LocalDateTime;

public class CommentDTO {
    private Integer idComment;
    private String text;
    private Integer idAction;
    private LocalDateTime created;
    private Integer idUser;
    private String displayName;
    private String imagePath;
    private Boolean edited;

    public CommentDTO(String text, Integer idAction, LocalDateTime created, Integer idUser, String displayName, String imagePath, Integer idComment, Boolean edited) {
        this.text = text;
        this.idAction = idAction;
        this.created = created;
        this.idUser = idUser;
        this.displayName = displayName;
        this.imagePath = imagePath;
        this.idComment = idComment;
        this.edited = edited;
    }

    public Boolean getEdited() {
        return edited;
    }
    public void setEdited(Boolean edited) {
        this.edited = edited;
    }
    public Integer getIdComment() {
        return idComment;
    }
    public void setIdComment(Integer idComment) {
        this.idComment = idComment;
    }
    public String getText() {
        return text;
    }
    public void setText(String text) {
        this.text = text;
    }
    public Integer getIdAction() {
        return idAction;
    }
    public void setIdAction(Integer idAction) {
        this.idAction = idAction;
    }
    public LocalDateTime getCreated() {
        return created;
    }
    public void setCreated(LocalDateTime created) {
        this.created = created;
    }
    public Integer getIdUser() {
        return idUser;
    }
    public void setIdUser(Integer idUser) {
        this.idUser = idUser;
    }
    public String getDisplayName() {
        return displayName;
    }
    public void setDisplayName(String displayName) {
        this.displayName = displayName;
    }
    public String getImagePath() {
        return imagePath;
    }
    public void setImagePath(String imagePath) {
        this.imagePath = imagePath;
    }
}
