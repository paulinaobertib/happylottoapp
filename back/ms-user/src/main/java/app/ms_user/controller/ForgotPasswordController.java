package app.ms_user.controller;

import app.ms_user.domain.ForgotPassword;
import app.ms_user.domain.User;
import app.ms_user.security.jwt.JwtUtil;
import app.ms_user.util.ChangePassword;
import app.ms_user.util.MailBody;
import app.ms_user.repository.ForgotPasswordRepository;
import app.ms_user.repository.UserRepository;
import app.ms_user.service.impl.EmailService;
import app.ms_user.util.ConstantUtils;
import app.ms_user.util.error.Constant;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.Date;
import java.util.Objects;
import java.util.Optional;
import java.util.Random;

@RestController
@RequiredArgsConstructor
@RequestMapping("/forgotPassword")
@Slf4j
public class ForgotPasswordController {

    private final UserRepository userRepository;

    private final EmailService emailService;

    private final ForgotPasswordRepository forgotPasswordRepository;

    private final PasswordEncoder passwordEncoder;

    private final JwtUtil jwtUtil;

    private Integer otpGenerator() {
        Random random = new Random();
        return random.nextInt(100_000, 999_999);
    }

    @PostMapping("/public/verifyEmail/{email}")
    public ResponseEntity<String> verifyMail(@PathVariable String email) {
        Optional<User> user = userRepository.findByEmail(email);
        if (user.isEmpty()) {
            return ConstantUtils.getResponseEntity(Constant.INVALID_DATA, HttpStatus.BAD_REQUEST);
        }

        int otp = otpGenerator();

        log.info("Email destinatario: " + email);

        MailBody mailBody = MailBody.builder()
                .to(email)
                .text("Codigo para restablecer contraseña: " + otp)
                .subject("Restablecer contraseña")
                .build();

        ForgotPassword forgotPassword = ForgotPassword.builder()
                .otp(otp)
                .expirationTime(new Date(System.currentTimeMillis() + 70 * 1000))
                .user(user.get())
                .build();

        emailService.sendSimpleMessage(mailBody);
        forgotPasswordRepository.save(forgotPassword);

        return ResponseEntity.ok("Email enviado");
    }

    @PostMapping("/public/verifyOtp/{email}/{otp}")
    public ResponseEntity<String> verifyOtp(@PathVariable Integer otp, @PathVariable String email){
        Optional<User> user = userRepository.findByEmail(email);
        if (user.isEmpty()) {
            return ConstantUtils.getResponseEntity(Constant.INVALID_DATA, HttpStatus.BAD_REQUEST);
        }

        Optional<ForgotPassword> forgotPassword = forgotPasswordRepository.findByOtpAndUser(otp, user.get());
        if (forgotPassword.isEmpty()) {
            return ConstantUtils.getResponseEntity(Constant.INVALID_DATA, HttpStatus.BAD_REQUEST);
        }

        if (forgotPassword.get().getExpirationTime().before(Date.from(Instant.now()))) {
            forgotPasswordRepository.deleteById(forgotPassword.get().getId());
            return ConstantUtils.getResponseEntity(Constant.EXPIRED, HttpStatus.BAD_REQUEST);
        }

        // Generar un token JWT temporal para el cambio de contraseña
        String resetToken = jwtUtil.generateToken(email, user.get().getRol()); // Genera un token con una expiración corta para el cambio de contraseña

        // Retornar el token en el cuerpo de la respuesta
        return ResponseEntity.ok("{\"token\":\"" + resetToken + "\"}");
    }

    @PostMapping("/changePassword/{email}")
    public ResponseEntity<String> changePasswordHandler(@RequestBody ChangePassword changePassword, @PathVariable String email) {
        if (!Objects.equals(changePassword.password(), changePassword.repeatPassword())) {
            return new ResponseEntity<>("Las contraseñas deben coincidir", HttpStatus.EXPECTATION_FAILED);
        }
        String encodedPassword = passwordEncoder.encode(changePassword.password());
        userRepository.updatePassword(email, encodedPassword);
        Optional<User> user = userRepository.findByEmail(email);
        forgotPasswordRepository.deleteOtp(user.get().getId());
        return ResponseEntity.ok("Se ha actualizado la contraseña");
    }

}
