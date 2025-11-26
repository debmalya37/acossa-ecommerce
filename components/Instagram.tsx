"use client";

import React, { useRef, useState } from "react";
import { Play, Pause, Volume2, Volume, Instagram } from "lucide-react";

// --- DATA ---
const instagramVideos = [
  {
    id: 1,
    // FIXED: Replaced failing Google Drive link with a working placeholder.
    // Google Drive links often return HTML pages (virus scan warnings) instead of video streams, causing "NotSupportedError".
    // For your own video: Download it, put it in 'public/assets/videos/', and use src: "/assets/videos/your-video.mp4"
    src: "https://assets.mixkit.co/videos/preview/mixkit-fashion-model-posing-in-neon-lights-39794-large.mp4",
    poster: "https://images.unsplash.com/photo-1583391733958-e047f0e69817?q=80&w=600&auto=format&fit=crop",
    alt: "Spotted in Acosaa"
  },
  {
    id: 2,
    src: "https://assets.mixkit.co/videos/preview/mixkit-woman-in-a-floral-dress-walking-in-a-garden-4740-large.mp4",
    poster: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=600&auto=format&fit=crop",
    alt: "Bridal Collection"
  },
  {
    id: 3,
    src: "https://assets.mixkit.co/videos/preview/mixkit-young-woman-in-traditional-indian-dress-41369-large.mp4",
    poster: "https://images.unsplash.com/photo-1594595287018-05d82055cb52?q=80&w=600&auto=format&fit=crop",
    alt: "Festive Vibes"
  },
  {
    id: 4,
    src: "https://assets.mixkit.co/videos/preview/mixkit-girl-adjusting-her-hair-in-the-wind-41405-large.mp4",
    poster: "https://images.unsplash.com/photo-1631233859262-132d75f9227d?q=80&w=600&auto=format&fit=crop",
    alt: "New Arrivals"
  }
];

// --- SUB-COMPONENT: DECORATIVE DIVIDER ---
const OrnateDivider = ({ className }: { className?: string }) => (
  <div className={`flex items-center justify-center my-6 ${className || ""}`}>
    <svg
      width="160"
      height="24"
      viewBox="0 0 160 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="opacity-90"
    >
      <path
        d="M10 12C22 2 40 2 52 12C64 22 82 22 94 12C106 2 124 2 136 12"
        stroke="#7a1b12" // Rose-900 color
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <g transform="translate(72 0)">
        <circle cx="8" cy="8" r="6" fill="#7a1b12" opacity="0.95" />
      </g>
    </svg>
  </div>
);

// --- MAIN COMPONENT ---
const InstagramFeed = () => {
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  
  // Track state for UI icons
  const [videoStates, setVideoStates] = useState<{ [key: number]: { isPlaying: boolean; isMuted: boolean } }>({});

  const toggleVideo = (idx: number) => {
    const video = videoRefs.current[idx];
    if (!video) return;

    // Initialize state if undefined (default is playing + muted because of autoPlay)
    const currentState = videoStates[idx] || { isPlaying: !video.paused, isMuted: video.muted };

    if (video.paused) {
      // Case 1: Video is paused -> Play it + Unmute
      video.play();
      video.muted = false;
      setVideoStates(prev => ({ ...prev, [idx]: { isPlaying: true, isMuted: false } }));
    } else {
      // Video is playing
      if (video.muted) {
        // Case 2: Video is playing but muted (AutoPlay state) -> Unmute
        video.muted = false;
        setVideoStates(prev => ({ ...prev, [idx]: { isPlaying: true, isMuted: false } }));
      } else {
        // Case 3: Video is playing and unmuted -> Pause
        video.pause();
        setVideoStates(prev => ({ ...prev, [idx]: { isPlaying: false, isMuted: false } }));
      }
    }
  };

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* HEADER */}
        <div className="text-center mb-10">
          <h2 className="text-3xl lg:text-4xl text-rose-900 font-serif">
            Follow us on Instagram
          </h2>
          <OrnateDivider />
        </div>

        {/* VIDEO GRID */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {instagramVideos.map((video, idx) => {
             const state = videoStates[idx] || { isPlaying: true, isMuted: true }; // Default assumptions for autoplay

             return (
              <div 
                key={video.id} 
                onClick={() => toggleVideo(idx)}
                className="group relative aspect-[9/16] rounded-lg overflow-hidden shadow-md cursor-pointer bg-gray-100"
              >
                {/* VIDEO ELEMENT */}
                <video
                  ref={(el) => { if (el) videoRefs.current[idx] = el; }}
                  src={video.src}
                  poster={video.poster}
                  loop
                  muted
                  playsInline
                  autoPlay
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  onError={(e: any) => e.target.style.display = 'none'} // Fallback to poster on error
                />

                {/* FALLBACK POSTER */}
                <img 
                   src={video.poster} 
                   alt={video.alt}
                   className="absolute inset-0 w-full h-full object-cover -z-10"
                />

                {/* ICON OVERLAY (Top Right) */}
                <div className="absolute top-3 right-3 text-white/90 drop-shadow-md z-10 p-2 bg-black/20 rounded-full backdrop-blur-sm transition-all hover:bg-black/40">
                   {state.isPlaying ? (
                     state.isMuted ? <Volume size={18} /> : <Volume2 size={18} />
                   ) : (
                     <Play size={18} fill="currentColor" />
                   )}
                </div>
                
                {/* CENTER PLAY ICON (Only shows when paused) */}
                {!state.isPlaying && (
                  <div className="absolute inset-0 flex items-center justify-center z-10 bg-black/10">
                    <div className="w-12 h-12 flex items-center justify-center bg-white/20 backdrop-blur-md rounded-full text-white">
                      <Play size={24} fill="currentColor" />
                    </div>
                  </div>
                )}

                {/* BOTTOM GRADIENT & TAG */}
                <div className="absolute bottom-0 inset-x-0 p-4 bg-gradient-to-t from-black/60 to-transparent z-10">
                  <div className="flex items-center gap-2 text-white">
                    <Instagram size={16} />
                    <span className="text-sm font-medium tracking-wide">#Spotted</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        
        {/* CTA BUTTON */}
        <div className="text-center mt-8">
          <button className="px-8 py-3 bg-rose-900 text-white rounded-full hover:bg-rose-800 transition shadow-lg font-medium text-sm tracking-wide">
            VIEW MORE ON INSTAGRAM
          </button>
        </div>

      </div>
    </section>
  );
};

export default InstagramFeed;