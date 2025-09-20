/* ==========================================
   Components JavaScript - LearnEase
   ==========================================
   Component-specific functionality and interactions
   ========================================== */

'use strict';

// Course Card Component
class CourseCard {
  constructor(element) {
    this.element = element;
    this.init();
  }

  init() {
    this.bindEvents();
    this.setupRippleEffect();
  }

  bindEvents() {
    const enrollBtn = this.element.querySelector('.enroll-btn');
    const viewDetailsBtn = this.element.querySelector('.course-btn');

    enrollBtn?.addEventListener('click', (e) => this.handleEnroll(e));
    viewDetailsBtn?.addEventListener('click', (e) => this.handleViewDetails(e));

    // Add hover analytics
    this.element.addEventListener('mouseenter', () => this.trackHover());
  }

  setupRippleEffect() {
    const buttons = this.element.querySelectorAll('.enroll-btn, .course-btn');

    buttons.forEach(button => {
      button.addEventListener('click', (e) => {
        const ripple = document.createElement('span');
        const rect = button.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;

        ripple.style.cssText = `
          position: absolute;
          width: ${size}px;
          height: ${size}px;
          left: ${x}px;
          top: ${y}px;
          background: rgba(255, 255, 255, 0.3);
          border-radius: 50%;
          transform: scale(0);
          animation: ripple 0.6s linear;
          pointer-events: none;
        `;

        button.appendChild(ripple);
        setTimeout(() => ripple.remove(), 600);
      });
    });
  }

  handleEnroll(e) {
    e.preventDefault();
    const courseName = this.element.querySelector('h3')?.textContent || 'Course';

    NotificationSystem.show(`Great choice! Starting enrollment for "${courseName}"`, 'success');

    // Add to cart simulation
    setTimeout(() => {
      const modal = this.createEnrollmentModal(courseName);
      document.body.appendChild(modal);
      modal.classList.add('active');
    }, 500);
  }

  handleViewDetails(e) {
    e.preventDefault();
    const courseName = this.element.querySelector('h3')?.textContent || 'Course';

    // Animate card expansion
    this.element.style.transform = 'scale(1.02)';
    setTimeout(() => {
      this.element.style.transform = '';
      NotificationSystem.show(`Loading details for "${courseName}"...`, 'info');
    }, 200);
  }

  createEnrollmentModal(courseName) {
    const modal = document.createElement('div');
    modal.className = 'enrollment-modal';
    modal.innerHTML = `
      <div class="modal-backdrop">
        <div class="modal-content">
          <div class="modal-header">
            <h3>Enroll in ${courseName}</h3>
            <button class="modal-close">&times;</button>
          </div>
          <div class="modal-body">
            <p>Ready to start your learning journey?</p>
            <div class="enrollment-benefits">
              <div class="benefit">
                <i class="fas fa-check"></i>
                <span>Lifetime Access</span>
              </div>
              <div class="benefit">
                <i class="fas fa-check"></i>
                <span>Certificate of Completion</span>
              </div>
              <div class="benefit">
                <i class="fas fa-check"></i>
                <span>24/7 Support</span>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button class="btn secondary" onclick="this.closest('.enrollment-modal').remove()">Maybe Later</button>
            <button class="btn primary" onclick="this.enrollNow('${courseName}')">Enroll Now</button>
          </div>
        </div>
      </div>
    `;

    // Add styles
    const style = document.createElement('style');
    style.textContent = `
      .enrollment-modal {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.8);
        z-index: 1050;
        display: flex;
        align-items: center;
        justify-content: center;
        opacity: 0;
        transition: opacity 0.3s;
      }
      .enrollment-modal.active { opacity: 1; }
      .enrollment-modal .modal-content {
        background: var(--bg-primary);
        border-radius: 1rem;
        max-width: 500px;
        width: 90%;
        transform: scale(0.9);
        transition: transform 0.3s;
      }
      .enrollment-modal.active .modal-content { transform: scale(1); }
    `;
    document.head.appendChild(style);

    return modal;
  }

  trackHover() {
    // Analytics tracking
    if (window.gtag) {
      gtag('event', 'course_hover', {
        event_category: 'Course Interaction',
        event_label: this.element.querySelector('h3')?.textContent
      });
    }
  }
}

// Service Card Component
class ServiceCard {
  constructor(element) {
    this.element = element;
    this.init();
  }

  init() {
    this.bindEvents();
    this.setupTiltEffect();
  }

  bindEvents() {
    const learnMoreBtn = this.element.querySelector('.service-btn');
    learnMoreBtn?.addEventListener('click', (e) => this.handleLearnMore(e));
  }

  setupTiltEffect() {
    this.element.addEventListener('mouseenter', (e) => {
      this.element.style.transform = 'perspective(1000px) rotateX(5deg) rotateY(5deg)';
    });

    this.element.addEventListener('mouseleave', () => {
      this.element.style.transform = '';
    });

    this.element.addEventListener('mousemove', (e) => {
      const rect = this.element.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const deltaX = (e.clientX - centerX) / rect.width;
      const deltaY = (e.clientY - centerY) / rect.height;

      const rotateX = deltaY * -10;
      const rotateY = deltaX * 10;

      this.element.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });
  }

