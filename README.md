# Quredge Landing Page

A modular, visually stunning landing page for the Quredge Quantum Residency at Edge City with integrated interest form and secure admin dashboard.

## 🆕 New Features

### Interest Form System
- **"Stay tuned!" Button** - Replaced the sponsorship email link with an interest form
- **Smart Form** - Optimized question order for maximum completion rate
- **Database Backend** - All submissions stored in SQLite database
- **Secure Admin Dashboard** - Password-protected area to view and manage submissions
- **CSV Export** - Download all submissions for analysis
- **Real-time Stats** - Track attendees, sponsors, and support requests

### Security Features
- 🔐 **Authentication Required** - Admin area protected by username/password
- 🔒 **Encrypted Sessions** - Secure session management with bcrypt
- 🛡️ **Rate Limiting** - Prevents spam submissions (5 per 15 minutes)
- 🔑 **Environment Variables** - Secure credential management
- 🚫 **Private Database** - Only authenticated admins can access data

## 🚀 Quick Start

### Running Locally

```bash
# Install dependencies
npm install

# Set up your credentials (copy and edit)
cp .env.example .env

# Start the server
npm start
# or
./start.sh
```

Then visit:
- **Landing Page**: http://localhost:3000
- **Admin Login**: http://localhost:3000/login.html
- **Admin Dashboard**: http://localhost:3000/admin.html (requires login)

**Default credentials** (change these!):
- Username: `admin`
- Password: `quredge2026`

### Deploying Online

**Recommended**: Deploy to Railway.app in 5 minutes!

See detailed guides:
- 📘 **[Quick Start](QUICK_START_SECURE.md)** - Get running in 2 minutes
- 🚂 **[Deploy to Railway](DEPLOY_RAILWAY.md)** - Step-by-step deployment
- 🔐 **[Security Guide](SECURITY.md)** - Protect your data
- 📊 **[Form Details](README_FORM.md)** - Form implementation details

---

## 📋 Original Features

## 🎨 Design Philosophy

- **Minimalistic but engaging** - Almost addictive visual experience
- **Edge City aesthetic** - Illustrated clouds, dreamy atmosphere, soft gradients
- **Attracts both participants and investors/sponsors**
- **High performance** - Smooth 60fps animations, fast load times
- **Fully accessible** - WCAG AA compliant

## 📁 Project Structure

```
quredge-landing/
├── index.html                    # Main HTML (lean, imports only)
├── css/                          # Modular CSS files
│   ├── variables.css            # Design tokens & CSS custom properties
│   ├── base.css                 # Global styles, resets, typography
│   ├── hero.css                 # Hero section & cloud animation
│   ├── cards.css                # Three-card grid layout
│   ├── modal.css                # Residency value modal
│   ├── particles.css            # Particle background
│   └── cta.css                  # CTA button section
├── js/                           # JavaScript modules
│   ├── hero-clouds.js           # Cloud convergence animation
│   ├── particles.js             # Quantum particle background
│   ├── modal.js                 # Modal interactions
│   ├── smooth-scroll.js         # Smooth scrolling with Lenis
│   ├── micro-interactions.js    # Card hovers, magnetic buttons
│   └── content-loader.js        # Markdown content loader
├── content/                      # Editable markdown content
│   ├── hero.md                  # Hero title & subtitle
│   ├── cards.md                 # Three main cards content
│   ├── research-track.md        # Research track details
│   ├── business-track.md        # Business track details
│   └── transdisciplinary-track.md  # Transdisciplinary track
├── assets/
│   └── clouds/                  # Cloud SVG illustrations
│       ├── cloud-philosophy.svg
│       ├── cloud-web3.svg
│       └── cloud-transdisciplinary.svg
└── edge/                         # Original PDF resources
```

## ✏️ Editing Content

All content can be easily edited without touching code. Simply edit the markdown files in the `content/` folder:

### Hero Section
Edit `content/hero.md`:
```markdown
# Your Title Here

Your subtitle text here...
```

### Three Main Cards
Edit `content/cards.md`:
```markdown
# Badge Text | Card Heading

Card description text here with **bold** formatting.

---

# Next Card Badge | Next Heading

Next card description...
```

### Residency Value Modal
Edit the three track files:
- `content/research-track.md` - Research track details
- `content/business-track.md` - Business/investor track
- `content/transdisciplinary-track.md` - Transdisciplinary track

Use standard markdown syntax:
- `# Heading` for main headings
- `## Subheading` for subheadings
- `**bold text**` for emphasis
- `- List item` for bullet points

## 🎭 Visual Features

### Cloud Convergence Animation
Three illustrated clouds (Philosophy, web3, Transdisciplinary) gently pulse and drift in a synchronized pattern using Anime.js.

### Quantum Particle Background
Subtle particles drifting in the background with connection lines, representing quantum entanglement.

### Smooth Interactions
- **Lenis smooth scrolling** - Buttery smooth scroll experience
- **Card 3D tilt** - Cards respond to mouse movement with subtle 3D rotation
- **Magnetic buttons** - CTAs have magnetic effect that follows cursor
- **Ripple effects** - Click feedback on buttons
- **Modal animations** - Smooth fade-in with scale effect

