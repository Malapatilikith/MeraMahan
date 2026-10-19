package com.meramahan.security;

import com.meramahan.entity.Role;
import com.meramahan.entity.User;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class JwtServiceTest {

    private JwtService jwtService;
    private User testUser;

    @BeforeEach
    void setUp() {
        jwtService = new JwtService(
                "404E635266556A586E3272357538782F413F4428472B4B6250645367566B5970",
                3600000L,
                86400000L
        );
        testUser = new User("citizen@meramahan.in", "encodedPassword", Role.ROLE_USER);
        testUser.setId(100L);
    }

    @Test
    void testGenerateAccessTokenAndValidate() {
        String token = jwtService.generateAccessToken(testUser);
        assertNotNull(token);
        assertTrue(jwtService.isTokenValid(token, "citizen@meramahan.in"));
        assertEquals("citizen@meramahan.in", jwtService.extractUsername(token));
        assertEquals("ROLE_USER", jwtService.extractRole(token));
        assertEquals(100L, jwtService.extractUserId(token));
    }

    @Test
    void testValidateRefreshToken() {
        String refreshToken = jwtService.generateRefreshToken(testUser);
        assertNotNull(refreshToken);

        JwtService.TokenClaims claims = jwtService.validateRefreshToken(refreshToken);
        assertNotNull(claims);
        assertEquals(100L, claims.getUserId());
        assertEquals("citizen@meramahan.in", claims.getEmail());
    }

    @Test
    void testTokenInvalidWithWrongEmail() {
        String token = jwtService.generateAccessToken(testUser);
        assertFalse(jwtService.isTokenValid(token, "other@meramahan.in"));
    }
}
