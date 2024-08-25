import React, { useRef } from 'react';

export default function CajeroAudio() {
  const audioRef = useRef(null);

  const playSound = () => {
    if (audioRef.current) {
      audioRef.current.pause(); // Detener el audio si está en reproducción
      audioRef.current.currentTime = 0; // Reiniciar el tiempo de reproducción
      audioRef.current.play(); // Reproducir el audio
    }
  };

  return (
    <audio ref={audioRef} src="/songs/cajero.mp3" />
  );
}
