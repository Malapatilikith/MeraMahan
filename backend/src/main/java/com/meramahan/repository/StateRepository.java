package com.meramahan.repository;

import com.meramahan.entity.State;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface StateRepository extends JpaRepository<State, Long> {
    List<State> findAllByOrderByNameAsc();
    Optional<State> findByNameIgnoreCase(String name);
    Optional<State> findByCodeIgnoreCase(String code);
}
