package com.meramahan.repository;

import com.meramahan.entity.ReportLike;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ReportLikeRepository extends JpaRepository<ReportLike, Long> {
    Optional<ReportLike> findByReportIdAndUserId(Long reportId, Long userId);
    boolean existsByReportIdAndUserId(Long reportId, Long userId);
    long countByReportId(Long reportId);
}
