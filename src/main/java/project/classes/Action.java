package project.classes;

import jakarta.persistence.*;

import java.time.LocalDateTime;
import java.util.List;

@Entity
public class Action {
    public enum ACategory {
        Humanitarno,
        Tehnologija,
        Igrica,
        Umjetnost,
        Startup,
        Knjiga,
        Film,
        Video,
        Muzika,
        Hrana,
        Moda
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer idAction;
    private Float goal;
    @Column(columnDefinition = "FLOAT DEFAULT 0")
    private Float collected = 0f;
    private String name;
    @Column(name = "`desc`", length = 10000)
    private String desc;
    @Column(name = "visible", columnDefinition = "TINYINT")
    private Integer visible = 1;
    private String primaryImage;
    private LocalDateTime endTime;
    private List<String> tags;
    private ACategory category;
    private String subtitle;
    private String location;

    public Integer getVisible() {
        return visible;
    }
    public Integer getIdAction() {
        return idAction;
    }
    public void setIdAction(Integer idAction) {
        this.idAction = idAction;
    }
    public void setVisible(Integer visible) {
        this.visible = visible;
    }
    public String getDesc() {
        return desc;
    }
    public void setDesc(String desc) {
        this.desc = desc;
    }
    public String getName() {
        return name;
    }
    public void setName(String name) {
        this.name = name;
    }
    public Float getCollected() {
        return collected;
    }
    public void setCollected(Float collected) {
        this.collected = collected;
    }
    public Float getGoal() {
        return goal;
    }
    public void setGoal(Float goal) {
        this.goal = goal;
    }
    public String getPrimaryImage() {
        return primaryImage;
    }
    public void setPrimaryImage(String primaryImage) {
        this.primaryImage = primaryImage;
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
    public ACategory getCategory() {
        return category;
    }
    public void setCategory(ACategory category) {
        this.category = category;
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
}
