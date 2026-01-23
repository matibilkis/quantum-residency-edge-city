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
    
    let currentIndex = 0;
    const totalItems = items.length;
    
    // Create dots
    for (let i = 0; i < totalItems; i++) {
      const dot = document.createElement('span');
      dot.classList.add('carousel-dot');
      if (i === 0) dot.classList.add('active');
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
    
    // Enhanced touch/swipe support with better cross-platform handling
    let touchStartX = 0;
    let touchEndX = 0;
    let touchStartY = 0;
    let isDragging = false;

    carousel.addEventListener('touchstart', function(e) {
      touchStartX = e.changedTouches[0].screenX;
      touchStartY = e.changedTouches[0].screenY;
      isDragging = false;
    }, { passive: true });

    carousel.addEventListener('touchmove', function(e) {
      // Detect if this is a horizontal swipe
      const currentX = e.changedTouches[0].screenX;
      const currentY = e.changedTouches[0].screenY;
      const diffX = Math.abs(currentX - touchStartX);
      const diffY = Math.abs(currentY - touchStartY);

      // If horizontal movement is greater than vertical, it's a swipe
      if (diffX > diffY && diffX > 10) {
        isDragging = true;
        // Prevent vertical scroll during horizontal swipe
        e.preventDefault();
      }
    }, { passive: false });

    carousel.addEventListener('touchend', function(e) {
      if (isDragging) {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
      }
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

