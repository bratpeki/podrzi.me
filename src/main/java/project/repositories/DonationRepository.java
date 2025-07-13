package project.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import project.classes.Donation;

import java.util.List;

public interface DonationRepository extends JpaRepository<Donation, Integer> {
    Donation findByidDonation(Integer idDonation);
    List<Donation> findByUser_idUser(Integer idUser);
}
