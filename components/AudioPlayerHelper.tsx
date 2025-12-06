import React, { useEffect, useRef } from 'react';

interface AudioPlayerHelperProps {
  audioBase64: string | undefined;
  onEnded?: () => void;
}

const AudioPlayerHelper: React.FC<AudioPlayerHelperProps> = ({ audioBase64, onEnded }) => {
  const audioContextRef = useRef<AudioContext | null>(null);
  const sourceRef = useRef<AudioBufferSourceNode | null>(null);

  // Helper to decode base64
  const decodeBase64 = (base64: string) => {
    const binaryString = atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes.buffer;
  };

  useEffect(() => {
    if (!audioBase64) return;

    const playAudio = async () => {
      try {
        if (!audioContextRef.current) {
          audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
        }

        // Clean up previous source
        if (sourceRef.current) {
          sourceRef.current.stop();
          sourceRef.current.disconnect();
        }

        const arrayBuffer = decodeBase64(audioBase64);
        
        // Gemini TTS is raw PCM usually, but the GenAI SDK example implies a specific handling.
        // However, the standard generateContent with Modality.AUDIO usually returns a wav/mp3 container wrapped or raw pcm.
        // The Google GenAI SDK `generateContent` with `gemini-2.5-flash-preview-tts` returns raw PCM @ 24kHz usually.
        // We need to decode it manually as per SDK docs guidelines.
        
        // Let's try the decodeAudioData approach first which works if headers are present, 
        // if it fails we assume raw PCM.
        
        // Note: The GenAI SDK output for TTS is often standard encoded audio in newer versions, 
        // but let's stick to the manual PCM decode for safety if we treat it as raw from the model.
        // Actually, looking at the provided SDK guide, it provides a `decodeAudioData` function for Raw PCM.
        
        const ctx = audioContextRef.current;
        const dataInt16 = new Int16Array(arrayBuffer);
        const numChannels = 1;
        const frameCount = dataInt16.length / numChannels;
        const audioBuffer = ctx.createBuffer(numChannels, frameCount, 24000); // 24kHz is standard for Gemini TTS

        for (let channel = 0; channel < numChannels; channel++) {
          const channelData = audioBuffer.getChannelData(channel);
          for (let i = 0; i < frameCount; i++) {
             // Convert Int16 to Float32
            channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
          }
        }

        const source = ctx.createBufferSource();
        source.buffer = audioBuffer;
        source.connect(ctx.destination);
        source.onended = () => {
          if (onEnded) onEnded();
        };
        source.start(0);
        sourceRef.current = source;

      } catch (e) {
        console.error("Audio playback error:", e);
      }
    };

    playAudio();

    return () => {
      if (sourceRef.current) {
        sourceRef.current.stop();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [audioBase64]);

  return null;
};

export default AudioPlayerHelper;
