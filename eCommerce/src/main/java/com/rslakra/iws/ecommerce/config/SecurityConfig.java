package com.rslakra.iws.ecommerce.config;

import org.springframework.boot.autoconfigure.security.servlet.PathRequest;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;

/**
 * Security configuration for the e-commerce application.
 *
 * @author Rohtash Lakra
 */
@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .authorizeHttpRequests(authorize -> authorize
                // Allow H2 console access
                .requestMatchers(PathRequest.toH2Console()).permitAll()
                // Allow static resources
                .requestMatchers("/css/**", "/js/**", "/images/**", "/webjars/**").permitAll()
                // Allow public pages
                .requestMatchers("/", "/index", "/home", "/auth/login").permitAll()
                // Allow REST API endpoints (you may want to secure these in production)
                .requestMatchers("/rest/**").permitAll()
                // All other requests require authentication
                .anyRequest().authenticated()
            )
            // Enable form login
            .formLogin(form -> form
                .loginPage("/auth/login")
                .defaultSuccessUrl("/home", true)
                .permitAll()
            )
            // Enable logout
            .logout(logout -> logout
                .logoutSuccessUrl("/")
                .permitAll()
            )
            // Disable CSRF for H2 console (it doesn't support CSRF tokens)
            .csrf(csrf -> csrf
                .ignoringRequestMatchers(PathRequest.toH2Console())
            )
            // Allow frames from same origin for H2 console (it uses iframes)
            .headers(headers -> headers
                .frameOptions(frame -> frame.sameOrigin())
            );

        return http.build();
    }
}

