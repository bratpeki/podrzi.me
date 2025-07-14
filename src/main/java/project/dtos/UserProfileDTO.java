package project.dtos;

import jakarta.persistence.Column;

public class UserProfileDTO {
    private Integer idUser;
    private String password;
    private String email;
    private String displayname;
    @Column(name = "`desc`", length = 2000)
    private String desc;
    private String imagepath;
    private String username;
    private String oldpassword = "";

    public UserProfileDTO(String password, String email, String displayname, String desc, String imagepath,  String username, String oldpassword, Integer idUser) {
        this.password = password;
        this.email = email;
        this.displayname = displayname;
        this.desc = desc;
        this.imagepath = imagepath;
        this.username = username;
        this.oldpassword = oldpassword;
        this.idUser = idUser;
    }

    public Integer getIdUser() {
        return idUser;
    }
    public void setIdUser(Integer idUser) {
        this.idUser = idUser;
    }
    public String getOldpassword() {
        return oldpassword;
    }
    public void setOldpassword(String oldpassword) {
        this.oldpassword = oldpassword;
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
    public String getUsername() {
        return username;
    }
    public void setUsername(String username) {
        this.username = username;
    }
}
