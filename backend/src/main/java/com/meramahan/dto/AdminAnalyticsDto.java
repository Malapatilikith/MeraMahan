package com.meramahan.dto;

import java.util.HashMap;
import java.util.Map;

public class AdminAnalyticsDto {

    private long totalUsers;
    private long totalReports;
    private long pendingReports;
    private long underReviewReports;
    private long approvedReports;
    private long rejectedReports;
    private long resolvedReports;
    private long totalComments;
    private long totalLikes;
    private Map<String, Long> reportsByState = new HashMap<>();
    private Map<String, Long> reportsByCity = new HashMap<>();
    private Map<String, Long> reportsByCategory = new HashMap<>();
    private Map<String, Long> reportsByStatus = new HashMap<>();

    public AdminAnalyticsDto() {}

    public long getTotalUsers() {
        return totalUsers;
    }

    public void setTotalUsers(long totalUsers) {
        this.totalUsers = totalUsers;
    }

    public long getTotalReports() {
        return totalReports;
    }

    public void setTotalReports(long totalReports) {
        this.totalReports = totalReports;
    }

    public long getPendingReports() {
        return pendingReports;
    }

    public void setPendingReports(long pendingReports) {
        this.pendingReports = pendingReports;
    }

    public long getUnderReviewReports() {
        return underReviewReports;
    }

    public void setUnderReviewReports(long underReviewReports) {
        this.underReviewReports = underReviewReports;
    }

    public long getApprovedReports() {
        return approvedReports;
    }

    public void setApprovedReports(long approvedReports) {
        this.approvedReports = approvedReports;
    }

    public long getRejectedReports() {
        return rejectedReports;
    }

    public void setRejectedReports(long rejectedReports) {
        this.rejectedReports = rejectedReports;
    }

    public long getResolvedReports() {
        return resolvedReports;
    }

    public void setResolvedReports(long resolvedReports) {
        this.resolvedReports = resolvedReports;
    }

    public long getTotalComments() {
        return totalComments;
    }

    public void setTotalComments(long totalComments) {
        this.totalComments = totalComments;
    }

    public long getTotalLikes() {
        return totalLikes;
    }

    public void setTotalLikes(long totalLikes) {
        this.totalLikes = totalLikes;
    }

    public Map<String, Long> getReportsByState() {
        return reportsByState;
    }

    public void setReportsByState(Map<String, Long> reportsByState) {
        this.reportsByState = reportsByState;
    }

    public Map<String, Long> getReportsByCity() {
        return reportsByCity;
    }

    public void setReportsByCity(Map<String, Long> reportsByCity) {
        this.reportsByCity = reportsByCity;
    }

    public Map<String, Long> getReportsByCategory() {
        return reportsByCategory;
    }

    public void setReportsByCategory(Map<String, Long> reportsByCategory) {
        this.reportsByCategory = reportsByCategory;
    }

    public Map<String, Long> getReportsByStatus() {
        return reportsByStatus;
    }

    public void setReportsByStatus(Map<String, Long> reportsByStatus) {
        this.reportsByStatus = reportsByStatus;
    }
}
