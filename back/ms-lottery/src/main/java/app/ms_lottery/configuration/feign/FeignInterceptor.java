package app.ms_lottery.configuration.feign;

import feign.RequestInterceptor;
import feign.RequestTemplate;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

@Component
@Slf4j
public class FeignInterceptor implements RequestInterceptor {

    @Override
    public void apply(RequestTemplate requestTemplate) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.getCredentials() != null) {
            String token = (String) SecurityContextHolder.getContext().getAuthentication().getCredentials();
            requestTemplate.header("Authorization", "Bearer " + token);
            requestTemplate.header("X-Feign-Request", "true");
        } else {
            log.warn("No authentication or token found in SecurityContext");
        }
    }
}

