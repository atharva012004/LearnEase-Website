/* ==========================================
   Helper Functions - LearnEase
   ==========================================
   Utility functions and common helpers
   ========================================== */

'use strict';

// Device Detection Utilities
const DeviceUtils = {
  isMobile() {
    return window.innerWidth < 768 || /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  },

  isTablet() {
    return window.innerWidth >= 768 && window.innerWidth < 1024;
  },

  isDesktop() {
    return window.innerWidth >= 1024;
  },

  isTouchDevice() {
    return 'ontouchstart' in window || navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0;
  },

  getViewportSize() {
    return {
      width: window.innerWidth || document.documentElement.clientWidth,
      height: window.innerHeight || document.documentElement.clientHeight
    };
  },

  getDevicePixelRatio() {
    return window.devicePixelRatio || 1;
  }
};

// DOM Manipulation Utilities
const DOMUtils = {
  createElement(tag, className = '', attributes = {}) {
    const element = document.createElement(tag);
    if (className) element.className = className;

    Object.entries(attributes).forEach(([key, value]) => {
      element.setAttribute(key, value);
    });

    return element;
  },

  getElement(selector) {
    return document.querySelector(selector);
  },

  getElements(selector) {
    return Array.from(document.querySelectorAll(selector));
  },

  insertAfter(newElement, referenceElement) {
    referenceElement.parentNode.insertBefore(newElement, referenceElement.nextSibling);
  },

  insertBefore(newElement, referenceElement) {
    referenceElement.parentNode.insertBefore(newElement, referenceElement);
  },

  remove(element) {
    if (element && element.parentNode) {
      element.parentNode.removeChild(element);
    }
  },

  empty(element) {
    while (element.firstChild) {
      element.removeChild(element.firstChild);
    }
  },

  hasClass(element, className) {
    return element.classList.contains(className);
  },

  addClass(element, className) {
    element.classList.add(className);
  },

  removeClass(element, className) {
    element.classList.remove(className);
  },

  toggleClass(element, className) {
    element.classList.toggle(className);
  }
};

// String Utilities
const StringUtils = {
  capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  },

  camelCase(str) {
    return str.replace(/[-_\s]+(.)?/g, (_, c) => c ? c.toUpperCase() : '');
  },

  kebabCase(str) {
    return str.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
  },

  truncate(str, length, suffix = '...') {
    if (str.length <= length) return str;
    return str.substring(0, length - suffix.length) + suffix;
  },

  slugify(str) {
    return str
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  },

  stripHtml(str) {
    const div = document.createElement('div');
    div.innerHTML = str;
    return div.textContent || div.innerText || '';
  },

  escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }
};

// Number Utilities
const NumberUtils = {
  formatCurrency(amount, currency = 'USD', locale = 'en-US') {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currency
    }).format(amount);
  },

  formatNumber(num, decimals = 0) {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    }).format(num);
  },

  formatPercentage(num, decimals = 1) {
    return new Intl.NumberFormat('en-US', {
      style: 'percent',
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    }).format(num / 100);
  },

  clamp(num, min, max) {
    return Math.min(Math.max(num, min), max);
  },

  lerp(start, end, factor) {
    return start + (end - start) * factor;
  },

  randomBetween(min, max) {
    return Math.random() * (max - min) + min;
  },

  randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
};

