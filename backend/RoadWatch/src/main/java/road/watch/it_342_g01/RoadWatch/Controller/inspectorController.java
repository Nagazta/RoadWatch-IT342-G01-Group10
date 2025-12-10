package road.watch.it_342_g01.RoadWatch.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.lang.NonNull;
import org.springframework.web.bind.annotation.*;
import road.watch.it_342_g01.RoadWatch.entity.inspectorEntity;
import road.watch.it_342_g01.RoadWatch.service.inspectorService;
import road.watch.it_342_g01.RoadWatch.service.AuditLogService;

import java.util.Objects;

@RestController
@RequestMapping("/api/inspector")
@CrossOrigin
public class inspectorController {

    @Autowired
    private inspectorService inspectorService;

    @Autowired
    private AuditLogService auditLogService;

    @PostMapping("/add")
    public String addInspector(@RequestBody @NonNull inspectorEntity inspector) {
        Objects.requireNonNull(inspector);
        inspectorEntity created = inspectorService.createInspector(inspector);

        // ✅ Audit log: Inspector created
        auditLogService.logEntityChange(
                null,
                "User Creation",
                "New inspector added: " +
                        (created.getUser() != null ? created.getUser().getEmail() : "N/A") +
                        " - Area: " + (created.getAreaAssignment() != null ? created.getAreaAssignment() : "N/A"),
                "INSPECTOR",
                created.getId(),
                null,
                "INSPECTOR");

        return "New inspector is added";
    }

    @GetMapping("/getAll")
    public java.util.List<inspectorEntity> getAllInspectors() {
        return inspectorService.getAllInspectors();
    }

    @GetMapping("/getBy/{id}")
    public inspectorEntity getInspectorById(@PathVariable @NonNull Long id) {
        Objects.requireNonNull(id);
        return inspectorService.getInspectorById(id).orElse(null);
    }

    @PutMapping("/update/{id}")
    public inspectorEntity updateInspector(
            @PathVariable @NonNull Long id,
            @RequestBody @NonNull inspectorEntity inspector) {
        Objects.requireNonNull(id);
        Objects.requireNonNull(inspector);

        inspectorEntity updated = inspectorService.createInspector(inspector);

        // ✅ Audit log: Inspector updated
        auditLogService.logEntityChange(
                null,
                "User Modification",
                "Inspector profile updated: #" + id +
                        " - Area: " + (updated.getAreaAssignment() != null ? updated.getAreaAssignment() : "N/A"),
                "INSPECTOR",
                id,
                null,
                null);

        return updated;
    }

    @DeleteMapping("/delete/{id}")
    public String deleteInspector(@PathVariable @NonNull Long id) {
        Objects.requireNonNull(id);

        // Get inspector info before deletion
        inspectorEntity inspector = inspectorService.getInspectorById(id).orElse(null);
        String email = inspector != null && inspector.getUser() != null
                ? inspector.getUser().getEmail()
                : "Unknown";

        // ✅ Audit log: Inspector deleted
        auditLogService.logEntityChange(
                null,
                "User Deletion",
                "Inspector deleted: #" + id + " (" + email + ")",
                "INSPECTOR",
                id,
                null,
                null);

        return "Inspector with ID " + id + " has been deleted";
    }
}