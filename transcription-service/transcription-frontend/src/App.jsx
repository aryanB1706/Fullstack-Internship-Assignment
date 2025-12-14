import { useState, useRef, useEffect } from 'react';

const App = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [transcription, setTranscription] = useState("");
  const socketRef = useRef(null);
  const mediaRecorderRef = useRef(null);

  useEffect(() => {
    return () => {
      // Cleanup: Component band hone par socket close karo
      if (socketRef.current) {
        socketRef.current.close();
      }
    };
  }, []);

  const startRecording = async () => {
    try {
      // 1. WebSocket Connection banao
      const socket = new WebSocket("ws://localhost:8080/live-transcription");
      socketRef.current = socket;

      socket.onopen = () => {
        console.log("✅ Connected to Backend");
        setIsRecording(true);
        // Mic start karo connection banne ke baad
        startMediaRecorder();
      };

      socket.onmessage = (event) => {
        console.log("📩 Received:", event.data);
        // Purana text + Naya text add karo
        setTranscription((prev) => prev + " " + event.data);
      };

      socket.onerror = (error) => {
        console.error("❌ Socket Error:", error);
        alert("Backend connect nahi hua! Server check karo.");
      };

    } catch (err) {
      console.error("Error starting:", err);
    }
  };

  const startMediaRecorder = async () => {
    // 2. Mic Access maango
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    
    // Browser 'webm' format mein record karta hai
    const mediaRecorder = new MediaRecorder(stream, { mimeType: 'audio/webm' });
    mediaRecorderRef.current = mediaRecorder;

    mediaRecorder.ondataavailable = (event) => {
      // 3. Audio Chunk -> Backend bhejo
      if (event.data.size > 0 && socketRef.current?.readyState === WebSocket.OPEN) {
        socketRef.current.send(event.data);
      }
    };

    // Har 1 second (1000ms) mein chunk bhejo
    mediaRecorder.start(1000);
  };

  const stopRecording = () => {
    // Stop Mic & Socket
    if (mediaRecorderRef.current) mediaRecorderRef.current.stop();
    if (socketRef.current) socketRef.current.close();
    setIsRecording(false);
  };

  return (
    <div style={{ padding: "50px", fontFamily: "Arial", textAlign: "center" }}>
      <h1>🎙️ Real-Time Transcription</h1>
      
      <div style={{ margin: "20px" }}>
        {!isRecording ? (
          <button 
            onClick={startRecording} 
            style={{ padding: "10px 20px", fontSize: "18px", backgroundColor: "#28a745", color: "white", border: "none", borderRadius: "5px", cursor: "pointer" }}>
            Start Recording
          </button>
        ) : (
          <button 
            onClick={stopRecording} 
            style={{ padding: "10px 20px", fontSize: "18px", backgroundColor: "#dc3545", color: "white", border: "none", borderRadius: "5px", cursor: "pointer" }}>
            Stop Recording
          </button>
        )}
      </div>

      <div style={{ 
        marginTop: "30px", 
        border: "1px solid #ccc", 
        padding: "20px", 
        minHeight: "100px", 
        textAlign: "left", 
        backgroundColor: "#f9f9f9" 
      }}>
        <strong>Transcript:</strong>
        <p>{transcription || "Speak something..."}</p>
      </div>
    </div>
  );
};

export default App;