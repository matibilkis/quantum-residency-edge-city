// Micro-interactions - Performance Optimized
// Only scroll-based reveal animations (uses efficient IntersectionObserver)

export class MicroInteractions {
  constructor() {
    this.init();
  }

  init() {
    this.initScrollAnimations();
  }

  initScrollAnimations() {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target); // Stop observing once visible
        }
      });
    }, observerOptions);

    // Observe cards for fade-in animation
    const cards = document.querySelectorAll('.card');
    cards.forEach((card, index) => {
      card.style.transitionDelay = `${index * 0.1}s`;
      observer.observe(card);
    });
  }
}

// Auto-initialize
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    new MicroInteractions();
  });
} else {
  new MicroInteractions();
}
