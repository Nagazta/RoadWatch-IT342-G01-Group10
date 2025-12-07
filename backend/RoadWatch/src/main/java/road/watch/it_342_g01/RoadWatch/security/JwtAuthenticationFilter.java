package road.watch.it_342_g01.RoadWatch.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;

@Slf4j
@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtUtil jwtUtil;

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) throws ServletException {
        String path = request.getRequestURI();

        // ✅ Skip JWT filter for these endpoints
        return path.startsWith("/auth/") ||
                path.startsWith("/error") ||
                path.startsWith("/api/users/add") ||
                path.startsWith("/api/admin/add") ||
                path.startsWith("/api/citizen/add") ||
                path.startsWith("/api/inspector/add") ||
                path.matches(".*/api/reports/\\d+/images.*") || // ✅ Image upload endpoint
                path.startsWith("/api/reports/images/"); // ✅ Image operations
    }

    @Override
    protected void doFilterInternal(
            @NonNull HttpServletRequest request,
            @NonNull HttpServletResponse response,
            @NonNull FilterChain filterChain) throws ServletException, IOException {

        // CRITICAL: Allow OPTIONS requests to pass through without JWT validation
        if ("OPTIONS".equalsIgnoreCase(request.getMethod())) {
            filterChain.doFilter(request, response);
            return;
        }

        try {
            String authHeader = request.getHeader("Authorization");

            // If no Authorization header, continue without authentication
            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                filterChain.doFilter(request, response);
                return;
            }

            // Extract and validate JWT token
            String jwt = authHeader.substring(7);

            if (jwtUtil.validateToken(jwt)) {
                String email = jwtUtil.extractEmail(jwt);
                String role = jwtUtil.extractRole(jwt);
                Long userId = jwtUtil.extractUserId(jwt);

                // Create authentication object
                UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
                        email,
                        null,
                        List.of(new SimpleGrantedAuthority("ROLE_" + role)));

                authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

                // Set authentication in security context
                SecurityContextHolder.getContext().setAuthentication(authentication);

                log.debug("✅ JWT authenticated: {} (role: {})", email, role);
            } else {
                log.warn("⚠️ Invalid JWT token");
            }

        } catch (Exception e) {
            log.error("❌ JWT authentication error: {}", e.getMessage());
            // Don't throw exception - just log and continue without auth
        }

        filterChain.doFilter(request, response);
    }
}