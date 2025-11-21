package road.watch.it_342_g01.RoadWatch.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import road.watch.it_342_g01.RoadWatch.entity.ReportEntity;
import road.watch.it_342_g01.RoadWatch.repository.ReportRepo;
import java.util.List;

@Service
public class ReportService3 {
    @Autowired
    private ReportRepo reportRepo;

    // Create new report
    public ReportEntity createReport(ReportEntity report, String submittedBy) {
        report.setSubmittedBy(submittedBy);
        return reportRepo.save(report);
    }

    // Get all reports by name (submittedBy)
    public List<ReportEntity> getAllReportsByName(String submittedBy) {
        return reportRepo.findBySubmittedBy(submittedBy);
    }
}
