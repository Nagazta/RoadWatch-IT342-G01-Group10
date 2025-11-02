package road.watch.it_342_g01.RoadWatch.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserDTO {
    private Long id;
    private String supabaseId;
    private String username;
    private String name;
    private String email;
    private String role;
    private String contact;
}
