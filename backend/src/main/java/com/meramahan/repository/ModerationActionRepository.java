package com.meramahan.repository;

import com.meramahan.entity.ModerationAction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ModerationActionRepository extends JpaRepository<ModerationAction, Long> {
    List<ModerationAction> findByReportIdOrderByCreatedAtDesc(Long reportId);
}
