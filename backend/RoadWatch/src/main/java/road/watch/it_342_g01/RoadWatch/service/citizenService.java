package road.watch.it_342_g01.RoadWatch.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import road.watch.it_342_g01.RoadWatch.entity.citizenEntity;
import road.watch.it_342_g01.RoadWatch.entity.userEntity;
import road.watch.it_342_g01.RoadWatch.repository.citizenRepo;
import road.watch.it_342_g01.RoadWatch.repository.userRepo;

import java.util.List;
import java.util.Optional;

@Slf4j
@Service
public class citizenService {

    @Autowired
    private citizenRepo citizenRepo;
    
    @Autowired
    private userRepo userRepo;

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