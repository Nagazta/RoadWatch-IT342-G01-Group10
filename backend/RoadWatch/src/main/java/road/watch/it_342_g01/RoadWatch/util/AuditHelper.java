package road.watch.it_342_g01.RoadWatch.util;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.stereotype.Component;

/**
 * Utility class for audit logging helpers
 */
@Component
public class AuditHelper {

    /**
     * Get client IP address from request
     * Handles X-Forwarded-For header for proxied requests
     */
    public static String getClientIp(HttpServletRequest request) {
        String ip = request.getHeader("X-Forwarded-For");

        if (ip == null || ip.isEmpty() || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getHeader("X-Real-IP");
        }

        if (ip == null || ip.isEmpty() || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getHeader("Proxy-Client-IP");
        }

        if (ip == null || ip.isEmpty() || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getHeader("WL-Proxy-Client-IP");
        }

        if (ip == null || ip.isEmpty() || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getRemoteAddr();
        }

        // Handle multiple IPs (take the first one)
        if (ip != null && ip.contains(",")) {
            ip = ip.split(",")[0].trim();
        }

        return ip;
    }

    /**
     * Sanitize description for audit logs
     * Removes sensitive information
     */
    public static String sanitizeDescription(String description) {
        if (description == null) {
            return null;
        }

        // Remove potential passwords
        description = description.replaceAll("password[\"']?\\s*[=:]\\s*[\"']?[^,}\\s]+", "password=***");

        // Remove tokens
        description = description.replaceAll("token[\"']?\\s*[=:]\\s*[\"']?[^,}\\s]+", "token=***");

        // Remove API keys
        description = description.replaceAll("(api[_-]?key|apikey)[\"']?\\s*[=:]\\s*[\"']?[^,}\\s]+", "apikey=***");

        return description;
    }

    /**
     * Format entity change for audit log
     */
    public static String formatChange(String field, Object oldValue, Object newValue) {
        return String.format("Changed %s from '%s' to '%s'", field,
                oldValue != null ? oldValue.toString() : "null",
                newValue != null ? newValue.toString() : "null");
    }

    /**
     * Generate audit description for entity creation
     */
    public static String createDescription(String entityType, String entityName) {
        return String.format("Created new %s: %s", entityType, entityName);
    }

    /**
     * Generate audit description for entity deletion
     */
    public static String deleteDescription(String entityType, String entityName) {
        return String.format("Deleted %s: %s", entityType, entityName);
    }

    /**
     * Generate audit description for status change
     */
    public static String statusChangeDescription(String entityType, String entityId,
            String oldStatus, String newStatus) {
        return String.format("Changed status of %s %s from '%s' to '%s'",
                entityType, entityId, oldStatus, newStatus);
    }

    /**
     * Truncate long descriptions
     */
    public static String truncateDescription(String description, int maxLength) {
        if (description == null || description.length() <= maxLength) {
            return description;
        }
        return description.substring(0, maxLength - 3) + "...";
    }

    /**
     * Check if action should be logged (filter out noise)
     */
    public static boolean shouldLogAction(String path, String method) {
        // Don't log GET requests to avoid spam
        if ("GET".equalsIgnoreCase(method)) {
            return false;
        }

        // Don't log health checks or metrics
        if (path.contains("/actuator/") || path.contains("/health")) {
            return false;
        }

        // Don't log audit log requests (avoid recursion)
        if (path.contains("/api/audit/")) {
            return false;
        }

        return true;
    }

    /**
     * Extract entity ID from path
     * Example: /api/reports/123 -> 123
     */
    public static Long extractEntityId(String path) {
        try {
            String[] parts = path.split("/");
            for (int i = parts.length - 1; i >= 0; i--) {
                if (parts[i].matches("\\d+")) {
                    return Long.parseLong(parts[i]);
                }
            }
        } catch (Exception e) {
            // Ignore parsing errors
        }
        return null;
    }

    /**
     * Determine entity type from path
     * Example: /api/reports/123 -> "Report"
     */
    public static String determineEntityType(String path) {
        if (path.contains("/reports/")) {
            return "Report";
        } else if (path.contains("/users/")) {
            return "User";
        } else if (path.contains("/feedback/")) {
            return "Feedback";
        } else if (path.contains("/admin/")) {
            return "Admin";
        }
        return null;
    }

    /**
     * Map HTTP method to action description
     */
    public static String methodToAction(String method, String entityType) {
        switch (method.toUpperCase()) {
            case "POST":
                return entityType + " Creation";
            case "PUT":
            case "PATCH":
                return entityType + " Update";
            case "DELETE":
                return entityType + " Deletion";
            default:
                return "API Request";
        }
    }

    /**
     * Check if user is system/admin based on role
     */
    public static boolean isSystemAction(String userRole) {
        return userRole != null &&
                (userRole.equalsIgnoreCase("SYSTEM") ||
                        userRole.equalsIgnoreCase("AUTOMATED"));
    }

    /**
     * Format user agent for audit log
     */
    public static String getUserAgent(HttpServletRequest request) {
        String userAgent = request.getHeader("User-Agent");
        if (userAgent == null || userAgent.isEmpty()) {
            return "Unknown";
        }

        // Truncate long user agents
        if (userAgent.length() > 100) {
            userAgent = userAgent.substring(0, 97) + "...";
        }

        return userAgent;
    }

    /**
     * Get browser name from user agent
     */
    public static String getBrowserName(String userAgent) {
        if (userAgent == null)
            return "Unknown";

        if (userAgent.contains("Chrome"))
            return "Chrome";
        if (userAgent.contains("Firefox"))
            return "Firefox";
        if (userAgent.contains("Safari"))
            return "Safari";
        if (userAgent.contains("Edge"))
            return "Edge";
        if (userAgent.contains("Opera"))
            return "Opera";
        if (userAgent.contains("MSIE") || userAgent.contains("Trident"))
            return "Internet Explorer";

        return "Other";
    }

    /**
     * Validate audit log data before saving
     */
    public static boolean isValidAuditData(String action, String description) {
        if (action == null || action.trim().isEmpty()) {
            return false;
        }
        if (description == null || description.trim().isEmpty()) {
            return false;
        }
        if (action.length() > 100) {
            return false;
        }
        return true;
    }
}