// Micro-interactions: Card hovers, CTA magnetic effect, scroll animations

export class MicroInteractions {
  constructor() {
    this.init();
  }
  
  init() {
    this.initCardTilt();
    this.initMagneticButtons();
    this.initRippleEffect();
    this.initScrollAnimations();
  }
  
  initCardTilt() {
    const cards = document.querySelectorAll('.card');
    
    cards.forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = (y - centerY) / 20;
        const rotateY = (centerX - x) / 20;
        
        if (typeof anime !== 'undefined') {
          anime({
            targets: card,
            rotateX: rotateX,
            rotateY: rotateY,
            duration: 300,
            easing: 'easeOutQuad'
          });
        }
      });
      
      card.addEventListener('mouseleave', () => {
        if (typeof anime !== 'undefined') {
          anime({
            targets: card,
            rotateX: 0,
            rotateY: 0,
            duration: 500,
            easing: 'easeOutElastic(1, .5)'
          });
        }
      });
    });
  }
  
  initMagneticButtons() {
    const buttons = document.querySelectorAll('.cta-btn, .learn-more-btn');
    
    buttons.forEach(button => {
      button.addEventListener('mousemove', (e) => {
        const rect = button.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        
        // Magnetic effect - subtle pull toward cursor
        const moveX = x * 0.15;
        const moveY = y * 0.15;
        
        if (typeof anime !== 'undefined') {
          anime({
            targets: button,
            translateX: moveX,
            translateY: moveY,
            duration: 300,
            easing: 'easeOutQuad'
          });
        }
      });
      
      button.addEventListener('mouseleave', () => {
        if (typeof anime !== 'undefined') {
          anime({
            targets: button,
            translateX: 0,
            translateY: 0,
            duration: 500,
            easing: 'easeOutElastic(1, .6)'
          });
        }
      });
    });
  }
  
  initRippleEffect() {
    const buttons = document.querySelectorAll('.cta-btn, .learn-more-btn');
    
    buttons.forEach(button => {
      button.addEventListener('click', function(e) {
        const rect = this.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const ripple = document.createElement('span');
        ripple.className = 'ripple';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        
        this.appendChild(ripple);
        
        setTimeout(() => ripple.remove(), 600);
      });
    });
  }
  
  initScrollAnimations() {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
        }
      });
    }, observerOptions);
    
    // Observe cards for fade-in animation
    const cards = document.querySelectorAll('.card');
    cards.forEach((card, index) => {
      card.style.opacity = '0';
      card.style.transform = 'translateY(30px)';
      card.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
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

