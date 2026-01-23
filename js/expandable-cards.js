// Expandable Cards - Vertical expansion instead of modal

document.addEventListener('DOMContentLoaded', function() {
  const cards = document.querySelectorAll('.card');
  const cardButtons = document.querySelectorAll('.card-expand-btn');

  // Improved cross-platform scroll handling
  function lockBodyScroll() {
    // Store current scroll position
    const scrollY = window.scrollY;
    document.body.style.position = 'fixed';
    document.body.style.top = `-${scrollY}px`;
    document.body.style.width = '100%';
    document.body.classList.add('card-expanded');
  }

  function unlockBodyScroll() {
    const scrollY = document.body.style.top;
    document.body.style.position = '';
    document.body.style.top = '';
    document.body.style.width = '';
    document.body.classList.remove('card-expanded');
    window.scrollTo(0, parseInt(scrollY || '0') * -1);
  }

  cardButtons.forEach((button, index) => {
    button.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();

      const card = this.closest('.card');
      const isExpanded = card.classList.contains('expanded');

      // Close all other cards
      cards.forEach(c => {
        if (c !== card) {
          c.classList.remove('expanded');
        }
      });

      // Toggle this card
      if (isExpanded) {
        card.classList.remove('expanded');
        // Remove body lock when no cards are expanded
        if (!document.querySelector('.card.expanded')) {
          unlockBodyScroll();
        }

        // Return focus to button
        button.focus();
      } else {
        card.classList.add('expanded');
        // Lock body scroll when card is expanded
        lockBodyScroll();

        // Scroll card to top of viewport with better cross-platform support
        requestAnimationFrame(() => {
          const cardTop = card.getBoundingClientRect().top + window.scrollY;
          window.scrollTo({
            top: cardTop - 20,
            behavior: 'smooth'
          });

          // Focus the expanded content for keyboard users
          const expandedContent = card.querySelector('.card-expanded-content');
          if (expandedContent) {
            expandedContent.setAttribute('tabindex', '-1');
            expandedContent.focus({ preventScroll: true });

            // Add subtle scroll hint animation
            setTimeout(() => {
              if (expandedContent.scrollHeight > expandedContent.clientHeight) {
                // Content is scrollable - give visual hint
                expandedContent.scrollTop = 1;
                setTimeout(() => {
                  expandedContent.scrollTop = 0;
                }, 150);
              }
            }, 600);
          }
        });
      }
    });
  });
  
  // Enhanced scroll containment and visual feedback with better cross-platform support
  cards.forEach(card => {
    const expandedContent = card.querySelector('.card-expanded-content');
    if (expandedContent) {

      // Track scroll position for visual indicators
      function updateScrollIndicators() {
        const scrollTop = expandedContent.scrollTop;
        const scrollHeight = expandedContent.scrollHeight;
        const clientHeight = expandedContent.clientHeight;
        const scrollBottom = scrollHeight - scrollTop - clientHeight;

        // Add class when scrolled (for header shadow)
        if (scrollTop > 10) {
          expandedContent.classList.add('scrolled');
        } else {
          expandedContent.classList.remove('scrolled');
        }

        // Add class when scrolled to bottom (hide gradient)
        if (scrollBottom < 10) {
          expandedContent.classList.add('scrolled-to-bottom');
        } else {
          expandedContent.classList.remove('scrolled-to-bottom');
        }
      }

      expandedContent.addEventListener('scroll', updateScrollIndicators, { passive: true });

      // Improved wheel event handling for cross-platform compatibility
      let isScrolling = false;
      expandedContent.addEventListener('wheel', function(e) {
        if (!card.classList.contains('expanded')) return;

        const atTop = this.scrollTop <= 0;
        const atBottom = this.scrollTop + this.clientHeight >= this.scrollHeight - 1;

        // Prevent scroll chaining at boundaries
        if ((atTop && e.deltaY < 0) || (atBottom && e.deltaY > 0)) {
          e.preventDefault();
        }

        e.stopPropagation();
        isScrolling = true;
        clearTimeout(expandedContent._scrollTimeout);
        expandedContent._scrollTimeout = setTimeout(() => {
          isScrolling = false;
        }, 150);
      }, { passive: false });

      // Enhanced: Capture scroll on the entire card when expanded
      card.addEventListener('wheel', function(e) {
        if (this.classList.contains('expanded')) {
          // Only allow scroll inside the expanded content area
          if (!e.target.closest('.card-expanded-content')) {
            // Scroll is on card but not in content area, prevent it
            e.preventDefault();
          }
          e.stopPropagation();
        }
      }, { passive: false });

      // Enhanced touch support for mobile platforms
      let touchStartY = 0;
      let contentStartScrollTop = 0;

      expandedContent.addEventListener('touchstart', function(e) {
        if (!card.classList.contains('expanded')) return;
        touchStartY = e.touches[0].clientY;
        contentStartScrollTop = this.scrollTop;
      }, { passive: true });

      expandedContent.addEventListener('touchmove', function(e) {
        if (!card.classList.contains('expanded')) return;

        const touchY = e.touches[0].clientY;
        const touchDelta = touchStartY - touchY;
        const atTop = this.scrollTop <= 0;
        const atBottom = this.scrollTop + this.clientHeight >= this.scrollHeight - 1;

        // Prevent overscroll at boundaries
        if ((atTop && touchDelta < 0) || (atBottom && touchDelta > 0)) {
          e.preventDefault();
        }

        e.stopPropagation();
      }, { passive: false });
    }
  });
  
  // Close expanded card when clicking outside
  document.addEventListener('click', function(e) {
    if (!e.target.closest('.card') && !e.target.closest('.card-expand-btn')) {
      const hadExpandedCard = document.querySelector('.card.expanded');
      cards.forEach(card => {
        card.classList.remove('expanded');
      });
      // Remove body lock if there was an expanded card
      if (hadExpandedCard) {
        unlockBodyScroll();
      }
    }
  });

  // Close expanded card on ESC key
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
      const hadExpandedCard = document.querySelector('.card.expanded');
      cards.forEach(card => {
        card.classList.remove('expanded');
      });
      // Remove body lock if there was an expanded card
      if (hadExpandedCard) {
        unlockBodyScroll();
      }
    }
  });

  // Prevent zoom on iOS double-tap for card buttons
  cardButtons.forEach(button => {
    button.addEventListener('touchend', function(e) {
      e.preventDefault();
      this.click();
    }, { passive: false });
  });
});

