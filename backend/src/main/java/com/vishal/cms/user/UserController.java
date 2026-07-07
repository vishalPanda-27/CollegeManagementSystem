package com.vishal.cms.user;

import com.vishal.cms.user.dto.UserRequest;
import com.vishal.cms.user.dto.UserResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @PostMapping
    public UserResponse createUser(
            @Valid @RequestBody UserRequest request
    ) {
        return userService.createUser(request);
    }

    @GetMapping
    public List<UserResponse> getAllUsers() {
        return userService.getAllUsers();
    }

    @GetMapping("/{id}")
    public UserResponse getUserById(
            @PathVariable Long id
    ) {
        return userService.getUserById(id);
    }

    @GetMapping("/role/{role}")
    public List<UserResponse> getUsersByRole(@PathVariable Role role) {
        return userService.getUsersByRole(role);
    }

    @GetMapping("/enabled")
    public List<UserResponse> getEnabledUsers() {
        return userService.getEnabledUsers(true);
    }

    @GetMapping("/disabled")
    public List<UserResponse> getDisabledUsers() {
        return userService.getEnabledUsers(false);
    }

    @GetMapping("/strength")
    public long getStrengthUsers() {
        return userService.getTotalUsers();
    }


    @GetMapping("role/{role}/strength")
    public long getStrengthUsersByRole(@PathVariable Role role) {
        return userService.getTotalUsersByRole(role);
    }

    @GetMapping("/enabled/strength")
    public long getEnabledStrengthUsers() {
        return userService.getTotalEnabledUsers();
    }

    @PatchMapping("/{id}/enable")
    public UserResponse enableUser(@PathVariable Long id){
        return userService.enableUser(id);
    }

    @PatchMapping("/{id}/disable")
    public UserResponse disableUser(@PathVariable Long id){
        return userService.disableUser(id);
    }

    @PatchMapping("/{id}/lock")
    public UserResponse lockUser(@PathVariable Long id){
        return userService.lockUser(id);
    }

    @PatchMapping("/{id}/unlock")
    public UserResponse unlockUser(@PathVariable Long id){
        return userService.unlockUser(id);
    }


    @PutMapping("/{id}")
    public UserResponse updateUser(
            @PathVariable Long id,
            @Valid @RequestBody UserRequest request
    ) {
        return userService.updateUser(id, request);
    }

    @DeleteMapping("/{id}")
    public void deleteUser(
            @PathVariable Long id
    ) {
        userService.deleteUser(id);
    }
}