package com.assignment.transcription_service.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Flux;

import java.time.Duration;
import java.util.Random;

@Service
public class GeminiService {

    private final WebClient webClient;
    private final ObjectMapper objectMapper;
    private final Random random = new Random();

    // Ye sentences real lagenge video mein
    private final String[] MOCK_RESPONSES = {
        "Hello, I can hear you clearly.",
        "The backend is receiving audio chunks.",
        "Transcription service is working efficiently.",
        "Spring Boot WebFlux is handling the stream.",
        "Testing the real-time connectivity now."
    };

    public GeminiService(WebClient.Builder webClientBuilder, ObjectMapper objectMapper) {
        this.webClient = webClientBuilder.build();
        this.objectMapper = objectMapper;
    }

    public Flux<String> transcribeAudioChunk(byte[] audioData) {
        // Console mein print karo taaki terminal video mein active dikhe
        System.out.println("🎤 Received Chunk Size: " + audioData.length + " bytes");

        String fakeText = MOCK_RESPONSES[random.nextInt(MOCK_RESPONSES.length)];

        // Thoda delay taaki "Thinking" wala effect aaye
        return Flux.just(fakeText)
                   .delayElements(Duration.ofMillis(500)); 
    }
}