  handleLearnMore(e) {
    e.preventDefault();
    const serviceName = this.element.querySelector('h3')?.textContent || 'Service';

    // Create expandable content
    const details = document.createElement('div');
    details.className = 'service-details';
    details.innerHTML = `
      <div class="details-content">
        <h4>About ${serviceName}</h4>
        <p>Discover how our ${serviceName.toLowerCase()} service can help you achieve your goals with cutting-edge technology and expert guidance.</p>
        <ul class="service-features">
          <li><i class="fas fa-check"></i> Professional Implementation</li>
          <li><i class="fas fa-check"></i> Ongoing Support</li>
          <li><i class="fas fa-check"></i> Scalable Solutions</li>
        </ul>
        <button class="btn primary">Get Started</button>
      </div>
    `;

    this.element.appendChild(details);
    setTimeout(() => details.classList.add('expanded'), 100);
  }
}

// Team Member Component
class TeamMember {
  constructor(element) {
    this.element = element;
    this.init();
  }

  init() {
    this.bindEvents();
    this.setupSocialLinks();
  }

  bindEvents() {
    this.element.addEventListener('click', (e) => {
      if (!e.target.closest('.social-links')) {
        this.showMemberDetails();
      }
    });
  }

  setupSocialLinks() {
    const socialLinks = this.element.querySelectorAll('.social-links a');
    socialLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.stopPropagation();
        this.trackSocialClick(link);
      });
    });
  }

  showMemberDetails() {
    const name = this.element.querySelector('h3')?.textContent || 'Team Member';
    const role = this.element.querySelector('p')?.textContent || 'Professional';

    const modal = this.createMemberModal(name, role);
    document.body.appendChild(modal);
    setTimeout(() => modal.classList.add('active'), 100);
  }

  createMemberModal(name, role) {
    const modal = document.createElement('div');
    modal.className = 'member-modal';
    modal.innerHTML = `
      <div class="modal-backdrop" onclick="this.parentElement.remove()">
        <div class="modal-content" onclick="event.stopPropagation()">
          <button class="modal-close" onclick="this.closest('.member-modal').remove()">&times;</button>
          <div class="member-profile">
            <div class="member-avatar">
              <img src="${this.element.querySelector('img')?.src || ''}" alt="${name}">
            </div>
            <div class="member-info">
              <h2>${name}</h2>
              <p class="member-role">${role}</p>
              <div class="member-bio">
                <p>Experienced professional with a passion for education and technology. Dedicated to helping students achieve their learning goals through innovative teaching methods.</p>
                <div class="member-stats">
                  <div class="stat">
                    <span class="stat-number">500+</span>
                    <span class="stat-label">Students Taught</span>
                  </div>
                  <div class="stat">
                    <span class="stat-number">50+</span>
                    <span class="stat-label">Projects Completed</span>
                  </div>
                  <div class="stat">
                    <span class="stat-number">5</span>
                    <span class="stat-label">Years Experience</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    return modal;
  }

  trackSocialClick(link) {
    const platform = this.getSocialPlatform(link.href);
    if (window.gtag) {
      gtag('event', 'social_click', {
        event_category: 'Social Media',
        event_label: platform
      });
    }
  }

  getSocialPlatform(url) {
    if (url.includes('linkedin')) return 'LinkedIn';
    if (url.includes('twitter')) return 'Twitter';
    if (url.includes('github')) return 'GitHub';
    if (url.includes('facebook')) return 'Facebook';
    return 'Unknown';
  }
}

// Interactive Button Component
class InteractiveButton {
  constructor(element, options = {}) {
    this.element = element;
    this.options = {
      ripple: true,
      pulse: false,
      glow: false,
      ...options
    };
    this.init();
  }

  init() {
    this.setupEffects();
    this.bindEvents();
  }

  setupEffects() {
    if (this.options.ripple) {
      this.setupRippleEffect();
    }
    if (this.options.pulse) {
      this.element.classList.add('animate-pulse');
    }
    if (this.options.glow) {
      this.element.classList.add('animate-glow');
    }
  }

  setupRippleEffect() {
    this.element.addEventListener('click', (e) => {
      const ripple = document.createElement('span');
      const rect = this.element.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      const x = e.clientX - rect.left - size / 2;
      const y = e.clientY - rect.top - size / 2;

      ripple.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        left: ${x}px;
        top: ${y}px;
        background: rgba(255, 255, 255, 0.3);
        border-radius: 50%;
        transform: scale(0);
        animation: ripple 0.6s linear;
        pointer-events: none;
      `;

      this.element.appendChild(ripple);
      setTimeout(() => ripple.remove(), 600);
    });
  }

  bindEvents() {
    this.element.addEventListener('mouseenter', () => {
      this.element.style.transform = 'translateY(-2px) scale(1.02)';
    });

    this.element.addEventListener('mouseleave', () => {
      this.element.style.transform = '';
    });
  }
}

// Progress Bar Component
class ProgressBar {
  constructor(element, options = {}) {
    this.element = element;
    this.options = {
      duration: 2000,
      easing: 'ease-out',
      autoStart: true,
      ...options
    };
    this.init();
  }

