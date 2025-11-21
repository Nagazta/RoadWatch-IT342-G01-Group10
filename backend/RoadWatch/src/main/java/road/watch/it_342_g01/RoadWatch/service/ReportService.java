package road.watch.it_342_g01.RoadWatch.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import road.watch.it_342_g01.RoadWatch.entity.ReportEntity;
import road.watch.it_342_g01.RoadWatch.repository.ReportRepo;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ReportService {  

    private final ReportRepo reportRepo;

    public List<ReportEntity> getAllReports() {
        return reportRepo.findAll();
    }

    public Optional<ReportEntity> getReportById(Long id) {
        return reportRepo.findById(id);
    }

    public ReportEntity createReport(ReportEntity report) {
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
}
