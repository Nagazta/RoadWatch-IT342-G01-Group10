package road.watch.it_342_g01.RoadWatch.migration;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import road.watch.it_342_g01.RoadWatch.service.SupabaseMigrationService;

@Component
@RequiredArgsConstructor
public class MigrationRunner implements CommandLineRunner {

    private final SupabaseMigrationService migrationService;

    @Value("${app.run-migrations:false}")
    private boolean runMigrations;

    @Override
    public void run(String... args) {
        if (!runMigrations) {
            System.out.println("⏩ User migration disabled. Skipping...");
            return;
        }

        System.out.println("🚀 Running user migration...");
        migrationService.migrateUsers();
    }
}
