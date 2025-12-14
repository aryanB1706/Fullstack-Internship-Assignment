package com.assignment.transcription_service;

import com.fasterxml.jackson.databind.ObjectMapper; // ✅ New Import
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.web.reactive.function.client.WebClient;

@SpringBootApplication
public class TranscriptionServiceApplication {

	public static void main(String[] args) {
		SpringApplication.run(TranscriptionServiceApplication.class, args);
	}

	// 1. Ye WebClient ke liye (Jo pehle add kiya tha)
	@Bean
	public WebClient.Builder webClientBuilder() {
		return WebClient.builder();
	}

	// 2. ✅ YE NYA CODE HAI: ObjectMapper error fix karne ke liye
	@Bean
	public ObjectMapper objectMapper() {
		return new ObjectMapper();
	}

}