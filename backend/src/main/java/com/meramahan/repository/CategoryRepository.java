package com.meramahan.repository;

import com.meramahan.entity.Category;
import com.meramahan.entity.CategoryGroup;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Long> {
    List<Category> findByIsActiveTrueOrderByNameAsc();
    List<Category> findByCategoryGroupAndIsActiveTrueOrderByNameAsc(CategoryGroup categoryGroup);
    Optional<Category> findByNameIgnoreCase(String name);
}
