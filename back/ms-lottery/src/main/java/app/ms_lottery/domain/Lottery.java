package app.ms_lottery.domain;

import app.ms_lottery.domain.feign.User;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.DynamicInsert;
import org.hibernate.annotations.DynamicUpdate;

import java.util.Date;
import java.util.HashSet;
import java.util.Set;

@Data
@AllArgsConstructor
@NoArgsConstructor
@DynamicUpdate
@DynamicInsert
@Entity
@Table(name = "lottery")
public class Lottery {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "date", nullable = false)
    private Date date;

    @Column(name = "endDate", nullable = false)
    private Date endDate;

    @OneToMany(cascade = {CascadeType.PERSIST, CascadeType.MERGE})
    private Set<Relation> relations = new HashSet<>();

    @Column(name ="user_id",nullable = false)
    private Long userId;
}

// user, y validar que un mismo usuario no pueda poner dos nombres iguales
