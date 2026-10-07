export default function PlayerBar({ album, song, isPlaying, isShuffled, progress, onTogglePlay, onNext, onPrev, onToggleShuffle, onSeek }) {
    if (!song) return null;

    function handleSeekClick(e) {
        const rect = e.currentTarget.getBoundingClientRect();
        const pct = (e.clientX - rect.left) / rect.width;
        onSeek(Math.min(Math.max(pct, 0), 1));
    }

    return (
        <footer className="player-bar" style={{ ["--accent"]: album?.accent }}>
            <div className="player-info">
                <p className="player-title">{song.title}</p>
                <p className="player-artist">{song.artist} · {album?.title}</p>
                <div className="progress-track" onClick={handleSeekClick}>
                    <div className="progress-fill" style={{ width: `${progress * 100}%` }} />
                </div>
            </div>
            <div className="player-controls">
                <button className="icon-btn" onClick={onPrev} aria-label="Bài trước">⏮</button>
                <button className="icon-btn play-btn" onClick={onTogglePlay} aria-label="Phát/Tạm dừng">
                    {isPlaying ? "⏸" : "▶"}
                </button>
                <button className="icon-btn" onClick={onNext} aria-label="Bài kế tiếp">⏭</button>
                <button
                    className={`icon-btn${isShuffled ? " active-toggle" : ""}`}
                    onClick={onToggleShuffle}
                    aria-label="Bật/tắt ngẫu nhiên"
                    title="Ngẫu nhiên"
                >
                    🔀
                </button>
            </div>
        </footer>
    );
}