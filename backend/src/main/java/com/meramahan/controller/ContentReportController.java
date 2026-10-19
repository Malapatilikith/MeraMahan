package com.meramahan.controller;

import com.meramahan.dto.ApiResponse;
import com.meramahan.dto.ContentReportDto;
import com.meramahan.dto.CreateContentReportRequest;
import com.meramahan.security.CustomUserDetails;
import com.meramahan.service.ContentReportService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/content-reports")
@PreAuthorize("isAuthenticated()")
public class ContentReportController {

    private final ContentReportService contentReportService;

    @Autowired
    public ContentReportController(ContentReportService contentReportService) {
        this.contentReportService = contentReportService;
    }

    @PostMapping
    public ResponseEntity<ApiResponse<ContentReportDto>> reportContent(
            @Valid @RequestBody CreateContentReportRequest request,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        ContentReportDto dto = contentReportService.reportContent(request, userDetails.getId());
        return ResponseEntity.ok(ApiResponse.success("Content report submitted for review", dto));
    }
}
