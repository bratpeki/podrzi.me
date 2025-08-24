package podrzime.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import podrzime.classes.Report;

public interface ReportRepository extends JpaRepository<Report, Integer> {
    Report findByidReport(Integer idReport);
}
