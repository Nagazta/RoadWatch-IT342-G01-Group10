package road.watch.it_342_g01.RoadWatch.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import road.watch.it_342_g01.RoadWatch.entity.ReportEntity;
import java.util.List;

@Repository
public interface ReportRepo extends JpaRepository<ReportEntity, Long>
{
    List<ReportEntity> findByTitleContainingIgnoreCase(String title);
    List<ReportEntity> findByCategory(String category);
    List<ReportEntity> findByStatus(String status);
    List<ReportEntity> findBySubmittedBy(String submittedBy);
}
