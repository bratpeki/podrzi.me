package project.dtos;

public class ReportDTO {
    private Integer reportType; // 0 - user, 1 - action, 2 - comment
    private Integer idReported;
    private String text;

    public ReportDTO(Integer reportType, Integer idReported, String text) {
        this.reportType = reportType;
        this.idReported = idReported;
        this.text = text;
    }

    public Integer getReportType() {
        return reportType;
    }
    public void setReportType(Integer reportType) {
        this.reportType = reportType;
    }
    public Integer getIdReported() {
        return idReported;
    }
    public void setIdReported(Integer idReported) {
        this.idReported = idReported;
    }
    public String getText() {
        return text;
    }
    public void setText(String text) {
        this.text = text;
    }
}
