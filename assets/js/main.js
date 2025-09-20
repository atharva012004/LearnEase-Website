/* ==========================================
   Main JavaScript - LearnEase
   ==========================================
   Modern ES6+ JavaScript with advanced features
   ========================================== */

'use strict';

// DOM Elements Cache
const DOM = {
  body: document.body,
  navbar: document.getElementById('navbar'),
  navToggle: document.getElementById('nav-toggle'),
  navMenu: document.getElementById('nav-menu'),
  navLinks: document.querySelectorAll('.nav-link'),
  themeToggle: document.getElementById('theme-toggle'),
  backToTop: document.getElementById('backToTop'),
  loadingScreen: document.getElementById('loading-screen'),
  sections: document.querySelectorAll('section[id]'),
  counters: document.querySelectorAll('.counter'),
  statNumbers: document.querySelectorAll('.stat-number'),
  contactForm: document.getElementById('contactForm'),
  newsletterForm: document.getElementById('newsletterForm'),
  videoModal: document.getElementById('videoModal'),
  testimonialCards: document.querySelectorAll('.testimonial-card'),
  testimonialDots: document.querySelectorAll('.dot'),
  testimonialPrev: document.querySelector('.testimonial-prev'),
  testimonialNext: document.querySelector('.testimonial-next')
};

// Configuration
const CONFIG = {
  breakpoints: {
    mobile: 640,
    tablet: 768,
    desktop: 1024,
    large: 1280
  },
  animations: {
    duration: 300,
    easing: 'ease-in-out'
  },
  scroll: {
    offset: 80,
    threshold: 100
  },
  testimonial: {
    autoplay: true,
    interval: 5000
  }
};

// State Management
const AppState = {
  currentTestimonial: 0,
  isScrolling: false,
  isDarkMode: localStorage.getItem('darkMode') === 'true' || 
              (!localStorage.getItem('darkMode') && window.matchMedia('(prefers-color-scheme: dark)').matches),
  isLoaded: false,
  isMobile: window.innerWidth < CONFIG.breakpoints.tablet,
  testimonialInterval: null
};

// Utility Functions
const Utils = {
  // Debounce function
  debounce(func, wait, immediate) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        timeout = null;
        if (!immediate) func(...args);
      };
      const callNow = immediate && !timeout;
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
      if (callNow) func(...args);
    };
  },

  // Throttle function
  throttle(func, limit) {
    let inThrottle;
    return function(...args) {
      if (!inThrottle) {
        func.apply(this, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  },

  // Smooth scroll to element
  scrollToElement(element, offset = CONFIG.scroll.offset) {
    const targetPosition = element.offsetTop - offset;
    window.scrollTo({
      top: targetPosition,
      behavior: 'smooth'
    });
  },

  // Check if element is in viewport
  isInViewport(element, threshold = 0.1) {
    const rect = element.getBoundingClientRect();
    const windowHeight = window.innerHeight || document.documentElement.clientHeight;
    const windowWidth = window.innerWidth || document.documentElement.clientWidth;

    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <= windowHeight + (windowHeight * threshold) &&
      rect.right <= windowWidth
    );
  },

  // Generate unique ID
  generateId() {
    return Math.random().toString(36).substr(2, 9);
  },

  // Format number with commas
  formatNumber(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  },

  // Validate email
  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  // Get browser info
  getBrowserInfo() {
    const ua = navigator.userAgent;
    let browser = 'Unknown';

    if (ua.includes('Chrome')) browser = 'Chrome';
    else if (ua.includes('Firefox')) browser = 'Firefox';
    else if (ua.includes('Safari')) browser = 'Safari';
    else if (ua.includes('Edge')) browser = 'Edge';

    return {
      browser,
      isMobile: /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua),
      isTouch: 'ontouchstart' in window || navigator.maxTouchPoints > 0
    };
  }
};

