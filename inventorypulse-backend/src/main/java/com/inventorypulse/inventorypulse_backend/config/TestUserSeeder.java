package com.inventorypulse.inventorypulse_backend.config;

import com.inventorypulse.inventorypulse_backend.model.User;
import com.inventorypulse.inventorypulse_backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;


@Configuration
@RequiredArgsConstructor
public class TestUserSeeder {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Bean
    public CommandLineRunner createTestUser() {
        return args -> {
            String email = "admin@example.com";

            if (!userRepository.existsByEmail(email)) {
                User user = User.builder()
                        .email(email)
                        .username("admin")
                        .passwordHash(passwordEncoder.encode("changeme123"))
                        .role(User.Role.ADMIN)
                        .build();

                userRepository.save(user);
                System.out.println("Seeded test admin user: " + email);
            }
        };
    }
}
