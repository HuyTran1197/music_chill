import AlbumIcon from "./AlbumIcon.jsx";

export default function AlbumCard({ album, isActive, onOpen }) {
    return (
        <button
            className={`album-card${isActive ? " active" : ""}`}
            style={{
                ["--accent"]: album.accent,
                backgroundImage: `linear-gradient(135deg, ${album.gradient.join(", ")})`,
            }}
            onClick={() => onOpen(album)}
        >
            <div className="album-card-art">
                <div className="icon-badge">
                    <AlbumIcon type={album.icon} accent={album.accent} />
                </div>
            </div>
            <div className="album-card-text">
                <p className="album-card-title">{album.title}</p>
                <p className="album-card-subtitle">{album.subtitle}</p>
            </div>
            {isActive && <span className="now-playing-dot" aria-hidden="true" />}
        </button>
    );
}