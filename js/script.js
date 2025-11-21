document.addEventListener('DOMContentLoaded', async () => {
    // --- Shared State & Utils ---
    let albumsData = [];
    const isHomepage = document.body.classList.contains('homepage');

    // Theme Toggle Logic
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
        // Check local storage
        if (localStorage.getItem('theme') === 'dark') {
            document.body.classList.add('dark-mode');
        }

        themeToggle.addEventListener('click', () => {
            document.body.classList.toggle('dark-mode');
            localStorage.setItem('theme', document.body.classList.contains('dark-mode') ? 'dark' : 'light');
        });
    }

    // Fetch Data
    try {
        const response = await fetch('data/albums.json');
        albumsData = await response.json();
    } catch (error) {
        console.error('Error loading album data:', error);
        return;
    }

    // --- Homepage Logic ---
    if (isHomepage) {
        const albumGrid = document.getElementById('album-grid');
        const searchInput = document.getElementById('home-search-input');

        function renderAlbums(albums) {
            albumGrid.innerHTML = '';
            if (albums.length === 0) {
                albumGrid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: var(--text-muted);">No albums found.</p>';
                return;
            }

            albums.forEach(album => {
                const card = document.createElement('a');
                card.href = `album.html?id=${album.id}`;
                card.className = 'album-card';
                card.innerHTML = `
                    <div class="card-image-wrapper">
                        <img src="${album.cover}" alt="${album.title}" class="card-image" loading="lazy">
                    </div>
                    <div class="card-content">
                        <h3 class="card-title">${album.title}</h3>
                        <p class="card-subtitle">${album.composer}</p>
                        <p class="card-subtitle">${album.performer}</p>
                        <p class="card-year">${album.year}</p>
                    </div>
                `;
                albumGrid.appendChild(card);
            });
        }

        // Initial Render
        renderAlbums(albumsData);

        // Search Listener
        searchInput.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase();
            const filtered = albumsData.filter(album =>
                album.title.toLowerCase().includes(query) ||
                album.composer.toLowerCase().includes(query) ||
                album.performer.toLowerCase().includes(query) ||
                album.pieces.some(p => p.title.toLowerCase().includes(query))
            );
            renderAlbums(filtered);
        });

    } else {
        // --- Album Page Logic ---
        const urlParams = new URLSearchParams(window.location.search);
        const albumId = urlParams.get('id');

        // Find current album
        const currentAlbum = albumsData.find(a => a.id === albumId) || albumsData[0]; // Fallback to first if not found

        if (!currentAlbum) return; // Should not happen if data exists

        // State
        let currentPieceIndex = -1;
        let filteredPieces = [...currentAlbum.pieces];

        // Elements
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
        const sidebar = document.querySelector('.sidebar');

        // Set dynamic background for sidebar glassmorphism
        sidebar.style.setProperty('--sidebar-bg-image', `url('../${currentAlbum.cover}')`);

        // Render Album Details
        function renderAlbumDetails(album) {
            albumDetails.innerHTML = `
                <img src="${album.cover}" alt="${album.title}" class="album-cover">
                <h2 class="album-title">${album.title}</h2>
                <p class="album-info">${album.performer}</p>
                <p class="album-info">${album.composer}</p>
                <p class="album-year">${album.year}</p>
                <div class="streaming-links">
                    <!-- Placeholder for streaming links if they existed in JSON -->
                </div>
            `;

            // Inject Theme Toggle into Sidebar Footer if not present
            const footer = document.querySelector('.sidebar-footer');
            if (footer) {
                footer.innerHTML = `
                    <a href="index.html" class="home-link">← Home</a>
                    <button id="sidebar-theme-toggle" class="icon-btn" title="Toggle Dark Mode" style="color: var(--text-light)">
                        <svg class="sun-icon" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>
                        <svg class="moon-icon" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>
                    </button>
                `;

                // Re-attach listener for this specific button
                const sidebarToggle = document.getElementById('sidebar-theme-toggle');
                sidebarToggle.addEventListener('click', () => {
                    document.body.classList.toggle('dark-mode');
                    localStorage.setItem('theme', document.body.classList.contains('dark-mode') ? 'dark' : 'light');
                });
            }
        }

        function renderTrackList(pieces) {
            trackList.innerHTML = '';
            if (pieces.length === 0) {
                trackList.innerHTML = '<li class="track-item" style="justify-content:center; color:var(--text-muted);">No pieces found</li>';
                return;
            }

            pieces.forEach((piece, index) => {
                const li = document.createElement('li');
                li.className = 'track-item';
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
            filteredPieces = contextList;
            currentPieceIndex = index;
            const piece = filteredPieces[currentPieceIndex];

            currentPieceTitle.textContent = piece.title;
            pdfFrame.src = piece.pdf;

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

        // Initialization
        renderAlbumDetails(currentAlbum);
        renderTrackList(filteredPieces);

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
            } else {
                // Search focus shortcut
                if (e.key === '/' && document.activeElement !== searchInput) {
                    e.preventDefault();
                    searchInput.focus();
                }
            }
        });

        // Search Functionality
        searchInput.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase();
            const results = currentAlbum.pieces.filter(piece => {
                return piece.title.toLowerCase().includes(query);
            });
            renderTrackList(results);
        });
    }
});
