package road.watch.it_342_g01.RoadWatch.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import okhttp3.*;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import road.watch.it_342_g01.RoadWatch.dto.AuthResponse;
import road.watch.it_342_g01.RoadWatch.dto.InspectorLoginRequest;
import road.watch.it_342_g01.RoadWatch.dto.LoginRequest;
import road.watch.it_342_g01.RoadWatch.dto.RegisterRequest;
import road.watch.it_342_g01.RoadWatch.dto.UserDTO;
import road.watch.it_342_g01.RoadWatch.entity.*;
import road.watch.it_342_g01.RoadWatch.repository.adminRepo;
import road.watch.it_342_g01.RoadWatch.repository.citizenRepo;
import road.watch.it_342_g01.RoadWatch.repository.inspectorRepo;
import road.watch.it_342_g01.RoadWatch.repository.userRepo;
import road.watch.it_342_g01.RoadWatch.security.JwtUtil;
import road.watch.it_342_g01.RoadWatch.exception.InvalidCredentialsException;
import road.watch.it_342_g01.RoadWatch.exception.SupabaseLoginException;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

@Slf4j
@Service
@RequiredArgsConstructor
public class AuthService {

    private final userRepo userRepository;
    private final inspectorRepo inspectorRepository;
    private final adminRepo adminRepository;
    private final citizenRepo citizenRepository;
    private final JwtUtil jwtUtil;
    private final PasswordEncoder passwordEncoder;
    private final userService userService; // 🆕 Inject userService for creating users

    private final OkHttpClient httpClient = new OkHttpClient();
    private final ObjectMapper objectMapper = new ObjectMapper();

    @Value("${supabase.url}")
    private String supabaseUrl;

    @Value("${supabase.anon-key}")
    private String supabaseAnonKey;

    /**
     * 🆕 CITIZEN REGISTRATION - Manual signup (No Supabase initially)
     * After registration, citizen must verify email through Supabase
     */
    public AuthResponse registerCitizen(RegisterRequest request) {
        log.info("🔐 [CITIZEN REGISTRATION] Attempt for email: {}", request.getEmail());

        try {
            // Step 1: Check if user already exists
            if (userRepository.findByEmail(request.getEmail()).isPresent()) {
                throw new RuntimeException("Email already registered");
            }

            // Step 2: Create user entity
            userEntity user = new userEntity();
            user.setUsername(request.getUsername());
            user.setName(request.getName());
            user.setEmail(request.getEmail());
            user.setPassword(request.getPassword()); // Will be hashed in userService
            user.setContact(request.getContact());
            user.setRole(role.CITIZEN);
            user.setSupabaseId(null); // No Supabase ID for manual registration initially

            // Step 3: Create user (citizen record will be auto-created)
            userEntity savedUser = userService.createUser(user, null, null, null);

            log.info("✅ [REGISTRATION] Citizen registered successfully: {}", savedUser.getEmail());

            // Step 4: Auto-login after registration
            String jwtToken = jwtUtil.generateToken(
                    savedUser.getEmail(),
                    savedUser.getId(),
                    savedUser.getRole().toString());

            // Step 5: Get citizen data
            Map<String, Object> roleData = getRoleData(savedUser);

            return AuthResponse.builder()
                    .success(true)
                    .message("Registration successful")
                    .accessToken(jwtToken)
                    .refreshToken(null)
                    .user(buildUserDTO(savedUser))
                    .roleData(roleData)
                    .build();

        } catch (Exception e) {
            log.error("❌ [REGISTRATION] Failed: {}", e.getMessage(), e);
            throw new RuntimeException("Registration failed: " + e.getMessage());
        }
    }

