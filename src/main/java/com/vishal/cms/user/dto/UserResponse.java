package com.vishal.cms.user.dto;

import com.vishal.cms.user.Role;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserResponse {

    private Long id;

    private String username;

    private String email;

    private Role role;

    private boolean enabled;

    private boolean accountLocked;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;
}