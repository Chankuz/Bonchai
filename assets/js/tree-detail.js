// Tree detail page functionality
let isFavorite = false;

// Load tree details
async function loadTreeDetail() {
    const loading = document.getElementById('loading');
    const treeDetail = document.getElementById('tree-detail');

    if (!treeId || treeId <= 0) {
        treeDetail.innerHTML = '<p>ไม่พบข้อมูลต้นไม้</p>';
        loading.style.display = 'none';
        return;
    }

    try {
        loading.style.display = 'block';
        treeDetail.innerHTML = '';

        const response = await fetch(`api/trees.php?action=get&id=${treeId}`);
        const data = await response.json();

        if (data.success && data.tree) {
            displayTreeDetail(data.tree);
            await checkFavorite();
        } else {
            treeDetail.innerHTML = '<p>ไม่พบข้อมูลต้นไม้</p>';
        }
    } catch (error) {
        console.error('Error loading tree detail:', error);
        treeDetail.innerHTML = '<p>เกิดข้อผิดพลาดในการโหลดข้อมูล</p>';
    } finally {
        loading.style.display = 'none';
    }
}

// Display tree detail
function displayTreeDetail(tree) {
    const treeDetail = document.getElementById('tree-detail');
    
    treeDetail.innerHTML = `
        <div class="tree-detail-header">
            <h1 class="tree-detail-title">${escapeHtml(tree.name)}</h1>
            <svg class="star-icon ${isFavorite ? 'active' : 'inactive'}" 
                 onclick="toggleFavorite(${tree.id}, event)" 
                 width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="cursor: pointer;">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
            </svg>
        </div>
        <img src="${tree.image_url}" alt="${tree.name}" class="tree-detail-image" onerror="this.src='https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?w=800&h=600&fit=crop'">
        <div class="tree-detail-info">
            <p class="tree-detail-scientific">${escapeHtml(tree.scientific_name)}</p>
        </div>
        <div class="tree-detail-section">
            <h2 class="tree-detail-section-title">รายละเอียด</h2>
            <div class="tree-detail-section-content">${escapeHtml(tree.description)}</div>
        </div>
        <div class="tree-detail-section">
            <h2 class="tree-detail-section-title">วิธีการปลูกและการดูแล</h2>
            <div class="tree-detail-section-content">${escapeHtml(tree.care)}</div>
        </div>
    `;
}

// Check if tree is favorited
async function checkFavorite() {
    try {
        const authData = await Auth.checkAuth();
        if (!authData.logged_in) {
            isFavorite = false;
            updateStarIcon();
            return;
        }

        const response = await fetch(`api/favorites.php?action=check&tree_id=${treeId}`);
        const data = await response.json();
        
        if (data.success) {
            isFavorite = data.is_favorite;
            updateStarIcon();
        }
    } catch (error) {
        console.error('Error checking favorite:', error);
    }
}

// Toggle favorite
async function toggleFavorite(treeId, event) {
    if (event) event.stopPropagation();
    
    try {
        const authData = await Auth.checkAuth();
        if (!authData.logged_in) {
            alert('กรุณาเข้าสู่ระบบเพื่อเพิ่มรายการโปรด');
            window.location.href = 'login.php';
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
            isFavorite = data.is_favorite;
            updateStarIcon();
        } else {
            alert(data.message || 'เกิดข้อผิดพลาด');
        }
    } catch (error) {
        console.error('Error toggling favorite:', error);
        alert('เกิดข้อผิดพลาดในการอัพเดทรายการโปรด');
    }
}

// Update star icon
function updateStarIcon() {
    const starIcon = document.querySelector('.star-icon');
    if (starIcon) {
        if (isFavorite) {
            starIcon.classList.remove('inactive');
            starIcon.classList.add('active');
        } else {
            starIcon.classList.remove('active');
            starIcon.classList.add('inactive');
        }
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
    loadTreeDetail();
});

