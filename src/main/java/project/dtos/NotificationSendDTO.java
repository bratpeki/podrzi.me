package project.dtos;

public class NotificationSendDTO {
    private Integer idAction;
    private String text;

    public NotificationSendDTO(Integer idAction, String text) {
        this.idAction = idAction;
        this.text = text;
    }

    public Integer getIdAction() {
        return idAction;
    }
    public void setIdAction(Integer idAction) {
        this.idAction = idAction;
    }
    public String getText() {
        return text;
    }
    public void setText(String text) {
        this.text = text;
    }
}
