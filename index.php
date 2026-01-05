<?php
session_start();
?>
<!DOCTYPE html>
<html lang="th">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>BonChai - หน้าหลัก</title>
    <link rel="stylesheet" href="assets/css/style.css">
</head>
<body>
    <header class="header">
        <div class="container">
            <div class="header-content">
                <h1 class="logo">BonChai</h1>
                <nav class="nav">
                    <a href="index.php" class="nav-link active">หน้าหลัก</a>
                    <a href="favorites.php" class="nav-link" id="favorites-link">รายการโปรด</a>
                    <span class="nav-link" id="user-link">ชื่อผู้ใช้ที่ Login</span>
                    <a href="login.php" class="nav-link" id="login-link">เข้าสู่ระบบ</a>
                    <a href="signup.php" class="nav-link" id="signup-link">สมัครสมาชิก</a>
                </nav>
            </div>
        </div>
    </header>

    <main class="main">
        <section class="hero">
            <div class="hero-overlay"></div>
            <div class="hero-content">
                <h2 class="hero-title">BonChai</h2>
                <p class="hero-description">
                    BonChai คือเว็บไซต์ให้ความรู้เกี่ยวกับต้นไม้และพืชพรรณต่าง ๆ
                    ที่ถูกออกแบบมาเพื่อให้ผู้ใช้งานสามารถ ค้นหา อ่าน และบันทึกข้อมูลต้นไม้ที่ตนเองสนใจได้
                </p>
            </div>
        </section>

        <section class="content-section">
            <div class="container">
                <div class="search-container">
                    <input type="text" id="search-input" class="search-input" placeholder="ค้นหา...">
                    <button id="search-btn" class="search-btn">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <circle cx="11" cy="11" r="8"></circle>
                            <path d="m21 21-4.35-4.35"></path>
                        </svg>
                    </button>
                </div>

                <div class="section-header">
                    <h2 class="section-title">แนะนำให้อ่าน</h2>
                </div>

                <div id="trees-grid" class="trees-grid">
                    <!-- Trees will be loaded here -->
                </div>

                <div id="loading" class="loading">กำลังโหลด...</div>
                <div id="no-results" class="no-results" style="display: none;">ไม่พบผลลัพธ์</div>
            </div>
        </section>
    </main>

    <script src="assets/js/auth.js"></script>
    <script src="assets/js/main.js"></script>
</body>
</html>

