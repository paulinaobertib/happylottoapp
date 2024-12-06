package app.ms_user.service;

import app.ms_user.service.impl.EmailService;
import app.ms_user.util.MailBody;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;

@ExtendWith(MockitoExtension.class)
public class EmailServiceTest {

    @Mock
    private JavaMailSender javaMailSender;

    @InjectMocks
    private EmailService emailService;

    @Test
    public void testSendMailOK() {
        MailBody mailBody = new MailBody(
                "test@example.com",
                "Test Subject",
                "Test Message Body"
        );

        ArgumentCaptor<SimpleMailMessage> captor = ArgumentCaptor.forClass(SimpleMailMessage.class);

        emailService.sendSimpleMessage(mailBody);

        verify(javaMailSender, times(1)).send(captor.capture());

        SimpleMailMessage sentMessage = captor.getValue();
        assertEquals("test@example.com", sentMessage.getTo()[0]);
        assertEquals("Test Subject", sentMessage.getSubject());
        assertEquals("Test Message Body", sentMessage.getText());
    }
}

