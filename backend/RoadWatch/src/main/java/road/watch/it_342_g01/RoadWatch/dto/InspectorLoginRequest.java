package road.watch.it_342_g01.RoadWatch.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Request DTO for Inspector Login
 * Similar to Node.js loginStudent (studentId + classCode)
 * But uses email + password since inspectors are created by admin
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class InspectorLoginRequest {
    private String email;
    private String password;
}