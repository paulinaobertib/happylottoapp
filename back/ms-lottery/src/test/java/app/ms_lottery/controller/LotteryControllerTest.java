package app.ms_lottery.controller;

import app.ms_lottery.repository.LotteryRepository;
import app.ms_lottery.security.JwtFilter;
import app.ms_lottery.security.JwtUtil;
import app.ms_lottery.service.impl.EmailService;
import app.ms_lottery.service.impl.LotteryService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import java.util.*;

import static org.mockito.ArgumentMatchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(LotteryController.class)
@AutoConfigureMockMvc(addFilters = false)
class LotteryControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private LotteryRepository lotteryRepository;

    @MockBean
    private LotteryService lotteryService;

    @MockBean
    private EmailService emailService;

    @MockBean
    private JwtUtil jwtUtil;

    @MockBean
    private JwtFilter jwtFilter;

    private final ObjectMapper objectMapper = new ObjectMapper();

    @Test
    void createLotteryOK() throws Exception {
        List<Map<String, String>> participants = new ArrayList<>();
        Map<String, String> participant = new HashMap<>();
        participant.put("email", "test@example.com");
        participant.put("name", "Test User");
        participants.add(participant);

        Mockito.when(lotteryService.saveLottery(anyList(), anyString(), any(Date.class), any(Date.class), anyLong()))
                .thenReturn(ResponseEntity.ok("Sorteo realizado con exito"));

        mockMvc.perform(post("/lottery/create/{userId}", 1L)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(participants))
                        .param("name", "Lottery Test")
                        .param("date", "2024-12-10")
                        .param("endDate", "2024-12-20"))
                .andExpect(status().isOk())
                .andExpect(content().string("Sorteo realizado con exito"));
    }

    @Test
    void getAllLotteriesOK() throws Exception {
        Mockito.when(lotteryService.findAll())
                .thenReturn(ResponseEntity.ok("Sorteos: []"));

        mockMvc.perform(get("/lottery/all"))
                .andExpect(status().isOk())
                .andExpect(content().string("Sorteos: []"));
    }

    @Test
    void getLotteryByIdOK() throws Exception {
        Mockito.when(lotteryService.findLottery(anyLong()))
                .thenReturn(ResponseEntity.ok("Sorteo: Lottery"));

        mockMvc.perform(get("/lottery/find/{id}", 1L))
                .andExpect(status().isOk())
                .andExpect(content().string("Sorteo: Lottery"));
    }

    @Test
    void getLotteryByNameOK() throws Exception {
        Mockito.when(lotteryService.findLotteryByName(anyString()))
                .thenReturn(ResponseEntity.ok("Sorteo: Lottery"));

        mockMvc.perform(get("/lottery/name")
                        .param("name", "Lottery Test"))
                .andExpect(status().isOk())
                .andExpect(content().string("Sorteo: Lottery"));
    }

    @Test
    void getLotteryByDateOK() throws Exception {
        Mockito.when(lotteryService.findLotteryByDate(any(Date.class)))
                .thenReturn(ResponseEntity.ok("Sorteo: Lottery"));

        mockMvc.perform(get("/lottery/date")
                        .param("date", "2024-12-10"))
                .andExpect(status().isOk())
                .andExpect(content().string("Sorteo: Lottery"));
    }

    @Test
    void getLotteryByEndDateOK() throws Exception {
        Mockito.when(lotteryService.findLotteryByEndDate(any(Date.class)))
                .thenReturn(ResponseEntity.ok("Sorteo: Lottery"));

        mockMvc.perform(get("/lottery/endDate")
                        .param("endDate", "2024-12-20"))
                .andExpect(status().isOk())
                .andExpect(content().string("Sorteo: Lottery"));
    }

    @Test
    void findByUserIdOK() throws Exception {
        Mockito.when(lotteryService.findLotteryByUserId(anyLong()))
                .thenReturn(ResponseEntity.ok("Sorteos del usuario: []"));

        mockMvc.perform(get("/lottery/findByUserId/{id}", 1L))
                .andExpect(status().isOk())
                .andExpect(content().string("Sorteos del usuario: []"));
    }
}

