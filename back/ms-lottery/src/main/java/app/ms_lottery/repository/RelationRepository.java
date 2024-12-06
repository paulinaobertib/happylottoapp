package app.ms_lottery.repository;

import app.ms_lottery.domain.Relation;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RelationRepository extends JpaRepository<Relation, Long> {
}
