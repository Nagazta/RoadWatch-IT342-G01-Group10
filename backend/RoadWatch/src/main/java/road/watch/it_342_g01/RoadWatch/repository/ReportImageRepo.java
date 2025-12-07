package road.watch.it_342_g01.RoadWatch.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import road.watch.it_342_g01.RoadWatch.entity.ReportImageEntity;
import java.util.List;

@Repository
public interface ReportImageRepo extends JpaRepository<ReportImageEntity, Long> {
    List<ReportImageEntity> findByReportId(Long reportId);
}