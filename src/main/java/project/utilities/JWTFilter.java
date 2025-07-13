package project.utilities;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import project.admin.AdminRepository;
import project.user.UserRepository;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

@Component
public class JWTFilter extends OncePerRequestFilter {
    private final JWT jwt;
    private final AdminRepository adminRepository;
    private final UserRepository  userRepository;

    public JWTFilter(JWT jwt, AdminRepository adminRepository, UserRepository userRepository) {
        this.jwt = jwt;
        this.adminRepository = adminRepository;
        this.userRepository = userRepository;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {

        String token = request.getHeader("token");

        if (jwt.validateToken(token)) {
            String username = jwt.extractUsername(token);

            if (userRepository.findByusername(username) != null) {
                List<SimpleGrantedAuthority> authorities = new ArrayList<>();
                authorities.add(new SimpleGrantedAuthority("USER"));

                if (adminRepository.findByusername(username) != null)
                    authorities.add(new SimpleGrantedAuthority("ADMIN"));

                UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(username, null, authorities);
                SecurityContextHolder.getContext().setAuthentication(authentication);
            }
        }

        filterChain.doFilter(request, response);
    }
}
