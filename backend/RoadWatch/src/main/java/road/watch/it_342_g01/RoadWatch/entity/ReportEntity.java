package road.watch.it_342_g01.RoadWatch.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "reports", schema = "public")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ReportEntity {  
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String reportId;      
    private String title;
    private String description;
    private String category;
    private String location;
    private String submittedBy;

    @Column(name = "date_submitted")
    private LocalDateTime dateSubmitted;

    private String status;          // Pending, In Progress, Resolved
    private String adminNotes;
}
