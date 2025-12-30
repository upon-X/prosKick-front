"use client";

import { useEffect, useRef } from "react";

export const Banner = () => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = 0.75; // 🐢 Más lento
    }
  }, []);
  return (
    <>
      <video
        ref={videoRef}
        autoPlay
        muted
        loop
        playsInline
        className="absolute top-0 left-0 w-full h-full object-cover z-0"
      >
        <source src="/IntroVideo.mp4" type="video/mp4" />
      </video>

      {/* Overlay oscuro */}
      <div className="absolute top-0 left-0 w-full h-full bg-black/60 z-10" />
    </>
  );
};