// Theme Management
const ThemeManager = {
  init() {
    this.applyTheme(AppState.isDarkMode);
    this.bindEvents();
  },

  applyTheme(isDark) {
    DOM.body.classList.toggle('dark-mode', isDark);
    const icon = DOM.themeToggle?.querySelector('i');

    if (icon) {
      icon.className = isDark ? 'fas fa-sun' : 'fas fa-moon';
    }

    // Update theme color meta tag
    const themeColor = isDark ? '#1a1a1a' : '#ffffff';
    let metaThemeColor = document.querySelector('meta[name="theme-color"]');

    if (!metaThemeColor) {
      metaThemeColor = document.createElement('meta');
      metaThemeColor.name = 'theme-color';
      document.head.appendChild(metaThemeColor);
    }

    metaThemeColor.content = themeColor;

    // Save preference
    localStorage.setItem('darkMode', isDark);
    AppState.isDarkMode = isDark;

    // Dispatch custom event
    window.dispatchEvent(new CustomEvent('themeChanged', { 
      detail: { isDark } 
    }));

    this.showThemeIndicator(isDark ? 'Dark mode enabled' : 'Light mode enabled');
  },

  toggle() {
    this.applyTheme(!AppState.isDarkMode);
  },

  bindEvents() {
    DOM.themeToggle?.addEventListener('click', () => this.toggle());

    // Listen for system theme changes
    window.matchMedia('(prefers-color-scheme: dark)')
      .addEventListener('change', (e) => {
        if (!localStorage.getItem('darkMode')) {
          this.applyTheme(e.matches);
        }
      });
  },

  showThemeIndicator(message) {
    const indicator = document.createElement('div');
    indicator.className = 'theme-saved-indicator';
    indicator.textContent = message;
    document.body.appendChild(indicator);

    setTimeout(() => indicator.classList.add('show'), 100);
    setTimeout(() => {
      indicator.classList.remove('show');
      setTimeout(() => indicator.remove(), 300);
    }, 2000);
  }
};

// Navigation Management
const Navigation = {
  init() {
    this.bindEvents();
    this.updateActiveLink();
    this.handleScroll();
  },

  bindEvents() {
    // Mobile menu toggle
    DOM.navToggle?.addEventListener('click', () => this.toggleMobileMenu());

    // Navigation links
    DOM.navLinks.forEach(link => {
      link.addEventListener('click', (e) => this.handleNavClick(e));
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!e.target.closest('.navbar')) {
        this.closeMobileMenu();
      }
    });

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        this.closeMobileMenu();
      }
    });

    // Scroll handler
    window.addEventListener('scroll', 
      Utils.throttle(() => this.handleScroll(), 16)
    );
  },

  toggleMobileMenu() {
    DOM.navToggle?.classList.toggle('active');
    DOM.navMenu?.classList.toggle('active');
    DOM.body.classList.toggle('nav-open');
  },

  closeMobileMenu() {
    DOM.navToggle?.classList.remove('active');
    DOM.navMenu?.classList.remove('active');
    DOM.body.classList.remove('nav-open');
  },

  handleNavClick(e) {
    e.preventDefault();
    const href = e.target.getAttribute('href');

    if (href.startsWith('#')) {
      const targetId = href.substring(1);
      const targetElement = document.getElementById(targetId);

      if (targetElement) {
        Utils.scrollToElement(targetElement);
        this.closeMobileMenu();
      }
    }
  },

  handleScroll() {
    const scrollTop = window.pageYOffset;

    // Update navbar appearance
    DOM.navbar?.classList.toggle('scrolled', scrollTop > CONFIG.scroll.threshold);

    // Update active navigation link
    this.updateActiveLink();

    // Handle back to top button
    this.updateBackToTop(scrollTop);
  },

  updateActiveLink() {
    const scrollTop = window.pageYOffset + CONFIG.scroll.offset + 10;

    DOM.sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionBottom = sectionTop + section.offsetHeight;
      const sectionId = section.getAttribute('id');

      if (scrollTop >= sectionTop && scrollTop < sectionBottom) {
        DOM.navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });
      }
    });
  },

  updateBackToTop(scrollTop) {
    const progress = Math.min(scrollTop / (document.body.scrollHeight - window.innerHeight), 1);
    const circle = DOM.backToTop?.querySelector('circle');

    if (circle) {
      const circumference = 2 * Math.PI * 18;
      const offset = circumference - (progress * circumference);
      circle.style.strokeDashoffset = offset;
    }

    DOM.backToTop?.classList.toggle('show', scrollTop > 300);
  }
};

