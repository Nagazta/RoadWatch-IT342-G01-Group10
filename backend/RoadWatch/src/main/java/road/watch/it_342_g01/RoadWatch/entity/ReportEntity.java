package road.watch.it_342_g01.RoadWatch.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;

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

    // ✅ NEW FIELDS FOR INSPECTOR EDITING
    private String priority; // Low, Medium, High, Critical

    @Column(name = "inspector_notes", columnDefinition = "TEXT")
    private String inspectorNotes;

    @Column(name = "estimated_completion_date")
    private String estimatedCompletionDate; // Store as String (YYYY-MM-DD format)

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @ManyToOne
    @JoinColumn(name = "assigned_inspector_id")
    private inspectorEntity assignedInspector;

    // One Report can have Many Images
    @OneToMany(mappedBy = "report", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private List<ReportImageEntity> images = new ArrayList<>();

    @PrePersist
    public void onCreate() {
        dateSubmitted = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        status = "Pending";
        if (priority == null) {
            priority = "Medium"; // Default priority
        }
    }

    @PreUpdate
    public void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}