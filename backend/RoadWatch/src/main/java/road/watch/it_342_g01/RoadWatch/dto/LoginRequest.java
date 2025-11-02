package road.watch.it_342_g01.RoadWatch.dto;

import lombok.Data;

@Data
public class LoginRequest {
    private String email;
    private String password;
}