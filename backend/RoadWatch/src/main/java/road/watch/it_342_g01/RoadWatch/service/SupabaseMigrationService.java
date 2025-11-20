package road.watch.it_342_g01.RoadWatch.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import road.watch.it_342_g01.RoadWatch.entity.userEntity;
import road.watch.it_342_g01.RoadWatch.repository.userRepo;
import okhttp3.*;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.io.IOException;
import java.util.List;

@Service
@RequiredArgsConstructor
public class SupabaseMigrationService {

    private final userRepo userRepository;

    private final String supabaseUrl = "YOUR_SUPABASE_URL";
    private final String supabaseAnonKey = "YOUR_SUPABASE_ANON_KEY";

    private final OkHttpClient httpClient = new OkHttpClient();
    private final ObjectMapper objectMapper = new ObjectMapper();

    public void migrateUsers() {
        List<userEntity> users = userRepository.findAll();

        for (userEntity user : users) {
            // Skip if user already has supabaseId
            if (user.getSupabaseId() != null) continue;

            try {
                String supabaseId = createUserInSupabase(user.getEmail(), user.getPassword(), user.getUsername(), user.getName(), user.getContact());
                user.setSupabaseId(supabaseId);
                userRepository.save(user);
                System.out.println("✅ Migrated user: " + user.getEmail());
            } catch (Exception e) {
                System.err.println("❌ Failed to migrate user: " + user.getEmail() + " | " + e.getMessage());
            }
        }
    }

    public String createUserInSupabase(String email, String password, String username, String name, String contact) throws IOException {
        String jsonBody = String.format("""
                {
                    "email": "%s",
                    "password": "%s",
                    "options": {
                        "data": {
                            "username": "%s",
                            "name": "%s",
                            "contact": "%s"
                        }
                    }
                }
                """, email, password, username, name, contact);

        RequestBody body = RequestBody.create(jsonBody, MediaType.parse("application/json"));

        Request request = new Request.Builder()
                .url(supabaseUrl + "/auth/v1/admin/users")
                .addHeader("apikey", supabaseAnonKey)
                .addHeader("Authorization", "Bearer " + supabaseAnonKey)
                .addHeader("Content-Type", "application/json")
                .post(body)
                .build();

        try (Response response = httpClient.newCall(request).execute()) {
            String responseBody = response.body().string();
            if (!response.isSuccessful()) {
                throw new RuntimeException("Supabase API error: " + responseBody);
            }
            JsonNode node = objectMapper.readTree(responseBody);
            return node.get("id").asText(); // Supabase user ID
        }
    }
}
