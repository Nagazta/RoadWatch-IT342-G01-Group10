package road.watch.it_342_g01.RoadWatch.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import road.watch.it_342_g01.RoadWatch.entity.ReportEntity;
import road.watch.it_342_g01.RoadWatch.entity.ReportHistoryEntity;
import road.watch.it_342_g01.RoadWatch.entity.inspectorEntity;
import road.watch.it_342_g01.RoadWatch.repository.ReportHistoryRepo;
import road.watch.it_342_g01.RoadWatch.repository.ReportRepo;
import road.watch.it_342_g01.RoadWatch.repository.inspectorRepo;
import road.watch.it_342_g01.RoadWatch.repository.userRepo;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Optional;

@Slf4j
@Service
@RequiredArgsConstructor
public class ReportService {

    @Autowired
    private ReportHistoryRepo historyRepository;

    private final ReportRepo reportRepo;

    @Autowired
    private userRepo userRepository;

    private final inspectorRepo inspectorRepo;

    @NonNull
    public List<ReportEntity> getAllReports() {
        return reportRepo.findAll();
    }

    @NonNull
    public Optional<ReportEntity> getReportById(@NonNull Long id) {
        return Objects.requireNonNull(reportRepo.findById(Objects.requireNonNull(id)));
    }

    @NonNull
    public ReportEntity createReport(@NonNull ReportEntity report) {
        return reportRepo.save(Objects.requireNonNull(report));
    }

    @NonNull
    public ReportEntity assignInspectorToReport(@NonNull Long reportId, @NonNull Long inspectorId) {
        // 1. Find the Report
        ReportEntity report = reportRepo.findById(Objects.requireNonNull(reportId))
                .orElseThrow(() -> new RuntimeException("Report not found with id: " + reportId));

        // 2. Find the Inspector
        inspectorEntity inspector = inspectorRepo.findById(Objects.requireNonNull(inspectorId))
                .orElseThrow(() -> new RuntimeException("Inspector not found with id: " + inspectorId));

        // 3. Link them together
        report.setAssignedInspector(inspector);
        report.setStatus("Assigned");

        // 4. Save
        return reportRepo.save(report);
    }

    @NonNull
    public ReportEntity updateReport(@NonNull Long id, @NonNull ReportEntity updatedReport) {
        return Objects.requireNonNull(
                reportRepo.findById(Objects.requireNonNull(id))
                        .map(existingReport -> {
                            existingReport.setTitle(updatedReport.getTitle());
                            existingReport.setDescription(updatedReport.getDescription());
                            existingReport.setCategory(updatedReport.getCategory());
                            existingReport.setLocation(updatedReport.getLocation());

                            // NEW
                            existingReport.setLatitude(updatedReport.getLatitude());
                            existingReport.setLongitude(updatedReport.getLongitude());

                            existingReport.setSubmittedBy(updatedReport.getSubmittedBy());
                            existingReport.setStatus(updatedReport.getStatus());
                            existingReport.setAdminNotes(updatedReport.getAdminNotes());

                            return reportRepo.save(existingReport);
                        })
                        .orElseThrow(() -> new RuntimeException("Report not found with id " + id)));
    }

    public void deleteReport(@NonNull Long id) {
        reportRepo.deleteById(Objects.requireNonNull(id));
    }

    @NonNull
    public List<ReportEntity> getReportsByEmail(@NonNull String email) {
        return Objects.requireNonNull(reportRepo.findBySubmittedBy(Objects.requireNonNull(email)));
    }

    @NonNull
    public List<ReportEntity> getReportsByInspector(@NonNull Long inspectorId) {
        return Objects.requireNonNull(reportRepo.findByAssignedInspector_Id(Objects.requireNonNull(inspectorId)));
    }

    // ========================================
    // 🆕 NEW METHODS: Edit with History Tracking
    // ========================================

