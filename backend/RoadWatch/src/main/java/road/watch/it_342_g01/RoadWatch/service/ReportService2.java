package road.watch.it_342_g01.RoadWatch.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import road.watch.it_342_g01.RoadWatch.entity.ReportEntity;
import road.watch.it_342_g01.RoadWatch.repository.ReportRepo;

@Service
public class ReportService2
{
    @Autowired
    private ReportRepo reportRepo;

    // Create new report
    public ReportEntity createReport(ReportEntity report, String submittedBy)
    {
        report.setSubmittedBy(submittedBy);
        return reportRepo.save(report);
    }
}
