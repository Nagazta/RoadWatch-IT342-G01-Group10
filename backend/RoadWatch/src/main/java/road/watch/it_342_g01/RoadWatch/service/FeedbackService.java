package road.watch.it_342_g01.RoadWatch.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Service;
import road.watch.it_342_g01.RoadWatch.entity.FeedbackEntity;
import road.watch.it_342_g01.RoadWatch.entity.userEntity;
import road.watch.it_342_g01.RoadWatch.repository.FeedbackRepo;
import road.watch.it_342_g01.RoadWatch.repository.userRepo;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Objects;
import java.util.Optional;

@Slf4j
@Service
@RequiredArgsConstructor
public class FeedbackService {

    private final FeedbackRepo feedbackRepo;

    @Autowired
    private userRepo userRepository;

    @NonNull
    public List<FeedbackEntity> getAllFeedback() {
        return feedbackRepo.findAllByOrderByDateSubmittedDesc();
    }

    @NonNull
    public Optional<FeedbackEntity> getFeedbackById(@NonNull Long id) {
        return feedbackRepo.findById(Objects.requireNonNull(id));
    }

    @NonNull
    public List<FeedbackEntity> getFeedbackByUser(@NonNull Long userId) {
        return feedbackRepo.findBySubmittedBy_Id(Objects.requireNonNull(userId));
    }

    @NonNull
    public List<FeedbackEntity> getFeedbackByStatus(@NonNull String status) {
        return feedbackRepo.findByStatus(Objects.requireNonNull(status));
    }

    @NonNull
    public List<FeedbackEntity> getFeedbackByCategory(@NonNull String category) {
        return feedbackRepo.findByCategory(Objects.requireNonNull(category));
    }

    @NonNull
    public FeedbackEntity createFeedback(@NonNull FeedbackEntity feedback, @NonNull Long userId) {
        // ✅ Link feedback to user
        userEntity user = userRepository.findById(Objects.requireNonNull(userId))
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));

        feedback.setSubmittedBy(user);
        feedback.setDateSubmitted(LocalDateTime.now());
        feedback.setStatus("Pending");

        log.info("📧 Creating new feedback from user: {}", user.getEmail());
        return feedbackRepo.save(Objects.requireNonNull(feedback));
    }

    @NonNull
    public FeedbackEntity updateFeedbackStatus(
            @NonNull Long id,
            @NonNull String status,
            String adminResponse,
            Long respondedById) {

        FeedbackEntity feedback = feedbackRepo.findById(Objects.requireNonNull(id))
                .orElseThrow(() -> new RuntimeException("Feedback not found with id: " + id));

        feedback.setStatus(Objects.requireNonNull(status));

        if (adminResponse != null) {
            feedback.setAdminResponse(adminResponse);
        }

        if (respondedById != null) {
            userEntity respondedBy = userRepository.findById(respondedById)
                    .orElseThrow(() -> new RuntimeException("User not found with id: " + respondedById));
            feedback.setRespondedBy(respondedBy);
            feedback.setRespondedAt(LocalDateTime.now());
        }

        log.info("✅ Updated feedback {} status to: {}", id, status);
        return feedbackRepo.save(feedback);
    }

    public void deleteFeedback(@NonNull Long id) {
        feedbackRepo.deleteById(Objects.requireNonNull(id));
        log.info("🗑️ Deleted feedback: {}", id);
    }

    // Statistics
    public long getTotalFeedback() {
        return feedbackRepo.count();
    }

    public long getPendingFeedback() {
        return feedbackRepo.countByStatus("Pending");
    }

    public long getResolvedFeedback() {
        return feedbackRepo.countByStatus("Resolved");
    }

    public long getInProgressFeedback() {
        return feedbackRepo.countByStatus("In Progress");
    }
}