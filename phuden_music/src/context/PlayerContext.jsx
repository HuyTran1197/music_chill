import { createContext, useContext, useEffect } from "react";
import { usePlayer } from "../hooks/usePlayer.js";
import { useLibrary } from "./LibraryContext.jsx";

const PlayerContext = createContext(null);

export function PlayerProvider({ children }) {
    const player = usePlayer();
    const { albums } = useLibrary();

    // Khi sắp xếp album thay đổi (ai đó tháo/thêm bài), cập nhật hàng đợi của album đang phát
    useEffect(() => {
        const playing = player.currentAlbum;
        if (!playing) return;
        const latest = albums.find((a) => a.id === playing.id);
        if (!latest) return;
        const latestKey = latest.songs.map((s) => s.id).join("|");
        const playingKey = playing.songs.map((s) => s.id).join("|");
        if (latestKey !== playingKey) player.syncAlbum(latest);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [albums]);

    return <PlayerContext.Provider value={player}>{children}</PlayerContext.Provider>;
}

export function usePlayerContext() {
    const ctx = useContext(PlayerContext);
    if (!ctx) throw new Error("usePlayerContext phải được dùng bên trong PlayerProvider");
    return ctx;
}