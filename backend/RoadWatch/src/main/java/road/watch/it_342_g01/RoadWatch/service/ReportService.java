package road.watch.it_342_g01.RoadWatch.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
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

    public List<ReportEntity> getAllReports() {
        return reportRepo.findAll();
    }

    public Optional<ReportEntity> getReportById(Long id) {
        return reportRepo.findById(id);
    }

    public ReportEntity createReport(ReportEntity report) {
        return reportRepo.save(report);
    }

    public ReportEntity assignInspectorToReport(Long reportId, Long inspectorId) {
        // 1. Find the Report
        ReportEntity report = reportRepo.findById(reportId)
                .orElseThrow(() -> new RuntimeException("Report not found with id: " + reportId));

        // 2. Find the Inspector
        inspectorEntity inspector = inspectorRepo.findById(inspectorId)
                .orElseThrow(() -> new RuntimeException("Inspector not found with id: " + inspectorId));

        // 3. Link them together
        report.setAssignedInspector(inspector);
        report.setStatus("Assigned");

        // 4. Save
        return reportRepo.save(report);
    }

    public ReportEntity updateReport(Long id, ReportEntity updatedReport) {
        return reportRepo.findById(id)
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
                .orElseThrow(() -> new RuntimeException("Report not found with id " + id));
    }

    public void deleteReport(Long id) {
        reportRepo.deleteById(id);
    }

    public List<ReportEntity> getReportsByEmail(String email) {
        return reportRepo.findBySubmittedBy(email);
    }

    public List<ReportEntity> getReportsByInspector(Long inspectorId) {
        return reportRepo.findByAssignedInspector_Id(inspectorId);
    }

    // ========================================
    // 🆕 NEW METHODS: Edit with History Tracking
    // ========================================

    /**
     * Update report with history tracking
     */
    @Transactional
    public ReportEntity updateReportWithHistory(Long reportId, Map<String, Object> updates, Long updatedBy) {
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

        // Update inspector notes
        if (updates.containsKey("inspectorNotes")) {
            String oldNotes = report.getInspectorNotes();
            String newNotes = (String) updates.get("inspectorNotes");
            if (newNotes != null && !newNotes.equals(oldNotes)) {
                report.setInspectorNotes(newNotes);
                logChange(reportId, "UPDATED", updatedBy, updatedByName,
                        "inspectorNotes",
                        oldNotes != null ? "Previous notes" : "No notes",
                        "Notes updated",
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
    public List<ReportHistoryEntity> getReportHistory(Long reportId) {
        log.info("📜 Fetching history for report ID: {}", reportId);
        return historyRepository.findByReportIdOrderByTimestampDesc(reportId);
    }

    /**
     * Log a change to report history
     */
    private void logChange(Long reportId, String action, Long updatedBy, String updatedByName,
            String fieldName, String oldValue, String newValue, String changeReason) {
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
    private String getUserName(Long userId) {
        return userRepository.findById(userId)
                .map(user -> user.getName())
                .orElse("Unknown User");
    }

    public List<ReportEntity> getMyAssignedReports(Long inspectorId) {
        return reportRepo.findByAssignedInspector_Id(inspectorId);
    }

    public ReportEntity updateReportStatus(Long reportId, String newStatus) {
        return reportRepo.findById(reportId)
                .map(report -> {
                    report.setStatus(newStatus);
                    return reportRepo.save(report);
                })
                .orElseThrow(() -> new RuntimeException("Report not found with id: " + reportId));
    }

    public ReportEntity addCommentToReport(Long reportId, String comment) {
        return reportRepo.findById(reportId)
                .map(report -> {
                    String existingNotes = report.getAdminNotes() != null ? report.getAdminNotes() : "";
                    String timestamp = java.time.LocalDateTime.now().toString();
                    String newNote = existingNotes + (existingNotes.isEmpty() ? "" : "\n---\n") + 
                                   "[" + timestamp + "] " + comment;
                    report.setAdminNotes(newNote);
                    return reportRepo.save(report);
                })
                .orElseThrow(() -> new RuntimeException("Report not found with id: " + reportId));
    }
}
