// Ubuntu Cleaning Service - Main JavaScript
// Website functionality and interactivity

// DOM Ready
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all functionality
    initMobileMenu();
    initTestimonialSlider();
    initCounters();
    initScrollAnimations();
    initBackToTop();
    initLoader();
    initFAQ();
    updateCurrentYear();
    
    // Add smooth scrolling for anchor links
    initSmoothScrolling();
    
    // Add hover effects to service cards
    initHoverEffects();
    
    // Initialize particle background
    initParticles();
});

// Mobile Menu Toggle
function initMobileMenu() {
    const menuBtn = document.querySelector('.mobile-menu-btn');
    const mobileMenu = document.querySelector('.mobile-menu');
    const mobileLinks = document.querySelectorAll('.mobile-nav-link');
    const body = document.body;
    
    if (!menuBtn || !mobileMenu) return;
    
    menuBtn.addEventListener('click', function() {
        const isExpanded = this.getAttribute('aria-expanded') === 'true';
        this.setAttribute('aria-expanded', !isExpanded);
        mobileMenu.classList.toggle('show');
        body.classList.toggle('menu-open');
        
        // Change icon
        const icon = this.querySelector('i');
        if (mobileMenu.classList.contains('show')) {
            icon.classList.remove('fa-bars');
            icon.classList.add('fa-times');
        } else {
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        }
    });
    
    // Close menu when clicking on links
    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.remove('show');
            body.classList.remove('menu-open');
            menuBtn.setAttribute('aria-expanded', 'false');
            menuBtn.querySelector('i').classList.remove('fa-times');
            menuBtn.querySelector('i').classList.add('fa-bars');
        });
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', function(event) {
        if (!event.target.closest('.navbar') && !event.target.closest('.mobile-menu')) {
            mobileMenu.classList.remove('show');
            body.classList.remove('menu-open');
            menuBtn.setAttribute('aria-expanded', 'false');
            menuBtn.querySelector('i').classList.remove('fa-times');
            menuBtn.querySelector('i').classList.add('fa-bars');
        }
    });
    
    // Update mobile menu CSS
    const style = document.createElement('style');
    style.textContent = `
        .mobile-menu {
            display: none;
            position: absolute;
            top: 100%;
            left: 0;
            right: 0;
            background: white;
            z-index: 1000;
        }
        
        .mobile-menu.show {
            display: block;
        }
        
        body.menu-open {
            overflow: hidden;
        }
        
        @media (min-width: 769px) {
            .mobile-menu {
                display: none !important;
            }
        }
    `;
    document.head.appendChild(style);
}

// Testimonial Slider
function initTestimonialSlider() {
    const track = document.querySelector('.testimonial-track');
    const cards = document.querySelectorAll('.testimonial-card');
    const dots = document.querySelectorAll('.dot');
    const prevBtn = document.querySelector('.slider-prev');
    const nextBtn = document.querySelector('.slider-next');
    
    if (!track || cards.length === 0) return;
    
    let currentIndex = 0;
    const totalCards = cards.length;
    
    // Show first card
    cards[0].classList.add('active');
    dots[0].classList.add('active');
    
    function showCard(index) {
        // Remove active class from all cards and dots
        cards.forEach(card => card.classList.remove('active'));
        dots.forEach(dot => dot.classList.remove('active'));
        
        // Add active class to current card and dot
        cards[index].classList.add('active');
        dots[index].classList.add('active');
        
        currentIndex = index;
    }
    
    function nextCard() {
        let nextIndex = currentIndex + 1;
        if (nextIndex >= totalCards) nextIndex = 0;
        showCard(nextIndex);
    }
    
    function prevCard() {
        let prevIndex = currentIndex - 1;
        if (prevIndex < 0) prevIndex = totalCards - 1;
        showCard(prevIndex);
    }
    
    // Next/Previous buttons
    if (nextBtn) {
        nextBtn.addEventListener('click', nextCard);
    }
    
    if (prevBtn) {
        prevBtn.addEventListener('click', prevCard);
    }
    
    // Dot navigation
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            showCard(index);
        });
    });
    
    // Auto-advance every 5 seconds
    setInterval(nextCard, 5000);
    
    // Add touch/swipe support
    let touchStartX = 0;
    let touchEndX = 0;
    
    track.addEventListener('touchstart', function(e) {
        touchStartX = e.changedTouches[0].screenX;
    });
    
    track.addEventListener('touchend', function(e) {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    });
    
    function handleSwipe() {
        const swipeThreshold = 50;
        
        if (touchEndX < touchStartX - swipeThreshold) {
            // Swipe left - next
            nextCard();
        }
        
        if (touchEndX > touchStartX + swipeThreshold) {
            // Swipe right - previous
            prevCard();
        }
    }
}

