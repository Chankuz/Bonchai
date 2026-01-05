<?php
session_start();
if (isset($_SESSION['user_id'])) {
    header('Location: index.php');
    exit;
}
?>
<!DOCTYPE html>
<html lang="th">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>BonChai - สมัครสมาชิก</title>
    <link rel="stylesheet" href="assets/css/style.css">
</head>
<body>
    <header class="header">
        <div class="container">
            <div class="header-content">
                <h1 class="logo">BonChai</h1>
                <nav class="nav">
                    <a href="index.php" class="nav-link">หน้าหลัก</a>
                </nav>
            </div>
        </div>
    </header>

    <main class="main auth-main">
        <div class="auth-container">
            <h2 class="auth-title">Sign Up</h2>
            <form id="signup-form" class="auth-form">
                <div class="form-group">
                    <input type="text" id="username" name="username" class="form-input" placeholder="Username" required>
                </div>
                <div class="form-group">
                    <input type="email" id="email" name="email" class="form-input" placeholder="E-mail address" required>
                </div>
                <div class="form-group">
                    <input type="password" id="password" name="password" class="form-input" placeholder="Password" required>
                    <button type="button" class="password-toggle" id="password-toggle">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                            <circle cx="12" cy="12" r="3"></circle>
                        </svg>
                    </button>
                </div>
                <div class="form-group">
                    <input type="password" id="confirm-password" name="confirm_password" class="form-input" placeholder="Confirm password" required>
                    <button type="button" class="password-toggle" id="confirm-password-toggle">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                            <circle cx="12" cy="12" r="3"></circle>
                        </svg>
                    </button>
                </div>
                <div id="error-message" class="error-message"></div>
                <button type="submit" class="auth-button">Sign Up</button>
                <p class="auth-link-text">
                    มีบัญชีอยู่แล้ว? <a href="login.php" class="auth-link">เข้าสู่ระบบ</a>
                </p>
            </form>
        </div>
    </main>

    <script src="assets/js/auth.js"></script>
    <script src="assets/js/signup.js"></script>
</body>
</html>

