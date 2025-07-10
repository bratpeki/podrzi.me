package project.donation;

import org.springframework.web.bind.annotation.*;
import project.user.*;
import project.action.*;

import java.util.List;

@RestController
@RequestMapping("/api/donations")
public class DonationAPI {
    private final DonationRepository donationRepository;
    private final ActionRepository actionRepository;
    private final UserRepository userRepository;

    public DonationAPI (DonationRepository donationRepository, ActionRepository actionRepository, UserRepository userRepository) {
        this.donationRepository = donationRepository;
        this.actionRepository = actionRepository;
        this.userRepository = userRepository;
    }

    @GetMapping("/getdonations")
    public List<String> GetDonations() {
        List<Donation> list = donationRepository.findAll();
        return list.stream().map(Donation::getNameAmount).toList();
    }

    @GetMapping("/getdonationsuser")
    public List<DonationDTO> GetDonationsUser(@RequestParam Integer idUser) {
        List <Donation> donations = donationRepository.findByUser_idUser(idUser);
        return donations.stream().map(d ->
                new DonationDTO(d.getIdDonation(), d.getAction().getIdAction(), d.getAction().getName(), d.getUser().getDisplayname(), d.getAmount(), d.getDonationTime())
        ).toList();
    }

    @PostMapping("/adddonation")
    public String AddDonation(@RequestBody DonationRequestDTO drdto) {
        Action action = actionRepository.findByidAction(drdto.getIdAction());
        action.setCollected(action.getCollected() + drdto.getAmount());
        actionRepository.save(action);

        Donation donation = new Donation();
        donation.setAction(action);
        donation.setUser(userRepository.findByidUser(drdto.getIdUser()));
        donation.setAmount(drdto.getAmount());
        donation.setDonationTime(drdto.getDonationTime());

        donationRepository.save(donation);
        return "Donirano!";
    }
}
