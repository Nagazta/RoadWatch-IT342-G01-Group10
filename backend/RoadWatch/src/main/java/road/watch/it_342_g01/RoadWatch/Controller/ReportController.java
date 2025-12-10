package road.watch.it_342_g01.RoadWatch.controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.lang.NonNull; // ✅ Add this import
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import road.watch.it_342_g01.RoadWatch.entity.ReportEntity;
import road.watch.it_342_g01.RoadWatch.entity.ReportHistoryEntity;
import road.watch.it_342_g01.RoadWatch.entity.ReportImageEntity;
import road.watch.it_342_g01.RoadWatch.entity.inspectorEntity;
import road.watch.it_342_g01.RoadWatch.service.ReportService;
import road.watch.it_342_g01.RoadWatch.service.ReportService2;
import road.watch.it_342_g01.RoadWatch.service.ImageUploadService;
import road.watch.it_342_g01.RoadWatch.security.JwtUtil;
import road.watch.it_342_g01.RoadWatch.repository.inspectorRepo;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects; // ✅ Add this import

@Slf4j
@RestController
@RequestMapping("/api/reports")
@RequiredArgsConstructor
public class ReportController {

    private final ReportService reportService;
    private final JwtUtil jwtUtil;
    private final inspectorRepo inspectorRepository;
    private final ImageUploadService imageUploadService;

    @Autowired
    private ReportService2 reportService2;

    @GetMapping("/getAll")
    public ResponseEntity<List<ReportEntity>> getAllReports() {
        List<ReportEntity> reports = reportService.getAllReports();
        return ResponseEntity.ok(reports);
    }

