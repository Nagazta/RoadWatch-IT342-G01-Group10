package road.watch.it_342_g01.RoadWatch.config;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import road.watch.it_342_g01.RoadWatch.entity.role;
import road.watch.it_342_g01.RoadWatch.entity.userEntity;
import road.watch.it_342_g01.RoadWatch.repository.userRepo;

@Slf4j
@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final userRepo userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        log.info("🔵 Starting database initialization...");
        
        // Check if admin user already exists
        if (userRepository.findByEmail("Super@admin.com").isEmpty()) {
            log.info("📝 Creating test admin user: Super@admin.com");
            
            userEntity adminUser = new userEntity();
            adminUser.setEmail("Super@admin.com");
            adminUser.setPassword(passwordEncoder.encode("!23456789"));
            adminUser.setUsername("superadmin");
            adminUser.setName("Super Admin");
            adminUser.setRole(role.ADMIN);
            adminUser.setContact("+1234567890");
            adminUser.setSupabaseId("temp-admin-" + System.currentTimeMillis());
            adminUser.setIsActive(true);
            
            userRepository.save(adminUser);
            log.info("✅ Test admin user created successfully!");
            log.info("   - Email: Super@admin.com");
            log.info("   - Password: !23456789");
            log.info("   - Role: ADMIN");
        } else {
            log.info("ℹ️ Admin user Super@admin.com already exists, skipping creation");
        }
        
        // Create test citizen user
        if (userRepository.findByEmail("citizen@test.com").isEmpty()) {
            log.info("📝 Creating test citizen user: citizen@test.com");
            
            userEntity citizenUser = new userEntity();
            citizenUser.setEmail("citizen@test.com");
            citizenUser.setPassword(passwordEncoder.encode("password123"));
            citizenUser.setUsername("testcitizen");
            citizenUser.setName("Test Citizen");
            citizenUser.setRole(role.CITIZEN);
            citizenUser.setContact("+9876543210");
            citizenUser.setSupabaseId("temp-citizen-" + System.currentTimeMillis());
            citizenUser.setIsActive(true);
            
            userRepository.save(citizenUser);
            log.info("✅ Test citizen user created successfully!");
            log.info("   - Email: citizen@test.com");
            log.info("   - Password: password123");
            log.info("   - Role: CITIZEN");
        } else {
            log.info("ℹ️ Citizen user citizen@test.com already exists, skipping creation");
        }
        
        log.info("✅ Database initialization completed!");
    }
}
