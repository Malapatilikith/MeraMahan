package com.meramahan.service;

import com.meramahan.dto.ContentReportDto;
import com.meramahan.dto.CreateContentReportRequest;
import com.meramahan.entity.Comment;
import com.meramahan.entity.ContentReport;
import com.meramahan.entity.ContentReportStatus;
import com.meramahan.entity.Report;
import com.meramahan.entity.User;
import com.meramahan.exception.BadRequestException;
import com.meramahan.exception.ResourceNotFoundException;
import com.meramahan.repository.CommentRepository;
import com.meramahan.repository.ContentReportRepository;
import com.meramahan.repository.ReportRepository;
import com.meramahan.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ContentReportService {

    private final ContentReportRepository contentReportRepository;
    private final ReportRepository reportRepository;
    private final CommentRepository commentRepository;
    private final UserRepository userRepository;

    @Autowired
    public ContentReportService(ContentReportRepository contentReportRepository,
                                ReportRepository reportRepository,
                                CommentRepository commentRepository,
                                UserRepository userRepository) {
        this.contentReportRepository = contentReportRepository;
        this.reportRepository = reportRepository;
        this.commentRepository = commentRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public ContentReportDto reportContent(CreateContentReportRequest request, Long userId) {
        if (request.getReportId() == null && request.getCommentId() == null) {
            throw new BadRequestException("Must specify either a report ID or comment ID to report");
        }

        User reportedBy = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Report report = null;
        if (request.getReportId() != null) {
            report = reportRepository.findById(request.getReportId())
                    .orElseThrow(() -> new ResourceNotFoundException("Report not found with id: " + request.getReportId()));

            if (contentReportRepository.existsByReportedByIdAndReportId(userId, request.getReportId())) {
                throw new BadRequestException("You have already reported this issue");
            }
        }

        Comment comment = null;
        if (request.getCommentId() != null) {
            comment = commentRepository.findById(request.getCommentId())
                    .orElseThrow(() -> new ResourceNotFoundException("Comment not found with id: " + request.getCommentId()));

            if (contentReportRepository.existsByReportedByIdAndCommentId(userId, request.getCommentId())) {
                throw new BadRequestException("You have already reported this comment");
            }
        }

        ContentReport contentReport = new ContentReport(
                reportedBy,
                report,
                comment,
                request.getReason(),
                request.getDescription()
        );

        ContentReport saved = contentReportRepository.save(contentReport);
        return mapToDto(saved);
    }

    public ContentReportDto mapToDto(ContentReport cr) {
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
