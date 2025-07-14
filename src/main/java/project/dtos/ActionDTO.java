package project.dtos;

public class ActionDTO {
    private Integer idAction;
    private String name;
    private Float goal;
    private Float collected = 0f;
    private String desc;
    private String primaryimage = "";

    public ActionDTO(String name, Float goal, Float collected, String desc, String imagepath, Integer idAction) {
        this.idAction = idAction;
        this.name = name;
        this.goal = goal;
        this.collected = collected;
        this.desc = desc;
        this.primaryimage = imagepath;
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
    public String getPrimaryimage() {
        return primaryimage;
    }
    public void setPrimaryimage(String primaryimage) {
        this.primaryimage = primaryimage;
    }
}
