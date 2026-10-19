package com.meramahan.entity;

public enum CategoryGroup {
    ENVIRONMENT("Environment"),
    PUBLIC_SERVICE("Public Service / Integrity"),
    COMMUNITY("Community");

    private final String displayName;

    CategoryGroup(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }
}
