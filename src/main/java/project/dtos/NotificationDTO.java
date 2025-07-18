package project.dtos;

import jakarta.persistence.*;
import project.classes.User;

import java.time.LocalDateTime;

public class NotificationDTO {
    private Integer idNotification;
    private Integer idUser;
    private String text;
    private Integer type; // 0 - collab, 1 - alert (kraj akcije itd...
    private String displayName = "";
    private String imagePath = "";

    public NotificationDTO(Integer idUser, String text, Integer type, String displayName, String imagePath, Integer idNotification) {
        this.idUser = idUser;
        this.text = text;
        this.type = type;
        this.displayName = displayName;
        this.imagePath = imagePath;
        this.idNotification = idNotification;
    }

    public Integer getIdNotification() {
        return idNotification;
    }
    public void setIdNotification(Integer idNotification) {
        this.idNotification = idNotification;
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
    public Integer getIdUser() {
        return idUser;
    }
    public void setIdUser(Integer idUser) {
        this.idUser = idUser;
    }
    public String getText() {
        return text;
    }
    public void setText(String text) {
        this.text = text;
    }
    public Integer getType() {
        return type;
    }
    public void setType(Integer type) {
        this.type = type;
    }
}
