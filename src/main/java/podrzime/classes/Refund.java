package podrzime.classes;

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
    @Column(name = "idDonation", insertable = false, updatable = false)
    private Integer idDonation;
    private Boolean requestedRefund;
    private Boolean accepted;
    @OneToOne
    @JoinColumn(name = "handledBy")
    private Admin admin;


    public Admin getAdmin() {
        return admin;
    }
    public void setAdmin(Admin admin) {
        this.admin = admin;
    }
    public Integer getIdDonation() {
        return idDonation;
    }
    public void setIdDonation(Integer idDonation) {
        this.idDonation = idDonation;
    }
    public Boolean getAccepted() {
        return accepted;
    }
    public void setAccepted(Boolean accepted) {
        this.accepted = accepted;
    }
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