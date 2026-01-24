// Carousel functionality for Why 2026 and FAQ sections

document.addEventListener('DOMContentLoaded', function() {
  const carousels = document.querySelectorAll('.carousel-wrapper');
  
  carousels.forEach(carousel => {
    const carouselId = carousel.getAttribute('data-carousel-id');
    const track = carousel.querySelector('.carousel-track');
    const items = carousel.querySelectorAll('.carousel-item');
    const controls = document.querySelector(`[data-carousel="${carouselId}"]`);
    const prevBtn = controls.querySelector('.carousel-prev');
    const nextBtn = controls.querySelector('.carousel-next');
    const dotsContainer = controls.querySelector('.carousel-dots');
    
    // Find the initially active item, or default to 0
    let currentIndex = 0;
    items.forEach((item, index) => {
      if (item.classList.contains('active')) {
        currentIndex = index;
      }
    });
    
    const totalItems = items.length;
    
    // Create dots
    for (let i = 0; i < totalItems; i++) {
      const dot = document.createElement('span');
      dot.classList.add('carousel-dot');
      if (i === currentIndex) dot.classList.add('active');
      dot.addEventListener('click', () => goToSlide(i));
      dotsContainer.appendChild(dot);
    }
    
    const dots = dotsContainer.querySelectorAll('.carousel-dot');
    
    function updateCarousel() {
      // Update items
      items.forEach((item, index) => {
        item.classList.remove('active');
        if (index === currentIndex) {
          item.classList.add('active');
        }
      });
      
      // Update track position
      track.style.transform = `translateX(-${currentIndex * 100}%)`;
      
      // Update dots
      dots.forEach((dot, index) => {
        dot.classList.remove('active');
        if (index === currentIndex) {
          dot.classList.add('active');
        }
      });
    }
    
    // Initialize carousel position
    updateCarousel();
    
    function goToSlide(index) {
      currentIndex = index;
      updateCarousel();
    }
    
    function nextSlide() {
      currentIndex = (currentIndex + 1) % totalItems;
      updateCarousel();
    }
    
    function prevSlide() {
      currentIndex = (currentIndex - 1 + totalItems) % totalItems;
      updateCarousel();
    }
    
    // Event listeners
    nextBtn.addEventListener('click', nextSlide);
    prevBtn.addEventListener('click', prevSlide);
    
    // Keyboard navigation
    carousel.addEventListener('keydown', function(e) {
      if (e.key === 'ArrowLeft') {
        prevSlide();
      } else if (e.key === 'ArrowRight') {
        nextSlide();
      }
    });
    
    // Touch/swipe support
    let touchStartX = 0;
    let touchEndX = 0;
    
    carousel.addEventListener('touchstart', function(e) {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });
    
    carousel.addEventListener('touchend', function(e) {
      touchEndX = e.changedTouches[0].screenX;
      handleSwipe();
    }, { passive: true });
    
    function handleSwipe() {
      const swipeThreshold = 50;
      const diff = touchStartX - touchEndX;
      
      if (Math.abs(diff) > swipeThreshold) {
        if (diff > 0) {
          nextSlide();
        } else {
          prevSlide();
        }
      }
    }
    
    // Auto-play (optional, commented out)
    /*
    let autoplayInterval = setInterval(nextSlide, 5000);
    
    carousel.addEventListener('mouseenter', () => {
      clearInterval(autoplayInterval);
    });
    
    carousel.addEventListener('mouseleave', () => {
      autoplayInterval = setInterval(nextSlide, 5000);
    });
    */
  });
});

