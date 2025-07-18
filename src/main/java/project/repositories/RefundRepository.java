package project.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import project.classes.Refund;

public interface RefundRepository extends JpaRepository<Refund, Integer> {
    Refund findBydonation_idDonation(Integer idDonation);
}
