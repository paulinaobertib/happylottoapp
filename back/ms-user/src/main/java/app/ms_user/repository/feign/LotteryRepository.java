package app.ms_user.repository.feign;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Repository;

@Repository
@RequiredArgsConstructor
public class LotteryRepository {

    private final FeignLotteryRepository lotteryRepository;

    public String findByUserId(Long id) {
        ResponseEntity<String> response = lotteryRepository.findByUserId(id);
        return response.getBody();
    }
}
