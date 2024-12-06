package app.ms_user.controller;

import app.ms_user.domain.ForgotPassword;
import app.ms_user.domain.User;
import app.ms_user.repository.ForgotPasswordRepository;
import app.ms_user.repository.UserRepository;
import app.ms_user.security.CustomerDetailService;
import app.ms_user.security.jwt.JwtUtil;
import app.ms_user.service.impl.EmailService;
import app.ms_user.util.ChangePassword;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;

import java.util.Date;
import java.util.Optional;

import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(ForgotPasswordController.class)
@AutoConfigureMockMvc(addFilters = false)
public class ForgotPasswordControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private UserRepository userRepository;

    @MockBean
    private EmailService emailService;

    @MockBean
    private ForgotPasswordRepository forgotPasswordRepository;

    @MockBean
    private PasswordEncoder passwordEncoder;

    @MockBean
    private JwtUtil jwtUtil;

    @MockBean
    private CustomerDetailService customerDetailService;

    private final ObjectMapper objectMapper = new ObjectMapper();

    @Test
    public void testVerifyMailOK() throws Exception {
        String email = "testVerifyMail@example.com";
        when(userRepository.findByEmail(email)).thenReturn(Optional.of(new User()));

        mockMvc.perform(MockMvcRequestBuilders.post("/forgotPassword/public/verifyEmail/{email}", email))
                .andExpect(status().isOk())
                .andExpect(content().string("Email enviado"));
    }

    @Test
    public void testVerifyMailNOK() throws Exception {
        String email = "testVerifyMail@example.com";
        when(userRepository.findByEmail(email)).thenReturn(Optional.empty());

        mockMvc.perform(MockMvcRequestBuilders.post("/forgotPassword/public/verifyEmail/{email}", email))
                .andExpect(status().isBadRequest())
                .andExpect(content().string("Mensaje: Datos invalidos"));
    }

    @Test
    public void testVerifyOtpOK() throws Exception {
        String email = "testVerifyOTP@example.com";
        int otp = 123456;

        User mockUser = mock(User.class);
        when(mockUser.getRol()).thenReturn("user");
        when(userRepository.findByEmail(email)).thenReturn(Optional.of(mockUser));

        ForgotPassword forgotPassword = new ForgotPassword();
        forgotPassword.setOtp(otp);
        forgotPassword.setExpirationTime(new Date(System.currentTimeMillis() + 60000)); // 1 minuto de expiración
        when(forgotPasswordRepository.findByOtpAndUser(otp, mockUser)).thenReturn(Optional.of(forgotPassword));

        when(jwtUtil.generateToken(email, "user")).thenReturn("jwt-token");

        mockMvc.perform(MockMvcRequestBuilders.post("/forgotPassword/public/verifyOtp/{email}/{otp}", email, otp))
                .andExpect(status().isOk())
                .andExpect(content().json("{\"token\":\"jwt-token\"}"));
    }

    @Test
    public void testVerifyOtpNOK() throws Exception {
        String email = "testVerifyOTP@example.com";
        int otp = 123456;
        when(userRepository.findByEmail(email)).thenReturn(Optional.of(new User()));
        when(forgotPasswordRepository.findByOtpAndUser(otp, new User())).thenReturn(Optional.empty());

        mockMvc.perform(MockMvcRequestBuilders.post("/forgotPassword/public/verifyOtp/{email}/{otp}", email, otp))
                .andExpect(status().isBadRequest())
                .andExpect(content().string("Mensaje: Datos invalidos"));
    }

    @Test
    public void testChangePasswordOK() throws Exception {
        String email = "testChangePassword@example.com";
        ChangePassword changePassword = new ChangePassword("newPassword", "newPassword");
        when(userRepository.findByEmail(email)).thenReturn(Optional.of(new User()));
        when(passwordEncoder.encode(changePassword.password())).thenReturn("encodedPassword");

        mockMvc.perform(MockMvcRequestBuilders.post("/forgotPassword/changePassword/{email}", email)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(changePassword)))
                .andExpect(status().isOk())
                .andExpect(content().string("Se ha actualizado la contraseña"));
    }

    @Test
    public void testChangePasswordNOK() throws Exception {
        String email = "testChangePassword@example.com";
        ChangePassword changePassword = new ChangePassword("newPassword", "differentPassword");

        mockMvc.perform(MockMvcRequestBuilders.post("/forgotPassword/changePassword/{email}", email)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(changePassword)))
                .andExpect(status().isExpectationFailed())
                .andExpect(content().string("Las contraseñas deben coincidir"));
    }
}

