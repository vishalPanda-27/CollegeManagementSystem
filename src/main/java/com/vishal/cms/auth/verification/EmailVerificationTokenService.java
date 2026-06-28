package com.vishal.cms.auth.verification;

import com.vishal.cms.user.User;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
public class EmailVerificationTokenService {

    private final EmailVerificationTokenRepository repository;

    public EmailVerificationToken createToken(User user) {

        EmailVerificationToken token =
                EmailVerificationToken.builder()
                        .token(UUID.randomUUID().toString())
                        .createdAt(LocalDateTime.now())
                        .expiresAt(LocalDateTime.now().plusMinutes(15))
                        .user(user)
                        .build();

        return repository.save(token);
    }

    @Transactional(readOnly = true)
    public EmailVerificationToken getByToken(String token) {

        return repository.findByToken(token)
                .orElseThrow(() ->
                        new IllegalStateException(
                                "Verification token not found"
                        )
                );
    }

    public void verifyToken(String tokenValue) {

        EmailVerificationToken token =
                getByToken(tokenValue);

        if (token.isUsed()) {
            throw new IllegalStateException(
                    "Token already used"
            );
        }

        if (token.getVerifiedAt() != null) {
            throw new IllegalStateException(
                    "Email already verified"
            );
        }

        if (token.getExpiresAt().isBefore(LocalDateTime.now())) {
            throw new IllegalStateException(
                    "Verification token expired"
            );
        }

        token.setVerifiedAt(LocalDateTime.now());
        token.setUsed(true);

        repository.save(token);
    }

    public void deleteExpiredTokens() {

        repository.deleteAll(
                repository.findByExpiresAtBefore(
                        LocalDateTime.now()
                )
        );
    }
}