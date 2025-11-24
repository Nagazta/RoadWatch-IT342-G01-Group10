// inspectorEntity.java
package road.watch.it_342_g01.RoadWatch.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@Entity
@Table(name = "inspector", schema = "public")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class inspectorEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "inspector_id") // This MUST match Supabase
    private Long id;

    @Column(name = "area_assignment")
    private String areaAssignment;

    // These fields do NOT exist in Supabase, so we mark them Transient
    @Transient
    private String status = "Available";

    @Transient
    private int activeAssignments = 0;

    @OneToOne
    @JoinColumn(name = "user_id")
    // This stops the Infinite Loop Crash ⬇️
    @JsonIgnoreProperties({"password", "roles", "hibernateLazyInitializer", "handler"})
    private userEntity user;
}