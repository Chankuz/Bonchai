# คู่มือการเรียนรู้ BonChai Project

## สารบัญ
1. [ภาพรวมโปรเจกต์](#ภาพรวมโปรเจกต์)
2. [โครงสร้างโปรเจกต์](#โครงสร้างโปรเจกต์)
3. [สถาปัตยกรรมระบบ](#สถาปัตยกรรมระบบ)
4. [ฐานข้อมูล (Database)](#ฐานข้อมูล-database)
5. [Backend (PHP)](#backend-php)
6. [Frontend (HTML/CSS/JavaScript)](#frontend-htmlcssjavascript)
7. [API Endpoints](#api-endpoints)
8. [การทำงานของระบบ](#การทำงานของระบบ)
9. [Security Features](#security-features)
10. [Docker และ Infrastructure](#docker-และ-infrastructure)
11. [วิธีขยายโปรเจกต์](#วิธีขยายโปรเจกต์)

---

## ภาพรวมโปรเจกต์

BonChai เป็นเว็บแอปพลิเคชันแบบ Blog สำหรับค้นหาและบันทึกข้อมูลต้นไม้ โดยมีฟีเจอร์หลัก:
- ดูข้อมูลต้นไม้ได้โดยไม่ต้องล็อกอิน
- ระบบสมัครสมาชิกและล็อกอิน
- เพิ่ม/ลบต้นไม้ในรายการโปรด
- ค้นหาต้นไม้

**Tech Stack:**
- Frontend: HTML5, CSS3, Vanilla JavaScript (ไม่มี Framework)
- Backend: PHP 8.2 (ไม่มี Framework)
- Database: MySQL 8.0
- Infrastructure: Docker + Docker Compose
- Web Server: Apache

---

## โครงสร้างโปรเจกต์

```
Bonchai/
├── api/                    # PHP API Endpoints
│   ├── auth.php           # จัดการ authentication (login, signup, logout)
│   ├── trees.php          # จัดการข้อมูลต้นไม้
│   └── favorites.php      # จัดการรายการโปรด
│
├── assets/                 # ไฟล์ Frontend
│   ├── css/
│   │   └── style.css      # Stylesheet หลัก
│   └── js/
│       ├── auth.js         # ฟังก์ชัน authentication
│       ├── main.js         # หน้าแรก (home page)
│       ├── tree-detail.js  # หน้ารายละเอียดต้นไม้
│       ├── login.js        # หน้า login
│       ├── signup.js       # หน้า signup
│       └── favorites.js    # หน้ารายการโปรด
│
├── config/
│   └── database.php        # Database connection class
│
├── index.php               # หน้าแรก
├── tree.php                # หน้ารายละเอียดต้นไม้
├── login.php               # หน้า login
├── signup.php              # หน้า signup
├── favorites.php           # หน้ารายการโปรด
│
├── Dockerfile              # PHP + Apache container
├── docker-compose.yml      # Docker services configuration
├── init.sql                # Database schema และ sample data
└── README.md               # คู่มือการใช้งาน

```

---

## สถาปัตยกรรมระบบ

### 1. Client-Server Architecture

```
Browser (Frontend)
    ↓ HTTP Requests (AJAX/Fetch)
Apache Web Server
    ↓
PHP Scripts (Backend)
    ↓ PDO/MySQLi
MySQL Database
```

### 2. Request Flow

**ตัวอย่าง: การสมัครสมาชิก**

1. User กรอกฟอร์ม → JavaScript (`signup.js`) จับ event submit
2. JavaScript ส่ง POST request ไปที่ `api/auth.php?action=signup`
3. PHP (`auth.php`) รับข้อมูล → validate → hash password
4. PHP เชื่อมต่อ Database → INSERT ข้อมูล
5. PHP ส่ง JSON response กลับ
6. JavaScript รับ response → แสดงผลหรือ redirect

---

## ฐานข้อมูล (Database)

### Schema Design

#### 1. Table: `users`
เก็บข้อมูลผู้ใช้

```sql
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,      -- ชื่อผู้ใช้ (ไม่ซ้ำ)
    email VARCHAR(100) NOT NULL UNIQUE,         -- อีเมล (ไม่ซ้ำ)
    password VARCHAR(255) NOT NULL,             -- รหัสผ่าน (hashed)
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**Key Points:**
- `UNIQUE` constraint ป้องกัน username/email ซ้ำ
- `password` เก็บเป็น hash (ไม่เก็บ plain text)
- `AUTO_INCREMENT` สำหรับ id

#### 2. Table: `trees`
เก็บข้อมูลต้นไม้

```sql
CREATE TABLE trees (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,                -- ชื่อต้นไม้
    scientific_name VARCHAR(150) NOT NULL,      -- ชื่อวิทยาศาสตร์
    description TEXT NOT NULL,                  -- คำอธิบาย
    care TEXT NOT NULL,                         -- วิธีการดูแล
    image_url VARCHAR(255) NOT NULL,            -- URL รูปภาพ
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### 3. Table: `favorites`
เก็บความสัมพันธ์ user-tree (Many-to-Many)

```sql
CREATE TABLE favorites (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,                       -- FK to users
    tree_id INT NOT NULL,                       -- FK to trees
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY unique_favorite (user_id, tree_id),  -- ป้องกันซ้ำ
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (tree_id) REFERENCES trees(id) ON DELETE CASCADE
);
```

**Key Points:**
- `UNIQUE (user_id, tree_id)` = ผู้ใช้ 1 คน เพิ่มต้นไม้ 1 ต้นได้แค่ครั้งเดียว
- `ON DELETE CASCADE` = ถ้าลบ user/tree จะลบ favorites อัตโนมัติ
- Many-to-Many relationship: User 1 คน → หลาย Trees, Tree 1 ต้น → หลาย Users

### Database Connection

**File: `config/database.php`**

```php
class Database {
    private $host = 'db';              // ชื่อ service ใน docker-compose
    private $db_name = 'bonchai';
    private $username = 'bonchai_user';
    private $password = 'bonchai_password';
    
    public function getConnection() {
        // ใช้ PDO (PHP Data Objects)
        $this->conn = new PDO(
            "mysql:host={$this->host};dbname={$this->db_name};charset=utf8mb4",
            $this->username,
            $this->password,
            [
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,  // Throw exceptions on error
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,  // Return associative arrays
                PDO::ATTR_EMULATE_PREPARES => false  // Use real prepared statements
            ]
        );
        return $this->conn;
    }
}
```

**ทำไมใช้ PDO?**
- Prepared statements ป้องกัน SQL Injection
- Error handling ดีกว่า MySQLi
- รองรับหลาย database types

---

## Backend (PHP)

### 1. Authentication System

**File: `api/auth.php`**

#### Session Management
```php
session_start();  // เริ่ม session
$_SESSION['user_id'] = $user['id'];  // เก็บ user_id
```

**Session คืออะไร?**
- เก็บข้อมูลบน server (ไม่ใช่ cookie)
- ใช้ session ID (cookie) เชื่อมโยงกับข้อมูล
- ปลอดภัยกว่าเก็บข้อมูลใน cookie

#### Password Hashing
```php
// Hash password ก่อนเก็บ
$hashed_password = password_hash($password, PASSWORD_DEFAULT);

// ตรวจสอบ password
if (password_verify($password, $user['password'])) {
    // Login สำเร็จ
}
```

**ทำไมต้อง hash?**
- `password_hash()` ใช้ bcrypt algorithm
- แม้ database ถูก hack ก็ไม่รู้ password จริง
- `PASSWORD_DEFAULT` = ใช้ algorithm ที่ดีที่สุดใน PHP เวอร์ชันนั้น

#### API Response Format
```php
// Success
echo json_encode([
    'success' => true,
    'message' => 'สมัครสมาชิกสำเร็จ',
    'user' => ['id' => 1, 'username' => 'john']
]);

// Error
echo json_encode([
    'success' => false,
    'message' => 'ชื่อผู้ใช้หรืออีเมลนี้ถูกใช้งานแล้ว'
]);
```

### 2. Prepared Statements (ป้องกัน SQL Injection)

**❌ ไม่ปลอดภัย:**
```php
$query = "SELECT * FROM users WHERE username = '$username'";
// ถ้า $username = "admin' OR '1'='1" จะได้ SQL:
// SELECT * FROM users WHERE username = 'admin' OR '1'='1'
// → Login ได้ทุกคน!
```

**✅ ปลอดภัย:**
```php
$stmt = $db->prepare("SELECT * FROM users WHERE username = ?");
$stmt->execute([$username]);
// PHP จะ escape และ validate อัตโนมัติ
```

**ทำไมปลอดภัย?**
- `?` = placeholder, PHP จะ escape ข้อมูลให้
- แม้ใส่ SQL code ก็จะถูก treat เป็น string ธรรมดา

### 3. Error Handling

```php
try {
    $database = new Database();
    $db = $database->getConnection();
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Database error']);
    exit;
}
```

**Best Practices:**
- ใช้ try-catch จับ exceptions
- ส่ง HTTP status code ที่ถูกต้อง (500 = server error)
- ไม่แสดง error message ที่ละเอียดให้ user (security)

---

## Frontend (HTML/CSS/JavaScript)

### 1. HTML Structure

**File: `index.php`**

```html
<header class="header">
    <h1 class="logo">BonChai</h1>
    <nav class="nav">
        <a href="index.php">หน้าหลัก</a>
        <a href="favorites.php">รายการโปรด</a>
    </nav>
</header>

<main class="main">
    <section class="hero">...</section>
    <section class="content-section">
        <div id="trees-grid"></div>  <!-- JavaScript จะ inject HTML ตรงนี้ -->
    </section>
</main>
```

### 2. CSS Architecture

**File: `assets/css/style.css`**

#### CSS Variables (Custom Properties)
```css
:root {
    --primary-green: #2d5016;
    --bg-gray: #f5f5f5;
    --text-dark: #333333;
}
```

**ประโยชน์:**
- เปลี่ยนสีทั้งเว็บได้ที่เดียว
- ง่ายต่อการ maintain

#### Responsive Design
```css
@media (max-width: 768px) {
    .trees-grid {
        grid-template-columns: 1fr;  /* 1 คอลัมน์บนมือถือ */
    }
}
```

**Mobile-First Approach:**
- เริ่มจาก mobile แล้วค่อยขยายเป็น desktop
- ใช้ `min-width` หรือ `max-width` media queries

### 3. JavaScript (Vanilla JS - ไม่ใช้ Framework)

#### Fetch API (Modern AJAX)

**File: `assets/js/signup.js`**

```javascript
const response = await fetch('api/auth.php?action=signup', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({ username, email, password })
});

const data = await response.json();
```

**อธิบาย:**
- `fetch()` = Modern replacement ของ XMLHttpRequest
- `async/await` = ทำให้ asynchronous code อ่านง่าย
- `JSON.stringify()` = แปลง object → JSON string
- `response.json()` = แปลง JSON string → object

#### Event Handling

```javascript
document.addEventListener('DOMContentLoaded', () => {
    // Code นี้จะรันเมื่อ DOM โหลดเสร็จ
    const form = document.getElementById('signup-form');
    form.addEventListener('submit', async (e) => {
        e.preventDefault();  // ป้องกัน form submit ธรรมดา
        // ทำ AJAX request แทน
    });
});
```

**ทำไมต้อง `e.preventDefault()`?**
- ป้องกัน browser submit form ธรรมดา (จะ reload หน้า)
- ใช้ AJAX แทน → ไม่ reload หน้า → UX ดีกว่า

#### DOM Manipulation

```javascript
// Get element
const errorDiv = document.getElementById('error-message');

// Set content
errorDiv.textContent = 'เกิดข้อผิดพลาด';

// Create element
const card = document.createElement('div');
card.className = 'tree-card';
card.innerHTML = `<h3>${tree.name}</h3>`;

// Append to DOM
document.getElementById('trees-grid').appendChild(card);
```

---

## API Endpoints

### Authentication API (`api/auth.php`)

#### 1. Sign Up
```
POST /api/auth.php?action=signup
Body: {
    "username": "john",
    "email": "john@example.com",
    "password": "password123",
    "confirm_password": "password123"
}
Response: {
    "success": true,
    "message": "สมัครสมาชิกสำเร็จ",
    "user": {"id": 1, "username": "john"}
}
```

#### 2. Login
```
POST /api/auth.php?action=login
Body: {
    "username": "john",
    "password": "password123"
}
Response: {
    "success": true,
    "message": "เข้าสู่ระบบสำเร็จ",
    "user": {"id": 1, "username": "john"}
}
```

#### 3. Check Auth Status
```
GET /api/auth.php?action=check
Response: {
    "logged_in": true,
    "user": {"id": 1, "username": "john"}
}
```

#### 4. Logout
```
POST /api/auth.php?action=logout
Response: {
    "success": true,
    "message": "ออกจากระบบสำเร็จ"
}
```

### Trees API (`api/trees.php`)

#### 1. List All Trees
```
GET /api/trees.php?action=list
Response: {
    "success": true,
    "trees": [
        {
            "id": 1,
            "name": "ต้นไม้1",
            "scientific_name": "Arbor Exemplaris",
            "description": "...",
            "image_url": "https://..."
        }
    ]
}
```

#### 2. Get Tree Detail
```
GET /api/trees.php?action=get&id=1
Response: {
    "success": true,
    "tree": {
        "id": 1,
        "name": "ต้นไม้1",
        "scientific_name": "Arbor Exemplaris",
        "description": "...",
        "care": "...",
        "image_url": "https://..."
    }
}
```

### Favorites API (`api/favorites.php`)

**Note: ต้อง login ก่อน (มี session)**

#### 1. Toggle Favorite
```
POST /api/favorites.php?action=toggle
Body: {
    "tree_id": 1
}
Response: {
    "success": true,
    "is_favorite": true,
    "message": "เพิ่มในรายการโปรดแล้ว"
}
```

#### 2. Check if Favorite
```
GET /api/favorites.php?action=check&tree_id=1
Response: {
    "success": true,
    "is_favorite": true
}
```

#### 3. List User's Favorites
```
GET /api/favorites.php?action=list
Response: {
    "success": true,
    "favorites": [
        {
            "id": 1,
            "name": "ต้นไม้1",
            "scientific_name": "Arbor Exemplaris",
            "description": "...",
            "image_url": "https://..."
        }
    ]
}
```

---

## การทำงานของระบบ

### Flow: การสมัครสมาชิก

1. **User กรอกฟอร์ม** (`signup.php`)
   - Username, Email, Password, Confirm Password

2. **JavaScript Validate** (`signup.js`)
   ```javascript
   if (password !== confirmPassword) {
       errorMessage.textContent = 'รหัสผ่านไม่ตรงกัน';
       return;
   }
   ```

3. **ส่ง AJAX Request**
   ```javascript
   fetch('api/auth.php?action=signup', {
       method: 'POST',
       body: JSON.stringify({ username, email, password, confirm_password })
   })
   ```

4. **PHP รับ Request** (`api/auth.php`)
   ```php
   $data = json_decode(file_get_contents('php://input'), true);
   ```

5. **Validate & Hash Password**
   ```php
   $hashed_password = password_hash($password, PASSWORD_DEFAULT);
   ```

6. **Insert to Database**
   ```php
   $stmt = $db->prepare("INSERT INTO users (username, email, password) VALUES (?, ?, ?)");
   $stmt->execute([$username, $email, $hashed_password]);
   ```

7. **Create Session**
   ```php
   $_SESSION['user_id'] = $db->lastInsertId();
   $_SESSION['username'] = $username;
   ```

8. **Return JSON Response**
   ```php
   echo json_encode(['success' => true, 'message' => 'สมัครสมาชิกสำเร็จ']);
   ```

9. **JavaScript Handle Response**
   ```javascript
   if (data.success) {
       window.location.href = 'index.php';  // Redirect
   }
   ```

### Flow: การเพิ่มรายการโปรด

1. **User คลิก Star Icon** (`index.php` หรือ `tree.php`)

2. **JavaScript ส่ง Request**
   ```javascript
   fetch('api/favorites.php?action=toggle', {
       method: 'POST',
       body: JSON.stringify({ tree_id: treeId })
   })
   ```

3. **PHP ตรวจสอบ Session**
   ```php
   if (!isset($_SESSION['user_id'])) {
       http_response_code(401);
       echo json_encode(['success' => false, 'message' => 'กรุณาเข้าสู่ระบบ']);
       exit;
   }
   ```

4. **Check if Already Favorited**
   ```php
   $stmt = $db->prepare("SELECT id FROM favorites WHERE user_id = ? AND tree_id = ?");
   $stmt->execute([$user_id, $tree_id]);
   ```

5. **Toggle (Add or Remove)**
   ```php
   if ($existing) {
       // Remove
       $stmt = $db->prepare("DELETE FROM favorites WHERE user_id = ? AND tree_id = ?");
   } else {
       // Add
       $stmt = $db->prepare("INSERT INTO favorites (user_id, tree_id) VALUES (?, ?)");
   }
   ```

6. **Update UI**
   ```javascript
   if (data.is_favorite) {
       starIcon.classList.add('active');  // สีเหลือง
   } else {
       starIcon.classList.remove('active');  // สีเทา
   }
   ```

---

## Security Features

### 1. SQL Injection Prevention
- ใช้ Prepared Statements ทุก query
- ไม่ใช้ string concatenation ใน SQL

### 2. Password Security
- Hash ด้วย `password_hash()` (bcrypt)
- ไม่เก็บ plain text password

### 3. Session Security
- Session เก็บบน server (ไม่ใช่ cookie)
- ตรวจสอบ session ก่อนเข้าถึง protected resources

### 4. Input Validation
- Validate ทั้งฝั่ง client (JavaScript) และ server (PHP)
- Sanitize input ก่อนใช้

### 5. Error Handling
- ไม่แสดง error message ที่ละเอียดให้ user
- Log errors ไว้ที่ server

### 6. CORS (ถ้าต้องการ)
- ถ้า API ถูกเรียกจาก domain อื่น ต้อง set CORS headers

---

## Docker และ Infrastructure

### Docker Compose Services

**File: `docker-compose.yml`**

```yaml
services:
  web:          # PHP + Apache
    build: .
    ports:
      - "8080:80"  # Map port 8080 (host) → 80 (container)
    volumes:
      - ./:/var/www/html  # Mount project files

  db:           # MySQL
    image: mysql:8.0
    environment:
      MYSQL_ROOT_PASSWORD: rootpassword
      MYSQL_DATABASE: bonchai
    volumes:
      - ./init.sql:/docker-entrypoint-initdb.d/init.sql  # Auto-run on first start

  phpmyadmin:   # Database management tool
    image: phpmyadmin/phpmyadmin
    ports:
      - "8081:80"
```

### Dockerfile

**File: `Dockerfile`**

```dockerfile
FROM php:8.2-apache

# Enable Apache mod_rewrite (สำหรับ URL rewriting)
RUN a2enmod rewrite

# Install MySQL PDO extension
RUN docker-php-ext-install pdo pdo_mysql

# Set Apache document root
ENV APACHE_DOCUMENT_ROOT /var/www/html
RUN sed -ri -e 's!/var/www/html!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/sites-available/*.conf
```

**อธิบาย:**
- `FROM php:8.2-apache` = ใช้ base image ที่มี PHP 8.2 + Apache
- `docker-php-ext-install` = ติดตั้ง PHP extensions
- `ENV` = ตั้ง environment variable
- `RUN sed` = แก้ไข config file

### Network Communication

```
Browser (localhost:8080)
    ↓
Docker Host
    ↓
Container: web (port 80)
    ↓
Container: db (port 3306)  ← เชื่อมต่อด้วยชื่อ service "db"
```

**ทำไมใช้ชื่อ "db"?**
- Docker Compose สร้าง internal network
- Services สามารถเชื่อมต่อกันด้วยชื่อ service
- `$host = 'db'` ใน `database.php` = ชื่อ service

---

## วิธีขยายโปรเจกต์

### 1. เพิ่มฟีเจอร์ใหม่: Comments

#### Step 1: สร้าง Database Table
```sql
CREATE TABLE comments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    tree_id INT NOT NULL,
    comment TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (tree_id) REFERENCES trees(id) ON DELETE CASCADE
);
```

#### Step 2: สร้าง API Endpoint
**File: `api/comments.php`**
```php
<?php
session_start();
require_once __DIR__ . '/../config/database.php';

header('Content-Type: application/json');

if (!isset($_SESSION['user_id'])) {
    http_response_code(401);
    echo json_encode(['success' => false, 'message' => 'กรุณาเข้าสู่ระบบ']);
    exit;
}

try {
    $database = new Database();
    $db = $database->getConnection();
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Database error']);
    exit;
}

$method = $_SERVER['REQUEST_METHOD'];
$action = $_GET['action'] ?? '';
$user_id = $_SESSION['user_id'];

switch ($action) {
    case 'add':
        if ($method === 'POST') {
            $data = json_decode(file_get_contents('php://input'), true);
            $tree_id = intval($data['tree_id'] ?? 0);
            $comment = trim($data['comment'] ?? '');
            
            if (empty($comment)) {
                echo json_encode(['success' => false, 'message' => 'กรุณากรอกความคิดเห็น']);
                exit;
            }
            
            $stmt = $db->prepare("INSERT INTO comments (user_id, tree_id, comment) VALUES (?, ?, ?)");
            if ($stmt->execute([$user_id, $tree_id, $comment])) {
                echo json_encode(['success' => true, 'message' => 'เพิ่มความคิดเห็นสำเร็จ']);
            }
        }
        break;
        
    case 'list':
        if ($method === 'GET') {
            $tree_id = intval($_GET['tree_id'] ?? 0);
            $stmt = $db->prepare("
                SELECT c.*, u.username 
                FROM comments c
                JOIN users u ON c.user_id = u.id
                WHERE c.tree_id = ?
                ORDER BY c.created_at DESC
            ");
            $stmt->execute([$tree_id]);
            $comments = $stmt->fetchAll();
            echo json_encode(['success' => true, 'comments' => $comments]);
        }
        break;
}
```

#### Step 3: เพิ่ม UI
**File: `tree.php`** (เพิ่มส่วนแสดง comments)
```html
<div id="comments-section">
    <h3>ความคิดเห็น</h3>
    <div id="comments-list"></div>
    <form id="comment-form">
        <textarea id="comment-text" placeholder="เขียนความคิดเห็น..."></textarea>
        <button type="submit">ส่งความคิดเห็น</button>
    </form>
</div>
```

#### Step 4: เพิ่ม JavaScript
**File: `assets/js/tree-detail.js`** (เพิ่มฟังก์ชัน)
```javascript
async function loadComments() {
    const response = await fetch(`api/comments.php?action=list&tree_id=${treeId}`);
    const data = await response.json();
    if (data.success) {
        displayComments(data.comments);
    }
}

async function addComment(commentText) {
    const response = await fetch('api/comments.php?action=add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tree_id: treeId, comment: commentText })
    });
    const data = await response.json();
    if (data.success) {
        loadComments();  // Reload comments
    }
}
```

### 2. เพิ่ม Pagination

**Backend:**
```php
$page = intval($_GET['page'] ?? 1);
$limit = 10;
$offset = ($page - 1) * $limit;

$stmt = $db->prepare("SELECT * FROM trees LIMIT ? OFFSET ?");
$stmt->execute([$limit, $offset]);
```

**Frontend:**
```javascript
let currentPage = 1;

function loadTrees(page) {
    fetch(`api/trees.php?action=list&page=${page}`)
        .then(response => response.json())
        .then(data => {
            displayTrees(data.trees);
            updatePagination(data.totalPages, page);
        });
}
```

### 3. เพิ่ม Image Upload

**ใช้ FormData:**
```javascript
const formData = new FormData();
formData.append('image', fileInput.files[0]);
formData.append('tree_id', treeId);

fetch('api/upload.php', {
    method: 'POST',
    body: formData  // ไม่ต้อง set Content-Type, browser จะ set ให้
});
```

**PHP:**
```php
$uploadDir = __DIR__ . '/../uploads/';
$fileName = uniqid() . '_' . $_FILES['image']['name'];
move_uploaded_file($_FILES['image']['tmp_name'], $uploadDir . $fileName);
```

---

## Best Practices ที่ใช้ในโปรเจกต์นี้

### 1. Separation of Concerns
- **Config** → `config/database.php`
- **API Logic** → `api/*.php`
- **Presentation** → `*.php` (HTML)
- **Styling** → `assets/css/`
- **Behavior** → `assets/js/`

### 2. DRY (Don't Repeat Yourself)
- Database connection ใช้ class เดียว
- Error handling pattern เดียวกันทุก API

### 3. Security First
- Prepared statements ทุก query
- Password hashing
- Input validation

### 4. Error Handling
- Try-catch สำหรับ database operations
- Proper HTTP status codes
- User-friendly error messages

### 5. Code Organization
- ไฟล์แยกตามหน้าที่
- Naming convention สม่ำเสมอ
- Comments ที่จำเป็น

---

## คำถามที่พบบ่อย (FAQ)

### Q: ทำไมไม่ใช้ Framework?
**A:** เพื่อเรียนรู้พื้นฐาน PHP/JavaScript ก่อน แล้วค่อยไปใช้ Framework ภายหลัง

### Q: ทำไมใช้ Vanilla JavaScript แทน jQuery/React?
**A:** เพื่อเข้าใจ DOM manipulation และ Fetch API ก่อน

### Q: Session vs Cookie ต่างกันยังไง?
**A:** 
- **Session**: เก็บข้อมูลบน server, ใช้ session ID (cookie) เชื่อมโยง
- **Cookie**: เก็บข้อมูลบน client (browser)

### Q: ทำไมต้อง hash password?
**A:** ถ้า database ถูก hack, hacker จะไม่รู้ password จริง (รู้แค่ hash)

### Q: Prepared Statements คืออะไร?
**A:** วิธีเขียน SQL ที่ปลอดภัย โดยแยก SQL code กับ data ออกจากกัน

---

## ทรัพยากรเพิ่มเติม

### PHP
- [PHP Manual](https://www.php.net/manual/en/)
- [PDO Documentation](https://www.php.net/manual/en/book.pdo.php)

### JavaScript
- [MDN Web Docs](https://developer.mozilla.org/)
- [Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)

### MySQL
- [MySQL Documentation](https://dev.mysql.com/doc/)
- [SQL Tutorial](https://www.w3schools.com/sql/)

### Docker
- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose](https://docs.docker.com/compose/)

---

## สรุป

โปรเจกต์ BonChai นี้เป็นตัวอย่างที่ดีของ:
- ✅ Full-stack web application
- ✅ RESTful API design
- ✅ Security best practices
- ✅ Modern JavaScript (async/await, Fetch API)
- ✅ Docker containerization
- ✅ Database design (normalization, relationships)

**Next Steps:**
1. ลองเพิ่มฟีเจอร์ใหม่ (comments, ratings, etc.)
2. เพิ่ม unit tests
3. เรียนรู้ Framework (Laravel, React, etc.)
4. เรียนรู้ deployment (AWS, Heroku, etc.)

**Happy Coding! 🚀**

