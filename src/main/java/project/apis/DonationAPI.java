package project.apis;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import project.classes.Action;
import project.classes.Donation;
import project.classes.User;
import project.dtos.DonationDTO;
import project.repositories.ActionRepository;
import project.repositories.DonationRepository;
import project.dtos.DonationRequestDTO;
import project.repositories.UserRepository;
import project.utilities.JWT;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/donations")
public class DonationAPI {
    private final DonationRepository donationRepository;
    private final ActionRepository actionRepository;
    private final UserRepository userRepository;
    private final JWT jwt;

    public DonationAPI (DonationRepository donationRepository, ActionRepository actionRepository, UserRepository userRepository, JWT jwt) {
        this.donationRepository = donationRepository;
        this.actionRepository = actionRepository;
        this.userRepository = userRepository;
        this.jwt = jwt;
    }

    @GetMapping("/getdonations")
    public ResponseEntity<?> getDonations() {
        List<Donation> list = donationRepository.findAll();
        return ResponseEntity.ok(list.stream().map(Donation::getNameAmount).toList());
    }

    @GetMapping("/getdonationsuser")
    public ResponseEntity<?> getDonationsUser(@RequestHeader Map<String, String> token, @RequestParam Integer idUser) {
        if (!jwt.extractId(token.get("token")).equals(idUser))
            return ResponseEntity.ok("wrongUserError");

        List <Donation> donations = donationRepository.findByUser_idUser(idUser);
        return ResponseEntity.ok(donations.stream().map(d ->
                new DonationDTO(d.getIdDonation(), d.getAction().getIdAction(), d.getAction().getName(), d.getUser().getDisplayName(), d.getAmount(), d.getDonationTime())).toList());
    }

    @PostMapping("/adddonation")
    public ResponseEntity<?> addDonation(@RequestHeader Map<String, String> token, @RequestBody DonationRequestDTO drdto) {
        User u;
        if (token.get("token") != null)
            u = userRepository.findByusername(jwt.extractUsername(token.get("token")));
        else
            u = userRepository.findByidUser(58); // GUEST
        Action action = actionRepository.findByidAction(drdto.getIdAction());

        action.setCollected(action.getCollected() + drdto.getAmount());
        actionRepository.save(action);

        Donation donation = new Donation();
        donation.setAction(action);
        donation.setUser(u);
        donation.setAmount(drdto.getAmount());
        donation.setDonationTime(LocalDateTime.now());

        donationRepository.save(donation);
        return ResponseEntity.ok("success");
    }
}