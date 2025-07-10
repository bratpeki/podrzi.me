package project.donation;

import java.time.LocalDateTime;

public class DonationDTO {
    private Integer idDonation;
    private Integer idAction;
    private String actionName;
    private String userDisplayName;
    private Float amount;
    private LocalDateTime donationTime;

    public DonationDTO(Integer idDonation, Integer idAction, String actionName, String userDisplayName, Float amount, LocalDateTime donationTime) {
        this.idDonation = idDonation;
        this.idAction = idAction;
        this.actionName = actionName;
        this.userDisplayName = userDisplayName;
        this.amount = amount;
        this.donationTime = donationTime;
    }

    public Integer getIdDonation() {
        return idDonation;
    }

    public void setIdDonation(Integer idDonation) {
        this.idDonation = idDonation;
    }

    public Integer getIdAction() {
        return idAction;
    }

    public void setIdAction(Integer idAction) {
        this.idAction = idAction;
    }

    public String getActionName() {
        return actionName;
    }

    public void setActionName(String actionName) {
        this.actionName = actionName;
    }

    public String getUserDisplayName() {
        return userDisplayName;
    }

    public void setUserDisplayName(String userDisplayName) {
        this.userDisplayName = userDisplayName;
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
}
