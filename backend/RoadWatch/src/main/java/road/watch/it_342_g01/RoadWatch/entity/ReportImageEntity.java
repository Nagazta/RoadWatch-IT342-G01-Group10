package road.watch.it_342_g01.RoadWatch.entity;

import com.fasterxml.jackson.annotation.JsonIgnore; // ✅ ADD THIS
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "report_images", schema = "public")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ReportImageEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String imageUrl;

    @Column(name = "image_key")
    private String imageKey;

    @ManyToOne
    @JoinColumn(name = "report_id", nullable = false)
    @JsonIgnore // ✅ ADD THIS - prevents infinite loop
    private ReportEntity report;

    @Column(name = "uploaded_at")
    private LocalDateTime uploadedAt;

    @PrePersist
    public void onCreate() {
        uploadedAt = LocalDateTime.now();
    }
}