// Animated Counters
function initCounters() {
    const counters = document.querySelectorAll('.counter');
    if (counters.length === 0) return;
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const target = parseInt(counter.getAttribute('data-target'));
                const duration = 2000; // 2 seconds
                const step = target / (duration / 16); // 60fps
                let current = 0;
                
                const updateCounter = () => {
                    current += step;
                    if (current < target) {
                        counter.textContent = Math.ceil(current);
                        requestAnimationFrame(updateCounter);
                    } else {
                        counter.textContent = target;
                        
                        // Add plus sign for whole numbers
                        if (target % 1 === 0 && target > 100) {
                            counter.textContent += '+';
                        }
                        
                        // Format decimal numbers
                        if (target % 1 !== 0) {
                            counter.textContent = target.toFixed(1);
                        }
                    }
                };
                
                updateCounter();
                observer.unobserve(counter);
            }
        });
    }, { threshold: 0.5 });
    
    counters.forEach(counter => observer.observe(counter));
}

// Scroll Animations
function initScrollAnimations() {
    const revealElements = document.querySelectorAll('.reveal');
    
    if (revealElements.length === 0) {
        // Create reveal elements dynamically for sections
        document.querySelectorAll('section').forEach((section, index) => {
            section.classList.add('reveal');
            section.classList.add(`stagger-${(index % 5) + 1}`);
        });
    }
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    document.querySelectorAll('.reveal').forEach(element => {
        observer.observe(element);
    });
    
    // Header scroll effect
    const header = document.querySelector('.header');
    if (header) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 100) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
    }
}

// Back to Top Button
function initBackToTop() {
    const backToTopBtn = document.querySelector('.back-to-top');
    if (!backToTopBtn) return;
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            backToTopBtn.classList.add('visible');
        } else {
            backToTopBtn.classList.remove('visible');
        }
    });
    
    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// Page Loader
function initLoader() {
    const loader = document.querySelector('.loader');
    if (!loader) return;
    
    // Hide loader after page loads
    window.addEventListener('load', () => {
        setTimeout(() => {
            loader.classList.add('hidden');
            
            // Remove from DOM after animation completes
            setTimeout(() => {
                loader.style.display = 'none';
            }, 500);
        }, 1000);
    });
    
    // Fallback: hide loader after 3 seconds max
    setTimeout(() => {
        loader.classList.add('hidden');
        setTimeout(() => {
            loader.style.display = 'none';
        }, 500);
    }, 3000);
}

// FAQ Accordion
function initFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');
        
        if (!question || !answer) return;
        
        question.addEventListener('click', () => {
            // Close all other items
            faqItems.forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('active');
                }
            });
            
            // Toggle current item
            item.classList.toggle('active');
        });
    });
    
    // Open first FAQ by default
    if (faqItems.length > 0) {
        faqItems[0].classList.add('active');
    }
}

// Update Current Year in Footer
function updateCurrentYear() {
    const yearElements = document.querySelectorAll('#current-year');
    const currentYear = new Date().getFullYear();
    
    yearElements.forEach(element => {
        element.textContent = currentYear;
    });
}

