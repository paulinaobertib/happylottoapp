package app.ms_user.controller;

import app.ms_user.domain.User;
import app.ms_user.security.jwt.JwtFilter;
import app.ms_user.service.impl.UserService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Map;

import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(UserController.class)
@AutoConfigureMockMvc(addFilters = false) // Para evitar que los filtros afecten los tests
public class UserControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private UserService userService;

    @MockBean
    private JwtFilter jwtFilter;

    private final ObjectMapper objectMapper = new ObjectMapper();

    @Test
    public void testRegisterOK() throws Exception {
        Map<String, String> requestMap = Map.of("email", "testSignUp@example.com", "password", "Password123");
        when(userService.singUp(requestMap)).thenReturn(ResponseEntity.ok("Usuario registrado exitosamente"));

        mockMvc.perform(post("/user/public/signUp")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(requestMap)))
                .andExpect(status().isOk())
                .andExpect(content().string("Usuario registrado exitosamente"));
    }

    @Test
    public void testLoginOK() throws Exception {
        Map<String, String> requestMap = Map.of("email", "testLogin@example.com", "password", "Password123");
        Map<String, Object> responseMap = Map.of("token", "jwt-token");

        when(userService.login(requestMap)).thenReturn(ResponseEntity.ok(responseMap));

        mockMvc.perform(post("/user/public/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(requestMap)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").value("jwt-token"));
    }

    @Test
    public void testDeleteOK() throws Exception {
        String email = "testDelete@example.com";
        when(jwtFilter.getCurrentUser()).thenReturn(email);
        when(userService.delete(email)).thenReturn(ResponseEntity.ok("Usuario eliminado"));

        mockMvc.perform(delete("/user/delete/" + email))
                .andExpect(status().isOk())
                .andExpect(content().string("Usuario eliminado"));
    }

    @Test
    public void testFindCurrentUserOK() throws Exception {
        String email = "testCurrentUser@example.com";
        when(jwtFilter.getCurrentUser()).thenReturn(email);
        when(userService.getUser(email)).thenReturn(ResponseEntity.ok("Usuario encontrado"));

        mockMvc.perform(get("/user/profile"))
                .andExpect(status().isOk())
                .andExpect(content().string("Usuario encontrado"));
    }

    @Test
    public void testFindAllOK() throws Exception {
        when(userService.getAll()).thenReturn(ResponseEntity.ok("Lista de usuarios"));

        mockMvc.perform(get("/user/all"))
                .andExpect(status().isOk())
                .andExpect(content().string("Lista de usuarios"));
    }

    @Test
    public void testFindUserByEmailOK() throws Exception {
        String email = "testFindByEmail@example.com";
        when(userService.getUser(email)).thenReturn(ResponseEntity.ok("Usuario encontrado"));

        mockMvc.perform(get("/user/find/" + email))
                .andExpect(status().isOk())
                .andExpect(content().string("Usuario encontrado"));
    }

    @Test
    public void testChangeRolOK() throws Exception {
        String email = "testChangeRol@example.com";
        when(userService.changeRol(email)).thenReturn(ResponseEntity.ok("Rol cambiado"));

        mockMvc.perform(get("/user/rol/" + email))
                .andExpect(status().isOk())
                .andExpect(content().string("Rol cambiado"));
    }

    @Test
    public void testDeleteUserByAdminOK() throws Exception {
        String email = "testDeleteByAdmin@example.com";
        when(userService.delete(email)).thenReturn(ResponseEntity.ok("Usuario eliminado"));

        mockMvc.perform(delete("/user/deleteUser/" + email))
                .andExpect(status().isOk())
                .andExpect(content().string("Usuario eliminado"));
    }

    @Test
    public void testFindUserByIdOK() throws Exception {
        Long id = 1L;
        User user = new User();
        user.setId(id);
        user.setEmail("testFindUserById@example.com");

        when(userService.findUserById(id)).thenReturn(user);

        mockMvc.perform(get("/user/id/" + id))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.email").value("testFindUserById@example.com"));
    }
}


