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

import java.util.HashMap;
import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/auth")
@CrossOrigin
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;
    private final userRepo userRepository;

    /**
     * 🆕 CITIZEN REGISTRATION - Manual signup with email/password
     * POST /auth/register
     * Body: { "username": "john", "name": "John Doe", "email": "john@example.com",
     * "password": "password123", "contact": "+639123456789" }
     */
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request) {
        log.info("📥 Received registration request for: {}", request.getEmail());
        try {
            AuthResponse response = authService.registerCitizen(request);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("❌ Registration failed: {}", e.getMessage());
            Map<String, Object> error = new HashMap<>();
            error.put("success", false);
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    /**
     * 🆕 INSPECTOR LOGIN - Email + Password (No Supabase)
     * Similar to Node.js /login-student endpoint
     * 
     * POST /auth/login-inspector
     * Body: { "email": "inspector@example.com", "password": "password123" }
     */
    @PostMapping("/login-inspector")
    public ResponseEntity<AuthResponse> loginInspector(@RequestBody InspectorLoginRequest request) {
        log.info("📥 Received inspector login request for: {}", request.getEmail());
        AuthResponse response = authService.loginInspector(request);
        return ResponseEntity.ok(response);
    }

    /**
     * CITIZEN/ADMIN LOGIN - Hybrid (Supabase or Local)
     * Handles both Supabase users and local users
     */
    @PostMapping(value = "/login", consumes = "application/json", produces = "application/json")
    public ResponseEntity<AuthResponse> login(@RequestBody LoginRequest request) {
        log.info("📥 Received login request for: {}", request.getEmail());
        AuthResponse response = authService.login(request);
        return ResponseEntity.ok(response);
    }
    @PostMapping(value = "/local-login", consumes = "application/json", produces = "application/json")
    public ResponseEntity<AuthResponse> localLogin(@RequestBody LoginRequest request) {
        log.info("📥 Received local login request for: {}", request.getEmail());
        AuthResponse response = authService.localLogin(request);
        return ResponseEntity.ok(response);
    }

    /**
     * GOOGLE OAUTH - Citizens only
     * Frontend sends Supabase access token after Google OAuth
     */
    @PostMapping("/google")
    public ResponseEntity<AuthResponse> googleLogin(@RequestBody GoogleAuthRequest request) {
        log.info("📥 Received Google OAuth login request");
        AuthResponse response = authService.loginWithGoogle(request.getAccessToken());
        return ResponseEntity.ok(response);
    }

    /**
     * Get current user profile (protected endpoint)
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
    public ResponseEntity<String> logout() {
        return ResponseEntity.ok("Logged out successfully");
    }
}