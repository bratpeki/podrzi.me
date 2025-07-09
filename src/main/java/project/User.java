package project;

import jakarta.persistence.*;

@Entity
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer idUser;
    private String username;
    private String password;
    private String displayname;
    private String desc;

    public String GetUsername() {
        return username;
    }

    public String GetDisplayname() {
        return displayname;
    }

    public Integer GetIdUser() {
        return idUser;
    }

}
