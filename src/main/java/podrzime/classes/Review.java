package podrzime.classes;

import jakarta.persistence.*;

@Entity
public class Review {
    @Id
    private Integer idUser;
    private Integer stars;
    @Column(name = "text", length = 500)
    private String text;

    public Integer getIdUser() {
        return idUser;
    }
    public void setIdUser(Integer idUser) {
        this.idUser = idUser;
    }
    public Integer getStars() {
        return stars;
    }
    public void setStars(Integer stars) {
        this.stars = stars;
    }
    public String getText() {
        return text;
    }
    public void setText(String text) {
        this.text = text;
    }
}
