package app.ms_lottery.controller;

import app.ms_lottery.domain.Lottery;
import app.ms_lottery.service.impl.LotteryService;
import jakarta.mail.MessagingException;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Date;
import java.util.List;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/lottery")
public class LotteryController {

    private final LotteryService lotteryService;

    @PostMapping("/create/{userId}")
    public ResponseEntity<String> createLottery(
            @RequestBody List<Map<String, String>> participants,
            @RequestParam String name,
            @RequestParam @DateTimeFormat(pattern = "yyyy-MM-dd") Date date,
            @RequestParam @DateTimeFormat(pattern = "yyyy-MM-dd") Date endDate,
            @PathVariable Long userId) throws MessagingException {
        return lotteryService.saveLottery(participants, name, date, endDate, userId);
    }

    @PreAuthorize("hasRole('admin')")
    @GetMapping("/all")
    public ResponseEntity<String> getAllLotteries() {
        return lotteryService.findAll();
    }

    @GetMapping("/find/{id}")
    public ResponseEntity<String> getLotteryById(@PathVariable Long id) {
        return lotteryService.findLottery(id);
    }

    @GetMapping("/name")
    public ResponseEntity<String> getLotteryByName(@RequestParam String name) {
        return lotteryService.findLotteryByName(name);
    }

    @GetMapping("/date")
    public ResponseEntity<String> getLotteryByDate(
            @RequestParam @DateTimeFormat(pattern = "yyyy-MM-dd") Date date) {
        return lotteryService.findLotteryByDate(date);
    }

    @GetMapping("/endDate")
    public ResponseEntity<String> getLotteryByEndDate(
            @RequestParam @DateTimeFormat(pattern = "yyyy-MM-dd") Date endDate) {
        return lotteryService.findLotteryByEndDate(endDate);
    }

    @GetMapping("/findByUserId/{id}")
    public ResponseEntity<String> findByUserId(@PathVariable Long id){
        return lotteryService.findLotteryByUserId(id);
    }
}