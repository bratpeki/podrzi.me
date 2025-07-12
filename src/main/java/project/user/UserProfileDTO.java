package project.user;

import jakarta.persistence.Column;

public class UserProfileDTO {
    private String password;
    private String email;
    private String displayname;
    @Column(name = "`desc`", length = 2000)
    private String desc;
    private String imagepath;

    public UserProfileDTO(String password, String email, String displayname, String desc, String imagepath) {
        this.password = password;
        this.email = email;
        this.displayname = displayname;
        this.desc = desc;
        this.imagepath = imagepath;
    }

    public String getPassword() {
        return password;
    }
    public void setPassword(String password) {
        this.password = password;
    }
    public String getEmail() {
        return email;
    }
    public void setEmail(String email) {
        this.email = email;
    }
    public String getDisplayname() {
        return displayname;
    }
    public void setDisplayname(String displayname) {
        this.displayname = displayname;
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
