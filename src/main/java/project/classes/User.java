package project.classes;

import jakarta.persistence.*;

@Entity
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer idUser;
    private String username;
    private String password;
    private String email;
    private String displayname;
    @Column(name = "`desc`", length = 2000)
    private String desc;
    private String imagepath;

    public String getDesc() {
        return desc;
    }
    public void setDesc(String desc) {
        this.desc = desc;
    }
    public String getDisplayname() {
        return displayname;
    }
    public void setDisplayname(String displayname) {
        this.displayname = displayname;
    }
    public String getPassword() {
        return password;
    }
    public void setPassword(String password) {
        this.password = password;
    }
    public String getUsername() {
        return username;
    }
    public void setUsername(String username) {
        this.username = username;
    }
    public String getEmail() {
        return email;
    }
    public void setEmail(String email) {
        this.email = email;
    }
    public String getImagepath() {
        return imagepath;
    }
    public void setImagepath(String imagepath) {
        this.imagepath = imagepath;
    }
    public Integer getIdUser() {
        return idUser;
    }
    public void setIdUser(Integer idUser) {
        this.idUser = idUser;
    }
}
