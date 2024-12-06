package app.ms_lottery.repository.feign;

import app.ms_lottery.domain.feign.User;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
@RequiredArgsConstructor
@Slf4j
public class UserRepository {

    private final FeignUserRepository userRepository;

    public User findUserById(Long id) {
        return userRepository.findUserById(id);
    }
}
