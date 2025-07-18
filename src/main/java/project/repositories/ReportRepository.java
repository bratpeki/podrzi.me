package project.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import project.classes.Report;

public interface ReportRepository extends JpaRepository<Report, Integer> {

}
