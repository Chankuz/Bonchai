# Quick Reference - BonChai Project

## 📁 โครงสร้างไฟล์

```
api/              → PHP API endpoints
assets/css/       → Stylesheets
assets/js/        → JavaScript files
config/           → Configuration files
*.php             → HTML pages
```

## 🔌 API Endpoints

### Authentication
- `POST /api/auth.php?action=signup` - สมัครสมาชิก
- `POST /api/auth.php?action=login` - เข้าสู่ระบบ
- `GET /api/auth.php?action=check` - ตรวจสอบสถานะ login
- `POST /api/auth.php?action=logout` - ออกจากระบบ

### Trees
- `GET /api/trees.php?action=list` - รายการต้นไม้ทั้งหมด
- `GET /api/trees.php?action=get&id=1` - รายละเอียดต้นไม้

### Favorites (ต้อง login)
- `POST /api/favorites.php?action=toggle` - เพิ่ม/ลบรายการโปรด
- `GET /api/favorites.php?action=check&tree_id=1` - ตรวจสอบว่าเป็นรายการโปรดหรือไม่
- `GET /api/favorites.php?action=list` - รายการโปรดของ user

## 🗄️ Database Tables

### users
- `id` (INT, PK, AUTO_INCREMENT)
- `username` (VARCHAR(50), UNIQUE)
- `email` (VARCHAR(100), UNIQUE)
- `password` (VARCHAR(255)) - hashed
- `created_at` (TIMESTAMP)

### trees
- `id` (INT, PK, AUTO_INCREMENT)
- `name` (VARCHAR(100))
- `scientific_name` (VARCHAR(150))
- `description` (TEXT)
- `care` (TEXT)
- `image_url` (VARCHAR(255))
- `created_at` (TIMESTAMP)

### favorites
- `id` (INT, PK, AUTO_INCREMENT)
- `user_id` (INT, FK → users.id)
- `tree_id` (INT, FK → trees.id)
- `UNIQUE(user_id, tree_id)`
- `created_at` (TIMESTAMP)

## 💻 Code Snippets

### PHP: Database Connection
```php
require_once __DIR__ . '/../config/database.php';
$database = new Database();
$db = $database->getConnection();
```

### PHP: Prepared Statement
```php
$stmt = $db->prepare("SELECT * FROM users WHERE id = ?");
$stmt->execute([$user_id]);
$user = $stmt->fetch();
```

### PHP: Insert Data
```php
$stmt = $db->prepare("INSERT INTO users (username, email, password) VALUES (?, ?, ?)");
$stmt->execute([$username, $email, $hashed_password]);
$new_id = $db->lastInsertId();
```

### PHP: Password Hash
```php
$hashed = password_hash($password, PASSWORD_DEFAULT);
$is_valid = password_verify($password, $hashed);
```

### PHP: JSON Response
```php
header('Content-Type: application/json');
echo json_encode(['success' => true, 'data' => $data]);
```

### JavaScript: Fetch API (GET)
```javascript
const response = await fetch('api/trees.php?action=list');
const data = await response.json();
```

### JavaScript: Fetch API (POST)
```javascript
const response = await fetch('api/auth.php?action=signup', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, email, password })
});
const data = await response.json();
```

### JavaScript: Error Handling
```javascript
try {
    const response = await fetch('api/...');
    if (!response.ok) throw new Error('HTTP error');
    const data = await response.json();
} catch (error) {
    console.error('Error:', error);
}
```

### JavaScript: DOM Manipulation
```javascript
// Get element
const el = document.getElementById('id');

// Set text
el.textContent = 'Hello';

// Set HTML
el.innerHTML = '<h1>Title</h1>';

// Create element
const div = document.createElement('div');
div.className = 'card';
parent.appendChild(div);
```

### JavaScript: Event Listener
```javascript
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('form');
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        // Handle form
    });
});
```

## 🔐 Security Checklist

- ✅ ใช้ Prepared Statements (ป้องกัน SQL Injection)
- ✅ Hash passwords (password_hash)
- ✅ Validate input (ทั้ง client และ server)
- ✅ ใช้ Session สำหรับ authentication
- ✅ ตรวจสอบ session ก่อนเข้าถึง protected resources
- ✅ ไม่แสดง error message ที่ละเอียดให้ user
- ✅ ใช้ HTTPS ใน production

## 🐳 Docker Commands

```bash
# Start containers
docker-compose up -d

# Stop containers
docker-compose down

# View logs
docker-compose logs -f web
docker-compose logs -f db

# Restart service
docker-compose restart web

# Rebuild after changes
docker-compose up -d --build

# Execute command in container
docker-compose exec web php -v
docker-compose exec db mysql -u root -p
```

## 📝 Common Patterns

### PHP: Check if logged in
```php
session_start();
if (!isset($_SESSION['user_id'])) {
    http_response_code(401);
    echo json_encode(['success' => false, 'message' => 'กรุณาเข้าสู่ระบบ']);
    exit;
}
```

### PHP: Get JSON input
```php
$data = json_decode(file_get_contents('php://input'), true);
$username = $data['username'] ?? '';
```

### PHP: Error handling
```php
try {
    // Database operation
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Error']);
    exit;
}
```

### JavaScript: Update UI after API call
```javascript
if (data.success) {
    // Update UI
    element.classList.add('active');
    // Or redirect
    window.location.href = 'index.php';
} else {
    // Show error
    errorDiv.textContent = data.message;
}
```

## 🎨 CSS Variables

```css
--primary-green: #2d5016;
--light-green: #4a7c2a;
--bg-gray: #f5f5f5;
--white: #ffffff;
--text-dark: #333333;
--text-light: #666666;
--star-yellow: #ffd700;
--error-red: #dc3545;
```

## 🔄 Request Flow

1. User action (click, submit)
2. JavaScript event handler
3. Fetch API request
4. PHP receives request
5. Database query
6. JSON response
7. JavaScript updates UI

## 📚 Key Concepts

- **Session**: เก็บข้อมูลบน server, ใช้ session ID เชื่อมโยง
- **Prepared Statements**: วิธีเขียน SQL ที่ปลอดภัย
- **Password Hashing**: แปลง password เป็น hash (ไม่สามารถย้อนกลับได้)
- **AJAX**: ส่ง request โดยไม่ reload หน้า
- **RESTful API**: API ที่ใช้ HTTP methods (GET, POST, etc.)
- **Many-to-Many**: ความสัมพันธ์ระหว่าง users และ trees (ผ่าน favorites table)

## 🚀 Next Steps

1. เพิ่มฟีเจอร์ใหม่ (comments, search, pagination)
2. เพิ่ม validation ที่ละเอียดขึ้น
3. เพิ่ม error logging
4. เพิ่ม unit tests
5. เรียนรู้ Framework (Laravel, React)

