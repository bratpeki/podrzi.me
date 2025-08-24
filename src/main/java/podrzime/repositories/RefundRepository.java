package podrzime.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import podrzime.classes.Refund;

import java.util.List;

public interface RefundRepository extends JpaRepository<Refund, Integer> {
    Refund findBydonation_idDonation(Integer idDonation);
    Refund findByidRefund(Integer idRefund);

    @Query("""
    SELECT r.idRefund, r.reason, r.requestedRefund, r.accepted,
           d.amount, d.user.displayName, d.action.name
    FROM Refund r
    LEFT JOIN r.donation d
    WHERE r.requestedRefund = true
""")
    List<Object[]> findByrequestedRefund();
}
