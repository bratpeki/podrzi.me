package project.donation;

import org.springframework.web.bind.annotation.*;
import project.user.*;

import java.util.List;

@RestController
@RequestMapping("/api/donations")
public class DonationAPI {
    private final DonationRepository donationRepository;

    public DonationAPI (DonationRepository donationRepository) {
        this.donationRepository = donationRepository;
    }

    @GetMapping("/getdonations")
    public List<String> GetDonations() {
        List<Donation> list = donationRepository.findAll();
        return list.stream().map(Donation::getNameAmount).toList();
    }

    @GetMapping("/getdonationsuser")
    public List<DonationDTO> GetDonationsUser(@RequestParam Integer idUser) {
        List <Donation> donations = donationRepository.findByUser_idUser(idUser);

        return donations.stream().map(d -> new DonationDTO(d.getIdDonation(), d.getAction().getIdAction(), d.getAction().getName(), d.getUser().getDisplayName(), d.getAmount(), d.getDonationTime())).toList();
    }

}
