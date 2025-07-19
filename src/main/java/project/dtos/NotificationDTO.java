package project.dtos;

public class NotificationDTO {
    private Integer idSender;
    private Integer idNotification;
    private Integer idAction;
    private Integer idUser;
    private String text;
    private Integer type; // 0 - collab, 1 - alert (kraj akcije itd...
    private String name = "";
    private String primaryImage = "";
    private String displayName;
    private Boolean seen;

    public NotificationDTO(Integer idAction, String text, Integer type, String name, String primaryImage, Integer idNotification, Integer idSender, String displayName,  Boolean seen, Integer idUser) {
        this.idAction = idAction;
        this.text = text;
        this.type = type;
        this.name = name;
        this.primaryImage = primaryImage;
        this.idNotification = idNotification;
        this.idSender = idSender;
        this.displayName = displayName;
        this.seen = seen;
        this.idUser = idUser;
    }

    public Integer getIdUser() {
        return idUser;
    }
    public void setIdUser(Integer idUser) {
        this.idUser = idUser;
    }
    public Boolean getSeen() {
        return seen;
    }
    public void setSeen(Boolean seen) {
        this.seen = seen;
    }
    public String getDisplayName() {
        return displayName;
    }
    public void setDisplayName(String displayName) {
        this.displayName = displayName;
    }
    public Integer getIdSender() {
        return idSender;
    }
    public void setIdSender(Integer idSender) {
        this.idSender = idSender;
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
