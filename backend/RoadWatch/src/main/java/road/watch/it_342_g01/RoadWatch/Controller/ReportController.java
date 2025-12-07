package road.watch.it_342_g01.RoadWatch.Controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import road.watch.it_342_g01.RoadWatch.entity.ReportEntity;
import road.watch.it_342_g01.RoadWatch.entity.inspectorEntity;
import road.watch.it_342_g01.RoadWatch.service.ReportService;
import road.watch.it_342_g01.RoadWatch.service.ReportService2;
import road.watch.it_342_g01.RoadWatch.security.JwtUtil;
import road.watch.it_342_g01.RoadWatch.repository.inspectorRepo;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/api/reports")
@RequiredArgsConstructor
public class ReportController {

    private final ReportService reportService; // <-- CamelCase
    private final JwtUtil jwtUtil;
    private final inspectorRepo inspectorRepository;

    @Autowired
    private ReportService2 reportService2;

    @GetMapping("/getAll")
    public ResponseEntity<List<ReportEntity>> getAllReports() {
        List<ReportEntity> reports = reportService.getAllReports();
        return ResponseEntity.ok(reports);
    }

    @GetMapping("/getBy/{id}")
    public ResponseEntity<ReportEntity> getReportById(@PathVariable Long id) {
        return reportService.getReportById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/inspector/{inspectorId}")
    public ResponseEntity<List<ReportEntity>> getReportsByInspector(@PathVariable Long inspectorId) {
        log.info("📋 Fetching reports for inspector ID: {}", inspectorId);
        List<ReportEntity> reports = reportService.getReportsByInspector(inspectorId);
        return ResponseEntity.ok(reports);
    }

    @GetMapping("/getAll/name")
    public ResponseEntity<List<ReportEntity>> getAllReportsByName(@RequestParam String submittedBy) {
        List<ReportEntity> reports = reportService2.getAllReportsByName(submittedBy);
        return ResponseEntity.ok(reports);
    }

    @GetMapping("/getByEmail")
    public ResponseEntity<List<ReportEntity>> getReportsByEmail(@RequestParam String email) {
        List<ReportEntity> reports = reportService.getReportsByEmail(email);
        return ResponseEntity.ok(reports);
    }

    @PostMapping("/add")
    public ResponseEntity<ReportEntity> createReport(@RequestBody ReportEntity report) {
        ReportEntity createdReport = reportService.createReport(report);
        return ResponseEntity.ok(createdReport);
    }

    @PostMapping("/add2")
    public ResponseEntity<ReportEntity> createReport2(@RequestBody ReportEntity report,
            @RequestParam String submittedBy) {
        ReportEntity newReport = reportService2.createReport(report, submittedBy);
        return ResponseEntity.ok(newReport);
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<ReportEntity> updateReport(
            @PathVariable Long id,
            @RequestBody ReportEntity updatedReport) {
        ReportEntity report = reportService.updateReport(id, updatedReport);
        return ResponseEntity.ok(report);
    }

    /**
     * 🆕 Update report with history tracking (for inspectors)
     * PUT /api/reports/{id}
     */
    @PutMapping("/{id}")
    public ResponseEntity<?> updateReportWithHistory(
            @PathVariable Long id,
            @RequestBody Map<String, Object> updates) {
        try {
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
            ReportEntity updated = reportService.updateReportWithHistory(id, updates, updatedBy);

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
    public ResponseEntity<?> getReportHistory(@PathVariable Long id) {
        try {
            log.info("📜 Fetching history for report ID: {}", id);
            List<ReportHistoryEntity> history = reportService.getReportHistory(id);

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
            @PathVariable Long reportId,
            @PathVariable Long inspectorId) {

        ReportEntity updatedReport = reportService.assignInspectorToReport(reportId, inspectorId);
        return ResponseEntity.ok(updatedReport);
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> deleteReport(@PathVariable Long id) {
        reportService.deleteReport(id);
        return ResponseEntity.noContent().build();
    }

    /**
     * Upload images for a report
     * POST /api/reports/{id}/images
     */
    @PostMapping("/{id}/images")
    public ResponseEntity<?> uploadReportImages(
            @PathVariable Long id,
            @RequestParam("images") MultipartFile[] files) {

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
    public ResponseEntity<List<ReportImageEntity>> getReportImages(@PathVariable Long id) {
        List<ReportImageEntity> images = imageUploadService.getReportImages(id);
        return ResponseEntity.ok(images);
    }

    /**
     * Delete an image
     * DELETE /api/reports/images/{imageId}
     */
    @DeleteMapping("/images/{imageId}")
    public ResponseEntity<Void> deleteImage(@PathVariable Long imageId) {
        imageUploadService.deleteImage(imageId);
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

            // Find inspector by userId
            inspectorEntity inspector = inspectorRepository.findByUser_Id(userId)
                    .orElse(null);

            if (inspector == null) {
                return ResponseEntity.status(403).body("User is not an inspector");
            }

            // Get reports assigned to this inspector
            List<ReportEntity> assignedReports = reportService.getMyAssignedReports(inspector.getId());

            return ResponseEntity.ok(assignedReports);

        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error fetching assigned reports: " + e.getMessage());
        }
    }

    @GetMapping("/getDetail/{id}")
    public ResponseEntity<?> getReportDetail(
            @PathVariable Long id,
            @RequestHeader(value = "Authorization", required = false) String authHeader) {
        try {
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

    @PutMapping("/{reportId}/status")
    public ResponseEntity<?> updateReportStatus(
            @PathVariable Long reportId,
            @RequestBody Map<String, String> request,
            @RequestHeader("Authorization") String authHeader) {
        try {
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

            ReportEntity updatedReport = reportService.updateReportStatus(reportId, newStatus);
            return ResponseEntity.ok(updatedReport);

        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error updating report status: " + e.getMessage());
        }
    }

    @PostMapping("/{reportId}/comment")
    public ResponseEntity<?> addCommentToReport(
            @PathVariable Long reportId,
            @RequestBody Map<String, String> request,
            @RequestHeader("Authorization") String authHeader) {
        try {
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

            ReportEntity updatedReport = reportService.addCommentToReport(reportId, comment);
            return ResponseEntity.ok(updatedReport);

        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error adding comment: " + e.getMessage());
        }
    }
}
