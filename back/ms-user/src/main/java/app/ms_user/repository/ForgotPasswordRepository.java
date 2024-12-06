package app.ms_user.repository;

import app.ms_user.domain.ForgotPassword;
import app.ms_user.domain.User;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ForgotPasswordRepository extends JpaRepository<ForgotPassword, Integer> {

    @Query("select fp from ForgotPassword fp where fp.otp = ?1 and fp.user = ?2")
    Optional<ForgotPassword> findByOtpAndUser(Integer otp, User user);

    @Transactional
    @Modifying
    @Query("delete from ForgotPassword fp where fp.user.id = ?1")
    void deleteOtp(Long user_id);
}
