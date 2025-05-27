// Dark mode toggle functionality
const darkModeToggle = document.getElementById('darkModeToggle');
const html = document.documentElement;
const icon = darkModeToggle.querySelector('i');

// Check for saved theme preference
const savedTheme = localStorage.getItem('theme');
if (savedTheme) {
    html.setAttribute('data-bs-theme', savedTheme);
    updateIcon(savedTheme === 'dark');
}

// Toggle theme
darkModeToggle.addEventListener('click', () => {
    const isDark = html.getAttribute('data-bs-theme') === 'dark';
    const newTheme = isDark ? 'light' : 'dark';
    
    html.setAttribute('data-bs-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateIcon(!isDark);
});

// Update icon based on theme
function updateIcon(isDark) {
    icon.className = isDark ? 'fas fa-sun' : 'fas fa-moon';
}