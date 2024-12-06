package app.ms_user.service.impl;

import app.ms_user.util.MailBody;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.MailException;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class EmailService {

    private final JavaMailSender javaMailSender;

    @Value("${spring.mail.username}")
    private String fromEmail;

    public void sendSimpleMessage(MailBody mailBody){
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(mailBody.to());
            message.setFrom(fromEmail);
            message.setSubject(mailBody.subject());
            message.setText(mailBody.text());

            javaMailSender.send(message);
        } catch (MailException e) {
            // Manejar el error, por ejemplo, registrarlo
            System.out.println("Error al enviar el correo: " + e.getMessage());
        }
    }

}
