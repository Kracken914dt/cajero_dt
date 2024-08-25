import React, { useRef } from 'react';

export default function CajeroAudio() {
  const audioRef = useRef(null);

  const playSound = () => {
    if (audioRef.current) {
      audioRef.current.pause(); 
      audioRef.current.currentTime = 0; 
      audioRef.current.play(); 
    }
  };

  return (
    <audio ref={audioRef} src="/songs/cajero.mp3" />
  );
}
