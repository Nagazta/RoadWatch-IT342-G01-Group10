package road.watch.it_342_g01.RoadWatch.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import road.watch.it_342_g01.RoadWatch.entity.citizenEntity;
import road.watch.it_342_g01.RoadWatch.service.citizenService;

@RestController
@RequestMapping("/api/citizen")
public class citizenController {
    @Autowired
    private citizenService citizenService;

    //CREATE
    @PostMapping("/add")
    public String addCitizen(@RequestBody citizenEntity citizen) {
        citizenService.createCitizen(citizen);
        return "New citizen is added";
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
