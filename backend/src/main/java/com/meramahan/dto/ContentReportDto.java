package com.meramahan.dto;

import com.meramahan.entity.ContentReportStatus;

import java.time.LocalDateTime;

public class ContentReportDto {

    private Long id;
    private Long reportedByUserId;
    private String reportedByUserEmail;
    private Long reportId;
    private String reportTitle;
    private Long commentId;
    private String commentText;
    private String reason;
    private String description;
    private ContentReportStatus status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public ContentReportDto() {}

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getReportedByUserId() {
        return reportedByUserId;
    }

    public void setReportedByUserId(Long reportedByUserId) {
        this.reportedByUserId = reportedByUserId;
    }

    public String getReportedByUserEmail() {
        return reportedByUserEmail;
    }

    public void setReportedByUserEmail(String reportedByUserEmail) {
        this.reportedByUserEmail = reportedByUserEmail;
    }

    public Long getReportId() {
        return reportId;
    }

    public void setReportId(Long reportId) {
        this.reportId = reportId;
    }

    public String getReportTitle() {
        return reportTitle;
    }

    public void setReportTitle(String reportTitle) {
        this.reportTitle = reportTitle;
    }

    public Long getCommentId() {
        return commentId;
    }

    public void setCommentId(Long commentId) {
        this.commentId = commentId;
    }

    public String getCommentText() {
        return commentText;
    }

    public void setCommentText(String commentText) {
        this.commentText = commentText;
    }

    public String getReason() {
        return reason;
    }

    public void setReason(String reason) {
        this.reason = reason;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public ContentReportStatus getStatus() {
        return status;
    }

    public void setStatus(ContentReportStatus status) {
        this.status = status;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}
