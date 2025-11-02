package road.watch.it_342_g01.RoadWatch.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import road.watch.it_342_g01.RoadWatch.entity.userEntity;

import java.util.Optional;

@Repository
public interface userRepo extends JpaRepository<userEntity, Long> {
    Optional<userEntity> findByEmail(String email);
    Optional<userEntity> findBySupabaseId(String supabaseId);
}