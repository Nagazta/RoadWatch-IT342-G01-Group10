package road.watch.it_342_g01.RoadWatch.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

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

    @ManyToOne
    @JoinColumn(name = "assigned_inspector_id")
    private inspectorEntity assignedInspector;

    // ✅ ADD THIS: One Report can have Many Images
    @OneToMany(mappedBy = "report", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ReportImageEntity> images = new ArrayList<>();

    @PrePersist
    public void onCreate() {
        dateSubmitted = LocalDateTime.now();
        status = "Pending";
    }
}