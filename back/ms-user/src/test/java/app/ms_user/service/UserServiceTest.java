package app.ms_user.service;

import app.ms_user.domain.User;
import app.ms_user.repository.UserRepository;
import app.ms_user.repository.feign.FeignLotteryRepository;
import app.ms_user.repository.feign.LotteryRepository;
import app.ms_user.security.CustomerDetailService;
import app.ms_user.security.jwt.JwtUtil;
import app.ms_user.service.impl.UserService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;
import static org.mockito.internal.verification.VerificationModeFactory.times;

@ExtendWith(MockitoExtension.class)
public class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private AuthenticationManager authenticationManager;

    @Mock
    private CustomerDetailService customerDetailService;

    @Mock
    private JwtUtil jwtUtil;

    @Mock
    private LotteryRepository feignLotteryRepository;

    @InjectMocks
    private UserService userService;

    @Test
    public void registerTestOK() {
        Map<String, String> requestMap = new HashMap<>();
        requestMap.put("name", "Test SignUp");
        requestMap.put("email", "test@example.com");
        requestMap.put("password", "Password123");

        when(userRepository.findByEmail("test@example.com")).thenReturn(Optional.empty());
        when(passwordEncoder.encode("Password123")).thenReturn("encodedPassword123");

        ResponseEntity<String> response = userService.singUp(requestMap);

        assertEquals(HttpStatus.CREATED, response.getStatusCode());
        assertEquals("Mensaje: Usuario registrado con exito", response.getBody());
        verify(userRepository, times(1)).save(any(User.class));
    }

   @Test
   public void loginTestOK() {
       Map<String, String> requestMap = new HashMap<>();
       requestMap.put("email", "testLogin@example.com");
       requestMap.put("password", "Password123");

       Authentication authentication = mock(Authentication.class);
       when(authentication.isAuthenticated()).thenReturn(true);

       User mockUser = new User();
       mockUser.setEmail("testLogin@example.com");
       mockUser.setRol("user");
       mockUser.setStatus("true");

       when(authenticationManager.authenticate(
               new UsernamePasswordAuthenticationToken("testLogin@example.com", "Password123")
       )).thenReturn(authentication);

       when(customerDetailService.getUserDetail()).thenReturn(Optional.of(mockUser));
       when(jwtUtil.generateToken("testLogin@example.com", "user")).thenReturn("mockToken");

       ResponseEntity<Map<String, Object>> response = userService.login(requestMap);

       assertEquals(HttpStatus.OK, response.getStatusCode());
       assertTrue(response.getBody().containsKey("token"));
       assertEquals("mockToken", response.getBody().get("token"));
   }

   @Test
    public void deleteTestOK() {
       String email = "deleteTest@example.com";
       User mockUser = new User();
       mockUser.setEmail(email);
       mockUser.setStatus("true");

       when(userRepository.findByEmail(email)).thenReturn(Optional.of(mockUser));

       ResponseEntity<String> response = userService.delete(email);

       assertEquals(HttpStatus.OK, response.getStatusCode());
       assertEquals("Usuario eliminado con exito", response.getBody());
       verify(userRepository, times(1)).save(mockUser);
       assertEquals("false", mockUser.getStatus());
   }

    @Test
    public void testGetAllOK() {
        User user1 = new User();
        user1.setId(1L);
        user1.setName("TestGetAll");
        user1.setEmail("testGetAll@example.com");
        user1.setStatus("true");
        user1.setRol("user");

        User user2 = new User();
        user2.setId(2L);
        user2.setName("TestGetAll2");
        user2.setEmail("testGetAll2@example.com");
        user2.setStatus("true");
        user2.setRol("admin");

        List<User> mockUsers = Arrays.asList(user1, user2);

        when(userRepository.findAllUsers()).thenReturn(mockUsers);

        ResponseEntity<String> response = userService.getAll();

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertTrue(response.getBody().contains("Usuarios:"));
        assertTrue(response.getBody().contains("TestGetAll"));
        assertTrue(response.getBody().contains("TestGetAll2"));
    }

    @Test
    public void testGetUserOK() {
        String email = "testGetUser@example.com";
        Long userId = 1L;

        User mockUser = new User();
        mockUser.setId(userId);
        mockUser.setEmail(email);
        mockUser.setStatus("true");

        when(userRepository.findByEmail(email)).thenReturn(Optional.of(mockUser));
        when(feignLotteryRepository.findByUserId(userId))
                .thenReturn(String.valueOf(new ResponseEntity<>("Sorteos simulados", HttpStatus.OK)));

        ResponseEntity<String> response = userService.getUser(email);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertTrue(response.getBody().contains("Usuario:"));
        assertTrue(response.getBody().contains("Sorteos simulados"));
    }

    @Test
    public void testChangeRolOK() {
        String email = "testChangeRol@example.com";
        User mockUser = new User();
        mockUser.setEmail(email);
        mockUser.setStatus("true");
        mockUser.setRol("user");

        when(userRepository.findByEmail(email)).thenReturn(Optional.of(mockUser));

        ResponseEntity<String> response = userService.changeRol(email);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertTrue(response.getBody().contains("Usuario actualizado con exito"));
        verify(userRepository, times(1)).save(mockUser);
        assertEquals("admin", mockUser.getRol());
    }

    @Test
    public void testFindUserByIdOK() {
        Long userId = 1L;
        User mockUser = new User();
        mockUser.setId(userId);
        mockUser.setStatus("true");

        when(userRepository.findById(userId)).thenReturn(Optional.of(mockUser));

        User result = userService.findUserById(userId);

        assertNotNull(result);
        assertEquals(userId, result.getId());
    }
}
