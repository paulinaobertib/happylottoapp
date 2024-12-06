package app.ms_lottery.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.Collections;
import java.util.List;

@Component
public class JwtUtil {

    private final SecretKey secret;

    // Constructor que crea el SecretKey a partir de la clave secreta como String
    public JwtUtil(@Value("${jwt.secret-key}") String secretKey) {
        this.secret = Keys.hmacShaKeyFor(secretKey.getBytes());
    }

    // Método para obtener el rol del usuario del token
    public String getUserRol(String token) {
        Claims claims = extractClaims(token);
        return claims.get("rol", String.class);
    }

    // Método para convertir el rol en una lista de GrantedAuthority
    public List<GrantedAuthority> getAuthorities(String role) {
        return Collections.singletonList(new SimpleGrantedAuthority("ROLE_" + role));
    }

    // Método auxiliar para extraer los claims del token
    private Claims extractClaims(String token) {
        return Jwts.parser()
                .setSigningKey(secret)
                .parseClaimsJws(token.replace("Bearer ", ""))
                .getBody();
    }
}