// Loading Screen Management
const LoadingManager = {
  init() {
    this.showLoading();
    this.bindEvents();
  },

  showLoading() {
    DOM.loadingScreen?.classList.remove('hidden');
  },

  hideLoading() {
    DOM.loadingScreen?.classList.add('hidden');
    AppState.isLoaded = true;

    setTimeout(() => {
      DOM.loadingScreen?.remove();
      this.triggerEntranceAnimations();
    }, 500);
  },

  triggerEntranceAnimations() {
    // Initialize AOS if available
    if (window.AOS) {
      AOS.init({
        duration: 800,
        easing: 'ease-out',
        once: true,
        offset: 50
      });
    }

    // Trigger custom animations
    document.querySelectorAll('.animate-on-load').forEach((element, index) => {
      setTimeout(() => {
        element.classList.add('animate-fade-in-up');
      }, index * 100);
    });
  },

  bindEvents() {
    window.addEventListener('load', () => {
      setTimeout(() => this.hideLoading(), 1000);
    });

    // Fallback timeout
    setTimeout(() => this.hideLoading(), 5000);
  }
};

// Counter Animation
const CounterAnimation = {
  init() {
    this.setupObserver();
  },

  setupObserver() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.animateCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    // Observe both counter and stat-number elements
    [...DOM.counters, ...DOM.statNumbers].forEach(counter => {
      observer.observe(counter);
    });
  },

  animateCounter(element) {
    const target = parseInt(element.getAttribute('data-target') || element.getAttribute('data-count'));
    const duration = 2000;
    const stepTime = Math.abs(Math.floor(duration / target));
    let current = 0;

    const timer = setInterval(() => {
      current += Math.ceil(target / 100);
      element.textContent = current > target ? target : current;

      if (current >= target) {
        clearInterval(timer);
        element.textContent = target;
      }
    }, stepTime);
  }
};

// Testimonial Carousel
const TestimonialCarousel = {
  init() {
    if (!DOM.testimonialCards.length) return;

    this.bindEvents();
    this.startAutoplay();
    this.updateDots();
  },

  bindEvents() {
    DOM.testimonialPrev?.addEventListener('click', () => this.prevSlide());
    DOM.testimonialNext?.addEventListener('click', () => this.nextSlide());

    DOM.testimonialDots.forEach((dot, index) => {
      dot.addEventListener('click', () => this.goToSlide(index));
    });

    // Pause autoplay on hover
    DOM.testimonialCards.forEach(card => {
      card.addEventListener('mouseenter', () => this.pauseAutoplay());
      card.addEventListener('mouseleave', () => this.startAutoplay());
    });
  },

  goToSlide(index) {
    DOM.testimonialCards.forEach((card, i) => {
      card.classList.toggle('active', i === index);
    });

    AppState.currentTestimonial = index;
    this.updateDots();
  },

  nextSlide() {
    const nextIndex = (AppState.currentTestimonial + 1) % DOM.testimonialCards.length;
    this.goToSlide(nextIndex);
  },

  prevSlide() {
    const prevIndex = AppState.currentTestimonial === 0 
      ? DOM.testimonialCards.length - 1 
      : AppState.currentTestimonial - 1;
    this.goToSlide(prevIndex);
  },

  updateDots() {
    DOM.testimonialDots.forEach((dot, index) => {
      dot.classList.toggle('active', index === AppState.currentTestimonial);
    });
  },

  startAutoplay() {
    if (!CONFIG.testimonial.autoplay) return;

    this.pauseAutoplay();
    AppState.testimonialInterval = setInterval(() => {
      this.nextSlide();
    }, CONFIG.testimonial.interval);
  },

  pauseAutoplay() {
    if (AppState.testimonialInterval) {
      clearInterval(AppState.testimonialInterval);
      AppState.testimonialInterval = null;
    }
  }
};

