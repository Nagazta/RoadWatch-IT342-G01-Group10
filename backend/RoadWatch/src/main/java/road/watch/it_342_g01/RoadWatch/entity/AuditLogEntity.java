package road.watch.it_342_g01.RoadWatch.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;

import java.time.LocalDateTime;

@Entity
@Table(name = "audit_logs")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AuditLogEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "audit_id", nullable = false, unique = true, length = 50)
    private String auditId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    @JsonIgnoreProperties({ "hibernateLazyInitializer", "handler" })
    private userEntity user;

    @Column(name = "user_role", length = 50)
    private String userRole;

    @Column(name = "action", nullable = false, length = 100)
    private String action;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @Column(name = "date_time", nullable = false)
    private LocalDateTime dateTime;

    @Column(name = "status", nullable = false, length = 50)
    private String status = "Success";

    @Column(name = "ip_address", length = 45)
    private String ipAddress;

    @Column(name = "entity_type", length = 100)
    private String entityType;

    @Column(name = "entity_id")
    private Long entityId;

    @Column(name = "old_value", columnDefinition = "TEXT")
    private String oldValue;

    @Column(name = "new_value", columnDefinition = "TEXT")
    private String newValue;

    @PrePersist
    protected void onCreate() {
        if (dateTime == null) {
            dateTime = LocalDateTime.now();
        }
        if (auditId == null) {
            auditId = generateAuditId();
        }
    }

    private String generateAuditId() {
        return "AL-" + String.format("%04d", (int) (Math.random() * 10000));
    }
}