## 🎨 Color Palette

```css
--primary: #1ecbe1;              /* Cyan/turquoise - main brand color */
--philosophy: #2eecb8;           /* Teal/green - Research & Philosophy */
--web3: #e366f7;                 /* Purple/magenta - web3 Ecosystem */
--transdisciplinary: #fec748;    /* Yellow/orange - Edge City Model */
--edge-dark: #181b21;            /* Dark blue-gray - background */
--white: #eef7fa;                /* Off-white - text */
```

## 🗂️ New File Structure

```
quredge-landing/
├── server.js                    # Express backend with API
├── auth.js                      # Authentication system
├── package.json                 # Dependencies
├── .env                         # Your credentials (never commit!)
├── .env.example                 # Template for credentials
├── index.html                   # Main landing page (updated with form)
├── login.html                   # Admin login page
├── admin.html                   # Admin dashboard
├── quredge-interest.db          # SQLite database (auto-created)
├── css/
│   ├── form.css                # Form styling (new)
│   └── ...                     # Existing CSS files
├── js/
│   ├── form-handler.js         # Form submission logic (new)
│   └── ...                     # Existing JS files
└── Documentation/
    ├── QUICK_START_SECURE.md   # Quick start guide
    ├── DEPLOY_RAILWAY.md       # Deployment guide
    ├── SECURITY.md             # Security guide
    ├── README_FORM.md          # Form implementation
    └── SETUP_GUIDE.md          # Comprehensive setup
```

## 🎯 Running as Static Site (Original Method)

**Note**: The interest form requires the Node.js backend. For the static version without the form:

1. **Simple HTTP Server** (Python):
   ```bash
   python3 -m http.server 8080
   ```
   Then open http://localhost:8080

2. **Or use any static file server**:
   ```bash
   npx serve
   ```

## 🔧 Tech Stack

### Frontend
- **Anime.js** (~8KB) - Smooth animations
- **Lenis** (~3KB) - Buttery smooth scrolling
- **Vanilla JS ES6 modules** - No heavy frameworks
- **Custom particle system** - Lightweight, no particle.js
- **Markdown** - Easy content editing

### Backend (New)
- **Node.js** - Runtime environment
- **Express.js** - Web server
- **SQLite** - Database (serverless, file-based)
- **bcryptjs** - Password hashing
- **express-session** - Session management
- **express-rate-limit** - API protection

## 📱 Responsive Design

- **Desktop** (1440px+): Three-column card grid, full cloud animation
- **Tablet** (768px-1439px): Two-column or single-column cards
- **Mobile** (< 768px): Single-column stacked layout, optimized cloud size

## ♿ Accessibility

- **Semantic HTML** - Proper heading hierarchy, landmarks
- **ARIA labels** - Screen reader friendly
- **Keyboard navigation** - Tab through all interactive elements
- **Focus indicators** - Visible focus states
- **Modal focus trap** - Keeps focus within modal
- **ESC key support** - Close modal with Escape

## 🎯 Key Decisions

1. **Illustrated clouds** instead of abstract spheres - Matches Edge City aesthetic
2. **Anime.js over GSAP** - Lighter weight, perfect for SVG animations
3. **Custom particles** - Avoided heavy particle.js library
4. **Content in Markdown** - Non-technical editing
5. **Modular architecture** - Easy maintenance and updates

## 📊 Performance

- **Load time**: < 2 seconds
- **Animations**: Smooth 60fps using GPU-accelerated CSS transforms
- **Total JS**: ~30KB (including Anime.js + Lenis)
- **Images**: Optimized SVGs for clouds

## 🎨 Customization

### Change Colors
Edit `css/variables.css`:
```css
:root {
  --primary: #your-color;
  --philosophy: #your-color;
  /* etc... */
}
```

### Adjust Animation Speed
Edit `js/hero-clouds.js`:
```javascript
duration: 4000,  // Change this value (milliseconds)
```

### Modify Particle Count
Edit `js/particles.js`:
```javascript
this.particleCount = 50;  // Change this number
```

## 📝 Content Guidelines

### Research Track
- Focus on bridging universities, conferences, and summer schools
- Emphasize high scientific standards
- Avoid mentioning specific national labs

### Business Track
- Appeal to investors with "really knowing builders"
- Emphasize the one-month deep engagement
- Include examples from Edge City and major quantum companies

### Transdisciplinary Track
- Highlight the discovery bottleneck
- Emphasize quantum-web3 synergy beyond post-quantum crypto
- Include mental health and metaphor aspects
- Frame as a social experiment

## 🐛 Troubleshooting

### Clouds not animating?
- Check browser console for Anime.js loading errors
- Ensure `anime.min.js` CDN is accessible

### Modal not opening?
- Check browser console for JavaScript errors
- Verify modal.js is loaded as a module

### Content not loading?
- Ensure markdown files are in `content/` folder
- Check browser network tab for 404 errors
- Note: Content loader works best with a server (not file://)

## 📄 License

All rights reserved - Edge City / Quredge 2026

# quantum-residency-edge-city
