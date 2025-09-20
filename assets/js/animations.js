/* ==========================================
   Animation Controllers - LearnEase
   ==========================================
   Advanced animation management and triggers
   ========================================== */

'use strict';

// Animation Controller Class
class AnimationController {
  constructor() {
    this.observers = new Map();
    this.animations = new Map();
    this.init();
  }

  init() {
    this.setupIntersectionObserver();
    this.setupScrollAnimations();
    this.setupParallaxEffects();
    this.bindEvents();
  }

  setupIntersectionObserver() {
    const options = {
      root: null,
      rootMargin: '0px 0px -50px 0px',
      threshold: 0.1
    };

    this.scrollObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.triggerAnimation(entry.target);
        }
      });
    }, options);

    // Observe all animatable elements
    document.querySelectorAll('[data-aos], .scroll-animation, .animate-on-scroll').forEach(element => {
      this.scrollObserver.observe(element);
    });
  }

  setupScrollAnimations() {
    const elements = document.querySelectorAll('.scroll-fade-in, .scroll-slide-in-left, .scroll-slide-in-right, .scroll-scale-in');

    elements.forEach(element => {
      this.scrollObserver.observe(element);
    });
  }

  setupParallaxEffects() {
    this.parallaxElements = document.querySelectorAll('.parallax-element');

    if (this.parallaxElements.length > 0) {
      window.addEventListener('scroll', this.throttle(() => {
        this.updateParallax();
      }, 16));
    }
  }

  updateParallax() {
    const scrollTop = window.pageYOffset;

    this.parallaxElements.forEach(element => {
      const speed = element.dataset.speed || 0.5;
      const yPos = -(scrollTop * speed);
      element.style.transform = `translateY(${yPos}px)`;
    });
  }

  triggerAnimation(element) {
    const animationType = this.getAnimationType(element);

    switch (animationType) {
      case 'fade-in':
        this.fadeIn(element);
        break;
      case 'slide-in-left':
        this.slideInLeft(element);
        break;
      case 'slide-in-right':
        this.slideInRight(element);
        break;
      case 'scale-in':
        this.scaleIn(element);
        break;
      case 'bounce-in':
        this.bounceIn(element);
        break;
      default:
        this.defaultAnimation(element);
    }

    // Unobserve after animation
    this.scrollObserver.unobserve(element);
  }

  getAnimationType(element) {
    if (element.classList.contains('scroll-fade-in')) return 'fade-in';
    if (element.classList.contains('scroll-slide-in-left')) return 'slide-in-left';
    if (element.classList.contains('scroll-slide-in-right')) return 'slide-in-right';
    if (element.classList.contains('scroll-scale-in')) return 'scale-in';
    if (element.dataset.aos === 'bounce-in') return 'bounce-in';
    return 'default';
  }

  fadeIn(element) {
    element.style.opacity = '0';
    element.style.transition = 'opacity 0.8s ease-out';

    setTimeout(() => {
      element.style.opacity = '1';
      element.classList.add('animated');
    }, 100);
  }

  slideInLeft(element) {
    element.style.transform = 'translateX(-50px)';
    element.style.opacity = '0';
    element.style.transition = 'transform 0.8s ease-out, opacity 0.8s ease-out';

    setTimeout(() => {
      element.style.transform = 'translateX(0)';
      element.style.opacity = '1';
      element.classList.add('animated');
    }, 100);
  }

  slideInRight(element) {
    element.style.transform = 'translateX(50px)';
    element.style.opacity = '0';
    element.style.transition = 'transform 0.8s ease-out, opacity 0.8s ease-out';

    setTimeout(() => {
      element.style.transform = 'translateX(0)';
      element.style.opacity = '1';
      element.classList.add('animated');
    }, 100);
  }

  scaleIn(element) {
    element.style.transform = 'scale(0.8)';
    element.style.opacity = '0';
    element.style.transition = 'transform 0.6s ease-out, opacity 0.6s ease-out';

    setTimeout(() => {
      element.style.transform = 'scale(1)';
      element.style.opacity = '1';
      element.classList.add('animated');
    }, 100);
  }

  bounceIn(element) {
    element.style.transform = 'scale(0.3)';
    element.style.opacity = '0';
    element.style.transition = 'transform 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55), opacity 0.8s ease-out';

    setTimeout(() => {
      element.style.transform = 'scale(1)';
      element.style.opacity = '1';
      element.classList.add('animated');
    }, 100);
  }

  defaultAnimation(element) {
    element.classList.add('animate');
    element.classList.add('animated');
  }

  bindEvents() {
    // Hover animations
    document.querySelectorAll('.hover-lift').forEach(element => {
      element.addEventListener('mouseenter', () => {
        element.style.transform = 'translateY(-8px)';
        element.style.boxShadow = '0 25px 50px -12px rgba(0, 0, 0, 0.25)';
      });

      element.addEventListener('mouseleave', () => {
        element.style.transform = '';
        element.style.boxShadow = '';
      });
    });

    // Click animations
    document.querySelectorAll('.click-bounce').forEach(element => {
      element.addEventListener('click', () => {
        element.classList.add('animate-bounce');
        setTimeout(() => {
          element.classList.remove('animate-bounce');
        }, 1000);
      });
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

// Stagger Animation Manager
class StaggerAnimationManager {
  constructor() {
    this.staggerGroups = new Map();
    this.init();
  }

  init() {
    this.setupStaggerGroups();
  }

  setupStaggerGroups() {
    const staggerContainers = document.querySelectorAll('[data-stagger]');

    staggerContainers.forEach(container => {
      const delay = parseInt(container.dataset.stagger) || 100;
      const children = Array.from(container.children);

      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            this.animateStagger(children, delay);
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.1 });

      observer.observe(container);
    });
  }

  animateStagger(elements, delay) {
    elements.forEach((element, index) => {
      setTimeout(() => {
        element.classList.add('animate-fade-in-up');
      }, index * delay);
    });
  }
}

// Text Animation Manager
class TextAnimationManager {
  constructor() {
    this.init();
  }

  init() {
    this.setupTypewriterEffect();
    this.setupTextReveal();
    this.setupCountingAnimation();
  }

  setupTypewriterEffect() {
    const typewriterElements = document.querySelectorAll('.typewriter-effect');

    typewriterElements.forEach(element => {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            this.startTypewriter(entry.target);
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.5 });

      observer.observe(element);
    });
  }

  startTypewriter(element) {
    const text = element.textContent;
    const speed = parseInt(element.dataset.speed) || 100;

    element.textContent = '';
    element.style.borderRight = '2px solid var(--primary-color)';
    element.style.animation = 'blinkCursor 0.75s step-end infinite';

    let i = 0;
    const typeInterval = setInterval(() => {
      element.textContent += text.charAt(i);
      i++;

      if (i === text.length) {
        clearInterval(typeInterval);
        setTimeout(() => {
          element.style.animation = 'none';
          element.style.borderRight = 'none';
        }, 1000);
      }
    }, speed);
  }

  setupTextReveal() {
    const revealElements = document.querySelectorAll('.text-reveal');

    revealElements.forEach(element => {
      const text = element.textContent;
      const words = text.split(' ');

      element.innerHTML = words.map(word => 
        `<span class="word">${word.split('').map(char => 
          `<span class="char">${char}</span>`
        ).join('')}</span>`
      ).join(' ');

      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            this.revealText(entry.target);
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.5 });

      observer.observe(element);
    });
  }

  revealText(element) {
    const chars = element.querySelectorAll('.char');

    chars.forEach((char, index) => {
      setTimeout(() => {
        char.style.opacity = '1';
        char.style.transform = 'translateY(0)';
      }, index * 50);
    });
  }

  setupCountingAnimation() {
    const countingElements = document.querySelectorAll('[data-count]');

    countingElements.forEach(element => {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            this.animateCount(entry.target);
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.5 });

      observer.observe(element);
    });
  }

  animateCount(element) {
    const target = parseInt(element.dataset.count);
    const duration = parseInt(element.dataset.duration) || 2000;
    const step = target / (duration / 16);
    let current = 0;

    const counter = setInterval(() => {
      current += step;
      element.textContent = Math.floor(current);

      if (current >= target) {
        clearInterval(counter);
        element.textContent = target;
      }
    }, 16);
  }
}

