// Modal Interactions

export class Modal {
  constructor(modalId) {
    this.modal = document.getElementById(modalId);
    this.triggers = [];
    this.closeBtn = this.modal?.querySelector('.modal-close');
    this.focusableElements = [];
    this.firstFocusable = null;
    this.lastFocusable = null;
    this.activeTrigger = null;
    
    if (!this.modal) {
      console.warn(`Modal ${modalId} not found`);
      return;
    }
    
    this.init();
  }
  
  init() {
    // Find all buttons with data-modal attribute matching this modal's ID
    const allTriggers = document.querySelectorAll(`[data-modal="${this.modal.id}"]`);
    this.triggers = Array.from(allTriggers);
    
    if (this.triggers.length === 0) {
      console.warn(`No triggers found for modal ${this.modal.id}`);
      return;
    }
    
    // Open modal on trigger click
    this.triggers.forEach(trigger => {
      trigger.addEventListener('click', () => {
        this.activeTrigger = trigger;
        this.open();
      });
    });
    
    // Close on close button
    this.closeBtn?.addEventListener('click', () => this.close());
    
    // Close on overlay click
    this.modal.addEventListener('click', (e) => {
      if (e.target === this.modal) this.close();
    });
    
    // Close on ESC key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.modal.classList.contains('active')) {
        this.close();
      }
    });
    
    // Focus trap
    this.modal.addEventListener('keydown', (e) => this.handleFocusTrap(e));
  }
  
  open() {
    this.modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    // Setup focus trap
    this.setupFocusTrap();
    
    // Focus first focusable element
    setTimeout(() => {
      if (this.firstFocusable) {
        this.firstFocusable.focus();
      }
    }, 100);
  }
  
  close() {
    this.modal.classList.remove('active');
    document.body.style.overflow = '';
    
    // Return focus to trigger
    this.activeTrigger?.focus();
  }
  
  setupFocusTrap() {
    const focusableSelectors = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
    this.focusableElements = Array.from(this.modal.querySelectorAll(focusableSelectors));
    this.firstFocusable = this.focusableElements[0];
    this.lastFocusable = this.focusableElements[this.focusableElements.length - 1];
  }
  
  handleFocusTrap(e) {
    if (e.key !== 'Tab') return;
    
    if (e.shiftKey) {
      // Shift + Tab
      if (document.activeElement === this.firstFocusable) {
        e.preventDefault();
        this.lastFocusable?.focus();
      }
    } else {
      // Tab
      if (document.activeElement === this.lastFocusable) {
        e.preventDefault();
        this.firstFocusable?.focus();
      }
    }
  }
}

// Auto-initialize all three modals
function initializeModals() {
  new Modal('research-modal');
  new Modal('business-modal');
  new Modal('transdisciplinary-modal');
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeModals);
} else {
  initializeModals();
}

