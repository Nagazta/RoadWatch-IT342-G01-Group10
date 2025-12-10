package road.watch.it_342_g01.RoadWatch.controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.lang.NonNull;
import org.springframework.web.bind.annotation.*;
import road.watch.it_342_g01.RoadWatch.entity.FeedbackEntity;
import road.watch.it_342_g01.RoadWatch.service.FeedbackService;
import road.watch.it_342_g01.RoadWatch.security.JwtUtil;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;

@Slf4j
@RestController
@RequestMapping("/api/feedback")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class FeedbackController {

    private final FeedbackService feedbackService;
    private final JwtUtil jwtUtil;

    /**
     * Get all feedback (Admin only)
     * GET /api/feedback/all
     */
    @GetMapping("/all")
    public ResponseEntity<List<FeedbackEntity>> getAllFeedback(
            @RequestHeader("Authorization") String authHeader) {
        try {
            // Validate admin token
            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                return ResponseEntity.status(401).build();
            }

            String token = authHeader.substring(7);
            if (!jwtUtil.validateToken(token)) {
                return ResponseEntity.status(401).build();
            }

            List<FeedbackEntity> feedback = feedbackService.getAllFeedback();
            return ResponseEntity.ok(feedback);
        } catch (Exception e) {
            log.error("❌ Failed to fetch all feedback", e);
            return ResponseEntity.status(500).build();
        }
    }

    /**
     * Get feedback by ID
     * GET /api/feedback/{id}
     */
    @GetMapping("/{id}")
    public ResponseEntity<?> getFeedbackById(
            @PathVariable @NonNull Long id,
            @RequestHeader("Authorization") String authHeader) {
        try {
            Objects.requireNonNull(id);

            // Validate token
            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                return ResponseEntity.status(401).build();
            }

            String token = authHeader.substring(7);
            if (!jwtUtil.validateToken(token)) {
                return ResponseEntity.status(401).build();
            }

            return feedbackService.getFeedbackById(id)
                    .map(ResponseEntity::ok)
                    .orElse(ResponseEntity.notFound().build());
        } catch (Exception e) {
            log.error("❌ Failed to fetch feedback {}", id, e);
            return ResponseEntity.status(500).build();
        }
    }

    /**
     * Get feedback by user (Citizens can see their own feedback)
     * GET /api/feedback/my-feedback
     */
    @GetMapping("/my-feedback")
    public ResponseEntity<?> getMyFeedback(@RequestHeader("Authorization") String authHeader) {
        try {
            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                return ResponseEntity.status(401).body("Missing Authorization header");
            }

            String token = authHeader.substring(7);
            if (!jwtUtil.validateToken(token)) {
                return ResponseEntity.status(401).body("Invalid token");
            }

            Long userId = jwtUtil.extractUserId(token); // ✅ Get user ID from token
            List<FeedbackEntity> feedback = feedbackService.getFeedbackByUser(userId);

            return ResponseEntity.ok(feedback);
        } catch (Exception e) {
            log.error("❌ Failed to fetch user feedback", e);
            return ResponseEntity.status(500).body("Failed to fetch feedback");
        }
    }

    /**
     * Submit new feedback (Authenticated users only)
     * POST /api/feedback/submit
     */
    @PostMapping("/submit")
    public ResponseEntity<?> submitFeedback(
            @RequestBody @NonNull FeedbackEntity feedback,
            @RequestHeader("Authorization") String authHeader) { // ✅ Now required
        try {
            Objects.requireNonNull(feedback);

            // ✅ Get user ID from token
            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                return ResponseEntity.status(401).body(
                        Map.of("success", false, "error", "Authentication required"));
            }

            String token = authHeader.substring(7);
            if (!jwtUtil.validateToken(token)) {
                return ResponseEntity.status(401).body(
                        Map.of("success", false, "error", "Invalid token"));
            }

            Long userId = jwtUtil.extractUserId(token);

            // Validate required fields
            if (feedback.getSubject() == null || feedback.getSubject().trim().isEmpty()) {
                return ResponseEntity.badRequest().body(
                        Map.of("success", false, "error", "Subject is required"));
            }

            if (feedback.getMessage() == null || feedback.getMessage().trim().isEmpty()) {
                return ResponseEntity.badRequest().body(
                        Map.of("success", false, "error", "Message is required"));
            }

            // ✅ Create feedback with user ID
            FeedbackEntity created = feedbackService.createFeedback(feedback, userId);

            log.info("✅ Feedback submitted successfully by user {}: {}", userId, created.getId());

            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "message", "Feedback submitted successfully",
                    "data", created));
        } catch (Exception e) {
            log.error("❌ Failed to submit feedback", e);
            return ResponseEntity.status(500).body(
                    Map.of("success", false, "error", e.getMessage()));
        }
    }

    /**
     * Update feedback status (Admin only)
     * PUT /api/feedback/{id}/status
     */
    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateFeedbackStatus(
            @PathVariable @NonNull Long id,
            @RequestBody @NonNull Map<String, Object> updates,
            @RequestHeader("Authorization") String authHeader) {
        try {
            Objects.requireNonNull(id);
            Objects.requireNonNull(updates);

            // Validate admin token
            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                return ResponseEntity.status(401).build();
            }

            String token = authHeader.substring(7);
            if (!jwtUtil.validateToken(token)) {
                return ResponseEntity.status(401).build();
            }

            String status = (String) updates.get("status");
            String adminResponse = (String) updates.get("adminResponse");
            Long respondedBy = updates.containsKey("respondedBy")
                    ? Long.parseLong(updates.get("respondedBy").toString())
                    : null;

            if (status == null) {
                return ResponseEntity.badRequest().body(
                        Map.of("success", false, "error", "Status is required"));
            }

            FeedbackEntity updated = feedbackService.updateFeedbackStatus(
                    id, status, adminResponse, respondedBy);

            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "message", "Feedback updated successfully",
                    "data", updated));
        } catch (Exception e) {
            log.error("❌ Failed to update feedback status", e);
            return ResponseEntity.status(500).body(
                    Map.of("success", false, "error", e.getMessage()));
        }
    }

    /**
     * Delete feedback (Admin only)
     * DELETE /api/feedback/{id}
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteFeedback(
            @PathVariable @NonNull Long id,
            @RequestHeader("Authorization") String authHeader) {
        try {
            Objects.requireNonNull(id);

            // Validate admin token
            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                return ResponseEntity.status(401).build();
            }

            String token = authHeader.substring(7);
            if (!jwtUtil.validateToken(token)) {
                return ResponseEntity.status(401).build();
            }

            feedbackService.deleteFeedback(id);

            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "message", "Feedback deleted successfully"));
        } catch (Exception e) {
            log.error("❌ Failed to delete feedback", e);
            return ResponseEntity.status(500).body(
                    Map.of("success", false, "error", e.getMessage()));
        }
    }

    /**
     * Get feedback statistics (Admin only)
     * GET /api/feedback/stats
     */
    @GetMapping("/stats")
    public ResponseEntity<?> getFeedbackStats(@RequestHeader("Authorization") String authHeader) {
        try {
            // Validate admin token
            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                return ResponseEntity.status(401).build();
            }

            String token = authHeader.substring(7);
            if (!jwtUtil.validateToken(token)) {
                return ResponseEntity.status(401).build();
            }

            Map<String, Object> stats = new HashMap<>();
            stats.put("totalFeedback", feedbackService.getTotalFeedback());
            stats.put("pendingReview", feedbackService.getPendingFeedback());
            stats.put("resolved", feedbackService.getResolvedFeedback());
            stats.put("inProgress", feedbackService.getInProgressFeedback());

            return ResponseEntity.ok(stats);
        } catch (Exception e) {
            log.error("❌ Failed to fetch feedback stats", e);
            return ResponseEntity.status(500).build();
        }
    }
}