// Morphing Animation Manager
class MorphingAnimationManager {
  constructor() {
    this.init();
  }

  init() {
    this.setupMorphingShapes();
    this.setupLoadingMorphs();
  }

  setupMorphingShapes() {
    const morphShapes = document.querySelectorAll('.morph-shape');

    morphShapes.forEach(shape => {
      setInterval(() => {
        this.morphShape(shape);
      }, 3000);
    });
  }

  morphShape(element) {
    const morphStates = [
      'polygon(20% 0%, 80% 0%, 100% 50%, 80% 100%, 20% 100%, 0% 50%)',
      'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)',
      'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)',
      'polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%)'
    ];

    const randomState = morphStates[Math.floor(Math.random() * morphStates.length)];
    element.style.clipPath = randomState;
  }

  setupLoadingMorphs() {
    const loadingMorphs = document.querySelectorAll('.loading-morph');

    loadingMorphs.forEach(morph => {
      this.animateLoadingMorph(morph);
    });
  }

  animateLoadingMorph(element) {
    const keyframes = [
      { transform: 'scale(1) rotate(0deg)', borderRadius: '20%' },
      { transform: 'scale(1.2) rotate(180deg)', borderRadius: '50%' },
      { transform: 'scale(1) rotate(360deg)', borderRadius: '20%' }
    ];

    const options = {
      duration: 2000,
      iterations: Infinity,
      easing: 'ease-in-out'
    };

    element.animate(keyframes, options);
  }
}

