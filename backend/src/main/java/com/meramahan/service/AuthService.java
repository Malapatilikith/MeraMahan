package com.meramahan.service;

import com.meramahan.dto.*;
import com.meramahan.entity.*;
import com.meramahan.exception.BadRequestException;
import com.meramahan.exception.ResourceNotFoundException;
import com.meramahan.repository.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.time.LocalDateTime;

@Service
public class AuthService {

    private static final Logger log = LoggerFactory.getLogger(AuthService.class);
    private static final SecureRandom RANDOM = new SecureRandom();

    private final UserRepository userRepository;
    private final OTPVerificationRepository otpRepository;
    private final StateRepository stateRepository;
    private final CityRepository cityRepository;
    private final PasswordEncoder passwordEncoder;
    private final com.meramahan.service.email.EmailService emailService;

    @Autowired
    public AuthService(UserRepository userRepository,
                       OTPVerificationRepository otpRepository,
                       StateRepository stateRepository,
                       CityRepository cityRepository,
                       PasswordEncoder passwordEncoder,
                       com.meramahan.service.email.EmailService emailService) {
        this.userRepository = userRepository;
        this.otpRepository = otpRepository;
        this.stateRepository = stateRepository;
        this.cityRepository = cityRepository;
        this.passwordEncoder = passwordEncoder;
        this.emailService = emailService;
    }

    private String generateNumericOtp(int length) {
        int bound = (int) Math.pow(10, length);
        int otp = RANDOM.nextInt(bound);
        return String.format("%0" + length + "d", otp);
    }

    public User findById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));
    }

    /**
     * Send OTP for registration or password reset
     */
    @Transactional
    public void sendOtp(SendOtpRequest request) {
        String email = request.getEmail().trim().toLowerCase();
        OtpPurpose purpose = request.getPurpose();

        if (purpose == OtpPurpose.REGISTRATION && userRepository.existsByEmail(email)) {
            throw new BadRequestException("An account with this email already exists");
        }
        if (purpose == OtpPurpose.PASSWORD_RESET && !userRepository.existsByEmail(email)) {
            throw new ResourceNotFoundException("No account found with this email address");
        }

        String otpCode = generateNumericOtp(6);
        String hashedOtp = passwordEncoder.encode(otpCode);

        OTPVerification otpVerification = new OTPVerification(
                email,
                hashedOtp,
                purpose,
                LocalDateTime.now().plusMinutes(5)
        );

        otpRepository.save(otpVerification);

        // Dispatch OTP via configurable email service (SMTP / Console fallback)
        emailService.sendOtpEmail(email, otpCode, purpose);
    }

    /**
     * Verify OTP
     */
    @Transactional
    public void verifyOtp(VerifyOtpRequest request) {
        String email = request.getEmail().trim().toLowerCase();
        OtpPurpose purpose = request.getPurpose();

        OTPVerification otp = otpRepository.findTopByEmailIgnoreCaseAndPurposeOrderByCreatedAtDesc(email, purpose)
                .orElseThrow(() -> new ResourceNotFoundException("No active OTP request found for this email"));

        if (otp.isExpired()) {
            throw new BadRequestException("OTP has expired. Please request a new one.");
        }

        if (otp.getAttemptCount() >= 5) {
            throw new BadRequestException("Too many failed attempts. Please request a new OTP.");
        }

        otp.incrementAttempts();

        if (!passwordEncoder.matches(request.getOtp(), otp.getOtpHash())) {
            otpRepository.save(otp);
            throw new BadRequestException("Invalid OTP. Please check and try again.");
        }

        otp.setVerified(true);
        otpRepository.save(otp);
        log.info("[OTP SERVICE] Successfully verified OTP for {} (purpose: {})", email, purpose);
    }

    /**
     * Register a new user with verified OTP
     */
    @Transactional
    public User register(RegisterRequest request) {
        String email = request.getEmail().trim().toLowerCase();

        if (userRepository.existsByEmail(email)) {
            throw new BadRequestException("An account with this email already exists");
        }

        if (!request.getPassword().equals(request.getConfirmPassword())) {
            throw new BadRequestException("Passwords do not match");
        }

        OTPVerification otp = otpRepository.findTopByEmailIgnoreCaseAndPurposeOrderByCreatedAtDesc(email, OtpPurpose.REGISTRATION)
                .orElseThrow(() -> new BadRequestException("Please request and verify OTP before registering"));

        if (!otp.isVerified() || otp.isExpired()) {
            if (!passwordEncoder.matches(request.getOtp(), otp.getOtpHash()) || otp.isExpired()) {
                throw new BadRequestException("Invalid or expired OTP. Please verify your OTP.");
            }
        }

        State state = null;
        if (request.getStateId() != null) {
            state = stateRepository.findById(request.getStateId())
                    .orElseThrow(() -> new ResourceNotFoundException("Selected state not found"));
        }

        City city = null;
        if (request.getCityId() != null) {
            city = cityRepository.findById(request.getCityId())
                    .orElseThrow(() -> new ResourceNotFoundException("Selected city not found"));
        }

        User user = new User();
        user.setEmail(email);
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(Role.ROLE_USER);
        user.setVerified(true);
        user.setActive(true);

        Profile profile = new Profile(user, state, city);
        user.setProfile(profile);

        User savedUser = userRepository.save(user);
        otpRepository.delete(otp);

        log.info("[AUTH SERVICE] New user registered successfully: {}", email);
        return savedUser;
    }

    /**
     * Login user
     */
    @Transactional(readOnly = true)
    public User login(LoginRequest request) {
        String email = request.getEmail().trim().toLowerCase();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new BadRequestException("Invalid email or password"));

        if (!user.isActive()) {
            throw new BadRequestException("This account has been deactivated. Please contact support.");
        }

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new BadRequestException("Invalid email or password");
        }

        return user;
    }

    /**
     * Initiate password reset
     */
    @Transactional
    public void initiatePasswordReset(ForgotPasswordRequest request) {
        sendOtp(new SendOtpRequest(request.getEmail(), OtpPurpose.PASSWORD_RESET));
    }

    /**
     * Reset password
     */
    @Transactional
    public void resetPassword(ResetPasswordRequest request) {
        String email = request.getEmail().trim().toLowerCase();

        if (!request.getNewPassword().equals(request.getConfirmNewPassword())) {
            throw new BadRequestException("Passwords do not match");
        }

        OTPVerification otp = otpRepository.findTopByEmailIgnoreCaseAndPurposeOrderByCreatedAtDesc(email, OtpPurpose.PASSWORD_RESET)
                .orElseThrow(() -> new BadRequestException("No password reset request found for this email"));

        if (otp.isExpired()) {
            throw new BadRequestException("Password reset OTP has expired. Please request a new one.");
        }

        if (!passwordEncoder.matches(request.getOtp(), otp.getOtpHash())) {
            throw new BadRequestException("Invalid OTP");
        }

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);

        otpRepository.delete(otp);
        log.info("[AUTH SERVICE] Password reset successful for user: {}", email);
    }
}
