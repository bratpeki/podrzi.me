package project;

import jakarta.persistence.*;

@Entity
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer idUser;

    private String username;
    private String password;
    private String displayName;
    @Column(name = "`desc`", length = 2000)
    private String desc;

    public String GetUsername() {
        return username;
    }
    public String GetDisplayName() {
        return displayName;
    }
    public Integer GetIdUser() {
        return idUser;
    }

}
