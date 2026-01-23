// Cloud Animation - CSS-based for performance
// The animation is now handled via CSS keyframes in hero.css

export function initCloudAnimation() {
  // Clouds are animated via CSS - no JavaScript needed
  // This file kept for module compatibility
}

// Auto-initialize (no-op)
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initCloudAnimation);
} else {
  initCloudAnimation();
}
