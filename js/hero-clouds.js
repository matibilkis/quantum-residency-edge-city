// Cloud Convergence Animation with Anime.js

export function initCloudAnimation() {
  // Wait for Anime.js to be loaded
  if (typeof anime === 'undefined') {
    console.warn('Anime.js not loaded yet, retrying...');
    setTimeout(initCloudAnimation, 100);
    return;
  }

  const clouds = {
    philosophy: document.querySelector('.cloud-philosophy'),
    web3: document.querySelector('.cloud-web3'),
    transdisciplinary: document.querySelector('.cloud-transdisciplinary')
  };

  // Check if clouds exist
  if (!clouds.philosophy || !clouds.web3 || !clouds.transdisciplinary) {
    console.warn('Clouds not found in DOM');
    return;
  }

  // Create timeline for dramatic convergence and separation (3 second cycle)
  const timeline = anime.timeline({
    loop: true,
    easing: 'easeInOutCubic'
  });

  // PHASE 1: Clouds converge to center (OVERLAP dramatically)
  // Philosophy cloud (left) - moves RIGHT to center and overlaps
  timeline.add({
    targets: clouds.philosophy,
    translateX: [0, 420],
    translateY: [0, -5],
    scale: [1, 1.25],
    opacity: [0.8, 1],
    rotate: [0, 8],
    duration: 1000,
    easing: 'easeInOutQuart'
  }, 0);

  // Web3 cloud (center) - pulses bigger and rises
  timeline.add({
    targets: clouds.web3,
    translateY: [0, -10],
    scale: [1, 1.3],
    opacity: [0.85, 1],
    duration: 1000,
    easing: 'easeInOutQuart'
  }, 0);

  // Transdisciplinary cloud (right) - moves LEFT to center and overlaps
  timeline.add({
    targets: clouds.transdisciplinary,
    translateX: [0, -420],
    translateY: [0, -5],
    scale: [1, 1.25],
    opacity: [0.8, 1],
    rotate: [0, -8],
    duration: 1000,
    easing: 'easeInOutQuart'
  }, 0);

  // PHASE 2: Hold overlapped position briefly
  timeline.add({
    targets: [clouds.philosophy, clouds.web3, clouds.transdisciplinary],
    scale: '+=0',
    duration: 200
  }, 1000);

  // PHASE 3: Clouds separate back to original positions
  // Philosophy cloud returns LEFT
  timeline.add({
    targets: clouds.philosophy,
    translateX: [420, 0],
    translateY: [-5, 0],
    scale: [1.25, 1],
    opacity: [1, 0.8],
    rotate: [8, 0],
    duration: 1000,
    easing: 'easeInOutQuart'
  }, 1200);

  // Web3 cloud returns to center
  timeline.add({
    targets: clouds.web3,
    translateY: [-10, 0],
    scale: [1.3, 1],
    opacity: [1, 0.85],
    duration: 1000,
    easing: 'easeInOutQuart'
  }, 1200);

  // Transdisciplinary cloud returns RIGHT
  timeline.add({
    targets: clouds.transdisciplinary,
    translateX: [-420, 0],
    translateY: [-5, 0],
    scale: [1.25, 1],
    opacity: [1, 0.8],
    rotate: [-8, 0],
    duration: 1000,
    easing: 'easeInOutQuart'
  }, 1200);

  // PHASE 4: Rest pause before loop
  timeline.add({
    targets: [clouds.philosophy, clouds.web3, clouds.transdisciplinary],
    scale: '+=0',
    duration: 800
  }, 2200);

  // Add container perspective shift for 3D effect
  timeline.add({
    targets: '.cloud-convergence',
    rotateX: [0, 4, 0, -4, 0],
    duration: 3000,
    easing: 'easeInOutSine'
  }, 0);
}

// Auto-initialize when module loads
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initCloudAnimation);
} else {
  initCloudAnimation();
}

