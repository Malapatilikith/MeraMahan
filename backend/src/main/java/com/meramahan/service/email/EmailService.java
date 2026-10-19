package com.meramahan.service.email;

import com.meramahan.entity.OtpPurpose;

public interface EmailService {
    void sendOtpEmail(String toEmail, String otpCode, OtpPurpose purpose);
}
