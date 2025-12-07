package road.watch.it_342_g01.RoadWatch.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import road.watch.it_342_g01.RoadWatch.entity.adminEntity;

import java.util.Optional;

@Repository
public interface adminRepo extends JpaRepository<adminEntity, Long> {

    /**
     * Find admin by user ID
     */
    Optional<adminEntity> findByUser_Id(Long userId);
}