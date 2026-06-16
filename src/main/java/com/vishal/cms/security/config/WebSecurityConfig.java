package com.vishal.cms.security.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class WebSecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http)
            throws Exception {

        http
                // Disable CSRF protection.
                // Useful for REST APIs and testing with Postman.
                // For browser-based forms, CSRF is usually kept enabled.
                .csrf(csrf -> csrf.disable())
                // Define authorization rules for incoming requests
                .authorizeHttpRequests(auth -> auth
                        // Allow anyone (authenticated or not)
                        // to access registration endpoints
                        .anyRequest()
                        .permitAll()
                        // Any other endpoint requires authentication
                );
                // Enable Spring Security's default login page
                // Visiting a protected endpoint redirects to /login
        // Build and return the security configuration
        return http.build();
    }
}
