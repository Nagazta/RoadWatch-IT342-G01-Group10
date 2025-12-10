package road.watch.it_342_g01.RoadWatch.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import road.watch.it_342_g01.RoadWatch.dto.AuditLogDTO;
import road.watch.it_342_g01.RoadWatch.entity.AuditLogEntity;
import road.watch.it_342_g01.RoadWatch.entity.userEntity;
import road.watch.it_342_g01.RoadWatch.repository.AuditLogRepo;
import road.watch.it_342_g01.RoadWatch.repository.userRepo;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class AuditLogService {

    private final AuditLogRepo auditLogRepo;
    private final userRepo userRepository;

    /**
     * Get all audit logs with filters and pagination
     */
    public Page<AuditLogDTO> getAuditLogs(
            String search,
            String action,
            String status,
            LocalDateTime startDate,
            LocalDateTime endDate,
            int page,
            int size) {

        Pageable pageable = PageRequest.of(page, size);

        // CRITICAL FIX: Convert empty strings to null to avoid PostgreSQL type
        // inference issues
        String searchParam = (search != null && !search.trim().isEmpty()) ? search.trim() : null;
        String actionParam = (action != null && !action.trim().isEmpty() && !"All Activities".equals(action))
                ? action.trim()
                : null;
        String statusParam = (status != null && !status.trim().isEmpty()) ? status.trim() : null;

        // IMPORTANT: Ensure dates are either null or valid LocalDateTime
        LocalDateTime startDateParam = startDate;
        LocalDateTime endDateParam = endDate;

        log.debug("Search params - search: {}, action: {}, status: {}, startDate: {}, endDate: {}",
                searchParam, actionParam, statusParam, startDateParam, endDateParam);

        Page<AuditLogEntity> entities = auditLogRepo.searchAuditLogs(
                searchParam,
                actionParam,
                statusParam,
                startDateParam,
                endDateParam,
                pageable);

        return entities.map(AuditLogDTO::fromEntity);
    }

    /**
     * Get all audit logs without filters (for admin view)
     */
    public Page<AuditLogDTO> getAllAuditLogs(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<AuditLogEntity> entities = auditLogRepo.findAllByOrderByDateTimeDesc(pageable);
        return entities.map(AuditLogDTO::fromEntity);
    }

    /**
     * Create audit log entry
     */
    @Transactional
    public AuditLogEntity createAuditLog(
            String action,
            String description,
            Long userId,
            String status,
            String ipAddress,
            String entityType,
            Long entityId,
            String oldValue,
            String newValue) {

        if (action == null || description == null) {
            throw new IllegalArgumentException("Action and description are required");
        }

        AuditLogEntity auditLog = AuditLogEntity.builder()
                .action(action)
                .description(description)
                .status(status != null ? status : "Success")
                .ipAddress(ipAddress)
                .entityType(entityType)
                .entityId(entityId)
                .oldValue(oldValue)
                .newValue(newValue)
                .dateTime(LocalDateTime.now())
                .build();

        if (userId != null) {
            userEntity user = userRepository.findById(userId).orElse(null);
            if (user != null) {
                auditLog.setUser(user);
                String roleStr = user.getRole() != null ? user.getRole().toString() : "UNKNOWN";
                auditLog.setUserRole(roleStr);
            }
        } else {
            auditLog.setUserRole("System");
        }

        AuditLogEntity saved = auditLogRepo.save(auditLog);
        log.info("📋 Audit log created: {} - {}", saved.getAuditId(), action);

        return saved;
    }

    /**
     * Convenient method for simple audit logging
     */
    @Transactional
    public void logAction(Long userId, String action, String description) {
        if (action == null || description == null) {
            log.warn("⚠️ Skipping audit log - null action or description");
            return;
        }
        createAuditLog(action, description, userId, "Success", null, null, null, null, null);
    }

    /**
     * Log with IP address
     */
    @Transactional
    public void logActionWithIp(Long userId, String action, String description, String ipAddress) {
        if (action == null || description == null) {
            log.warn("⚠️ Skipping audit log - null action or description");
            return;
        }
        createAuditLog(action, description, userId, "Success", ipAddress, null, null, null, null);
    }

    /**
     * Log entity changes
     */
    @Transactional
    public void logEntityChange(
            Long userId,
            String action,
            String description,
            String entityType,
            Long entityId,
            String oldValue,
            String newValue) {

        if (action == null || description == null) {
            log.warn("⚠️ Skipping audit log - null action or description");
            return;
        }

        createAuditLog(action, description, userId, "Success", null,
                entityType, entityId, oldValue, newValue);
    }

    /**
     * Get audit logs for specific entity
     */
    public List<AuditLogDTO> getEntityAuditLogs(String entityType, Long entityId) {
        if (entityType == null || entityId == null) {
            return List.of();
        }

        List<AuditLogEntity> entities = auditLogRepo.findByEntityTypeAndEntityIdOrderByDateTimeDesc(
                entityType, entityId);
        return entities.stream()
                .map(AuditLogDTO::fromEntity)
                .collect(Collectors.toList());
    }

    /**
     * Get audit log statistics
     */
    public Map<String, Object> getAuditStatistics() {
        Map<String, Object> stats = new HashMap<>();

        stats.put("totalLogs", auditLogRepo.count());
        stats.put("successCount", auditLogRepo.countByStatus("Success"));
        stats.put("failedCount", auditLogRepo.countByStatus("Failed"));
        stats.put("systemCount", auditLogRepo.countByStatus("System"));

        // Get today's logs
        LocalDateTime startOfDay = LocalDateTime.now().withHour(0).withMinute(0).withSecond(0);
        LocalDateTime endOfDay = LocalDateTime.now().withHour(23).withMinute(59).withSecond(59);
        stats.put("todayCount", auditLogRepo.countByDateTimeBetween(startOfDay, endOfDay));

        // Get activity breakdown
        List<Object[]> activityBreakdown = auditLogRepo.countByActionGrouped();
        Map<String, Long> activityMap = new HashMap<>();
        for (Object[] row : activityBreakdown) {
            activityMap.put((String) row[0], (Long) row[1]);
        }
        stats.put("activityBreakdown", activityMap);

        return stats;
    }

    /**
     * Get available actions for filter dropdown
     */
    public List<String> getAvailableActions() {
        return List.of(
                "All Activities",
                "Login",
                "Logout",
                "User Modification",
                "User Creation",
                "User Deletion",
                "Report Submission",
                "Report Update",
                "Report Deletion",
                "System Change",
                "Account Update",
                "Automated Process",
                "Notification");
    }

    /**
     * Delete old audit logs (for maintenance)
     */
    @Transactional
    public long deleteOldLogs(int daysToKeep) {
        LocalDateTime cutoffDate = LocalDateTime.now().minusDays(daysToKeep);
        List<AuditLogEntity> oldLogs = auditLogRepo.findByDateTimeBetweenOrderByDateTimeDesc(
                LocalDateTime.now().minusYears(10),
                cutoffDate,
                Pageable.unpaged()).getContent();

        long count = oldLogs.size();
        auditLogRepo.deleteAll(oldLogs);

        log.info("🗑️ Deleted {} audit logs older than {} days", count, daysToKeep);
        return count;
    }
}