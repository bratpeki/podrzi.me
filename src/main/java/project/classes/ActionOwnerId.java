package project.classes;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;

@Embeddable
public class ActionOwnerId {
    private Integer idAction;
    private Integer idUser;
    @Column(columnDefinition ="TINYINT")
    private Boolean isOwner;
}
