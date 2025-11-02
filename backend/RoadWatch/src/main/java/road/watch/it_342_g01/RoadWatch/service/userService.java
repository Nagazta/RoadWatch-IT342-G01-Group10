package road.watch.it_342_g01.RoadWatch.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import okhttp3.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import road.watch.it_342_g01.RoadWatch.entity.userEntity;
import road.watch.it_342_g01.RoadWatch.repository.userRepo;

import java.io.IOException;
import java.util.List;
import java.util.Optional;

@Slf4j
@Service
public class userService {

    @Autowired
    private userRepo userRepo;

    private final OkHttpClient httpClient = new OkHttpClient();
    private final ObjectMapper objectMapper = new ObjectMapper();

    @Value("${supabase.url}")
    private String supabaseUrl;

    @Value("${supabase.service-role-key}")
    private String supabaseServiceRoleKey;

    // CREATE
    public userEntity createUser(userEntity user) {
        try {
            log.info("========================================");
            log.info("🔵 Starting user creation process...");
            log.info("📧 Email: {}", user.getEmail());
            log.info("🌐 Supabase URL: {}", supabaseUrl);
            log.info("🔑 Service Key (first 20 chars): {}", 
                supabaseServiceRoleKey != null ? supabaseServiceRoleKey.substring(0, 20) + "..." : "NULL");

            // Step 1: Create user in Supabase Auth
            String supabaseUserId = createSupabaseAuthUser(user);

            // Step 2: Save to database
            user.setSupabaseId(supabaseUserId);
            userEntity savedUser = userRepo.save(user);

            log.info("✅ SUCCESS - User created!");
            log.info("   Database ID: {}", savedUser.getId());
            log.info("   Supabase ID: {}", supabaseUserId);
            log.info("========================================");

            return savedUser;

        } catch (Exception e) {
            log.error("========================================");
            log.error("❌ ERROR creating user");
            log.error("Error type: {}", e.getClass().getSimpleName());
            log.error("Error message: {}", e.getMessage());
            log.error("========================================", e);
            throw new RuntimeException("Failed to create user: " + e.getMessage());
        }
    }

    // CREATE USER IN SUPABASE
    private String createSupabaseAuthUser(userEntity user) throws IOException {
        log.info("📤 Calling Supabase Admin API...");

        // Build JSON manually to avoid escaping issues
        String jsonBody = "{\n" +
            "  \"email\": \"" + user.getEmail() + "\",\n" +
            "  \"password\": \"" + user.getPassword() + "\",\n" +
            "  \"email_confirm\": true,\n" +
            "  \"user_metadata\": {\n" +
            "    \"username\": \"" + (user.getUsername() != null ? user.getUsername() : "") + "\",\n" +
            "    \"name\": \"" + (user.getName() != null ? user.getName() : "") + "\",\n" +
            "    \"role\": \"" + (user.getRole() != null ? user.getRole().toString() : "CITIZEN") + "\",\n" +
            "    \"contact\": \"" + (user.getContact() != null ? user.getContact() : "") + "\"\n" +
            "  }\n" +
            "}";

        log.info("📝 Request Body:\n{}", jsonBody);

        RequestBody body = RequestBody.create(
            jsonBody,
            MediaType.parse("application/json; charset=utf-8")
        );

        String url = supabaseUrl + "/auth/v1/admin/users";
        log.info("🎯 Request URL: {}", url);

        Request request = new Request.Builder()
            .url(url)
            .addHeader("Authorization", "Bearer " + supabaseServiceRoleKey)
            .addHeader("apikey", supabaseServiceRoleKey)
            .addHeader("Content-Type", "application/json")
            .post(body)
            .build();

        log.info("📨 Sending request...");

        try (Response response = httpClient.newCall(request).execute()) {
            String responseBody = response.body().string();
            
            log.info("📥 Response Status: {}", response.code());
            log.info("📥 Response Body (first 500 chars):\n{}", 
                responseBody.length() > 500 ? responseBody.substring(0, 500) + "..." : responseBody);

            if (!response.isSuccessful()) {
                log.error("❌ Supabase API Error!");
                log.error("Status Code: {}", response.code());
                log.error("Response: {}", responseBody);
                throw new RuntimeException("Supabase API error (status " + response.code() + "): " + responseBody);
            }

            // Check if response is HTML (indicates wrong endpoint or redirect)
            if (responseBody.trim().startsWith("<!") || responseBody.trim().startsWith("<html")) {
                log.error("❌ Received HTML instead of JSON!");
                log.error("This usually means:");
                log.error("  1. Wrong Supabase URL");
                log.error("  2. Invalid service role key");
                log.error("  3. Network/firewall blocking the request");
                throw new RuntimeException("Received HTML instead of JSON from Supabase. Check your Supabase URL and service role key.");
            }

            JsonNode jsonNode = objectMapper.readTree(responseBody);
            
            if (!jsonNode.has("id")) {
                log.error("❌ Response missing 'id' field!");
                throw new RuntimeException("Invalid response from Supabase: missing user ID");
            }

            String userId = jsonNode.get("id").asText();
            log.info("✅ Supabase user created with ID: {}", userId);
            
            return userId;
        }
    }

    // READ ALL
    public List<userEntity> getAllUsers() {
        return userRepo.findAll();
    }

    // READ BY ID
    public Optional<userEntity> getUserById(Long id) {
        return userRepo.findById(id);
    }

    // UPDATE
    public userEntity updateUser(Long id, userEntity updatedUser) {
        return userRepo.findById(id).map(user -> {
            user.setUsername(updatedUser.getUsername());
            user.setName(updatedUser.getName());
            user.setEmail(updatedUser.getEmail());
            user.setContact(updatedUser.getContact());
            user.setRole(updatedUser.getRole());
            return userRepo.save(user);
        }).orElseThrow(() -> new RuntimeException("User not found with id " + id));
    }

    // DELETE
    public void deleteUser(Long id) {
        if (!userRepo.existsById(id)) {
            throw new RuntimeException("User not found with id " + id);
        }
        userRepo.deleteById(id);
    }
}