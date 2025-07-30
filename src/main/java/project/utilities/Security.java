package project.utilities;

import io.micrometer.common.KeyValues;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
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
            "/api/users/showuserprofile",
            "/api/users/forgotpassword",
            "/api/users/getusers",
            "/api/users/getusersstate",

            "/api/messages/send",

            "/api/images/getactionimages",

            "/api/actions/getvisibleactions",
            "/api/actions/getaction",
            "/api/actions/searchactions",
            "/api/actions/getuseractions",


            "/api/images/getprimaryimage",

            "/api/donations/adddonation",
            "/api/donations/getdonationsuser",

            "/api/admins/adminauth",

            "/uploads/**",
    };

    public static String[] UserMethods = {
            "/api/users/showprofile",

            "/api/users/updateprofile",
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
            "/api/notifications/send",
            "/api/notifications/sendcollab",
            "/api/notifications/seen",
            "/api/notifications/acceptcollab",
            "/api/notifications/denycollab",

            "/api/reports/create",

            "/api/comments/add",
            "/api/comments/remove",
            "/api/comments/edit",

            "/api/refunds/request",

    };

    public static String[] AdminMethods = {

            "/api/messages/getall",

            "/api/donations/getdonations",

            "/api/reports/getallunhandled",
            "/api/reports/handle",

            "/api/admins/addadmin",
            "/api/admins/suspenduser",
            "/api/admins/unsuspenduser",
            "/api/admins/removeaction",
            "/api/admins/sendall",

            "/api/refunds/getallunhandled",

            "/api/reviews/getall",

            "/api/comments/getbyid",
    };

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {

        http.cors().and().csrf().disable().addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class).authorizeHttpRequests(auth -> auth
                        .requestMatchers(PublicMethods).permitAll()     //PUBLIC
                        .requestMatchers(AdminMethods).hasRole("ADMIN") //ADMIN
                        .requestMatchers(UserMethods).hasRole("USER"))//USER
                .sessionManagement(ses -> ses.sessionCreationPolicy((SessionCreationPolicy.STATELESS)));



        return http.build();
    }
}
