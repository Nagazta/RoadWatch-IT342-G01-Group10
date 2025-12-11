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
                                .sessionManagement(session -> session
                                                .sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                                .authorizeHttpRequests(auth -> auth
                                                // ========================================
                                                // PUBLIC ENDPOINTS - Authentication/Login
                                                // ========================================
                                                .requestMatchers(
                                                                "/error",
                                                                "/uploads/**",
                                                                "/api/auth/**",
                                                                "/api/auth/login",
                                                                "/api/auth/register",
                                                                "/api/auth/google",
                                                                "/actuator/**")
                                                .permitAll()

                                                // ========================================
                                                // PUBLIC ENDPOINTS - User Operations
                                                // ========================================
                                                .requestMatchers(
                                                                "/api/test/**",
                                                                "/api/users/add",
                                                                "/api/users/test",
                                                                "/api/users/getAll",
                                                                "/api/users/db-test",
                                                                "/api/admin/add",
                                                                "/api/citizen/add",
                                                                "/api/inspector/add")
                                                .permitAll()

                                                // ========================================
                                                // PUBLIC ENDPOINTS - Reports and Feedback
                                                // ========================================
                                                .requestMatchers(
                                                                "/api/reports/**",
                                                                "/api/reports/*/images",
                                                                "/api/reports/images/*",
                                                                "/api/feedback/submit")
                                                .permitAll()

                                                // ========================================
                                                // ADMIN-ONLY ENDPOINTS
                                                // ========================================
                                                .requestMatchers("/api/users/deleteBy/**").hasRole("ADMIN")
                                                .requestMatchers("/api/feedback/all").hasRole("ADMIN")
                                                .requestMatchers("/api/feedback/stats").hasRole("ADMIN")
                                                .requestMatchers("/api/feedback/*/status").hasRole("ADMIN")
                                                .requestMatchers("/api/audit/**").hasRole("ADMIN")

                                                // ========================================
                                                // AUTHENTICATED ENDPOINTS (Any logged-in user)
                                                // ========================================
                                                .requestMatchers("/api/users/profile").authenticated() // ✅ Profile
                                                                                                       // access
                                                .requestMatchers("/api/users/updateBy/**").authenticated() // ✅ Allow
                                                                                                           // self-update
                                                .requestMatchers("/api/feedback/my-feedback").authenticated()
                                                .requestMatchers("/api/**").authenticated()

                                                // ========================================
                                                // FALLBACK - Require authentication
                                                // ========================================
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
                                "http://localhost:4200",
                                "https://roadwatch-it342-g01-group10-1.onrender.com"));

                configuration.setAllowedMethods(Arrays.asList(
                                "GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"));

                configuration.setAllowedHeaders(Arrays.asList("*"));
                configuration.setAllowCredentials(true);
                configuration.setExposedHeaders(Arrays.asList("Authorization"));

                UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
                source.registerCorsConfiguration("/**", configuration);
                return source;
        }

        @Bean
        public PasswordEncoder passwordEncoder() {
                return new BCryptPasswordEncoder();
        }
}