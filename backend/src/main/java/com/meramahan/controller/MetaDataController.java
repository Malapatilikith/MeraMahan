package com.meramahan.controller;

import com.meramahan.dto.ApiResponse;
import com.meramahan.dto.CategoryDto;
import com.meramahan.dto.CityDto;
import com.meramahan.dto.StateDto;
import com.meramahan.entity.CategoryGroup;
import com.meramahan.service.MetaDataService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/meta")
public class MetaDataController {

    private final MetaDataService metaDataService;

    @Autowired
    public MetaDataController(MetaDataService metaDataService) {
        this.metaDataService = metaDataService;
    }

    @GetMapping("/states")
    public ResponseEntity<ApiResponse<List<StateDto>>> getStates() {
        List<StateDto> states = metaDataService.getAllStates();
        return ResponseEntity.ok(ApiResponse.success("States retrieved", states));
    }

    @GetMapping("/states/{stateId}/cities")
    public ResponseEntity<ApiResponse<List<CityDto>>> getCitiesByState(@PathVariable Long stateId) {
        List<CityDto> cities = metaDataService.getCitiesByState(stateId);
        return ResponseEntity.ok(ApiResponse.success("Cities retrieved", cities));
    }

    @GetMapping("/categories")
    public ResponseEntity<ApiResponse<List<CategoryDto>>> getCategories(
            @RequestParam(required = false) CategoryGroup group) {
        List<CategoryDto> categories = (group != null)
                ? metaDataService.getCategoriesByGroup(group)
                : metaDataService.getAllActiveCategories();
        return ResponseEntity.ok(ApiResponse.success("Categories retrieved", categories));
    }
}
