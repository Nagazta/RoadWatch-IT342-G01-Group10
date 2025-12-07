package road.watch.it_342_g01.RoadWatch.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import road.watch.it_342_g01.RoadWatch.entity.ReportEntity;
import road.watch.it_342_g01.RoadWatch.entity.ReportImageEntity;
import road.watch.it_342_g01.RoadWatch.repository.ReportImageRepo;
import road.watch.it_342_g01.RoadWatch.repository.ReportRepo;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class ImageUploadService {

    private final ReportRepo reportRepo;
    private final ReportImageRepo imageRepo;

    @Value("${file.upload-dir:uploads/reports}")
    private String uploadDir;

    /**
     * Upload multiple images for a report
     */
    public List<ReportImageEntity> uploadReportImages(Long reportId, MultipartFile[] files) {
        log.info("📸 Uploading {} images for report ID: {}", files.length, reportId);

        ReportEntity report = reportRepo.findById(reportId)
                .orElseThrow(() -> new RuntimeException("Report not found: " + reportId));

        List<ReportImageEntity> uploadedImages = new ArrayList<>();

        // Create upload directory if it doesn't exist
        try {
            Path uploadPath = Paths.get(uploadDir);
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
                log.info("📁 Created upload directory: {}", uploadPath);
            }

            for (MultipartFile file : files) {
                if (file.isEmpty()) {
                    log.warn("⚠️ Skipping empty file");
                    continue;
                }

                // Validate file type
                String contentType = file.getContentType();
                if (contentType == null || !contentType.startsWith("image/")) {
                    log.warn("⚠️ Skipping non-image file: {}", contentType);
                    continue;
                }

                // Generate unique filename
                String originalFilename = file.getOriginalFilename();
                String fileExtension = originalFilename != null && originalFilename.contains(".")
                        ? originalFilename.substring(originalFilename.lastIndexOf("."))
                        : ".jpg";
                String uniqueFilename = UUID.randomUUID().toString() + fileExtension;

                // Save file to disk
                Path filePath = uploadPath.resolve(uniqueFilename);
                Files.copy(file.getInputStream(), filePath);

                log.info("✅ Saved file: {}", filePath);

                // Create database record
                ReportImageEntity image = new ReportImageEntity();
                image.setImageUrl("/uploads/reports/" + uniqueFilename);
                image.setImageKey(uniqueFilename);
                image.setReport(report);

                ReportImageEntity savedImage = imageRepo.save(image);
                uploadedImages.add(savedImage);
            }

            log.info("✅ Successfully uploaded {} images", uploadedImages.size());
            return uploadedImages;

        } catch (IOException e) {
            log.error("❌ Failed to upload images", e);
            throw new RuntimeException("Failed to upload images: " + e.getMessage());
        }
    }

    /**
     * Get all images for a report
     */
    public List<ReportImageEntity> getReportImages(Long reportId) {
        return imageRepo.findByReportId(reportId);
    }

    /**
     * Delete an image
     */
    public void deleteImage(Long imageId) {
        ReportImageEntity image = imageRepo.findById(imageId)
                .orElseThrow(() -> new RuntimeException("Image not found: " + imageId));

        // Delete file from disk
        try {
            Path filePath = Paths.get(uploadDir).resolve(image.getImageKey());
            Files.deleteIfExists(filePath);
            log.info("🗑️ Deleted file: {}", filePath);
        } catch (IOException e) {
            log.error("❌ Failed to delete file", e);
        }

        // Delete database record
        imageRepo.delete(image);
        log.info("✅ Deleted image record: {}", imageId);
    }
}