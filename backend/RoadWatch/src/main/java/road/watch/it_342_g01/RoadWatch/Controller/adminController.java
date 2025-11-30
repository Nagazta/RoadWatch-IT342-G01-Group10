package road.watch.it_342_g01.RoadWatch.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import road.watch.it_342_g01.RoadWatch.entity.adminEntity;
import road.watch.it_342_g01.RoadWatch.service.adminService;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin
public class adminController {

    @Autowired
    private adminService adminService;

    // CREATE - Accept user creation request (Map) instead of adminEntity
    @PostMapping("/add")
    public ResponseEntity<?> addAdmin(@RequestBody Map<String, Object> requestBody) {
        try {
            adminEntity admin = adminService.createAdminUser(requestBody);
            return ResponseEntity.status(HttpStatus.CREATED).body(admin);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                "success", false,
                "error", e.getMessage()
            ));
        }
    }

    // READ ALL
    @GetMapping("/getAll")
    public ResponseEntity<List<adminEntity>> getAllAdmins() {
        return ResponseEntity.ok(adminService.getAllAdmins());
    }

    // READ ONE
    @GetMapping("/getBy/{id}")
    public ResponseEntity<adminEntity> getAdminById(@PathVariable Long id) {
        return adminService.getAdminById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // UPDATE
    @PutMapping("/updateBy/{id}")
    public ResponseEntity<adminEntity> updateAdmin(@PathVariable Long id, @RequestBody adminEntity admin) {
        return ResponseEntity.ok(adminService.updateAdmin(id, admin));
    }

    // DELETE
    @DeleteMapping("/deleteBy/{id}")
    public ResponseEntity<Void> deleteAdmin(@PathVariable Long id) {
        adminService.deleteAdmin(id);
        return ResponseEntity.noContent().build();
    }
}
