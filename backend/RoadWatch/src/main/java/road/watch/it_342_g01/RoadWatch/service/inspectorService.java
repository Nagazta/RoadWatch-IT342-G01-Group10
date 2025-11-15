package road.watch.it_342_g01.RoadWatch.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import road.watch.it_342_g01.RoadWatch.entity.inspectorEntity;
import road.watch.it_342_g01.RoadWatch.entity.userEntity;
import road.watch.it_342_g01.RoadWatch.repository.inspectorRepo;
import road.watch.it_342_g01.RoadWatch.repository.userRepo;

import java.util.List;
import java.util.Optional;

@Slf4j
@Service
public class inspectorService {

    @Autowired
    private inspectorRepo inspectorRepo;
    
    @Autowired
    private userRepo userRepo;

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