// Form Management
const FormManager = {
  init() {
    this.bindEvents();
    this.setupValidation();
  },

  bindEvents() {
    DOM.contactForm?.addEventListener('submit', (e) => this.handleContactSubmit(e));
    DOM.newsletterForm?.addEventListener('submit', (e) => this.handleNewsletterSubmit(e));

    // Real-time validation
    document.querySelectorAll('input, textarea').forEach(input => {
      input.addEventListener('blur', () => this.validateField(input));
      input.addEventListener('input', () => this.clearErrors(input));
    });
  },

  setupValidation() {
    // Add validation styles
    const style = document.createElement('style');
    style.textContent = `
      .field-error {
        border-color: #ef4444 !important;
        box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1) !important;
      }
      .error-message {
        color: #ef4444;
        font-size: 0.875rem;
        margin-top: 0.25rem;
        display: block;
      }
    `;
    document.head.appendChild(style);
  },

  validateField(field) {
    const value = field.value.trim();
    const fieldName = field.name;
    let isValid = true;
    let message = '';

    // Clear previous errors
    this.clearErrors(field);

    // Required field validation
    if (field.hasAttribute('required') && !value) {
      isValid = false;
      message = `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} is required`;
    }
    // Email validation
    else if (field.type === 'email' && value && !Utils.isValidEmail(value)) {
      isValid = false;
      message = 'Please enter a valid email address';
    }
    // Phone validation
    else if (field.type === 'tel' && value && !/^[\+]?[1-9][\d\s\-\(\)]{7,}$/.test(value)) {
      isValid = false;
      message = 'Please enter a valid phone number';
    }

    if (!isValid) {
      this.showFieldError(field, message);
    }

    return isValid;
  },

  showFieldError(field, message) {
    field.classList.add('field-error');

    const errorElement = document.createElement('span');
    errorElement.className = 'error-message';
    errorElement.textContent = message;

    field.parentNode.appendChild(errorElement);
  },

  clearErrors(field) {
    field.classList.remove('field-error');
    const errorElement = field.parentNode.querySelector('.error-message');
    if (errorElement) {
      errorElement.remove();
    }
  },

  async handleContactSubmit(e) {
    e.preventDefault();

    const form = e.target;
    const formData = new FormData(form);
    const submitBtn = form.querySelector('button[type="submit"]');

    // Validate all fields
    const isValid = Array.from(form.querySelectorAll('input, textarea'))
      .every(field => this.validateField(field));

    if (!isValid) {
      NotificationSystem.show('Please fix the errors and try again', 'error');
      return;
    }

    // Show loading state
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
    submitBtn.disabled = true;

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));

      NotificationSystem.show('Message sent successfully! We\'ll get back to you soon.', 'success');
      form.reset();

    } catch (error) {
      NotificationSystem.show('Failed to send message. Please try again.', 'error');
    } finally {
      submitBtn.innerHTML = originalText;
      submitBtn.disabled = false;
    }
  },

  async handleNewsletterSubmit(e) {
    e.preventDefault();

    const form = e.target;
    const email = form.querySelector('input[type="email"]').value;
    const submitBtn = form.querySelector('button[type="submit"]');

    if (!Utils.isValidEmail(email)) {
      NotificationSystem.show('Please enter a valid email address', 'error');
      return;
    }

    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Subscribing...';
    submitBtn.disabled = true;

    try {
      await new Promise(resolve => setTimeout(resolve, 1500));

      NotificationSystem.show('Successfully subscribed to our newsletter!', 'success');
      form.reset();

    } catch (error) {
      NotificationSystem.show('Failed to subscribe. Please try again.', 'error');
    } finally {
      submitBtn.innerHTML = originalText;
      submitBtn.disabled = false;
    }
  }
};

// Notification System
const NotificationSystem = {
  show(message, type = 'info', duration = 5000) {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;

    const icon = this.getIcon(type);
    notification.innerHTML = `
      <i class="notification-icon ${icon}"></i>
      <span>${message}</span>
      <button class="notification-close" aria-label="Close notification">
        <i class="fas fa-times"></i>
      </button>
    `;

    document.body.appendChild(notification);

    // Show notification
    setTimeout(() => notification.classList.add('show'), 100);

    // Auto remove
    const autoRemove = setTimeout(() => this.remove(notification), duration);

    // Manual close
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
      clearTimeout(autoRemove);
      this.remove(notification);
    });
  },

  remove(notification) {
    notification.classList.remove('show');
    setTimeout(() => notification.remove(), 300);
  },

  getIcon(type) {
    const icons = {
      success: 'fas fa-check-circle',
      error: 'fas fa-exclamation-circle',
      warning: 'fas fa-exclamation-triangle',
      info: 'fas fa-info-circle'
    };
    return icons[type] || icons.info;
  }
};

