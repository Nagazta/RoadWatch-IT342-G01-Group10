package road.watch.it_342_g01.RoadWatch.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import road.watch.it_342_g01.RoadWatch.entity.citizenEntity;

import java.util.Optional;

@Repository
public interface citizenRepo extends JpaRepository<citizenEntity, Long> {
    Optional<citizenEntity> findByUser_Id(Long userId);
    Optional<citizenEntity> findByGoogleId(String googleId);
}