// Smooth Scrolling for Anchor Links
function initSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // Skip if href is just "#"
            if (href === '#') return;
            
            // Find target element
            const targetElement = document.querySelector(href);
            if (!targetElement) return;
            
            e.preventDefault();
            
            // Scroll to target
            targetElement.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
            
            // Update URL without jumping
            history.pushState(null, null, href);
        });
    });
}

// Hover Effects for Service Cards
function initHoverEffects() {
    const serviceCards = document.querySelectorAll('.service-card');
    
    serviceCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-10px)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0)';
        });
    });
}

// Particle Background Animation
function initParticles() {
    const heroSection = document.querySelector('.hero-bg .particles');
    if (!heroSection) return;
    
    // Create particles
    const particleCount = 20;
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        // Random size between 2px and 6px
        const size = Math.random() * 4 + 2;
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        
        // Random position
        particle.style.left = `${Math.random() * 100}%`;
        particle.style.top = `${Math.random() * 100}%`;
        
        // Random animation duration between 10s and 20s
        const duration = Math.random() * 10 + 10;
        particle.style.animationDuration = `${duration}s`;
        
        // Random delay
        particle.style.animationDelay = `${Math.random() * 5}s`;
        
        // Random opacity
        particle.style.opacity = Math.random() * 0.5 + 0.1;
        
        heroSection.appendChild(particle);
    }
}

// Form Validation Helper
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function validatePhone(phone) {
    // South African phone number validation
    const re = /^(\+27|0)[1-9][0-9]{8}$/;
    return re.test(phone.replace(/\s+/g, ''));
}

// Toast Notification
function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    
    // Add styles
    toast.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 25px;
        background: ${type === 'success' ? '#2E8B57' : '#FF6B35'};
        color: white;
        border-radius: 10px;
        box-shadow: 0 5px 15px rgba(0,0,0,0.2);
        z-index: 10000;
        transform: translateX(150%);
        transition: transform 0.3s ease;
    `;
    
    document.body.appendChild(toast);
    
    // Animate in
    setTimeout(() => {
        toast.style.transform = 'translateX(0)';
    }, 10);
    
    // Remove after 5 seconds
    setTimeout(() => {
        toast.style.transform = 'translateX(150%)';
        setTimeout(() => {
            document.body.removeChild(toast);
        }, 300);
    }, 5000);
}

// Service Area Highlight
function highlightServiceArea() {
    // Only run on the contact page
    if (!document.body.classList.contains('contact-page')) return;

    // Make sure service area list is static and visible (no animations).
    const serviceAreaElements = document.querySelectorAll('.service-areas li');
    serviceAreaElements.forEach((area) => {
        // Remove any animation styles or classes that would hide or animate the items
        area.style.animationDelay = '';
        area.classList.remove('reveal');
        area.classList.remove('active');
        area.style.opacity = '';
        area.style.transform = '';
        area.style.transition = '';
    });
}

// Initialize on window load
window.addEventListener('load', () => {
    // Highlight service areas with delay
    setTimeout(highlightServiceArea, 1000);
    
    // Add loading bar for page transitions
    const loadingBar = document.createElement('div');
    loadingBar.className = 'loading-bar';
    document.body.appendChild(loadingBar);
    
    // Remove loading bar after 2 seconds
    setTimeout(() => {
        loadingBar.style.opacity = '0';
        setTimeout(() => {
            if (loadingBar.parentNode) {
                loadingBar.parentNode.removeChild(loadingBar);
            }
        }, 300);
    }, 2000);
});

// Handle browser compatibility
if (!('IntersectionObserver' in window)) {
    // Fallback for older browsers
    console.warn('IntersectionObserver not supported - some animations may not work');
    
    // Manually add active class to reveal elements
    setTimeout(() => {
        document.querySelectorAll('.reveal').forEach(el => {
            el.classList.add('active');
        });
    }, 500);
}

// Export functions for use in other modules
window.UbuntuWebsite = {
    validateEmail,
    validatePhone,
    showToast,
    initTestimonialSlider,
    initCounters
};