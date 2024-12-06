package app.ms_lottery.service;

import app.ms_lottery.domain.Lottery;
import app.ms_lottery.domain.Relation;
import app.ms_lottery.domain.feign.User;
import app.ms_lottery.dto.EmailDTO;
import app.ms_lottery.dto.LotteryDTO;
import app.ms_lottery.repository.LotteryRepository;
import app.ms_lottery.repository.RelationRepository;
import app.ms_lottery.repository.feign.UserRepository;
import app.ms_lottery.service.impl.EmailService;
import app.ms_lottery.service.impl.LotteryService;
import jakarta.mail.MessagingException;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class LotteryServiceTest {

    @InjectMocks
    private LotteryService lotteryService;

    @Mock
    private LotteryRepository lotteryRepository;

    @Mock
    private RelationRepository relationRepository;

    @Mock
    private EmailService emailService;

    @Mock
    private UserRepository userRepository;

    @Test
    void testSaveLotteryOK() throws MessagingException {
        List<Map<String, String>> participants = List.of(
                Map.of("email", "sender@example.com", "name", "Sender"),
                Map.of("email", "receiver@example.com", "name", "Receiver")
        );

        String name = "Sorteo de Prueba";
        Date date = new Date();
        Date endDate = new Date(System.currentTimeMillis() + 86400000); // le agrego un dia
        Long userId = 2L;

        when(lotteryRepository.findLotteryByUserId(userId)).thenReturn(Collections.emptyList());
        doNothing().when(emailService).sendMail(any(EmailDTO.class));

        ResponseEntity<String> response = lotteryService.saveLottery(participants, name, date, endDate, userId);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals("Sorteo realizado con exito", response.getBody());
        verify(lotteryRepository, times(1)).save(any(Lottery.class));
        verify(relationRepository, times(1)).saveAll(anySet());
    }

    @Test
    void testSaveLotteryDuplicateNOK() throws MessagingException {
        List<Map<String, String>> participants = List.of(
                Map.of("email", "sender@example.com", "name", "Sender"),
                Map.of("email", "receiver@example.com", "name", "Receiver")
        );

        String name = "Sorteo de Prueba";
        Date date = new Date();
        Date endDate = new Date(System.currentTimeMillis() + 86400000); // +1 día
        Long userId = 2L;

        Lottery existingLottery = new Lottery();
        existingLottery.setName(name);

        when(lotteryRepository.findLotteryByUserId(userId)).thenReturn(List.of(existingLottery));

        ResponseEntity<String> response = lotteryService.saveLottery(participants, name, date, endDate, userId);

        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertEquals("No se ha podido realizar el sorteo, el usuario ya tiene un sorteo con ese nombre", response.getBody());
        verify(lotteryRepository, never()).save(any(Lottery.class));
        verify(relationRepository, never()).saveAll(anySet());
    }

    @Test
    void testFindAllOK() {
        Lottery lottery = new Lottery();
        lottery.setName("Sorteo de Prueba");
        lottery.setUserId(1L);

        User user = new User(1L, "user", "user@example.com", "12345678");

        when(lotteryRepository.findAll()).thenReturn(List.of(lottery));
        when(userRepository.findUserById(1L)).thenReturn(user);

        ResponseEntity<String> response = lotteryService.findAll();

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertTrue(response.getBody().contains("Sorteo de Prueba"));
    }

    @Test
    void testFindLotteryOK() {
        Lottery lottery = new Lottery();
        lottery.setName("Sorteo de Prueba");

        when(lotteryRepository.findById(1L)).thenReturn(Optional.of(lottery));

        ResponseEntity<String> response = lotteryService.findLottery(1L);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertTrue(response.getBody().contains("Sorteo:"));
    }

    @Test
    void testFindLotteryNotFoundNOK() {
        when(lotteryRepository.findById(1L)).thenReturn(Optional.empty());

        ResponseEntity<String> response = lotteryService.findLottery(1L);

        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertEquals("No se ha encontrado el sorteo", response.getBody());
    }

    @Test
    void testFindLotteryByNameOK() {
        Lottery lottery = new Lottery();
        lottery.setName("Sorteo de Prueba");

        when(lotteryRepository.findByName("Sorteo de Prueba")).thenReturn(List.of(lottery));

        ResponseEntity<String> response = lotteryService.findLotteryByName("Sorteo de Prueba");

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertTrue(response.getBody().contains("Sorteo:"));
    }

    @Test
    void testFindLotteryByNameNotFoundNOK() {
        when(lotteryRepository.findByName("Sorteo de Prueba")).thenReturn(Collections.emptyList());

        ResponseEntity<String> response = lotteryService.findLotteryByName("Sorteo de Prueba");

        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertEquals("No se ha encontrado el sorteo", response.getBody());
    }

    @Test
    void testFindLotteryByDateOK() {
        Lottery lottery = new Lottery();
        lottery.setDate(new Date());

        when(lotteryRepository.findByDate(any(Date.class))).thenReturn(List.of(lottery));

        ResponseEntity<String> response = lotteryService.findLotteryByDate(new Date());

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertTrue(response.getBody().contains("Sorteo:"));
    }

    @Test
    void testFindLotteryByDateNotFoundNOK() {
        when(lotteryRepository.findByDate(any(Date.class))).thenReturn(Collections.emptyList());

        ResponseEntity<String> response = lotteryService.findLotteryByDate(new Date());

        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertEquals("No se ha encontrado el sorteo", response.getBody());
    }

    @Test
    void testFindLotteryByEndDateOK() {
        Lottery lottery = new Lottery();
        lottery.setEndDate(new Date());

        when(lotteryRepository.findByEndDate(any(Date.class))).thenReturn(List.of(lottery));

        ResponseEntity<String> response = lotteryService.findLotteryByEndDate(new Date());

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertTrue(response.getBody().contains("Sorteo:"));
    }

    @Test
    void testFindLotteryByEndDateNotFoundNOK() {
        when(lotteryRepository.findByEndDate(any(Date.class))).thenReturn(Collections.emptyList());

        ResponseEntity<String> response = lotteryService.findLotteryByEndDate(new Date());

        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertEquals("No se ha encontrado el sorteo", response.getBody());
    }

    @Test
    void testFindLotteryByUserIdOK() {
        Lottery lottery = new Lottery();
        lottery.setUserId(1L);

        when(lotteryRepository.findLotteryByUserId(1L)).thenReturn(List.of(lottery));

        ResponseEntity<String> response = lotteryService.findLotteryByUserId(1L);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertTrue(response.getBody().contains("Sorteos del usuario:"));
    }
}

