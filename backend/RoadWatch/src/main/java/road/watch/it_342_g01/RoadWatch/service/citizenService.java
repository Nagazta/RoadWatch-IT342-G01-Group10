package road.watch.it_342_g01.RoadWatch.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import road.watch.it_342_g01.RoadWatch.entity.citizenEntity;
import road.watch.it_342_g01.RoadWatch.entity.userEntity;
import road.watch.it_342_g01.RoadWatch.entity.role;
import road.watch.it_342_g01.RoadWatch.repository.citizenRepo;
import road.watch.it_342_g01.RoadWatch.repository.userRepo;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@Slf4j
@Service
public class citizenService {

    @Autowired
    private citizenRepo citizenRepo;
    
    @Autowired
    private userRepo userRepo;
    
    @Autowired
    private userService userService;

    /**
     * Create citizen from user creation request (Map format)
     * This method creates a user with CITIZEN role
     */
    public citizenEntity createCitizenUser(Map<String, Object> requestBody) {
        log.info("🔵 Creating citizen user from request body");
        
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
        user.setRole(role.CITIZEN);
        
        // Create user (citizens don't need additional records)
        userEntity savedUser = userService.createUser(user, null, null);
        
        // Create and return citizen record
        citizenEntity citizen = new citizenEntity();
        citizen.setUser(savedUser);
        return citizenRepo.save(citizen);
    }

    @Transactional
    public citizenEntity createCitizen(citizenEntity citizen) {
        Long userId = citizen.getUser().getId();  
        userEntity user = userRepo.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with ID: " + userId));
        citizen.setUser(user); // link
        return citizenRepo.save(citizen);
    }

    public List<citizenEntity> getAllCitizens() {
        return citizenRepo.findAll();
    }

    public Optional<citizenEntity> getCitizenById(Long id) {
        return citizenRepo.findById(id);
    }

    public Optional<citizenEntity> getCitizenByUserId(Long userId) {
        return citizenRepo.findByUser_Id(userId);
    }
}