package com.vishal.cms.auth;

import com.vishal.cms.auth.dto.*;
import com.vishal.cms.auth.email.EmailSender;
import com.vishal.cms.auth.email.EmailTemplateBuilder;
import com.vishal.cms.auth.verification.EmailVerificationToken;
import com.vishal.cms.auth.verification.EmailVerificationTokenService;
import com.vishal.cms.user.User;
import com.vishal.cms.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.*;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;

    private final EmailSender emailSender;
    private final EmailTemplateBuilder emailTemplateBuilder;
    private final EmailVerificationTokenService tokenService;

    @Value("${application.frontend.url}")
    private String frontendUrl;

    public AuthenticationResponse register(
            RegisterRequest request
    ) {

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new IllegalStateException(
                    "Email already exists"
            );
        }

        if (userRepository.existsByUsername(request.getUsername())) {
            throw new IllegalStateException(
                    "Username already exists"
            );
        }

        User user = User.builder()
                .username(request.getUsername())
                .email(request.getEmail())
                .password(
                        passwordEncoder.encode(
                                request.getPassword()
                        )
                )
                .role(request.getRole())
                .enabled(false)
                .emailVerified(false)
                .build();

        userRepository.save(user);

        EmailVerificationToken verificationToken =
                tokenService.createToken(user);

        String verificationLink =
                frontendUrl
                        + "/verify?token="
                        + verificationToken.getToken();

        emailSender.send(
                user.getEmail(),
                emailTemplateBuilder.buildVerificationEmail(
                        user.getUsername(),
                        verificationLink
                )
        );

        return AuthenticationResponse.builder()
                .userId(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .role(user.getRole().name())
                .build();
    }

    public AuthenticationResponse login(
            AuthenticationRequest request
    ) {

        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );

        User user = userRepository
                .findByEmail(request.getEmail())
                .orElseThrow(() ->
                        new IllegalStateException(
                                "User not found"
                        )
                );

        String accessToken =
                jwtService.generateToken(user);

        String refreshToken =
                jwtService.generateRefreshToken(user);

        return AuthenticationResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .userId(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .role(user.getRole().name())
                .build();
    }

    public AuthenticationResponse refreshToken(
            RefreshTokenRequest request
    ) {

        String refreshToken =
                request.getRefreshToken();

        String email =
                jwtService.extractUsername(refreshToken);

        User user = userRepository
                .findByEmail(email)
                .orElseThrow(() ->
                        new IllegalStateException(
                                "User not found"
                        )
                );

        if (!jwtService.isTokenValid(
                refreshToken,
                user
        )) {

            throw new IllegalStateException(
                    "Invalid refresh token"
            );
        }

        String accessToken =
                jwtService.generateToken(user);

        return AuthenticationResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .userId(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .role(user.getRole().name())
                .build();
    }

    public String verifyEmail(
            String token
    ) {

        EmailVerificationToken verificationToken =
                tokenService.getByToken(token);

        tokenService.verifyToken(token);

        User user = verificationToken.getUser();

        user.setEnabled(true);
        user.setEmailVerified(true);

        userRepository.save(user);

        return "Email verified successfully";
    }

    public void resendVerificationEmail(
            String email
    ) {

        User user = userRepository
                .findByEmail(email)
                .orElseThrow(() ->
                        new IllegalStateException(
                                "User not found"
                        )
                );

        if (user.isEmailVerified()) {
            throw new IllegalStateException(
                    "Email already verified"
            );
        }

        EmailVerificationToken token =
                tokenService.createToken(user);

        String verificationLink =
                frontendUrl
                        + "/verify?token="
                        + token.getToken();

        emailSender.send(
                user.getEmail(),
                emailTemplateBuilder.buildVerificationEmail(
                        user.getUsername(),
                        verificationLink
                )
        );
    }

    public void logout() {

        /*
         * Stateless JWT logout.
         *
         * Client should simply remove:
         *
         * - access token
         * - refresh token
         *
         * If you later add Redis blacklisting,
         * implement it here.
         */
    }
}