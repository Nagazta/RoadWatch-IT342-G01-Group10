package road.watch.it_342_g01.RoadWatch.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.sql.DataSource;
import java.sql.Connection;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/test")
@RequiredArgsConstructor
public class TestController {

    private final DataSource dataSource;
    private final JdbcTemplate jdbcTemplate;

    @Value("${supabase.url}")
    private String supabaseUrl;

    @GetMapping("/hello")
    public Map<String, String> hello() {
        Map<String, String> response = new HashMap<>();
        response.put("message", "Hello from RoadWatch API!");
        response.put("status", "running");
        return response;
    }

    @GetMapping("/db")
    public Map<String, Object> testDatabase() {
        Map<String, Object> response = new HashMap<>();
        
        try {
            // Test connection
            try (Connection conn = dataSource.getConnection()) {
                response.put("connectionValid", conn.isValid(5));
            }
            
            // Test query
            String version = jdbcTemplate.queryForObject("SELECT version()", String.class);
            
            response.put("status", "success");
            response.put("message", "Database connected successfully!");
            response.put("postgresVersion", version);
            
        } catch (Exception e) {
            response.put("status", "error");
            response.put("message", e.getMessage());
            response.put("errorType", e.getClass().getSimpleName());
            if (e.getCause() != null) {
                response.put("cause", e.getCause().getMessage());
            }
        }
        
        return response;
    }

    @GetMapping("/env")
    public Map<String, String> testEnv() {
        Map<String, String> response = new HashMap<>();
        response.put("supabaseUrl", supabaseUrl);
        response.put("databaseUrlExists", System.getenv("DATABASE_URL") != null ? "yes" : "no");
        response.put("hasPassword", System.getenv("DATABASE_PASSWORD") != null ? "yes" : "no");
        response.put("hasSupabaseUrl", System.getenv("SUPABASE_URL") != null ? "yes" : "no");
        return response;
    }
}
