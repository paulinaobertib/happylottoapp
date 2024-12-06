package app.ms_user.service.interf;

import app.ms_user.domain.User;
import org.springframework.http.ResponseEntity;

import java.util.Map;
import java.util.Optional;

public interface IUserService {

    ResponseEntity<String> singUp(Map<String, String> requestMap);

    ResponseEntity<Map<String, Object>>  login(Map<String, String> requestMap);

    ResponseEntity<String> delete(String email);

    ResponseEntity<String> update(User user);

    ResponseEntity<String> getAll();

    ResponseEntity<String> getUser(String email);

    ResponseEntity<String> changeRol(String email);

    User findUserById(Long id);
}
