// Main page functionality
let allTrees = [];
let favoritedTreeIds = [];

// Load trees
async function loadTrees() {
    const loading = document.getElementById('loading');
    const treesGrid = document.getElementById('trees-grid');
    const noResults = document.getElementById('no-results');

    try {
        loading.style.display = 'block';
        treesGrid.innerHTML = '';

        const response = await fetch('api/trees.php?action=list');
        const data = await response.json();

        if (data.success) {
            allTrees = data.trees;
            displayTrees(allTrees);
            
            // Check favorites if user is logged in
            await checkFavorites();
        }
    } catch (error) {
        console.error('Error loading trees:', error);
        treesGrid.innerHTML = '<p>เกิดข้อผิดพลาดในการโหลดข้อมูล</p>';
    } finally {
        loading.style.display = 'none';
    }
}

// Display trees
function displayTrees(trees) {
    const treesGrid = document.getElementById('trees-grid');
    const noResults = document.getElementById('no-results');

    if (trees.length === 0) {
        treesGrid.style.display = 'none';
        noResults.style.display = 'block';
        return;
    }

    treesGrid.style.display = 'grid';
    noResults.style.display = 'none';

    treesGrid.innerHTML = trees.map(tree => `
        <div class="tree-card" onclick="window.location.href='tree.php?id=${tree.id}'">
            <img src="${tree.image_url}" alt="${tree.name}" class="tree-card-image" onerror="this.src='https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?w=800&h=600&fit=crop'">
            <div class="tree-card-content">
                <div class="tree-card-header">
                    <h3 class="tree-card-title">${escapeHtml(tree.name)}</h3>
                    <span class="tree-card-more" onclick="event.stopPropagation(); window.location.href='tree.php?id=${tree.id}'">
                        เพิ่มเติม
                        <svg class="star-icon ${favoritedTreeIds.includes(tree.id) ? 'active' : 'inactive'}" 
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

// Check favorites
async function checkFavorites() {
    try {
        const authData = await Auth.checkAuth();
        if (!authData.logged_in) {
            favoritedTreeIds = [];
            return;
        }

        const treeIds = allTrees.map(t => t.id);
        if (treeIds.length === 0) return;

        const response = await fetch('api/favorites.php?action=check-multiple', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ tree_ids: treeIds })
        });

        const data = await response.json();
        if (data.success) {
            favoritedTreeIds = data.favorites;
            displayTrees(allTrees);
        }
    } catch (error) {
        console.error('Error checking favorites:', error);
    }
}

// Toggle favorite
async function toggleFavorite(treeId, event) {
    event.stopPropagation();
    
    try {
        const authData = await Auth.checkAuth();
        if (!authData.logged_in) {
            alert('กรุณาเข้าสู่ระบบเพื่อเพิ่มรายการโปรด');
            return;
        }

        const response = await fetch('api/favorites.php?action=toggle', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ tree_id: treeId })
        });

        const data = await response.json();
        if (data.success) {
            if (data.is_favorite) {
                favoritedTreeIds.push(treeId);
            } else {
                favoritedTreeIds = favoritedTreeIds.filter(id => id !== treeId);
            }
            displayTrees(allTrees);
        } else {
            alert(data.message || 'เกิดข้อผิดพลาด');
        }
    } catch (error) {
        console.error('Error toggling favorite:', error);
        alert('เกิดข้อผิดพลาดในการอัพเดทรายการโปรด');
    }
}

// Search functionality
function setupSearch() {
    const searchInput = document.getElementById('search-input');
    const searchBtn = document.getElementById('search-btn');

    const performSearch = () => {
        const query = searchInput.value.toLowerCase().trim();
        if (query === '') {
            displayTrees(allTrees);
            return;
        }

        const filtered = allTrees.filter(tree => 
            tree.name.toLowerCase().includes(query) ||
            tree.scientific_name.toLowerCase().includes(query) ||
            tree.description.toLowerCase().includes(query)
        );

        displayTrees(filtered);
    };

    if (searchBtn) {
        searchBtn.addEventListener('click', performSearch);
    }

    if (searchInput) {
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                performSearch();
            }
        });
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
    loadTrees();
    setupSearch();
});

