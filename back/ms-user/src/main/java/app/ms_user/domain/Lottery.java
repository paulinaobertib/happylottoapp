package app.ms_user.domain;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.Date;

@AllArgsConstructor
@Data
public class Lottery {
    private Long id;
    private String name;
    private Date date;
    private Date endDate;
}
