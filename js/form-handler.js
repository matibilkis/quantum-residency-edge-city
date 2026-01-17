// Interest Form Handler

document.addEventListener('DOMContentLoaded', function() {
  const form = document.getElementById('interest-form');
  const formStatus = document.getElementById('form-status');
  const submitBtn = form.querySelector('.form-submit-btn');
  
  // API endpoint - adjust this based on your deployment
  const API_URL = window.location.origin + '/api/interest';
  
  form.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    // Get form data
    const formData = {
      name: document.getElementById('name').value.trim(),
      email: document.getElementById('email').value.trim(),
      curiosity: document.getElementById('curiosity').value.trim(),
      participation: document.getElementById('participation').value,
      institution: document.getElementById('institution').value.trim()
    };
    
    // Client-side validation
    if (!formData.name || !formData.email || !formData.curiosity || !formData.participation) {
      showStatus('Please fill in all required fields.', 'error');
      return;
    }
    
    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      showStatus('Please enter a valid email address.', 'error');
      return;
    }
    
    // Disable submit button and show loading
    submitBtn.disabled = true;
    showStatus('Submitting...', 'loading');
    
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });
      
      const result = await response.json();
      
      if (result.success) {
        showStatus(result.message, 'success');
        form.reset();
        
        // Close modal after 2 seconds
        setTimeout(() => {
          const modal = document.getElementById('interest-form-modal');
          modal.classList.remove('active');
          document.body.style.overflow = '';
          formStatus.textContent = '';
          formStatus.className = 'form-status';
        }, 2000);
      } else {
        showStatus(result.message || 'Something went wrong. Please try again.', 'error');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      showStatus('Unable to submit form. Please check your connection and try again.', 'error');
    } finally {
      submitBtn.disabled = false;
    }
  });
  
  function showStatus(message, type) {
    formStatus.textContent = message;
    formStatus.className = `form-status ${type}`;
  }
  
  // Clear status when modal is opened
  const interestFormModal = document.getElementById('interest-form-modal');
  if (interestFormModal) {
    interestFormModal.addEventListener('click', function(e) {
      if (e.target === interestFormModal) {
        formStatus.textContent = '';
        formStatus.className = 'form-status';
      }
    });
  }
  
  // Clear status when modal is closed
  const closeBtn = interestFormModal?.querySelector('.modal-close');
  if (closeBtn) {
    closeBtn.addEventListener('click', function() {
      formStatus.textContent = '';
      formStatus.className = 'form-status';
    });
  }
  
  // Prevent viewport resize on mobile when keyboard appears
  if (interestFormModal) {
    const formInputs = form.querySelectorAll('input, textarea, select');
    let viewportHeight = window.innerHeight;
    let isModalOpen = false;
    
    // Lock viewport height when modal opens
    const lockViewport = () => {
      if (!isModalOpen) {
        viewportHeight = window.innerHeight;
        isModalOpen = true;
        // Set fixed height on modal to prevent keyboard from resizing it
        interestFormModal.style.height = `${viewportHeight}px`;
      }
    };
    
    // Unlock viewport when modal closes
    const unlockViewport = () => {
      if (isModalOpen) {
        isModalOpen = false;
        interestFormModal.style.height = '';
      }
    };
    
    // Handle modal open/close
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
          if (interestFormModal.classList.contains('active')) {
            lockViewport();
            // Prevent iOS zoom on input focus and scroll input into view smoothly
            formInputs.forEach(input => {
              input.addEventListener('focus', function scrollToInput() {
                // Use requestAnimationFrame for smooth scrolling
                requestAnimationFrame(() => {
                  input.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'nearest' });
                });
              }, { once: true });
            });
          } else {
            unlockViewport();
          }
        }
      });
    });
    
    observer.observe(interestFormModal, { attributes: true });
    
    // Handle window resize - only update if significant change (not keyboard)
    let resizeTimer;
    window.addEventListener('resize', () => {
      if (isModalOpen) {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
          // Only update if the resize is significant (screen rotation, not keyboard)
          const heightDiff = Math.abs(window.innerHeight - viewportHeight);
          if (heightDiff > 150) {
            viewportHeight = window.innerHeight;
            interestFormModal.style.height = `${viewportHeight}px`;
          }
        }, 100);
      }
    });
  }
});

