package app.ms_user.repository.feign;

import app.ms_user.configuration.feign.FeignInterceptor;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

@FeignClient( name= "ms-lottery", url="http://localhost:8083", configuration = FeignInterceptor.class)
public interface FeignLotteryRepository {
    @RequestMapping(method = RequestMethod.GET, value = "/lottery/findByUserId/{id}")
    ResponseEntity<String> findByUserId(@PathVariable Long id);
}
