package project.utilities;

import jakarta.servlet.http.HttpServletResponse;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.configurers.oauth2.server.resource.OAuth2ResourceServerConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class Security {

    String[] PublicMethods = {
            "/api/users/adduser",
            "/api/users/userauth",
            "/api/users/validate",
            "/api/messages/send",
            "/api/images/getuserimage",
            "/api/images/getactionprimary",
            "/api/images/getactionimage",
            "/api/images/getactionimages",
            "/api/actions/getvisibleactions"
    };

    String[] UserMethods = {
            "/api/users/showprofile",
            "/api/users/updateprofile"
    };

    String[] AdminMethods = {
            "/api/users/getusers",
            "/api/messages/getall",
            "/api/donations/getdonations"
    };

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http.csrf().disable().authorizeHttpRequests(auth -> auth
                .requestMatchers(PublicMethods).permitAll()     //PUBLIC
                .requestMatchers(AdminMethods).hasRole("ADMIN") //ADMIN
                .requestMatchers(UserMethods).hasRole("USER"))  //USER
                .sessionManagement(ses -> ses.sessionCreationPolicy((SessionCreationPolicy.STATELESS))).exceptionHandling(ex -> ex.authenticationEntryPoint((request, response, authException) -> {
            response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Unauthorized");
        }));

        return http.build();
    }
}
