// Authentication utility functions
const Auth = {
    checkAuth: async () => {
        try {
            const response = await fetch('api/auth.php?action=check');
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Auth check error:', error);
            return { logged_in: false };
        }
    },

    updateNav: async () => {
        const authData = await Auth.checkAuth();
        const userLink = document.getElementById('user-link');
        const loginLink = document.getElementById('login-link');
        const signupLink = document.getElementById('signup-link');
        const favoritesLink = document.getElementById('favorites-link');

        if (authData.logged_in) {
            if (userLink) {
                userLink.textContent = authData.user.username;
                userLink.style.display = 'inline';
            }
            if (loginLink) loginLink.style.display = 'none';
            if (signupLink) signupLink.style.display = 'none';
            if (favoritesLink) favoritesLink.style.display = 'inline';
        } else {
            if (userLink) userLink.style.display = 'none';
            if (loginLink) loginLink.style.display = 'inline';
            if (signupLink) signupLink.style.display = 'inline';
            if (favoritesLink) {
                favoritesLink.style.display = 'inline';
                favoritesLink.addEventListener('click', (e) => {
                    e.preventDefault();
                    window.location.href = 'login.php';
                });
            }
        }
    },

    logout: async () => {
        try {
            const response = await fetch('api/auth.php?action=logout', {
                method: 'POST'
            });
            const data = await response.json();
            if (data.success) {
                window.location.href = 'index.php';
            }
        } catch (error) {
            console.error('Logout error:', error);
        }
    }
};

// Initialize auth on page load
document.addEventListener('DOMContentLoaded', () => {
    Auth.updateNav();
});

