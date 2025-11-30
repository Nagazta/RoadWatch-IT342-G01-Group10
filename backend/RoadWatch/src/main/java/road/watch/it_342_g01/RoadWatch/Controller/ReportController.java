package road.watch.it_342_g01.RoadWatch.Controller;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import road.watch.it_342_g01.RoadWatch.entity.ReportEntity;
import road.watch.it_342_g01.RoadWatch.entity.inspectorEntity;
import road.watch.it_342_g01.RoadWatch.service.ReportService;
import road.watch.it_342_g01.RoadWatch.service.ReportService2;
import road.watch.it_342_g01.RoadWatch.security.JwtUtil;
import road.watch.it_342_g01.RoadWatch.repository.inspectorRepo;

import java.util.List;
import java.util.Map;

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

    @GetMapping("/getAll/name")
    public ResponseEntity<List<ReportEntity>> getAllReportsByName(@RequestParam String submittedBy) {
        List<ReportEntity> reports = reportService2.getAllReportsByName(submittedBy);
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

    @GetMapping("/getByEmail")
    public ResponseEntity<List<ReportEntity>> getReportsByEmail(@RequestParam String email) {
        List<ReportEntity> reports = reportService.getReportsByEmail(email);
        return ResponseEntity.ok(reports);
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