  init() {
    this.progressFill = this.element.querySelector('.progress-fill');
    if (this.options.autoStart) {
      this.setupObserver();
    }
  }

  setupObserver() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.animate();
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    observer.observe(this.element);
  }

  animate() {
    if (!this.progressFill) return;

    const targetWidth = this.progressFill.style.width || '0%';
    this.progressFill.style.width = '0%';

    setTimeout(() => {
      this.progressFill.style.transition = `width ${this.options.duration}ms ${this.options.easing}`;
      this.progressFill.style.width = targetWidth;
    }, 100);
  }
}

// Scroll Spy Component
class ScrollSpy {
  constructor(options = {}) {
    this.options = {
      offset: 80,
      smooth: true,
      ...options
    };
    this.init();
  }

  init() {
    this.sections = document.querySelectorAll('section[id]');
    this.navLinks = document.querySelectorAll('.nav-link[href^="#"]');
    this.bindEvents();
  }

  bindEvents() {
    window.addEventListener('scroll', this.throttle(() => {
      this.updateActiveLink();
    }, 16));
  }

  updateActiveLink() {
    const scrollPosition = window.pageYOffset + this.options.offset;

    this.sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionBottom = sectionTop + section.offsetHeight;
      const sectionId = section.getAttribute('id');

      if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
        this.navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }

  throttle(func, limit) {
    let inThrottle;
    return function(...args) {
      if (!inThrottle) {
        func.apply(this, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  }
}

// Lazy Loading Component
class LazyLoader {
  constructor(options = {}) {
    this.options = {
      rootMargin: '50px',
      threshold: 0.1,
      ...options
    };
    this.init();
  }

  init() {
    this.images = document.querySelectorAll('img[data-src]');
    this.setupObserver();
  }

  setupObserver() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.loadImage(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, this.options);

    this.images.forEach(img => observer.observe(img));
  }

  loadImage(img) {
    const src = img.getAttribute('data-src');
    if (!src) return;

    img.src = src;
    img.classList.add('loaded');
    img.removeAttribute('data-src');
  }
}

// Particle System Component
class ParticleSystem {
  constructor(container, options = {}) {
    this.container = container;
    this.options = {
      count: 50,
      speed: 1,
      color: '#6366f1',
      size: 2,
      ...options
    };
    this.particles = [];
    this.init();
  }

  init() {
    this.createParticles();
    this.animate();
  }

  createParticles() {
    for (let i = 0; i < this.options.count; i++) {
      const particle = document.createElement('div');
      particle.className = 'particle';
      particle.style.cssText = `
        position: absolute;
        width: ${this.options.size}px;
        height: ${this.options.size}px;
        background: ${this.options.color};
        border-radius: 50%;
        opacity: ${Math.random() * 0.8 + 0.2};
        left: ${Math.random() * 100}%;
        top: ${Math.random() * 100}%;
      `;

      this.container.appendChild(particle);
      this.particles.push({
        element: particle,
        x: Math.random() * this.container.offsetWidth,
        y: Math.random() * this.container.offsetHeight,
        vx: (Math.random() - 0.5) * this.options.speed,
        vy: (Math.random() - 0.5) * this.options.speed
      });
    }
  }

  animate() {
    this.particles.forEach(particle => {
      particle.x += particle.vx;
      particle.y += particle.vy;

      // Bounce off edges
      if (particle.x <= 0 || particle.x >= this.container.offsetWidth) {
        particle.vx *= -1;
      }
      if (particle.y <= 0 || particle.y >= this.container.offsetHeight) {
        particle.vy *= -1;
      }

      particle.element.style.left = particle.x + 'px';
      particle.element.style.top = particle.y + 'px';
    });

    requestAnimationFrame(() => this.animate());
  }
}

// Initialize Components when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  // Initialize Course Cards
  document.querySelectorAll('.course-card').forEach(card => {
    new CourseCard(card);
  });

  // Initialize Service Cards
  document.querySelectorAll('.service-card').forEach(card => {
    new ServiceCard(card);
  });

  // Initialize Team Members
  document.querySelectorAll('.team-card').forEach(card => {
    new TeamMember(card);
  });

  // Initialize Interactive Buttons
  document.querySelectorAll('.primary-btn, .secondary-btn, .cta-btn').forEach(btn => {
    new InteractiveButton(btn, { ripple: true, glow: false });
  });

  // Initialize Progress Bars
  document.querySelectorAll('.progress-bar').forEach(bar => {
    new ProgressBar(bar);
  });

  // Initialize Scroll Spy
  new ScrollSpy();

  // Initialize Lazy Loading
  new LazyLoader();

  // Initialize Particle System (if container exists)
  const particleContainer = document.querySelector('.particles');
  if (particleContainer) {
    new ParticleSystem(particleContainer);
  }

  console.log('🧩 Components initialized successfully!');
});

// Export for module use
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    CourseCard,
    ServiceCard,
    TeamMember,
    InteractiveButton,
    ProgressBar,
    ScrollSpy,
    LazyLoader,
    ParticleSystem
  };
}