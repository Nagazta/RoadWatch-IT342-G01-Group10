package road.watch.it_342_g01.RoadWatch.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.lang.NonNull; // ✅ Add this import
import org.springframework.web.bind.annotation.*;
import road.watch.it_342_g01.RoadWatch.entity.adminEntity;
import road.watch.it_342_g01.RoadWatch.service.adminService;

import java.util.List;
import java.util.Objects; // ✅ Add this import

@RestController
@RequestMapping("/api/admin")
@CrossOrigin
public class adminController {

    @Autowired
    private adminService adminService;

    // CREATE
    @PostMapping("/add")
    public String addAdmin(@RequestBody @NonNull adminEntity admin) { // ✅ Add @NonNull
        adminService.createAdmin(Objects.requireNonNull(admin)); // ✅ Wrap with requireNonNull
        return "New admin is added";
    }

    // READ ALL
    @GetMapping("/getAll")
    public ResponseEntity<List<adminEntity>> getAllAdmins() {
        return ResponseEntity.ok(adminService.getAllAdmins());
    }

    // READ ONE
    @GetMapping("/getBy/{id}")
    public ResponseEntity<adminEntity> getAdminById(@PathVariable @NonNull Long id) { // ✅ Add @NonNull
        return adminService.getAdminById(Objects.requireNonNull(id)) // ✅ Wrap with requireNonNull
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // UPDATE
    @PutMapping("/updateBy/{id}")
    public ResponseEntity<adminEntity> updateAdmin(
            @PathVariable @NonNull Long id, // ✅ Add @NonNull
            @RequestBody @NonNull adminEntity admin) { // ✅ Add @NonNull
        // ✅ Wrap both with requireNonNull
        adminEntity updated = adminService.updateAdmin(
                Objects.requireNonNull(id),
                Objects.requireNonNull(admin));
        return ResponseEntity.ok(updated);
    }

    // DELETE
    @DeleteMapping("/deleteBy/{id}")
    public ResponseEntity<Void> deleteAdmin(@PathVariable @NonNull Long id) { // ✅ Add @NonNull
        adminService.deleteAdmin(Objects.requireNonNull(id)); // ✅ Wrap with requireNonNull
        return ResponseEntity.noContent().build();
    }
}