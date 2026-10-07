import AlbumIcon from "./AlbumIcon.jsx";

export default function AlbumView({ album, currentSong, isPlaying, isShuffled, onBack, onPlaySong, onToggleShuffle }) {
    return (
        <section className="album-view" style={{ ["--accent"]: album.accent }}>
            <div
                className="album-hero"
                style={{ backgroundImage: `linear-gradient(160deg, ${album.gradient.join(", ")})` }}
            >
                <div className="album-inner">
                    <div className="album-hero-top">
                        <button className="icon-btn on-color" onClick={onBack} aria-label="Quay lại">
                            ←
                        </button>
                        <button
                            className={`icon-btn on-color${isShuffled ? " active-toggle-light" : ""}`}
                            onClick={onToggleShuffle}
                            aria-label="Bật/tắt phát ngẫu nhiên"
                            title="Phát ngẫu nhiên"
                        >
                            🔀
                        </button>
                    </div>
                    <div className="album-hero-art">
                        <AlbumIcon type={album.icon} accent={album.accent} />
                    </div>
                    <p className="eyebrow on-color">{album.subtitle}</p>
                    <h2 className="on-color">{album.title}</h2>
                </div>
            </div>

            <div className="album-body">
                <div className="album-inner">
                    <ol className="track-list">
                        {album.songs.map((song, idx) => {
                            const isCurrent = currentSong?.id === song.id;
                            return (
                                <li
                                    key={song.id}
                                    className={`track-row${isCurrent ? " playing" : ""}`}
                                    onClick={() => onPlaySong(idx)}
                                >
                  <span className="track-num">
                    {isCurrent && isPlaying ? "♪" : String(idx + 1).padStart(2, "0")}
                  </span>
                                    <div className="track-text">
                                        <p className="track-title">{song.title}</p>
                                        <p className="track-sub">{song.artist}</p>
                                    </div>
                                </li>
                            );
                        })}
                    </ol>
                </div>
            </div>
        </section>
    );
}