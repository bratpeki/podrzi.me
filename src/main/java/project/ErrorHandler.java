package project;

import org.springframework.boot.web.servlet.error.ErrorController;
import org.springframework.web.bind.annotation.*;

import jakarta.servlet.http.HttpServletRequest;

@RestController
public class ErrorHandler  implements ErrorController {

    @RequestMapping("/error")
    public String handleError(HttpServletRequest request) {
        return request.getAttribute("jakarta.servlet.error.status_code").toString() ;
    }
}
