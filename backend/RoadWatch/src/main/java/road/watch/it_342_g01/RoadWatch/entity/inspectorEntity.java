package road.watch.it_342_g01.RoadWatch.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
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
    private Long inspectorId;
    
    @OneToOne
    @JoinColumn(name = "user_id", unique = true, nullable = false)
    private userEntity user;
    
    @Column(name = "area_assignment")
    private String areaAssignment;
    
    @Column(name = "created_by_admin_id")
    private Long createdByAdminId;
    
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}