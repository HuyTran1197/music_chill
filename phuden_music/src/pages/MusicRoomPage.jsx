import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLibrary } from "../context/LibraryContext.jsx";

export default function MusicRoomPage() {
    const navigate = useNavigate();
    const { albums, room, status, moveToAlbum } = useLibrary();
    const [openSongId, setOpenSongId] = useState(null);
    const [busyId, setBusyId] = useState(null);

    async function handleAdd(song, album) {
        setBusyId(song.id);
        try {
            await moveToAlbum(song.id, album.id);
            setOpenSongId(null);
        } catch (err) {
            console.error(err);
            alert("Không thể thêm bài lúc này. Hãy kiểm tra kết nối mạng rồi thử lại.");
        } finally {
            setBusyId(null);
        }
    }

    return (
        <section className="kho-page">
            <div className="kho-hero">
                <div className="album-inner">
                    <div className="album-hero-top">
                        <button className="icon-btn on-color" onClick={() => navigate("/")} aria-label="Quay lại">
                            ←
                        </button>
                    </div>
                    <h2 className="on-color">📦 Kho nhạc</h2>
                    <p className="eyebrow on-color">
                        Những bài chưa thuộc album nào. Ở đây chỉ để chọn, không phát nhạc được.
                    </p>
                    <p className="kho-count">{room.length} bài</p>
                </div>
            </div>

            <div className="album-body">
                <div className="album-inner">
                    {status === "error" && (
                        <p className="empty-note">
                            Chưa kết nối được dữ liệu chung. Bạn có thể đang ngoại tuyến, nên các thay đổi sẽ chưa lưu được.
                        </p>
                    )}

                    {room.length === 0 ? (
                        <p className="empty-note">Kho nhạc đang trống. Mọi bài hát đều đã nằm trong album.</p>
                    ) : (
                        <ul className="kho-list">
                            {room.map((song) => {
                                const isOpen = openSongId === song.id;
                                return (
                                    <li key={song.id} className="kho-row">
                                        <div className="kho-row-main">
                                            <div className="track-text">
                                                <p className="track-title">{song.title}</p>
                                                <p className="track-sub">{song.artist}</p>
                                            </div>
                                            <button
                                                className="kho-add-btn"
                                                onClick={() => setOpenSongId(isOpen ? null : song.id)}
                                                disabled={busyId === song.id}
                                            >
                                                {isOpen ? "Đóng" : "Thêm vào album"}
                                            </button>
                                        </div>

                                        {isOpen && (
                                            <div className="kho-chips">
                                                <span className="kho-chips-label">Chọn album:</span>
                                                {albums.map((album) => (
                                                    <button
                                                        key={album.id}
                                                        className="kho-chip"
                                                        style={{ backgroundColor: album.accent }}
                                                        disabled={busyId === song.id}
                                                        onClick={() => handleAdd(song, album)}
                                                    >
                                                        {album.title}
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </li>
                                );
                            })}
                        </ul>
                    )}
                </div>
            </div>
        </section>
    );
}