    /**
     * 🆕 INSPECTOR LOGIN - Email + Password (No Supabase, JWT only)
     */
    public AuthResponse loginInspector(InspectorLoginRequest request) {
        log.info("🔐 [INSPECTOR LOGIN] Attempt for email: {}", request.getEmail());

        try {
            // Step 1: Find user by email
            userEntity user = userRepository.findByEmail(request.getEmail())
                    .orElseThrow(() -> {
                        log.error("❌ [INSPECTOR LOGIN] User not found: {}", request.getEmail());
                        return new InvalidCredentialsException("Invalid email or password");
                    });

            log.info("✅ [USER LOOKUP] Found user ID: {}, Role: {}", user.getId(), user.getRole());

            // Step 2: Verify user is actually an inspector
            if (!role.INSPECTOR.equals(user.getRole())) {
                log.error("❌ [INSPECTOR LOGIN] User is not an inspector. Role: {}", user.getRole());
                throw new InvalidCredentialsException("Invalid email or password");
            }

            // Step 3: Verify password (hashed in DB)
            if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
                log.error("❌ [INSPECTOR LOGIN] Password mismatch for user: {}", user.getEmail());
                throw new InvalidCredentialsException("Invalid email or password");
            }

            log.info("✅ [PASSWORD] Password verified successfully");

            // Step 4: Get inspector record
            inspectorEntity inspector = inspectorRepository.findByUser_Id(user.getId())
                    .orElseThrow(() -> {
                        log.error("❌ [INSPECTOR LOOKUP] Inspector record not found for user ID: {}", user.getId());
                        return new RuntimeException("Inspector record not found");
                    });

            log.info("✅ [INSPECTOR LOOKUP] Inspector ID: {}, Area: {}",
                    inspector.getId(), inspector.getAreaAssignment());

            // Step 5: Generate JWT token
            String jwtToken = jwtUtil.generateToken(
                    user.getEmail(),
                    user.getId(),
                    user.getRole().toString());

            log.info("✅ [JWT] Generated token for inspector ID: {}", inspector.getId());

            // Step 6: Build response with roleData
            UserDTO userDTO = buildUserDTO(user);

            Map<String, Object> roleData = new HashMap<>();
            roleData.put("inspector_id", inspector.getId());
            roleData.put("area_assignment", inspector.getAreaAssignment());
            roleData.put("created_by_admin_id", inspector.getCreatedByAdminId());

            log.info("✅ [SUCCESS] Inspector login successful: {}", user.getEmail());

            return AuthResponse.builder()
                    .success(true)
                    .message("Inspector login successful")
                    .accessToken(jwtToken)
                    .refreshToken(null)
                    .user(userDTO)
                    .roleData(roleData)
                    .build();

        } catch (InvalidCredentialsException e) {
            log.error("❌ [CATCH] Invalid credentials: {}", e.getMessage());
            throw e;
        } catch (Exception e) {
            log.error("❌ [CATCH] Inspector login error: {}", e.getMessage(), e);
            throw new RuntimeException("Inspector login failed: " + e.getMessage());
        }
    }

    /**
     * CITIZEN/ADMIN LOGIN - Hybrid (Supabase or Local)
     */
    public AuthResponse login(LoginRequest request) {
        userEntity user = userRepository.findByEmail(request.getEmail()).orElse(null);

        // Local-only user (Inspector/Admin - no Supabase ID)
        if (user != null && user.getSupabaseId() == null) {
            if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
                throw new InvalidCredentialsException("Invalid email or password");
            }

            String jwtToken = jwtUtil.generateToken(user.getEmail(), user.getId(), user.getRole().toString());

            Map<String, Object> roleData = getRoleData(user);

            return AuthResponse.builder()
                    .success(true)
                    .message("Login successful")
                    .accessToken(jwtToken)
                    .refreshToken(null)
                    .user(buildUserDTO(user))
                    .roleData(roleData)
                    .build();
        }

        // Supabase user (Citizen)
        try {
            JsonNode supabaseResponse = loginWithSupabaseSafe(request.getEmail(), request.getPassword());
            String supabaseUserId = supabaseResponse.get("user").get("id").asText();

            user = userRepository.findBySupabaseId(supabaseUserId)
                    .orElseGet(() -> syncUserFromSupabase(supabaseResponse.get("user")));

            String jwtToken = jwtUtil.generateToken(user.getEmail(), user.getId(), user.getRole().toString());

            Map<String, Object> roleData = getRoleData(user);

            return AuthResponse.builder()
                    .success(true)
                    .message("Login successful")
                    .accessToken(jwtToken)
                    .refreshToken(null)
                    .user(buildUserDTO(user))
                    .roleData(roleData)
                    .build();

        } catch (Exception e) {
            throw new InvalidCredentialsException("Invalid email or password");
        }
    }

    /**
     * 🆕 Handle Google OAuth login (CITIZEN only)
     */
    public AuthResponse loginWithGoogle(String supabaseAccessToken) {
        try {
            log.info("🔐 Google OAuth login");

            // Step 1: Get user info from Supabase
            JsonNode userInfo = getSupabaseUserInfo(supabaseAccessToken);
            String supabaseUserId = userInfo.get("id").asText();
            String email = userInfo.get("email").asText();

            // Step 2: Extract Google ID from identities
            String googleId = null;
            if (userInfo.has("identities")) {
                JsonNode identities = userInfo.get("identities");
                if (identities.isArray() && identities.size() > 0) {
                    JsonNode googleIdentity = identities.get(0);
                    if (googleIdentity.has("id")) {
                        googleId = googleIdentity.get("id").asText();
                    }
                }
            }

            final String finalGoogleId = googleId; // ✅ Make it final for lambda usage

            log.info("🔍 Supabase ID: {}, Google ID: {}", supabaseUserId, finalGoogleId);

            // Step 3: Find or create user
            userEntity user = userRepository.findBySupabaseId(supabaseUserId)
                    .orElseGet(() -> {
                        log.info("🆕 Creating new user from Google OAuth");
                        return createUserFromGoogleOAuth(userInfo, supabaseUserId, finalGoogleId);
                    });

            // Step 4: Ensure citizen record exists with Google ID
            citizenEntity citizen = citizenRepository.findByUser_Id(user.getId())
                    .orElseGet(() -> {
                        log.info("🆕 Creating citizen record for user ID: {}", user.getId());
                        citizenEntity newCitizen = new citizenEntity();
                        newCitizen.setUser(user);
                        newCitizen.setGoogleId(finalGoogleId);
                        newCitizen.setTotalReports(0);
                        return citizenRepository.save(newCitizen);
                    });

            // Update Google ID if it changed
            if (finalGoogleId != null && !finalGoogleId.equals(citizen.getGoogleId())) {
                citizen.setGoogleId(finalGoogleId);
                citizenRepository.save(citizen);
            }

            // Step 5: Generate JWT token
            String jwtToken = jwtUtil.generateToken(
                    user.getEmail(),
                    user.getId(),
                    user.getRole().toString());

            // Step 6: Build response with citizen data
            Map<String, Object> roleData = new HashMap<>();
            roleData.put("citizen_id", citizen.getCitizenId());
            roleData.put("google_id", citizen.getGoogleId());
            roleData.put("total_reports", citizen.getTotalReports());

            log.info("✅ Google login successful for user: {}", user.getEmail());

            return AuthResponse.builder()
                    .success(true)
                    .message("Google login successful")
                    .accessToken(jwtToken)
                    .refreshToken(null)
                    .user(buildUserDTO(user))
                    .roleData(roleData)
                    .build();

        } catch (Exception e) {
            log.error("❌ Google login failed: {}", e.getMessage(), e);
            throw new RuntimeException("Google login failed: " + e.getMessage());
        }
    }

    /**
     * 🆕 Create user from Google OAuth data
     */
    private userEntity createUserFromGoogleOAuth(JsonNode userInfo, String supabaseUserId, String googleId) {
        userEntity user = new userEntity();
        user.setSupabaseId(supabaseUserId);
        user.setEmail(userInfo.get("email").asText());
        user.setRole(role.CITIZEN);

        // Extract name from user_metadata or email
        if (userInfo.has("user_metadata")) {
            JsonNode metadata = userInfo.get("user_metadata");
            if (metadata.has("full_name")) {
                user.setName(metadata.get("full_name").asText());
            } else if (metadata.has("name")) {
                user.setName(metadata.get("name").asText());
            }
        }

        if (user.getName() == null) {
            user.setName(user.getEmail().split("@")[0]);
        }

        // Save using userService to trigger citizen record creation
        return userService.createUser(user, null, null, googleId);
    }

    /**
     * Get role-specific data for response
     */
    private Map<String, Object> getRoleData(userEntity user) {
        Map<String, Object> roleData = new HashMap<>();

        if (role.INSPECTOR.equals(user.getRole())) {
            inspectorRepository.findByUser_Id(user.getId()).ifPresent(inspector -> {
                roleData.put("inspector_id", inspector.getId());
                roleData.put("area_assignment", inspector.getAreaAssignment());
                roleData.put("created_by_admin_id", inspector.getCreatedByAdminId());
            });
        } else if (role.ADMIN.equals(user.getRole())) {
            adminRepository.findByUser_Id(user.getId()).ifPresent(admin -> {
                roleData.put("admin_id", admin.getAdminId());
                roleData.put("department", admin.getDepartment());
            });
        } else if (role.CITIZEN.equals(user.getRole())) {
            citizenRepository.findByUser_Id(user.getId()).ifPresent(citizen -> {
                roleData.put("citizen_id", citizen.getCitizenId());
                roleData.put("google_id", citizen.getGoogleId());
                roleData.put("total_reports", citizen.getTotalReports());
            });
        }

        return roleData;
    }

    private JsonNode loginWithSupabaseSafe(String email, String password) throws IOException {
        String jsonBody = String.format("""
                {
                    "email": "%s",
                    "password": "%s"
                }
                """, email, password);

        RequestBody body = RequestBody.create(jsonBody, MediaType.parse("application/json"));

        Request request = new Request.Builder()
                .url(supabaseUrl + "/auth/v1/token?grant_type=password")
                .addHeader("apikey", supabaseAnonKey)
                .addHeader("Content-Type", "application/json")
                .post(body)
                .build();

        try (Response response = httpClient.newCall(request).execute()) {
            String responseBody = response.body().string();

            if (!response.isSuccessful()) {
                JsonNode errorNode = objectMapper.readTree(responseBody).path("error");
                throw new SupabaseLoginException("Supabase login failed: " + errorNode.asText());
            }

            return objectMapper.readTree(responseBody);
        }
    }

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

    private userEntity syncUserFromSupabase(JsonNode supabaseUser) {
        log.info("🔄 Syncing user from Supabase");

        userEntity user = new userEntity();
        user.setSupabaseId(supabaseUser.get("id").asText());
        user.setEmail(supabaseUser.get("email").asText());
        user.setRole(role.CITIZEN);

        if (supabaseUser.has("user_metadata")) {
            JsonNode metadata = supabaseUser.get("user_metadata");
            if (metadata.has("name")) {
                user.setName(metadata.get("name").asText());
            } else if (metadata.has("full_name")) {
                user.setName(metadata.get("full_name").asText());
            }
        }

        if (user.getName() == null) {
            user.setName(user.getEmail().split("@")[0]);
        }

        return userService.createUser(user, null, null, null);
    }

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

    public AuthResponse getUserProfile(String email) {
        userEntity user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Map<String, Object> roleData = getRoleData(user);

        return AuthResponse.builder()
                .success(true)
                .message("Profile retrieved successfully")
                .accessToken(null)
                .refreshToken(null)
                .user(buildUserDTO(user))
                .roleData(roleData)
                .build();
    }

    public AuthResponse localLogin(LoginRequest request) {
        userEntity user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new InvalidCredentialsException("Invalid email or password"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new InvalidCredentialsException("Invalid email or password");
        }

        String jwtToken = jwtUtil.generateToken(user.getEmail(), user.getId(), user.getRole().toString());
        Map<String, Object> roleData = getRoleData(user);

        return AuthResponse.builder()
                .success(true)
                .message("Local login successful")
                .accessToken(jwtToken)
                .refreshToken(null)
                .user(buildUserDTO(user))
                .roleData(roleData)
                .build();
    }

    /**
     * Verify if a plain password matches a hashed password
     */
    public boolean verifyPassword(String plainPassword, String hashedPassword) {
        return passwordEncoder.matches(plainPassword, hashedPassword);
    }

    /**
     * Hash a password
     */
    public String hashPassword(String plainPassword) {
        return passwordEncoder.encode(plainPassword);
    }
}