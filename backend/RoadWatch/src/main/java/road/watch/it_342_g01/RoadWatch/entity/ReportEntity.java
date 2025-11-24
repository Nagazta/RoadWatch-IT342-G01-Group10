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
    private Double latitude;
    private Double longitude;

    private String submittedBy;

    @Column(name = "date_submitted")
    private LocalDateTime dateSubmitted;

    private String status;
    private String adminNotes;

    // --- ⬇️ ADD THIS SECTION ⬇️ ---
    @ManyToOne // This means One Inspector can have Many Reports
    @JoinColumn(name = "assigned_inspector_id") // Creates a column in DB to store Inspector ID
    private inspectorEntity assignedInspector;
    // ------------------------------

    @PrePersist
    public void onCreate() {
        dateSubmitted = LocalDateTime.now();
        status = "Pending";
    }
}