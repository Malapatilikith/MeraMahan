package com.meramahan.controller;

import com.meramahan.dto.*;
import com.meramahan.entity.User;
import com.meramahan.security.JwtService;
import com.meramahan.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@Validated
public class AuthController {

    private final AuthService authService;
    private final JwtService jwtService;

    @Autowired
    public AuthController(AuthService authService, JwtService jwtService) {
        this.authService = authService;
        this.jwtService = jwtService;
    }

    private UserSummaryDto toUserSummary(User user) {
        Long stateId = null;
        String stateName = null;
        Long cityId = null;
        String cityName = null;

        if (user.getProfile() != null) {
            if (user.getProfile().getState() != null) {
                stateId = user.getProfile().getState().getId();
                stateName = user.getProfile().getState().getName();
            }
            if (user.getProfile().getCity() != null) {
                cityId = user.getProfile().getCity().getId();
                cityName = user.getProfile().getCity().getName();
            }
        }

        return new UserSummaryDto(
                user.getId(),
                user.getEmail(),
                user.getRole(),
                user.isVerified(),
                stateId,
                stateName,
                cityId,
                cityName
        );
    }

    @PostMapping("/send-otp")
    public ResponseEntity<ApiResponse<Void>> sendOtp(@Valid @RequestBody SendOtpRequest request) {
        authService.sendOtp(request);
        return ResponseEntity.ok(ApiResponse.success("OTP sent successfully to " + request.getEmail()));
    }

    @PostMapping("/verify-otp")
    public ResponseEntity<ApiResponse<Void>> verifyOtp(@Valid @RequestBody VerifyOtpRequest request) {
        authService.verifyOtp(request);
        return ResponseEntity.ok(ApiResponse.success("OTP verified successfully"));
    }

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<AuthResponse>> register(@Valid @RequestBody RegisterRequest request) {
        User user = authService.register(request);
        String accessToken = jwtService.generateAccessToken(user);
        String refreshToken = jwtService.generateRefreshToken(user);
        AuthResponse authResponse = new AuthResponse(
                accessToken,
                refreshToken,
                jwtService.getAccessExpirationMs(),
                toUserSummary(user)
        );
        return ResponseEntity.ok(ApiResponse.success("Registration successful", authResponse));
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<AuthResponse>> login(@Valid @RequestBody LoginRequest request) {
        User user = authService.login(request);
        String accessToken = jwtService.generateAccessToken(user);
        String refreshToken = jwtService.generateRefreshToken(user);
        AuthResponse authResponse = new AuthResponse(
                accessToken,
                refreshToken,
                jwtService.getAccessExpirationMs(),
                toUserSummary(user)
        );
        return ResponseEntity.ok(ApiResponse.success("Login successful", authResponse));
    }

    @PostMapping("/refresh-token")
    public ResponseEntity<ApiResponse<AuthResponse>> refreshToken(@Valid @RequestBody RefreshTokenRequest request) {
        var tokenClaims = jwtService.validateRefreshToken(request.getRefreshToken());
        User user = authService.findById(tokenClaims.getUserId());
        String newAccess = jwtService.generateAccessToken(user);
        String newRefresh = jwtService.generateRefreshToken(user);
        AuthResponse authResponse = new AuthResponse(
                newAccess,
                newRefresh,
                jwtService.getAccessExpirationMs(),
                toUserSummary(user)
        );
        return ResponseEntity.ok(ApiResponse.success("Token refreshed", authResponse));
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<ApiResponse<Void>> forgotPassword(@Valid @RequestBody ForgotPasswordRequest request) {
        authService.initiatePasswordReset(request);
        return ResponseEntity.ok(ApiResponse.success("Password reset OTP sent to your email"));
    }

    @PostMapping("/reset-password")
    public ResponseEntity<ApiResponse<Void>> resetPassword(@Valid @RequestBody ResetPasswordRequest request) {
        authService.resetPassword(request);
        return ResponseEntity.ok(ApiResponse.success("Password reset successful. You may now log in."));
    }
}
