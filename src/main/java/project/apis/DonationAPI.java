package project.apis;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import project.classes.Action;
import project.classes.Donation;
import project.dtos.DonationDTO;
import project.repositories.ActionRepository;
import project.repositories.DonationRepository;
import project.dtos.DonationRequestDTO;
import project.repositories.UserRepository;

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
    public ResponseEntity<?> getDonations() {
        List<Donation> list = donationRepository.findAll();
        return ResponseEntity.ok(list.stream().map(Donation::getNameAmount).toList());
    }

    @GetMapping("/getdonationsuser")
    public ResponseEntity<?> getDonationsUser(@RequestParam Integer idUser) {
        List <Donation> donations = donationRepository.findByUser_idUser(idUser);
        return ResponseEntity.ok(donations.stream().map(d ->
                new DonationDTO(d.getIdDonation(), d.getAction().getIdAction(), d.getAction().getName(), d.getUser().getDisplayName(), d.getAmount(), d.getDonationTime())).toList());
    }

    @PostMapping("/adddonation")
    public ResponseEntity<?> addDonation(@RequestBody DonationRequestDTO drdto) {
        Action action = actionRepository.findByidAction(drdto.getIdAction());
        action.setCollected(action.getCollected() + drdto.getAmount());
        actionRepository.save(action);

        Donation donation = new Donation();
        donation.setAction(action);
        donation.setUser(userRepository.findByidUser(drdto.getIdUser()));
        donation.setAmount(drdto.getAmount());
        donation.setDonationTime(drdto.getDonationTime());

        donationRepository.save(donation);
        return ResponseEntity.ok("success");
    }
}
