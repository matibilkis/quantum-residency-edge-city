// Expandable Cards - Vertical expansion instead of modal

document.addEventListener('DOMContentLoaded', function() {
  const cards = document.querySelectorAll('.card');
  const cardButtons = document.querySelectorAll('.card-expand-btn');
  
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
          document.body.classList.remove('card-expanded');
        }
        
        // Return focus to button
        button.focus();
      } else {
        card.classList.add('expanded');
        // Lock body scroll when card is expanded
        document.body.classList.add('card-expanded');
        
        // Scroll card to top of viewport, leaving space for sponsors at bottom
        setTimeout(() => {
          card.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'start'
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
        }, 100);
      }
    });
  });
  
  // Enhanced scroll containment and visual feedback
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
      
      // Prevent wheel scroll from propagating
      expandedContent.addEventListener('wheel', function(e) {
        const atTop = this.scrollTop === 0;
        const atBottom = this.scrollTop + this.clientHeight >= this.scrollHeight - 1;
        
        // Stop propagation at boundaries
        if ((atTop && e.deltaY < 0) || (atBottom && e.deltaY > 0)) {
          e.preventDefault();
          e.stopPropagation();
        } else {
          // Always stop propagation to keep scroll in card
          e.stopPropagation();
        }
      }, { passive: false });
      
      // Enhanced: Capture scroll on the entire card when expanded
      card.addEventListener('wheel', function(e) {
        if (this.classList.contains('expanded')) {
          // Only allow scroll inside the expanded content area
          if (e.target.closest('.card-expanded-content')) {
            // Scroll is inside content, let it happen but don't propagate
            e.stopPropagation();
          } else {
            // Scroll is on card but not in content area, prevent it
            e.preventDefault();
            e.stopPropagation();
          }
        }
      }, { passive: false });
      
      // Touch support
      expandedContent.addEventListener('touchmove', function(e) {
        e.stopPropagation();
      }, { passive: true });
    }
  });
  
  // Close expanded card when clicking outside
  document.addEventListener('click', function(e) {
    if (!e.target.closest('.card')) {
      cards.forEach(card => {
        card.classList.remove('expanded');
      });
      // Remove body lock
      document.body.classList.remove('card-expanded');
    }
  });
  
  // Close expanded card on ESC key
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
      cards.forEach(card => {
        card.classList.remove('expanded');
      });
      // Remove body lock
      document.body.classList.remove('card-expanded');
    }
  });
});

