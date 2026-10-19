package com.meramahan.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class CreateContentReportRequest {

    @NotBlank(message = "Reason is required")
    private String reason;

    @Size(max = 500, message = "Description must not exceed 500 characters")
    private String description;

    private Long reportId;
    private Long commentId;

    public CreateContentReportRequest() {}

    public CreateContentReportRequest(String reason, String description, Long reportId, Long commentId) {
        this.reason = reason;
        this.description = description;
        this.reportId = reportId;
        this.commentId = commentId;
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

    public Long getReportId() {
        return reportId;
    }

    public void setReportId(Long reportId) {
        this.reportId = reportId;
    }

    public Long getCommentId() {
        return commentId;
    }

    public void setCommentId(Long commentId) {
        this.commentId = commentId;
    }
}
