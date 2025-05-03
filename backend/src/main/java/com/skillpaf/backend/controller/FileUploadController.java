package com.skillpaf.backend.controller;

import com.skillpaf.backend.service.FileStorageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/v1")
@CrossOrigin(origins = "*", allowedHeaders = "*", methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.DELETE})
public class FileUploadController {

    @Autowired
    private FileStorageService fileStorageService;

    @PostMapping("/upload")
    public ResponseEntity<?> uploadFile(@RequestParam("file") MultipartFile file) {
        try {
            String fileName = fileStorageService.storeFile(file);
            return ResponseEntity.ok().body(new UploadResponse(fileName));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Could not upload the file: " + e.getMessage());
        }
    }

    private static class UploadResponse {
        private final String url;

        public UploadResponse(String url) {
            this.url = url;
        }

        public String getUrl() {
            return url;
        }
    }
} 