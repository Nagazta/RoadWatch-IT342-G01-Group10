package road.watch.it_342_g01.RoadWatch.controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import road.watch.it_342_g01.RoadWatch.entity.ReportEntity;
import road.watch.it_342_g01.RoadWatch.entity.ReportImageEntity;
import road.watch.it_342_g01.RoadWatch.service.ImageUploadService;
import road.watch.it_342_g01.RoadWatch.service.ReportService;
import road.watch.it_342_g01.RoadWatch.service.ReportService2;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Slf4j // ✅ Add this annotation
@RestController
@RequestMapping("/api/reports")
@RequiredArgsConstructor
public class ReportController {

    private final ReportService reportService;
    private final ImageUploadService imageUploadService;

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
}
