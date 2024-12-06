package app.ms_user.security;

import app.ms_user.domain.User;
import app.ms_user.repository.UserRepository;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Optional;

@Slf4j
@Service
@AllArgsConstructor
public class CustomerDetailService implements UserDetailsService {

    private final UserRepository userRepository;

    private Optional<User> userDetail;

    // nuestro username es el email
    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        log.info("Dentro de loadUserByUsername ", username);
        userDetail = userRepository.findByEmail(username);
        if (userDetail.isPresent()) {
            // el array serian los roles
            return new org.springframework.security.core.userdetails.User(userDetail.get().getEmail(), userDetail.get().getPassword(), new ArrayList<>());
        } else {
            throw new UsernameNotFoundException("Usuario no encontrado");
        }
    }

    public Optional<User> getUserDetail(){
        if (userDetail.isPresent()){
            return userDetail;
        } else {
            throw new UsernameNotFoundException("Usuario no encontrado");
        }
    }
}
