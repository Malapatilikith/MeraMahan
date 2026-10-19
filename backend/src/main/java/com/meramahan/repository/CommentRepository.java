package com.meramahan.repository;

import com.meramahan.entity.Comment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CommentRepository extends JpaRepository<Comment, Long> {
    List<Comment> findByReportIdAndIsHiddenFalseOrderByCreatedAtAsc(Long reportId);
    List<Comment> findByReportIdOrderByCreatedAtDesc(Long reportId);
    long countByReportIdAndIsHiddenFalse(Long reportId);
}
