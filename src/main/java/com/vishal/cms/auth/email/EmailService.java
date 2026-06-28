package com.vishal.cms.auth.email;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import lombok.extern.slf4j.Slf4j;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailService implements EmailSender {

    private final JavaMailSender mailSender;

    @Value("${application.mail.from}")
    private String from;

    @Override
    @Async
    public void send(
            String to,
            String email
    ) {

        try {

            MimeMessage mimeMessage =
                    mailSender.createMimeMessage();

            MimeMessageHelper helper =
                    new MimeMessageHelper(
                            mimeMessage,
                            "UTF-8"
                    );

            helper.setText(email, true);
            helper.setTo(to);
            helper.setSubject("CMS Email Verification");
            helper.setFrom(from);

            mailSender.send(mimeMessage);

            log.info(
                    "Verification email sent to {}",
                    to
            );

        } catch (MessagingException ex) {

            log.error(
                    "Failed to send email to {}",
                    to,
                    ex
            );

            throw new IllegalStateException(
                    "Failed to send email"
            );
        }
    }
}