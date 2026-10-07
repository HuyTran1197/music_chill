import { Container, Row, Col } from "react-bootstrap";
import AlbumCard from "./AlbumCard.jsx";

export default function AlbumGrid({ albums, currentAlbumId, onOpenAlbum }) {
    return (
        <Container fluid className="album-grid-container">
            <Row className="row-cols-2 row-cols-sm-3 row-cols-lg-5 g-3 g-lg-4">
                {albums.map((album) => (
                    <Col key={album.id}>
                        <AlbumCard
                            album={album}
                            isActive={album.id === currentAlbumId}
                            onOpen={onOpenAlbum}
                        />
                    </Col>
                ))}
            </Row>
        </Container>
    );
}