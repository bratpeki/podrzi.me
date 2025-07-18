package project.dtos;

public class RefundDTO {
    private String reason;
    private Integer idDonation;

    public RefundDTO(Integer idDonation, String reason) {
        this.idDonation = idDonation;
        this.reason = reason;
    }

    public String getReason() {
        return reason;
    }
    public void setReason(String reason) {
        this.reason = reason;
    }
    public Integer getIdDonation() {
        return idDonation;
    }
    public void setIdDonation(Integer idDonation) {
        this.idDonation = idDonation;
    }
}
