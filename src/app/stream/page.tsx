"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { FaYoutube, FaTwitch, FaHome } from "react-icons/fa";
import YouTubeStream from "~/components/YoutubeStream";
import TwitchChatEmbed from "~/components/TwitchChatEmbed";
import FloatingButton from "~/components/FloatingButton";
import PageTransition from "~/components/PageTransition";
import { env } from "~/env";

// Loading component for Suspense fallback
const LoadingState = () => (
  <div className="flex items-center justify-center h-screen bg-black">
    <div className="text-white text-center animate-pulse">
      Loading stream...
    </div>
  </div>
);

// Main stream content component that uses useSearchParams
const StreamContent = () => {
  const searchParams = useSearchParams();
  const youtubeStreamer = searchParams?.get('yt') ?? '';
  const twitchStreamer = searchParams?.get('tw') ?? '';
  const [isYoutube, setIsYoutube] = useState(false); // Default to Twitch

  if (!youtubeStreamer || !twitchStreamer) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-white text-center">
          <h1 className="text-2xl mb-4">Missing stream parameters</h1>
          <Link 
            href="/"
            className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
          >
            Return Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row h-screen bg-black overflow-hidden relative">
      <div className="relative flex-grow h-[60vh] lg:h-screen">
        <YouTubeStream username={youtubeStreamer} />
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50 flex gap-2">
          <Link 
            href="/"
            className={`px-4 py-2 rounded-full 
            bg-black/60 hover:bg-black/80 backdrop-blur-md transition-all duration-300 
            hover:scale-110 border ${
              !isYoutube 
                ? 'border-[#6441a5]/50 shadow-[0_0_10px_rgba(100,65,165,0.3)] hover:shadow-[0_0_15px_rgba(100,65,165,0.5)]'
                : 'border-[#FF0000]/50 shadow-[0_0_10px_rgba(255,0,0,0.3)] hover:shadow-[0_0_15px_rgba(255,0,0,0.5)]'
            }`}
          >
            <span className="flex items-center gap-2 text-white">
              <FaHome className="text-xl" />
              <span>Home</span>
            </span>
          </Link>
          <button
            onClick={() => setIsYoutube(!isYoutube)}
            className={`px-4 py-2 rounded-full backdrop-blur-md transition-all duration-300 
            hover:scale-110 border bg-black/60 hover:bg-black/80 ${
              isYoutube 
                ? 'border-[#FF0000]/50 shadow-[0_0_10px_rgba(255,0,0,0.3)] hover:shadow-[0_0_15px_rgba(255,0,0,0.5)]'
                : 'border-[#6441a5]/50 shadow-[0_0_10px_rgba(100,65,165,0.3)] hover:shadow-[0_0_15px_rgba(100,65,165,0.5)]'
            }`}
          >
            <span className="flex items-center gap-2 text-white">
              <span>Chat:</span>
              <span className="relative w-6 h-6">
                <FaYoutube 
                  className={`absolute inset-0 text-xl transition-all duration-300 ease-in-out
                  ${isYoutube ? 'opacity-100 transform scale-100' : 'opacity-0 transform scale-75'}`}
                />
                <FaTwitch 
                  className={`absolute inset-0 text-xl transition-all duration-300 ease-in-out
                  ${!isYoutube ? 'opacity-100 transform scale-100' : 'opacity-0 transform scale-75'}`}
                />
              </span>
            </span>
          </button>
        </div>
      </div>
      <div className="h-[40vh] lg:h-screen lg:w-96 -ml-px">
        <TwitchChatEmbed 
          channel={twitchStreamer} 
          parent={env.NEXT_PUBLIC_DOMAIN}
        />
      </div>
    </div>
  );
};

// Main page component with proper nesting of Suspense and PageTransition
export default function StreamPage() {
  return (
    <PageTransition transitionType="purple">
      <Suspense fallback={<LoadingState />}>
        <StreamContent />
      </Suspense>
    </PageTransition>
  );
}
