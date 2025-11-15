package road.watch.it_342_g01.RoadWatch.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "citizen", schema = "public")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class citizenEntity {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "citizen_id")
    private Long citizenId;
    
    @OneToOne
    @JoinColumn(name = "user_id", unique = true, nullable = false)
    private userEntity user;
    
    @Column(name = "google_id", unique = true)
    private String googleId;
    
    @Column(name = "total_reports")
    private Integer totalReports = 0;
    
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        if (totalReports == null) {
            totalReports = 0;
        }
    }
    
    public void incrementTotalReports() {
        this.totalReports = (this.totalReports == null ? 0 : this.totalReports) + 1;
    }
}