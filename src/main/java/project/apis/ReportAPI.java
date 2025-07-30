package project.apis;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import project.classes.*;
import project.repositories.*;
import project.dtos.*;
import project.utilities.*;

import java.time.LocalDateTime;
import java.util.Map;

@RestController
@RequestMapping("/api/reports")
public class ReportAPI {

    private final ReportRepository reportRepository;
    private final JWT jwt;
    private final UserRepository userRepository;
    private final AdminRepository adminRepository;

    public ReportAPI(UserRepository userRepository, ReportRepository reportRepository, JWT jwt, AdminRepository adminRepository) {
        this.userRepository = userRepository;
        this.jwt = jwt;
        this.reportRepository = reportRepository;
        this.adminRepository = adminRepository;
    }

    @GetMapping("/getallunhandled")
    public ResponseEntity<?> getAllUnhandledReports() {
        return ResponseEntity.ok(reportRepository.findAll().stream().filter(a->a.getAdmin() == null));
    }

    @PostMapping("/handle")
    public ResponseEntity<?> handleReport(@RequestHeader Map<String, String> token, @RequestParam Integer idReport) {
        Report r = reportRepository.findByidReport(idReport);
        r.setAdmin(adminRepository.findByusername(jwt.extractUsername(token.get(token))));

        return ResponseEntity.ok("success");
    }

    @PostMapping("/create")
    public ResponseEntity<?> createReport(@RequestHeader Map<String, String> token, @RequestBody ReportDTO rdto) {
        User u = userRepository.findByidUser(jwt.extractId(token.get("token")));
        Report rep = new Report();

        rep.setCreated(LocalDateTime.now());
        rep.setReportType(rdto.getReportType());
        rep.setText(rdto.getText());
        rep.setUserReportee(u);
        rep.setReportType(rdto.getReportType());
        switch (rdto.getReportType()) {
            case 0:
                rep.setIdUserReported(rdto.getIdReported());
                break;
            case 1:
                rep.setIdActionReported(rdto.getIdReported());
                break;
            case 2:
                rep.setIdCommentReported(rdto.getIdReported());
                break;
            default:
                return ResponseEntity.ok("invalidReportTypeError");
        }

        reportRepository.save(rep);
        return ResponseEntity.ok("success");
    }
}
