import { useCallback, useEffect, useRef, useState } from "react";

function shuffleArray(arr) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

export function usePlayer() {
    const audioRef = useRef(null);
    if (!audioRef.current && typeof window !== "undefined") {
        audioRef.current = new Audio();
    }

    const [currentAlbum, setCurrentAlbum] = useState(null);
    const [queue, setQueue] = useState([]);
    const [queuePos, setQueuePos] = useState(-1);
    const [isShuffled, setIsShuffled] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const [progress, setProgress] = useState(0);
    const [duration, setDuration] = useState(0);

    const baseOrderRef = useRef([]);
    const queueRef = useRef([]);
    const queuePosRef = useRef(-1);
    const isShuffledRef = useRef(false);

    useEffect(() => { queueRef.current = queue; }, [queue]);
    useEffect(() => { queuePosRef.current = queuePos; }, [queuePos]);
    useEffect(() => { isShuffledRef.current = isShuffled; }, [isShuffled]);

    const currentSong = queue[queuePos] || null;

    const playNext = useCallback(() => {
        setQueuePos((pos) => {
            const len = queueRef.current.length;
            if (len === 0) return pos;
            return (pos + 1) % len;
        });
    }, []);

    const playPrev = useCallback(() => {
        setQueuePos((pos) => {
            const len = queueRef.current.length;
            if (len === 0) return pos;
            return (pos - 1 + len) % len;
        });
    }, []);

    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        const onTimeUpdate = () => {
            if (audio.duration) setProgress(audio.currentTime / audio.duration);
        };
        const onLoadedMetadata = () => setDuration(audio.duration || 0);
        const onPlay = () => setIsPlaying(true);
        const onPause = () => setIsPlaying(false);
        const onEnded = () => playNext();

        audio.addEventListener("timeupdate", onTimeUpdate);
        audio.addEventListener("loadedmetadata", onLoadedMetadata);
        audio.addEventListener("play", onPlay);
        audio.addEventListener("pause", onPause);
        audio.addEventListener("ended", onEnded);

        return () => {
            audio.removeEventListener("timeupdate", onTimeUpdate);
            audio.removeEventListener("loadedmetadata", onLoadedMetadata);
            audio.removeEventListener("play", onPlay);
            audio.removeEventListener("pause", onPause);
            audio.removeEventListener("ended", onEnded);
        };
    }, [playNext]);

    useEffect(() => {
        const audio = audioRef.current;
        if (!audio || !currentSong) return;
        audio.src = currentSong.src;
        audio.currentTime = 0;
        audio.play().catch((err) => {
            console.warn(`Không phát được "${currentSong.title}" (${currentSong.src}):`, err.message);
            playNext();
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentSong?.id]);

    const playAlbum = useCallback((album, startIndex = 0, shuffled) => {
        const useShuffle = shuffled ?? isShuffledRef.current;
        baseOrderRef.current = album.songs;
        const nextQueue = useShuffle ? shuffleArray(album.songs) : [...album.songs];
        setCurrentAlbum(album);
        setQueue(nextQueue);
        setQueuePos(useShuffle ? 0 : startIndex);
        setIsShuffled(useShuffle);
    }, []);

    // Đồng bộ hàng đợi khi danh sách bài của album đang phát bị thay đổi (có người tháo/thêm bài)
    const syncAlbum = useCallback((album) => {
        const oldQueue = queueRef.current;
        const oldPos = queuePosRef.current;
        const current = oldQueue[oldPos];
        const ids = new Set(album.songs.map((s) => s.id));

        baseOrderRef.current = album.songs;
        setCurrentAlbum(album);

        let nextQueue;
        if (isShuffledRef.current) {
            const kept = oldQueue.filter((s) => ids.has(s.id));
            const added = album.songs.filter((s) => !oldQueue.some((q) => q.id === s.id));
            nextQueue = [...kept, ...added];
        } else {
            nextQueue = [...album.songs];
        }

        if (nextQueue.length === 0) {
            audioRef.current?.pause();
            setQueue([]);
            setQueuePos(-1);
            return;
        }

        let newPos = current ? nextQueue.findIndex((s) => s.id === current.id) : -1;
        if (newPos < 0) {
            // Bài đang phát vừa bị tháo: chuyển sang bài kế tiếp còn tồn tại
            const following = oldQueue.slice(oldPos + 1).find((s) => ids.has(s.id));
            newPos = following ? nextQueue.findIndex((s) => s.id === following.id) : 0;
        }
        setQueue(nextQueue);
        setQueuePos(newPos < 0 ? 0 : newPos);
    }, []);

    const togglePlayPause = useCallback(() => {
        const audio = audioRef.current;
        if (!audio || !currentSong) return;
        if (audio.paused) {
            audio.play();
        } else {
            audio.pause();
        }
    }, [currentSong]);

    const toggleShuffle = useCallback(() => {
        setIsShuffled((wasShuffled) => {
            const nowShuffled = !wasShuffled;
            setQueue((currentQueue) => {
                const current = currentQueue[queuePos];
                let nextQueue;
                if (nowShuffled) {
                    const rest = baseOrderRef.current.filter((s) => s.id !== current?.id);
                    nextQueue = current ? [current, ...shuffleArray(rest)] : shuffleArray(baseOrderRef.current);
                } else {
                    nextQueue = [...baseOrderRef.current];
                }
                const newPos = current ? nextQueue.findIndex((s) => s.id === current.id) : 0;
                setQueuePos(newPos < 0 ? 0 : newPos);
                return nextQueue;
            });
            return nowShuffled;
        });
    }, [queuePos]);

    const seekTo = useCallback((pct) => {
        const audio = audioRef.current;
        if (!audio || !audio.duration) return;
        audio.currentTime = pct * audio.duration;
    }, []);

    // Tải trước cả album để nghe offline
    const prefetchAlbum = useCallback(async (album, onProgress) => {
        const results = await Promise.allSettled(
            album.songs.map((song) =>
                fetch(song.src).then((res) => {
                    if (!res.ok) throw new Error(`Không tải được: ${song.src}`);
                    onProgress?.();
                })
            )
        );
        const failed = results.filter((r) => r.status === "rejected").length;
        return { total: album.songs.length, failed };
    }, []);

    return {
        currentAlbum, currentSong, queue, queuePos, isShuffled, isPlaying, progress, duration,
        playAlbum, syncAlbum, togglePlayPause, playNext, playPrev, toggleShuffle, seekTo, prefetchAlbum,
    };
}