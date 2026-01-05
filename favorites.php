<?php
session_start();
if (!isset($_SESSION['user_id'])) {
    header('Location: login.php');
    exit;
}
?>
<!DOCTYPE html>
<html lang="th">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>BonChai - รายการโปรด</title>
    <link rel="stylesheet" href="assets/css/style.css">
</head>
<body>
    <header class="header">
        <div class="container">
            <div class="header-content">
                <a href="index.php" class="logo">BonChai</a>
                <nav class="nav">
                    <a href="index.php" class="nav-link">หน้าหลัก</a>
                    <a href="favorites.php" class="nav-link active">รายการโปรด</a>
                    <span class="nav-link" id="user-link">ชื่อผู้ใช้ที่ Login</span>
                    <a href="login.php" class="nav-link" id="login-link" style="display: none;">เข้าสู่ระบบ</a>
                    <a href="signup.php" class="nav-link" id="signup-link" style="display: none;">สมัครสมาชิก</a>
                </nav>
            </div>
        </div>
    </header>

    <main class="main">
        <div class="container">
            <div class="section-header">
                <h2 class="section-title">รายการโปรดของฉัน</h2>
            </div>

            <div id="favorites-grid" class="trees-grid">
                <!-- Favorites will be loaded here -->
            </div>

            <div id="loading" class="loading">กำลังโหลด...</div>
            <div id="no-favorites" class="no-results" style="display: none;">
                <p>คุณยังไม่มีรายการโปรด</p>
                <a href="index.php" class="button-link">ไปดูต้นไม้</a>
            </div>
        </div>
    </main>

    <script src="assets/js/auth.js"></script>
    <script src="assets/js/favorites.js"></script>
</body>
</html>

