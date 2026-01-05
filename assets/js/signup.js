// Signup page functionality
document.addEventListener('DOMContentLoaded', () => {
    const signupForm = document.getElementById('signup-form');
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirm-password');
    const passwordToggle = document.getElementById('password-toggle');
    const confirmPasswordToggle = document.getElementById('confirm-password-toggle');
    const errorMessage = document.getElementById('error-message');

    // Password toggles
    if (passwordToggle) {
        passwordToggle.addEventListener('click', () => {
            const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordInput.setAttribute('type', type);
        });
    }

    if (confirmPasswordToggle) {
        confirmPasswordToggle.addEventListener('click', () => {
            const type = confirmPasswordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            confirmPasswordInput.setAttribute('type', type);
        });
    }


    // Form submission
    if (signupForm) {
        signupForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            errorMessage.textContent = '';

            const username = document.getElementById('username').value.trim();
            const email = document.getElementById('email').value.trim();
            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirm-password').value;

            // Validation
            if (!username || !email || !password || !confirmPassword) {
                errorMessage.textContent = 'กรุณากรอกข้อมูลให้ครบถ้วน';
                return;
            }

            if (password !== confirmPassword) {
                errorMessage.textContent = 'รหัสผ่านไม่ตรงกัน';
                return;
            }

            if (password.length < 6) {
                errorMessage.textContent = 'รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร';
                return;
            }

            if (!email.includes('@')) {
                errorMessage.textContent = 'รูปแบบอีเมลไม่ถูกต้อง';
                return;
            }

            const submitButton = signupForm.querySelector('button[type="submit"]');
            submitButton.disabled = true;
            submitButton.textContent = 'กำลังสมัครสมาชิก...';

            try {
                const response = await fetch('api/auth.php?action=signup', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ username, email, password, confirm_password: confirmPassword })
                });

                // Check if response is ok
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                // Get response text first to handle potential non-JSON responses
                const responseText = await response.text();
                let data;

                try {
                    data = JSON.parse(responseText);
                } catch (parseError) {
                    console.error('JSON parse error:', parseError);
                    console.error('Response text:', responseText);
                    throw new Error('Invalid JSON response from server');
                }

                if (data.success) {
                    window.location.href = 'index.php';
                } else {
                    errorMessage.textContent = data.message || 'เกิดข้อผิดพลาดในการสมัครสมาชิก';
                    submitButton.disabled = false;
                    submitButton.textContent = 'Sign Up';
                }
            } catch (error) {
                console.error('Signup error:', error);
                errorMessage.textContent = 'เกิดข้อผิดพลาดในการเชื่อมต่อ: ' + error.message;
                submitButton.disabled = false;
                submitButton.textContent = 'Sign Up';
            }
        });
    }
});

