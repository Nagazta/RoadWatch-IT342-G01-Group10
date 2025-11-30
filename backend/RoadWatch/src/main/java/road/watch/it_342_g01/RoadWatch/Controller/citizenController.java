package road.watch.it_342_g01.RoadWatch.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import road.watch.it_342_g01.RoadWatch.entity.citizenEntity;
import road.watch.it_342_g01.RoadWatch.service.citizenService;

import java.util.Map;

@RestController
@RequestMapping("/api/citizen")
public class citizenController {
    @Autowired
    private citizenService citizenService;

    //CREATE - Accept user creation request (Map) instead of citizenEntity
    @PostMapping("/add")
    public ResponseEntity<?> addCitizen(@RequestBody Map<String, Object> requestBody) {
        try {
            citizenEntity citizen = citizenService.createCitizenUser(requestBody);
            return ResponseEntity.status(HttpStatus.CREATED).body(citizen);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                "success", false,
                "error", e.getMessage()
            ));
        }
    }

    // READ ALL
    @GetMapping("/getAll")
    public java.util.List<citizenEntity> getAllCitizens() {
        return citizenService.getAllCitizens();
    }
    // READ ONE
    @GetMapping("/getBy/{id}")
    public citizenEntity getCitizenById(@PathVariable Long id) {
        return citizenService.getCitizenById(id).orElse(null);
    }
    //UPDATE
    @PutMapping("/update/{id}")
    public citizenEntity updateCitizen(@PathVariable Long id, @RequestBody citizenEntity citizen) {
        return citizenService.createCitizen(citizen);
    }
    //DELETE
    // @DeleteMapping("/delete/{id}")
    // public String deleteCitizen(@PathVariable Long id) {
    //     citizenService.deleteCitizen(id);
    //     return "Citizen with ID " + id + " has been deleted";
    // }

    
}
