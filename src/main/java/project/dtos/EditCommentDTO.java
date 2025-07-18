package project.dtos;

public class EditCommentDTO {
    private String text;
    private Integer idComment;

    public EditCommentDTO(String text, Integer idComment) {
        this.text = text;
        this.idComment = idComment;
    }

    public String getText() {
        return text;
    }
    public void setText(String text) {
        this.text = text;
    }
    public Integer getIdComment() {
        return idComment;
    }
    public void setIdComment(Integer idComment) {
        this.idComment = idComment;
    }
}
