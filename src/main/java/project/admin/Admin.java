package project.admin;

import jakarta.persistence.*;

@Entity
public class Admin {
    @Id
    private String username;
    private String password;
    private Boolean owner;

    public String getUsername() {
        return username;
    }
    public void setUsername(String username) {
        this.username = username;
    }
    public String getPassword() {
        return password;
    }
    public void setPassword(String password) {
        this.password = password;
    }
    public Boolean getOwner() {
        return owner;
    }
    public void setOwner(Boolean owner) {
        this.owner = owner;
    }
}
