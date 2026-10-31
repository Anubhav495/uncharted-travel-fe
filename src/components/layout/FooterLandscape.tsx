import React from 'react';

const FooterLandscape: React.FC = () => (
    <div aria-hidden="true" className="absolute inset-0 pointer-events-none select-none overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_75%,rgba(51,65,85,0.22),transparent_65%)]" />

        <svg
            className="absolute bottom-0 w-full h-[52%] sm:h-[70%]"
            viewBox="0 0 1440 420"
            preserveAspectRatio="xMidYMax slice"
            fill="none"
            focusable="false"
        >
            {/* Distant peaks, with a faint highlight along the ridgeline. */}
            <path
                d="M-40 265L30 235 80 246 145 182 175 202 235 128 270 158 310 126 365 186 410 164 467 82 494 121 532 98 570 144 600 129 656 191 706 154 750 180 816 105 850 133 900 72 932 116 962 105 1014 176 1050 155 1090 192 1140 138 1165 151 1223 88 1261 123 1290 107 1345 181 1380 161 1480 240V420H-40Z"
                fill="#1e293b"
                fillOpacity="0.6"
                stroke="#475569"
                strokeOpacity="0.18"
                vectorEffect="non-scaling-stroke"
            />
            <path
                d="M-40 330L45 285 90 295 175 230 210 258 260 212 320 264 365 244 445 308 500 268 550 285 612 210 650 242 692 227 760 294 815 258 860 276 932 202 970 225 1020 190 1070 245 1110 226 1185 294 1242 252 1295 270 1350 235 1480 300V420H-40Z"
                fill="#0f172a"
                fillOpacity="0.95"
            />
            <path
                d="M-40 388L110 344 230 365 375 320 470 350 610 332 760 378 930 328 1055 348 1190 315 1320 352 1480 326V420H-40Z"
                fill="#020617"
            />
        </svg>

    </div>
);

export default FooterLandscape;
