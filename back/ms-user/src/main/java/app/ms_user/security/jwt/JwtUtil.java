package app.ms_user.security.jwt;

// clase con los metodos para generar, validar, y extraer informacion del token

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

@Service
public class JwtUtil {

    // clave secreta del token, nos permite tener una firma en el token
    // firmamos para que cuando querramos acceder a la aplicacion valide quienes somos
    // para validad que no nos malintencionaron el token
    private final SecretKey secret;

    // Constructor que crea el SecretKey a partir de la clave secreta como String
    public JwtUtil(@Value("${jwt.secret-key}") String secretKey) {
        this.secret = Keys.hmacShaKeyFor(secretKey.getBytes());
    }

    public String extractUsername(String token) {
        return extractClaims(token, Claims::getSubject);
    }

    public Claims extractAllClaims(String token) {
        return Jwts.parser()
                .setSigningKey(secret)
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    // metodo de tipo generico
    public <T> T extractClaims(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

    public Date extractExpiration(String token) {
        return extractClaims(token, Claims::getExpiration);
    }

    private Boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }

    public String generateToken(String username, String rol) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("rol", rol);
        return createToken(claims, username);
    }

    private String createToken(Map<String, Object> claims, String subject) {
        return  Jwts.builder()
                .setClaims(claims)
                .setSubject(subject)
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + 100 * 60 * 60 * 100))
                .signWith(SignatureAlgorithm.HS256, secret).compact();
                // SignatureAlgorithm.HS256 algoritmo que firma el token
    }

    public Boolean validateToken(String token, UserDetails userDetails) {
        final String username = extractUsername(token);
        return (username.equals(userDetails.getUsername()) && !isTokenExpired(token));
    }
}
