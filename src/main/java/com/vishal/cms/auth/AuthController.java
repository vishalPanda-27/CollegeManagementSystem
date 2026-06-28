package com.vishal.cms.auth;

import com.vishal.cms.auth.dto.AuthenticationRequest;
import com.vishal.cms.auth.dto.AuthenticationResponse;
import com.vishal.cms.auth.dto.RefreshTokenRequest;
import com.vishal.cms.auth.dto.RegisterRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<AuthenticationResponse> register(
            @Valid @RequestBody RegisterRequest request
    ) {

        return ResponseEntity.ok(
                authService.register(request)
        );
    }

    @PostMapping("/login")
    public ResponseEntity<AuthenticationResponse> login(
            @Valid @RequestBody AuthenticationRequest request
    ) {

        return ResponseEntity.ok(
                authService.login(request)
        );
    }

    @PostMapping("/refresh")
    public ResponseEntity<AuthenticationResponse> refreshToken(
            @Valid @RequestBody RefreshTokenRequest request
    ) {

        return ResponseEntity.ok(
                authService.refreshToken(request)
        );
    }

    @GetMapping("/verify")
    public ResponseEntity<String> verifyEmail(
            @RequestParam String token
    ) {

        return ResponseEntity.ok(
                authService.verifyEmail(token)
        );
    }

    @PostMapping("/resend-verification")
    public ResponseEntity<String> resendVerification(
            @RequestParam String email
    ) {

        authService.resendVerificationEmail(email);

        return ResponseEntity.ok(
                "Verification email sent successfully"
        );
    }

    @PostMapping("/logout")
    public ResponseEntity<String> logout() {

        authService.logout();

        return ResponseEntity.ok(
                "Logged out successfully"
        );
    }
}