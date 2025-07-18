package project.utilities;

import io.micrometer.common.KeyValues;
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

    public static String[] PublicMethods = {
            "/api/users/adduser",
            "/api/users/userauth",
            "/api/users/getnamebyid",

            "/api/messages/send",

            "/api/images/getactionimages",

            "/api/actions/getvisibleactions",
            "/api/actions/getaction",
            "/api/actions/searchactions",

            "/api/images/getprimaryimage",

            "/api/donations/adddonation",
            "/api/donations/getdonationsuser",

            "/api/admins/adminauth",

            "/uploads/**",

            //"/api/reports/getall"
    };

    public static String[] UserMethods = {
            "/api/users/showprofile",
            "/api/users/updateprofile",
            "/api/users/getusers",
            "/api/users/removeuser",

            "/api/reviews/addreview",

            "/api/images/uploadactionimage",
            "/api/images/uploaduserimage",
            "/api/images/removeactionimage",

            "/api/actions/addaction",
            "/api/actions/setprimaryimage",
            "/api/actions/updateaction",
            "/api/actions/validateuser",
            "/api/actions/removeaction",

            "/api/notifications/get",
            "/api/notification/send",

            "/api/reports/create",
            "/api/reports/getallunhandled",

            "/api/comments/add",
            "/api/comments/remove",

            "/api/refunds/request"

    };

    public static String[] AdminMethods = {

            "/api/messages/getall",

            "/api/donations/getdonations",

            "/api/notifications/sendall",

            "/api/reports/getall",
            "/api/reports/handle",

            "/api/admins/addadmin",

            "/api/reports/getallunhandled"
    };

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {

        http.cors().and().csrf().disable().addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class).authorizeHttpRequests(auth -> auth
                        .requestMatchers(PublicMethods).permitAll()     //PUBLIC
                        .requestMatchers(AdminMethods).hasRole("ADMIN") //ADMIN
                        .requestMatchers(UserMethods).hasRole("USER"))//USER
                .sessionManagement(ses -> ses.sessionCreationPolicy((SessionCreationPolicy.STATELESS)))
                .exceptionHandling(ex -> ex.authenticationEntryPoint((request, response, authException) -> {
                    response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Nemate prava!");
                }));



        return http.build();
    }
}
