package project.classes;

import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
public class Donation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer idDonation;

    @ManyToOne
    @JoinColumn(name = "idAction")
    private Action action;
    @Column(name = "idAction", insertable = false, updatable = false)
    private Integer idAction;

    @ManyToOne
    @JoinColumn(name = "idUser")
    private User user;

    private Float amount;
    private LocalDateTime donationTime = LocalDateTime.now();

    private Boolean refunded;

    public Boolean getRefunded() {
        return refunded;
    }
    public void setRefunded(Boolean refunded) {
        this.refunded = refunded;
    }
    public Integer getIdAction() {
        return idAction;
    }
    public void setIdAction(Integer idAction) {
        this.idAction = idAction;
    }
    public Integer getIdDonation() {
        return idDonation;
    }
    public void setIdDonation(Integer idDonation) {
        this.idDonation = idDonation;
    }
    public Float getAmount() {
        return amount;
    }
    public void setAmount(Float amount) {
        this.amount = amount;
    }
    public LocalDateTime getDonationTime() {
        return donationTime;
    }
    public void setDonationTime(LocalDateTime donationTime) {
        this.donationTime = donationTime;
    }
    public User getUser() {
        return user;
    }
    public void setUser(User user) {
        this.user = user;
    }
    public Action getAction() {
        return action;
    }
    public void setAction(Action action) {
        this.action = action;
    }
    public String getNameAmount() {
        return action.getIdAction() + " " + action.getName() + " " + user.getDisplayName() + " " + amount.toString();
    }
}