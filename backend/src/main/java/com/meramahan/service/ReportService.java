package com.meramahan.service;

import com.meramahan.dto.*;
import com.meramahan.entity.*;
import com.meramahan.exception.BadRequestException;
import com.meramahan.exception.ResourceNotFoundException;
import com.meramahan.repository.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class ReportService {

    private static final Logger log = LoggerFactory.getLogger(ReportService.class);
    private static final String UPLOAD_DIR = "uploads";

    private final ReportRepository reportRepository;
    private final CategoryRepository categoryRepository;
    private final StateRepository stateRepository;
    private final CityRepository cityRepository;
    private final ReportImageRepository reportImageRepository;
    private final ReportLikeRepository reportLikeRepository;
    private final CommentRepository commentRepository;
    private final UserRepository userRepository;
    private final ModerationActionRepository moderationActionRepository;
    private final NotificationRepository notificationRepository;
    private final com.meramahan.service.storage.ImageStorageService imageStorageService;

    @Autowired
    public ReportService(ReportRepository reportRepository,
                          CategoryRepository categoryRepository,
                          StateRepository stateRepository,
                          CityRepository cityRepository,
                          ReportImageRepository reportImageRepository,
                          ReportLikeRepository reportLikeRepository,
                          CommentRepository commentRepository,
                          UserRepository userRepository,
                          ModerationActionRepository moderationActionRepository,
                          NotificationRepository notificationRepository,
                          com.meramahan.service.storage.ImageStorageService imageStorageService) {
        this.reportRepository = reportRepository;
        this.categoryRepository = categoryRepository;
        this.stateRepository = stateRepository;
        this.cityRepository = cityRepository;
        this.reportImageRepository = reportImageRepository;
        this.reportLikeRepository = reportLikeRepository;
        this.commentRepository = commentRepository;
        this.userRepository = userRepository;
        this.moderationActionRepository = moderationActionRepository;
        this.notificationRepository = notificationRepository;
        this.imageStorageService = imageStorageService;
    }

    @Transactional
    public ReportDto createReport(CreateReportRequest request, MultipartFile[] images, Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));
        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + request.getCategoryId()));
        State state = stateRepository.findById(request.getStateId())
                .orElseThrow(() -> new ResourceNotFoundException("State not found with id: " + request.getStateId()));
        City city = cityRepository.findById(request.getCityId())
                .orElseThrow(() -> new ResourceNotFoundException("City not found with id: " + request.getCityId()));

        Report report = new Report();
        report.setUser(user);
        report.setCategory(category);
        report.setTitle(request.getTitle().trim());
        report.setDescription(request.getDescription().trim());
        report.setState(state);
        report.setCity(city);
        report.setLocationArea(request.getLocationArea());
        report.setIncidentDate(request.getIncidentDate());
        report.setStatus(ReportStatus.PENDING);

        // Handle image uploads via pluggable storage provider
        List<ReportImage> reportImages = new ArrayList<>();
        if (images != null && images.length > 0) {
            for (MultipartFile file : images) {
                if (file.isEmpty()) continue;
                com.meramahan.service.storage.StorageResult result = imageStorageService.storeImage(file);
                ReportImage reportImage = new ReportImage(report, result.url(), result.publicId());
                reportImages.add(reportImage);
            }
        }

        report.setImages(reportImages);
        Report savedReport = reportRepository.save(report);

        log.info("[REPORT SERVICE] Created report ID {} by user {}", savedReport.getId(), user.getEmail());
        return mapToDto(savedReport, userId, false);
    }

    @Transactional(readOnly = true)
    public Page<ReportDto> getPublicReports(Long categoryId, Long stateId, Long cityId, String query, int page, int size, Long currentUserId) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        Page<Report> reports = reportRepository.findPublicReports(categoryId, stateId, cityId, query, pageable);
        return reports.map(report -> mapToDto(report, currentUserId, false));
    }

    @Transactional(readOnly = true)
    public Page<ReportDto> getUserReports(Long userId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        Page<Report> reports = reportRepository.findByUserIdOrderByCreatedAtDesc(userId, pageable);
        return reports.map(report -> mapToDto(report, userId, false));
    }

    @Transactional(readOnly = true)
    public ReportDto getReportById(Long reportId, Long currentUserId, boolean isStaff) {
        Report report = reportRepository.findById(reportId)
                .orElseThrow(() -> new ResourceNotFoundException("Report not found with id: " + reportId));

        boolean isOwner = currentUserId != null && report.getUser().getId().equals(currentUserId);
        if (!report.isPublic() && !isOwner && !isStaff) {
            throw new ResourceNotFoundException("Report not found or not yet approved for public viewing");
        }

        return mapToDto(report, currentUserId, isStaff);
    }

    @Transactional
    public void updateStatus(Long reportId, ReportStatusUpdateRequest request, Long moderatorId) {
        Report report = reportRepository.findById(reportId)
                .orElseThrow(() -> new ResourceNotFoundException("Report not found with id: " + reportId));

        User moderator = userRepository.findById(moderatorId)
                .orElseThrow(() -> new ResourceNotFoundException("Moderator not found with id: " + moderatorId));

        ReportStatus newStatus = request.getStatus();
        report.setStatus(newStatus);
        Report savedReport = reportRepository.save(report);

        // Map report status to moderation action
        ModerationActionType actionType = switch (newStatus) {
            case APPROVED -> ModerationActionType.APPROVED;
            case REJECTED -> ModerationActionType.REJECTED;
            case UNDER_REVIEW -> ModerationActionType.UNDER_REVIEW;
            case RESOLVED -> ModerationActionType.RESOLVED;
            case PENDING -> ModerationActionType.UNDER_REVIEW;
        };

        ModerationAction modAction = new ModerationAction(moderator, savedReport, actionType, request.getReason());
        moderationActionRepository.save(modAction);

        // Send in-app notification to report owner
        String title = "Report Status Update";
        String message = String.format("Your report '%s' has been marked as %s.%s",
                report.getTitle(),
                newStatus.getPublicLabel(),
                request.getReason() != null && !request.getReason().isBlank() ? " Reason: " + request.getReason() : "");

        Notification notification = new Notification(
                report.getUser(),
                "REPORT_STATUS_" + newStatus.name(),
                title,
                message,
                report.getId()
        );
        notificationRepository.save(notification);

        log.info("[REPORT SERVICE] Moderator {} updated report {} status to {}", moderator.getEmail(), reportId, newStatus);
    }

    @Transactional
    public boolean toggleLike(Long reportId, Long userId) {
        Report report = reportRepository.findById(reportId)
                .orElseThrow(() -> new ResourceNotFoundException("Report not found with id: " + reportId));

        Optional<ReportLike> existing = reportLikeRepository.findByReportIdAndUserId(reportId, userId);
        if (existing.isPresent()) {
            reportLikeRepository.delete(existing.get());
            report.setLikeCount(Math.max(0, report.getLikeCount() - 1));
            reportRepository.save(report);
            return false;
        } else {
            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));
            ReportLike like = new ReportLike(report, user);
            reportLikeRepository.save(like);
            report.setLikeCount(report.getLikeCount() + 1);
            reportRepository.save(report);
            return true;
        }
    }

    @Transactional
    public CommentDto addComment(Long reportId, CreateCommentRequest request, Long userId) {
        Report report = reportRepository.findById(reportId)
                .orElseThrow(() -> new ResourceNotFoundException("Report not found with id: " + reportId));
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

        Comment comment = new Comment(report, user, request.getText().trim());
        Comment savedComment = commentRepository.save(comment);

        report.setCommentCount(report.getCommentCount() + 1);
        reportRepository.save(report);

        // Notify report author if commenter is not author
        if (!report.getUser().getId().equals(userId)) {
            Notification notification = new Notification(
                    report.getUser(),
                    "NEW_COMMENT",
                    "New comment on your report",
                    "A citizen commented on: " + report.getTitle(),
                    report.getId()
            );
            notificationRepository.save(notification);
        }

        return mapCommentToDto(savedComment, userId);
    }

    @Transactional(readOnly = true)
    public List<CommentDto> getReportComments(Long reportId, Long currentUserId) {
        if (!reportRepository.existsById(reportId)) {
            throw new ResourceNotFoundException("Report not found with id: " + reportId);
        }
        return commentRepository.findByReportIdAndIsHiddenFalseOrderByCreatedAtAsc(reportId).stream()
                .map(comment -> mapCommentToDto(comment, currentUserId))
                .collect(Collectors.toList());
    }

    public ReportDto mapToDto(Report report, Long currentUserId, boolean isStaff) {
        ReportDto dto = new ReportDto();
        dto.setId(report.getId());
        dto.setTitle(report.getTitle());
        dto.setDescription(report.getDescription());
        dto.setLocationArea(report.getLocationArea());
        dto.setIncidentDate(report.getIncidentDate());
        dto.setStatus(report.getStatus());
        dto.setPublic(report.isPublic());
        dto.setLikeCount(report.getLikeCount());
        dto.setCommentCount(report.getCommentCount());
        dto.setCreatedAt(report.getCreatedAt());
        dto.setUpdatedAt(report.getUpdatedAt());

        if (report.getCategory() != null) {
            dto.setCategory(new CategoryDto(
                    report.getCategory().getId(),
                    report.getCategory().getName(),
                    report.getCategory().getCategoryGroup(),
                    report.getCategory().getDescription(),
                    report.getCategory().isActive()
            ));
        }

        if (report.getState() != null) {
            dto.setState(new StateDto(
                    report.getState().getId(),
                    report.getState().getName(),
                    report.getState().getCode(),
                    report.getState().isUnionTerritory()
            ));
        }

        if (report.getCity() != null) {
            dto.setCity(new CityDto(
                    report.getCity().getId(),
                    report.getCity().getState().getId(),
                    report.getCity().getName()
            ));
        }

        if (report.getImages() != null) {
            dto.setImages(report.getImages().stream()
                    .map(img -> new ReportImageDto(img.getId(), img.getImageUrl()))
                    .collect(Collectors.toList()));
        }

        if (currentUserId != null) {
            boolean isLiked = reportLikeRepository.existsByReportIdAndUserId(report.getId(), currentUserId);
            dto.setLikedByCurrentUser(isLiked);
            boolean isOwner = report.getUser().getId().equals(currentUserId);
            dto.setOwner(isOwner);
            if (isOwner || isStaff) {
                dto.setReporterEmail(report.getUser().getEmail());
            }
        }

        return dto;
    }

    public CommentDto mapCommentToDto(Comment comment, Long currentUserId) {
        CommentDto dto = new CommentDto();
        dto.setId(comment.getId());
        dto.setReportId(comment.getReport().getId());

        String email = comment.getUser().getEmail();
        int atIdx = email.indexOf('@');
        String maskedName = (atIdx > 2) ? email.substring(0, 2) + "***" + email.substring(atIdx) : email;

        dto.setAuthorName(maskedName);
        dto.setText(comment.getText());
        dto.setHidden(comment.isHidden());
        dto.setOwner(currentUserId != null && comment.getUser().getId().equals(currentUserId));
        dto.setCreatedAt(comment.getCreatedAt());
        dto.setUpdatedAt(comment.getUpdatedAt());
        return dto;
    }
}
