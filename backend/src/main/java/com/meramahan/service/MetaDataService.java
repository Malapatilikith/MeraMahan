package com.meramahan.service;

import com.meramahan.dto.CategoryDto;
import com.meramahan.dto.CityDto;
import com.meramahan.dto.StateDto;
import com.meramahan.entity.CategoryGroup;
import com.meramahan.repository.CategoryRepository;
import com.meramahan.repository.CityRepository;
import com.meramahan.repository.StateRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional(readOnly = true)
public class MetaDataService {

    private final StateRepository stateRepository;
    private final CityRepository cityRepository;
    private final CategoryRepository categoryRepository;

    @Autowired
    public MetaDataService(StateRepository stateRepository,
                           CityRepository cityRepository,
                           CategoryRepository categoryRepository) {
        this.stateRepository = stateRepository;
        this.cityRepository = cityRepository;
        this.categoryRepository = categoryRepository;
    }

    public List<StateDto> getAllStates() {
        return stateRepository.findAllByOrderByNameAsc().stream()
                .map(s -> new StateDto(s.getId(), s.getName(), s.getCode(), s.isUnionTerritory()))
                .collect(Collectors.toList());
    }

    public List<CityDto> getCitiesByState(Long stateId) {
        return cityRepository.findByStateIdOrderByNameAsc(stateId).stream()
                .map(c -> new CityDto(c.getId(), c.getState().getId(), c.getName()))
                .collect(Collectors.toList());
    }

    public List<CategoryDto> getAllActiveCategories() {
        return categoryRepository.findByIsActiveTrueOrderByNameAsc().stream()
                .map(cat -> new CategoryDto(
                        cat.getId(),
                        cat.getName(),
                        cat.getCategoryGroup(),
                        cat.getDescription(),
                        cat.isActive()
                ))
                .collect(Collectors.toList());
    }

    public List<CategoryDto> getCategoriesByGroup(CategoryGroup group) {
        return categoryRepository.findByCategoryGroupAndIsActiveTrueOrderByNameAsc(group).stream()
                .map(cat -> new CategoryDto(
                        cat.getId(),
                        cat.getName(),
                        cat.getCategoryGroup(),
                        cat.getDescription(),
                        cat.isActive()
                ))
                .collect(Collectors.toList());
    }
}
