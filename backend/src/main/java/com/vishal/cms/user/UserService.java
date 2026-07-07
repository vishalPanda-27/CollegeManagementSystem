package com.vishal.cms.user;

import com.vishal.cms.user.dto.UserRequest;
import com.vishal.cms.user.dto.UserResponse;
import com.vishal.cms.exceptions.UserNotFoundException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.function.Consumer;

@Service
@Transactional
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final UserMapper userMapper;
    private final PasswordEncoder passwordEncoder;

    public UserResponse createUser(
            UserRequest request
    ) {

        User user = userMapper.toEntity(request);

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException(
                    "Email already exists"
            );
        }

        if (userRepository.existsByUsername(request.getUsername())) {
            throw new IllegalArgumentException(
                    "Username already exists"
            );
        }
        if (request.getPassword() == null ||
                request.getPassword().isBlank()) {

            throw new IllegalArgumentException(
                    "Password is required"
            );
        }
        user.setPassword(
                passwordEncoder.encode(
                        request.getPassword()
                )
        );

        return userMapper.toResponse(
                userRepository.save(user)
        );
    }

    public List<UserResponse> getAllUsers() {

        return userRepository.findAll()
                .stream()
                .map(userMapper::toResponse)
                .toList();
    }

    public UserResponse getUserById(Long id) {

        User user = userRepository.findById(id)
                .orElseThrow(() ->
                        new UserNotFoundException(
                                "User not found with id: " + id
                        )
                );

        return userMapper.toResponse(user);
    }

    public UserResponse updateUser(
            Long id,
            UserRequest request
    ) {

        User user = userRepository.findById(id)
                .orElseThrow(() ->
                        new UserNotFoundException(
                                "User not found with id: " + id
                        )
                );
        User existingEmail =
                userRepository.findByEmail(
                        request.getEmail()
                ).orElse(null);

        if (existingEmail != null &&
                !existingEmail.getId().equals(id)) {

            throw new IllegalArgumentException(
                    "Email already exists"
            );
        }

        User existingUsername =
                userRepository.findByUsername(
                        request.getUsername()
                ).orElse(null);

        if (existingUsername != null &&
                !existingUsername.getId().equals(id)) {

            throw new IllegalArgumentException(
                    "Username already exists"
            );
        }

        if (request.getPassword() != null &&
                !request.getPassword().isBlank()) {

            user.setPassword(
                    passwordEncoder.encode(
                            request.getPassword()
                    )
            );
        }

        userMapper.updateEntity(user, request);

        return userMapper.toResponse(
                userRepository.save(user)
        );
    }

    public void deleteUser(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() ->
                        new UserNotFoundException(
                                "User not found with id: " + id
                        )
                );

        userRepository.delete(user);
    }

    public List<UserResponse> getEnabledUsers(boolean enabled) {
        return userRepository.findByEnabled(enabled)
                .stream()
                .map(userMapper::toResponse)
                .toList();
    }

    public List<UserResponse> getUsersByRole(Role role) {
        return userRepository.findByRole(role)
                .stream()
                .map(userMapper::toResponse)
                .toList();
    }

    public long getTotalUsers() {
        return userRepository.count();
    }

    public long getTotalUsersByRole(Role role) {
        return userRepository.countByRole(role);
    }

    public long getTotalEnabledUsers() {
        return userRepository.countByEnabled(true);
    }


    public UserResponse enableUser(Long id) {
        return updateStatus(id, user -> user.setEnabled(true));
    }

    public UserResponse disableUser(Long id) {
        return updateStatus(id, user -> user.setEnabled(false));
    }

    public UserResponse lockUser(Long id) {
        return updateStatus(id, user -> user.setAccountLocked(true));
    }

    public UserResponse unlockUser(Long id) {
        return updateStatus(id, user -> user.setAccountLocked(false));
    }
    private UserResponse updateStatus(
            Long id,
            Consumer<User> updater
    ) {
        User user = userRepository.findById(id).orElseThrow(
                ()-> new UserNotFoundException("User does not exist with id : "+id)
        );

        updater.accept(user);

        return userMapper.toResponse(
                userRepository.save(user)
        );
    }
}