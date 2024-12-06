package app.ms_lottery.repository.feign;

import app.ms_lottery.configuration.feign.FeignInterceptor;
import app.ms_lottery.domain.feign.User;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import java.util.Optional;

@FeignClient( name= "ms-users", url="http://localhost:8082", configuration = FeignInterceptor.class)
public interface FeignUserRepository {
    @RequestMapping(method = RequestMethod.GET, value = "/user/id/{id}")
    User findUserById(@PathVariable Long id);
}
