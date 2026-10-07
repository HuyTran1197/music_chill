import { useNavigate } from "react-router-dom";
import { ALBUMS } from "../data/albums.js";
import AlbumGrid from "../components/AlbumGrid.jsx";
import { usePlayerContext } from "../context/PlayerContext.jsx";

export default function HomePage() {
    const navigate = useNavigate();
    const player = usePlayerContext();

    return (
        <AlbumGrid
            albums={ALBUMS}
            currentAlbumId={player.currentAlbum?.id}
            onOpenAlbum={(album) => navigate(`/album/${album.id}`)}
        />
    );
}