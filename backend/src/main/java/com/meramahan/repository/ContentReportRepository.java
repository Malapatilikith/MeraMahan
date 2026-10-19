package com.meramahan.repository;

import com.meramahan.entity.ContentReport;
import com.meramahan.entity.ContentReportStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ContentReportRepository extends JpaRepository<ContentReport, Long> {
    Page<ContentReport> findByStatus(ContentReportStatus status, Pageable pageable);
    boolean existsByReportedByIdAndReportId(Long userId, Long reportId);
    boolean existsByReportedByIdAndCommentId(Long userId, Long commentId);
    long countByStatus(ContentReportStatus status);
}
