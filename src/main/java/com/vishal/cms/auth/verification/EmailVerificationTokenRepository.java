package com.vishal.cms.auth.verification;

import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface EmailVerificationTokenRepository extends JpaRepository<EmailVerificationToken, Long> {
    Optional<EmailVerificationToken> findByToken(String token);

    boolean existsByToken(String token);

    List<EmailVerificationToken> findByExpiresAtBefore(LocalDateTime dateTime);
}
