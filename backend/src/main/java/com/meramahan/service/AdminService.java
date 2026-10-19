package com.meramahan.service;

import com.meramahan.dto.*;
import com.meramahan.entity.*;
import com.meramahan.exception.ResourceNotFoundException;
import com.meramahan.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class AdminService {

    private final UserRepository userRepository;
    private final ReportRepository reportRepository;
    private final CommentRepository commentRepository;
    private final ReportLikeRepository reportLikeRepository;
    private final ModerationActionRepository moderationActionRepository;
    private final ContentReportRepository contentReportRepository;
    private final ReportService reportService;

    @Autowired
    public AdminService(UserRepository userRepository,
                        ReportRepository reportRepository,
                        CommentRepository commentRepository,
                        ReportLikeRepository reportLikeRepository,
                        ModerationActionRepository moderationActionRepository,
                        ContentReportRepository contentReportRepository,
                        ReportService reportService) {
        this.userRepository = userRepository;
        this.reportRepository = reportRepository;
        this.commentRepository = commentRepository;
        this.reportLikeRepository = reportLikeRepository;
        this.moderationActionRepository = moderationActionRepository;
        this.contentReportRepository = contentReportRepository;
        this.reportService = reportService;
    }

    @Transactional(readOnly = true)
    public AdminAnalyticsDto getAnalytics() {
        AdminAnalyticsDto dto = new AdminAnalyticsDto();

        dto.setTotalUsers(userRepository.count());
        dto.setTotalReports(reportRepository.count());
        dto.setPendingReports(reportRepository.countByStatus(ReportStatus.PENDING));
        dto.setUnderReviewReports(reportRepository.countByStatus(ReportStatus.UNDER_REVIEW));
        dto.setApprovedReports(reportRepository.countByStatus(ReportStatus.APPROVED));
        dto.setRejectedReports(reportRepository.countByStatus(ReportStatus.REJECTED));
        dto.setResolvedReports(reportRepository.countByStatus(ReportStatus.RESOLVED));
        dto.setTotalComments(commentRepository.count());
        dto.setTotalLikes(reportLikeRepository.count());

        // Aggregate by state
        Map<String, Long> stateMap = new HashMap<>();
        for (Object[] row : reportRepository.countReportsByState()) {
            if (row != null && row.length == 2 && row[0] != null) {
                stateMap.put((String) row[0], ((Number) row[1]).longValue());
            }
        }
        dto.setReportsByState(stateMap);

        // Aggregate by city
        Map<String, Long> cityMap = new HashMap<>();
        for (Object[] row : reportRepository.countReportsByCity()) {
            if (row != null && row.length == 2 && row[0] != null) {
                cityMap.put((String) row[0], ((Number) row[1]).longValue());
            }
        }
        dto.setReportsByCity(cityMap);

        // Aggregate by category
        Map<String, Long> catMap = new HashMap<>();
        for (Object[] row : reportRepository.countReportsByCategory()) {
            if (row != null && row.length == 2 && row[0] != null) {
                catMap.put((String) row[0], ((Number) row[1]).longValue());
            }
        }
        dto.setReportsByCategory(catMap);

        // Aggregate by status
        Map<String, Long> statusMap = new HashMap<>();
        for (Object[] row : reportRepository.countReportsByStatusGroup()) {
            if (row != null && row.length == 2 && row[0] != null) {
                statusMap.put(row[0].toString(), ((Number) row[1]).longValue());
            }
        }
        dto.setReportsByStatus(statusMap);

        return dto;
    }

    @Transactional(readOnly = true)
    public Page<ReportDto> getReports(ReportStatus status, Long categoryId, Long stateId, Long cityId, String query, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        Page<Report> reports = reportRepository.findAdminReports(status, categoryId, stateId, cityId, query, pageable);
        return reports.map(r -> reportService.mapToDto(r, null, true));
    }

    @Transactional(readOnly = true)
    public Page<UserSummaryDto> getUsers(String query, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        String q = (query != null && !query.isBlank()) ? query.trim() : "";
        Page<User> users = userRepository.findByEmailContainingIgnoreCase(q, pageable);
        return users.map(this::toUserSummary);
    }

    @Transactional
    public UserSummaryDto toggleUserStatus(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

        user.setActive(!user.isActive());
        User saved = userRepository.save(user);
        return toUserSummary(saved);
    }

    @Transactional
    public UserSummaryDto updateUserRole(Long userId, Role newRole) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

        user.setRole(newRole);
        User saved = userRepository.save(user);
        return toUserSummary(saved);
    }

    @Transactional(readOnly = true)
    public Page<ContentReportDto> getContentReports(ContentReportStatus status, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        Page<ContentReport> contentReports = contentReportRepository.findByStatus(status, pageable);
        return contentReports.map(this::mapContentReportToDto);
    }

    @Transactional
    public void resolveContentReport(Long contentReportId, ContentReportStatus newStatus, boolean takeAction) {
        ContentReport cr = contentReportRepository.findById(contentReportId)
                .orElseThrow(() -> new ResourceNotFoundException("Content report not found with id: " + contentReportId));

        cr.setStatus(newStatus);
        contentReportRepository.save(cr);

        if (takeAction) {
            if (cr.getComment() != null) {
                cr.getComment().setHidden(true);
                commentRepository.save(cr.getComment());
            } else if (cr.getReport() != null) {
                cr.getReport().setStatus(ReportStatus.REJECTED);
                reportRepository.save(cr.getReport());
            }
        }
    }

    @Transactional(readOnly = true)
    public List<ModerationActionDto> getReportModerationLogs(Long reportId) {
        return moderationActionRepository.findByReportIdOrderByCreatedAtDesc(reportId).stream()
                .map(m -> new ModerationActionDto(
                        m.getId(),
                        m.getModerator().getId(),
                        m.getModerator().getEmail(),
                        m.getReport().getId(),
                        m.getAction(),
                        m.getReason(),
                        m.getCreatedAt()
                ))
                .collect(Collectors.toList());
    }

    private UserSummaryDto toUserSummary(User user) {
        Long stateId = null;
        String stateName = null;
        Long cityId = null;
        String cityName = null;

        if (user.getProfile() != null) {
            if (user.getProfile().getState() != null) {
                stateId = user.getProfile().getState().getId();
                stateName = user.getProfile().getState().getName();
            }
            if (user.getProfile().getCity() != null) {
                cityId = user.getProfile().getCity().getId();
                cityName = user.getProfile().getCity().getName();
            }
        }

        return new UserSummaryDto(
                user.getId(),
                user.getEmail(),
                user.getRole(),
                user.isVerified(),
                stateId,
                stateName,
                cityId,
                cityName
        );
    }

    private ContentReportDto mapContentReportToDto(ContentReport cr) {
        ContentReportDto dto = new ContentReportDto();
        dto.setId(cr.getId());
        dto.setReportedByUserId(cr.getReportedBy().getId());
        dto.setReportedByUserEmail(cr.getReportedBy().getEmail());
        if (cr.getReport() != null) {
            dto.setReportId(cr.getReport().getId());
            dto.setReportTitle(cr.getReport().getTitle());
        }
        if (cr.getComment() != null) {
            dto.setCommentId(cr.getComment().getId());
            dto.setCommentText(cr.getComment().getText());
        }
        dto.setReason(cr.getReason());
        dto.setDescription(cr.getDescription());
        dto.setStatus(cr.getStatus());
        dto.setCreatedAt(cr.getCreatedAt());
        dto.setUpdatedAt(cr.getUpdatedAt());
        return dto;
    }
}
