package app.ms_lottery.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class EmailDTO {
    private String receiver;

    private String subject;

    private String message;
}
