package com.meramahan.dto;

import com.meramahan.entity.CategoryGroup;

public class CategoryDto {

    private Long id;
    private String name;
    private CategoryGroup categoryGroup;
    private String groupDisplayName;
    private String description;
    private boolean isActive;

    public CategoryDto() {}

    public CategoryDto(Long id, String name) {
        this.id = id;
        this.name = name;
    }

    public CategoryDto(Long id, String name, CategoryGroup categoryGroup, String description, boolean isActive) {
        this.id = id;
        this.name = name;
        this.categoryGroup = categoryGroup;
        this.groupDisplayName = categoryGroup != null ? categoryGroup.getDisplayName() : null;
        this.description = description;
        this.isActive = isActive;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public CategoryGroup getCategoryGroup() {
        return categoryGroup;
    }

    public void setCategoryGroup(CategoryGroup categoryGroup) {
        this.categoryGroup = categoryGroup;
        this.groupDisplayName = categoryGroup != null ? categoryGroup.getDisplayName() : null;
    }

    public String getGroupDisplayName() {
        return groupDisplayName;
    }

    public void setGroupDisplayName(String groupDisplayName) {
        this.groupDisplayName = groupDisplayName;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public boolean isActive() {
        return isActive;
    }

    public void setActive(boolean active) {
        isActive = active;
    }
}
