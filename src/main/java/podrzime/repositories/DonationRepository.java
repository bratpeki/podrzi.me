package podrzime.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import podrzime.classes.Donation;

import java.util.List;

public interface DonationRepository extends JpaRepository<Donation, Integer> {
    Donation findByidDonation(Integer idDonation);
    List<Donation> findByUser_idUser(Integer idUser);

    @Query("SELECT DISTINCT d.user.idUser FROM Donation d WHERE d.action.idAction = :idAction")
    List<Integer> findDistinctUserIdsByActionId(@Param("idAction") Integer idAction);
}
