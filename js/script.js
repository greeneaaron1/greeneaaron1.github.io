document.addEventListener('DOMContentLoaded', () => {
    // State
    let currentAlbum = libraryData[0]; // Default to first album
    let currentPieceIndex = -1;
    let filteredPieces = [...currentAlbum.pieces];

    // DOM Elements
    const albumDetails = document.getElementById('album-details');
    const trackList = document.getElementById('track-list');
    const searchInput = document.getElementById('search-input');
    const trackListView = document.getElementById('track-list-view');
    const pdfView = document.getElementById('pdf-viewer-view');
    const pdfFrame = document.getElementById('pdf-frame');
    const currentPieceTitle = document.getElementById('current-piece-title');
    const backButton = document.getElementById('back-button');
    const prevButton = document.getElementById('prev-piece');
    const nextButton = document.getElementById('next-piece');

    // Initialization
    renderAlbumDetails(currentAlbum);
    renderTrackList(filteredPieces);

    // Functions
    function renderAlbumDetails(album) {
        albumDetails.innerHTML = `
            <img src="${album.coverImage}" alt="${album.title}" class="album-cover">
            <h2 class="album-title">${album.title}</h2>
            <p class="album-info">${album.performer}</p>
            <p class="album-info">${album.composer}</p>
            <p class="album-year">${album.year}</p>
        `;
    }

    function renderTrackList(pieces) {
        trackList.innerHTML = '';
        if (pieces.length === 0) {
            trackList.innerHTML = '<li class="track-item" style="justify-content:center; color:#999;">No pieces found</li>';
            return;
        }

        pieces.forEach((piece, index) => {
            const li = document.createElement('li');
            li.className = 'track-item';
            // Find the original index in the full album to ensure correct playback order if filtered?
            // For now, we'll just use the index in the filtered list for display, 
            // but for navigation we should probably stick to the full album context or the filtered context.
            // Let's use the filtered context for navigation so user plays what they see.

            li.innerHTML = `
                <div>
                    <span class="track-number">${index + 1}</span>
                    <span class="track-title">${piece.title}</span>
                </div>
                <span class="track-action">View Sheet Music →</span>
            `;

            li.addEventListener('click', () => {
                openPiece(index, pieces);
            });

            trackList.appendChild(li);
        });
    }

    function openPiece(index, contextList) {
        // Update state
        // We need to find this piece in the context of the current list being viewed
        // But for "Next/Prev" logic, we usually want to traverse the list the user is looking at.
        filteredPieces = contextList;
        currentPieceIndex = index;
        const piece = filteredPieces[currentPieceIndex];

        // Update UI
        currentPieceTitle.textContent = piece.title;
        pdfFrame.src = piece.pdf;

        // Switch Views
        trackListView.classList.add('hidden');
        trackListView.classList.remove('active');
        pdfView.classList.remove('hidden');
        pdfView.classList.add('active');

        updateNavButtons();
    }

    function closeViewer() {
        trackListView.classList.remove('hidden');
        trackListView.classList.add('active');
        pdfView.classList.add('hidden');
        pdfView.classList.remove('active');

        // Clear PDF to stop memory usage/sound if any?
        // pdfFrame.src = ''; // Optional: keep it loaded for faster back/forth
    }

    function nextPiece() {
        if (currentPieceIndex < filteredPieces.length - 1) {
            openPiece(currentPieceIndex + 1, filteredPieces);
        }
    }

    function prevPiece() {
        if (currentPieceIndex > 0) {
            openPiece(currentPieceIndex - 1, filteredPieces);
        }
    }

    function updateNavButtons() {
        prevButton.disabled = currentPieceIndex <= 0;
        nextButton.disabled = currentPieceIndex >= filteredPieces.length - 1;

        prevButton.style.opacity = prevButton.disabled ? '0.3' : '1';
        nextButton.style.opacity = nextButton.disabled ? '0.3' : '1';
    }

    // Event Listeners
    backButton.addEventListener('click', closeViewer);

    prevButton.addEventListener('click', prevPiece);
    nextButton.addEventListener('click', nextPiece);

    // Keyboard Navigation
    document.addEventListener('keydown', (e) => {
        if (pdfView.classList.contains('active')) {
            if (e.key === 'ArrowLeft') prevPiece();
            if (e.key === 'ArrowRight') nextPiece();
            if (e.key === 'Escape') closeViewer();
        }
    });

    // Search Functionality
    searchInput.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase();

        // Filter pieces
        const results = currentAlbum.pieces.filter(piece => {
            return piece.title.toLowerCase().includes(query) ||
                currentAlbum.composer.toLowerCase().includes(query) ||
                currentAlbum.performer.toLowerCase().includes(query);
        });

        renderTrackList(results);
    });
});
