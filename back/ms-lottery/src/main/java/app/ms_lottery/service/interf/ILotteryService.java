package app.ms_lottery.service.interf;

import jakarta.mail.MessagingException;
import org.springframework.http.ResponseEntity;

import java.util.Date;
import java.util.List;
import java.util.Map;

public interface ILotteryService {

    ResponseEntity<String> saveLottery(List<Map<String, String>> participants, String name, Date date, Date endDate, Long userId) throws MessagingException;

    ResponseEntity<String> findAll();

    ResponseEntity<String> findLottery(Long id);

    ResponseEntity<String> findLotteryByName(String name);

    ResponseEntity<String> findLotteryByDate(Date date);

    ResponseEntity<String> findLotteryByEndDate(Date endDate);

    ResponseEntity<String> findLotteryByUserId(Long id);
}
