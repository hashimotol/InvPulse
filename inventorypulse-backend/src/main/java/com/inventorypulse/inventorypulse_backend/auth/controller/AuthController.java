package com.inventorypulse.inventorypulse_backend.auth.controller;
import com.inventorypulse.inventorypulse_backend.auth.JwtTokenProvider;
import com.inventorypulse.inventorypulse_backend.auth.dtos.LoginResponse;
import com.inventorypulse.inventorypulse_backend.auth.dtos.RegisterRequest;
import com.inventorypulse.inventorypulse_backend.model.User;
import com.inventorypulse.inventorypulse_backend.repository.UserRepository;
import com.inventorypulse.inventorypulse_backend.auth.dtos.LoginRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider jwtTokenProvider;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @PostMapping("/register")
    public ResponseEntity<LoginResponse> register(@Validated @RequestBody RegisterRequest request) {

        // 1. Check if email is already taken
        if (userRepository.existsByEmail(request.email())) {
            return ResponseEntity.badRequest().build(); // later: return proper error DTO
        }

        // 2. Create new user entity
        User user = User.builder()
                .email(request.email())
                .username(request.username())
                .passwordHash(passwordEncoder.encode(request.password()))
                .role(User.Role.MANAGER) 
                .build();

        userRepository.save(user);

      
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.email(),
                        request.password()
                )
        );

        String token = jwtTokenProvider.generateToken(authentication);

        return ResponseEntity.ok(
                new LoginResponse(token, "Bearer", 0L) 
        );
    }



    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@Validated @RequestBody LoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.email(),
                        request.password()
                )
        );

        String token = jwtTokenProvider.generateToken(authentication);

        return ResponseEntity.ok(
                new LoginResponse(token, "Bearer", 0L)
        );
    }

    @PostMapping("/logout")
    public ResponseEntity<Void> logout() {
        return ResponseEntity.noContent().build();
    }



}
