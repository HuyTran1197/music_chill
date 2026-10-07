import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage.jsx";
import AlbumPage from "./pages/AlbumPage.jsx";
import PlayerBar from "./components/PlayerBar.jsx";
import { usePlayerContext } from "./context/PlayerContext.jsx";

export default function App() {
    const player = usePlayerContext();

    return (
        <div className="app-shell">
            <header className="top-bar">
                <div className="brand">
                    <span className="brand-mark">◐</span>
                    <h1>Chill Cùng Goonch</h1>
                </div>
            </header>

            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/album/:albumId" element={<AlbumPage />} />
            </Routes>

            <PlayerBar
                album={player.currentAlbum}
                song={player.currentSong}
                isPlaying={player.isPlaying}
                isShuffled={player.isShuffled}
                progress={player.progress}
                onTogglePlay={player.togglePlayPause}
                onNext={player.playNext}
                onPrev={player.playPrev}
                onToggleShuffle={player.toggleShuffle}
                onSeek={player.seekTo}
            />
        </div>
    );
}