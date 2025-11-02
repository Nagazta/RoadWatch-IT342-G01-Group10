package road.watch.it_342_g01.RoadWatch.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import road.watch.it_342_g01.RoadWatch.entity.userEntity;
import road.watch.it_342_g01.RoadWatch.service.userService;

import java.util.List;

@RestController
@RequestMapping("/users")
@CrossOrigin
public class userController {

    @Autowired
    private userService userService;

    // CREATE
    @PostMapping("/add")
    public String addUser(@RequestBody userEntity user){
       userService.createUser(user);
       return "New user is added";
    }

    // READ ALL
    @GetMapping("/getAll")
    public ResponseEntity<List<userEntity>> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }

    // READ ONE
    @GetMapping("/getBy/{id}")
    public ResponseEntity<userEntity> getUserById(@PathVariable Long id) {
        return userService.getUserById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // UPDATE
    @PutMapping("/updateBy/{id}")
    public ResponseEntity<userEntity> updateUser(@PathVariable Long id, @RequestBody userEntity user) {
        return ResponseEntity.ok(userService.updateUser(id, user));
    }

    // DELETE
    @DeleteMapping("/deleteBy/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
        return ResponseEntity.noContent().build();
    }
}