// Video Modal Management
const VideoModal = {
  init() {
    this.bindEvents();
  },

  bindEvents() {
    // Close modal events
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && DOM.videoModal?.classList.contains('active')) {
        this.close();
      }
    });

    DOM.videoModal?.addEventListener('click', (e) => {
      if (e.target === DOM.videoModal) {
        this.close();
      }
    });
  },

  open(videoUrl = 'https://www.youtube.com/embed/dQw4w9WgXcQ') {
    if (!DOM.videoModal) return;

    const iframe = DOM.videoModal.querySelector('iframe');
    if (iframe) {
      iframe.src = videoUrl;
    }

    DOM.videoModal.classList.add('active');
    DOM.body.classList.add('modal-open');
  },

  close() {
    if (!DOM.videoModal) return;

    const iframe = DOM.videoModal.querySelector('iframe');
    if (iframe) {
      iframe.src = '';
    }

    DOM.videoModal.classList.remove('active');
    DOM.body.classList.remove('modal-open');
  }
};

// Global Functions (for HTML onclick attributes)
window.scrollToSection = (sectionId) => {
  const element = document.getElementById(sectionId);
  if (element) {
    Utils.scrollToElement(element);
  }
};

window.openVideoModal = () => {
  VideoModal.open();
};

window.closeVideoModal = () => {
  VideoModal.close();
};

// Performance Monitoring
const PerformanceMonitor = {
  init() {
    if (!window.performance) return;

    window.addEventListener('load', () => {
      setTimeout(() => {
        this.logMetrics();
      }, 0);
    });
  },

  logMetrics() {
    const navigation = performance.getEntriesByType('navigation')[0];
    const loadTime = navigation.loadEventEnd - navigation.fetchStart;
    const domContentLoaded = navigation.domContentLoadedEventEnd - navigation.fetchStart;

    console.group('🚀 Performance Metrics');
    console.log(`Page Load Time: ${Math.round(loadTime)}ms`);
    console.log(`DOM Content Loaded: ${Math.round(domContentLoaded)}ms`);
    console.log(`Browser: ${Utils.getBrowserInfo().browser}`);
    console.log(`Mobile: ${Utils.getBrowserInfo().isMobile}`);
    console.groupEnd();

    // Send analytics if available
    if (window.gtag) {
      gtag('event', 'page_load_time', {
        event_category: 'Performance',
        value: Math.round(loadTime)
      });
    }
  }
};

// Resize Handler
const ResizeHandler = {
  init() {
    window.addEventListener('resize', Utils.debounce(() => {
      AppState.isMobile = window.innerWidth < CONFIG.breakpoints.tablet;
      this.handleResize();
    }, 250));
  },

  handleResize() {
    // Close mobile menu on desktop
    if (!AppState.isMobile) {
      Navigation.closeMobileMenu();
    }

    // Recalculate positions
    Navigation.updateActiveLink();

    // Dispatch resize event
    window.dispatchEvent(new CustomEvent('appResize', {
      detail: {
        width: window.innerWidth,
        height: window.innerHeight,
        isMobile: AppState.isMobile
      }
    }));
  }
};

// Error Handling
window.addEventListener('error', (e) => {
  console.error('JavaScript Error:', e.error);

  // Don't show error notifications in production
  if (window.location.hostname === 'localhost') {
    NotificationSystem.show('A JavaScript error occurred. Check console for details.', 'error');
  }
});

window.addEventListener('unhandledrejection', (e) => {
  console.error('Unhandled Promise Rejection:', e.reason);
});

// Initialize Application
document.addEventListener('DOMContentLoaded', () => {
  // Initialize all modules
  LoadingManager.init();
  ThemeManager.init();
  Navigation.init();
  CounterAnimation.init();
  TestimonialCarousel.init();
  FormManager.init();
  VideoModal.init();
  PerformanceMonitor.init();
  ResizeHandler.init();

  // Back to top button
  DOM.backToTop?.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });

  console.log('🎉 LearnEase application initialized successfully!');
});

// Export for module use (if needed)
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    Utils,
    ThemeManager,
    Navigation,
    NotificationSystem,
    AppState,
    CONFIG
  };
}