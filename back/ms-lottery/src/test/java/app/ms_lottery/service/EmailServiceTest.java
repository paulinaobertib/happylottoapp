package app.ms_lottery.service;

import app.ms_lottery.dto.EmailDTO;
import app.ms_lottery.service.impl.EmailService;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.mail.javamail.JavaMailSender;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class EmailServiceTest {

    @Mock
    private JavaMailSender javaMailSender;

    @Mock
    private TemplateEngine templateEngine;

    @InjectMocks
    private EmailService emailService;

    @Test
    void sendMailOK() throws MessagingException {
        EmailDTO emailDTO = new EmailDTO("receiver@example.com", "Test Subject", "Test Message");

        MimeMessage mimeMessage = mock(MimeMessage.class);
        when(javaMailSender.createMimeMessage()).thenReturn(mimeMessage);
        when(templateEngine.process(eq("email"), any(Context.class))).thenReturn("<html><body>Test Message</body></html>");

        emailService.sendMail(emailDTO);

        verify(javaMailSender, times(1)).send(mimeMessage); // Verifica que se envió el mensaje
        verify(templateEngine, times(1)).process(eq("email"), any(Context.class)); // Verifica que se procesó el template
    }
}

