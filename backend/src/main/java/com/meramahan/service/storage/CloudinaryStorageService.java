package com.meramahan.service.storage;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.meramahan.exception.BadRequestException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.Map;
import java.util.UUID;

@Service
public class CloudinaryStorageService implements ImageStorageService {

    private static final Logger log = LoggerFactory.getLogger(CloudinaryStorageService.class);

    private final Cloudinary cloudinary;
    private final boolean isCloudinaryConfigured;
    private final String uploadDir;

    public CloudinaryStorageService(
            @Value("${app.cloudinary.cloud-name:}") String cloudName,
            @Value("${app.cloudinary.api-key:}") String apiKey,
            @Value("${app.cloudinary.api-secret:}") String apiSecret,
            @Value("${app.upload.local-dir:uploads}") String uploadDir) {
        this.uploadDir = uploadDir;
        if (cloudName != null && !cloudName.isBlank() &&
            apiKey != null && !apiKey.isBlank() &&
            apiSecret != null && !apiSecret.isBlank()) {
            this.cloudinary = new Cloudinary(ObjectUtils.asMap(
                    "cloud_name", cloudName,
                    "api_key", apiKey,
                    "api_secret", apiSecret,
                    "secure", true
            ));
            this.isCloudinaryConfigured = true;
            log.info("[STORAGE] Cloudinary storage service initialized.");
        } else {
            this.cloudinary = null;
            this.isCloudinaryConfigured = false;
            log.info("[STORAGE] Cloudinary credentials not fully specified. Falling back to local disk storage ('{}').", uploadDir);
        }
    }

    @Override
    public StorageResult storeImage(MultipartFile file) {
        if (file.isEmpty()) {
            throw new BadRequestException("Cannot upload empty file");
        }

        if (isCloudinaryConfigured && cloudinary != null) {
            try {
                @SuppressWarnings("unchecked")
                Map<String, Object> uploadResult = cloudinary.uploader().upload(file.getBytes(), ObjectUtils.asMap(
                        "folder", "meramahan/reports",
                        "resource_type", "auto"
                ));
                String secureUrl = (String) uploadResult.get("secure_url");
                String publicId = (String) uploadResult.get("public_id");
                log.info("[STORAGE] Uploaded to Cloudinary: publicId={}", publicId);
                return new StorageResult(secureUrl, publicId);
            } catch (Exception e) {
                log.error("[STORAGE] Cloudinary upload failed, falling back to local disk", e);
            }
        }

        // Local storage fallback
        return storeLocal(file);
    }

    private StorageResult storeLocal(MultipartFile file) {
        Path uploadPath = Paths.get(uploadDir);
        try {
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }

            String originalFilename = file.getOriginalFilename();
            String ext = "";
            if (originalFilename != null && originalFilename.contains(".")) {
                ext = originalFilename.substring(originalFilename.lastIndexOf("."));
            }
            String uniqueName = UUID.randomUUID().toString() + ext;
            Path targetLocation = uploadPath.resolve(uniqueName);

            Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);
            String url = "/" + uploadDir + "/" + uniqueName;
            log.info("[STORAGE] Stored locally: {}", targetLocation);
            return new StorageResult(url, uniqueName);
        } catch (IOException e) {
            log.error("[STORAGE] Failed to store file locally", e);
            throw new BadRequestException("Failed to store image: " + file.getOriginalFilename());
        }
    }

    @Override
    public void deleteImage(String publicId) {
        if (publicId == null || publicId.isBlank()) return;

        if (isCloudinaryConfigured && cloudinary != null) {
            try {
                cloudinary.uploader().destroy(publicId, ObjectUtils.emptyMap());
                log.info("[STORAGE] Deleted from Cloudinary: {}", publicId);
                return;
            } catch (Exception e) {
                log.error("[STORAGE] Failed to delete from Cloudinary: {}", publicId, e);
            }
        }

        // Local delete
        try {
            Path target = Paths.get(uploadDir).resolve(publicId);
            Files.deleteIfExists(target);
            log.info("[STORAGE] Deleted local file: {}", target);
        } catch (IOException e) {
            log.warn("[STORAGE] Could not delete local file: {}", publicId);
        }
    }
}
