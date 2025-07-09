package project;

import jakarta.persistence.*;

@Entity
public class Action {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer idAction;

    private Float goal;
    private Float collected;
    private String name;
    @Column(name = "`desc`", length = 10000)
    private String desc;
    private Boolean visible;

    public String GetName() {
        return name;
    }
    public Float GetMissing() {
        return ((float)(Math.round((goal-collected)*100))/100);
    }
    public Boolean GetVisible() {
        return visible;
    }
}
