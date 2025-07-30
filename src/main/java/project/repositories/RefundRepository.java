package project.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import project.classes.Refund;

import java.util.List;

public interface RefundRepository extends JpaRepository<Refund, Integer> {
    Refund findBydonation_idDonation(Integer idDonation);
    List<Refund> findByrequestedRefund(Boolean reqRef);
}
