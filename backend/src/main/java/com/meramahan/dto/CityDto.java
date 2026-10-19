package com.meramahan.dto;

public class CityDto {

    private Long id;
    private Long stateId;
    private String name;

    public CityDto() {}

    public CityDto(Long id, String name) {
        this.id = id;
        this.name = name;
    }

    public CityDto(Long id, Long stateId, String name) {
        this.id = id;
        this.stateId = stateId;
        this.name = name;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getStateId() {
        return stateId;
    }

    public void setStateId(Long stateId) {
        this.stateId = stateId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }
}
