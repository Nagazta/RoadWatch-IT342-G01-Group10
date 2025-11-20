package road.watch.it_342_g01.RoadWatch.Controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import road.watch.it_342_g01.RoadWatch.dto.AuthResponse;
import road.watch.it_342_g01.RoadWatch.dto.GoogleAuthRequest;
import road.watch.it_342_g01.RoadWatch.dto.LoginRequest;
import road.watch.it_342_g01.RoadWatch.dto.UserDTO;
import road.watch.it_342_g01.RoadWatch.entity.userEntity;
import road.watch.it_342_g01.RoadWatch.repository.userRepo;
import road.watch.it_342_g01.RoadWatch.service.AuthService;

@RestController
@RequestMapping("/auth")
@CrossOrigin
@RequiredArgsConstructor  // ⭐ IMPORTANT - This must be present
public class AuthController {

    // ⭐ These fields MUST be declared as 'private final'
    private final AuthService authService;
    private final userRepo userRepository;

    /**
     * Login with email and password
     */
    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody LoginRequest request) {
        AuthResponse response = authService.login(request);
        return ResponseEntity.ok(response);
    }

    /**
     * Login/Register with Google OAuth
     * Frontend sends Supabase access token after Google OAuth
     */
    @PostMapping("/google")
    public ResponseEntity<AuthResponse> googleLogin(@RequestBody GoogleAuthRequest request) {
        AuthResponse response = authService.loginWithGoogle(request.getAccessToken());
        return ResponseEntity.ok(response);
    }

    /**
     * Get current user profile (protected endpoint)
     */
    @GetMapping("/profile")
    public ResponseEntity<UserDTO> getCurrentUserProfile() {
        // Get email from security context
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
     * Logout (optional - mainly handled on frontend)
     */
    @PostMapping("/logout")
    public ResponseEntity<String> logout() {
        // In a stateless setup, logout is handled by frontend removing tokens
        // You can add token blacklisting here if needed
        return ResponseEntity.ok("Logged out successfully");
    }
}