    @GetMapping("/getBy/{id}")
    public ResponseEntity<ReportEntity> getReportById(@PathVariable @NonNull Long id) { // ✅ Add @NonNull
        return reportService.getReportById(Objects.requireNonNull(id)) // ✅ Fix line 45
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/inspector/{inspectorId}")
    public ResponseEntity<List<ReportEntity>> getReportsByInspector(@PathVariable @NonNull Long inspectorId) { // ✅ Add
                                                                                                               // @NonNull
        log.info("📋 Fetching reports for inspector ID: {}", inspectorId);
        List<ReportEntity> reports = reportService.getReportsByInspector(Objects.requireNonNull(inspectorId)); // ✅ Fix
                                                                                                               // line
                                                                                                               // 53
        return ResponseEntity.ok(reports);
    }

    @GetMapping("/getAll/name")
    public ResponseEntity<List<ReportEntity>> getAllReportsByName(@RequestParam @NonNull String submittedBy) { // ✅ Add
                                                                                                               // @NonNull
        List<ReportEntity> reports = reportService2.getAllReportsByName(Objects.requireNonNull(submittedBy)); // ✅ Fix
                                                                                                              // line 65
        return ResponseEntity.ok(reports);
    }

    @GetMapping("/getByEmail")
    public ResponseEntity<List<ReportEntity>> getReportsByEmail(@RequestParam @NonNull String email) { // ✅ Add @NonNull
        List<ReportEntity> reports = reportService.getReportsByEmail(Objects.requireNonNull(email));
        return ResponseEntity.ok(reports);
    }

    @PostMapping("/add")
    public ResponseEntity<ReportEntity> createReport(@RequestBody @NonNull ReportEntity report) { // ✅ Add @NonNull
        ReportEntity createdReport = reportService.createReport(Objects.requireNonNull(report)); // ✅ Fix line 71
        return ResponseEntity.ok(createdReport);
    }

    @PostMapping("/add2")
    public ResponseEntity<ReportEntity> createReport2(
            @RequestBody @NonNull ReportEntity report, // ✅ Add @NonNull
            @RequestParam @NonNull String submittedBy) { // ✅ Add @NonNull
        ReportEntity newReport = reportService2.createReport(
                Objects.requireNonNull(report),
                Objects.requireNonNull(submittedBy));
        return ResponseEntity.ok(newReport);
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<ReportEntity> updateReport(
            @PathVariable @NonNull Long id, // ✅ Add @NonNull
            @RequestBody @NonNull ReportEntity updatedReport) { // ✅ Add @NonNull
        ReportEntity report = reportService.updateReport(
                Objects.requireNonNull(id), // ✅ Fix line 86
                Objects.requireNonNull(updatedReport) // ✅ Fix line 86
        );
        return ResponseEntity.ok(report);
    }

    /**
     * 🆕 Update report with history tracking (for inspectors)
     * PUT /api/reports/{id}
     */
    @PutMapping("/{id}")
    public ResponseEntity<?> updateReportWithHistory(
            @PathVariable @NonNull Long id, // ✅ Add @NonNull
            @RequestBody @NonNull Map<String, Object> updates) { // ✅ Add @NonNull
        try {
            Objects.requireNonNull(id, "Report ID cannot be null");
            Objects.requireNonNull(updates, "Updates cannot be null");

            log.info("📝 Received update request for report ID: {}", id);
            log.info("📝 Update data: {}", updates);

            // Get updatedBy from request body
            Long updatedBy = updates.containsKey("updatedBy")
                    ? Long.parseLong(updates.get("updatedBy").toString())
                    : null;

            if (updatedBy == null) {
                log.error("❌ Missing updatedBy in request");
                return ResponseEntity.badRequest()
                        .body(Map.of("success", false, "error", "updatedBy is required"));
            }

            // Update report with history tracking
            ReportEntity updated = reportService.updateReportWithHistory(
                    Objects.requireNonNull(id), // ✅ Fix line 114
                    updates,
                    Objects.requireNonNull(updatedBy));

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

    /**
     * 🆕 Get report history
     * GET /api/reports/{id}/history
     */
    @GetMapping("/{id}/history")
    public ResponseEntity<?> getReportHistory(@PathVariable @NonNull Long id) { // ✅ Add @NonNull
        try {
            log.info("📜 Fetching history for report ID: {}", id);
            List<ReportHistoryEntity> history = reportService.getReportHistory(Objects.requireNonNull(id)); // ✅ Fix
                                                                                                            // line 137

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
            @PathVariable @NonNull Long reportId, // ✅ Add @NonNull
            @PathVariable @NonNull Long inspectorId) { // ✅ Add @NonNull

        ReportEntity updatedReport = reportService.assignInspectorToReport(
                Objects.requireNonNull(reportId), // ✅ Fix line 153
                Objects.requireNonNull(inspectorId) // ✅ Fix line 153
        );
        return ResponseEntity.ok(updatedReport);
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> deleteReport(@PathVariable @NonNull Long id) { // ✅ Add @NonNull
        reportService.deleteReport(Objects.requireNonNull(id)); // ✅ Fix line 159
        return ResponseEntity.noContent().build();
    }

    /**
     * Upload images for a report
     * POST /api/reports/{id}/images
     */
    @PostMapping("/{id}/images")
    public ResponseEntity<?> uploadReportImages(
            @PathVariable @NonNull Long id, // ✅ Add @NonNull
            @RequestParam("images") MultipartFile[] files) {

        Objects.requireNonNull(id, "Report ID cannot be null");
        log.info("📸 Received {} images for report ID: {}", files.length, id);

        try {
            List<ReportImageEntity> images = imageUploadService.uploadReportImages(id, files);

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

    /**
     * Get images for a report
     * GET /api/reports/{id}/images
     */
    @GetMapping("/{id}/images")
    public ResponseEntity<List<ReportImageEntity>> getReportImages(@PathVariable @NonNull Long id) { // ✅ Add @NonNull
        List<ReportImageEntity> images = imageUploadService.getReportImages(Objects.requireNonNull(id));
        return ResponseEntity.ok(images);
    }

    /**
     * Delete an image
     * DELETE /api/reports/images/{imageId}
     */
    @DeleteMapping("/images/{imageId}")
    public ResponseEntity<Void> deleteImage(@PathVariable @NonNull Long imageId) { // ✅ Add @NonNull
        imageUploadService.deleteImage(Objects.requireNonNull(imageId));
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/getMyAssignedReport")
    public ResponseEntity<?> getMyAssignedReport(@RequestHeader("Authorization") String authHeader) {
        try {
            // Extract JWT token from Authorization header
            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                return ResponseEntity.badRequest().body("Missing or invalid Authorization header");
            }

            String token = authHeader.substring(7);

            // Validate token
            if (!jwtUtil.validateToken(token)) {
                return ResponseEntity.status(401).body("Invalid or expired token");
            }

            // Extract userId from token
            Long userId = jwtUtil.extractUserId(token);

            // ✅ Validate userId is not null
            Objects.requireNonNull(userId, "User ID cannot be null");

            // Find inspector by userId - wrap the entire findByUser_Id call
            inspectorEntity inspector = inspectorRepository.findByUser_Id(
                    Long.valueOf(userId.longValue()) // ✅ Convert to ensure @NonNull
            ).orElse(null);

            if (inspector == null) {
                return ResponseEntity.status(403).body("User is not an inspector");
            }

            // Get reports assigned to this inspector
            List<ReportEntity> assignedReports = reportService.getReportsByInspector(inspector.getId());

            return ResponseEntity.ok(assignedReports);

        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error fetching assigned reports: " + e.getMessage());
        }
    }

    @GetMapping("/getDetail/{id}")
    public ResponseEntity<?> getReportDetail(
            @PathVariable @NonNull Long id, // ✅ Add @NonNull
            @RequestHeader(value = "Authorization", required = false) String authHeader) {
        try {
            Objects.requireNonNull(id, "Report ID cannot be null"); // ✅ Fix line 263

            // Validate JWT token if provided
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

    /**
     * ✅ Update report status
     * PUT /api/reports/{reportId}/status
     */
    @PutMapping("/{reportId}/status")
    public ResponseEntity<?> updateReportStatus(
            @PathVariable @NonNull Long reportId, // ✅ Add @NonNull
            @RequestBody @NonNull Map<String, String> request, // ✅ Add @NonNull
            @RequestHeader("Authorization") String authHeader) {
        try {
            Objects.requireNonNull(reportId, "Report ID cannot be null");
            Objects.requireNonNull(request, "Request cannot be null");

            // Validate JWT token
            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                return ResponseEntity.status(401).body("Missing or invalid Authorization header");
            }

            String token = authHeader.substring(7);
            if (!jwtUtil.validateToken(token)) {
                return ResponseEntity.status(401).body("Invalid or expired token");
            }

            // Extract userId to verify it's an inspector
            Long userId = jwtUtil.extractUserId(token);
            inspectorEntity inspector = inspectorRepository.findByUser_Id(userId).orElse(null);
            if (inspector == null) {
                return ResponseEntity.status(403).body("User is not an inspector");
            }

            String newStatus = request.get("status");
            if (newStatus == null || newStatus.trim().isEmpty()) {
                return ResponseEntity.badRequest().body("Status is required");
            }

            // Use updateReportWithHistory instead
            Map<String, Object> updates = new HashMap<>();
            updates.put("status", newStatus);
            updates.put("updatedBy", userId);

            ReportEntity updatedReport = reportService.updateReportWithHistory(
                    Objects.requireNonNull(reportId), // ✅ Fix line 308
                    updates,
                    Objects.requireNonNull(userId) // ✅ Fix line 308
            );
            return ResponseEntity.ok(updatedReport);

        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error updating report status: " + e.getMessage());
        }
    }

    /**
     * ✅ Add comment to report
     * POST /api/reports/{reportId}/comment
     */
    @PostMapping("/{reportId}/comment")
    public ResponseEntity<?> addCommentToReport(
            @PathVariable @NonNull Long reportId, // ✅ Add @NonNull
            @RequestBody @NonNull Map<String, String> request, // ✅ Add @NonNull
            @RequestHeader("Authorization") String authHeader) {
        try {
            Objects.requireNonNull(reportId, "Report ID cannot be null");
            Objects.requireNonNull(request, "Request cannot be null");

            // Validate JWT token
            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                return ResponseEntity.status(401).body("Missing or invalid Authorization header");
            }

            String token = authHeader.substring(7);
            if (!jwtUtil.validateToken(token)) {
                return ResponseEntity.status(401).body("Invalid or expired token");
            }

            // Extract userId to verify it's an inspector
            Long userId = jwtUtil.extractUserId(token);
            inspectorEntity inspector = inspectorRepository.findByUser_Id(userId).orElse(null);
            if (inspector == null) {
                return ResponseEntity.status(403).body("User is not an inspector");
            }

            String comment = request.get("comment");
            if (comment == null || comment.trim().isEmpty()) {
                return ResponseEntity.badRequest().body("Comment is required");
            }

            // Use updateReportWithHistory instead
            Map<String, Object> updates = new HashMap<>();
            updates.put("adminNotes", comment);
            updates.put("updatedBy", userId);

            ReportEntity updatedReport = reportService.updateReportWithHistory(
                    Objects.requireNonNull(reportId), // ✅ Fix line 353
                    updates,
                    Objects.requireNonNull(userId) // ✅ Fix line 353
            );
            return ResponseEntity.ok(updatedReport);

        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error adding comment: " + e.getMessage());
        }
    }
}