package com.meramahan.dto;

import com.meramahan.entity.ReportStatus;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public class ReportStatusUpdateRequest {

    @NotNull(message = "Status is required")
    private ReportStatus status;

    @Size(max = 500, message = "Reason must not exceed 500 characters")
    private String reason;

    public ReportStatusUpdateRequest() {}

    public ReportStatusUpdateRequest(ReportStatus status, String reason) {
        this.status = status;
        this.reason = reason;
    }

    public ReportStatus getStatus() {
        return status;
    }

    public void setStatus(ReportStatus status) {
        this.status = status;
    }

    public String getReason() {
        return reason;
    }

    public void setReason(String reason) {
        this.reason = reason;
    }
}
