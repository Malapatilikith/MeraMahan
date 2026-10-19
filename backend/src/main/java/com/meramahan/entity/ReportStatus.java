package com.meramahan.entity;

public enum ReportStatus {
    PENDING("Pending Review"),
    UNDER_REVIEW("Under Review"),
    APPROVED("Verified"),
    REJECTED("Rejected"),
    RESOLVED("Resolved");

    private final String publicLabel;

    ReportStatus(String publicLabel) {
        this.publicLabel = publicLabel;
    }

    public String getPublicLabel() {
        return publicLabel;
    }
}
