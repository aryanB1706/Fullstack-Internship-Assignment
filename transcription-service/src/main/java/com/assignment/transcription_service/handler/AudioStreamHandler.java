package com.assignment.transcription_service.handler; // ✅ Package Fixed

import com.assignment.transcription_service.service.GeminiService; // ✅ Import Fixed (underscore added)
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.socket.WebSocketHandler;
import org.springframework.web.reactive.socket.WebSocketMessage;
import org.springframework.web.reactive.socket.WebSocketSession;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@Component
public class AudioStreamHandler implements WebSocketHandler {

    private final GeminiService geminiService;

    public AudioStreamHandler(GeminiService geminiService) {
        this.geminiService = geminiService;
    }

    @Override
    @NonNull
    public Mono<Void> handle(WebSocketSession session) {
        Flux<WebSocketMessage> input = session.receive();

        Flux<String> transcriptionStream = input
                .filter(message -> message.getType() == WebSocketMessage.Type.BINARY)
                .flatMap(message -> {
                    // ✅ Logic Fixed: Removed (Object) cast
                    byte[] audioBytes = new byte[message.getPayload().readableByteCount()];
                    message.getPayload().read(audioBytes);
                    
                    return geminiService.transcribeAudioChunk(audioBytes);
                });

        return session.send(
                transcriptionStream.map(session::textMessage)
        );
    }
}