// Date Utilities
const DateUtils = {
  formatDate(date, format = 'YYYY-MM-DD') {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');
    const seconds = String(d.getSeconds()).padStart(2, '0');

    return format
      .replace('YYYY', year)
      .replace('MM', month)
      .replace('DD', day)
      .replace('HH', hours)
      .replace('mm', minutes)
      .replace('ss', seconds);
  },

  timeAgo(date) {
    const now = new Date();
    const diffInSeconds = Math.floor((now - new Date(date)) / 1000);

    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)}d ago`;
    if (diffInSeconds < 31536000) return `${Math.floor(diffInSeconds / 2592000)}mo ago`;
    return `${Math.floor(diffInSeconds / 31536000)}y ago`;
  },

  addDays(date, days) {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  },

  isToday(date) {
    const today = new Date();
    const checkDate = new Date(date);
    return today.toDateString() === checkDate.toDateString();
  }
};

// Array Utilities
const ArrayUtils = {
  shuffle(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  },

  unique(array) {
    return [...new Set(array)];
  },

  chunk(array, size) {
    const chunks = [];
    for (let i = 0; i < array.length; i += size) {
      chunks.push(array.slice(i, i + size));
    }
    return chunks;
  },

  groupBy(array, key) {
    return array.reduce((groups, item) => {
      const group = typeof key === 'function' ? key(item) : item[key];
      groups[group] = groups[group] || [];
      groups[group].push(item);
      return groups;
    }, {});
  },

  sortBy(array, key, direction = 'asc') {
    return array.sort((a, b) => {
      const aVal = typeof key === 'function' ? key(a) : a[key];
      const bVal = typeof key === 'function' ? key(b) : b[key];

      if (direction === 'desc') {
        return bVal > aVal ? 1 : -1;
      }
      return aVal > bVal ? 1 : -1;
    });
  }
};

// Local Storage Utilities
const StorageUtils = {
  set(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (e) {
      console.error('Failed to save to localStorage:', e);
      return false;
    }
  },

  get(key, defaultValue = null) {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (e) {
      console.error('Failed to read from localStorage:', e);
      return defaultValue;
    }
  },

  remove(key) {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (e) {
      console.error('Failed to remove from localStorage:', e);
      return false;
    }
  },

  clear() {
    try {
      localStorage.clear();
      return true;
    } catch (e) {
      console.error('Failed to clear localStorage:', e);
      return false;
    }
  },

  exists(key) {
    return localStorage.getItem(key) !== null;
  }
};

// URL Utilities
const URLUtils = {
  getParams() {
    return Object.fromEntries(new URLSearchParams(window.location.search));
  },

  getParam(key, defaultValue = null) {
    const params = new URLSearchParams(window.location.search);
    return params.get(key) || defaultValue;
  },

  setParam(key, value) {
    const url = new URL(window.location);
    url.searchParams.set(key, value);
    window.history.replaceState({}, '', url);
  },

  removeParam(key) {
    const url = new URL(window.location);
    url.searchParams.delete(key);
    window.history.replaceState({}, '', url);
  },

  buildQuery(params) {
    return new URLSearchParams(params).toString();
  }
};

// Event Utilities
const EventUtils = {
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

  once(func) {
    let called = false;
    return function(...args) {
      if (!called) {
        called = true;
        return func.apply(this, args);
      }
    };
  },

  delegate(parent, selector, event, handler) {
    parent.addEventListener(event, function(e) {
      if (e.target.matches(selector)) {
        handler.call(e.target, e);
      }
    });
  }
};

// Color Utilities
const ColorUtils = {
  hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  },

  rgbToHex(r, g, b) {
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
  },

  lighten(color, amount) {
    const rgb = this.hexToRgb(color);
    if (!rgb) return color;

    return this.rgbToHex(
      Math.min(255, rgb.r + amount),
      Math.min(255, rgb.g + amount),
      Math.min(255, rgb.b + amount)
    );
  },

  darken(color, amount) {
    const rgb = this.hexToRgb(color);
    if (!rgb) return color;

    return this.rgbToHex(
      Math.max(0, rgb.r - amount),
      Math.max(0, rgb.g - amount),
      Math.max(0, rgb.b - amount)
    );
  },

  randomColor() {
    return '#' + Math.floor(Math.random()*16777215).toString(16);
  }
};

// Validation Utilities
const ValidationUtils = {
  isEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  isPhone(phone) {
    const phoneRegex = /^[\+]?[1-9][\d\s\-\(\)]{7,}$/;
    return phoneRegex.test(phone);
  },

  isURL(url) {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  },

  isNumeric(value) {
    return !isNaN(value) && !isNaN(parseFloat(value));
  },

  isEmpty(value) {
    if (value == null) return true;
    if (typeof value === 'string') return value.trim() === '';
    if (Array.isArray(value)) return value.length === 0;
    if (typeof value === 'object') return Object.keys(value).length === 0;
    return false;
  },

  isStrongPassword(password) {
    // At least 8 characters, 1 uppercase, 1 lowercase, 1 number, 1 special character
    const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return strongPasswordRegex.test(password);
  }
};

// Performance Utilities
const PerformanceUtils = {
  measureTime(name, func) {
    const start = performance.now();
    const result = func();
    const end = performance.now();
    console.log(`${name} took ${end - start} milliseconds`);
    return result;
  },

  measureAsyncTime(name, asyncFunc) {
    const start = performance.now();
    return asyncFunc().then(result => {
      const end = performance.now();
      console.log(`${name} took ${end - start} milliseconds`);
      return result;
    });
  },

  getMemoryUsage() {
    if (performance.memory) {
      return {
        used: Math.round(performance.memory.usedJSHeapSize / 1048576),
        total: Math.round(performance.memory.totalJSHeapSize / 1048576),
        limit: Math.round(performance.memory.jsHeapSizeLimit / 1048576)
      };
    }
    return null;
  },

  getFPS() {
    let fps = 0;
    let lastTime = performance.now();
    let frames = 0;

    function calculateFPS() {
      frames++;
      const currentTime = performance.now();

      if (currentTime >= lastTime + 1000) {
        fps = Math.round((frames * 1000) / (currentTime - lastTime));
        frames = 0;
        lastTime = currentTime;
      }

      requestAnimationFrame(calculateFPS);
    }

    calculateFPS();
    return () => fps;
  }
};

// Cookie Utilities
const CookieUtils = {
  set(name, value, days = 7) {
    const expires = new Date();
    expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
    document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/`;
  },

  get(name) {
    const nameEQ = name + "=";
    const ca = document.cookie.split(';');

    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) === ' ') c = c.substring(1, c.length);
      if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }

    return null;
  },

  remove(name) {
    document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`;
  }
};

// Image Utilities
const ImageUtils = {
  preload(src) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = src;
    });
  },

  preloadMultiple(sources) {
    return Promise.all(sources.map(src => this.preload(src)));
  },

  getImageDimensions(src) {
    return this.preload(src).then(img => ({
      width: img.naturalWidth,
      height: img.naturalHeight
    }));
  },

  createDataURL(canvas, quality = 0.8) {
    return canvas.toDataURL('image/jpeg', quality);
  }
};

// Animation Utilities
const AnimationUtils = {
  easeInOut(t) {
    return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
  },

  easeIn(t) {
    return t * t;
  },

  easeOut(t) {
    return t * (2 - t);
  },

  linear(t) {
    return t;
  },

  animate(duration, easing, callback) {
    const start = performance.now();

    function frame(currentTime) {
      const elapsed = currentTime - start;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = easing(progress);

      callback(easedProgress);

      if (progress < 1) {
        requestAnimationFrame(frame);
      }
    }

    requestAnimationFrame(frame);
  }
};

// Export utilities for global use
window.LearnEaseUtils = {
  Device: DeviceUtils,
  DOM: DOMUtils,
  String: StringUtils,
  Number: NumberUtils,
  Date: DateUtils,
  Array: ArrayUtils,
  Storage: StorageUtils,
  URL: URLUtils,
  Event: EventUtils,
  Color: ColorUtils,
  Validation: ValidationUtils,
  Performance: PerformanceUtils,
  Cookie: CookieUtils,
  Image: ImageUtils,
  Animation: AnimationUtils
};

// Console greeting
console.log('%c🎓 LearnEase Utils Loaded', 'color: #6366f1; font-size: 14px; font-weight: bold;');
console.log('%cAvailable utilities: Device, DOM, String, Number, Date, Array, Storage, URL, Event, Color, Validation, Performance, Cookie, Image, Animation', 'color: #666; font-size: 12px;');

// Export for module use
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    DeviceUtils,
    DOMUtils,
    StringUtils,
    NumberUtils,
    DateUtils,
    ArrayUtils,
    StorageUtils,
    URLUtils,
    EventUtils,
    ColorUtils,
    ValidationUtils,
    PerformanceUtils,
    CookieUtils,
    ImageUtils,
    AnimationUtils
  };
}