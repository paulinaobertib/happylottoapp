package app.ms_lottery.domain;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.DynamicInsert;
import org.hibernate.annotations.DynamicUpdate;

@Data
@AllArgsConstructor
@NoArgsConstructor
@DynamicUpdate
@DynamicInsert
@Entity
@Table(name = "relation")
public class Relation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // representa quien manda el regalo
    @Column(name = "email", nullable = false)
    private String email;

    // representa quien recibe el regalo
    @Column(name = "present", nullable = false)
    private String present;
}
