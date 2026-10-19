package com.meramahan.service;

import com.meramahan.dto.*;
import com.meramahan.entity.*;
import com.meramahan.exception.BadRequestException;
import com.meramahan.exception.ResourceNotFoundException;
import com.meramahan.repository.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalDateTime;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private OTPVerificationRepository otpRepository;

    @Mock
    private StateRepository stateRepository;

    @Mock
    private CityRepository cityRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private com.meramahan.service.email.EmailService emailService;

    @InjectMocks
    private AuthService authService;

    @Test
    void testSendOtp_Success() {
        SendOtpRequest request = new SendOtpRequest("user@example.com", OtpPurpose.REGISTRATION);
        when(userRepository.existsByEmail("user@example.com")).thenReturn(false);
        when(passwordEncoder.encode(any())).thenReturn("hashedOtp");

        assertDoesNotThrow(() -> authService.sendOtp(request));
        verify(otpRepository, times(1)).save(any(OTPVerification.class));
    }

    @Test
    void testSendOtp_EmailAlreadyExists() {
        SendOtpRequest request = new SendOtpRequest("user@example.com", OtpPurpose.REGISTRATION);
        when(userRepository.existsByEmail("user@example.com")).thenReturn(true);

        assertThrows(BadRequestException.class, () -> authService.sendOtp(request));
        verify(otpRepository, never()).save(any());
    }

    @Test
    void testVerifyOtp_Success() {
        VerifyOtpRequest request = new VerifyOtpRequest("user@example.com", "123456", OtpPurpose.REGISTRATION);
        OTPVerification otp = new OTPVerification("user@example.com", "hashed", OtpPurpose.REGISTRATION, LocalDateTime.now().plusMinutes(5));

        when(otpRepository.findTopByEmailIgnoreCaseAndPurposeOrderByCreatedAtDesc("user@example.com", OtpPurpose.REGISTRATION))
                .thenReturn(Optional.of(otp));
        when(passwordEncoder.matches("123456", "hashed")).thenReturn(true);

        assertDoesNotThrow(() -> authService.verifyOtp(request));
        assertTrue(otp.isVerified());
        verify(otpRepository).save(otp);
    }

    @Test
    void testVerifyOtp_InvalidOtp() {
        VerifyOtpRequest request = new VerifyOtpRequest("user@example.com", "999999", OtpPurpose.REGISTRATION);
        OTPVerification otp = new OTPVerification("user@example.com", "hashed", OtpPurpose.REGISTRATION, LocalDateTime.now().plusMinutes(5));

        when(otpRepository.findTopByEmailIgnoreCaseAndPurposeOrderByCreatedAtDesc("user@example.com", OtpPurpose.REGISTRATION))
                .thenReturn(Optional.of(otp));
        when(passwordEncoder.matches("999999", "hashed")).thenReturn(false);

        assertThrows(BadRequestException.class, () -> authService.verifyOtp(request));
    }

    @Test
    void testLogin_Success() {
        LoginRequest request = new LoginRequest("user@example.com", "Password123");
        User user = new User("user@example.com", "encodedPassword", Role.ROLE_USER);
        user.setActive(true);

        when(userRepository.findByEmail("user@example.com")).thenReturn(Optional.of(user));
        when(passwordEncoder.matches("Password123", "encodedPassword")).thenReturn(true);

        User loggedIn = authService.login(request);
        assertNotNull(loggedIn);
        assertEquals("user@example.com", loggedIn.getEmail());
    }

    @Test
    void testLogin_InvalidCredentials() {
        LoginRequest request = new LoginRequest("user@example.com", "WrongPassword");
        User user = new User("user@example.com", "encodedPassword", Role.ROLE_USER);
        user.setActive(true);

        when(userRepository.findByEmail("user@example.com")).thenReturn(Optional.of(user));
        when(passwordEncoder.matches("WrongPassword", "encodedPassword")).thenReturn(false);

        assertThrows(BadRequestException.class, () -> authService.login(request));
    }
}
