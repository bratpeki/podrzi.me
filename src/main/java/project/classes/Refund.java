package project.classes;

import jakarta.persistence.*;

@Entity
public class Refund {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer idRefund;
    private String reason;
    @ManyToOne
    @JoinColumn(name = "idDonation")
    private Donation donation;
    private Boolean requestedRefund;

    public Boolean getRequestedRefund() {
        return requestedRefund;
    }
    public void setRequestedRefund(Boolean requestedRefund) {
        this.requestedRefund = requestedRefund;
    }
    public Integer getIdRefund() {
        return idRefund;
    }
    public void setIdRefund(Integer idRefund) {
        this.idRefund = idRefund;
    }
    public String getReason() {
        return reason;
    }
    public void setReason(String reason) {
        this.reason = reason;
    }
    public Donation getDonation() {
        return donation;
    }
    public void setDonation(Donation donation) {
        this.donation = donation;
    }
}