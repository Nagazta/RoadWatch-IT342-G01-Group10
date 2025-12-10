package road.watch.it_342_g01.RoadWatch.config;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import road.watch.it_342_g01.RoadWatch.security.JwtAuthenticationFilter;

import java.util.Arrays;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable())
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth
                        // Public endpoints - MOST SPECIFIC FIRST!
                        .requestMatchers(
                                "/error",
                                "/uploads/**",
                                "/auth/**",
                                "/auth/login",
                                "/auth/local-login",
                                "/api/test/**",
                                "/api/users/add",
                                "/api/users/test",
                                "/api/users/getAll", // ✅ Public - read all users
                                "/api/users/db-test",
                                "/api/admin/add",
                                "/api/citizen/add",
                                "/api/inspector/add",
                                "/api/reports/**", // ✅ All report endpoints including image uploads
                                "/api/reports/*/images", // ✅ Explicit image upload endpoint
                                "/api/reports/images/*", // ✅ Explicit image operations
                                "/api/feedback/submit", // ✅ Public feedback submission
                                "/actuator/**")
                        .permitAll()

                        // ✅ Admin-only endpoints - MUST come AFTER public endpoints
                        .requestMatchers("/api/users/updateBy/**").hasRole("ADMIN") // Update user
                        .requestMatchers("/api/users/deleteBy/**").hasRole("ADMIN") // Delete user
                        .requestMatchers("/api/feedback/all").hasRole("ADMIN") // Get all feedback
                        .requestMatchers("/api/feedback/stats").hasRole("ADMIN") // Get feedback stats
                        .requestMatchers("/api/feedback/*/status").hasRole("ADMIN") // Update feedback status

                        // ✅ AUDIT LOGS - Admin only (ADD THIS!)
                        .requestMatchers("/api/audit/**").hasRole("ADMIN")

                        .requestMatchers("/api/users/profile").authenticated() // Profile (any authenticated user)

                        // Authenticated endpoints
                        .requestMatchers("/api/feedback/my-feedback").authenticated() // User's own feedback
                        .requestMatchers("/api/**").authenticated()

                        // Fallback
                        .anyRequest().authenticated())
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(Arrays.asList(
                "http://localhost:3000",
                "http://localhost:5173",
                "https://roadwatchph.com",
                "http://localhost:4200"));
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"));
        configuration.setAllowedHeaders(Arrays.asList("*"));
        configuration.setAllowCredentials(true);
        configuration.setExposedHeaders(Arrays.asList("Authorization")); // ✅ Expose auth headers

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}