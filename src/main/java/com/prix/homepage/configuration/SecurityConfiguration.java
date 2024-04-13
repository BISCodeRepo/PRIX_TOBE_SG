package com.prix.homepage.configuration;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

/**
 * 비밀번호 암호화용 security 설정, 필요 없을 수도?
 */
@Configuration
@EnableWebSecurity
public class SecurityConfiguration {

	// 기본 설정
	@Bean
	public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
		http
				.authorizeHttpRequests((requests) -> requests
						.anyRequest().permitAll())
				.formLogin((form) -> form
						.disable())
				.logout((logout) -> logout.permitAll());

		return http.build();
	}

	// password encoding 용 brypt password encoder
	@Bean
	public PasswordEncoder passwordEncoder() {
		return new BCryptPasswordEncoder();
	}

}