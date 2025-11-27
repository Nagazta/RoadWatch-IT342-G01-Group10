package road.watch.it_342_g01.RoadWatch.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import okhttp3.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
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
    private inspectorRepo inspectorRepo;
    
    @Autowired
    private adminRepo adminRepo;
   
    private final OkHttpClient httpClient = new OkHttpClient();
    private final ObjectMapper objectMapper = new ObjectMapper();
    
    @Value("${SUPABASE_URL}")
    private String supabaseUrl;
    
    @Value("${SUPABASE_SERVICE_ROLE_KEY}")
    private String supabaseServiceRoleKey;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    @Transactional
    public userEntity createUser(userEntity user) {
        return createUser(user, null, null);
    }
    
    @Transactional
    public userEntity createUser(userEntity user, Long createdByAdminId) {
        return createUser(user, createdByAdminId, null);
    }
    
    @Transactional
    public userEntity createUser(userEntity user, Long createdByAdminId, String assignedArea) {
        try {
            log.info("🔵 Starting user creation process...");
            log.info("🔵 User role: {}", user.getRole());
            log.info("🔵 Created by admin ID: {}", createdByAdminId);
            
            // Validate fields
            validateUser(user);
            
            // Hash the password before saving
            if (user.getPassword() != null) {
                user.setPassword(passwordEncoder.encode(user.getPassword()));
            }
            
            // Set default role
            if (user.getRole() == null) {
                user.setRole(role.CITIZEN);
            }
            
            // Temp Supabase ID (optional)
            user.setSupabaseId("temp-" + System.currentTimeMillis());
            
            // Save user FIRST
            log.info("🔵 Saving user to database...");
            userEntity savedUser = userRepo.save(user);
            userRepo.flush(); // Force the insert to complete
            
            log.info("✅ User created successfully!");
            log.info("   - User ID: {}", savedUser.getId());
            log.info("   - User role: {}", savedUser.getRole());
            
            // ✅ If the user's role is INSPECTOR, automatically create an inspector record
            if (role.INSPECTOR.equals(savedUser.getRole())) {
                log.info("🔵 User is INSPECTOR - creating inspector record...");
                try {
                    // Check if inspector already exists
                    Optional<inspectorEntity> existingInspector = inspectorRepo.findByUser_Id(savedUser.getId());
                    if (existingInspector.isPresent()) {
                        log.warn("⚠️ Inspector record already exists for user ID: {}", savedUser.getId());
                        return savedUser;
                    }
                    
                    inspectorEntity inspector = new inspectorEntity();
                    inspector.setUser(savedUser);
                    inspector.setAreaAssignment(assignedArea); // ✅ Set the assigned area from frontend
                    inspector.setCreatedByAdminId(createdByAdminId);
                    
                    log.info("🔵 Inspector object created, saving to database...");
                    inspectorEntity savedInspector = inspectorRepo.save(inspector);
                    inspectorRepo.flush();
                    
                    log.info("✅✅ INSPECTOR RECORD CREATED SUCCESSFULLY!");
                    log.info("   - Inspector ID: {}", savedInspector.getId());
                    log.info("   - Linked User ID: {}", savedInspector.getUser().getId());
                    log.info("   - Area Assignment: {}", savedInspector.getAreaAssignment());
                    log.info("   - Created By Admin ID: {}", savedInspector.getCreatedByAdminId());
                    
                } catch (Exception e) {
                    log.error("❌❌ FAILED TO CREATE INSPECTOR RECORD!");
                    log.error("❌ User ID: {}", savedUser.getId());
                    log.error("❌ Error type: {}", e.getClass().getName());
                    log.error("❌ Error message: {}", e.getMessage());
                    log.error("❌ Full stack trace: ", e);
                    throw new RuntimeException("Failed to create inspector record: " + e.getMessage(), e);
                }
            }
            // ✅ If the user's role is ADMIN, automatically create an admin record
            else if (role.ADMIN.equals(savedUser.getRole())) {
                log.info("🔵 User is ADMIN - creating admin record...");
                try {
                    // Check if admin already exists
                    Optional<adminEntity> existingAdmin = adminRepo.findByUser_Id(savedUser.getId());
                    if (existingAdmin.isPresent()) {
                        log.warn("⚠️ Admin record already exists for user ID: {}", savedUser.getId());
                        return savedUser;
                    }
                    
                    adminEntity admin = new adminEntity();
                    admin.setUser(savedUser);
                    admin.setDepartment(null); // Set to NULL or default value
                    
                    log.info("🔵 Admin object created, saving to database...");
                    adminEntity savedAdmin = adminRepo.save(admin);
                    adminRepo.flush();
                    
                    log.info("✅✅ ADMIN RECORD CREATED SUCCESSFULLY!");
                    log.info("   - Admin ID: {}", savedAdmin.getAdminId());
                    log.info("   - Linked User ID: {}", savedAdmin.getUser().getId());
                    log.info("   - Department: {}", savedAdmin.getDepartment());
                    
                } catch (Exception e) {
                    log.error("❌❌ FAILED TO CREATE ADMIN RECORD!");
                    log.error("❌ User ID: {}", savedUser.getId());
                    log.error("❌ Error type: {}", e.getClass().getName());
                    log.error("❌ Error message: {}", e.getMessage());
                    log.error("❌ Full stack trace: ", e);
                    throw new RuntimeException("Failed to create admin record: " + e.getMessage(), e);
                }
            } else {
                log.info("ℹ️ User is CITIZEN (role: {}), no additional record needed", savedUser.getRole());
            }
            
            return savedUser;
        } catch (Exception e) {
            log.error("❌ Failed to create user: {}", e.getMessage(), e);
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
            user.setRole(role.CITIZEN);
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
            role oldRole = user.getRole();
            
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
            if (updatedUser.getRole() != null) {
                user.setRole(updatedUser.getRole());
            }
            
            userEntity savedUser = userRepo.save(user);
            
            // ✅ Handle role changes for INSPECTOR and ADMIN
            role newRole = savedUser.getRole();
            if (oldRole != newRole) {
                // Handle INSPECTOR role changes
                if (role.INSPECTOR.equals(newRole)) {
                    Optional<inspectorEntity> existingInspector = inspectorRepo.findByUser_Id(id);
                    if (existingInspector.isEmpty()) {
                        inspectorEntity inspector = new inspectorEntity();
                        inspector.setUser(savedUser);
                        inspector.setAreaAssignment(null);
                        inspectorRepo.save(inspector);
                        log.info("✅ Created inspector record for user ID: {} after role change", id);
                    }
                } else if (role.INSPECTOR.equals(oldRole)) {
                    inspectorRepo.findByUser_Id(id).ifPresent(inspector -> {
                        inspectorRepo.delete(inspector);
                        log.info("🗑️ Deleted inspector record for user ID: {} after role change", id);
                    });
                }
                
                // Handle ADMIN role changes
                if (role.ADMIN.equals(newRole)) {
                    Optional<adminEntity> existingAdmin = adminRepo.findByUser_Id(id);
                    if (existingAdmin.isEmpty()) {
                        adminEntity admin = new adminEntity();
                        admin.setUser(savedUser);
                        admin.setDepartment(null);
                        adminRepo.save(admin);
                        log.info("✅ Created admin record for user ID: {} after role change", id);
                    }
                } else if (role.ADMIN.equals(oldRole)) {
                    adminRepo.findByUser_Id(id).ifPresent(admin -> {
                        adminRepo.delete(admin);
                        log.info("🗑️ Deleted admin record for user ID: {} after role change", id);
                    });
                }
            }
            
            return savedUser;
        }).orElseThrow(() -> new RuntimeException("User not found with id " + id));
    }
    
    @Transactional
    public void deleteUser(Long id) {
        if (!userRepo.existsById(id)) {
            throw new RuntimeException("User not found with id " + id);
        }
        
        userEntity user = userRepo.findById(id).orElseThrow();
        
        // ✅ If user is an inspector, delete inspector record first
        if (role.INSPECTOR.equals(user.getRole())) {
            inspectorRepo.findByUser_Id(id).ifPresent(inspector -> {
                inspectorRepo.delete(inspector);
                log.info("🗑️ Deleted inspector record for user ID: {}", id);
            });
        }
        
        // ✅ If user is an admin, delete admin record first
        if (role.ADMIN.equals(user.getRole())) {
            adminRepo.findByUser_Id(id).ifPresent(admin -> {
                adminRepo.delete(admin);
                log.info("🗑️ Deleted admin record for user ID: {}", id);
            });
        }
        
        userRepo.deleteById(id);
    }
}