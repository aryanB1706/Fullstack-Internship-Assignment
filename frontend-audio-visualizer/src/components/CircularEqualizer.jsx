import { useRef, useState } from "react";

export default function CircularEqualizer() {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);

  const [started, setStarted] = useState(false);

  const startAudio = async () => {
    setStarted(true);

    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

    const audioContext = new AudioContext();
    const source = audioContext.createMediaStreamSource(stream);

    const analyser = audioContext.createAnalyser();
    analyser.fftSize = 256;

    source.connect(analyser);

    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const draw = () => {
      animationRef.current = requestAnimationFrame(draw);

      analyser.getByteFrequencyData(dataArray);
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const cx = canvas.width / 2;
      const cy = canvas.height / 2;
      const radius = Math.min(cx, cy) - 40;
      const bars = bufferLength;
      const step = (Math.PI * 2) / bars;

      for (let i = 0; i < bars; i++) {
        const value = dataArray[i];
        const barHeight = value * 0.7;
        const angle = i * step;

        const x1 = cx + Math.cos(angle) * radius;
        const y1 = cy + Math.sin(angle) * radius;
        const x2 = cx + Math.cos(angle) * (radius + barHeight);
        const y2 = cy + Math.sin(angle) * (radius + barHeight);

        ctx.strokeStyle = `hsl(${i * 360 / bars}, 100%, 60%)`;
        ctx.lineWidth = 2;

        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
      }
    };

    draw();
  };

  return (
    <div className="w-full max-w-xl p-6 text-center">
      <h1 className="text-2xl font-semibold mb-4">
        Circular Audio Equalizer
      </h1>

      {!started && (
        <button
          onClick={startAudio}
          className="px-6 py-2 mb-6 rounded-full bg-blue-500 hover:bg-blue-600 transition"
        >
          Start Microphone
        </button>
      )}

      <canvas
        ref={canvasRef}
        className="w-full h-72 rounded-lg bg-black/30"
      />

      <p className="text-sm mt-4 opacity-70">
        Speak or play music to see real-time frequency response
      </p>
    </div>
  );
}
