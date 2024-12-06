package app.ms_user.security.jwt;

// clase para validar el token, el usuario completo, con los roles, username, password

import app.ms_user.security.CustomerDetailService;
import app.ms_user.security.SecurityConfig;
import io.jsonwebtoken.Claims;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.AllArgsConstructor;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import java.io.IOException;

@Component
@RequiredArgsConstructor
// OncePerRequestFilter para que solo se ejecute una vez
public class JwtFilter extends OncePerRequestFilter {

    private final JwtUtil jwtUtil;

    private final CustomerDetailService customerDetailService;

    Claims claims = null;

    private String username = null;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        if (request.getServletPath().matches("^/user/public/login|/user/public/signUp|/forgotPassword/public/verifyEmail/.+|/forgotPassword/public/verifyOtp/.+/.*$")) {
            filterChain.doFilter(request, response);
        } else {

            String authorizationHeader = request.getHeader("Authorization");
            String token = null;

            if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")){
                // para solamente obtener el token
                token = authorizationHeader.substring(7); // le saca la parte de "Bearer "
                username = jwtUtil.extractUsername(token);
                claims = jwtUtil.extractAllClaims(token);
            }

            if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                UserDetails userDetails = customerDetailService.loadUserByUsername(username);
                if (jwtUtil.validateToken(token, userDetails)) {
                    UsernamePasswordAuthenticationToken usernamePasswordAuthenticationToken =
                            new UsernamePasswordAuthenticationToken(userDetails, token, userDetails.getAuthorities());
                    usernamePasswordAuthenticationToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                    SecurityContextHolder.getContext().setAuthentication(usernamePasswordAuthenticationToken);
                }
            }

            // ejecutamos el filtro
            filterChain.doFilter(request, response);
        }
    }

    public Boolean isAdmin() {
        return  "admin".equalsIgnoreCase((String) claims.get("rol"));
    }

    public Boolean isUser() {
        return  "user".equalsIgnoreCase((String) claims.get("rol"));
    }

    public String getCurrentUser(){
        return username;
    }
}