// Particle Trail Manager
class ParticleTrailManager {
  constructor() {
    this.trails = new Map();
    this.init();
  }

  init() {
    this.setupMouseTrail();
    this.setupClickTrail();
  }

  setupMouseTrail() {
    const trailElements = document.querySelectorAll('[data-mouse-trail]');

    trailElements.forEach(element => {
      element.addEventListener('mousemove', (e) => {
        this.createTrailParticle(e, element);
      });
    });
  }

  setupClickTrail() {
    document.addEventListener('click', (e) => {
      if (e.target.dataset.clickTrail !== undefined) {
        this.createClickExplosion(e);
      }
    });
  }

  createTrailParticle(event, container) {
    const particle = document.createElement('div');
    const rect = container.getBoundingClientRect();

    particle.style.cssText = `
      position: absolute;
      width: 4px;
      height: 4px;
      background: var(--primary-color);
      border-radius: 50%;
      pointer-events: none;
      left: ${event.clientX - rect.left}px;
      top: ${event.clientY - rect.top}px;
      z-index: 1000;
      animation: fadeOut 1s ease-out forwards;
    `;

    container.appendChild(particle);

    setTimeout(() => {
      particle.remove();
    }, 1000);
  }

  createClickExplosion(event) {
    const particleCount = 12;

    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement('div');
      const angle = (360 / particleCount) * i;
      const velocity = 100;

      particle.style.cssText = `
        position: fixed;
        width: 6px;
        height: 6px;
        background: var(--secondary-color);
        border-radius: 50%;
        pointer-events: none;
        left: ${event.clientX}px;
        top: ${event.clientY}px;
        z-index: 1001;
      `;

      document.body.appendChild(particle);

      const keyframes = [
        { 
          transform: 'translate(0, 0) scale(1)',
          opacity: 1 
        },
        { 
          transform: `translate(${Math.cos(angle * Math.PI / 180) * velocity}px, ${Math.sin(angle * Math.PI / 180) * velocity}px) scale(0)`,
          opacity: 0 
        }
      ];

      particle.animate(keyframes, {
        duration: 800,
        easing: 'ease-out'
      }).onfinish = () => particle.remove();
    }
  }
}

// Performance Monitor for Animations
class AnimationPerformanceMonitor {
  constructor() {
    this.frameCount = 0;
    this.lastTime = performance.now();
    this.fps = 60;
    this.init();
  }

  init() {
    this.startMonitoring();
  }

  startMonitoring() {
    const monitor = () => {
      const currentTime = performance.now();
      this.frameCount++;

      if (currentTime >= this.lastTime + 1000) {
        this.fps = Math.round((this.frameCount * 1000) / (currentTime - this.lastTime));
        this.frameCount = 0;
        this.lastTime = currentTime;

        this.optimizeAnimations();
      }

      requestAnimationFrame(monitor);
    };

    monitor();
  }

  optimizeAnimations() {
    if (this.fps < 30) {
      // Reduce animation complexity
      document.body.classList.add('reduced-animations');
      console.warn('Low FPS detected, reducing animation complexity');
    } else if (this.fps > 55 && document.body.classList.contains('reduced-animations')) {
      // Re-enable full animations
      document.body.classList.remove('reduced-animations');
      console.log('FPS improved, re-enabling full animations');
    }
  }
}

// Initialize Animation System
document.addEventListener('DOMContentLoaded', () => {
  // Initialize animation managers
  new AnimationController();
  new StaggerAnimationManager();
  new TextAnimationManager();
  new MorphingAnimationManager();
  new ParticleTrailManager();
  new AnimationPerformanceMonitor();

  // Add CSS for particle animations
  const style = document.createElement('style');
  style.textContent = `
    @keyframes fadeOut {
      from { opacity: 1; transform: scale(1); }
      to { opacity: 0; transform: scale(0); }
    }

    .reduced-animations * {
      animation-duration: 0.1s !important;
      transition-duration: 0.1s !important;
    }

    .char {
      display: inline-block;
      opacity: 0;
      transform: translateY(20px);
      transition: all 0.3s ease;
    }
  `;
  document.head.appendChild(style);

  console.log('🎨 Animation system initialized successfully!');
});

// Respect user's motion preferences
if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  document.body.classList.add('reduced-animations');
  console.log('Reduced motion preference detected');
}

// Export for module use
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    AnimationController,
    StaggerAnimationManager,
    TextAnimationManager,
    MorphingAnimationManager,
    ParticleTrailManager,
    AnimationPerformanceMonitor
  };
}