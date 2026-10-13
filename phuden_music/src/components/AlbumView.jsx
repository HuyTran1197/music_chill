import AlbumIcon from "./AlbumIcon.jsx";

export default function AlbumView({
                                      album, currentSong, isPlaying, isShuffled, onBack, onPlaySong, onToggleShuffle, onRemoveSong,
                                      downloadState, downloadedCount, totalSongs, onDownloadAlbum,
                                  }) {
    const state = downloadState || "idle";
    const downloadLabel = {
        idle: "Tải về để nghe offline",
        downloading: `Đang tải ${downloadedCount}/${totalSongs}`,
        done: "Đã tải xong, nghe offline được rồi",
        error: "Vài bài tải lỗi, bấm để thử lại",
    }[state];
    const downloadIcon = { idle: "↓", downloading: "↓", done: "✓", error: "!" }[state];
    const downloadPercent = totalSongs ? (downloadedCount / totalSongs) * 100 : 0;

    return (
        <section className="album-view" style={{ ["--accent"]: album.accent }}>
            <div
                className="album-hero"
                style={{ backgroundImage: `linear-gradient(160deg, ${album.gradient.join(", ")})` }}
            >
                <div className="album-inner">
                    <div className="album-hero-top">
                        <button className="icon-btn on-color" onClick={onBack} aria-label="Quay lại">←</button>
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
                    <p className="eyebrow on-color">{album.subtitle} · {album.songs.length} bài</p>
                    <h2 className="on-color">{album.title}</h2>

                    {onDownloadAlbum && album.songs.length > 0 && (
                        <button
                            className={`download-album-btn is-${state}`}
                            onClick={onDownloadAlbum}
                            disabled={state === "downloading"}
                            style={{ ["--progress"]: `${downloadPercent}%` }}
                        >
                            <span className="download-icon">{downloadIcon}</span>
                            <span className="download-text">{downloadLabel}</span>
                        </button>
                    )}
                </div>
            </div>

            <div className="album-body">
                <div className="album-inner">
                    {album.songs.length === 0 ? (
                        <p className="empty-note">
                            Album này chưa có bài nào. Hãy vào Kho nhạc để thêm bài vào album.
                        </p>
                    ) : (
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
                                        {onRemoveSong && (
                                            <button
                                                className="track-remove-btn"
                                                title="Tháo bài khỏi album (chuyển về Kho nhạc)"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    onRemoveSong(song);
                                                }}
                                            >
                                                Tháo
                                            </button>
                                        )}
                                    </li>
                                );
                            })}
                        </ol>
                    )}
                </div>
            </div>
        </section>
    );
}