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

    @Autowired
    private citizenRepo citizenRepo; // 🆕 Add citizen repo

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
        return createUser(user, null, null, null);
    }

    @Transactional
    public userEntity createUser(userEntity user, Long createdByAdminId) {
        return createUser(user, createdByAdminId, null, null);
    }

    @Transactional
    public userEntity createUser(userEntity user, Long createdByAdminId, String assignedArea) {
        return createUser(user, createdByAdminId, assignedArea, null);
    }

    /**
     * 🆕 Updated createUser with googleId parameter for OAuth citizens
     */
    @Transactional
    public userEntity createUser(userEntity user, Long createdByAdminId, String assignedArea, String googleId) {
        try {
            log.info("🔵 Starting user creation process...");
            log.info("🔵 User role: {}", user.getRole());
            log.info("🔵 Created by admin ID: {}", createdByAdminId);
            log.info("🔵 Google ID: {}", googleId);

            // Validate fields
            validateUser(user);

            // Hash the password before saving (only if password exists)
            if (user.getPassword() != null && !user.getPassword().isEmpty()) {
                user.setPassword(passwordEncoder.encode(user.getPassword()));
            }

            // Set default role
            if (user.getRole() == null) {
                user.setRole(role.CITIZEN);
            }

            // Save user FIRST
            log.info("🔵 Saving user to database...");
            userEntity savedUser = userRepo.save(user);
            userRepo.flush();

            log.info("✅ User created successfully!");
            log.info("   - User ID: {}", savedUser.getId());
            log.info("   - User role: {}", savedUser.getRole());

            // ✅ CREATE ROLE-SPECIFIC RECORDS
            if (role.INSPECTOR.equals(savedUser.getRole())) {
                createInspectorRecord(savedUser, createdByAdminId, assignedArea);
            } else if (role.ADMIN.equals(savedUser.getRole())) {
                createAdminRecord(savedUser);
            } else if (role.CITIZEN.equals(savedUser.getRole())) {
                createCitizenRecord(savedUser, googleId); // 🆕 Create citizen record
            }

            return savedUser;
        } catch (Exception e) {
            log.error("❌ Failed to create user: {}", e.getMessage(), e);
            throw new RuntimeException("Failed to create user: " + e.getMessage(), e);
        }
    }

    /**
     * 🆕 Create Inspector Record
     */
    private void createInspectorRecord(userEntity user, Long createdByAdminId, String assignedArea) {
        log.info("🔵 User is INSPECTOR - creating inspector record...");
        try {
            Optional<inspectorEntity> existingInspector = inspectorRepo.findByUser_Id(user.getId());
            if (existingInspector.isPresent()) {
                log.warn("⚠️ Inspector record already exists for user ID: {}", user.getId());
                return;
            }

            inspectorEntity inspector = new inspectorEntity();
            inspector.setUser(user);
            inspector.setAreaAssignment(assignedArea);
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
            log.error("❌ User ID: {}", user.getId());
            log.error("❌ Error: {}", e.getMessage(), e);
            throw new RuntimeException("Failed to create inspector record: " + e.getMessage(), e);
        }
    }

    /**
     * 🆕 Create Admin Record
     */
    private void createAdminRecord(userEntity user) {
        log.info("🔵 User is ADMIN - creating admin record...");
        try {
            Optional<adminEntity> existingAdmin = adminRepo.findByUser_Id(user.getId());
            if (existingAdmin.isPresent()) {
                log.warn("⚠️ Admin record already exists for user ID: {}", user.getId());
                return;
            }

            adminEntity admin = new adminEntity();
            admin.setUser(user);
            admin.setDepartment(null);

            log.info("🔵 Admin object created, saving to database...");
            adminEntity savedAdmin = adminRepo.save(admin);
            adminRepo.flush();

            log.info("✅✅ ADMIN RECORD CREATED SUCCESSFULLY!");
            log.info("   - Admin ID: {}", savedAdmin.getAdminId());
            log.info("   - Linked User ID: {}", savedAdmin.getUser().getId());

        } catch (Exception e) {
            log.error("❌❌ FAILED TO CREATE ADMIN RECORD!");
            log.error("❌ Error: {}", e.getMessage(), e);
            throw new RuntimeException("Failed to create admin record: " + e.getMessage(), e);
        }
    }

    /**
     * 🆕 Create Citizen Record
     */
    private void createCitizenRecord(userEntity user, String googleId) {
        log.info("🔵 User is CITIZEN - creating citizen record...");
        try {
            Optional<citizenEntity> existingCitizen = citizenRepo.findByUser_Id(user.getId());
            if (existingCitizen.isPresent()) {
                log.warn("⚠️ Citizen record already exists for user ID: {}", user.getId());
                return;
            }

            citizenEntity citizen = new citizenEntity();
            citizen.setUser(user);
            citizen.setGoogleId(googleId); // Set Google ID if OAuth login
            citizen.setTotalReports(0);

            log.info("🔵 Citizen object created, saving to database...");
            citizenEntity savedCitizen = citizenRepo.save(citizen);
            citizenRepo.flush();

            log.info("✅✅ CITIZEN RECORD CREATED SUCCESSFULLY!");
            log.info("   - Citizen ID: {}", savedCitizen.getCitizenId());
            log.info("   - Linked User ID: {}", savedCitizen.getUser().getId());
            log.info("   - Google ID: {}", savedCitizen.getGoogleId());

        } catch (Exception e) {
            log.error("❌❌ FAILED TO CREATE CITIZEN RECORD!");
            log.error("❌ Error: {}", e.getMessage(), e);
            throw new RuntimeException("Failed to create citizen record: " + e.getMessage(), e);
        }
    }

    private void validateUser(userEntity user) {
        if (user.getEmail() == null || user.getEmail().trim().isEmpty()) {
            throw new IllegalArgumentException("Email is required");
        }

        // Password validation - only required for non-OAuth users
        if (user.getSupabaseId() == null) {
            if (user.getPassword() == null || user.getPassword().trim().isEmpty()) {
                throw new IllegalArgumentException("Password is required");
            }
            if (user.getPassword().length() < 6) {
                throw new IllegalArgumentException("Password must be at least 6 characters");
            }
        }

        if (user.getRole() == null) {
            user.setRole(role.CITIZEN);
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
        log.info("🔧 userService.updateUser called for ID: {}", id);
        log.info("📋 Updated user isActive value: {}", updatedUser.getIsActive());

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

            // ✅ ADD THIS: Handle isActive field
            if (updatedUser.getIsActive() != null) {
                log.info("✅ Updating isActive from {} to {}",
                        user.getIsActive(), updatedUser.getIsActive());
                user.setIsActive(updatedUser.getIsActive());
            }

            // ✅ ADD THIS: Handle password updates (only if provided)
            if (updatedUser.getPassword() != null && !updatedUser.getPassword().isEmpty()) {
                log.info("🔒 Updating password for user: {}", user.getEmail());
                user.setPassword(passwordEncoder.encode(updatedUser.getPassword()));
            }

            log.info("💾 Saving user with isActive: {}", user.getIsActive());
            userEntity savedUser = userRepo.save(user);

            // ✅ Handle role changes
            role newRole = savedUser.getRole();
            if (oldRole != newRole) {
                handleRoleChange(id, savedUser, oldRole, newRole);
            }

            log.info("✅ User updated successfully. Final isActive: {}", savedUser.getIsActive());
            return savedUser;
        }).orElseThrow(() -> new RuntimeException("User not found with id " + id));
    }

    /**
     * 🆕 Handle role changes when updating user
     */
    private void handleRoleChange(Long userId, userEntity user, role oldRole, role newRole) {
        // Remove old role record
        if (role.INSPECTOR.equals(oldRole)) {
            inspectorRepo.findByUser_Id(userId).ifPresent(inspector -> {
                inspectorRepo.delete(inspector);
                log.info("🗑️ Deleted inspector record for user ID: {}", userId);
            });
        } else if (role.ADMIN.equals(oldRole)) {
            adminRepo.findByUser_Id(userId).ifPresent(admin -> {
                adminRepo.delete(admin);
                log.info("🗑️ Deleted admin record for user ID: {}", userId);
            });
        } else if (role.CITIZEN.equals(oldRole)) {
            citizenRepo.findByUser_Id(userId).ifPresent(citizen -> {
                citizenRepo.delete(citizen);
                log.info("🗑️ Deleted citizen record for user ID: {}", userId);
            });
        }

        // Create new role record
        if (role.INSPECTOR.equals(newRole)) {
            createInspectorRecord(user, null, null);
        } else if (role.ADMIN.equals(newRole)) {
            createAdminRecord(user);
        } else if (role.CITIZEN.equals(newRole)) {
            createCitizenRecord(user, null);
        }
    }

    @Transactional
    public void deleteUser(Long id) {
        if (!userRepo.existsById(id)) {
            throw new RuntimeException("User not found with id " + id);
        }

        userEntity user = userRepo.findById(id).orElseThrow();

        // ✅ Delete role-specific records first
        if (role.INSPECTOR.equals(user.getRole())) {
            inspectorRepo.findByUser_Id(id).ifPresent(inspector -> {
                inspectorRepo.delete(inspector);
                log.info("🗑️ Deleted inspector record for user ID: {}", id);
            });
        } else if (role.ADMIN.equals(user.getRole())) {
            adminRepo.findByUser_Id(id).ifPresent(admin -> {
                adminRepo.delete(admin);
                log.info("🗑️ Deleted admin record for user ID: {}", id);
            });
        } else if (role.CITIZEN.equals(user.getRole())) {
            citizenRepo.findByUser_Id(id).ifPresent(citizen -> {
                citizenRepo.delete(citizen);
                log.info("🗑️ Deleted citizen record for user ID: {}", id);
            });
        }

        userRepo.deleteById(id);
    }
}