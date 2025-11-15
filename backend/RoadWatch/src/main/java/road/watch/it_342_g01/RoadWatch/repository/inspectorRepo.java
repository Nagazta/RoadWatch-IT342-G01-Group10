package road.watch.it_342_g01.RoadWatch.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import road.watch.it_342_g01.RoadWatch.entity.inspectorEntity;

import java.util.Optional;

@Repository
public interface inspectorRepo extends JpaRepository<inspectorEntity, Long> {
    Optional<inspectorEntity> findByUser_Id(Long userId);
}