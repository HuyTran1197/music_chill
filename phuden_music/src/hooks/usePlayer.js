import { useCallback, useEffect, useRef, useState } from "react";

function shuffleArray(arr) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

/**
 * Điều khiển phát nhạc cho toàn app.
 *
 * Nguyên tắc quan trọng: các hàm như playNext/playPrev/toggleShuffle CHỈ cập nhật
 * state (queue, queuePos) một cách thuần tuý (pure), không tự gọi audio.play() bên trong.
 * Việc thật sự nạp + phát file mp3 được xử lý riêng trong 1 useEffect, chạy đúng 1 lần
 * mỗi khi bài hát (currentSong) thực sự đổi. Tách như vậy để tránh xung đột khi
 * React (StrictMode, môi trường dev) gọi lặp các hàm cập nhật state.
 */
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
    const isShuffledRef = useRef(false);

    useEffect(() => { queueRef.current = queue; }, [queue]);
    useEffect(() => { isShuffledRef.current = isShuffled; }, [isShuffled]);

    const currentSong = queue[queuePos] || null;

    // ---------- Sự kiện của thẻ <audio> ----------
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
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // ---------- Nạp + phát bài hát thật sự (CHỈ chạy khi id bài hát đổi) ----------
    useEffect(() => {
        const audio = audioRef.current;
        if (!audio || !currentSong) return;
        audio.src = currentSong.src;
        audio.currentTime = 0;
        audio.play().catch((err) => console.warn("Không phát được:", err));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentSong?.id]);

    // ---------- Các hàm điều khiển: chỉ cập nhật state, KHÔNG tự phát nhạc ----------

    const playAlbum = useCallback((album, startIndex = 0, shuffled) => {
        const useShuffle = shuffled ?? isShuffledRef.current;
        baseOrderRef.current = album.songs;
        const nextQueue = useShuffle ? shuffleArray(album.songs) : [...album.songs];
        setCurrentAlbum(album);
        setQueue(nextQueue);
        setQueuePos(useShuffle ? 0 : startIndex);
        setIsShuffled(useShuffle);
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

    const playNext = useCallback(() => {
        setQueuePos((pos) => {
            const len = queueRef.current.length;
            if (len === 0) return pos;
            return (pos + 1) % len; // hết bài cuối -> tự quay lại bài đầu
        });
    }, []);

    const playPrev = useCallback(() => {
        setQueuePos((pos) => {
            const len = queueRef.current.length;
            if (len === 0) return pos;
            return (pos - 1 + len) % len;
        });
    }, []);

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

    return {
        currentAlbum, currentSong, queue, queuePos, isShuffled, isPlaying, progress, duration,
        playAlbum, togglePlayPause, playNext, playPrev, toggleShuffle, seekTo,
    };
}