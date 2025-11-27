package road.watch.it_342_g01.RoadWatch.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import road.watch.it_342_g01.RoadWatch.entity.ReportEntity;
import road.watch.it_342_g01.RoadWatch.service.ReportService;
import road.watch.it_342_g01.RoadWatch.service.ReportService2;

import java.util.List;

@RestController
@RequestMapping("/api/reports")
@RequiredArgsConstructor
public class ReportController {

    private final ReportService reportService; // <-- CamelCase

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
}
