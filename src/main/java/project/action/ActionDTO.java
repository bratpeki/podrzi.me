package project.action;

public class ActionDTO {
    private String name;
    private Float goal;
    private Float collected;
    private String desc;
    private String imagepath;

    public ActionDTO(String name, Float goal, Float collected, String desc, String imagepath) {
        this.name = name;
        this.goal = goal;
        this.collected = collected;
        this.desc = desc;
        this.imagepath = imagepath;
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
    public String getImagepath() {
        return imagepath;
    }
    public void setImagepath(String imagepath) {
        this.imagepath = imagepath;
    }
}
