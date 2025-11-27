package road.watch.it_342_g01.RoadWatch.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class InspectorCreateDTO {
    private String areaAssignment;
    private String status;
    private Long userId;  
}
