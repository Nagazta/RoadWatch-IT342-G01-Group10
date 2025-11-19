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

    // CREATE
    @PostMapping("/add")
    public ResponseEntity<?> addUser(@RequestBody userEntity user) {
        log.info("========================================");
        log.info("📥 Received user creation request");
        log.info("Email: {}", user.getEmail());
        log.info("Username: {}", user.getUsername());
        log.info("Role: {}", user.getRole());
        log.info("========================================");
        
        try {
            // Validate input
            if (user.getEmail() == null || user.getEmail().trim().isEmpty()) {
                log.error("❌ Validation failed: Email is required");
                return ResponseEntity.badRequest().body(createErrorResponse("Email is required"));
            }
            
            if (user.getPassword() == null || user.getPassword().trim().isEmpty()) {
                log.error("❌ Validation failed: Password is required");
                return ResponseEntity.badRequest().body(createErrorResponse("Password is required"));
            }
            
            if (user.getPassword().length() < 6) {
                log.error("❌ Validation failed: Password too short");
                return ResponseEntity.badRequest().body(createErrorResponse("Password must be at least 6 characters"));
            }

            // Create user
            userEntity createdUser = userService.createUser(user);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "User created successfully");
            response.put("data", Map.of(
                "id", createdUser.getId(),
                "username", createdUser.getUsername(),
                "email", createdUser.getEmail(),
                "role", createdUser.getRole().toString()
            ));
            
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
            // Try to count users (simple query)
            long count = userService.getAllUsers().size();  // Use userService instead
            
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
    
    
}