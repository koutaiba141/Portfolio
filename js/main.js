// Mobile menu functionality
document.addEventListener('DOMContentLoaded', function() {
    // Add mobile menu button
    const navbar = document.querySelector('.navbar');
    const mobileMenuBtn = document.createElement('button');
    mobileMenuBtn.className = 'mobile-menu-btn';
    mobileMenuBtn.innerHTML = '☰';
    navbar.insertBefore(mobileMenuBtn, navbar.querySelector('.navbar-links'));

    // Toggle mobile menu
    mobileMenuBtn.addEventListener('click', function() {
        const navbarLinks = document.querySelector('.navbar-links');
        navbarLinks.classList.toggle('active');
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', function(event) {
        const navbarLinks = document.querySelector('.navbar-links');
        const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
        if (!navbarLinks.contains(event.target) && !mobileMenuBtn.contains(event.target)) {
            navbarLinks.classList.remove('active');
        }
    });

    // Navbar scroll effect
    window.addEventListener('scroll', function() {
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Smooth scroll for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
                // Close mobile menu after clicking a link
                document.querySelector('.navbar-links').classList.remove('active');
            }
        });
    });
});

// Initialize AOS animations
if (window.AOS) {
  AOS.init({ duration: 1000 });
} 