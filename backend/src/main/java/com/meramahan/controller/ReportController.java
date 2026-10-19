package com.meramahan.controller;

import com.meramahan.dto.*;
import com.meramahan.entity.Role;
import com.meramahan.security.CustomUserDetails;
import com.meramahan.service.ReportService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/reports")
@Validated
public class ReportController {

    private final ReportService reportService;

    @Autowired
    public ReportController(ReportService reportService) {
        this.reportService = reportService;
    }

    @PostMapping(consumes = {MediaType.MULTIPART_FORM_DATA_VALUE})
    @PreAuthorize("hasAuthority('ROLE_USER') or hasAuthority('ROLE_ADMIN') or hasAuthority('ROLE_MODERATOR')")
    public ResponseEntity<ApiResponse<ReportDto>> createReport(
            @Valid @ModelAttribute CreateReportRequest request,
            @RequestParam(value = "images", required = false) MultipartFile[] images,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        ReportDto dto = reportService.createReport(request, images, userDetails.getId());
        return ResponseEntity.ok(ApiResponse.success("Report submitted successfully for review", dto));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<Page<ReportDto>>> getPublicReports(
            @RequestParam(required = false) Long categoryId,
            @RequestParam(required = false) Long stateId,
            @RequestParam(required = false) Long cityId,
            @RequestParam(required = false) String query,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        Long currentUserId = userDetails != null ? userDetails.getId() : null;
        Page<ReportDto> reports = reportService.getPublicReports(categoryId, stateId, cityId, query, page, size, currentUserId);
        return ResponseEntity.ok(ApiResponse.success("Reports retrieved", reports));
    }

    @GetMapping("/me")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<Page<ReportDto>>> getMyReports(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        Page<ReportDto> reports = reportService.getUserReports(userDetails.getId(), page, size);
        return ResponseEntity.ok(ApiResponse.success("My reports retrieved", reports));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<ReportDto>> getReport(
            @PathVariable Long id,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        Long currentUserId = userDetails != null ? userDetails.getId() : null;
        boolean isStaff = userDetails != null && (
                userDetails.getUser().getRole() == Role.ROLE_ADMIN ||
                userDetails.getUser().getRole() == Role.ROLE_MODERATOR
        );
        ReportDto dto = reportService.getReportById(id, currentUserId, isStaff);
        return ResponseEntity.ok(ApiResponse.success("Report retrieved", dto));
    }

    @PutMapping("/{id}/status")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_MODERATOR')")
    public ResponseEntity<ApiResponse<Void>> updateStatus(
            @PathVariable Long id,
            @Valid @RequestBody ReportStatusUpdateRequest request,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        reportService.updateStatus(id, request, userDetails.getId());
        return ResponseEntity.ok(ApiResponse.success("Report status updated successfully"));
    }

    @PostMapping("/{id}/like")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<Boolean>> toggleLike(
            @PathVariable Long id,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        boolean liked = reportService.toggleLike(id, userDetails.getId());
        String msg = liked ? "Report liked" : "Report unliked";
        return ResponseEntity.ok(ApiResponse.success(msg, liked));
    }

    @PostMapping("/{id}/comments")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<CommentDto>> addComment(
            @PathVariable Long id,
            @Valid @RequestBody CreateCommentRequest request,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        CommentDto comment = reportService.addComment(id, request, userDetails.getId());
        return ResponseEntity.ok(ApiResponse.success("Comment added", comment));
    }

    @GetMapping("/{id}/comments")
    public ResponseEntity<ApiResponse<List<CommentDto>>> getComments(
            @PathVariable Long id,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        Long currentUserId = userDetails != null ? userDetails.getId() : null;
        List<CommentDto> comments = reportService.getReportComments(id, currentUserId);
        return ResponseEntity.ok(ApiResponse.success("Comments retrieved", comments));
    }
}
