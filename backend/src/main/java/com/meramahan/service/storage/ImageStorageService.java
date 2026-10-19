package com.meramahan.service.storage;

import org.springframework.web.multipart.MultipartFile;

public interface ImageStorageService {
    StorageResult storeImage(MultipartFile file);
    void deleteImage(String publicId);
}
