package app.ms_user.domain;

import jakarta.persistence.*;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.hibernate.annotations.DynamicInsert;
import org.hibernate.annotations.DynamicUpdate;

import java.util.List;

@Data
@Entity
@DynamicUpdate
@DynamicInsert
@RequiredArgsConstructor
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "email", nullable = false)
    private String email;

    @Column(name = "number", nullable = true)
    private String number;

    @Column(name = "password")
    private String password;

    @Column(name = "status")
    private String status;

    @Column(name = "rol")
    private String rol;

    @Transient
    protected List<Lottery> lotteries;
}
