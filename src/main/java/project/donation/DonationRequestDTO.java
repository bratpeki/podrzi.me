package project.donation;

import java.time.LocalDateTime;

public class DonationRequestDTO {
    private Integer idAction;
    private Integer idUser;
    private Float amount;
    private LocalDateTime donationTime;

    public DonationRequestDTO(LocalDateTime donationTime, Float amount, Integer idUser, Integer idAction) {
        this.donationTime = donationTime;
        this.amount = amount;
        this.idUser = idUser;
        this.idAction = idAction;
    }

    public Integer getIdAction() {
        return idAction;
    }

    public void setIdAction(Integer idAction) {
        this.idAction = idAction;
    }

    public Integer getIdUser() {
        return idUser;
    }

    public void setIdUser(Integer idUser) {
        this.idUser = idUser;
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
