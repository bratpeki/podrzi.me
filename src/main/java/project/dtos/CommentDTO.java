package project.dtos;

public class CommentDTO {
    private String text;
    private Integer idAction;

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
}
