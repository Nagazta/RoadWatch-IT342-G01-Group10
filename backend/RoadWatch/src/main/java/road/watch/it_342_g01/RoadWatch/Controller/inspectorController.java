package road.watch.it_342_g01.RoadWatch.controller;

import org.springframework.beans.factory.annotation.Autowired;
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




@RestController
@RequestMapping("/api/inspector")
@CrossOrigin
public class inspectorController {

    @Autowired
    private inspectorService inspectorService;

    //CREATE
    @PostMapping("/add")
    public String addInspector(@RequestBody inspectorEntity inspector) {
        inspectorService.createInspector(inspector);
        return "New inspector is added";
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
