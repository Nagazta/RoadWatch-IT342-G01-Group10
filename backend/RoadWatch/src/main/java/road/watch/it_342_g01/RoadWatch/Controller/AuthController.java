package road.watch.it_342_g01.RoadWatch.Controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import road.watch.it_342_g01.RoadWatch.dto.*;
import road.watch.it_342_g01.RoadWatch.entity.userEntity;
import road.watch.it_342_g01.RoadWatch.repository.userRepo;
import road.watch.it_342_g01.RoadWatch.service.AuthService;
import road.watch.it_342_g01.RoadWatch.service.AuditLogService;
import jakarta.servlet.http.HttpServletRequest;

import java.util.HashMap;
import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/auth")

@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;
    private final userRepo userRepository;
    private final AuditLogService auditLogService;

    /**
     * CITIZEN REGISTRATION - Manual signup with email/password
     */
    @PostMapping("/register")
    public ResponseEntity<?> register(
            @RequestBody RegisterRequest request,
            HttpServletRequest httpRequest) {
        log.info("📥 Received registration request for: {}", request.getEmail());
        try {
            AuthResponse response = authService.registerCitizen(request);

            // ✅ Audit log: User registration
            if (response.getUser() != null) {
                auditLogService.logActionWithIp(
                        response.getUser().getId(),
                        "User Registration",
                        "Citizen registered: " + request.getEmail(),
                        httpRequest.getRemoteAddr());
            }

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("❌ Registration failed: {}", e.getMessage());

            // ✅ Audit log: Failed registration
            auditLogService.createAuditLog(
                    "User Registration",
                    "Failed registration attempt for: " + request.getEmail() + " - " + e.getMessage(),
                    null,
                    "Failed",
                    httpRequest.getRemoteAddr(),
                    null, null, null, null);

            Map<String, Object> error = new HashMap<>();
            error.put("success", false);
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    /**
     * INSPECTOR LOGIN - Email + Password
     */
    @PostMapping("/login-inspector")
    public ResponseEntity<AuthResponse> loginInspector(
            @RequestBody InspectorLoginRequest request,
            HttpServletRequest httpRequest) {
        log.info("📥 Received inspector login request for: {}", request.getEmail());
        try {
            AuthResponse response = authService.loginInspector(request);

            // ✅ Audit log: Inspector login
            if (response.getUser() != null) {
                auditLogService.logActionWithIp(
                        response.getUser().getId(),
                        "Login",
                        "Inspector logged in: " + request.getEmail(),
                        httpRequest.getRemoteAddr());
            }

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            // ✅ Audit log: Failed login
            auditLogService.createAuditLog(
                    "Login",
                    "Failed inspector login attempt: " + request.getEmail() + " - " + e.getMessage(),
                    null,
                    "Failed",
                    httpRequest.getRemoteAddr(),
                    null, null, null, null);
            throw e;
        }
    }

    /**
     * CITIZEN/ADMIN LOGIN - Hybrid (Supabase or Local)
     */
    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(
            @RequestBody LoginRequest request,
            HttpServletRequest httpRequest) {
        log.info("📥 Received login request for: {}", request.getEmail());
        try {
            AuthResponse response = authService.login(request);

            // ✅ Audit log: User login
            if (response.getUser() != null) {
                auditLogService.logActionWithIp(
                        response.getUser().getId(),
                        "Login",
                        response.getUser().getRole() + " logged in: " + request.getEmail(),
                        httpRequest.getRemoteAddr());
            }

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            // ✅ Audit log: Failed login
            auditLogService.createAuditLog(
                    "Login",
                    "Failed login attempt: " + request.getEmail() + " - " + e.getMessage(),
                    null,
                    "Failed",
                    httpRequest.getRemoteAddr(),
                    null, null, null, null);
            throw e;
        }
    }

    /**
     * LOCAL LOGIN - Bypass Supabase
     */
    @PostMapping("/local-login")
    public ResponseEntity<AuthResponse> localLogin(
            @RequestBody LoginRequest request,
            HttpServletRequest httpRequest) {
        log.info("📥 Received local login request for: {}", request.getEmail());
        try {
            AuthResponse response = authService.localLogin(request);

            // ✅ Audit log: Local login
            if (response.getUser() != null) {
                auditLogService.logActionWithIp(
                        response.getUser().getId(),
                        "Login",
                        "Local login: " + request.getEmail(),
                        httpRequest.getRemoteAddr());
            }

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            // ✅ Audit log: Failed login
            auditLogService.createAuditLog(
                    "Login",
                    "Failed local login: " + request.getEmail() + " - " + e.getMessage(),
                    null,
                    "Failed",
                    httpRequest.getRemoteAddr(),
                    null, null, null, null);
            throw e;
        }
    }

    /**
     * GOOGLE OAUTH - Citizens only
     */
    @PostMapping("/google")
    public ResponseEntity<AuthResponse> googleLogin(
            @RequestBody GoogleAuthRequest request,
            HttpServletRequest httpRequest) {
        log.info("📥 Received Google OAuth login request");
        try {
            AuthResponse response = authService.loginWithGoogle(request.getAccessToken());

            // ✅ Audit log: Google login
            if (response.getUser() != null) {
                auditLogService.logActionWithIp(
                        response.getUser().getId(),
                        "Login",
                        "Google OAuth login: " + response.getUser().getEmail(),
                        httpRequest.getRemoteAddr());
            }

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            // ✅ Audit log: Failed Google login
            auditLogService.createAuditLog(
                    "Login",
                    "Failed Google OAuth login - " + e.getMessage(),
                    null,
                    "Failed",
                    httpRequest.getRemoteAddr(),
                    null, null, null, null);
            throw e;
        }
    }

    /**
     * Get current user profile
     */
    @GetMapping("/profile")
    public ResponseEntity<UserDTO> getCurrentUserProfile() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();

        userEntity user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        UserDTO userDTO = UserDTO.builder()
                .id(user.getId())
                .supabaseId(user.getSupabaseId())
                .username(user.getUsername())
                .name(user.getName())
                .email(user.getEmail())
                .role(user.getRole().toString())
                .contact(user.getContact())
                .build();

        return ResponseEntity.ok(userDTO);
    }

    /**
     * Logout
     */
    @PostMapping("/logout")
    public ResponseEntity<String> logout(HttpServletRequest httpRequest) {
        try {
            String email = SecurityContextHolder.getContext().getAuthentication().getName();
            userEntity user = userRepository.findByEmail(email).orElse(null);

            // ✅ Audit log: Logout
            if (user != null) {
                auditLogService.logActionWithIp(
                        user.getId(),
                        "Logout",
                        "User logged out: " + email,
                        httpRequest.getRemoteAddr());
            }
        } catch (Exception e) {
            log.warn("Could not log logout action: {}", e.getMessage());
        }

        return ResponseEntity.ok("Logged out successfully");
    }

    /**
     * Change Password - Requires current password validation
     */
    @PostMapping("/change-password")
    public ResponseEntity<?> changePassword(
            @RequestBody ChangePasswordRequest request,
            HttpServletRequest httpRequest) {
        log.info("📥 Received password change request for user ID: {}", request.getUserId());

        try {
            // Get the user
            userEntity user = userRepository.findById(request.getUserId())
                    .orElseThrow(() -> new RuntimeException("User not found"));

            // Verify current password
            if (!authService.verifyPassword(request.getCurrentPassword(), user.getPassword())) {
                log.warn("❌ Invalid current password for user: {}", user.getEmail());

                // ✅ Audit log: Failed password change
                auditLogService.logActionWithIp(
                        user.getId(),
                        "Password Change",
                        "Failed password change attempt - incorrect current password",
                        httpRequest.getRemoteAddr());

                Map<String, Object> error = new HashMap<>();
                error.put("success", false);
                error.put("error", "Current password is incorrect");
                return ResponseEntity.badRequest().body(error);
            }

            // Hash and update the new password
            String hashedPassword = authService.hashPassword(request.getNewPassword());
            user.setPassword(hashedPassword);
            userRepository.save(user);

            log.info("✅ Password changed successfully for user: {}", user.getEmail());

            // ✅ Audit log: Successful password change
            auditLogService.logActionWithIp(
                    user.getId(),
                    "Password Change",
                    "Password changed successfully",
                    httpRequest.getRemoteAddr());

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Password changed successfully");
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            log.error("❌ Password change failed: {}", e.getMessage());

            // ✅ Audit log: Failed password change
            auditLogService.createAuditLog(
                    "Password Change",
                    "Failed password change - " + e.getMessage(),
                    null,
                    "Failed",
                    httpRequest.getRemoteAddr(),
                    null, null, null, null);

            Map<String, Object> error = new HashMap<>();
            error.put("success", false);
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }
}