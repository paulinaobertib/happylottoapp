package app.ms_lottery.service.interf;

import app.ms_lottery.dto.EmailDTO;
import jakarta.mail.MessagingException;

public interface IEmailService {
    void sendMail(EmailDTO emailDTO) throws MessagingException;
}
