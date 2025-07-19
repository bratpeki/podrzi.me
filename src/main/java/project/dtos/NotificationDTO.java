package project.dtos;

import jakarta.persistence.*;
import project.classes.User;

import java.time.LocalDateTime;

public class NotificationDTO {
    private Integer idUser;
    private Integer idNotification;
    private Integer idAction;
    private String text;
    private Integer type; // 0 - collab, 1 - alert (kraj akcije itd...
    private String name = "";
    private String primaryImage = "";

    public NotificationDTO(Integer idAction, String text, Integer type, String name, String primaryImage, Integer idNotification, Integer idUser) {
        this.idAction = idAction;
        this.text = text;
        this.type = type;
        this.name = name;
        this.primaryImage = primaryImage;
        this.idNotification = idNotification;
        this.idUser = idUser;
    }

    public Integer getIdUser() {
        return idUser;
    }
    public void setIdUser(Integer idUser) {
        this.idUser = idUser;
    }
    public Integer getIdNotification() {
        return idNotification;
    }
    public void setIdNotification(Integer idNotification) {
        this.idNotification = idNotification;
    }
    public String getName() {
        return name;
    }
    public void setName(String name) {
        this.name = name;
    }
    public String getPrimaryImage() {
        return primaryImage;
    }
    public void setPrimaryImage(String primaryImage) {
        this.primaryImage = primaryImage;
    }
    public Integer getIdAction() {
        return idAction;
    }
    public void setIdAction(Integer idUser) {
        this.idAction = idAction;
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
