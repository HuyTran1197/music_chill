import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { doc, onSnapshot, runTransaction } from "firebase/firestore";
import { db } from "../firebase.js";
import { ALBUMS, ROOM_SONGS } from "../data/albums.js";

const LibraryContext = createContext(null);
const LIBRARY_REF = doc(db, "app", "library");

// Danh mục toàn bộ bài hát, tra cứu theo id
const ALL_SONGS = [...ALBUMS.flatMap((a) => a.songs), ...ROOM_SONGS];
const SONG_BY_ID = new Map(ALL_SONGS.map((s) => [s.id, s]));

function defaultArrangement() {
    const result = {};
    ALBUMS.forEach((a) => {
        result[a.id] = a.songs.map((s) => s.id);
    });
    return result;
}

export function LibraryProvider({ children }) {
    const [remote, setRemote] = useState(null); // { albumId: [songId, ...] } từ Firestore
    const [status, setStatus] = useState("loading"); // loading | ready | error

    useEffect(() => {
        // Nếu sau 4 giây chưa có phản hồi (mạng chậm/offline), vẫn hiển thị bằng sắp xếp mặc định
        const timer = setTimeout(() => setStatus((s) => (s === "loading" ? "ready" : s)), 4000);
        const unsubscribe = onSnapshot(
            LIBRARY_REF,
            (snap) => {
                setRemote(snap.exists() ? snap.data().albums ?? null : null);
                setStatus("ready");
            },
            (err) => {
                console.error("Lỗi đọc Firestore:", err);
                setStatus("error");
            }
        );
        return () => {
            clearTimeout(timer);
            unsubscribe();
        };
    }, []);

    // Album (kèm danh sách bài) và Room (bài chưa thuộc album nào)
    const { albums, room } = useMemo(() => {
        const defaults = defaultArrangement();
        const arrangement = remote ?? defaults;
        const seen = new Set();
        const resolved = ALBUMS.map((meta) => {
            const ids = arrangement[meta.id] ?? defaults[meta.id] ?? [];
            const songs = [];
            ids.forEach((id) => {
                const song = SONG_BY_ID.get(id);
                if (song && !seen.has(id)) {
                    seen.add(id);
                    songs.push(song);
                }
            });
            return { ...meta, songs };
        });
        const roomSongs = ALL_SONGS.filter((s) => !seen.has(s.id));
        return { albums: resolved, room: roomSongs };
    }, [remote]);

    // Ghi thay đổi bằng transaction để 2 người thao tác cùng lúc không làm hỏng dữ liệu
    const mutate = useCallback(async (apply) => {
        await runTransaction(db, async (tx) => {
            const snap = await tx.get(LIBRARY_REF);
            const defaults = defaultArrangement();
            const current = snap.exists() && snap.data().albums ? snap.data().albums : defaults;
            const next = {};
            ALBUMS.forEach((a) => {
                next[a.id] = [...(current[a.id] ?? defaults[a.id] ?? [])];
            });
            apply(next);
            tx.set(LIBRARY_REF, { albums: next });
        });
    }, []);

    const moveToAlbum = useCallback(
        (songId, albumId) =>
            mutate((next) => {
                Object.keys(next).forEach((id) => {
                    next[id] = next[id].filter((x) => x !== songId);
                });
                next[albumId].push(songId);
            }),
        [mutate]
    );

    const removeFromAlbum = useCallback(
        (songId) =>
            mutate((next) => {
                Object.keys(next).forEach((id) => {
                    next[id] = next[id].filter((x) => x !== songId);
                });
            }),
        [mutate]
    );

    const value = { albums, room, status, moveToAlbum, removeFromAlbum };
    return <LibraryContext.Provider value={value}>{children}</LibraryContext.Provider>;
}

export function useLibrary() {
    const ctx = useContext(LibraryContext);
    if (!ctx) throw new Error("useLibrary phải được dùng bên trong LibraryProvider");
    return ctx;
}