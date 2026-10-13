export default function AlbumIcon({ type, accent }) {
    switch (type) {
        case "vinyl-mic": return <VinylMic accent={accent} />;
        case "heart-wave": return <HeartWave />;
        case "fire-burst": return <FireBurst />;
        case "cassette": return <Cassette accent={accent} />;
        case "golden-note": return <GoldenNote />;
        case "leaf-sprout": return <LeafSprout />;
        case "note-cluster":
        default: return <NoteCluster accent={accent} />;
    }
}

function VinylMic({ accent }) {
    return (
        <div className="icon-stage">
            <div className="icon-3d vinyl-spin">
                <svg viewBox="0 0 100 100" width="100%" height="100%">
                    <circle cx="50" cy="50" r="46" fill="#171423" />
                    <circle cx="50" cy="50" r="38" fill="none" stroke="#332e42" strokeWidth="1.4" />
                    <circle cx="50" cy="50" r="30" fill="none" stroke="#332e42" strokeWidth="1.4" />
                    <circle cx="50" cy="50" r="22" fill="none" stroke="#332e42" strokeWidth="1.4" />
                    <circle cx="50" cy="50" r="12" fill={accent} />
                    <circle cx="50" cy="50" r="3.2" fill="#171423" />
                </svg>
            </div>
            <svg className="icon-overlay" viewBox="0 0 100 100" width="46%" height="46%">
                <rect x="42" y="18" width="16" height="34" rx="8" fill="#FFFFFF" />
                <path d="M32 44 a18 18 0 0 0 36 0" fill="none" stroke="#FFFFFF" strokeWidth="4" strokeLinecap="round" />
                <line x1="50" y1="62" x2="50" y2="74" stroke="#FFFFFF" strokeWidth="4" strokeLinecap="round" />
            </svg>
        </div>
    );
}

function HeartWave() {
    return (
        <div className="icon-stage">
            <div className="icon-3d heart-pulse">
                <svg viewBox="0 0 100 100" width="100%" height="100%">
                    <path
                        d="M50 78 C20 58 8 40 18 26 C26 15 42 16 50 30 C58 16 74 15 82 26 C92 40 80 58 50 78 Z"
                        fill="#FFFFFF"
                        opacity="0.95"
                    />
                </svg>
            </div>
            <div className="wave-row">
                {[6, 12, 18, 12, 7, 14, 9].map((h, i) => (
                    <span key={i} className="wave-bar soft" style={{ ["--h"]: `${h}px`, animationDelay: `${i * 0.12}s` }} />
                ))}
            </div>
        </div>
    );
}

function FireBurst() {
    return (
        <div className="icon-stage">
            <svg className="fire-rays" viewBox="0 0 100 100" width="100%" height="100%">
                <g stroke="#FFE9A8" strokeWidth="2.5" opacity="0.55" strokeLinecap="round">
                    <line x1="50" y1="4" x2="50" y2="16" />
                    <line x1="50" y1="84" x2="50" y2="96" />
                    <line x1="4" y1="50" x2="16" y2="50" />
                    <line x1="84" y1="50" x2="96" y2="50" />
                    <line x1="16" y1="16" x2="24" y2="24" />
                    <line x1="76" y1="76" x2="84" y2="84" />
                    <line x1="84" y1="16" x2="76" y2="24" />
                    <line x1="16" y1="84" x2="24" y2="76" />
                </g>
            </svg>

            <div className="icon-3d flame-flicker">
                <svg viewBox="0 0 100 100" width="72%" height="72%">
                    <defs>
                        <linearGradient id="fireGrad" x1="0" y1="1" x2="0" y2="0">
                            <stop offset="0%" stopColor="#E8283D" />
                            <stop offset="55%" stopColor="#FF6B35" />
                            <stop offset="100%" stopColor="#FFE066" />
                        </linearGradient>
                    </defs>
                    <path
                        d="M50 10 C36 26 28 36 28 50 C28 66 38 76 50 76 C62 76 72 66 72 50
               C72 41 67 34 60 27 C63 38 56 41 53 34 C57 25 55 16 50 10 Z"
                        fill="url(#fireGrad)"
                    />
                </svg>
            </div>

            <span className="ember ember-1" />
            <span className="ember ember-2" />
            <span className="ember ember-3" />

            <div className="wave-row">
                {[10, 20, 26, 16, 11, 22, 14].map((h, i) => (
                    <span key={i} className="wave-bar loud" style={{ ["--h"]: `${h}px`, animationDelay: `${i * 0.07}s` }} />
                ))}
            </div>
        </div>
    );
}

