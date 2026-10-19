package com.meramahan.controller;

import com.meramahan.dto.*;
import com.meramahan.entity.ContentReportStatus;
import com.meramahan.entity.ReportStatus;
import com.meramahan.entity.Role;
import com.meramahan.service.AdminService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_MODERATOR')")
public class AdminController {

    private final AdminService adminService;

    @Autowired
    public AdminController(AdminService adminService) {
        this.adminService = adminService;
    }

    @GetMapping("/analytics")
    public ResponseEntity<ApiResponse<AdminAnalyticsDto>> getAnalytics() {
        AdminAnalyticsDto analytics = adminService.getAnalytics();
        return ResponseEntity.ok(ApiResponse.success("Analytics retrieved", analytics));
    }

    @GetMapping("/reports")
    public ResponseEntity<ApiResponse<Page<ReportDto>>> getReports(
            @RequestParam(required = false) ReportStatus status,
            @RequestParam(required = false) Long categoryId,
            @RequestParam(required = false) Long stateId,
            @RequestParam(required = false) Long cityId,
            @RequestParam(required = false) String query,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "15") int size) {
        Page<ReportDto> reports = adminService.getReports(status, categoryId, stateId, cityId, query, page, size);
        return ResponseEntity.ok(ApiResponse.success("Admin reports retrieved", reports));
    }

    @GetMapping("/reports/{reportId}/logs")
    public ResponseEntity<ApiResponse<List<ModerationActionDto>>> getReportModerationLogs(
            @PathVariable Long reportId) {
        List<ModerationActionDto> logs = adminService.getReportModerationLogs(reportId);
        return ResponseEntity.ok(ApiResponse.success("Moderation logs retrieved", logs));
    }

    @GetMapping("/users")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<ApiResponse<Page<UserSummaryDto>>> getUsers(
            @RequestParam(required = false) String query,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        Page<UserSummaryDto> users = adminService.getUsers(query, page, size);
        return ResponseEntity.ok(ApiResponse.success("Users retrieved", users));
    }

    @PutMapping("/users/{userId}/toggle-status")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<ApiResponse<UserSummaryDto>> toggleUserStatus(
            @PathVariable Long userId) {
        UserSummaryDto updated = adminService.toggleUserStatus(userId);
        return ResponseEntity.ok(ApiResponse.success("User status updated", updated));
    }

    @PutMapping("/users/{userId}/role")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<ApiResponse<UserSummaryDto>> updateUserRole(
            @PathVariable Long userId,
            @RequestParam Role role) {
        UserSummaryDto updated = adminService.updateUserRole(userId, role);
        return ResponseEntity.ok(ApiResponse.success("User role updated", updated));
    }

    @GetMapping("/content-reports")
    public ResponseEntity<ApiResponse<Page<ContentReportDto>>> getContentReports(
            @RequestParam(defaultValue = "PENDING") ContentReportStatus status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        Page<ContentReportDto> reports = adminService.getContentReports(status, page, size);
        return ResponseEntity.ok(ApiResponse.success("Abuse reports retrieved", reports));
    }

    @PutMapping("/content-reports/{id}/resolve")
    public ResponseEntity<ApiResponse<Void>> resolveContentReport(
            @PathVariable Long id,
            @RequestParam(defaultValue = "RESOLVED") ContentReportStatus status,
            @RequestParam(defaultValue = "false") boolean takeAction) {
        adminService.resolveContentReport(id, status, takeAction);
        return ResponseEntity.ok(ApiResponse.success("Content report processed"));
    }
}
