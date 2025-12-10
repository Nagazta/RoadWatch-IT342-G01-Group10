package road.watch.it_342_g01.RoadWatch.controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.lang.NonNull;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import road.watch.it_342_g01.RoadWatch.entity.ReportEntity;
import road.watch.it_342_g01.RoadWatch.entity.ReportHistoryEntity;
import road.watch.it_342_g01.RoadWatch.entity.ReportImageEntity;
import road.watch.it_342_g01.RoadWatch.entity.inspectorEntity;
import road.watch.it_342_g01.RoadWatch.service.ReportService;
import road.watch.it_342_g01.RoadWatch.service.ReportService2;
import road.watch.it_342_g01.RoadWatch.service.ImageUploadService;
import road.watch.it_342_g01.RoadWatch.service.AuditLogService;
import road.watch.it_342_g01.RoadWatch.security.JwtUtil;
import road.watch.it_342_g01.RoadWatch.repository.inspectorRepo;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;

@Slf4j
@RestController
@RequestMapping("/api/reports")
@RequiredArgsConstructor
public class ReportController {

    private final ReportService reportService;
    private final JwtUtil jwtUtil;
    private final inspectorRepo inspectorRepository;
    private final ImageUploadService imageUploadService;
    private final AuditLogService auditLogService;

    @Autowired
    private ReportService2 reportService2;

    @GetMapping("/getAll")
    public ResponseEntity<List<ReportEntity>> getAllReports() {
        List<ReportEntity> reports = reportService.getAllReports();
        return ResponseEntity.ok(reports);
    }

