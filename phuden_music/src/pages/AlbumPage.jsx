import { useNavigate, useParams } from "react-router-dom";
import { ALBUMS } from "../data/albums.js";
import AlbumView from "../components/AlbumView.jsx";
import { usePlayerContext } from "../context/PlayerContext.jsx";

export default function AlbumPage() {
    const { albumId } = useParams();
    const navigate = useNavigate();
    const player = usePlayerContext();
    const album = ALBUMS.find((a) => a.id === albumId);

    if (!album) {
        return (
            <div className="album-view">
                <p>Không tìm thấy album này.</p>
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
        />
    );
}