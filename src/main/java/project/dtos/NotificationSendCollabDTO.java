package project.dtos;

public class NotificationSendCollabDTO {
    private Integer idSender;
    private Integer idAction;
    private Integer idUser;
    private Integer type; // 0 - collab, 1 - alert (kraj akcije itd...

    public NotificationSendCollabDTO(Integer idSender, Integer idAction, Integer idUser, Integer type) {
        this.idSender = idSender;
        this.idAction = idAction;
        this.idUser = idUser;
        this.type = type;
    }
    public Integer getIdSender() {
        return idSender;
    }
    public void setIdSender(Integer idSender) {
        this.idSender = idSender;
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
    public Integer getType() {
        return type;
    }
    public void setType(Integer type) {
        this.type = type;
    }
}
