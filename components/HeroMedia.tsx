'use client';

import { useEffect, useRef, useState } from 'react';

const VIDEO_SRC = '/videos/hero-loop.mp4';
const POSTER_SRC = '/videos/hero-poster.jpg';

// Looping hero video in a rounded card. The server-rendered phone mockup
// (children) shows first and stays as the fallback if the files are missing.
// Visitors who prefer reduced motion get the still poster instead of video.
export function HeroMedia({ children }: { children: React.ReactNode }) {
  const [reduce, setReduce] = useState<boolean | null>(null);
  const [failed, setFailed] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduce(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setReduce(e.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = true;
    v.play().catch(() => {});
  }, [reduce, failed]);

  if (failed || reduce === null) return <>{children}</>;

  return (
    <div className="hx-media">
      {reduce ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={POSTER_SRC} alt="" aria-hidden="true" onError={() => setFailed(true)} />
      ) : (
        <video
          ref={videoRef}
          src={VIDEO_SRC}
          poster={POSTER_SRC}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          aria-hidden="true"
          tabIndex={-1}
          onError={() => setFailed(true)}
        />
      )}
    </div>
  );
}
