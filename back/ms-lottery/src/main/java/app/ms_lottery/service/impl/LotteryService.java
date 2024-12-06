package app.ms_lottery.service.impl;

import app.ms_lottery.domain.Lottery;
import app.ms_lottery.domain.Relation;
import app.ms_lottery.domain.feign.User;
import app.ms_lottery.dto.EmailDTO;
import app.ms_lottery.dto.LotteryDTO;
import app.ms_lottery.repository.LotteryRepository;
import app.ms_lottery.repository.RelationRepository;
import app.ms_lottery.repository.feign.UserRepository;
import app.ms_lottery.service.interf.ILotteryService;
import java.text.SimpleDateFormat;
import java.util.stream.Collectors;
import jakarta.mail.MessagingException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
@RequiredArgsConstructor
@Slf4j
public class LotteryService implements ILotteryService {

    private final LotteryRepository lotteryRepository;

    private final RelationRepository relationRepository;

    private final EmailService emailService;

    private final UserRepository userRepository;

    private Map<String, String> doLottery(List<String> emails) {
        List<String> shuffledEmails = new ArrayList<>(emails);
        Map<String, String> result = new HashMap<>();

        boolean hasValidAssignment = false;

        while (!hasValidAssignment) {
            Collections.shuffle(shuffledEmails); // Mezcla aleatoria

            hasValidAssignment = true;

            result.clear(); // Limpiamos para un nuevo intento

            for (int i = 0; i < emails.size(); i++) {
                String currentEmail = emails.get(i);
                String assignedEmail = shuffledEmails.get(i);

                // Verificamos que no se asignen a sí mismos
                if (currentEmail.equals(assignedEmail)) {
                    // si entra, es porque si se asignaron a si mismos,
                    // por eso lo ponemos en false, para que vuelva a mezclar
                    hasValidAssignment = false;
                    break;
                }

                result.put(currentEmail, assignedEmail);
            }

            // Verificamos que todos los valores asignados sean únicos
            hasValidAssignment = hasValidAssignment && result.size() == emails.size();
        }
        return result;
    }

    private String sendEmail(String nameS, String nameR, Date date) {
        StringBuilder message = new StringBuilder();
        SimpleDateFormat formatter = new SimpleDateFormat("dd/MM/yyyy");
        message.append("<h3><strong>¡Muchas gracias por usar HappyLotto, ").append(nameR).append("!</strong></h3><br>")
                .append("<strong>Eres el responsable del regalo de:</strong><br><br>")
                .append("<strong>").append(nameS).append("<strong><br>")
                .append("<strong>Recuerda que el evento se realiza el día:</strong><br>")
                .append("<strong>").append(formatter.format(date)).append("</strong><br>")
                .append("<br><strong>¡La mejor de las suertes!</strong>");
        return message.toString();
    }

    private String getNameByEmail(Map<String, String> emailsMap, String email) {
        return emailsMap.get(email);  // Retorna el nombre asociado al email
    }

    @Override
    public ResponseEntity<String> saveLottery(List<Map<String, String>> participants, String name, Date date, Date endDate, Long userId) throws MessagingException {

        if (userId != 1){
            List<Lottery> lotteries = lotteryRepository.findLotteryByUserId(userId);
            for (Lottery lottery : lotteries) {
                if (lottery.getName().equals(name)) {
                    return new ResponseEntity<String>("No se ha podido realizar el sorteo, el usuario ya tiene un sorteo con ese nombre", HttpStatus.BAD_REQUEST);
                }
            }
        }

        // Crear un mapa de emails a nombres
        Map<String, String> emailsMap = participants.stream()
                .collect(Collectors.toMap(p -> p.get("email"), p -> p.get("name")));

        List<String> emails = new ArrayList<>(emailsMap.keySet());

        Map<String, String> results = doLottery(emails);

        Set<Relation> relations = new HashSet<>();

        Lottery lottery = new Lottery();

        try {
            for (Map.Entry<String, String> entry : results.entrySet()) {
                String senderEmail = entry.getKey();
                String receiverEmail = entry.getValue();

                // Llamar al método getNameByEmail para obtener los nombres
                String senderName = getNameByEmail(emailsMap, senderEmail);
                String receiverName = getNameByEmail(emailsMap, receiverEmail);

                // Crear la relación
                Relation relation = new Relation();
                relation.setEmail(senderEmail);  // Quién manda el regalo
                relation.setPresent(receiverEmail);  // Quién recibe el regalo
                relations.add(relation);

                // Generar el mensaje del correo
                String message = sendEmail(senderName, receiverName, endDate);
                EmailDTO emailDTO = new EmailDTO(receiverEmail, name, message);
                emailService.sendMail(emailDTO);

                log.info("se mando el mail");
            }

            relationRepository.saveAll(relations);

            lottery.setUserId(userId);
            lottery.setName(name);
            lottery.setDate(date);
            lottery.setEndDate(endDate);
            lottery.setRelations(relations);

            lotteryRepository.save(lottery);

            return new ResponseEntity<String>("Sorteo realizado con exito", HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<String>("No se ha podido realizar el sorteo" + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Override
    public ResponseEntity<String> findAll() {
        List<Lottery> lotteries = lotteryRepository.findAll();
        List<LotteryDTO> result = new ArrayList<>();
        for (Lottery lottery : lotteries) {
            Long id = lottery.getUserId();
            User user = userRepository.findUserById(id);
            LotteryDTO lotteryDTO = new LotteryDTO(lottery.getName(), lottery.getDate(), lottery.getEndDate(), user);
            result.add(lotteryDTO);
        }
        return new ResponseEntity<String>("Sorteos: " + result, HttpStatus.OK);
    }

    @Override
    public ResponseEntity<String> findLottery(Long id) {
        Optional<Lottery> lottery = lotteryRepository.findById(id);
        if (lottery.isPresent()) {
            return new ResponseEntity<String>("Sorteo: " + lottery, HttpStatus.OK);
        } else {
            return new ResponseEntity<String>("No se ha encontrado el sorteo", HttpStatus.BAD_REQUEST);
        }
    }

    @Override
    public ResponseEntity<String> findLotteryByName(String name) {
        List<Lottery> lottery = lotteryRepository.findByName(name);
        if (lottery.isEmpty()) {
            return new ResponseEntity<String>("No se ha encontrado el sorteo", HttpStatus.BAD_REQUEST);
        } else {
            return new ResponseEntity<String>("Sorteo: " + lottery, HttpStatus.OK);
        }
    }

    @Override
    public ResponseEntity<String> findLotteryByDate(Date date) {
        List<Lottery> lottery = lotteryRepository.findByDate(date);
        if (lottery.isEmpty()) {
            return new ResponseEntity<String>("No se ha encontrado el sorteo", HttpStatus.BAD_REQUEST);
        } else {
            return new ResponseEntity<String>("Sorteo: " + lottery, HttpStatus.OK);
        }
    }

    @Override
    public ResponseEntity<String> findLotteryByEndDate(Date endDate) {
        List<Lottery> lottery = lotteryRepository.findByEndDate(endDate);
        if (lottery.isEmpty()) {
            return new ResponseEntity<String>("No se ha encontrado el sorteo", HttpStatus.BAD_REQUEST);
        } else {
            return new ResponseEntity<String>("Sorteo: " + lottery, HttpStatus.OK);
        }
    }

    @Override
    public ResponseEntity<String> findLotteryByUserId(Long id) {
        List<Lottery> lotteries = lotteryRepository.findLotteryByUserId(id);
        return new ResponseEntity<String>("Sorteos del usuario: " + lotteries, HttpStatus.OK);
    }
}
