package road.watch.it_342_g01.RoadWatch.controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import road.watch.it_342_g01.RoadWatch.dto.AuditLogDTO;
import road.watch.it_342_g01.RoadWatch.security.JwtUtil;
import road.watch.it_342_g01.RoadWatch.service.AuditLogService;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/api/audit")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class AuditLogController {

    private final AuditLogService auditLogService;
    private final JwtUtil jwtUtil;

    /**
     * Get audit logs with filters and pagination
     * GET /api/audit/logs
     */
    @GetMapping("/logs")
    public ResponseEntity<?> getAuditLogs(
            @RequestParam(required = false) String search,
            @RequestParam(required = false, defaultValue = "All Activities") String activity,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestHeader("Authorization") String authHeader) {
        try {
            // Validate admin token
            if (!validateAdminToken(authHeader)) {
                return ResponseEntity.status(401).body(
                        Map.of("success", false, "error", "Unauthorized access"));
            }

            Page<AuditLogDTO> logs = auditLogService.getAuditLogs(
                    search,
                    activity,
                    status,
                    startDate,
                    endDate,
                    page,
                    size);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("data", logs.getContent());
            response.put("currentPage", logs.getNumber());
            response.put("totalPages", logs.getTotalPages());
            response.put("totalItems", logs.getTotalElements());
            response.put("pageSize", logs.getSize());

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("❌ Failed to fetch audit logs", e);
            return ResponseEntity.status(500).body(
                    Map.of("success", false, "error", e.getMessage()));
        }
    }

    /**
     * Get all audit logs (no filters)
     * GET /api/audit/all
     */
    @GetMapping("/all")
    public ResponseEntity<?> getAllAuditLogs(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestHeader("Authorization") String authHeader) {
        try {
            if (!validateAdminToken(authHeader)) {
                return ResponseEntity.status(401).body(
                        Map.of("success", false, "error", "Unauthorized access"));
            }

            Page<AuditLogDTO> logs = auditLogService.getAllAuditLogs(page, size);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("data", logs.getContent());
            response.put("currentPage", logs.getNumber());
            response.put("totalPages", logs.getTotalPages());
            response.put("totalItems", logs.getTotalElements());

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("❌ Failed to fetch all audit logs", e);
            return ResponseEntity.status(500).body(
                    Map.of("success", false, "error", e.getMessage()));
        }
    }

    /**
     * Get audit log statistics
     * GET /api/audit/stats
     */
    @GetMapping("/stats")
    public ResponseEntity<?> getAuditStatistics(@RequestHeader("Authorization") String authHeader) {
        try {
            if (!validateAdminToken(authHeader)) {
                return ResponseEntity.status(401).body(
                        Map.of("success", false, "error", "Unauthorized access"));
            }

            Map<String, Object> stats = auditLogService.getAuditStatistics();
            return ResponseEntity.ok(Map.of("success", true, "data", stats));
        } catch (Exception e) {
            log.error("❌ Failed to fetch audit statistics", e);
            return ResponseEntity.status(500).body(
                    Map.of("success", false, "error", e.getMessage()));
        }
    }

    /**
     * Get available action types for filter dropdown
     * GET /api/audit/actions
     */
    @GetMapping("/actions")
    public ResponseEntity<?> getAvailableActions(@RequestHeader("Authorization") String authHeader) {
        try {
            if (!validateAdminToken(authHeader)) {
                return ResponseEntity.status(401).body(
                        Map.of("success", false, "error", "Unauthorized access"));
            }

            List<String> actions = auditLogService.getAvailableActions();
            return ResponseEntity.ok(Map.of("success", true, "data", actions));
        } catch (Exception e) {
            log.error("❌ Failed to fetch available actions", e);
            return ResponseEntity.status(500).body(
                    Map.of("success", false, "error", e.getMessage()));
        }
    }

    /**
     * Get audit logs for specific entity (e.g., report, user)
     * GET /api/audit/entity/{entityType}/{entityId}
     */
    @GetMapping("/entity/{entityType}/{entityId}")
    public ResponseEntity<?> getEntityAuditLogs(
            @PathVariable String entityType,
            @PathVariable Long entityId,
            @RequestHeader("Authorization") String authHeader) {
        try {
            if (!validateAdminToken(authHeader)) {
                return ResponseEntity.status(401).body(
                        Map.of("success", false, "error", "Unauthorized access"));
            }

            List<AuditLogDTO> logs = auditLogService.getEntityAuditLogs(entityType, entityId);
            return ResponseEntity.ok(Map.of("success", true, "data", logs));
        } catch (Exception e) {
            log.error("❌ Failed to fetch entity audit logs", e);
            return ResponseEntity.status(500).body(
                    Map.of("success", false, "error", e.getMessage()));
        }
    }

    /**
     * Export audit logs as CSV
     * GET /api/audit/export/csv
     */
    @GetMapping("/export/csv")
    public ResponseEntity<?> exportAuditLogsCSV(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String activity,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate,
            @RequestHeader("Authorization") String authHeader) {
        try {
            if (!validateAdminToken(authHeader)) {
                return ResponseEntity.status(401).body("Unauthorized access");
            }

            // Get all logs matching filters (no pagination for export)
            Page<AuditLogDTO> logs = auditLogService.getAuditLogs(
                    search, activity, status, startDate, endDate, 0, Integer.MAX_VALUE);

            // Build CSV
            StringBuilder csv = new StringBuilder();
            csv.append("Audit ID,User,User Role,Action,Description,Date Time,Status\n");

            for (AuditLogDTO log : logs.getContent()) {
                csv.append(String.format("\"%s\",\"%s\",\"%s\",\"%s\",\"%s\",\"%s\",\"%s\"\n",
                        log.getAuditId(),
                        log.getUser(),
                        log.getUserRole(),
                        log.getAction(),
                        log.getDescription().replace("\"", "\"\""),
                        log.getDateTime(),
                        log.getStatus()));
            }

            String filename = "audit_logs_" +
                    LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMdd_HHmmss")) +
                    ".csv";

            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + filename + "\"")
                    .contentType(MediaType.parseMediaType("text/csv"))
                    .body(csv.toString());
        } catch (Exception e) {
            log.error("❌ Failed to export audit logs as CSV", e);
            return ResponseEntity.status(500).body("Failed to export CSV");
        }
    }

    /**
     * Export audit logs as PDF (placeholder - requires PDF library)
     * GET /api/audit/export/pdf
     */
    @GetMapping("/export/pdf")
    public ResponseEntity<?> exportAuditLogsPDF(@RequestHeader("Authorization") String authHeader) {
        try {
            if (!validateAdminToken(authHeader)) {
                return ResponseEntity.status(401).body(
                        Map.of("success", false, "error", "Unauthorized access"));
            }

            return ResponseEntity.status(501).body(
                    Map.of("success", false, "error", "PDF export not yet implemented"));
        } catch (Exception e) {
            log.error("❌ Failed to export audit logs as PDF", e);
            return ResponseEntity.status(500).body(
                    Map.of("success", false, "error", e.getMessage()));
        }
    }

    /**
     * Manually create an audit log entry (for testing or system actions)
     * POST /api/audit/log
     */
    @PostMapping("/log")
    public ResponseEntity<?> createAuditLog(
            @RequestBody Map<String, Object> request,
            @RequestHeader("Authorization") String authHeader) {
        try {
            if (!validateAdminToken(authHeader)) {
                return ResponseEntity.status(401).body(
                        Map.of("success", false, "error", "Unauthorized access"));
            }

            String action = (String) request.get("action");
            String description = (String) request.get("description");
            Long userId = request.containsKey("userId")
                    ? Long.parseLong(request.get("userId").toString())
                    : null;
            String status = (String) request.getOrDefault("status", "Success");

            if (action == null || description == null) {
                return ResponseEntity.badRequest().body(
                        Map.of("success", false, "error", "Action and description are required"));
            }

            auditLogService.createAuditLog(action, description, userId, status,
                    null, null, null, null, null);

            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "message", "Audit log created successfully"));
        } catch (Exception e) {
            log.error("❌ Failed to create audit log", e);
            return ResponseEntity.status(500).body(
                    Map.of("success", false, "error", e.getMessage()));
        }
    }

    /**
     * Helper method to validate admin token
     */
    private boolean validateAdminToken(String authHeader) {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return false;
        }

        String token = authHeader.substring(7);
        if (!jwtUtil.validateToken(token)) {
            return false;
        }

        // Check if user has admin role
        String role = jwtUtil.extractRole(token);
        return "ADMIN".equalsIgnoreCase(role);
    }
}