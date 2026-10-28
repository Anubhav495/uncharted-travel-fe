import React, { useEffect, useRef } from 'react';
import Hls from 'hls.js';

interface WaveBackdropProps {
    opacity?: string;
}

const WaveBackdrop: React.FC<WaveBackdropProps> = ({ opacity = 'opacity-70' }) => {
    const videoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        const src = 'https://stream.mux.com/8wrHPCX2dC3msyYU9ObwqNdm00u3ViXvOSHUMRYSEe5Q.m3u8';

        if (Hls.isSupported()) {
            const hls = new Hls({
                enableWorker: true,
                lowLatencyMode: true,
            });
            hls.loadSource(src);
            hls.attachMedia(video);
            hls.on(Hls.Events.MANIFEST_PARSED, () => {
                video.play().catch(() => {});
            });
            hls.on(Hls.Events.ERROR, (_event, data) => {
                if (!data.fatal) return;
                if (data.type === Hls.ErrorTypes.NETWORK_ERROR) hls.startLoad();
                else if (data.type === Hls.ErrorTypes.MEDIA_ERROR) hls.recoverMediaError();
                else hls.destroy();
            });
            return () => {
                hls.destroy();
            };
        } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
            video.src = src;
            video.play().catch(() => {});
        }
    }, []);

    return (
        <div className="absolute inset-0 pointer-events-none overflow-hidden select-none z-0" aria-hidden="true">
            {/* Glowing liquid wave video from Atlas Revolution */}
            <video
                ref={videoRef}
                autoPlay
                loop
                muted
                playsInline
                preload="auto"
                poster="https://image.mux.com/8wrHPCX2dC3msyYU9ObwqNdm00u3ViXvOSHUMRYSEe5Q/thumbnail.jpg"
                className={`absolute inset-0 w-full h-full object-cover ${opacity}`}
            />
            {/* Dynamic ambient flowing wave curves */}
            <svg
                className="absolute inset-0 w-full h-full object-cover opacity-35 mix-blend-screen"
                viewBox="0 0 1440 800"
                fill="none"
                preserveAspectRatio="none"
            >
                <path d="M-100,200 C300,100 600,350 1000,180 C1300,50 1500,220 1600,250" stroke="white" strokeWidth="1.6" strokeDasharray="6 10" opacity="0.6" />
                <path d="M-100,320 C250,220 700,420 1100,280 C1350,180 1500,340 1600,360" stroke="white" strokeWidth="1.2" opacity="0.5" />
                <path d="M-100,450 C350,380 650,560 1050,420 C1300,320 1500,480 1600,500" stroke="white" strokeWidth="1.0" strokeDasharray="4 8" opacity="0.4" />
                <path d="M-100,580 C200,520 800,680 1200,560 C1400,480 1550,600 1600,620" stroke="white" strokeWidth="1.2" opacity="0.45" />
            </svg>
            {/* Edge gradient fades for seamless dark aesthetic */}
            <div className="absolute inset-0 bg-gradient-to-b from-black via-black/30 to-black pointer-events-none" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_20%,rgba(0,0,0,0.85)_80%)] pointer-events-none" />
        </div>
    );
};

export default WaveBackdrop;
