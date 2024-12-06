package app.ms_user.service.impl;

import app.ms_user.domain.User;
import app.ms_user.repository.feign.LotteryRepository;
import app.ms_user.security.CustomerDetailService;
import app.ms_user.security.jwt.JwtUtil;
import app.ms_user.util.error.Constant;
import app.ms_user.repository.UserRepository;
import app.ms_user.service.interf.IUserService;
import app.ms_user.util.ConstantUtils;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.*;

@Slf4j //para agregar los logs
@Service
@RequiredArgsConstructor
public class UserService implements IUserService {

    private final UserRepository userRepository;

    // clase que tiene todos los usuarios con permisos
    // dice quien puede entrar a cual endpoint
    private final AuthenticationManager authenticationManager;

    private final CustomerDetailService customerDetailService;

    private final JwtUtil jwtUtil;

    private final PasswordEncoder passwordEncoder;

    private final LotteryRepository lotteryRepository;

    private boolean validateSignUp(Map<String, String> requestMap){
        if (requestMap.containsKey("name") && requestMap.containsKey("email") && requestMap.containsKey("password")) {
            return true;
        }
        return false;
    }

    private User getUserFromMap(Map<String, String> requestMap) {
        User user = new User();
        user.setName(requestMap.get("name"));
        user.setEmail(requestMap.get("email"));
        if (requestMap.containsKey("number")) {
            user.setNumber(requestMap.get("number"));
        } else {
            user.setNumber(requestMap.get("null"));
        }
        String encodedPassword = passwordEncoder.encode(requestMap.get("password"));
        log.info("ACA" + encodedPassword);
        user.setPassword(encodedPassword);
        user.setStatus("true");
        // por defecto, el usuario nuevo va a tener el rol de usuario
        user.setRol("user");
        return user;
    }

    @Override
    public ResponseEntity<String> singUp(Map<String, String> requestMap) {
        log.info("Registro del usuario");
        try {
            if (validateSignUp(requestMap)) {
                Optional<User> user = userRepository.findByEmail(requestMap.get("email"));
                if (user.isEmpty()) {
                    userRepository.save(getUserFromMap(requestMap));
                    return ConstantUtils.getResponseEntity("Usuario registrado con exito", HttpStatus.CREATED);
                } else if (Objects.equals(user.get().getStatus(), "false")) {
                    user.get().setStatus("true");
                    return ConstantUtils.getResponseEntity("Usuario restablecido con exito", HttpStatus.CREATED);
                } else {
                    return ConstantUtils.getResponseEntity("Ya existe un usuario con ese email", HttpStatus.BAD_REQUEST);
                }
            } else {
                return ConstantUtils.getResponseEntity(Constant.INVALID_DATA, HttpStatus.BAD_REQUEST);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return  ConstantUtils.getResponseEntity(Constant.SOMETHING_WENT_WRONG, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @Override
    public ResponseEntity<Map<String, Object>> login(Map<String, String> requestMap) {
        log.info("Dentro de login");
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(requestMap.get("email"), requestMap.get("password"))
            );
            // Autenticando al usuario
            if (authentication.isAuthenticated()) {
                // Verificando si la cuenta está activa
                if (customerDetailService.getUserDetail().get().getStatus().equalsIgnoreCase("true")) {
                    // Generar el token
                    Map<String, Object> response = new HashMap<>();
                    response.put("token", jwtUtil.generateToken(
                            customerDetailService.getUserDetail().get().getEmail(),
                            customerDetailService.getUserDetail().get().getRol()));
                    return new ResponseEntity<>(response, HttpStatus.OK);
                } else {
                    Map<String, Object> response = new HashMap<>();
                    response.put("mensaje", "La cuenta ha sido eliminada");
                    return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
                }
            }
        } catch (Exception e) {
            log.error("Error en el login: {}", e);
        }
        // Si no logra autenticar
        Map<String, Object> response = new HashMap<>();
        response.put("mensaje", "Credenciales incorrectas");
        return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
    }

    @Override
    public ResponseEntity<String> delete(String email) {
        Optional<User> user = userRepository.findByEmail(email);
        if (user.isPresent()){
            user.get().setStatus("false");
            userRepository.save(user.get());
            return new ResponseEntity<String>("Usuario eliminado con exito", HttpStatus.OK);
        } else {
            return ConstantUtils.getResponseEntity(Constant.INVALID_DATA, HttpStatus.BAD_REQUEST);
        }
    }

    @Override
    public ResponseEntity<String> update(User user) {
        Optional<User> userUpdate = userRepository.findByEmail(user.getEmail());

        if (userUpdate.isPresent() && Objects.equals(userUpdate.get().getStatus(), "true")) {
            User existingUser = userUpdate.get();

            // Solo actualiza los campos si vienen en el objeto `user` de la solicitud
            if (user.getName() != null) {
                existingUser.setName(user.getName());
            }
            if (user.getNumber() != null) {
                existingUser.setNumber(user.getNumber());
            }

            userRepository.save(existingUser);
            return new ResponseEntity<>("Usuario actualizado con éxito", HttpStatus.OK);
        } else {
            return ConstantUtils.getResponseEntity(Constant.INVALID_DATA, HttpStatus.BAD_REQUEST);
        }
    }

    @Override
    public ResponseEntity<String> getAll() {
        return new ResponseEntity<String>("Usuarios: " + "\n" + userRepository.findAllUsers(), HttpStatus.OK);
    }

    @Override
    public ResponseEntity<String> getUser(String email) {
        Optional<User> user = userRepository.findByEmail(email);
        if (user.isPresent() && Objects.equals(user.get().getStatus(), "true")){
            String lotteries = lotteryRepository.findByUserId(user.get().getId());
            return new ResponseEntity<String>("Usuario: " + "\n" + user + "\n" + "Sorteos: " + "\n" + lotteries, HttpStatus.OK);
        } else {
            return ConstantUtils.getResponseEntity(Constant.INVALID_DATA, HttpStatus.BAD_REQUEST);
        }
    }

    @Override
    public ResponseEntity<String> changeRol(String email) {
        Optional<User> user = userRepository.findByEmail(email);
        if (user.isPresent() && Objects.equals(user.get().getStatus(), "true")) {
            if (user.get().getRol().equalsIgnoreCase("user")) {
                user.get().setRol("admin");
                userRepository.save(user.get());
            } else {
                user.get().setRol("user");
                userRepository.save(user.get());
            }
            return new ResponseEntity<String>("Usuario actualizado con exito " + "\n" + user.get(), HttpStatus.OK);
        } else {
            return ConstantUtils.getResponseEntity(Constant.INVALID_DATA, HttpStatus.BAD_REQUEST);
        }
    }

    @Override
    public User findUserById(Long id) {
        Optional<User> user = userRepository.findById(id);
        if (user.isPresent() && Objects.equals(user.get().getStatus(), "true")) {
            return user.get();
        } else {
            return new User();
        }
    }
}
