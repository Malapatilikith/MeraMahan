package com.meramahan.repository;

import com.meramahan.entity.Report;
import com.meramahan.entity.ReportStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReportRepository extends JpaRepository<Report, Long> {

    @Query("SELECT r FROM Report r WHERE r.isPublic = true " +
           "AND (:categoryId IS NULL OR r.category.id = :categoryId) " +
           "AND (:stateId IS NULL OR r.state.id = :stateId) " +
           "AND (:cityId IS NULL OR r.city.id = :cityId) " +
           "AND (:query IS NULL OR LOWER(r.title) LIKE LOWER(CONCAT('%', :query, '%')) OR LOWER(r.description) LIKE LOWER(CONCAT('%', :query, '%')))")
    Page<Report> findPublicReports(
            @Param("categoryId") Long categoryId,
            @Param("stateId") Long stateId,
            @Param("cityId") Long cityId,
            @Param("query") String query,
            Pageable pageable
    );

    @Query("SELECT r FROM Report r WHERE " +
           "(:status IS NULL OR r.status = :status) " +
           "AND (:categoryId IS NULL OR r.category.id = :categoryId) " +
           "AND (:stateId IS NULL OR r.state.id = :stateId) " +
           "AND (:cityId IS NULL OR r.city.id = :cityId) " +
           "AND (:query IS NULL OR LOWER(r.title) LIKE LOWER(CONCAT('%', :query, '%')) OR LOWER(r.description) LIKE LOWER(CONCAT('%', :query, '%')))")
    Page<Report> findAdminReports(
            @Param("status") ReportStatus status,
            @Param("categoryId") Long categoryId,
            @Param("stateId") Long stateId,
            @Param("cityId") Long cityId,
            @Param("query") String query,
            Pageable pageable
    );

    Page<Report> findByUserIdOrderByCreatedAtDesc(Long userId, Pageable pageable);

    long countByStatus(ReportStatus status);

    @Query("SELECT r.state.name, COUNT(r) FROM Report r GROUP BY r.state.name ORDER BY COUNT(r) DESC")
    List<Object[]> countReportsByState();

    @Query("SELECT r.city.name, COUNT(r) FROM Report r GROUP BY r.city.name ORDER BY COUNT(r) DESC")
    List<Object[]> countReportsByCity();

    @Query("SELECT r.category.name, COUNT(r) FROM Report r GROUP BY r.category.name ORDER BY COUNT(r) DESC")
    List<Object[]> countReportsByCategory();

    @Query("SELECT r.status, COUNT(r) FROM Report r GROUP BY r.status")
    List<Object[]> countReportsByStatusGroup();

    long countByUserId(Long userId);
    long countByUserIdAndStatus(Long userId, ReportStatus status);
}
