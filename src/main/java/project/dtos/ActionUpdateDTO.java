package project.dtos;

import project.classes.Action;

import java.util.List;

public class ActionUpdateDTO {
    private Integer idAction;
    private Float goal;
    private String subtitle;
    private String location;
    private Action.ACategory category;
    private String desc;
    private String primaryImage;
    private List<String> tags;

    public ActionUpdateDTO(Integer idAction, Float goal, String subtitle, String location, Action.ACategory category, String desc, String primaryImage, List<String> tags) {
        this.idAction = idAction;
        this.goal = goal;
        this.subtitle = subtitle;
        this.location = location;
        this.category = category;
        this.desc = desc;
        this.primaryImage = primaryImage;
        this.tags = tags;
    }

    public Integer getIdAction() {
        return idAction;
    }
    public void setIdAction(Integer idAction) {
        this.idAction = idAction;
    }
    public Float getGoal() {
        return goal;
    }
    public void setGoal(Float goal) {
        this.goal = goal;
    }
    public String getSubtitle() {
        return subtitle;
    }
    public void setSubtitle(String subtitle) {
        this.subtitle = subtitle;
    }
    public String getLocation() {
        return location;
    }
    public void setLocation(String location) {
        this.location = location;
    }
    public Action.ACategory getCategory() {
        return category;
    }
    public void setCategory(Action.ACategory category) {
        this.category = category;
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
    public List<String> getTags() {
        return tags;
    }
    public void setTags(List<String> tags) {
        this.tags = tags;
    }
}
