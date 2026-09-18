# India's Autonomous Vision

Build a professional, investor-ready MVP website for "SafeAutonomy India" — an autonomous vehicle simulation and ADAS startup focused on Indian roads.

## PROJECT OVERVIEW
Company Name: SafeAutonomy India
Tagline: "Adaptive Path Planning for Self-Driving Vehicles on Unstructured Indian Roads"
Industry: Autonomous Vehicles / ADAS / Simulation Software
Target Audience: Investors, OEMs (Tata, Mahindra, Ashok Leyland), Tier-1 suppliers, universities, government bodies (AICTE, MoRTH)
Funding Stage: Pre-seed / Seed ($2M raise)
Based On: SIH 2026 Problem Statement SIH26037 (MathWorks)

## DESIGN REQUIREMENTS

### Visual Style:
- Theme: Dark, premium, tech-focused (like Tesla AI Day, Waymo, or enterprise SaaS)
- Color Palette:
  - Primary Background: Dark charcoal (#0f1419 to #1a2332 gradient)
  - Accent Color 1: Cyan (#00d9ff) for CTAs, highlights, key metrics
  - Accent Color 2: Orange (#ff5722) for warnings, problem statements
  - Accent Color 3: Green (#00ff88) for success metrics, traction
  - Text: White (#ffffff) for headings, light gray (#b0b0b0) for body
- Typography:
  - Headings: Inter Bold or SF Pro Display (modern, clean, tech)
  - Body: Inter Regular or Roboto (readable, professional)
  - Font Sizes: H1 (48-60pt), H2 (36-40pt), H3 (24-28pt), Body (16-18pt)
- Layout: Minimalist, lots of white space (negative space), section-based scrolling
- Animations: Subtle fade-in on scroll, smooth transitions, hover effects on buttons (no flashy animations)
- Responsive: Mobile-first, must look perfect on desktop, tablet, and mobile

### Technical Stack (Lovable defaults):
- Frontend: React + Tailwind CSS (or Lovable's default stack)
- Backend: Supabase (if needed for forms, analytics)
- Hosting: Lovable hosting (one-click deploy)
- Domain: Connect custom domain later (safeautonomy.in or safeautonomy.tech)

## WEBSITE STRUCTURE (7 Pages/Sections)

---

### **1. HERO SECTION (Above the Fold)**

**Layout:**
- Full-screen hero (100vh), dark gradient background with subtle hexagonal grid pattern (3% opacity)
- Centered content, vertically and horizontally aligned
- Background: Very faint neural network overlay (10% opacity) or subtle particle animation

**Content:**
- Logo (top-left): "SafeAutonomy India" text logo (white, bold, 24pt) with small cyan accent dot
- Navigation (top-right): Home, Problem, Solution, Market, Team, Contact (white text, 16pt, hover: cyan underline)
- Main Headline (H1, centered, white, 56pt, bold): "Building Autonomous Vehicles for Indian Roads"
- Subheadline (H2, centered, light gray, 24pt, below headline): "Adaptive path planning and collision avoidance for unstructured, mixed-traffic environments"
- CTA Button 1 (centered, below subheadline, cyan background #00d9ff, white text, 18pt, padding 16px 32px, rounded corners 8px): "View Demo"
- CTA Button 2 (centered, below Button 1, transparent with white border, white text, 18pt, padding 16px 32px, rounded corners 8px): "Contact Founders"
- Trust Badges (bottom of hero, centered, small logos in grayscale, 40px height each): "SIH 2026 Finalist", "MathWorks Partner", "IIT [Your College]", "IEEE"

**Interactive Elements:**
- Smooth scroll to next section on "View Demo" click
- Mailto link on "Contact Founders" (mailto:founders@safeautonomy.in)
- Hover effect on buttons: scale 1.05, shadow increase

---

### **2. THE PROBLEM SECTION**

**Layout:**
- Full-width section, dark background (#1a2332)
- Left-aligned content (60% width), right side empty or subtle Indian road photo (10% opacity overlay)
- Section padding: 80px top/bottom, 60px left/right

**Content:**
- Section Tag (small, cyan, uppercase, 14pt, letter-spacing 2px): "THE PROBLEM"
- Headline (H2, white, 44pt, bold, margin-top 16px): "Why Indian Roads Break Autonomous Driving"
- Body Text (light gray, 18pt, line-height 1.6, max-width 600px):
  "Most autonomous driving systems are built for structured roads — clear lane markings, standard signage, predictable traffic flow. Indian roads are fundamentally different."
  
- Problem Cards (3 cards in vertical stack, each with icon + title + description):
  
  **Card 1:**
  - Icon: Mixed traffic icon (cars + bikes + pedestrians, cyan outline, 40px)
  - Title (white, 22pt, bold): "Mixed Traffic Chaos"
  - Description (light gray, 16pt): "Cars, buses, trucks, auto-rickshaws, two-wheelers, bicycles, pedestrians, pushcarts, and animals all share the same road space without lane discipline."
  
  **Card 2:**
  - Icon: Road with potholes icon (orange outline, 40px)
  - Title (white, 22pt, bold): "Unstructured Infrastructure"
  - Description (light gray, 16pt): "Missing lane markings, unclear road edges, potholes, informal merging, wrong-side driving, unmarked crossings."
  
  **Card 3:**
  - Icon: Warning triangle icon (red outline, 40px)
  - Title (white, 22pt, bold): "Unpredictable Behavior"
  - Description (light gray, 16pt): "Sudden pedestrian movement, cattle on road, vehicles merging without signaling, crossing at unmarked locations."

- Stat Callout (below cards, centered, large orange numbers):
  - "1.4M+" (orange #ff5722, 64pt, bold)
  - "Road fatalities per year in India" (light gray, 16pt, below number)

---

### **3. THE SOLUTION SECTION**

**Layout:**
- Full-width section, dark gradient background (#0f1419 to #1a2332)
- Centered content, alternating layout (text left, visual right)
- Section padding: 80px top/bottom, 60px left/right

**Content:**
- Section Tag (small, cyan, uppercase, 14pt, letter-spacing 2px): "OUR SOLUTION"
- Headline (H2, white, 44pt, bold, margin-top 16px): "SafeAutonomy India — Adaptive Path Planning Built for India"
- Body Text (light gray, 18pt, line-height 1.6, max-width 700px):
  "We've built a simulation-based adaptive path planning system that perceives diverse road users, predicts their behavior, and replans safe, collision-free paths in real-time — specifically for Indian road conditions."

- Solution Features (4 features in 2x2 grid, each with icon + title + description + metric):
  
  **Feature 1:**
  - Icon: Multi-sensor icon (camera + LiDAR + radar, cyan, 40px)
  - Title (white, 20pt, bold): "Multi-Sensor Perception"
  - Description (light gray, 16pt): "Camera, LiDAR, and radar fusion to detect all road users — vehicles, two-wheelers, autos, pedestrians, animals."
  - Metric (cyan, 18pt, bold): "95%+ Detection Accuracy"
  
  **Feature 2:**
  - Icon: AI brain icon (cyan, 40px)
  - Title (white, 20pt, bold): "Trajectory Prediction"
  - Description (light gray, 16pt): "AI models predict short-term motion of surrounding agents, including non-lane-based and irregular movement patterns."
  - Metric (cyan, 18pt, bold): "<100ms Prediction Latency"
  
  **Feature 3:**
  - Icon: Path planning icon (cyan curved line with nodes, 40px)
  - Title (white, 20pt, bold): "Adaptive Path Planner"
  - Description (light gray, 16pt): "Generates safe, collision-free paths that replan in real-time as conditions change — handles missing lanes, potholes, sudden obstacles."
  - Metric (cyan, 18pt, bold): "95%+ Scenario Completion"
  
  **Feature 4:**
  - Icon: Map with 5 pins icon (cyan, 40px)
  - Title (white, 20pt, bold): "5 Indian Scenarios Validated"
  - Description (light gray, 16pt): "Tested on unmarked village roads, busy urban intersections, highway merges, dense market areas, and cattle-crossing events."
  - Metric (cyan, 18pt, bold): "5 Real Scenarios"

- Tech Stack Logos (below features, centered, grayscale logos, 50px height each): "MATLAB", "Simulink", "RoadRunner", "Automated Driving Toolbox", "Deep Learning Toolbox"

---

### **4. MARKET OPPORTUNITY SECTION**

**Layout:**
- Full-width section, dark background (#1a2332)
- Left-aligned content, right side has large metric callouts
- Section padding: 80px top/bottom, 60px left/right

**Content:**
- Section Tag (small, orange, uppercase, 14pt, letter-spacing 2px): "MARKET SIZE"
- Headline (H2, white, 44pt, bold, margin-top 16px): "A $50B+ Untapped Market"
- Body Text (light gray, 18pt, line-height 1.6, max-width 600px):
  "India has the world's largest road fatality rate and zero autonomous driving solutions built for its unique conditions. We're capturing this white space."

- Market Metrics (4 large metrics in horizontal row, right side):
  
  **Metric 1:**
  - Number: "$50B+" (orange #ff5722, 56pt, bold)
  - Label: "Total Addressable Market" (light gray, 16pt)
  
  **Metric 2:**
  - Number: "1.4M" (orange #ff5722, 56pt, bold)
  - Label: "Annual Road Fatalities (India)" (light gray, 16pt)
  
  **Metric 3:**
  - Number: "400M" (orange #ff5722, 56pt, bold)
  - Label: "Vehicles by 2030" (light gray, 16pt)
  
  **Metric 4:**
  - Number: "18%" (orange #ff5722, 56pt, bold)
  - Label: "AV Market CAGR (Global)" (light gray, 16pt)

- Market Segments (below metrics, 3 segments in vertical list with icons):
  
  **Segment 1:**
  - Icon: Truck icon (cyan, 32px)
  - Title (white, 20pt, bold): "Commercial Fleets (Initial TAM: $8B)"
  - Description (light gray, 16pt): "ADAS for trucks, buses, taxis — immediate revenue with fleet operators and OEMs."
  
  **Segment 2:**
  - Icon: Campus shuttle icon (cyan, 32px)
  - Title (white, 20pt, bold): "Autonomous Shuttles ($2B+)"
  - Description (light gray, 16pt): "IT parks, airports, BRT corridors — closed-campus autonomy deployment."
  
  **Segment 3:**
  - Icon: Globe icon (cyan, 32px)
  - Title (white, 20pt, bold): "Export to Emerging Markets"
  - Description (light gray, 16pt): "SE Asia, Africa, Latin America — similar unstructured road challenges."

---

### **5. BUSINESS MODEL SECTION**

**Layout:**
- Full-width section, dark gradient background
- Centered content with 3-column pricing/revenue cards
- Section padding: 80px top/bottom, 60px left/right

**Content:**
- Section Tag (small, green, uppercase, 14pt, letter-spacing 2px): "REVENUE MODEL"
- Headline (H2, white, 44pt, bold, margin-top 16px): "B2B SaaS + Licensing — High Margin, Scalable"
- Body Text (light gray, 18pt, line-height 1.6, max-width 700px, centered):
  "Three revenue streams with 85%+ gross margins. Software-first, low COGS, recurring revenue."

- Revenue Cards (3 cards in horizontal row, equal width, dark background #0f1419, cyan border on hover):
  
  **Card 1: Simulation Licensing**
  - Title (white, 22pt, bold): "Simulation Platform"
  - Price (cyan, 32pt, bold): "$50K-500K/year"
  - Description (light gray, 16pt): "Annual licensing to OEMs, Tier-1 suppliers, universities for scenario design and validation."
  - Features (bullet list, light gray, 14pt):
    ✓ RoadRunner scenario library
    ✓ MATLAB/Simulink integration
    ✓ 50+ Indian road scenarios
    ✓ Technical support & training
  
  **Card 2: ADAS SaaS**
  - Title (white, 22pt, bold): "ADAS Software Stack"
  - Price (cyan, 32pt, bold): "$200/vehicle/year"
  - Description (light gray, 16pt): "Recurring SaaS for commercial fleets — perception, prediction, path planning deployed on edge hardware."
  - Features (bullet list, light gray, 14pt):
    ✓ Real-time perception & planning
    ✓ OTA updates
    ✓ Fleet analytics dashboard
    ✓ 24/7 support
  
  **Card 3: Custom Projects**
  - Title (white, 22pt, bold): "Validation Services"
  - Price (cyan, 32pt, bold): "$100K-2M/project"
  - Description (light gray, 16pt): "Custom scenario design and validation for government, AICTE, MathWorks, and OEM partners."
  - Features (bullet list, light gray, 14pt):
    ✓ Bespoke scenario creation
    ✓ Regulatory compliance testing
    ✓ Data annotation & labeling
    ✓ Research partnerships

- Go-to-Market Timeline (below cards, horizontal timeline with 3 phases):
  - Phase 1 (Year 1): "10+ university licenses, 2 pilot fleets" (cyan text)
  - Phase 2 (Year 2-3): "OEM partnerships, 5K+ vehicles on ADAS" (cyan text)
  - Phase 3 (Year 4+): "Full autonomy for closed campuses, export to SE Asia" (cyan text)

---

### **6. TEAM SECTION**

**Layout:**
- Full-width section, dark background (#1a2332)
- Centered content with team member cards in 2x2 grid
- Section padding: 80px top/bottom, 60px left/right

**Content:**
- Section Tag (small, cyan, uppercase, 14pt, letter-spacing 2px): "THE TEAM"
- Headline (H2, white, 44pt, bold, margin-top 16px): "Built by Engineers Who've Solved This Before"
- Body Text (light gray, 18pt, line-height 1.6, max-width 600px, centered):
  "Our team combines deep expertise in autonomous driving, ML, and Indian road systems — backed by advisors from Tesla, Waymo, and MathWorks."

- Team Members (4 cards in 2x2 grid, each with photo placeholder + info):
  
  **Member 1 (CEO):**
  - Photo: Circular placeholder (120px diameter, gray background, cyan border)
  - Name (white, 20pt, bold): "[Your Name]"
  - Role (cyan, 16pt): "CEO & Co-founder"
  - Bio (light gray, 14pt): "Ex-[Company], IIT [College] — 5+ years in autonomous systems"
  - LinkedIn Icon (cyan, 24px, clickable link)
  
  **Member 2 (CTO):**
  - Photo: Circular placeholder (120px diameter, gray background, cyan border)
  - Name (white, 20pt, bold): "[Co-founder Name]"
  - Role (cyan, 16pt): "CTO & Co-founder"
  - Bio (light gray, 14pt): "Ex-[Company], [University] — ML & path planning expert"
  - LinkedIn Icon (cyan, 24px, clickable link)
  
  **Member 3 (Head of Product):**
  - Photo: Circular placeholder (120px diameter, gray background, cyan border)
  - Name (white, 20pt, bold): "[Name]"
  - Role (cyan, 16pt): "Head of Product"
  - Bio (light gray, 14pt): "Ex-MathWorks, IIT — simulation & product strategy"
  - LinkedIn Icon (cyan, 24px, clickable link)
  
  **Member 4 (Head of Partnerships):**
  - Photo: Circular placeholder (120px diameter, gray background, cyan border)
  - Name (white, 20pt, bold): "[Name]"
  - Role (cyan, 16pt): "Head of Partnerships"
  - Bio (light gray, 14pt): "Ex-Tata Motors ADAS, ISB — OEM relationships"
  - LinkedIn Icon (cyan, 24px, clickable link)

- Advisors (below team, centered, horizontal list):
  - "Advisors:" (white, 18pt, bold)
  - Advisor names (light gray, 16pt, separated by bullets): "Prof. XYZ (IIT Delhi Autonomous Systems Lab) • ABC (Ex-MathWorks India MD) • DEF (Serial Mobility Entrepreneur)"

---

### **7. CONTACT / CTA SECTION**

**Layout:**
- Full-width section, dark gradient background with subtle Indian map outline (5% opacity)
- Centered content, large CTA focus
- Section padding: 100px top/bottom, 60px left/right

**Content:**
- Headline (H2, white, 48pt, bold, centered): "Ready to Transform Indian Road Safety?"
- Subheadline (light gray, 20pt, centered, max-width 600px):
  "We're raising $2M seed to scale our simulation platform and deploy ADAS in 10K+ commercial vehicles by 2028."
  
- CTA Buttons (centered, below subheadline):
  - Button 1 (cyan background #00d9ff, white text, 20pt, padding 20px 40px, rounded corners 8px, margin-right 16px): "Schedule a Demo"
  - Button 2 (white background, dark text, 20pt, padding 20px 40px, rounded corners 8px): "Download Pitch Deck"
  
- Contact Info (below buttons, centered, light gray, 16pt):
  - Email: "founders@safeautonomy.in" (cyan, clickable mailto link)
  - Phone: "+91-XXXXXXXXXX" (light gray)
  - Location: "Lucknow, Uttar Pradesh, India" (light gray)
  
- Social Links (below contact, centered, horizontal, cyan icons 32px each):
  - LinkedIn icon (clickable)
  - Twitter/X icon (clickable)
  - GitHub icon (clickable)
  - Email icon (clickable)

- Contact Form (below social links, centered, max-width 500px):
  - Input Field 1: Name (white text, dark background #0f1419, white border, 48px height, full width, placeholder "Your Name")
  - Input Field 2: Email (white text, dark background #0f1419, white border, 48px height, full width, placeholder "Your Email")
  - Input Field 3: Message (white text, dark background #0f1419, white border, 120px height, full width, placeholder "Your Message")
  - Submit Button (cyan background, white text, 18pt, padding 16px 32px, rounded corners 8px, full width): "Send Message"
  - Form Action: Submit to Supabase or email API (Lovable default)

- Footer (bottom of page, centered, light gray, 14pt):
  - "© 2026 SafeAutonomy India. All rights reserved."
  - Links: "Privacy Policy" • "Terms of Service" (light gray, clickable)

---

## INTERACTIVE FEATURES

1. **Smooth Scrolling:** Clicking nav links smoothly scrolls to corresponding section
2. **Fade-in Animations:** Sections fade in as user scrolls (use Intersection Observer)
3. **Hover Effects:** Buttons scale 1.05 on hover, cards get cyan border glow
4. **Mobile Menu:** Hamburger menu on mobile (nav collapses to dropdown)
5. **Contact Form:** Submits to email or Supabase, shows success/error message
6. **Demo Video Modal:** "View Demo" button opens YouTube/Vimeo modal with demo video
7. **Pitch Deck Download:** "Download Pitch Deck" button downloads PDF (hosted on Lovable)

---

## SEO & METADATA

- Page Title: "SafeAutonomy India | Adaptive Path Planning for Indian Roads"
- Meta Description: "Building simulation-based autonomous driving solutions for unstructured Indian roads. SIH 2026 finalist. Raising $2M seed."
- Open Graph Image: Hero section screenshot with logo
- Favicon: Cyan "S" logo on dark background
- Keywords: autonomous vehicles India, ADAS, path planning, simulation, SIH 2026, MathWorks, Indian roads, smart vehicles

---

## DELIVERABLES

1. Fully responsive website (desktop, tablet, mobile)
2. All 7 sections/pages implemented
3. Contact form functional (email or Supabase backend)
4. Smooth animations and hover effects
5. SEO-optimized metadata
6. One-click deploy to Lovable hosting
7. Instructions to connect custom domain

---

## NOTES FOR LOVABLE

- Use Lovable's AI to generate placeholder images for team photos (or leave as gray circles)
- Use Lovable's built-in form handling for contact form
- Keep code clean and modular for future iterations
- Ensure fast load times (<2s) — optimize images and animations
- Add Google Analytics tracking code (placeholder for now)

---

and please dont use dark theme whichlook any agent madeit

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://pathfinder-adapt.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/291724f0-680e-46e0-96af-b50a68c8dfb4).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