function Cassette({ accent }) {
    return (
        <div className="icon-stage">
            <div className="icon-3d cassette-tilt">
                <svg viewBox="0 0 100 70" width="100%" height="70%">
                    <rect x="4" y="4" width="92" height="62" rx="8" fill="#2a2136" stroke="#ffffff33" strokeWidth="1.5" />
                    <rect x="14" y="14" width="72" height="24" rx="3" fill="#171423" />
                    <circle className="reel reel-left" cx="32" cy="26" r="9" fill="none" stroke={accent} strokeWidth="3" />
                    <circle className="reel reel-right" cx="68" cy="26" r="9" fill="none" stroke={accent} strokeWidth="3" />
                    <rect x="14" y="48" width="72" height="10" rx="3" fill="#171423" />
                </svg>
            </div>
        </div>
    );
}

function NoteCluster() {
    return (
        <div className="icon-stage">
            <div className="icon-3d note-orbit">
                <svg viewBox="0 0 100 100" width="70%" height="70%">
                    <path d="M40 15 v34 a8 8 0 1 1 -4 -7 V22 l24 -6 v30 a8 8 0 1 1 -4 -7 V9 Z" fill="#FFFFFF" />
                </svg>
            </div>
            <div className="icon-3d note-orbit note-orbit-delay">
                <svg viewBox="0 0 100 100" width="40%" height="40%">
                    <path d="M40 15 v34 a8 8 0 1 1 -4 -7 V22 l24 -6 v30 a8 8 0 1 1 -4 -7 V9 Z" fill="#FFFFFF" opacity="0.75" />
                </svg>
            </div>
        </div>
    );
}

function GoldenNote() {
    return (
        <div className="icon-stage">
            <svg className="gold-rays" viewBox="0 0 100 100" width="100%" height="100%">
                <g stroke="#FFE7A3" strokeWidth="2.5" strokeLinecap="round" opacity="0.75">
                    {Array.from({ length: 12 }, (_, i) => {
                        const a = (i * 30 * Math.PI) / 180;
                        const outer = i % 2 ? 44 : 48;
                        return (
                            <line
                                key={i}
                                x1={50 + Math.cos(a) * 36}
                                y1={50 + Math.sin(a) * 36}
                                x2={50 + Math.cos(a) * outer}
                                y2={50 + Math.sin(a) * outer}
                            />
                        );
                    })}
                </g>
            </svg>

            <div className="icon-3d gold-pulse">
                <svg viewBox="0 0 100 100" width="100%" height="100%">
                    <defs>
                        <linearGradient id="goldGrad" x1="0" y1="0" x2="1" y2="1">
                            <stop offset="0%" stopColor="#FFF3C4" />
                            <stop offset="55%" stopColor="#FFD166" />
                            <stop offset="100%" stopColor="#E0A030" />
                        </linearGradient>
                    </defs>
                    <circle cx="50" cy="50" r="30" fill="rgba(255,255,255,0.12)" stroke="url(#goldGrad)" strokeWidth="3" />
                    <g transform="translate(2 17)">
                        <path
                            d="M40 15 v34 a8 8 0 1 1 -4 -7 V22 l24 -6 v30 a8 8 0 1 1 -4 -7 V9 Z"
                            fill="url(#goldGrad)"
                        />
                    </g>
                </svg>
            </div>

            <span className="twinkle twinkle-1">✦</span>
            <span className="twinkle twinkle-2">✦</span>
            <span className="twinkle twinkle-3">✦</span>
        </div>
    );
}

function LeafSprout() {
    return (
        <div className="icon-stage">
            <div className="icon-3d sprout-glow">
                <svg viewBox="0 0 100 100" width="100%" height="100%">
                    <circle cx="50" cy="52" r="38" fill="rgba(255,255,255,0.2)" />
                </svg>
            </div>

            <svg className="icon-overlay" viewBox="0 0 100 100" width="78%" height="78%">
                <path d="M50 82 C50 68 50 56 50 44" stroke="#FFFFFF" strokeWidth="4" strokeLinecap="round" fill="none" />
                <path d="M34 84 Q50 78 66 84" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" fill="none" opacity="0.7" />
                <g className="leaf leaf-left">
                    <path d="M50 58 C34 58 24 48 22 34 C38 34 48 42 50 58 Z" fill="#FFFFFF" />
                </g>
                <g className="leaf leaf-right">
                    <path d="M50 46 C66 46 76 36 78 22 C62 22 52 30 50 46 Z" fill="#FFFFFF" opacity="0.92" />
                </g>
            </svg>

            <span className="mote mote-1" />
            <span className="mote mote-2" />
            <span className="mote mote-3" />
        </div>
    );
}