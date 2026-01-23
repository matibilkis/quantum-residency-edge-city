// Smooth Scroll with Lenis

export function initSmoothScroll() {
  // Wait for Lenis to be loaded
  if (typeof Lenis === 'undefined') {
    console.warn('Lenis not loaded yet, retrying...');
    setTimeout(initSmoothScroll, 100);
    return;
  }

  const lenis = new Lenis({
    duration: 1.0,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smooth: true,
    mouseMultiplier: 1.0,
    smoothTouch: true,
    touchMultiplier: 1.0,
    infinite: false,
    wheelMultiplier: 0.8,
    lerp: 0.1,
    // Prevent Lenis from affecting modals
    prevent: (node) => {
      // Don't apply smooth scroll when modal is open
      if (document.body.classList.contains('modal-open')) return true;
      // Or if the target is within a modal
      return node.closest('[data-lenis-prevent]') !== null || 
             node.classList.contains('modal-overlay') ||
             node.closest('.modal-overlay') !== null;
    },
  });

  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }

  requestAnimationFrame(raf);

  // Expose lenis globally for modal control
  window.lenis = lenis;

  // Stop scroll when modal is open
  window.addEventListener('modalOpen', () => lenis.stop());
  window.addEventListener('modalClose', () => lenis.start());
}

// Auto-initialize
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initSmoothScroll);
} else {
  initSmoothScroll();
}

