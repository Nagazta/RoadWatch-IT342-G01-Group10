package road.watch.it_342_g01.RoadWatch.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import road.watch.it_342_g01.RoadWatch.entity.FeedbackEntity;

import java.util.List;

@Repository
public interface FeedbackRepo extends JpaRepository<FeedbackEntity, Long> {
    List<FeedbackEntity> findBySubmittedBy_Id(Long userId); // ✅ Find by user ID

    List<FeedbackEntity> findByStatus(String status);

    List<FeedbackEntity> findByCategory(String category);

    List<FeedbackEntity> findByStatusAndCategory(String status, String category);

    List<FeedbackEntity> findAllByOrderByDateSubmittedDesc();

    long countByStatus(String status);
}