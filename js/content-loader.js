// Content Loader - Fetch and parse markdown files

export class ContentLoader {
  constructor() {
    this.init();
  }
  
  async init() {
    try {
      await Promise.all([
        this.loadHero(),
        this.loadCards(),
        this.loadModalContent()
      ]);
    } catch (error) {
      console.warn('Content loading failed, using fallback content', error);
    }
  }
  
  async loadHero() {
    try {
      const response = await fetch('content/hero.md');
      if (!response.ok) return;
      
      const text = await response.text();
      const lines = text.split('\n').filter(line => line.trim());
      
      const titleEl = document.querySelector('.hero-title');
      const subtitleEl = document.querySelector('.subtitle');
      
      if (titleEl && lines[0]) {
        titleEl.textContent = lines[0].replace(/^#\s*/, '');
      }
      
      if (subtitleEl && lines.length > 1) {
        const subtitle = lines.slice(1).join(' ').trim();
        subtitleEl.innerHTML = subtitle.replace(/\n/g, '<br>');
      }
    } catch (error) {
      console.log('Using default hero content');
    }
  }
  
  async loadCards() {
    try {
      const response = await fetch('content/cards.md');
      if (!response.ok) return;
      
      const text = await response.text();
      const sections = text.split('---').map(s => s.trim()).filter(s => s);
      
      const cards = document.querySelectorAll('.card');
      
      sections.forEach((section, index) => {
        if (!cards[index]) return;
        
        const lines = section.split('\n').filter(line => line.trim());
        if (lines.length < 2) return;
        
        const headerLine = lines[0].replace(/^#\s*/, '');
        const [badge, heading] = headerLine.split('|').map(s => s.trim());
        const content = lines.slice(1).join(' ').trim();
        
        // Updated selectors for new structure with card-preview
        const badgeEl = cards[index].querySelector('.card-badge');
        const headingEl = cards[index].querySelector('.card-heading');
        const contentEl = cards[index].querySelector('.card-text');
        
        if (badgeEl && badge) badgeEl.textContent = badge;
        if (headingEl && heading) headingEl.textContent = heading;
        if (contentEl && content) contentEl.innerHTML = this.parseMarkdown(content);
      });
    } catch (error) {
      console.log('Using default card content');
    }
  }
  
  async loadModalContent() {
    try {
      const [research, business, transdisciplinary] = await Promise.all([
        fetch('content/research-track.md').then(r => r.ok ? r.text() : ''),
        fetch('content/business-track.md').then(r => r.ok ? r.text() : ''),
        fetch('content/transdisciplinary-track.md').then(r => r.ok ? r.text() : '')
      ]);
      
      this.populateModalSection('research', research);
      this.populateModalSection('business', business);
      this.populateModalSection('transdisciplinary', transdisciplinary);
    } catch (error) {
      console.log('Using default modal content');
    }
  }
  
  populateModalSection(sectionClass, markdown) {
    if (!markdown) return;
    
    const section = document.querySelector(`.modal-section.${sectionClass}`);
    if (!section) return;
    
    const html = this.parseMarkdown(markdown);
    const contentDiv = section.querySelector('.modal-section-content');
    if (contentDiv) {
      contentDiv.innerHTML = html;
    }
  }
  
  parseMarkdown(text) {
    // Simple markdown parser - handles most common cases
    let html = text
      // Headers
      .replace(/^### (.*$)/gim, '<h4>$1</h4>')
      .replace(/^## (.*$)/gim, '<h4>$1</h4>')
      .replace(/^# (.*$)/gim, '<h3>$1</h3>')
      // Bold
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      // Italic
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      // Lists
      .replace(/^\- (.*$)/gim, '<li>$1</li>')
      // Paragraphs
      .split('\n\n')
      .map(para => {
        para = para.trim();
        if (!para) return '';
        if (para.startsWith('<h') || para.startsWith('<li')) return para;
        if (para.includes('<li>')) return '<ul>' + para + '</ul>';
        return '<p>' + para.replace(/\n/g, ' ') + '</p>';
      })
      .join('\n');
    
    return html;
  }
}

// Auto-initialize
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    new ContentLoader();
  });
} else {
  new ContentLoader();
}

