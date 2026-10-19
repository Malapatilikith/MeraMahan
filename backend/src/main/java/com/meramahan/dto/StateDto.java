package com.meramahan.dto;

public class StateDto {

    private Long id;
    private String name;
    private String code;
    private boolean isUnionTerritory;

    public StateDto() {}

    public StateDto(Long id, String name) {
        this.id = id;
        this.name = name;
    }

    public StateDto(Long id, String name, String code, boolean isUnionTerritory) {
        this.id = id;
        this.name = name;
        this.code = code;
        this.isUnionTerritory = isUnionTerritory;
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

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public boolean isUnionTerritory() {
        return isUnionTerritory;
    }

    public void setUnionTerritory(boolean unionTerritory) {
        isUnionTerritory = unionTerritory;
    }
}
