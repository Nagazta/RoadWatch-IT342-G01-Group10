package road.watch.it_342_g01.RoadWatch.config;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Data
@Configuration
@ConfigurationProperties(prefix = "supabase")
public class SupabaseProperties {
    private String url;
    private String anonKey;
    private String serviceRoleKey;
    private Storage storage = new Storage();

    @Data
    public static class Storage {
        private String bucketName;
        private long maxFileSize;
        private String allowedContentTypes;
        private int maxFilesPerReport;
    }
}