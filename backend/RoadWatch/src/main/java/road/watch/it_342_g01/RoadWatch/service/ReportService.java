package road.watch.it_342_g01.RoadWatch.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import road.watch.it_342_g01.RoadWatch.entity.ReportEntity;
import road.watch.it_342_g01.RoadWatch.entity.inspectorEntity;
import road.watch.it_342_g01.RoadWatch.repository.ReportRepo;
import road.watch.it_342_g01.RoadWatch.repository.inspectorRepo;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ReportService {

    private final ReportRepo reportRepo;

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
