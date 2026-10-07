import { createContext, useContext } from "react";
import { usePlayer } from "../hooks/usePlayer.js";

const PlayerContext = createContext(null);

export function PlayerProvider({ children }) {
    const player = usePlayer();
    return <PlayerContext.Provider value={player}>{children}</PlayerContext.Provider>;
}

export function usePlayerContext() {
    const ctx = useContext(PlayerContext);
    if (!ctx) throw new Error("usePlayerContext phải được dùng bên trong PlayerProvider");
    return ctx;
}