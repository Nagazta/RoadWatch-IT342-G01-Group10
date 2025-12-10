package road.watch.it_342_g01.RoadWatch.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import road.watch.it_342_g01.RoadWatch.entity.AuditLogEntity;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AuditLogDTO {
    private Long id;
    private String auditId;
    private String user;
    private String userRole;
    private String action;
    private String description;
    private String dateTime;
    private String status;
    private String ipAddress;
    private String entityType;
    private Long entityId;

    public static AuditLogDTO fromEntity(AuditLogEntity entity) {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("MMM dd, yyyy • hh:mm a");

        String userName = "System";
        String userRole = "System";

        if (entity.getUser() != null) {
            // ✅ FIXED: Use getName() or getEmail() based on your userEntity structure
            // Adjust this based on your actual userEntity fields
            userName = entity.getUser().getName() != null
                    ? entity.getUser().getName()
                    : entity.getUser().getEmail();
            userRole = entity.getUserRole() != null ? entity.getUserRole() : "Unknown";
        }

        return AuditLogDTO.builder()
                .id(entity.getId())
                .auditId(entity.getAuditId())
                .user(userName)
                .userRole(userRole)
                .action(entity.getAction())
                .description(entity.getDescription())
                .dateTime(entity.getDateTime().format(formatter))
                .status(entity.getStatus())
                .ipAddress(entity.getIpAddress())
                .entityType(entity.getEntityType())
                .entityId(entity.getEntityId())
                .build();
    }
}