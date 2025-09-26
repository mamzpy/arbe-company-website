// ARBE Website JavaScript
class ARBEWebsite {
    constructor() {
        this.init();
    }

    init() {
        // Wait for DOM to be fully loaded
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                this.setupEventListeners();
                this.initializeComponents();
            });
        } else {
            this.setupEventListeners();
            this.initializeComponents();
        }
    }

    setupEventListeners() {
        // Navigation
        this.setupNavigation();
        
        // Smooth scrolling
        this.setupSmoothScrolling();
        
        // Form handling
        this.setupContactForm();
        
        // Scroll effects
        this.setupScrollEffects();
        
        // Back to top button
        this.setupBackToTop();
        
        // Loading screen
        this.setupLoader();
    }

    initializeComponents() {
        // Initialize fade-in animations
        this.initFadeInAnimations();
        
        // Initialize parallax effects
        this.initParallaxEffects();
    }

    // Navigation
    setupNavigation() {
        const menuToggle = document.getElementById('menuToggle');
        const navLinks = document.getElementById('navLinks');
        const header = document.getElementById('header');

        // Mobile menu toggle
        if (menuToggle && navLinks) {
            menuToggle.addEventListener('click', () => {
                menuToggle.classList.toggle('active');
                navLinks.classList.toggle('active');
                document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
            });

            // Close mobile menu when clicking on a link
            navLinks.addEventListener('click', (e) => {
                if (e.target.tagName === 'A') {
                    menuToggle.classList.remove('active');
                    navLinks.classList.remove('active');
                    document.body.style.overflow = '';
                }
            });

            // Close mobile menu when clicking outside
            document.addEventListener('click', (e) => {
                if (!menuToggle.contains(e.target) && !navLinks.contains(e.target)) {
                    menuToggle.classList.remove('active');
                    navLinks.classList.remove('active');
                    document.body.style.overflow = '';
                }
            });
        }

        // Header scroll effect
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

    // Smooth scrolling for anchor links
    setupSmoothScrolling() {
        const links = document.querySelectorAll('a[href^="#"]');
        
        links.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                
                const targetId = link.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    const headerHeight = document.getElementById('header')?.offsetHeight || 80;
                    const targetPosition = targetElement.offsetTop - headerHeight;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }

    // Contact form handling
    setupContactForm() {
        const contactForm = document.getElementById('contactForm');
        
        if (contactForm) {
            contactForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleContactFormSubmission(contactForm);
            });

            // Add input validation
            const inputs = contactForm.querySelectorAll('input[required], textarea[required]');
            inputs.forEach(input => {
                input.addEventListener('blur', () => {
                    this.validateInput(input);
                });
                
                input.addEventListener('input', () => {
                    this.clearInputError(input);
                });
            });
        }
    }

    validateInput(input) {
        const value = input.value.trim();
        const inputGroup = input.closest('.form-group');
        
        // Remove existing error
        this.clearInputError(input);
        
        // Check if required field is empty
        if (input.hasAttribute('required') && !value) {
            this.showInputError(input, 'این فیلد الزامی است');
            return false;
        }
        
        // Validate email
        if (input.type === 'email' && value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                this.showInputError(input, 'فرمت ایمیل صحیح نیست');
                return false;
            }
        }
        
        // Validate phone
        if (input.type === 'tel' && value) {
            const phoneRegex = /^[0-9+\-\s()]+$/;
            if (!phoneRegex.test(value) || value.length < 10) {
                this.showInputError(input, 'شماره تلفن صحیح نیست');
                return false;
            }
        }
        
        return true;
    }

    showInputError(input, message) {
        const inputGroup = input.closest('.form-group');
        const existingError = inputGroup.querySelector('.error-message');
        
        if (existingError) {
            existingError.remove();
        }
        
        const errorElement = document.createElement('div');
        errorElement.className = 'error-message';
        errorElement.style.color = 'var(--error)';
        errorElement.style.fontSize = '0.875rem';
        errorElement.style.marginTop = '0.5rem';
        errorElement.textContent = message;
        
        inputGroup.appendChild(errorElement);
        input.style.borderColor = 'var(--error)';
    }

    clearInputError(input) {
        const inputGroup = input.closest('.form-group');
        const errorMessage = inputGroup.querySelector('.error-message');
        
        if (errorMessage) {
            errorMessage.remove();
        }
        
        input.style.borderColor = '';
    }

    async handleContactFormSubmission(form) {
        const submitBtn = form.querySelector('.submit-btn');
        const originalText = submitBtn.innerHTML;
        
        // Validate all inputs
        const inputs = form.querySelectorAll('input[required], textarea[required]');
        let isValid = true;
        
        inputs.forEach(input => {
            if (!this.validateInput(input)) {
                isValid = false;
            }
        });
        
        if (!isValid) {
            this.showNotification('لطفاً اطلاعات را بررسی کنید', 'error');
            return;
        }
        
        // Show loading state
        submitBtn.disabled = true;
        submitBtn.innerHTML = `
            <span>در حال ارسال...</span>
            <div class="spinner"></div>
        `;
        
        // Add spinner styles if not exists
        if (!document.querySelector('.spinner-styles')) {
            const spinnerStyles = document.createElement('style');
            spinnerStyles.className = 'spinner-styles';
            spinnerStyles.textContent = `
                .spinner {
                    width: 16px;
                    height: 16px;
                    border: 2px solid rgba(0, 0, 0, 0.3);
                    border-top: 2px solid currentColor;
                    border-radius: 50%;
                    animation: spin 1s linear infinite;
                }
                @keyframes spin {
                    to { transform: rotate(360deg); }
                }
            `;
            document.head.appendChild(spinnerStyles);
        }
        
        try {
            // Collect form data
            const formData = new FormData(form);
            const data = Object.fromEntries(formData.entries());
            
            // Simulate form submission (replace with actual endpoint)
            await this.submitContactForm(data);
            
            // Show success message
            this.showNotification('پیام شما با موفقیت ارسال شد', 'success');
            form.reset();
            
        } catch (error) {
            console.error('Form submission error:', error);
            this.showNotification('خطا در ارسال پیام. لطفاً دوباره تلاش کنید', 'error');
        } finally {
            // Restore button
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalText;
        }
    }

    async submitContactForm(data) {
        // In a real application, this would send data to a server
        // For now, we'll simulate an API call
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                // Simulate success/failure
                if (Math.random() > 0.1) { // 90% success rate
                    resolve({ status: 'success' });
                } else {
                    reject(new Error('Submission failed'));
                }
            }, 2000);
        });
    }

    showNotification(message, type = 'info') {
        // Remove existing notifications
        const existingNotifications = document.querySelectorAll('.notification');
        existingNotifications.forEach(n => n.remove());
        
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <span class="notification-icon">${this.getNotificationIcon(type)}</span>
                <span class="notification-message">${message}</span>
                <button class="notification-close" onclick="this.parentElement.parentElement.remove()">×</button>
            </div>
        `;
        
        // Add styles if not exists
        if (!document.querySelector('.notification-styles')) {
            const notificationStyles = document.createElement('style');
            notificationStyles.className = 'notification-styles';
            notificationStyles.textContent = `
                .notification {
                    position: fixed;
                    top: 100px;
                    right: 20px;
                    max-width: 400px;
                    z-index: 10000;
                    animation: slideInRight 0.3s ease-out;
                }
                .notification-content {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    padding: 16px 20px;
                    border-radius: 12px;
                    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
                    backdrop-filter: blur(10px);
                }
                .notification-success .notification-content {
                    background: rgba(34, 197, 94, 0.9);
                    color: white;
                }
                .notification-error .notification-content {
                    background: rgba(239, 68, 68, 0.9);
                    color: white;
                }
                .notification-info .notification-content {
                    background: rgba(59, 130, 246, 0.9);
                    color: white;
                }
                .notification-close {
                    background: none;
                    border: none;
                    color: white;
                    font-size: 20px;
                    cursor: pointer;
                    padding: 0;
                    width: 24px;
                    height: 24px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                @keyframes slideInRight {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
            `;
            document.head.appendChild(notificationStyles);
        }
        
        document.body.appendChild(notification);
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            notification.style.animation = 'slideInRight 0.3s ease-out reverse';
            setTimeout(() => notification.remove(), 300);
        }, 5000);
    }

    getNotificationIcon(type) {
        const icons = {
            success: '✓',
            error: '✗',
            info: 'ℹ',
            warning: '⚠'
        };
        return icons[type] || icons.info;
    }

    // Scroll effects
    setupScrollEffects() {
        let ticking = false;
        
        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    this.handleScrollEffects();
                    ticking = false;
                });
                ticking = true;
            }
        });
    }

    handleScrollEffects() {
        // Fade in animations
        this.updateFadeInAnimations();
        
        // Parallax effects
        this.updateParallaxEffects();
    }

    // Fade-in animations
    initFadeInAnimations() {
        const elements = document.querySelectorAll('.fade-in, .category-card, .feature, .service-card');
        
        elements.forEach(element => {
            element.classList.add('fade-in');
        });
        
        // Initial check
        this.updateFadeInAnimations();
    }

    updateFadeInAnimations() {
        const elements = document.querySelectorAll('.fade-in:not(.visible)');
        
        elements.forEach(element => {
            if (this.isElementInViewport(element)) {
                element.classList.add('visible');
            }
        });
    }

    // Parallax effects
    initParallaxEffects() {
        this.parallaxElements = document.querySelectorAll('.parallax, .hero-bg-pattern');
    }

    updateParallaxEffects() {
        if (!this.parallaxElements) return;
        
        const scrollTop = window.pageYOffset;
        
        this.parallaxElements.forEach(element => {
            const rate = scrollTop * -0.5;
            element.style.transform = `translate3d(0, ${rate}px, 0)`;
        });
    }

    // Utility function to check if element is in viewport
    isElementInViewport(element, threshold = 0.1) {
        const rect = element.getBoundingClientRect();
        const windowHeight = window.innerHeight || document.documentElement.clientHeight;
        
        return (
            rect.top <= windowHeight * (1 - threshold) &&
            rect.bottom >= windowHeight * threshold
        );
    }

    // Back to top button
    setupBackToTop() {
        const backToTopBtn = document.getElementById('backToTop');
        
        if (backToTopBtn) {
            // Show/hide based on scroll position
            window.addEventListener('scroll', () => {
                if (window.scrollY > 300) {
                    backToTopBtn.classList.add('visible');
                } else {
                    backToTopBtn.classList.remove('visible');
                }
            });
        
        // Smooth scroll to
               backToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
}