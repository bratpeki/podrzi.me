package project.dtos;

import jakarta.persistence.Column;

public class UserProfileDTO {
    private Integer idUser;
    private String password;
    private String email;
    private String displayName;
    @Column(name = "`desc`", length = 2000)
    private String desc;
    private String imagePath;
    private String username;
    private String oldPassword = "";

    public UserProfileDTO(String password, String email, String displayName, String desc, String imagepath,  String username, String oldpassword, Integer idUser) {
        this.password = password;
        this.email = email;
        this.displayName = displayName;
        this.desc = desc;
        this.imagePath = imagepath;
        this.username = username;
        this.oldPassword = oldpassword;
        this.idUser = idUser;
    }

    public Integer getIdUser() {
        return idUser;
    }
    public void setIdUser(Integer idUser) {
        this.idUser = idUser;
    }
    public String getOldPassword() {
        return oldPassword;
    }
    public void setOldPassword(String oldPassword) {
        this.oldPassword = oldPassword;
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
    public String getDisplayName() {
        return displayName;
    }
    public void setDisplayName(String displayName) {
        this.displayName = displayName;
    }
    public String getDesc() {
        return desc;
    }
    public void setDesc(String desc) {
        this.desc = desc;
    }
    public String getImagePath() {
        return imagePath;
    }
    public void setImagePath(String imagePath) {
        this.imagePath = imagePath;
    }
    public String getUsername() {
        return username;
    }
    public void setUsername(String username) {
        this.username = username;
    }
}
