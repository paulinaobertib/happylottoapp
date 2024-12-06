package app.ms_user.util;

import lombok.Builder;

@Builder
public record MailBody(String to, String subject, String text) {

}
