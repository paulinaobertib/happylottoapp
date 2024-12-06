package app.ms_lottery.dto;

import app.ms_lottery.domain.feign.User;
import lombok.AllArgsConstructor;
import lombok.Data;
import java.util.Date;

@AllArgsConstructor
@Data
public class LotteryDTO {
    private String name;
    private Date date;
    private Date endDate;
    private User user;
}
