package road.watch.it_342_g01.RoadWatch.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Map;

/**
 * Updated AuthResponse with roleData field
 * Similar to Node.js response structure
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AuthResponse {
    private boolean success;
    private String message;
    private String accessToken;
    private String refreshToken;
    private UserDTO user;

    /**
     * 🆕 Additional role-specific data (inspector, admin, citizen)
     * Examples:
     * - Inspector: { inspector_id, area_assignment, created_by_admin_id }
     * - Citizen: { citizen_id, google_id, total_reports }
     * - Admin: { admin_id, department }
     */
    private Map<String, Object> roleData;
}