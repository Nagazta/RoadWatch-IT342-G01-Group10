package road.watch.it_342_g01.RoadWatch.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import okhttp3.*;

import org.hibernate.sql.Update;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional; // ← Add this import
import road.watch.it_342_g01.RoadWatch.entity.*;
import road.watch.it_342_g01.RoadWatch.repository.*;

import java.io.IOException;
import java.util.List;
import java.util.Optional;

@Slf4j
@Service
public class userService {

    @Autowired
    private userRepo userRepo;
    
    @Autowired
    private citizenRepo citizenRepo;
    
    @Autowired
    private inspectorRepo inspectorRepo;
    
   

    private final OkHttpClient httpClient = new OkHttpClient();
    private final ObjectMapper objectMapper = new ObjectMapper();

    @Value("${SUPABASE_URL}")
    private String supabaseUrl;

    @Value("${SUPABASE_SERVICE_ROLE_KEY}")
    private String supabaseServiceRoleKey;

   @Transactional
public userEntity createUser(userEntity user) {
    try {
        log.info("🔵 Starting user creation...");
        
        // Validate
        validateUser(user);

        // TEMPORARILY SKIP SUPABASE AUTH
        // String supabaseUserId = createSupabaseAuthUser(user);
        // user.setSupabaseId(supabaseUserId);
        user.setSupabaseId("temp-" + System.currentTimeMillis()); // Temporary ID

        // Save to database
        userEntity savedUser = userRepo.save(user);
        log.info("✅ User saved with ID: {}", savedUser.getId());

        return savedUser;

    } catch (Exception e) {
        log.error("❌ ERROR: {}", e.getMessage(), e);
        throw new RuntimeException("Failed to create user: " + e.getMessage(), e);
    }
}

    private void validateUser(userEntity user) {
        if (user.getEmail() == null || user.getEmail().trim().isEmpty()) {
            throw new IllegalArgumentException("Email is required");
        }
        if (user.getPassword() == null || user.getPassword().trim().isEmpty()) {
            throw new IllegalArgumentException("Password is required");
        }
        if (user.getPassword().length() < 6) {
            throw new IllegalArgumentException("Password must be at least 6 characters");
        }
        if (user.getRole() == null) {
            user.setRole(role.CITIZEN); // ← This should now work
        }
    }

    private String createSupabaseAuthUser(userEntity user) throws IOException {
        log.info("📤 Calling Supabase Admin API...");

        String jsonBody = String.format(
            "{\"email\":\"%s\",\"password\":\"%s\",\"email_confirm\":true," +
            "\"user_metadata\":{\"username\":\"%s\",\"name\":\"%s\",\"role\":\"%s\",\"contact\":\"%s\"}}",
            user.getEmail(),
            user.getPassword(),
            user.getUsername() != null ? user.getUsername() : "",
            user.getName() != null ? user.getName() : "",
            user.getRole().toString(),
            user.getContact() != null ? user.getContact() : ""
        );

        RequestBody body = RequestBody.create(jsonBody, MediaType.parse("application/json"));
        Request request = new Request.Builder()
            .url(supabaseUrl + "/auth/v1/admin/users")
            .addHeader("Authorization", "Bearer " + supabaseServiceRoleKey)
            .addHeader("apikey", supabaseServiceRoleKey)
            .addHeader("Content-Type", "application/json")
            .post(body)
            .build();

        log.info("📨 Sending request to Supabase...");

        try (Response response = httpClient.newCall(request).execute()) {
            String responseBody = response.body().string();
            
            log.info("📥 Response Status: {}", response.code());
            log.info("📥 Response Body: {}", responseBody);

            if (!response.isSuccessful()) {
                log.error("❌ Supabase API Error: {}", responseBody);
                throw new RuntimeException("Supabase API error: " + responseBody);
            }

            JsonNode jsonNode = objectMapper.readTree(responseBody);
            String userId = jsonNode.get("id").asText();
            log.info("✅ Supabase user created with ID: {}", userId);
            
            return userId;
        }
    }

    public List<userEntity> getAllUsers() {
        return userRepo.findAll();
    }

    public Optional<userEntity> getUserById(Long id) {
        return userRepo.findById(id);
    }

    public Optional<userEntity> getUserByEmail(String email) {
        return userRepo.findByEmail(email);
    }

    @Transactional
    public userEntity updateUser(Long id, userEntity updatedUser) {
        return userRepo.findById(id).map(user -> {
            if (updatedUser.getUsername() != null) {
                user.setUsername(updatedUser.getUsername());
            }
            if (updatedUser.getName() != null) {
                user.setName(updatedUser.getName());
            }
            if (updatedUser.getEmail() != null) {
                user.setEmail(updatedUser.getEmail());
            }
            if (updatedUser.getContact() != null) {
                user.setContact(updatedUser.getContact());
            }
            return userRepo.save(user);
        }).orElseThrow(() -> new RuntimeException("User not found with id " + id));
    }

    @Transactional
    public void deleteUser(Long id) {
        if (!userRepo.existsById(id)) {
            throw new RuntimeException("User not found with id " + id);
        }
        userRepo.deleteById(id);
    }
}