package podrzime.classes;

import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
public class Report {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer idReport;
    private Integer reportType; // 0 - user, 1 - action, 2 - comment
    @Column(name = "`text`", length = 500)
    private String text;
    private LocalDateTime created = LocalDateTime.now();
    private Integer idUserReported;
    private Integer idActionReported;
    private Integer idCommentReported;
    @ManyToOne
    @JoinColumn(name = "idUserCreated")
    private User userReportee;
    @ManyToOne
    @JoinColumn(name = "handledBy")
    private Admin admin;

    public Integer getIdReport() {
        return idReport;
    }
    public void setIdReport(Integer idReport) {
        this.idReport = idReport;
    }
    public Integer getReportType() {
        return reportType;
    }
    public void setReportType(Integer reportType) {
        this.reportType = reportType;
    }
    public String getText() {
        return text;
    }
    public void setText(String text) {
        this.text = text;
    }
    public LocalDateTime getCreated() {
        return created;
    }
    public void setCreated(LocalDateTime created) {
        this.created = created;
    }
    public Integer getIdUserReported() {
        return idUserReported;
    }
    public void setIdUserReported(Integer idUserReported) {
        this.idUserReported = idUserReported;
    }
    public Integer getIdActionReported() {
        return idActionReported;
    }
    public void setIdActionReported(Integer idActionReported) {
        this.idActionReported = idActionReported;
    }
    public Integer getIdCommentReported() {
        return idCommentReported;
    }
    public void setIdCommentReported(Integer idCommentReported) {
        this.idCommentReported = idCommentReported;
    }
    public User getUserReportee() {
        return userReportee;
    }
    public void setUserReportee(User userReportee) {
        this.userReportee = userReportee;
    }
    public Admin getAdmin() {
        return admin;
    }
    public void setAdmin(Admin admin) {
        this.admin = admin;
    }
}
