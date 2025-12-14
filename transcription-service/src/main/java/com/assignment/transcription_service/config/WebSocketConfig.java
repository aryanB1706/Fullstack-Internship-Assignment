package com.assignment.transcription_service.config; // <-- FIXED

import com.assignment.transcription_service.handler.AudioStreamHandler; // <-- FIXED IMPORT
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.reactive.HandlerMapping;
import org.springframework.web.reactive.handler.SimpleUrlHandlerMapping;
import org.springframework.web.reactive.socket.WebSocketHandler;

import java.util.HashMap;
import java.util.Map;

@Configuration
public class WebSocketConfig {

    private final AudioStreamHandler audioStreamHandler;

    public WebSocketConfig(AudioStreamHandler audioStreamHandler) {
        this.audioStreamHandler = audioStreamHandler;
    }

    @Bean
    public HandlerMapping webSocketHandlerMapping() {
        Map<String, WebSocketHandler> map = new HashMap<>();
        map.put("/live-transcription", audioStreamHandler);

        SimpleUrlHandlerMapping mapping = new SimpleUrlHandlerMapping();
        mapping.setUrlMap(map);
        mapping.setOrder(1);
        return mapping;
    }
}