package project.dtos;

import java.util.List;
import project.classes.Comment;

public class ActionDTO {
    private Integer idAction;
    private String name;
    private Float goal;
    private Float collected = 0f;
    private String desc;
    private String primaryImage = "";
    private List<ActionOwnerDTO> actionOwners;
    private List<CommentDTO> comments;

    public ActionDTO(String name, Float goal, Float collected, String desc, String primaryimage, Integer idAction, List<ActionOwnerDTO> actionOwners, List<CommentDTO> comments) {
        this.idAction = idAction;
        this.name = name;
        this.goal = goal;
        this.collected = collected;
        this.desc = desc;
        this.primaryImage = primaryimage;
        this.actionOwners = actionOwners;
        this.comments = comments;
    }

    public List<ActionOwnerDTO> getActionOwners() {
        return actionOwners;
    }
    public void setActionOwners(List<ActionOwnerDTO> actionOwners) {
        this.actionOwners = actionOwners;
    }
    public Integer getIdAction() {
        return idAction;
    }
    public void setIdAction(Integer idAction) {
        this.idAction = idAction;
    }
    public String getName() {
        return name;
    }
    public void setName(String name) {
        this.name = name;
    }
    public Float getGoal() {
        return goal;
    }
    public void setGoal(Float goal) {
        this.goal = goal;
    }
    public Float getCollected() {
        return collected;
    }
    public void setCollected(Float collected) {
        this.collected = collected;
    }
    public String getDesc() {
        return desc;
    }
    public void setDesc(String desc) {
        this.desc = desc;
    }
    public String getPrimaryImage() {
        return primaryImage;
    }
    public void setPrimaryImage(String primaryImage) {
        this.primaryImage = primaryImage;
    }
    public List<CommentDTO> getComments() {
        return comments;
    }
    public void setComments(List<CommentDTO> comments) {
        this.comments = comments;
    }
}
