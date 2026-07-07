package com.vishal.cms.user.dto;

import com.vishal.cms.user.Role;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserRequest {

    @NotBlank(message = "Username is required")
    private String username;

    @Email(message = "Invalid email")
    @NotBlank(message = "Email is required")
    private String email;
    
    private String password;

    @NotNull(message = "Role is required")
    private Role role;

    private Boolean enabled;

    private Boolean accountLocked;
}