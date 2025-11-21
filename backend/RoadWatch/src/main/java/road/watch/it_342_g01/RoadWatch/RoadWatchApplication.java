package road.watch.it_342_g01.RoadWatch;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.ConfigurationPropertiesScan;
import org.springframework.transaction.annotation.EnableTransactionManagement;

@SpringBootApplication
@ConfigurationPropertiesScan
@EnableTransactionManagement
public class RoadWatchApplication {

	public static void main(String[] args) {
		SpringApplication.run(RoadWatchApplication.class, args);
	}

}
