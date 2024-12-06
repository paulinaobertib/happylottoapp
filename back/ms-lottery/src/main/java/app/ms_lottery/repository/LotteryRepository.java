package app.ms_lottery.repository;

import app.ms_lottery.domain.Lottery;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.Date;
import java.util.List;
import java.util.Optional;

public interface LotteryRepository extends JpaRepository<Lottery, Long> {

    @Query("select l from Lottery l where l.name = ?1")
    List<Lottery> findByName(String name);

    @Query("select l from Lottery l where l.date = ?1")
    List<Lottery> findByDate(Date date);

    @Query("select l from Lottery l where l.endDate = ?1")
    List<Lottery> findByEndDate(Date endDate);

    @Query("select l from Lottery l where l.userId = ?1")
    List<Lottery> findLotteryByUserId(Long id);
}
