package road.watch.it_342_g01.RoadWatch.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import road.watch.it_342_g01.RoadWatch.entity.AuditLogEntity;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface AuditLogRepo extends JpaRepository<AuditLogEntity, Long> {

    // Find by user
    Page<AuditLogEntity> findByUser_IdOrderByDateTimeDesc(Long userId, Pageable pageable);

    // Find by action
    Page<AuditLogEntity> findByActionOrderByDateTimeDesc(String action, Pageable pageable);

    // Find by status
    Page<AuditLogEntity> findByStatusOrderByDateTimeDesc(String status, Pageable pageable);

    // Find by date range
    Page<AuditLogEntity> findByDateTimeBetweenOrderByDateTimeDesc(
            LocalDateTime startDate,
            LocalDateTime endDate,
            Pageable pageable);

    // FIXED: Simplified search query using nativeQuery with explicit type casting
    @Query(value = "SELECT a.* FROM audit_logs a " +
            "LEFT JOIN users u ON u.id = a.user_id " +
            "WHERE (:search IS NULL OR :search = '' OR " +
            "LOWER(COALESCE(u.name, '')) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
            "LOWER(COALESCE(u.email, '')) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
            "LOWER(COALESCE(u.username, '')) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
            "LOWER(a.action) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
            "LOWER(COALESCE(a.description, '')) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
            "LOWER(a.audit_id) LIKE LOWER(CONCAT('%', :search, '%'))) " +
            "AND (:action IS NULL OR :action = 'All Activities' OR a.action = :action) " +
            "AND (:status IS NULL OR a.status = :status) " +
            "AND (CAST(:startDate AS timestamp) IS NULL OR a.date_time >= CAST(:startDate AS timestamp)) " +
            "AND (CAST(:endDate AS timestamp) IS NULL OR a.date_time <= CAST(:endDate AS timestamp)) " +
            "ORDER BY a.date_time DESC", countQuery = "SELECT COUNT(*) FROM audit_logs a " +
                    "LEFT JOIN users u ON u.id = a.user_id " +
                    "WHERE (:search IS NULL OR :search = '' OR " +
                    "LOWER(COALESCE(u.name, '')) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
                    "LOWER(COALESCE(u.email, '')) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
                    "LOWER(COALESCE(u.username, '')) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
                    "LOWER(a.action) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
                    "LOWER(COALESCE(a.description, '')) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
                    "LOWER(a.audit_id) LIKE LOWER(CONCAT('%', :search, '%'))) " +
                    "AND (:action IS NULL OR :action = 'All Activities' OR a.action = :action) " +
                    "AND (:status IS NULL OR a.status = :status) " +
                    "AND (CAST(:startDate AS timestamp) IS NULL OR a.date_time >= CAST(:startDate AS timestamp)) " +
                    "AND (CAST(:endDate AS timestamp) IS NULL OR a.date_time <= CAST(:endDate AS timestamp))", nativeQuery = true)
    Page<AuditLogEntity> searchAuditLogs(
            @Param("search") String search,
            @Param("action") String action,
            @Param("status") String status,
            @Param("startDate") LocalDateTime startDate,
            @Param("endDate") LocalDateTime endDate,
            Pageable pageable);

    // Statistics queries
    long countByStatus(String status);

    long countByAction(String action);

    long countByDateTimeBetween(LocalDateTime startDate, LocalDateTime endDate);

    @Query("SELECT a.action, COUNT(a) FROM AuditLogEntity a GROUP BY a.action")
    List<Object[]> countByActionGrouped();

    // Find all ordered by date descending
    Page<AuditLogEntity> findAllByOrderByDateTimeDesc(Pageable pageable);

    // Find by entity type and ID
    List<AuditLogEntity> findByEntityTypeAndEntityIdOrderByDateTimeDesc(String entityType, Long entityId);
}