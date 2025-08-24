package podrzime.apis;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import podrzime.classes.Action;
import podrzime.classes.Donation;
import podrzime.classes.User;
import podrzime.dtos.DonationDTO;
import podrzime.repositories.ActionRepository;
import podrzime.repositories.DonationRepository;
import podrzime.dtos.DonationRequestDTO;
import podrzime.repositories.UserRepository;
import podrzime.utilities.JWT;

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
                new DonationDTO(d.getIdDonation(), d.getIdAction(), (d.getAction() != null ? d.getAction().getName() : "Akcija obrisana"), d.getUser().getDisplayName(), d.getAmount(), d.getDonationTime(), d.getRefunded())).toList());
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
        donation.setRefunded(false);

        donationRepository.save(donation);
        return ResponseEntity.ok("success");
    }
}