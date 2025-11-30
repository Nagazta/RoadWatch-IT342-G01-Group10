package road.watch.it_342_g01.RoadWatch.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import road.watch.it_342_g01.RoadWatch.entity.inspectorEntity;
import road.watch.it_342_g01.RoadWatch.entity.role;
import road.watch.it_342_g01.RoadWatch.entity.userEntity;
import road.watch.it_342_g01.RoadWatch.repository.inspectorRepo;
import road.watch.it_342_g01.RoadWatch.repository.userRepo;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@Slf4j
@Service
public class inspectorService {

    @Autowired
    private inspectorRepo inspectorRepo;
    
    @Autowired
    private userRepo userRepo;
    
    @Autowired
    private userService userService;

    /**
     * Create inspector from user creation request (Map format)
     * This method creates a user with INSPECTOR role and automatically creates the inspector record
     */
    public inspectorEntity createInspectorUser(Map<String, Object> requestBody) {
        log.info(" Creating inspector user from request body");
        
        // Extract user fields
        String email = (String) requestBody.get("email");
        String username = (String) requestBody.get("username");
        String name = (String) requestBody.get("name");
        String password = (String) requestBody.get("password");
        String contact = (String) requestBody.get("contact");
        String assignedArea = (String) requestBody.get("assignedArea");
        
        // Create user entity
        userEntity user = new userEntity();
        user.setEmail(email);
        user.setUsername(username);
        user.setName(name);
        user.setPassword(password);
        user.setContact(contact);
        user.setRole(role.INSPECTOR);
        
        // Create user (this automatically creates inspector record via userService)
        userEntity savedUser = userService.createUser(user, null, assignedArea);
        
        // Fetch and return the created inspector record
        Optional<inspectorEntity> inspector = inspectorRepo.findByUser_Id(savedUser.getId());
        return inspector.orElseThrow(() -> new RuntimeException("Failed to create inspector record"));
    }

    public inspectorEntity createInspector(inspectorEntity inspector) {
        Long userId = inspector.getUser().getId();  
        userEntity user = userRepo.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with ID: " + userId));
        inspector.setUser(user); // link
        return inspectorRepo.save(inspector);
    }
    public List<inspectorEntity> getAllInspectors() {
        return inspectorRepo.findAll();
    }

    public Optional<inspectorEntity> getInspectorById(Long id) {
        return inspectorRepo.findById(id);
    }

    public Optional<inspectorEntity> getInspectorByUserId(Long userId) {
        return inspectorRepo.findByUser_Id(userId);
    }
}