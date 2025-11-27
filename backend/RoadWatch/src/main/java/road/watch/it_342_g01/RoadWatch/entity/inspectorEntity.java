package road.watch.it_342_g01.RoadWatch.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.time.LocalDateTime;

@Entity
@Table(name = "inspector", schema = "public")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class inspectorEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "inspector_id")
    private Long id;

    @Column(name = "area_assignment")
    private String areaAssignment;
    
    @Column(name = "created_by_admin_id")
    private Long createdByAdminId;
    
    @Column(name = "created_at")
    private LocalDateTime createdAt;

    // These fields do NOT exist in Supabase, so we mark them Transient
    @Transient
    private String status = "Available";

    @Transient
    private int activeAssignments = 0;

    @OneToOne
    @JoinColumn(name = "user_id")
    @JsonIgnoreProperties({"password", "roles", "hibernateLazyInitializer", "handler"})
    private userEntity user;
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}