    /**
     * Update report with history tracking
     */
    @Transactional
    @NonNull
    public ReportEntity updateReportWithHistory(
            @NonNull Long reportId,
            @NonNull Map<String, Object> updates,
            @NonNull Long updatedBy) {

        Objects.requireNonNull(reportId, "Report ID cannot be null");
        Objects.requireNonNull(updates, "Updates cannot be null");
        Objects.requireNonNull(updatedBy, "Updated by user ID cannot be null");

        log.info("📝 Updating report ID: {} by user: {}", reportId, updatedBy);

        ReportEntity report = reportRepo.findById(reportId)
                .orElseThrow(() -> new RuntimeException("Report not found with id: " + reportId));

        String changeReason = (String) updates.get("changeReason");
        String updatedByName = getUserName(updatedBy);

        // Track status change
        if (updates.containsKey("status")) {
            String oldStatus = report.getStatus();
            String newStatus = (String) updates.get("status");
            if (!oldStatus.equals(newStatus)) {
                report.setStatus(newStatus);
                logChange(reportId, "STATUS_CHANGED", updatedBy, updatedByName,
                        "status", oldStatus, newStatus, changeReason);
            }
        }

        // Track priority change
        if (updates.containsKey("priority")) {
            String oldPriority = report.getPriority();
            String newPriority = (String) updates.get("priority");
            if (oldPriority == null || !oldPriority.equals(newPriority)) {
                report.setPriority(newPriority);
                logChange(reportId, "UPDATED", updatedBy, updatedByName,
                        "priority", oldPriority, newPriority, changeReason);
            }
        }

        // Update inspector notes - ✅ WITH TRUNCATION
        if (updates.containsKey("inspectorNotes")) {
            String oldNotes = report.getInspectorNotes();
            String newNotes = (String) updates.get("inspectorNotes");
            if (newNotes != null && !newNotes.equals(oldNotes)) {
                report.setInspectorNotes(newNotes);
                logChange(reportId, "UPDATED", updatedBy, updatedByName,
                        "inspectorNotes",
                        truncateForHistory(oldNotes, 200), // ✅ Truncate to 200 chars
                        truncateForHistory(newNotes, 200), // ✅ Truncate to 200 chars
                        changeReason);
            }
        }

        // Update admin notes - ✅ WITH TRUNCATION
        if (updates.containsKey("adminNotes")) {
            String oldNotes = report.getAdminNotes();
            String newNotes = (String) updates.get("adminNotes");
            if (newNotes != null && !newNotes.equals(oldNotes)) {
                report.setAdminNotes(newNotes);
                logChange(reportId, "UPDATED", updatedBy, updatedByName,
                        "adminNotes",
                        truncateForHistory(oldNotes, 200), // ✅ Truncate to 200 chars
                        truncateForHistory(newNotes, 200), // ✅ Truncate to 200 chars
                        changeReason);
            }
        }

        // Update estimated completion date
        if (updates.containsKey("estimatedCompletionDate")) {
            String oldDate = report.getEstimatedCompletionDate();
            String newDate = (String) updates.get("estimatedCompletionDate");
            if (newDate != null && !newDate.equals(oldDate)) {
                report.setEstimatedCompletionDate(newDate);
                logChange(reportId, "UPDATED", updatedBy, updatedByName,
                        "estimatedCompletionDate",
                        oldDate != null ? oldDate : "Not set",
                        newDate,
                        changeReason);
            }
        }

        report.setUpdatedAt(LocalDateTime.now());
        ReportEntity savedReport = reportRepo.save(report);

        log.info("✅ Report updated successfully: {}", reportId);
        return savedReport;
    }

    /**
     * Get report history
     */
    @NonNull
    public List<ReportHistoryEntity> getReportHistory(@NonNull Long reportId) {
        Objects.requireNonNull(reportId, "Report ID cannot be null");
        log.info("📜 Fetching history for report ID: {}", reportId);
        return Objects.requireNonNull(historyRepository.findByReportIdOrderByTimestampDesc(reportId));
    }

    /**
     * Truncate text for history display (optional, for very long notes)
     */
    private String truncateForHistory(String text, int maxLength) {
        if (text == null || text.isEmpty()) {
            return "(empty)";
        }
        if (text.length() <= maxLength) {
            return text;
        }
        return text.substring(0, maxLength) + "...";
    }

    /**
     * Log a change to report history
     */
    private void logChange(
            @NonNull Long reportId,
            @NonNull String action,
            @NonNull Long updatedBy,
            String updatedByName,
            String fieldName,
            String oldValue,
            String newValue,
            String changeReason) {

        ReportHistoryEntity history = new ReportHistoryEntity();
        history.setReportId(reportId);
        history.setAction(action);
        history.setUpdatedBy(updatedBy);
        history.setUpdatedByName(updatedByName);
        history.setFieldName(fieldName);
        history.setOldValue(oldValue);
        history.setNewValue(newValue);
        history.setChangeReason(changeReason);
        history.setTimestamp(LocalDateTime.now());

        historyRepository.save(history);
        log.info("📝 Logged change: {} for report {}", action, reportId);
    }

    /**
     * Get user name by ID
     */
    @NonNull
    private String getUserName(@NonNull Long userId) {
        return Objects.requireNonNull(
                userRepository.findById(Objects.requireNonNull(userId))
                        .map(user -> user.getName())
                        .orElse("Unknown User"));
    }
}