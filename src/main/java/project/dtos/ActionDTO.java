package project.dtos;

import project.classes.Action;

import java.time.LocalDateTime;
import java.util.List;

public class ActionDTO {
    private Integer idAction;
    private String name;
    private Float goal;
    private Float collected;
    private String desc;
    private String primaryImage;
    private List<ActionOwnerDTO> actionOwners;
    private List<CommentDTO> comments;
    private LocalDateTime endTime;
    private List<String> tags;
    private Action.ACategory category;
    private String subtitle;
    private String location;

    public ActionDTO(String name, Float goal, Float collected, String desc, String primaryimage, Integer idAction, List<ActionOwnerDTO> actionOwners,
                     List<CommentDTO> comments, LocalDateTime endtime, List<String> tags, Action.ACategory category, String subtitle, String location) {
        this.idAction = idAction;
        this.name = name;
        this.goal = goal;
        this.collected = collected;
        this.desc = desc;
        this.primaryImage = primaryimage;
        this.actionOwners = actionOwners;
        this.comments = comments;
        this.endTime = endtime;
        this.tags = tags;
        this.category = category;
        this.subtitle = subtitle;
        this.location = location;
    }

    public String getLocation() {
        return location;
    }
    public void setLocation(String location) {
        this.location = location;
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
    public LocalDateTime getEndTime() {
        return endTime;
    }
    public void setEndTime(LocalDateTime endTime) {
        this.endTime = endTime;
    }
    public List<String> getTags() {
        return tags;
    }
    public void setTags(List<String> tags) {
        this.tags = tags;
    }
    public Action.ACategory getCategory() {
        return category;
    }
    public void setCategory(Action.ACategory category) {
        this.category = category;
    }
    public String getSubtitle() {
        return subtitle;
    }
    public void setSubtitle(String subtitle) {
        this.subtitle = subtitle;
    }
}
