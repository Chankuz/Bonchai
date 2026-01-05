// Favorites page functionality
let favoritedTreeIds = [];

// Load favorites
async function loadFavorites() {
    const loading = document.getElementById('loading');
    const favoritesGrid = document.getElementById('favorites-grid');
    const noFavorites = document.getElementById('no-favorites');

    try {
        loading.style.display = 'block';
        favoritesGrid.innerHTML = '';

        const response = await fetch('api/favorites.php?action=list');
        const data = await response.json();

        if (data.success) {
            if (data.favorites.length === 0) {
                favoritesGrid.style.display = 'none';
                noFavorites.style.display = 'block';
            } else {
                favoritesGrid.style.display = 'grid';
                noFavorites.style.display = 'none';
                displayFavorites(data.favorites);
                favoritedTreeIds = data.favorites.map(f => f.id);
            }
        }
    } catch (error) {
        console.error('Error loading favorites:', error);
        favoritesGrid.innerHTML = '<p>เกิดข้อผิดพลาดในการโหลดข้อมูล</p>';
    } finally {
        loading.style.display = 'none';
    }
}

// Display favorites
function displayFavorites(favorites) {
    const favoritesGrid = document.getElementById('favorites-grid');

    favoritesGrid.innerHTML = favorites.map(tree => `
        <div class="tree-card" onclick="window.location.href='tree.php?id=${tree.id}'">
            <img src="${tree.image_url}" alt="${tree.name}" class="tree-card-image" onerror="this.src='https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?w=800&h=600&fit=crop'">
            <div class="tree-card-content">
                <div class="tree-card-header">
                    <h3 class="tree-card-title">${escapeHtml(tree.name)}</h3>
                    <span class="tree-card-more" onclick="event.stopPropagation(); window.location.href='tree.php?id=${tree.id}'">
                        เพิ่มเติม
                        <svg class="star-icon active" 
                             onclick="event.stopPropagation(); toggleFavorite(${tree.id}, event)" 
                             width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                        </svg>
                    </span>
                </div>
                <p class="tree-card-description">${escapeHtml(tree.description)}</p>
            </div>
        </div>
    `).join('');
}

// Toggle favorite
async function toggleFavorite(treeId, event) {
    event.stopPropagation();
    
    try {
        const response = await fetch('api/favorites.php?action=toggle', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ tree_id: treeId })
        });

        const data = await response.json();
        if (data.success) {
            // Reload favorites after toggle
            await loadFavorites();
        } else {
            alert(data.message || 'เกิดข้อผิดพลาด');
        }
    } catch (error) {
        console.error('Error toggling favorite:', error);
        alert('เกิดข้อผิดพลาดในการอัพเดทรายการโปรด');
    }
}

// Escape HTML
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadFavorites();
});

