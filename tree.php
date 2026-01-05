<?php
session_start();
$tree_id = $_GET['id'] ?? 0;
?>
<!DOCTYPE html>
<html lang="th">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>BonChai - รายละเอียดต้นไม้</title>
    <link rel="stylesheet" href="assets/css/style.css">
</head>
<body>
    <header class="header">
        <div class="container">
            <div class="header-content">
                <h1 class="logo">BonChai</h1>
                <nav class="nav">
                    <a href="index.php" class="nav-link">หน้าหลัก</a>
                    <a href="favorites.php" class="nav-link" id="favorites-link">รายการโปรด</a>
                    <span class="nav-link" id="user-link">ชื่อผู้ใช้ที่ Login</span>
                    <a href="login.php" class="nav-link" id="login-link">เข้าสู่ระบบ</a>
                    <a href="signup.php" class="nav-link" id="signup-link">สมัครสมาชิก</a>
                </nav>
            </div>
        </div>
    </header>

    <main class="main">
        <div class="container">
            <div id="tree-detail" class="tree-detail">
                <!-- Tree details will be loaded here -->
            </div>
            <div id="loading" class="loading">กำลังโหลด...</div>
        </div>
    </main>

    <script>
        const treeId = <?php echo intval($tree_id); ?>;
    </script>
    <script src="assets/js/auth.js"></script>
    <script src="assets/js/tree-detail.js"></script>
</body>
</html>

