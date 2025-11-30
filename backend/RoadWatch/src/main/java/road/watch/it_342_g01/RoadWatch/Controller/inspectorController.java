package road.watch.it_342_g01.RoadWatch.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import road.watch.it_342_g01.RoadWatch.entity.inspectorEntity;
import road.watch.it_342_g01.RoadWatch.service.inspectorService;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.Map;




@RestController
@RequestMapping("/api/inspector")
@CrossOrigin
public class inspectorController {

    @Autowired
    private inspectorService inspectorService;

    //CREATE - Accept user creation request (Map) instead of inspectorEntity
    @PostMapping("/add")
    public ResponseEntity<?> addInspector(@RequestBody Map<String, Object> requestBody) {
        try {
            inspectorEntity inspector = inspectorService.createInspectorUser(requestBody);
            return ResponseEntity.status(HttpStatus.CREATED).body(inspector);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                "success", false,
                "error", e.getMessage()
            ));
        }
    }

    //READ ALL
    @GetMapping("/getAll")
    public java.util.List<inspectorEntity> getAllInspectors() {
        return inspectorService.getAllInspectors();
    }
    //READ ONE
    @GetMapping("/getBy/{id}")
    public inspectorEntity getInspectorById(@RequestParam Long id) {
        return inspectorService.getInspectorById(id).orElse(null);
    }

    //UPDATE
    @PutMapping("/update/{id}")
    public inspectorEntity updateInspector(@PathVariable Long id, @RequestBody inspectorEntity inspector) {
        return inspectorService.createInspector(inspector);
    }

    //DELETE
    @DeleteMapping("/delete/{id}")
    public String deleteInspector(@PathVariable Long id) {
        return "Inspector with ID " + id + " has been deleted";
    }

    
    
}
