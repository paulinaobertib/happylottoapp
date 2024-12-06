package app.ms_user.controller;

import app.ms_user.domain.User;
import app.ms_user.security.jwt.JwtFilter;
import app.ms_user.service.impl.UserService;
import app.ms_user.util.ConstantUtils;
import app.ms_user.util.error.Constant;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/user")
@Slf4j
public class UserController {

    private final UserService userService;

    private final JwtFilter jwtFilter;
    
    @PostMapping("/public/signUp")
    public ResponseEntity<String> register(@RequestBody(required = true) Map<String, String> requestMap) {
        try {
            return userService.singUp(requestMap);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return ConstantUtils.getResponseEntity(Constant.SOMETHING_WENT_WRONG, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @PostMapping("/public/login")
    public ResponseEntity<Map<String, Object>> login(@RequestBody Map<String, String> requestMap) {
        try {
            return userService.login(requestMap);
        } catch (Exception e) {
            e.printStackTrace();
            Map<String, Object> response = new HashMap<>();
            response.put("mensaje", "Algo salió mal, por favor intente nuevamente.");
            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PreAuthorize("@jwtFilter.isUser()")
    @DeleteMapping("/delete/{email}")
    public ResponseEntity<String> delete(@PathVariable String email) {
        if (jwtFilter.getCurrentUser().equalsIgnoreCase(email)) {
            try {

                return userService.delete(email);
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
        return ConstantUtils.getResponseEntity(Constant.SOMETHING_WENT_WRONG, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @PutMapping("/update")
    public ResponseEntity<String> update(@RequestBody(required = true) User user) {
        try {
            return userService.update(user);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return ConstantUtils.getResponseEntity(Constant.SOMETHING_WENT_WRONG, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @GetMapping("/profile")
    public ResponseEntity<String> findCurrentUser() {
        try {
            return userService.getUser(jwtFilter.getCurrentUser());
        } catch (Exception e) {
            e.printStackTrace();
        }
        return ConstantUtils.getResponseEntity(Constant.SOMETHING_WENT_WRONG, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @PreAuthorize("@jwtFilter.isAdmin()")
    @GetMapping("/all")
    public ResponseEntity<String> findAll() {
        try {
            return userService.getAll();
        } catch (Exception e) {
            e.printStackTrace();
        }
        return ConstantUtils.getResponseEntity(Constant.SOMETHING_WENT_WRONG, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @PreAuthorize("@jwtFilter.isAdmin()")
    @GetMapping("/find/{email}")
    public ResponseEntity<String> findUserByEmail(@PathVariable String email) {
        try {
            return userService.getUser(email);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return ConstantUtils.getResponseEntity(Constant.SOMETHING_WENT_WRONG, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @PreAuthorize("@jwtFilter.isAdmin()")
    @GetMapping("/rol/{email}")
    public ResponseEntity<String> changeRol(@PathVariable String email) {
        try {
            return userService.changeRol(email);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return ConstantUtils.getResponseEntity(Constant.SOMETHING_WENT_WRONG, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @PreAuthorize("@jwtFilter.isAdmin()")
    @DeleteMapping("/deleteUser/{email}")
    public ResponseEntity<String> deleteUserByAdmin(@PathVariable String email) {
        try {
            return userService.delete(email);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return ConstantUtils.getResponseEntity(Constant.SOMETHING_WENT_WRONG, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @GetMapping("/id/{id}")
    public User findUserById(@PathVariable Long id) {
        try {
            return userService.findUserById(id);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return new User();
    }
}
