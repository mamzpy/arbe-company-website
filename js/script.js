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
            
            // Smooth scroll to top
            backToTopBtn.addEventListener('click', () => {
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            });
        }
    }

    // Loading screen
    setupLoader() {
        const loader = document.getElementById('loader');
        
        if (loader) {
            // Hide loader when page is fully loaded
            window.addEventListener('load', () => {
                setTimeout(() => {
                    loader.classList.add('hide');
                    // Remove from DOM after animation
                    setTimeout(() => {
                        loader.remove();
                    }, 500);
                }, 1000); // Show loader for at least 1 second
            });
        }
    }

    // Product filtering and search (if needed in future)
    setupProductFilter() {
        const filterButtons = document.querySelectorAll('[data-filter]');
        const productCards = document.querySelectorAll('.category-card');

        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                const filter = button.dataset.filter;
                
                // Update active button
                filterButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                
                // Filter products
                productCards.forEach(card => {
                    if (filter === 'all' || card.dataset.category === filter) {
                        card.style.display = 'block';
                        card.classList.add('fade-in');
                    } else {
                        card.style.display = 'none';
                    }
                });
            });
        });
    }

    // Performance optimization
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }
}

// Additional utility functions
class ARBEUtils {
    static formatPhoneNumber(phone) {
        // Remove all non-digit characters
        const cleaned = phone.replace(/\D/g, '');
        
        // Format Iranian phone numbers
        if (cleaned.startsWith('98')) {
            return `+${cleaned}`;
        } else if (cleaned.startsWith('0')) {
            return `+98${cleaned.substring(1)}`;
        } else if (cleaned.length === 10) {
            return `+98${cleaned}`;
        }
        
        return phone;
    }

    static isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    static isValidPhone(phone) {
        const phoneRegex = /^(\+98|0)?9\d{9}$/;
        return phoneRegex.test(phone.replace(/\s|-/g, ''));
    }

    static sanitizeInput(input) {
        const div = document.createElement('div');
        div.textContent = input;
        return div.innerHTML;
    }

    static copyToClipboard(text) {
        if (navigator.clipboard && window.isSecureContext) {
            return navigator.clipboard.writeText(text);
        } else {
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = text;
            textArea.style.position = 'absolute';
            textArea.style.left = '-999999px';
            document.body.appendChild(textArea);
            textArea.select();
            
            try {
                document.execCommand('copy');
                return Promise.resolve();
            } catch (error) {
                return Promise.reject(error);
            } finally {
                textArea.remove();
            }
        }
    }

    static detectDevice() {
        const userAgent = navigator.userAgent || navigator.vendor || window.opera;
        
        return {
            isMobile: /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent.toLowerCase()),
            isTablet: /ipad|android(?!.*mobile)|tablet/i.test(userAgent.toLowerCase()),
            isDesktop: !/android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent.toLowerCase()),
            isIOS: /iPad|iPhone|iPod/.test(userAgent) && !window.MSStream,
            isAndroid: /android/i.test(userAgent.toLowerCase())
        };
    }
}

// Contact information click handlers
class ContactHandlers {
    static init() {
        this.setupPhoneLinks();
        this.setupEmailLinks();
        this.setupAddressLinks();
    }

    static setupPhoneLinks() {
        const phoneLinks = document.querySelectorAll('a[href^="tel:"]');
        
        phoneLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                const device = ARBEUtils.detectDevice();
                
                if (device.isDesktop) {
                    e.preventDefault();
                    const phone = link.textContent;
                    
                    ARBEUtils.copyToClipboard(phone).then(() => {
                        this.showTooltip(link, 'شماره تلفن کپی شد');
                    }).catch(() => {
                        this.showTooltip(link, phone);
                    });
                }
            });
        });
    }

    static setupEmailLinks() {
        const emailLinks = document.querySelectorAll('a[href^="mailto:"]');
        
        emailLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                const email = link.textContent;
                
                // Add copy functionality
                link.addEventListener('contextmenu', (e) => {
                    e.preventDefault();
                    ARBEUtils.copyToClipboard(email).then(() => {
                        this.showTooltip(link, 'ایمیل کپی شد');
                    });
                });
            });
        });
    }

    static setupAddressLinks() {
        const addressElements = document.querySelectorAll('[data-address]');
        
        addressElements.forEach(element => {
            element.style.cursor = 'pointer';
            element.title = 'کلیک کنید تا در نقشه باز شود';
            
            element.addEventListener('click', () => {
                const address = element.dataset.address || element.textContent;
                const encodedAddress = encodeURIComponent(address);
                
                // Try Google Maps first, fallback to other map services
                const mapUrls = [
                    `https://www.google.com/maps/search/?api=1&query=${encodedAddress}`,
                    `https://maps.apple.com/?q=${encodedAddress}`,
                    `https://www.bing.com/maps?q=${encodedAddress}`
                ];
                
                window.open(mapUrls[0], '_blank');
            });
        });
    }

    static showTooltip(element, message) {
        const tooltip = document.createElement('div');
        tooltip.className = 'tooltip';
        tooltip.textContent = message;
        
        // Add tooltip styles if not exists
        if (!document.querySelector('.tooltip-styles')) {
            const tooltipStyles = document.createElement('style');
            tooltipStyles.className = 'tooltip-styles';
            tooltipStyles.textContent = `
                .tooltip {
                    position: absolute;
                    background: var(--primary-dark);
                    color: var(--accent-gold);
                    padding: 8px 12px;
                    border-radius: 6px;
                    font-size: 0.875rem;
                    white-space: nowrap;
                    z-index: 10000;
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
                    border: 1px solid var(--accent-gold);
                    pointer-events: none;
                }
            `;
            document.head.appendChild(tooltipStyles);
        }
        
        document.body.appendChild(tooltip);
        
        const rect = element.getBoundingClientRect();
        tooltip.style.left = rect.left + (rect.width / 2) - (tooltip.offsetWidth / 2) + 'px';
        tooltip.style.top = rect.top - tooltip.offsetHeight - 8 + 'px';
        
        setTimeout(() => {
            tooltip.remove();
        }, 2000);
    }
}

