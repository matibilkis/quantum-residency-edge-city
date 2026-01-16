// Epic Animated Starfield Background - Designed to WOW

export class ParticleSystem {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) {
      console.warn('Particle canvas not found');
      return;
    }
    
    this.ctx = this.canvas.getContext('2d');
    this.stars = [];
    this.shootingStars = [];
    
    // More stars for a fuller, more impressive sky
    this.starCount = 200; // Increased from 50
    
    // Shooting star configuration
    this.shootingStarFrequency = 3000; // New shooting star every 3 seconds on average
    this.lastShootingStar = Date.now();
    
    this.mouse = { x: 0, y: 0 };
    
    this.init();
  }
  
  init() {
    this.resize();
    this.createStars();
    this.animate();
    
    // Event listeners
    window.addEventListener('resize', () => this.resize());
    document.addEventListener('mousemove', (e) => {
      this.mouse.x = e.clientX;
      this.mouse.y = e.clientY;
    });
  }
  
  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    // Recreate stars on resize
    this.createStars();
  }
  
  createStars() {
    this.stars = [];
    
    for (let i = 0; i < this.starCount; i++) {
      // Create stars with varying depths (3 layers)
      const depth = Math.random() * 3; // 0-3 for depth layers
      const depthFactor = 1 + depth; // Stars further away are smaller
      
      this.stars.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        
        // Size varies based on depth and randomness
        baseRadius: (Math.random() * 1.5 + 0.5) / depthFactor,
        currentRadius: 0, // Will be calculated during twinkle
        
        // Depth for parallax effect
        depth: depth,
        
        // Movement (slower for distant stars)
        vx: (Math.random() - 0.5) * 0.15 / depthFactor,
        vy: (Math.random() - 0.5) * 0.15 / depthFactor,
        
        // Twinkle properties
        twinkleSpeed: Math.random() * 0.03 + 0.01, // Varied speeds
        twinkleOffset: Math.random() * Math.PI * 2, // Random phase
        twinkleIntensity: Math.random() * 0.4 + 0.6, // 0.6-1.0 intensity
        
        // Color with subtle variety
        color: this.getStarColor(depth),
        
        // Opacity based on depth
        baseOpacity: (Math.random() * 0.5 + 0.5) / Math.sqrt(depthFactor)
      });
    }
  }
  
  getStarColor(depth) {
    // Mix of quantum-themed colors with classic star colors
    const colors = [
      { r: 255, g: 255, b: 255 },  // White (most common)
      { r: 255, g: 255, b: 255 },  // White
      { r: 255, g: 255, b: 255 },  // White
      { r: 230, g: 240, b: 255 },  // Slightly blue-white
      { r: 30, g: 203, b: 225 },   // Primary cyan
      { r: 46, g: 236, b: 184 },   // Philosophy green
      { r: 227, g: 102, b: 247 },  // Web3 purple
      { r: 254, g: 199, b: 72 }    // Transdisciplinary yellow
    ];
    
    // Deeper stars tend to be whiter/dimmer
    const colorIndex = depth > 2 ? 0 : Math.floor(Math.random() * colors.length);
    return colors[colorIndex];
  }
  
  createShootingStar() {
    // Random starting position (usually from top or side)
    const side = Math.floor(Math.random() * 4); // 0=top, 1=right, 2=bottom, 3=left
    let x, y, angle;
    
    switch(side) {
      case 0: // From top
        x = Math.random() * this.canvas.width;
        y = -10;
        angle = Math.random() * Math.PI / 3 + Math.PI / 6; // Downward angles
        break;
      case 1: // From right
        x = this.canvas.width + 10;
        y = Math.random() * this.canvas.height * 0.5; // Upper half
        angle = Math.random() * Math.PI / 4 + Math.PI * 0.75; // Leftward angles
        break;
      case 2: // From top-right diagonal (most common shooting star direction)
        x = Math.random() * this.canvas.width * 0.5 + this.canvas.width * 0.5;
        y = -10;
        angle = Math.random() * Math.PI / 6 + Math.PI / 3; // Diagonal down-left
        break;
      default: // From left
        x = -10;
        y = Math.random() * this.canvas.height * 0.5;
        angle = Math.random() * Math.PI / 4; // Rightward angles
        break;
    }
    
    const speed = Math.random() * 8 + 12; // Fast!
    const length = Math.random() * 80 + 60; // Tail length
    
    this.shootingStars.push({
      x: x,
      y: y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      length: length,
      angle: angle,
      opacity: 1,
      fadeRate: Math.random() * 0.015 + 0.01,
      thickness: Math.random() * 2 + 1.5,
      color: { r: 255, g: 255, b: 255 } // Bright white
    });
  }
  
  drawStars(time) {
    this.stars.forEach(star => {
      // Calculate twinkling effect using sine wave
      const twinkle = Math.sin(time * star.twinkleSpeed + star.twinkleOffset);
      const twinkleFactor = (twinkle + 1) / 2; // Normalize to 0-1
      
      // Apply twinkle to both size and opacity
      star.currentRadius = star.baseRadius * (0.5 + twinkleFactor * 0.5 * star.twinkleIntensity);
      const opacity = star.baseOpacity * (0.7 + twinkleFactor * 0.3);
      
      // Draw star with glow effect
      const { r, g, b } = star.color;
      
      // Outer glow
      const gradient = this.ctx.createRadialGradient(
        star.x, star.y, 0,
        star.x, star.y, star.currentRadius * 3
      );
      gradient.addColorStop(0, `rgba(${r}, ${g}, ${b}, ${opacity})`);
      gradient.addColorStop(0.3, `rgba(${r}, ${g}, ${b}, ${opacity * 0.5})`);
      gradient.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`);
      
      this.ctx.beginPath();
      this.ctx.arc(star.x, star.y, star.currentRadius * 3, 0, Math.PI * 2);
      this.ctx.fillStyle = gradient;
      this.ctx.fill();
      
      // Core star (brighter)
      this.ctx.beginPath();
      this.ctx.arc(star.x, star.y, star.currentRadius, 0, Math.PI * 2);
      this.ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${Math.min(opacity * 1.5, 1)})`;
      this.ctx.fill();
    });
  }
  
  drawShootingStars() {
    this.shootingStars.forEach(star => {
      // Draw the shooting star with gradient tail
      const gradient = this.ctx.createLinearGradient(
        star.x, star.y,
        star.x - Math.cos(star.angle) * star.length,
        star.y - Math.sin(star.angle) * star.length
      );
      
      gradient.addColorStop(0, `rgba(255, 255, 255, ${star.opacity})`);
      gradient.addColorStop(0.1, `rgba(200, 220, 255, ${star.opacity * 0.8})`);
      gradient.addColorStop(0.3, `rgba(150, 200, 255, ${star.opacity * 0.5})`);
      gradient.addColorStop(1, `rgba(100, 180, 255, 0)`);
      
      // Draw the tail
      this.ctx.beginPath();
      this.ctx.moveTo(star.x, star.y);
      this.ctx.lineTo(
        star.x - Math.cos(star.angle) * star.length,
        star.y - Math.sin(star.angle) * star.length
      );
      this.ctx.strokeStyle = gradient;
      this.ctx.lineWidth = star.thickness;
      this.ctx.lineCap = 'round';
      this.ctx.stroke();
      
      // Draw bright head
      const headGradient = this.ctx.createRadialGradient(
        star.x, star.y, 0,
        star.x, star.y, star.thickness * 3
      );
      headGradient.addColorStop(0, `rgba(255, 255, 255, ${star.opacity})`);
      headGradient.addColorStop(0.5, `rgba(220, 240, 255, ${star.opacity * 0.6})`);
      headGradient.addColorStop(1, `rgba(200, 220, 255, 0)`);
      
      this.ctx.beginPath();
      this.ctx.arc(star.x, star.y, star.thickness * 3, 0, Math.PI * 2);
      this.ctx.fillStyle = headGradient;
      this.ctx.fill();
    });
  }
  
  updateStars() {
    this.stars.forEach(star => {
      // Gentle floating movement
      star.x += star.vx;
      star.y += star.vy;
      
      // Subtle mouse parallax based on depth
      const parallaxStrength = 0.02 / (star.depth + 1);
      const dx = (this.mouse.x - this.canvas.width / 2) * parallaxStrength;
      const dy = (this.mouse.y - this.canvas.height / 2) * parallaxStrength;
      
      star.x += dx * 0.01;
      star.y += dy * 0.01;
      
      // Wrap around edges for infinite starfield
      if (star.x < -10) star.x = this.canvas.width + 10;
      if (star.x > this.canvas.width + 10) star.x = -10;
      if (star.y < -10) star.y = this.canvas.height + 10;
      if (star.y > this.canvas.height + 10) star.y = -10;
    });
  }
  
  updateShootingStars() {
    // Update existing shooting stars
    for (let i = this.shootingStars.length - 1; i >= 0; i--) {
      const star = this.shootingStars[i];
      
      star.x += star.vx;
      star.y += star.vy;
      star.opacity -= star.fadeRate;
      
      // Remove if faded or off screen
      if (star.opacity <= 0 || 
          star.x < -100 || star.x > this.canvas.width + 100 ||
          star.y < -100 || star.y > this.canvas.height + 100) {
        this.shootingStars.splice(i, 1);
      }
    }
    
    // Create new shooting stars periodically
    const now = Date.now();
    const timeSinceLastStar = now - this.lastShootingStar;
    
    // Random chance based on frequency
    if (timeSinceLastStar > this.shootingStarFrequency * (0.5 + Math.random())) {
      this.createShootingStar();
      this.lastShootingStar = now;
      
      // Sometimes create a burst of shooting stars (rare, extra wow factor)
      if (Math.random() < 0.15) { // 15% chance of burst
        setTimeout(() => this.createShootingStar(), 100);
        setTimeout(() => this.createShootingStar(), 250);
      }
    }
  }
  
  animate() {
    const time = Date.now() * 0.001; // Convert to seconds
    
    // Clear canvas
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    // Update and draw everything
    this.updateStars();
    this.updateShootingStars();
    
    this.drawStars(time);
    this.drawShootingStars();
    
    requestAnimationFrame(() => this.animate());
  }
}

// Auto-initialize
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    new ParticleSystem('particle-canvas');
  });
} else {
  new ParticleSystem('particle-canvas');
}
