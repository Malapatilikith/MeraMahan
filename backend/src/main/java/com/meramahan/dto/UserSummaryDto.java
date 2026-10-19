package com.meramahan.dto;

import com.meramahan.entity.Role;

public class UserSummaryDto {

    private Long id;
    private String email;
    private Role role;
    private boolean isVerified;
    private Long stateId;
    private String stateName;
    private Long cityId;
    private String cityName;

    public UserSummaryDto() {}

    public UserSummaryDto(Long id, String email, Role role, boolean isVerified, Long stateId, String stateName, Long cityId, String cityName) {
        this.id = id;
        this.email = email;
        this.role = role;
        this.isVerified = isVerified;
        this.stateId = stateId;
        this.stateName = stateName;
        this.cityId = cityId;
        this.cityName = cityName;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public Role getRole() {
        return role;
    }

    public void setRole(Role role) {
        this.role = role;
    }

    public boolean isVerified() {
        return isVerified;
    }

    public void setVerified(boolean verified) {
        isVerified = verified;
    }

    public Long getStateId() {
        return stateId;
    }

    public void setStateId(Long stateId) {
        this.stateId = stateId;
    }

    public String getStateName() {
        return stateName;
    }

    public void setStateName(String stateName) {
        this.stateName = stateName;
    }

    public Long getCityId() {
        return cityId;
    }

    public void setCityId(Long cityId) {
        this.cityId = cityId;
    }

    public String getCityName() {
        return cityName;
    }

    public void setCityName(String cityName) {
        this.cityName = cityName;
    }
}
