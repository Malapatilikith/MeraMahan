
package com.meramahan.service.email;

import com.meramahan.entity.OtpPurpose;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClientResponseException;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.Map;

@Service
public class SmtpEmailService implements EmailService {

    private static final Logger log =
            LoggerFactory.getLogger(SmtpEmailService.class);

    private final String resendApiKey;
    private final RestTemplate restTemplate = new RestTemplate();

    public SmtpEmailService(
            @Value("${RESEND_API_KEY:}") String resendApiKey) {
        this.resendApiKey = resendApiKey;
    }

    @Override
    public void sendOtpEmail(
            String toEmail, String otpCode, OtpPurpose purpose) {

        if (resendApiKey == null || resendApiKey.isBlank()) {
            throw new IllegalStateException("Email service is not configured.");
        }

        String subject = purpose == OtpPurpose.REGISTRATION
                ? "MeraMahan Registration Verification Code"
                : "MeraMahan Password Reset Code";

        String text = "Namaste,\n\n"
                + "Your MeraMahan verification code is: " + otpCode + "\n\n"
                + "This code is valid for 5 minutes. "
                + "Please do not share it with anyone.\n\n"
                + "Your Voice. Your Community. Your India.\n"
                + "MeraMahan Team";

        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(resendApiKey);
        headers.setContentType(MediaType.APPLICATION_JSON);

        Map<String, Object> body = Map.of(
                "from", "MeraMahan <onboarding@resend.dev>",
                "to", List.of(toEmail),
                "subject", subject,
                "text", text
        );

        try {
            HttpEntity<Map<String, Object>> request =
                    new HttpEntity<>(body, headers);

            restTemplate.postForEntity(
                    "https://api.resend.com/emails",
                    request,
                    String.class
            );

            log.info("OTP email accepted by Resend for {}", toEmail);

        } catch (RestClientResponseException e) {
            log.error("Resend rejected the email request. HTTP status: {}",
                    e.getStatusCode());
            throw new IllegalStateException(
                    "Unable to send verification email. Please try again.");
        } catch (Exception e) {
            log.error("Unable to send OTP email: {}", e.getMessage());
            throw new IllegalStateException(
                    "Unable to send verification email. Please try again.");
        }
    }
}
