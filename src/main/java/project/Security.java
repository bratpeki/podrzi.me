//package project;
//
//import org.springframework.context.annotation.Bean;
//import org.springframework.context.annotation.Configuration;
//import org.springframework.security.config.annotation.web.builders.HttpSecurity;
//import org.springframework.security.web.SecurityFilterChain;
//
//@Configuration
//public class Security {
//
//    @Bean
//    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
//        http.csrf().disable().authorizeHttpRequests(auth->auth.requestMatchers("/api/users/userauth", "api/images/getactionimage", "api/images/getactionimages",
//                "api/images/getuserimage", "api/images/getactionprimary", "api/users/adduser", "api/actions/getvisibleactions", "api/messages/send").permitAll().anyRequest().authenticated())
//                .formLogin(form ->
//                        form.loginPage("http://podrzime.ddns.net:3000/login").loginProcessingUrl("/api/users/userauth").defaultSuccessUrl("http://podrzime.ddns.net:3000/home").permitAll()).
//                logout(logout -> logout.permitAll());
//
//        return http.build();
//    }
//}
