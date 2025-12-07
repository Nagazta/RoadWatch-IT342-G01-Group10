package road.watch.it_342_g01.RoadWatch.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "report_history", schema = "public")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ReportHistoryEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "history_id")
    private Long historyId;

    @Column(name = "report_id", nullable = false)
    private Long reportId;

    @Column(name = "action", nullable = false)
    private String action; // CREATED, UPDATED, STATUS_CHANGED, ASSIGNED, RESOLVED

    @Column(name = "updated_by")
    private Long updatedBy;

    @Column(name = "updated_by_name")
    private String updatedByName;

    @Column(name = "timestamp", nullable = false)
    private LocalDateTime timestamp;

    @Column(name = "change_reason")
    private String changeReason;

    @Column(name = "field_name")
    private String fieldName;

    @Column(name = "old_value", columnDefinition = "TEXT")
    private String oldValue;

    @Column(name = "new_value", columnDefinition = "TEXT")
    private String newValue;

    @Column(name = "notes", columnDefinition = "TEXT")
    private String notes;

    @PrePersist
    protected void onCreate() {
        if (timestamp == null) {
            timestamp = LocalDateTime.now();
        }
    }
}