package project.dtos;

public class ReviewDTO {
    private String text;
    private Integer stars;

    public ReviewDTO(String text, Integer stars) {
        this.text = text;
        this.stars = stars;
    }

    public String getText() {
        return text;
    }
    public void setText(String text) {
        this.text = text;
    }
    public Integer getStars() {
        return stars;
    }
    public void setStars(Integer stars) {
        this.stars = stars;
    }
}
