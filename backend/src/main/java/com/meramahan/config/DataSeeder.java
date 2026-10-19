package com.meramahan.config;

import com.meramahan.entity.*;
import com.meramahan.repository.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class DataSeeder implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DataSeeder.class);

    private final StateRepository stateRepository;
    private final CityRepository cityRepository;
    private final CategoryRepository categoryRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Autowired
    public DataSeeder(StateRepository stateRepository,
                      CityRepository cityRepository,
                      CategoryRepository categoryRepository,
                      UserRepository userRepository,
                      PasswordEncoder passwordEncoder) {
        this.stateRepository = stateRepository;
        this.cityRepository = cityRepository;
        this.categoryRepository = categoryRepository;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        seedStatesAndCities();
        seedCategories();
        seedDefaultUsers();
    }

    private void seedStatesAndCities() {
        if (stateRepository.count() > 0) {
            return;
        }

        log.info("[DATA SEEDER] Seeding Indian States and Major Cities...");

        // States
        State delhi = stateRepository.save(new State("Delhi", "DL", true));
        State maharashtra = stateRepository.save(new State("Maharashtra", "MH", false));
        State karnataka = stateRepository.save(new State("Karnataka", "KA", false));
        State telangana = stateRepository.save(new State("Telangana", "TS", false));
        State tamilNadu = stateRepository.save(new State("Tamil Nadu", "TN", false));
        State uttarPradesh = stateRepository.save(new State("Uttar Pradesh", "UP", false));
        State westBengal = stateRepository.save(new State("West Bengal", "WB", false));
        State rajasthan = stateRepository.save(new State("Rajasthan", "RJ", false));
        State gujarat = stateRepository.save(new State("Gujarat", "GJ", false));
        State kerala = stateRepository.save(new State("Kerala", "KL", false));
        State punjab = stateRepository.save(new State("Punjab", "PB", false));
        State haryana = stateRepository.save(new State("Haryana", "HR", false));
        State bihar = stateRepository.save(new State("Bihar", "BR", false));
        State madhyaPradesh = stateRepository.save(new State("Madhya Pradesh", "MP", false));
        State andhraPradesh = stateRepository.save(new State("Andhra Pradesh", "AP", false));

        // Cities
        cityRepository.saveAll(List.of(
                new City(delhi, "New Delhi"),
                new City(delhi, "North Delhi"),
                new City(delhi, "South Delhi"),
                new City(maharashtra, "Mumbai"),
                new City(maharashtra, "Pune"),
                new City(maharashtra, "Nagpur"),
                new City(maharashtra, "Nashik"),
                new City(maharashtra, "Thane"),
                new City(karnataka, "Bengaluru"),
                new City(karnataka, "Mysuru"),
                new City(karnataka, "Hubballi"),
                new City(karnataka, "Mangaluru"),
                new City(telangana, "Hyderabad"),
                new City(telangana, "Warangal"),
                new City(tamilNadu, "Chennai"),
                new City(tamilNadu, "Coimbatore"),
                new City(tamilNadu, "Madurai"),
                new City(uttarPradesh, "Lucknow"),
                new City(uttarPradesh, "Noida"),
                new City(uttarPradesh, "Kanpur"),
                new City(uttarPradesh, "Varanasi"),
                new City(uttarPradesh, "Agra"),
                new City(westBengal, "Kolkata"),
                new City(westBengal, "Howrah"),
                new City(rajasthan, "Jaipur"),
                new City(rajasthan, "Jodhpur"),
                new City(rajasthan, "Udaipur"),
                new City(gujarat, "Ahmedabad"),
                new City(gujarat, "Surat"),
                new City(gujarat, "Vadodara"),
                new City(kerala, "Thiruvananthapuram"),
                new City(kerala, "Kochi"),
                new City(kerala, "Kozhikode"),
                new City(punjab, "Amritsar"),
                new City(punjab, "Ludhiana"),
                new City(haryana, "Gurugram"),
                new City(haryana, "Faridabad"),
                new City(bihar, "Patna"),
                new City(bihar, "Gaya"),
                new City(madhyaPradesh, "Bhopal"),
                new City(madhyaPradesh, "Indore"),
                new City(andhraPradesh, "Visakhapatnam"),
                new City(andhraPradesh, "Vijayawada")
        ));

        log.info("[DATA SEEDER] States and cities seeded successfully.");
    }

    private void seedCategories() {
        if (categoryRepository.count() > 0) {
            return;
        }

        log.info("[DATA SEEDER] Seeding Report Categories...");

        categoryRepository.saveAll(List.of(
                // Environment
                new Category("Garbage & Waste Dumping", CategoryGroup.ENVIRONMENT, "Illegal waste dumping, overflowing community dustbins, and uncleared garbage heaps"),
                new Category("Water Body Pollution", CategoryGroup.ENVIRONMENT, "Contamination of lakes, rivers, canals, ponds, and drainage backflow"),
                new Category("Air & Industrial Pollution", CategoryGroup.ENVIRONMENT, "Smoke emission, toxic smells, industrial exhaust, and illegal burning"),
                new Category("Deforestation & Tree Cutting", CategoryGroup.ENVIRONMENT, "Unauthorized felling of trees and green cover destruction"),

                // Public Service
                new Category("Roads & Potholes", CategoryGroup.PUBLIC_SERVICE, "Severe potholes, cratered roads, damaged speed breakers, and open manholes"),
                new Category("Street Lighting", CategoryGroup.PUBLIC_SERVICE, "Broken, flickering, or absent streetlights leading to safety hazards"),
                new Category("Water Supply & Leakage", CategoryGroup.PUBLIC_SERVICE, "Major pipeline bursts, contaminated drinking water supply, or zero water pressure"),
                new Category("Drainage & Sewage Overflow", CategoryGroup.PUBLIC_SERVICE, "Blocked storm-water drains, open sewers, and road waterlogging"),
                new Category("Public Service Integrity & Extortion", CategoryGroup.PUBLIC_SERVICE, "Bribery demands, corruption in government service delivery, or harassment"),

                // Community
                new Category("Public Safety Hazards", CategoryGroup.COMMUNITY, "Dangling live electric wires, hazardous structures, or uncovered construction"),
                new Category("Parks & Public Spaces", CategoryGroup.COMMUNITY, "Dilapidated municipal parks, broken public gym equipment, or neglected playgrounds"),
                new Category("Public Toilets & Hygiene", CategoryGroup.COMMUNITY, "Non-functional, locked, or filthy community public sanitation facilities"),
                new Category("Stray Animals & Welfare", CategoryGroup.COMMUNITY, "Aggressive animal packs, injured stray animals, or lack of shelter/rabies drives")
        ));

        log.info("[DATA SEEDER] Categories seeded successfully.");
    }

    private void seedDefaultUsers() {
        if (!userRepository.existsByEmail("admin@meramahan.in")) {
            User admin = new User();
            admin.setEmail("admin@meramahan.in");
            admin.setPassword(passwordEncoder.encode("Admin@123"));
            admin.setRole(Role.ROLE_ADMIN);
            admin.setVerified(true);
            admin.setActive(true);

            State delhi = stateRepository.findByNameIgnoreCase("Delhi").orElse(null);
            City newDelhi = delhi != null ? cityRepository.findByStateIdAndNameIgnoreCase(delhi.getId(), "New Delhi").orElse(null) : null;
            admin.setProfile(new Profile(admin, delhi, newDelhi));

            userRepository.save(admin);
            log.info("[DATA SEEDER] Created default Admin: admin@meramahan.in / Admin@123");
        }

        if (!userRepository.existsByEmail("moderator@meramahan.in")) {
            User mod = new User();
            mod.setEmail("moderator@meramahan.in");
            mod.setPassword(passwordEncoder.encode("Moderator@123"));
            mod.setRole(Role.ROLE_MODERATOR);
            mod.setVerified(true);
            mod.setActive(true);

            State maharashtra = stateRepository.findByNameIgnoreCase("Maharashtra").orElse(null);
            City mumbai = maharashtra != null ? cityRepository.findByStateIdAndNameIgnoreCase(maharashtra.getId(), "Mumbai").orElse(null) : null;
            mod.setProfile(new Profile(mod, maharashtra, mumbai));

            userRepository.save(mod);
            log.info("[DATA SEEDER] Created default Moderator: moderator@meramahan.in / Moderator@123");
        }

        if (!userRepository.existsByEmail("citizen@meramahan.in")) {
            User citizen = new User();
            citizen.setEmail("citizen@meramahan.in");
            citizen.setPassword(passwordEncoder.encode("Citizen@123"));
            citizen.setRole(Role.ROLE_USER);
            citizen.setVerified(true);
            citizen.setActive(true);

            State karnataka = stateRepository.findByNameIgnoreCase("Karnataka").orElse(null);
            City bengaluru = karnataka != null ? cityRepository.findByStateIdAndNameIgnoreCase(karnataka.getId(), "Bengaluru").orElse(null) : null;
            citizen.setProfile(new Profile(citizen, karnataka, bengaluru));

            userRepository.save(citizen);
            log.info("[DATA SEEDER] Created default Citizen: citizen@meramahan.in / Citizen@123");
        }
    }
}
