// Navigation functionality - sticky nav, back to top, smooth scroll

document.addEventListener('DOMContentLoaded', function() {
  const nav = document.getElementById('main-nav');
  const backToTop = document.getElementById('back-to-top');
  const navToggle = document.getElementById('nav-toggle');
  const navLinks = document.getElementById('nav-links');
  
  // Sticky navigation on scroll
  let lastScroll = 0;
  window.addEventListener('scroll', function() {
    const currentScroll = window.pageYOffset;
    
    // Show nav after scrolling down 200px
    if (currentScroll > 200) {
      nav.classList.add('visible');
    } else {
      nav.classList.remove('visible');
    }
    
    // Show/hide back to top button
    if (currentScroll > 500) {
      backToTop.classList.add('visible');
    } else {
      backToTop.classList.remove('visible');
    }
    
    lastScroll = currentScroll;
  });
  
  // Back to top functionality
  backToTop.addEventListener('click', function() {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
  
  // Mobile menu toggle
  if (navToggle) {
    navToggle.addEventListener('click', function() {
      navLinks.classList.toggle('active');
      
      // Change icon
      if (navLinks.classList.contains('active')) {
        navToggle.textContent = '✕';
      } else {
        navToggle.textContent = '☰';
      }
    });
  }
  
  // Close mobile menu when clicking a link
  const navLinksArray = navLinks.querySelectorAll('a');
  navLinksArray.forEach(link => {
    link.addEventListener('click', function() {
      if (window.innerWidth <= 768) {
        navLinks.classList.remove('active');
        if (navToggle) {
          navToggle.textContent = '☰';
        }
      }
    });
  });
  
  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      
      // Skip if it's a modal trigger or empty hash
      if (href === '#' || this.hasAttribute('data-modal')) {
        return;
      }
      
      e.preventDefault();
      const target = document.querySelector(href);
      
      if (target) {
        const offsetTop = target.offsetTop - 80; // Account for nav height
        
        window.scrollTo({
          top: offsetTop,
          behavior: 'smooth'
        });
      }
    });
  });
  
  // Add active state to nav links based on scroll position
  const sections = document.querySelectorAll('section[id]');
  
  window.addEventListener('scroll', function() {
    let current = '';
    const scrollY = window.pageYOffset;
    
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 100;
      const sectionHeight = section.offsetHeight;
      
      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        current = section.getAttribute('id');
      }
    });
    
    navLinksArray.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  });
  
  // Handle modal triggers in footer
  const footerModalTriggers = document.querySelectorAll('.footer-links [data-modal]');
  footerModalTriggers.forEach(trigger => {
    trigger.addEventListener('click', function(e) {
      e.preventDefault();
      const modalId = this.getAttribute('data-modal');
      const modal = document.getElementById(modalId);
      if (modal) {
        modal.classList.add('active');
        document.body.classList.add('modal-open');
        document.body.style.overflow = 'hidden';
        if (window.lenis) {
          window.lenis.stop();
        }
        window.dispatchEvent(new Event('modalOpen'));
      }
    });
  });
});

