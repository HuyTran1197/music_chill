import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AlbumView from "../components/AlbumView.jsx";
import { useLibrary } from "../context/LibraryContext.jsx";
import { usePlayerContext } from "../context/PlayerContext.jsx";

export default function AlbumPage() {
    const { albumId } = useParams();
    const navigate = useNavigate();
    const player = usePlayerContext();
    const { albums, removeFromAlbum } = useLibrary();
    const album = albums.find((a) => a.id === albumId);

    const [downloadState, setDownloadState] = useState("idle"); // idle | downloading | done | error
    const [downloadedCount, setDownloadedCount] = useState(0);

    async function handleDownloadAlbum() {
        if (!album || downloadState === "downloading") return;
        setDownloadState("downloading");
        setDownloadedCount(0);
        const { failed } = await player.prefetchAlbum(album, () =>
            setDownloadedCount((c) => c + 1)
        );
        setDownloadState(failed > 0 ? "error" : "done");
    }

    async function handleRemoveSong(song) {
        const ok = window.confirm(
            `Tháo "${song.title}" khỏi album ${album.title}?\nBài hát sẽ được chuyển về Kho nhạc.`
        );
        if (!ok) return;
        try {
            await removeFromAlbum(song.id);
        } catch (err) {
            console.error(err);
            alert("Không thể tháo bài lúc này. Hãy kiểm tra kết nối mạng rồi thử lại.");
        }
    }

    if (!album) {
        return (
            <div className="album-view">
                <p className="empty-note">Không tìm thấy album này.</p>
                <button className="icon-btn" onClick={() => navigate("/")}>←</button>
            </div>
        );
    }

    return (
        <AlbumView
            album={album}
            currentSong={player.currentAlbum?.id === album.id ? player.currentSong : null}
            isPlaying={player.isPlaying}
            isShuffled={player.currentAlbum?.id === album.id ? player.isShuffled : false}
            onBack={() => navigate("/")}
            onPlaySong={(idx) => player.playAlbum(album, idx, player.isShuffled)}
            onToggleShuffle={player.toggleShuffle}
            onRemoveSong={handleRemoveSong}
            downloadState={downloadState}
            downloadedCount={downloadedCount}
            totalSongs={album.songs.length}
            onDownloadAlbum={handleDownloadAlbum}
        />
    );
}