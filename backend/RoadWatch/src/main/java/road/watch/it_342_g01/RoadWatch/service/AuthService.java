package road.watch.it_342_g01.RoadWatch.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import okhttp3.*;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import road.watch.it_342_g01.RoadWatch.dto.AuthResponse;
import road.watch.it_342_g01.RoadWatch.dto.LoginRequest;
import road.watch.it_342_g01.RoadWatch.dto.UserDTO;
import road.watch.it_342_g01.RoadWatch.entity.role;
import road.watch.it_342_g01.RoadWatch.entity.userEntity;
import road.watch.it_342_g01.RoadWatch.repository.userRepo;
import road.watch.it_342_g01.RoadWatch.security.JwtUtil;

import java.io.IOException;

@Slf4j
@Service
@RequiredArgsConstructor
public class AuthService {

    private final userRepo userRepository;
    private final JwtUtil jwtUtil; // ⭐ ADD THIS
    private final OkHttpClient httpClient = new OkHttpClient();
    private final ObjectMapper objectMapper = new ObjectMapper();

    @Value("${supabase.url}")
    private String supabaseUrl;

    @Value("${supabase.anon-key}")
    private String supabaseAnonKey;

    /**
     * Login with email and password via Supabase
     */
    public AuthResponse login(LoginRequest request) {
        try {
            log.info("🔐 Login attempt for email: {}", request.getEmail());

            // Step 1: Authenticate with Supabase
            JsonNode supabaseResponse = loginWithSupabase(request.getEmail(), request.getPassword());

            // Step 2: Get user data from response
            String supabaseUserId = supabaseResponse.get("user").get("id").asText();
            
            // Step 3: Find or create user in our database
            userEntity user = userRepository.findBySupabaseId(supabaseUserId)
                .orElseGet(() -> syncUserFromSupabase(supabaseResponse.get("user")));

            // Step 4: Generate OUR JWT token
            String jwtToken = jwtUtil.generateToken(
                user.getEmail(),
                user.getId(),
                user.getRole().toString()
            );

            // Step 5: Build response
            UserDTO userDTO = buildUserDTO(user);

            log.info("✅ Login successful for user: {}", user.getEmail());

            return AuthResponse.builder()
                .accessToken(jwtToken)
                .refreshToken(null)
                .user(userDTO)
                .build();

        } catch (Exception e) {
            log.error("❌ Login failed: {}", e.getMessage(), e);
            throw new RuntimeException("Login failed: " + e.getMessage());
        }
    }

    /**
     * Handle Google OAuth login
     */
    public AuthResponse loginWithGoogle(String supabaseAccessToken) {
        try {
            log.info("🔐 Google OAuth login");

            // Step 1: Validate Supabase token and get user info
            JsonNode userInfo = getSupabaseUserInfo(supabaseAccessToken);

            // Step 2: Extract user data
            String supabaseUserId = userInfo.get("id").asText();

            // Step 3: Find or create user in our database
            userEntity user = userRepository.findBySupabaseId(supabaseUserId)
                .orElseGet(() -> syncUserFromSupabase(userInfo));

            // Step 4: Generate OUR JWT token
            String jwtToken = jwtUtil.generateToken(
                user.getEmail(),
                user.getId(),
                user.getRole().toString()
            );

            // Step 5: Build response
            UserDTO userDTO = buildUserDTO(user);

            log.info("✅ Google login successful for user: {}", user.getEmail());

            return AuthResponse.builder()
                .accessToken(jwtToken)
                .refreshToken(null)
                .user(userDTO)
                .build();

        } catch (Exception e) {
            log.error("❌ Google login failed: {}", e.getMessage(), e);
            throw new RuntimeException("Google login failed: " + e.getMessage());
        }
    }

    /**
     * Authenticate with Supabase using email/password
     */
    private JsonNode loginWithSupabase(String email, String password) throws IOException {
        String jsonBody = String.format("""
            {
                "email": "%s",
                "password": "%s"
            }
            """, email, password);

        RequestBody body = RequestBody.create(
            jsonBody,
            MediaType.parse("application/json")
        );

        Request request = new Request.Builder()
            .url(supabaseUrl + "/auth/v1/token?grant_type=password")
            .addHeader("apikey", supabaseAnonKey)
            .addHeader("Content-Type", "application/json")
            .post(body)
            .build();

        try (Response response = httpClient.newCall(request).execute()) {
            String responseBody = response.body().string();

            if (!response.isSuccessful()) {
                log.error("Supabase login error: {}", responseBody);
                throw new RuntimeException("Invalid email or password");
            }

            return objectMapper.readTree(responseBody);
        }
    }

    /**
     * Get user info from Supabase using access token
     */
    private JsonNode getSupabaseUserInfo(String accessToken) throws IOException {
        Request request = new Request.Builder()
            .url(supabaseUrl + "/auth/v1/user")
            .addHeader("Authorization", "Bearer " + accessToken)
            .addHeader("apikey", supabaseAnonKey)
            .get()
            .build();

        try (Response response = httpClient.newCall(request).execute()) {
            String responseBody = response.body().string();

            if (!response.isSuccessful()) {
                throw new RuntimeException("Invalid access token");
            }

            return objectMapper.readTree(responseBody);
        }
    }

    /**
     * Sync user from Supabase to our database
     */
    private userEntity syncUserFromSupabase(JsonNode supabaseUser) {
        log.info("🔄 Syncing new user from Supabase");

        userEntity user = new userEntity();
        user.setSupabaseId(supabaseUser.get("id").asText());
        user.setEmail(supabaseUser.get("email").asText());

        // Get metadata if exists
        if (supabaseUser.has("user_metadata")) {
            JsonNode metadata = supabaseUser.get("user_metadata");
            String roleString = metadata.get("role").asText().toUpperCase();
            if (metadata.has("username")) {
                user.setUsername(metadata.get("username").asText());
            }
            if (metadata.has("name")) {
                user.setName(metadata.get("name").asText());
            } else if (metadata.has("full_name")) {
                user.setName(metadata.get("full_name").asText());
            }
            if (metadata.has("contact")) {
                user.setContact(metadata.get("contact").asText());
            }
            if (metadata.has("role")) {
                user.setRole(role.valueOf(metadata.get("role").asText()));
            }



            if (roleString.equals("USER")) {
                user.setRole(role.CITIZEN);
            }else {
                // Otherwise try to use whatever role is there (ADMIN, INSPECTOR, etc.)
                try {
                    user.setRole(role.valueOf(roleString));
                } catch (IllegalArgumentException e) {
                    log.warn("Unknown role '{}', defaulting to CITIZEN", roleString);
                    user.setRole(role.CITIZEN);
                }
            }
        } else {
            user.setRole(role.CITIZEN);
        }

        return userRepository.save(user);
    }

    /**
     * Build UserDTO from userEntity
     */
    private UserDTO buildUserDTO(userEntity user) {
        return UserDTO.builder()
            .id(user.getId())
            .supabaseId(user.getSupabaseId())
            .username(user.getUsername())
            .name(user.getName())
            .email(user.getEmail())
            .role(user.getRole() != null ? user.getRole().toString() : "CITIZEN")
            .contact(user.getContact())
            .build();
    }
}