// Performance monitoring
class PerformanceMonitor {
    static init() {
        if ('performance' in window) {
            window.addEventListener('load', () => {
                setTimeout(() => {
                    const perf = performance.getEntriesByType('navigation')[0];
                    
                    console.log('Performance Metrics:', {
                        loadTime: Math.round(perf.loadEventEnd - perf.navigationStart),
                        domContentLoaded: Math.round(perf.domContentLoadedEventEnd - perf.navigationStart),
                        firstPaint: this.getFirstPaint(),
                        firstContentfulPaint: this.getFirstContentfulPaint()
                    });
                }, 0);
            });
        }
    }

    static getFirstPaint() {
        const perfEntries = performance.getEntriesByType('paint');
        const firstPaint = perfEntries.find(entry => entry.name === 'first-paint');
        return firstPaint ? Math.round(firstPaint.startTime) : null;
    }

    static getFirstContentfulPaint() {
        const perfEntries = performance.getEntriesByType('paint');
        const firstContentfulPaint = perfEntries.find(entry => entry.name === 'first-contentful-paint');
        return firstContentfulPaint ? Math.round(firstContentfulPaint.startTime) : null;
    }
}

// Accessibility enhancements
class AccessibilityEnhancer {
    static init() {
        this.addKeyboardNavigation();
        this.addFocusManagement();
        this.addScreenReaderSupport();
        this.addHighContrastSupport();
    }

    static addKeyboardNavigation() {
        // Add keyboard support for mobile menu
        const menuToggle = document.getElementById('menuToggle');
        if (menuToggle) {
            menuToggle.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    menuToggle.click();
                }
            });
        }

        // Add keyboard support for back to top button
        const backToTop = document.getElementById('backToTop');
        if (backToTop) {
            backToTop.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    backToTop.click();
                }
            });
        }
    }

    static addFocusManagement() {
        // Ensure focus is visible
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                document.body.classList.add('keyboard-navigation');
            }
        });

        document.addEventListener('mousedown', () => {
            document.body.classList.remove('keyboard-navigation');
        });

        // Add focus styles if not exists
        if (!document.querySelector('.focus-styles')) {
            const focusStyles = document.createElement('style');
            focusStyles.className = 'focus-styles';
            focusStyles.textContent = `
                .keyboard-navigation *:focus {
                    outline: 2px solid var(--accent-gold) !important;
                    outline-offset: 2px !important;
                }
                .keyboard-navigation .btn:focus {
                    box-shadow: 0 0 0 3px rgba(201, 169, 110, 0.3) !important;
                }
            `;
            document.head.appendChild(focusStyles);
        }
    }

    static addScreenReaderSupport() {
        // Add ARIA labels where needed
        const logo = document.querySelector('.logo');
        if (logo && !logo.getAttribute('aria-label')) {
            logo.setAttribute('aria-label', 'ARBE Company - شرکت بهبود دهنده نان لوتوس');
        }

        const menuToggle = document.getElementById('menuToggle');
        if (menuToggle && !menuToggle.getAttribute('aria-label')) {
            menuToggle.setAttribute('aria-label', 'Toggle navigation menu');
            menuToggle.setAttribute('aria-expanded', 'false');
        }

        // Update aria-expanded when menu toggles
        const navLinks = document.getElementById('navLinks');
        if (navLinks && menuToggle) {
            const observer = new MutationObserver(() => {
                const isActive = navLinks.classList.contains('active');
                menuToggle.setAttribute('aria-expanded', isActive.toString());
            });
            
            observer.observe(navLinks, { attributes: true, attributeFilter: ['class'] });
        }
    }

    static addHighContrastSupport() {
        // Detect high contrast preference
        if (window.matchMedia('(prefers-contrast: high)').matches) {
            document.body.classList.add('high-contrast');
        }

        // Listen for changes
        window.matchMedia('(prefers-contrast: high)').addListener((e) => {
            if (e.matches) {
                document.body.classList.add('high-contrast');
            } else {
                document.body.classList.remove('high-contrast');
            }
        });
    }
}

// Initialize everything when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Initialize main website functionality
    const website = new ARBEWebsite();
    
    // Initialize additional features
    ContactHandlers.init();
    AccessibilityEnhancer.init();
    PerformanceMonitor.init();
    
    console.log('ARBE Website initialized successfully');
});

// Service Worker registration (for future PWA support)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('SW registered: ', registration);
            })
            .catch(registrationError => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}

// Export for potential module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { ARBEWebsite, ARBEUtils, ContactHandlers, AccessibilityEnhancer };
}