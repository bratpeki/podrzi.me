package podrzime.apis;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import podrzime.classes.*;
import podrzime.repositories.*;
import podrzime.utilities.*;
import podrzime.dtos.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/refunds")
public class RefundAPI {
    private final UserRepository userRepository;
    private final JWT jWT;
    private final DonationRepository donationRepository;
    private final RefundRepository refundRepository;
    private final ActionRepository actionRepository;

    public RefundAPI(UserRepository userRepository, JWT jWT, DonationRepository donationRepository, RefundRepository refundRepository, ActionRepository actionRepository) {
        this.userRepository = userRepository;
        this.jWT = jWT;
        this.donationRepository = donationRepository;
        this.refundRepository = refundRepository;
        this.actionRepository = actionRepository;
    }

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
            r.setAccepted(null);
            refundRepository.save(r);

            return ResponseEntity.ok("success");
        } else
            return ResponseEntity.ok("invalidDonationError");
    }

    @PostMapping("/accept")
    public ResponseEntity<?> acceptRefund(@RequestParam Integer idRefund) {

        Refund r = refundRepository.findByidRefund(idRefund);
        r.setAccepted(true);
        refundRepository.save(r);

        Donation d = donationRepository.findByidDonation(r.getIdDonation());
        Action a = actionRepository.findByidAction(d.getIdAction());

        a.setCollected(a.getCollected()-d.getAmount());
        d.setRefunded(true);
        donationRepository.save(d);
        actionRepository.save(a);

        return ResponseEntity.ok("success");
    }

    @PostMapping("/deny")
    public ResponseEntity<?> denyRefund(@RequestParam Integer idRefund) {
        Refund r = refundRepository.findByidRefund(idRefund);
        r.setAccepted(false);
        refundRepository.save(r);
        return ResponseEntity.ok("success");
    }

    @GetMapping("/getallunhandled")
    public ResponseEntity<?>  getAllUnhandledRefunds() {
        return ResponseEntity.ok(refundRepository.findByrequestedRefund());
    }
}
