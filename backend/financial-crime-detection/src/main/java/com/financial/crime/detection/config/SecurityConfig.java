package com.financial.crime.detection.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {

        http
            // disable CSRF (important for APIs)
            .csrf(csrf -> csrf.disable())

            // allow requests
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/auth/**", "/transactions/**", "/alerts/**").permitAll()
                .anyRequest().authenticated()
            );

        return http.build();
    }
}