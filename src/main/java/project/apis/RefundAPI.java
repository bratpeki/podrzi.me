package project.apis;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import project.classes.*;
import project.repositories.*;
import project.utilities.*;
import project.dtos.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/refunds")
public class RefundAPI {
    private final UserRepository userRepository;
    private final JWT jWT;
    private final DonationRepository donationRepository;
    private final RefundRepository refundRepository;

    public RefundAPI(UserRepository userRepository, JWT jWT, DonationRepository donationRepository, RefundRepository refundRepository) {
        this.userRepository = userRepository;
        this.jWT = jWT;
        this.donationRepository = donationRepository;
        this.refundRepository = refundRepository;
    }

    //@GetMapping("/getall")


    @PostMapping("/request")
    public ResponseEntity<?> requestRefund(@RequestHeader Map<String, String> token, @RequestBody RefundDTO rdto) {
        User u = userRepository.findByidUser(jWT.extractId(token.get("token")));

        List<Donation> ld = donationRepository.findByUser_idUser(u.getIdUser());
        List<Integer> iddon = ld.stream().map(a->a.getIdDonation()).toList();

        Donation d = donationRepository.findByidDonation(rdto.getIdDonation());

        if (iddon.contains(d.getIdDonation())) {
            if (refundRepository.findBydonation_idDonation(d.getIdDonation()) != null)
                return ResponseEntity.ok("requestExistsError");

            Refund r = new Refund();
            r.setRequestedRefund(true);
            r.setDonation(d);
            r.setReason(rdto.getReason());
            refundRepository.save(r);

            return ResponseEntity.ok("success");
        } else
            return ResponseEntity.ok("invalidDonationError");
    }
}
