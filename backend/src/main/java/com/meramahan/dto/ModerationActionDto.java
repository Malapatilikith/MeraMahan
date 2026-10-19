package com.meramahan.dto;

import com.meramahan.entity.ModerationActionType;

import java.time.LocalDateTime;

public class ModerationActionDto {

    private Long id;
    private Long moderatorId;
    private String moderatorEmail;
    private Long reportId;
    private ModerationActionType action;
    private String reason;
    private LocalDateTime createdAt;

    public ModerationActionDto() {}

    public ModerationActionDto(Long id, Long moderatorId, String moderatorEmail, Long reportId, ModerationActionType action, String reason, LocalDateTime createdAt) {
        this.id = id;
        this.moderatorId = moderatorId;
        this.moderatorEmail = moderatorEmail;
        this.reportId = reportId;
        this.action = action;
        this.reason = reason;
        this.createdAt = createdAt;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getModeratorId() {
        return moderatorId;
    }

    public void setModeratorId(Long moderatorId) {
        this.moderatorId = moderatorId;
    }

    public String getModeratorEmail() {
        return moderatorEmail;
    }

    public void setModeratorEmail(String moderatorEmail) {
        this.moderatorEmail = moderatorEmail;
    }

    public Long getReportId() {
        return reportId;
    }

    public void setReportId(Long reportId) {
        this.reportId = reportId;
    }

    public ModerationActionType getAction() {
        return action;
    }

    public void setAction(ModerationActionType action) {
        this.action = action;
    }

    public String getReason() {
        return reason;
    }

    public void setReason(String reason) {
        this.reason = reason;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
