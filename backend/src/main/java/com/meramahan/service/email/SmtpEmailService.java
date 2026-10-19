package com.meramahan.service.email;

import com.meramahan.entity.OtpPurpose;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class SmtpEmailService implements EmailService {

    private static final Logger log = LoggerFactory.getLogger(SmtpEmailService.class);

    private final JavaMailSender mailSender;
    private final String fromEmail;

    @Autowired
    public SmtpEmailService(
            @Autowired(required = false) JavaMailSender mailSender,
            @Value("${spring.mail.username:noreply@meramahan.in}") String fromEmail) {
        this.mailSender = mailSender;
        this.fromEmail = fromEmail;
    }

    @Override
    public void sendOtpEmail(String toEmail, String otpCode, OtpPurpose purpose) {
        String subject = (purpose == OtpPurpose.REGISTRATION)
                ? "MeraMahan Registration Verification Code"
                : "MeraMahan Password Reset Code";

        String text = String.format(
                "Namaste,\n\n" +
                "Your one-time verification code for MeraMahan is: %s\n\n" +
                "This code is valid for 5 minutes. Please do not share this OTP with anyone.\n\n" +
                "Your Voice. Your Community. Your India.\n" +
                "MeraMahan Team",
                otpCode
        );

        if (mailSender != null) {
            try {
                SimpleMailMessage message = new SimpleMailMessage();
                message.setFrom(fromEmail);
                message.setTo(toEmail);
                message.setSubject(subject);
                message.setText(text);
                mailSender.send(message);
                log.info("[EMAIL SERVICE] Dispatched OTP email to {}", toEmail);
                return;
            } catch (Exception e) {
                log.warn("[EMAIL SERVICE] SMTP delivery failed ({}), falling back to console log", e.getMessage());
            }
        }

        // Development/Console fallback
        log.info("[EMAIL SERVICE - CONSOLE] To: {}, Subject: '{}', OTP: [{}]", toEmail, subject, otpCode);
    }
}
