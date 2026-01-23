// Smooth Scroll with Lenis

export function initSmoothScroll() {
  // Wait for Lenis to be loaded
  if (typeof Lenis === 'undefined') {
    console.warn('Lenis not loaded yet, retrying...');
    setTimeout(initSmoothScroll, 100);
    return;
  }

  // Improved configuration for better cross-platform scrolling
  const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

  const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smooth: true,
    mouseMultiplier: 1.5,
    // Disable smooth touch on mobile for native feel
    smoothTouch: false,
    touchMultiplier: isTouchDevice ? 1.5 : 2,
    infinite: false,
    wheelMultiplier: 1.0,
    // Improved orientation support
    orientation: 'vertical',
    gestureOrientation: 'vertical',
    // Prevent Lenis from affecting modals and expandable cards
    prevent: (node) => {
      // Don't apply smooth scroll when modal is open
      if (document.body.classList.contains('modal-open')) return true;
      // Don't apply when card is expanded
      if (document.body.classList.contains('card-expanded')) return true;
      // Or if the target is within a modal or card content
      return node.closest('[data-lenis-prevent]') !== null ||
             node.classList.contains('modal-overlay') ||
             node.closest('.modal-overlay') !== null ||
             node.closest('.card-expanded-content') !== null;
    },
  });

  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }

  requestAnimationFrame(raf);

  // Expose lenis globally for modal and card control
  window.lenis = lenis;

  // Stop scroll when modal is open
  window.addEventListener('modalOpen', () => lenis.stop());
  window.addEventListener('modalClose', () => lenis.start());

  // Also stop/start when cards are expanded/collapsed
  window.addEventListener('cardExpanded', () => lenis.stop());
  window.addEventListener('cardCollapsed', () => lenis.start());

  // Add resize handler for better responsiveness
  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      lenis.resize();
    }, 150);
  });
}

// Auto-initialize
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initSmoothScroll);
} else {
  initSmoothScroll();
}

