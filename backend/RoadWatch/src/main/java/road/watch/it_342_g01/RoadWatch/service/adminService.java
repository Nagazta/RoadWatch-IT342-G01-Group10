package road.watch.it_342_g01.RoadWatch.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.lang.NonNull;
import org.springframework.lang.Nullable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import road.watch.it_342_g01.RoadWatch.entity.adminEntity;
import road.watch.it_342_g01.RoadWatch.entity.userEntity;
import road.watch.it_342_g01.RoadWatch.repository.adminRepo;
import road.watch.it_342_g01.RoadWatch.repository.userRepo;

import java.util.List;
import java.util.Optional;
import java.util.Objects;

@Slf4j
@Service
public class adminService {

    @Autowired
    private adminRepo adminRepo;

    @Autowired
    private userRepo userRepo;

    public adminEntity createAdmin(@NonNull adminEntity admin) {
        userEntity adminUser = admin.getUser();
        if (adminUser == null) {
            throw new IllegalArgumentException("User is required");
        }

        Long userId = adminUser.getId();
        if (userId == null) {
            throw new IllegalArgumentException("User ID is required");
        }

        userEntity user = userRepo.findById(Objects.requireNonNull(userId))
                .orElseThrow(() -> new RuntimeException("User not found with ID: " + userId));

        admin.setUser(user);

        return adminRepo.save(admin);
    }

    @NonNull
    public List<adminEntity> getAllAdmins() {
        return adminRepo.findAll();
    }

    @NonNull
    public Optional<adminEntity> getAdminById(@NonNull Long id) {
        return Objects.requireNonNull(adminRepo.findById(id));
    }

    @NonNull
    public Optional<adminEntity> getAdminByUserId(@NonNull Long userId) {
        return Objects.requireNonNull(adminRepo.findByUser_Id(userId));
    }

    @Transactional
    @Nullable
    public adminEntity updateAdmin(@NonNull Long id, @NonNull adminEntity updatedAdmin) {
        return adminRepo.findById(id).map(admin -> {
            userEntity existingUser = admin.getUser();
            if (existingUser == null) {
                throw new IllegalStateException("Admin has no associated user");
            }

            // Update user fields
            userEntity updatedUser = updatedAdmin.getUser();
            if (updatedUser != null) {
                // ✅ Remove @NonNull annotation, just use the variable directly
                userEntity user = Objects.requireNonNull(existingUser);

                if (updatedUser.getName() != null) {
                    user.setName(updatedUser.getName());
                }
                if (updatedUser.getUsername() != null) {
                    user.setUsername(updatedUser.getUsername());
                }
                if (updatedUser.getEmail() != null) {
                    user.setEmail(updatedUser.getEmail());
                }
                if (updatedUser.getContact() != null) {
                    user.setContact(updatedUser.getContact());
                }
                if (updatedUser.getIsActive() != null) {
                    user.setIsActive(updatedUser.getIsActive());
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
    public void deleteAdmin(@NonNull Long id) {
        adminRepo.findById(id).ifPresent(admin -> {
            userEntity user = admin.getUser();
            if (user == null) {
                log.warn("Admin {} has no associated user to delete", id);
                adminRepo.delete(admin);
                return;
            }

            // ✅ Remove @NonNull annotation, just use the variable directly
            userEntity userToDelete = Objects.requireNonNull(user);

            // Delete admin record first (foreign key constraint)
            adminRepo.delete(admin);

            // Then delete user record
            userRepo.delete(userToDelete);
        });
    }
}