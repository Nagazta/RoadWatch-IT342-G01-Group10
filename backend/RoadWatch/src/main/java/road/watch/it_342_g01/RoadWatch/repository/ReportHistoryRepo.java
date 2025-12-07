package road.watch.it_342_g01.RoadWatch.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import road.watch.it_342_g01.RoadWatch.entity.ReportHistoryEntity;

import java.util.List;

@Repository
public interface ReportHistoryRepo extends JpaRepository<ReportHistoryEntity, Long> {

    /**
     * Find all history entries for a report, ordered by timestamp descending
     */
    List<ReportHistoryEntity> findByReportIdOrderByTimestampDesc(Long reportId);
}