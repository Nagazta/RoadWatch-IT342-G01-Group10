package road.watch.it_342_g01.RoadWatch.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import road.watch.it_342_g01.RoadWatch.entity.adminEntity;
import road.watch.it_342_g01.RoadWatch.entity.userEntity;
import road.watch.it_342_g01.RoadWatch.repository.adminRepo;
import road.watch.it_342_g01.RoadWatch.repository.userRepo;

import java.util.List;
import java.util.Optional;

@Slf4j
@Service
public class adminService {

    @Autowired
    private adminRepo adminRepo;
    
    @Autowired
    private userRepo userRepo;

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