# Next Steps Instructions for New Claude Tab

## 1. RENAME CLOUD SVG (Optional - cosmetic only)
```bash
mv assets/clouds/cloud-web3.svg assets/clouds/cloud-frontier.svg
```
Then update index.html line 55:
```html
<img src="assets/clouds/cloud-frontier.svg" ...>
```

## 2. ADD JSON-LD STRUCTURED DATA
Add before `</head>` in index.html:
```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Event",
  "name": "Quredge: Quantum Science Residency",
  "description": "Month-long quantum residency exploring AI, neurotech, biotech, and frontier technology at Edge Esmeralda 2026",
  "startDate": "2026-05-30",
  "endDate": "2026-06-27",
  "eventAttendanceMode": "https://schema.org/OfflineEventAttendanceMode",
  "eventStatus": "https://schema.org/EventScheduled",
  "location": {
    "@type": "Place",
    "name": "Edge Esmeralda",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Healdsburg",
      "addressRegion": "CA",
      "addressCountry": "US"
    }
  },
  "organizer": {
    "@type": "Organization",
    "name": "Quredge",
    "url": "https://quantum-residency-edge-city-production.up.railway.app/"
  },
  "offers": {
    "@type": "Offer",
    "url": "https://www.edgeesmeralda.com/",
    "availability": "https://schema.org/PreOrder"
  }
}
</script>
```

## 3. ADD CANONICAL URL
Add in `<head>`:
```html
<link rel="canonical" href="https://quantum-residency-edge-city-production.up.railway.app/">
```

## 4. UPDATE CONTENT MARKDOWN FILES
Files to update in `/content/`:
- `business-track.md` → rename to frontier tech, update content
- `transdisciplinary-track.md` → update to Edge Residencies focus
- `cards.md` → update card text
- `hero.md` → update hero text

## 5. ADD RESIDENCY LINKS (HIGH-SIGNAL)

### Official Edge Links:
- Edge Esmeralda 2026: https://www.edgeesmeralda.com/
- Edge City Network: https://www.edgecity.live/
- Edge City Patagonia (past event): https://www.edgecity.live/patagonia

### Technical/Scientific Resources to Consider:
- Quantum + AI: https://arxiv.org/list/quant-ph/recent (arXiv quantum physics)
- Neurotech: Link to Edge's Neurotech Summit page when available
- d/acc: https://vitalik.eth.limo/general/2023/11/27/techno_optimism.html (Vitalik's d/acc essay)

### Note on Residency Links:
Most Edge residencies don't have standalone URLs - they're announced via:
- Edge City Twitter: https://x.com/JoinEdgeCity
- Edge newsletters
- Individual organizer pages

For the FAQ answer "How does Quredge connect to other Edge residencies?", consider adding:
```html
<p>... <a href="https://www.edgeesmeralda.com/" target="_blank">See all Edge Esmeralda tracks</a></p>
```

## 6. UPDATE FORM FIELDS (Optional)
In index.html, update the participation dropdown:
```html
<select id="participation" name="participation" required>
  <option value="">Select one...</option>
  <option value="attendant">Attendee</option>
  <option value="researcher">Researcher</option>
  <option value="builder">Builder (AI/Neurotech/Biotech/etc)</option>
  <option value="sponsor">Sponsor</option>
  <option value="other">Other</option>
</select>
```

Consider adding a field:
```html
<div class="form-group">
  <label for="domain">Primary domain of interest</label>
  <select id="domain" name="domain">
    <option value="">Select one...</option>
    <option value="quantum-ai">Quantum + AI</option>
    <option value="quantum-neurotech">Quantum + Neurotech</option>
    <option value="quantum-bio">Quantum + Bio/Longevity</option>
    <option value="quantum-consciousness">Quantum + Consciousness</option>
    <option value="quantum-hardtech">Quantum + Hard Tech</option>
    <option value="quantum-crypto">Quantum + Cryptography</option>
    <option value="other">Other</option>
  </select>
</div>
```