    @GetMapping("/getBy/{id}")
    public ResponseEntity<ReportEntity> getReportById(@PathVariable @NonNull Long id) {
        return reportService.getReportById(Objects.requireNonNull(id))
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/inspector/{inspectorId}")
    public ResponseEntity<List<ReportEntity>> getReportsByInspector(@PathVariable @NonNull Long inspectorId) {
        log.info("📋 Fetching reports for inspector ID: {}", inspectorId);
        List<ReportEntity> reports = reportService.getReportsByInspector(Objects.requireNonNull(inspectorId));
        return ResponseEntity.ok(reports);
    }

    @GetMapping("/getAll/name")
    public ResponseEntity<List<ReportEntity>> getAllReportsByName(@RequestParam @NonNull String submittedBy) {
        List<ReportEntity> reports = reportService2.getAllReportsByName(Objects.requireNonNull(submittedBy));
        return ResponseEntity.ok(reports);
    }

    @GetMapping("/getByEmail")
    public ResponseEntity<List<ReportEntity>> getReportsByEmail(@RequestParam @NonNull String email) {
        List<ReportEntity> reports = reportService.getReportsByEmail(Objects.requireNonNull(email));
        return ResponseEntity.ok(reports);
    }

    @PostMapping("/add")
    public ResponseEntity<ReportEntity> createReport(@RequestBody @NonNull ReportEntity report) {
        ReportEntity createdReport = reportService.createReport(Objects.requireNonNull(report));

        // ✅ Audit log: Report created
        auditLogService.logEntityChange(
                null, // ReportEntity doesn't have userId, use null or get from context if available
                "Report Submission",
                "Created new report: " + report.getTitle() + " at: " +
                        (report.getLocation() != null ? report.getLocation() : "Unknown location") +
                        " by: " + (report.getSubmittedBy() != null ? report.getSubmittedBy() : "Unknown"),
                "REPORT",
                createdReport.getId(),
                null,
                "PENDING");

        return ResponseEntity.ok(createdReport);
    }

    @PostMapping("/add2")
    public ResponseEntity<ReportEntity> createReport2(
            @RequestBody @NonNull ReportEntity report,
            @RequestParam @NonNull String submittedBy) {
        ReportEntity newReport = reportService2.createReport(
                Objects.requireNonNull(report),
                Objects.requireNonNull(submittedBy));

        // ✅ Audit log: Report created
        auditLogService.logEntityChange(
                null,
                "Report Submission",
                "User " + submittedBy + " created report: " + report.getTitle() + " at: " +
                        (report.getLocation() != null ? report.getLocation() : "Unknown"),
                "REPORT",
                newReport.getId(),
                null,
                "PENDING");

        return ResponseEntity.ok(newReport);
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<ReportEntity> updateReport(
            @PathVariable @NonNull Long id,
            @RequestBody @NonNull ReportEntity updatedReport) {
        ReportEntity report = reportService.updateReport(
                Objects.requireNonNull(id),
                Objects.requireNonNull(updatedReport));

        // ✅ Audit log: Report updated
        auditLogService.logEntityChange(
                null,
                "Report Update",
                "Report #" + id + " updated",
                "REPORT",
                id,
                null,
                null);

        return ResponseEntity.ok(report);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateReportWithHistory(
            @PathVariable @NonNull Long id,
            @RequestBody @NonNull Map<String, Object> updates) {
        try {
            Objects.requireNonNull(id, "Report ID cannot be null");
            Objects.requireNonNull(updates, "Updates cannot be null");

            log.info("📝 Received update request for report ID: {}", id);
            log.info("📝 Update data: {}", updates);

            Long updatedBy = updates.containsKey("updatedBy")
                    ? Long.parseLong(updates.get("updatedBy").toString())
                    : null;

            if (updatedBy == null) {
                log.error("❌ Missing updatedBy in request");
                return ResponseEntity.badRequest()
                        .body(Map.of("success", false, "error", "updatedBy is required"));
            }

            ReportEntity updated = reportService.updateReportWithHistory(
                    Objects.requireNonNull(id),
                    updates,
                    Objects.requireNonNull(updatedBy));

            // ✅ Audit log: Report updated with history
            String changeDesc = "Updated report fields: " + String.join(", ", updates.keySet());
            auditLogService.logEntityChange(
                    updatedBy,
                    "Report Update",
                    changeDesc,
                    "REPORT",
                    id,
                    null,
                    null);

            log.info("✅ Report {} updated successfully", id);

            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "message", "Report updated successfully",
                    "data", updated));
        } catch (Exception e) {
            log.error("❌ Failed to update report {}: {}", id, e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(Map.of("success", false, "error", e.getMessage()));
        }
    }

    @GetMapping("/{id}/history")
    public ResponseEntity<?> getReportHistory(@PathVariable @NonNull Long id) {
        try {
            log.info("📜 Fetching history for report ID: {}", id);
            List<ReportHistoryEntity> history = reportService.getReportHistory(Objects.requireNonNull(id));

            log.info("✅ Found {} history entries for report {}", history.size(), id);
            return ResponseEntity.ok(history);
        } catch (Exception e) {
            log.error("❌ Failed to fetch history for report {}: {}", id, e.getMessage());
            return ResponseEntity.badRequest()
                    .body(Map.of("success", false, "error", e.getMessage()));
        }
    }

    @PutMapping("/{reportId}/assign/{inspectorId}")
    public ResponseEntity<ReportEntity> assignInspector(
            @PathVariable @NonNull Long reportId,
            @PathVariable @NonNull Long inspectorId) {

        ReportEntity updatedReport = reportService.assignInspectorToReport(
                Objects.requireNonNull(reportId),
                Objects.requireNonNull(inspectorId));

        // ✅ Audit log: Inspector assigned
        auditLogService.logEntityChange(
                null,
                "Report Update",
                "Inspector #" + inspectorId + " assigned to report #" + reportId,
                "REPORT",
                reportId,
                null,
                "ASSIGNED");

        return ResponseEntity.ok(updatedReport);
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> deleteReport(@PathVariable @NonNull Long id) {
        reportService.deleteReport(Objects.requireNonNull(id));

        // ✅ Audit log: Report deleted
        auditLogService.logEntityChange(
                null,
                "Report Deletion",
                "Report #" + id + " deleted",
                "REPORT",
                id,
                null,
                null);

        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/images")
    public ResponseEntity<?> uploadReportImages(
            @PathVariable @NonNull Long id,
            @RequestParam("images") MultipartFile[] files) {

        Objects.requireNonNull(id, "Report ID cannot be null");
        log.info("📸 Received {} images for report ID: {}", files.length, id);

        try {
            List<ReportImageEntity> images = imageUploadService.uploadReportImages(id, files);

            // ✅ Audit log: Images uploaded
            auditLogService.logEntityChange(
                    null,
                    "Report Update",
                    "Uploaded " + files.length + " images to report #" + id,
                    "REPORT",
                    id,
                    null,
                    null);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Images uploaded successfully");
            response.put("images", images);

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("❌ Failed to upload images", e);

            Map<String, Object> error = new HashMap<>();
            error.put("success", false);
            error.put("error", e.getMessage());

            return ResponseEntity.badRequest().body(error);
        }
    }

    @GetMapping("/{id}/images")
    public ResponseEntity<List<ReportImageEntity>> getReportImages(@PathVariable @NonNull Long id) {
        List<ReportImageEntity> images = imageUploadService.getReportImages(Objects.requireNonNull(id));
        return ResponseEntity.ok(images);
    }

    @DeleteMapping("/images/{imageId}")
    public ResponseEntity<Void> deleteImage(@PathVariable @NonNull Long imageId) {
        imageUploadService.deleteImage(Objects.requireNonNull(imageId));

        // ✅ Audit log: Image deleted
        auditLogService.logAction(
                null,
                "Report Update",
                "Deleted image #" + imageId);

        return ResponseEntity.noContent().build();
    }

    @GetMapping("/getMyAssignedReport")
    public ResponseEntity<?> getMyAssignedReport(@RequestHeader("Authorization") String authHeader) {
        try {
            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                return ResponseEntity.badRequest().body("Missing or invalid Authorization header");
            }

            String token = authHeader.substring(7);

            if (!jwtUtil.validateToken(token)) {
                return ResponseEntity.status(401).body("Invalid or expired token");
            }

            Long userId = jwtUtil.extractUserId(token);
            Objects.requireNonNull(userId, "User ID cannot be null");

            inspectorEntity inspector = inspectorRepository.findByUser_Id(userId).orElse(null);

            if (inspector == null) {
                return ResponseEntity.status(403).body("User is not an inspector");
            }

            List<ReportEntity> assignedReports = reportService.getReportsByInspector(inspector.getId());

            return ResponseEntity.ok(assignedReports);

        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error fetching assigned reports: " + e.getMessage());
        }
    }

    @GetMapping("/getDetail/{id}")
    public ResponseEntity<?> getReportDetail(
            @PathVariable @NonNull Long id,
            @RequestHeader(value = "Authorization", required = false) String authHeader) {
        try {
            Objects.requireNonNull(id, "Report ID cannot be null");

            if (authHeader != null && authHeader.startsWith("Bearer ")) {
                String token = authHeader.substring(7);
                if (!jwtUtil.validateToken(token)) {
                    return ResponseEntity.status(401).body("Invalid or expired token");
                }
            }

            return reportService.getReportById(id)
                    .map(ResponseEntity::ok)
                    .orElse(ResponseEntity.notFound().build());
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error fetching report details: " + e.getMessage());
        }
    }

    @PutMapping("/{reportId}/status")
    public ResponseEntity<?> updateReportStatus(
            @PathVariable @NonNull Long reportId,
            @RequestBody @NonNull Map<String, String> request,
            @RequestHeader("Authorization") String authHeader) {
        try {
            Objects.requireNonNull(reportId, "Report ID cannot be null");
            Objects.requireNonNull(request, "Request cannot be null");

            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                return ResponseEntity.status(401).body("Missing or invalid Authorization header");
            }

            String token = authHeader.substring(7);
            if (!jwtUtil.validateToken(token)) {
                return ResponseEntity.status(401).body("Invalid or expired token");
            }

            Long userId = jwtUtil.extractUserId(token);
            if (userId == null) {
                return ResponseEntity.status(401).body("Invalid user ID");
            }

            inspectorEntity inspector = inspectorRepository.findByUser_Id(userId).orElse(null);
            if (inspector == null) {
                return ResponseEntity.status(403).body("User is not an inspector");
            }

            String newStatus = request.get("status");
            if (newStatus == null || newStatus.trim().isEmpty()) {
                return ResponseEntity.badRequest().body("Status is required");
            }

            String oldStatus = reportService.getReportById(reportId)
                    .map(ReportEntity::getStatus)
                    .orElse("UNKNOWN");

            Map<String, Object> updates = new HashMap<>();
            updates.put("status", newStatus);
            updates.put("updatedBy", userId);

            ReportEntity updatedReport = reportService.updateReportWithHistory(
                    reportId,
                    updates,
                    userId);

            // ✅ Audit log: Status changed
            auditLogService.logEntityChange(
                    userId,
                    "Report Update",
                    "Changed report #" + reportId + " status",
                    "REPORT",
                    reportId,
                    oldStatus,
                    newStatus);

            return ResponseEntity.ok(updatedReport);

        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error updating report status: " + e.getMessage());
        }
    }

    @PostMapping("/{reportId}/comment")
    public ResponseEntity<?> addCommentToReport(
            @PathVariable @NonNull Long reportId,
            @RequestBody @NonNull Map<String, String> request,
            @RequestHeader("Authorization") String authHeader) {
        try {
            Objects.requireNonNull(reportId, "Report ID cannot be null");
            Objects.requireNonNull(request, "Request cannot be null");

            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                return ResponseEntity.status(401).body("Missing or invalid Authorization header");
            }

            String token = authHeader.substring(7);
            if (!jwtUtil.validateToken(token)) {
                return ResponseEntity.status(401).body("Invalid or expired token");
            }

            Long userId = jwtUtil.extractUserId(token);
            inspectorEntity inspector = inspectorRepository.findByUser_Id(userId).orElse(null);
            if (inspector == null) {
                return ResponseEntity.status(403).body("User is not an inspector");
            }

            String comment = request.get("comment");
            if (comment == null || comment.trim().isEmpty()) {
                return ResponseEntity.badRequest().body("Comment is required");
            }

            Map<String, Object> updates = new HashMap<>();
            updates.put("adminNotes", comment);
            updates.put("updatedBy", userId);

            ReportEntity updatedReport = reportService.updateReportWithHistory(
                    Objects.requireNonNull(reportId),
                    updates,
                    Objects.requireNonNull(userId));

            // ✅ Audit log: Comment added
            auditLogService.logEntityChange(
                    userId,
                    "Report Update",
                    "Added comment to report #" + reportId,
                    "REPORT",
                    reportId,
                    null,
                    null);

            return ResponseEntity.ok(updatedReport);

        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error adding comment: " + e.getMessage());
        }
    }
}