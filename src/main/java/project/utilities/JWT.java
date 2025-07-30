package project.utilities;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Component;
import project.repositories.UserRepository;

import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.util.Date;

@Component
public class JWT {

    private final Key key = Keys.hmacShaKeyFor(
            "your-very-secret-key-that-is-long-enough-and-stored-safely".getBytes(StandardCharsets.UTF_8));

    private final Key adminKey = Keys.hmacShaKeyFor(
            "your-very-secret-key-that-is-long-enough-and-stored-safely-for-admins".getBytes(StandardCharsets.UTF_8));

    private final UserRepository userRepository;

    public JWT(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public String generateToken(String username) {
        Integer id = userRepository.findByusername(username).getIdUser();
        return Jwts.builder()
                .setSubject(username)
                .claim("id", id)
                .claim("role", "USER")
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + 2019200000L))
                .signWith(key)
                .compact();
    }

    public String generateTokenAdmin(String username) {
        return Jwts.builder()
                .setSubject(username)
                .claim("role", "ADMIN")
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + 2019200000L))
                .signWith(adminKey)
                .compact();
    }

    public String extractUsername(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(resolveKey(token))
                .build()
                .parseClaimsJws(token)
                .getBody()
                .getSubject();
    }

    public Integer extractId(String token) {
        Claims claims = Jwts.parserBuilder()
                .setSigningKey(resolveKey(token))
                .build()
                .parseClaimsJws(token)
                .getBody();

        return claims.get("id", Integer.class);
    }

    public boolean validateToken(String token) {
        try {
            Key resolvedKey = resolveKey(token);

            Jwts.parserBuilder()
                    .setSigningKey(resolvedKey)
                    .build()
                    .parseClaimsJws(token);

            return true;

        } catch (JwtException | IllegalArgumentException e) {
            return false;
        }
    }

    public Key resolveKey(String token) {
        try {
            Jwts.parserBuilder()
                    .setSigningKey(key)
                    .build()
                    .parseClaimsJws(token);
            return key;
        } catch (Exception ignored) {
            Jwts.parserBuilder()
                    .setSigningKey(adminKey)
                    .build()
                    .parseClaimsJws(token);
            return adminKey;
        }
    }
}