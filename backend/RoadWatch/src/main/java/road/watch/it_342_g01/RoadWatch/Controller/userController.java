package road.watch.it_342_g01.RoadWatch.Controller;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import road.watch.it_342_g01.RoadWatch.entity.userEntity;
import road.watch.it_342_g01.RoadWatch.service.userService;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Slf4j
@RestController
@RequestMapping("api/users")
@CrossOrigin
public class userController {

    @Autowired
    private userService userService;

    // CREATE - Updated to accept Map to handle createdByAdminId
    @PostMapping("/add")
    public ResponseEntity<?> addUser(@RequestBody Map<String, Object> requestBody) {
        log.info("========================================");
        log.info("📥 Received user creation request");
        log.info("Request body: {}", requestBody);
        log.info("========================================");

        try {
            // Extract fields from request body
            String email = (String) requestBody.get("email");
            String username = (String) requestBody.get("username");
            String name = (String) requestBody.get("name");
            String password = (String) requestBody.get("password");
            String contact = (String) requestBody.get("contact");
            String assignedArea = (String) requestBody.get("assignedArea");
            String roleStr = (String) requestBody.get("role");
            Object createdByAdminIdObj = requestBody.get("createdByAdminId");
            
            // Parse createdByAdminId
            Long createdByAdminId = null;
            if (createdByAdminIdObj != null) {
                if (createdByAdminIdObj instanceof Number) {
                    createdByAdminId = ((Number) createdByAdminIdObj).longValue();
                } else if (createdByAdminIdObj instanceof String) {
                    try {
                        createdByAdminId = Long.parseLong((String) createdByAdminIdObj);
                    } catch (NumberFormatException e) {
                        log.warn("⚠️ Invalid createdByAdminId format: {}", createdByAdminIdObj);
                    }
                }
            }

            log.info("Email: {}", email);
            log.info("Username: {}", username);
            log.info("Role: {}", roleStr);
            log.info("Assigned Area: {}", assignedArea); // Add this log
            log.info("Created by admin ID: {}", createdByAdminId);

            // Validate input
            if (email == null || email.trim().isEmpty()) {
                log.error("❌ Validation failed: Email is required");
                return ResponseEntity.badRequest().body(createErrorResponse("Email is required"));
            }

            if (password == null || password.trim().isEmpty()) {
                log.error("❌ Validation failed: Password is required");
                return ResponseEntity.badRequest().body(createErrorResponse("Password is required"));
            }

            if (password.length() < 6) {
                log.error("❌ Validation failed: Password too short");
                return ResponseEntity.badRequest().body(createErrorResponse("Password must be at least 6 characters"));
            }

            // Create user entity
            userEntity user = new userEntity();
            user.setEmail(email);
            user.setUsername(username);
            user.setName(name);
            user.setPassword(password);
            user.setContact(contact);
            
            // Set role
            if (roleStr != null) {
                try {
                    user.setRole(road.watch.it_342_g01.RoadWatch.entity.role.valueOf(roleStr.toUpperCase()));
                } catch (IllegalArgumentException e) {
                    log.error("❌ Invalid role: {}", roleStr);
                    return ResponseEntity.badRequest().body(createErrorResponse("Invalid role: " + roleStr));
                }
            }

            // ✅ Create user with admin ID
            userEntity createdUser = userService.createUser(user, createdByAdminId, assignedArea);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "User created successfully");
            response.put("data", Map.of(
                    "id", createdUser.getId(),
                    "username", createdUser.getUsername(),
                    "email", createdUser.getEmail(),
                    "role", createdUser.getRole().toString()));

            log.info("✅ User created successfully with ID: {}", createdUser.getId());
            return ResponseEntity.status(HttpStatus.CREATED).body(response);

        } catch (IllegalArgumentException e) {
            log.error("❌ Validation error: {}", e.getMessage());
            return ResponseEntity.badRequest().body(createErrorResponse(e.getMessage()));

        } catch (Exception e) {
            log.error("❌ Unexpected error creating user", e);
            log.error("Error class: {}", e.getClass().getName());
            log.error("Error message: {}", e.getMessage());
            if (e.getCause() != null) {
                log.error("Caused by: {}", e.getCause().getMessage());
            }
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(createErrorResponse("Failed to create user: " + e.getMessage()));
        }
    }

    private Map<String, Object> createErrorResponse(String message) {
        Map<String, Object> error = new HashMap<>();
        error.put("success", false);
        error.put("error", message);
        return error;
    }

    // READ ALL
    @GetMapping("/getAll")
    public ResponseEntity<List<userEntity>> getAllUsers() {
        log.info("📋 Fetching all users");
        return ResponseEntity.ok(userService.getAllUsers());
    }

    // READ ONE
    @GetMapping("/getBy/{id}")
    public ResponseEntity<?> getUserById(@PathVariable Long id) {
        log.info("🔍 Fetching user with ID: {}", id);
        return userService.getUserById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // UPDATE
    @PutMapping("/updateBy/{id}")
    public ResponseEntity<?> updateUser(@PathVariable Long id, @RequestBody userEntity user) {
        log.info("✏️ Updating user with ID: {}", id);
        try {
            userEntity updated = userService.updateUser(id, user);
            return ResponseEntity.ok(updated);
        } catch (RuntimeException e) {
            log.error("❌ Error updating user: {}", e.getMessage());
            return ResponseEntity.badRequest().body(createErrorResponse(e.getMessage()));
        }
    }

    // DELETE
    @DeleteMapping("/deleteBy/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable Long id) {
        log.info("🗑️ Deleting user with ID: {}", id);
        try {
            userService.deleteUser(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            log.error("❌ Error deleting user: {}", e.getMessage());
            return ResponseEntity.badRequest().body(createErrorResponse(e.getMessage()));
        }
    }

    @GetMapping("/test")
    public ResponseEntity<String> test() {
        log.info("🧪 Test endpoint called");
        return ResponseEntity.ok("Hello from users endpoint!");
    }

    @GetMapping("/db-test")
    public ResponseEntity<?> testDatabaseConnection() {
        try {
            long count = userService.getAllUsers().size();

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Database connection working!");
            response.put("userCount", count);

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            Map<String, Object> error = new HashMap<>();
            error.put("success", false);
            error.put("error", e.getClass().getName());
            error.put("message", e.getMessage());
            error.put("cause", e.getCause() != null ? e.getCause().getMessage() : "No cause");

            return ResponseEntity.status(500).body(error);
        }
    }

    @GetMapping("/profile")
    public ResponseEntity<?> getProfile(@RequestParam Long userId) {
        return userService.getUserById(userId)
                .<ResponseEntity<?>>map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(Map.of("success", false, "message", "User not found")));
    }

    @PutMapping("/profile")
    public ResponseEntity<?> updateProfile(@RequestParam Long userId, @RequestBody userEntity updatedUser) {
        try {
            userEntity updated = userService.updateUser(userId, updatedUser);
            return ResponseEntity.ok(Map.of("success", true, "data", updated));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("success", false, "message", e.getMessage()));
        }
    }
}