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

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .csrf().disable()
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/api/users/adduser", "/api/users/userauth", "/api/messages/send", "/api/images/getuserimage", "/api/images/getactionprimary",
                                "/api/images/getactionimage", "/api/images/getactionimages", "/api/actions/getvisibleactions", "/api/users/validate").permitAll() //PUBLIC
                        .requestMatchers("/api/messages/getall", "/api/users/getusers", "/api/donations/getdonations").hasRole("ADMIN")  //ADMIN
                        .anyRequest().authenticated()
                )
                .sessionManagement(ses->ses.sessionCreationPolicy((SessionCreationPolicy.STATELESS)))
                .exceptionHandling(ex->ex.authenticationEntryPoint((request, response, authException)->{
                    response.sendError(HttpServletResponse.SC_UNAUTHORIZED,"Unauthorized");
                }));

        return http.build();
    }
}
