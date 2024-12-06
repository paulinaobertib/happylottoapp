package app.ms_user.configuration.feign;

import feign.RequestInterceptor;
import feign.RequestTemplate;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class FeignInterceptor implements RequestInterceptor {

    @Override
    public void apply(RequestTemplate requestTemplate) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.getCredentials() != null) {
            String token = (String) SecurityContextHolder.getContext().getAuthentication().getCredentials();
            requestTemplate.header("Authorization", "Bearer " + token);
        } else {
            log.warn("No authentication or token found in SecurityContext");
        }
    }
}
