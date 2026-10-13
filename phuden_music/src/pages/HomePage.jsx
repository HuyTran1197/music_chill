import { Link, useNavigate } from "react-router-dom";
import AlbumGrid from "../components/AlbumGrid.jsx";
import { useLibrary } from "../context/LibraryContext.jsx";
import { usePlayerContext } from "../context/PlayerContext.jsx";

export default function HomePage() {
    const navigate = useNavigate();
    const player = usePlayerContext();
    const { albums, room } = useLibrary();

    return (
        <>
            <AlbumGrid
                albums={albums}
                currentAlbumId={player.currentAlbum?.id}
                onOpenAlbum={(album) => navigate(`/album/${album.id}`)}
            />
            <div className="kho-link-wrap">
                <Link to="/kho-nhac" className="kho-link">
                    📦 Kho nhạc · {room.length} bài
                </Link>
            </div>
        </>
    );
}