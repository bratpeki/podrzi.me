package project.utilities;

import jakarta.servlet.http.HttpServletResponse;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
public class Security {

    private final JWTFilter jwtFilter;

    public Security(JWTFilter jwtFilter) {
        this.jwtFilter = jwtFilter;
    }

    String[] PublicMethods = {
            "/api/users/adduser",
            "/api/users/userauth",

            "/api/messages/send",

            "/api/images/getuserimage",
            "/api/images/getactionprimary",
            "/api/images/getactionimage",
            "/api/images/getactionimages",

            "/api/actions/getvisibleactions",
            "/api/actions/getaction",

            "/api/donations/adddonation",

            "/api/admins/adminauth"
    };

    String[] UserMethods = {
            "/api/users/showprofile",
            "/api/users/updateprofile",

            "/api/images/uploadaction",
            "/api/images/uploaduser",

            "/api/actions/addaction",

            "/api/donations/getdonationsuser"
    };

    String[] AdminMethods = {
            "/api/users/getusers",

            "/api/messages/getall",

            "/api/donations/getdonations",

            "/api/admins/addadmin"
    };

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {

        http.cors().and().csrf().disable().addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class).authorizeHttpRequests(auth -> auth
                        .requestMatchers(PublicMethods).permitAll()     //PUBLIC
                        .requestMatchers(AdminMethods).hasRole("ADMIN") //ADMIN
                        .requestMatchers(UserMethods).hasRole("USER"))  //USER
                .sessionManagement(ses -> ses.sessionCreationPolicy((SessionCreationPolicy.STATELESS)))
                .exceptionHandling(ex -> ex.authenticationEntryPoint((request, response, authException) -> {
                    response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Nemate prava!");
                }));



        return http.build();
    }
}
