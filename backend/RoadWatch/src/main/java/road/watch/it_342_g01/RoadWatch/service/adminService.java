package road.watch.it_342_g01.RoadWatch.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import road.watch.it_342_g01.RoadWatch.entity.adminEntity;
import road.watch.it_342_g01.RoadWatch.entity.userEntity;
import road.watch.it_342_g01.RoadWatch.entity.role;
import road.watch.it_342_g01.RoadWatch.repository.adminRepo;
import road.watch.it_342_g01.RoadWatch.repository.userRepo;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@Slf4j
@Service
public class adminService {

    @Autowired
    private adminRepo adminRepo;
    
    @Autowired
    private userRepo userRepo;
    
    @Autowired
    private userService userService;

    /**
     * Create admin from user creation request (Map format)
     * This method creates a user with ADMIN role and automatically creates the admin record
     */
    public adminEntity createAdminUser(Map<String, Object> requestBody) {
        log.info("🔵 Creating admin user from request body");
        
        // Extract user fields
        String email = (String) requestBody.get("email");
        String username = (String) requestBody.get("username");
        String name = (String) requestBody.get("name");
        String password = (String) requestBody.get("password");
        String contact = (String) requestBody.get("contact");
        
        // Create user entity
        userEntity user = new userEntity();
        user.setEmail(email);
        user.setUsername(username);
        user.setName(name);
        user.setPassword(password);
        user.setContact(contact);
        user.setRole(role.ADMIN);
        
        // Create user (this automatically creates admin record via userService)
        userEntity savedUser = userService.createUser(user, null, null);
        
        // Fetch and return the created admin record
        Optional<adminEntity> admin = adminRepo.findByUser_Id(savedUser.getId());
        return admin.orElseThrow(() -> new RuntimeException("Failed to create admin record"));
    }

    public adminEntity createAdmin(adminEntity admin) {

        Long userId = admin.getUser().getId();  // extract ID from JSON

        userEntity user = userRepo.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with ID: " + userId));

        admin.setUser(user); // link

        return adminRepo.save(admin);
    }

    public List<adminEntity> getAllAdmins() {
        return adminRepo.findAll();
    }

    public Optional<adminEntity> getAdminById(Long id) {
        return adminRepo.findById(id);
    }

    public Optional<adminEntity> getAdminByUserId(Long userId) {
        return adminRepo.findByUser_Id(userId);
    }

    @Transactional
    public adminEntity updateAdmin(Long id, adminEntity updatedAdmin) {
        return adminRepo.findById(id).map(admin -> {
            // Update user fields
            if (updatedAdmin.getUser() != null) {
                userEntity user = admin.getUser();
                if (updatedAdmin.getUser().getName() != null) {
                    user.setName(updatedAdmin.getUser().getName());
                }
                if (updatedAdmin.getUser().getUsername() != null) {
                    user.setUsername(updatedAdmin.getUser().getUsername());
                }
                if (updatedAdmin.getUser().getEmail() != null) {
                    user.setEmail(updatedAdmin.getUser().getEmail());
                }
                if (updatedAdmin.getUser().getContact() != null) {
                    user.setContact(updatedAdmin.getUser().getContact());
                }
                if (updatedAdmin.getUser().getIsActive() != null) {
                    user.setIsActive(updatedAdmin.getUser().getIsActive());
                }
                userRepo.save(user);
            }
            
            // Update admin-specific fields
            if (updatedAdmin.getDepartment() != null) {
                admin.setDepartment(updatedAdmin.getDepartment());
            }
            
            return adminRepo.save(admin);
        }).orElseThrow(() -> new RuntimeException("Admin not found with id " + id));
    }

    @Transactional
    public void deleteAdmin(Long id) {
        adminRepo.findById(id).ifPresent(admin -> {
            // Delete admin record
            adminRepo.delete(admin);
            // Optionally delete user record too
            userRepo.delete(admin.getUser());
        });
    }
}