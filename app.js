/**
 * MASHMANOS - Client-side Portal Logic
 * Features:
 * - Fullscreen loader with spinning gold coin and progress bar
 * - Interactive button mouse-glare sweep tracking
 * - Floating gold coins & sparkles hero canvas animation
 * - Smooth 3D parallax on mouse move in hero section
 * - Single-Page App (SPA) clean routing
 * - Live slot voting with instant feedback, confetti, and double-vote protection
 * - Dynamic sponsor leaderboards with ticking countdown
 * - Searchable and filterable bonus hunt archives
 * - Password-protected Admin panel with full control
 */

(function () {
  'use strict';

  // --- STATE ---
  let state = {
    stream_status: {},
    voting_status: {},
    slots: [],
    featured_offers: {},
    crypto_casinos: [],
    traditional_casinos: [],
    leaderboards: {},
    bonus_hunts: [],
    activeTab: 'home',
    activeLbSponsor: 'shuffle',
    huntFilter: 'all',
    huntSearch: '',
    isAdminLoggedIn: false,
    adminToken: localStorage.getItem('mash_admin_token') || ''
  };

  // Voter identity token
  let voterId = localStorage.getItem('mash_voter_id');
  if (!voterId) {
    voterId = 'voter_' + Math.random().toString(36).substring(2, 12);
    localStorage.setItem('mash_voter_id', voterId);
  }

  // --- DOM READY ---
  document.addEventListener('DOMContentLoaded', () => {
    initLoader();
    initGlareButtons();
    initHeroEffects();
    initFireworks();
    initRouting();
    initMobileNav();
    initAdminModal();
    fetchState(true);

    // Live state polling every 4 seconds
    setInterval(() => {
      fetchState(false);
    }, 4000);
  });

  // ==========================================================
  // 1. FULLSCREEN LOADING SCREEN
  // ==========================================================
  function initLoader() {
    const loader = document.getElementById('loader-screen');
    const bar = document.getElementById('loader-progress-bar');
    if (!loader || !bar) return;

    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.floor(Math.random() * 25) + 15;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        bar.style.width = '100%';
        setTimeout(() => {
          loader.classList.add('hidden');
        }, 400);
      } else {
        bar.style.width = progress + '%';
      }
    }, 120);
  }

  // ==========================================================
  // 2. MOUSE GLARE SWEEP ON BUTTONS
  // ==========================================================
  function initGlareButtons() {
    function updateGlare(clientX, clientY, target) {
      const btn = target.closest('.btn-shine');
      if (!btn) return;
      const rect = btn.getBoundingClientRect();
      const x = ((clientX - rect.left) / rect.width) * 100;
      const y = ((clientY - rect.top) / rect.height) * 100;
      btn.style.setProperty('--mx', `${x.toFixed(1)}%`);
      btn.style.setProperty('--my', `${y.toFixed(1)}%`);
    }

    document.addEventListener('mousemove', (e) => {
      updateGlare(e.clientX, e.clientY, e.target);
    });

    document.addEventListener('touchstart', (e) => {
      if (e.touches && e.touches[0]) {
        updateGlare(e.touches[0].clientX, e.touches[0].clientY, e.target);
      }
    }, { passive: true });

    document.addEventListener('touchmove', (e) => {
      if (e.touches && e.touches[0]) {
        updateGlare(e.touches[0].clientX, e.touches[0].clientY, e.target);
      }
    }, { passive: true });
  }

  // ==========================================================
  // 3. HERO CANVAS: FLOATING COINS & SPARKLES + 3D PARALLAX
  // ==========================================================
  function initHeroEffects() {
    // Parallax on Mouse Move & Touch
    const hero = document.querySelector('.hero-wrapper');
    const markContainer = document.querySelector('.hero-mark-container');
    const spotlight = document.querySelector('.hero-spotlight');

    if (hero) {
      function applyTilt(clientX, clientY) {
        const rect = hero.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const deltaX = (clientX - centerX) / (rect.width / 2);
        const deltaY = (clientY - centerY) / (rect.height / 2);

        const tiltX = -(deltaY * 8).toFixed(2);
        const tiltY = (deltaX * 12).toFixed(2);
        const parallaxX = (deltaX * 15).toFixed(2);
        const parallaxY = (deltaY * 15).toFixed(2);

        if (markContainer) {
          markContainer.style.setProperty('--tilt-x', `${tiltX}deg`);
          markContainer.style.setProperty('--tilt-y', `${tiltY}deg`);
          markContainer.style.setProperty('--parallax-x', `${parallaxX}px`);
          markContainer.style.setProperty('--parallax-y', `${parallaxY}px`);
        }
        if (spotlight) {
          spotlight.style.setProperty('--parallax-x', `${-parallaxX * 0.8}px`);
          spotlight.style.setProperty('--parallax-y', `${-parallaxY * 0.8}px`);
        }
      }

      hero.addEventListener('mousemove', (e) => {
        applyTilt(e.clientX, e.clientY);
      });

      hero.addEventListener('touchmove', (e) => {
        if (e.touches && e.touches[0]) {
          applyTilt(e.touches[0].clientX, e.touches[0].clientY);
        }
      }, { passive: true });

      function resetTilt() {
        if (markContainer) {
          markContainer.style.setProperty('--tilt-x', '0deg');
          markContainer.style.setProperty('--tilt-y', '0deg');
          markContainer.style.setProperty('--parallax-x', '0px');
          markContainer.style.setProperty('--parallax-y', '0px');
        }
        if (spotlight) {
          spotlight.style.setProperty('--parallax-x', '0px');
          spotlight.style.setProperty('--parallax-y', '0px');
        }
      }

      hero.addEventListener('mouseleave', resetTilt);
      hero.addEventListener('touchend', resetTilt);

      // Scroll-driven Hero Float Up & Disappear / Reappear (Adaptive for mobile)
      let ticking = false;
      function handleHeroScroll() {
        if (!ticking) {
          window.requestAnimationFrame(() => {
            const scrollY = window.scrollY || document.documentElement.scrollTop || 0;
            const isMobile = window.innerWidth <= 768;
            const maxDist = isMobile ? 260 : 360;
            const progress = Math.min(1, Math.max(0, scrollY / maxDist));
            
            const translateY = -progress * (isMobile ? 120 : 160);
            const opacity = Math.max(0, 1 - progress * 1.25);
            const scale = 1 - progress * (isMobile ? 0.08 : 0.12);

            if (markContainer) {
              markContainer.style.setProperty('--scroll-y', `${translateY.toFixed(1)}px`);
              markContainer.style.setProperty('--scroll-opacity', `${opacity.toFixed(3)}`);
              markContainer.style.setProperty('--scroll-scale', `${scale.toFixed(3)}`);
              markContainer.style.pointerEvents = opacity <= 0.05 ? 'none' : 'auto';
            }

            if (spotlight) {
              spotlight.style.opacity = `${opacity.toFixed(3)}`;
              spotlight.style.setProperty('--scroll-y', `${(translateY * 0.6).toFixed(1)}px`);
            }

            ticking = false;
          });
          ticking = true;
        }
      }

      window.addEventListener('scroll', handleHeroScroll, { passive: true });
      handleHeroScroll();
    }

    // Canvas Floating Coins & Sparkles
    const canvas = document.getElementById('hero-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let width, height;

    function resize() {
      if (!canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
    }
    window.addEventListener('resize', resize);
    resize();

    // Particle pool
    const particles = [];
    const count = 30;

    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * (width || 800),
        y: Math.random() * (height || 500),
        size: Math.random() * 12 + 6,
        speedY: -(Math.random() * 0.6 + 0.2),
        speedX: (Math.random() - 0.5) * 0.4,
        angle: Math.random() * Math.PI * 2,
        angularSpeed: (Math.random() - 0.5) * 0.03,
        type: Math.random() > 0.4 ? 'coin' : 'star',
        opacity: Math.random() * 0.6 + 0.3
      });
    }

    function renderCanvas() {
      ctx.clearRect(0, 0, width, height);

      particles.forEach((p) => {
        p.y += p.speedY;
        p.x += p.speedX;
        p.angle += p.angularSpeed;

        if (p.y < -20) {
          p.y = height + 20;
          p.x = Math.random() * width;
        }

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.angle);
        ctx.globalAlpha = p.opacity;

        if (p.type === 'coin') {
          // Gold Coin
          ctx.beginPath();
          ctx.arc(0, 0, p.size, 0, Math.PI * 2);
          const grad = ctx.createLinearGradient(-p.size, -p.size, p.size, p.size);
          grad.addColorStop(0, '#FFE08A');
          grad.addColorStop(0.5, '#F5C542');
          grad.addColorStop(1, '#9E6D08');
          ctx.fillStyle = grad;
          ctx.fill();
          ctx.strokeStyle = '#FFE08A';
          ctx.lineWidth = 1.2;
          ctx.stroke();

          // Coin 'M' symbol
          ctx.fillStyle = '#684501';
          ctx.font = `bold ${Math.floor(p.size * 1.1)}px sans-serif`;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText('M', 0, 1);
        } else {
          // Four-pointed Sparkle Star
          ctx.fillStyle = '#FFE08A';
          ctx.shadowColor = '#F5C542';
          ctx.shadowBlur = 8;
          ctx.beginPath();
          const s = p.size * 0.8;
          ctx.moveTo(0, -s);
          ctx.quadraticCurveTo(0, 0, s, 0);
          ctx.quadraticCurveTo(0, 0, 0, s);
          ctx.quadraticCurveTo(0, 0, -s, 0);
          ctx.quadraticCurveTo(0, 0, 0, -s);
          ctx.fill();
        }

        ctx.restore();
      });

      requestAnimationFrame(renderCanvas);
    }
    requestAnimationFrame(renderCanvas);
  }

  // ==========================================================
  // 3.5. FIRECRACKERS & CELEBRATION PARTICLES (Site-Wide Background)
  // ==========================================================
  function initFireworks() {
    const canvas = document.getElementById('fireworks-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let width = 0;
    let height = 0;

    function resize() {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resize);
    resize();

    const PALETTES = [
      ['#FFE08A', '#F5C542', '#D4AF37', '#FFFFFF'], // Gold Sparkle
      ['#C084FC', '#9D5CFF', '#6B2FD6', '#E9D5FF'], // Royal Purple
      ['#FFE08A', '#9D5CFF', '#FFFFFF', '#F5C542']  // Casino Royale Mix
    ];

    const rockets = [];
    const particles = [];

    class Rocket {
      constructor(startX, targetX, targetY, palette) {
        this.x = startX !== undefined ? startX : (Math.random() * (width * 0.8) + width * 0.1);
        this.y = height + 10;
        this.targetX = targetX !== undefined ? targetX : (this.x + (Math.random() - 0.5) * 120);
        this.targetY = targetY !== undefined ? targetY : (Math.random() * (height * 0.45) + height * 0.12);
        const distance = Math.hypot(this.targetX - this.x, this.targetY - this.y) || 1;
        const speed = Math.random() * 3 + 8.5;
        this.vx = ((this.targetX - this.x) / distance) * speed;
        this.vy = ((this.targetY - this.y) / distance) * speed;
        this.palette = palette || PALETTES[Math.floor(Math.random() * PALETTES.length)];
        this.trail = [];
        this.exploded = false;
      }

      update() {
        this.trail.push({ x: this.x, y: this.y, alpha: 1.0 });
        if (this.trail.length > 7) this.trail.shift();

        this.x += this.vx;
        this.y += this.vy;
        this.vy += 0.05; // slight gravity deceleration

        if (this.vy >= -0.5 || this.y <= this.targetY) {
          this.explode();
          this.exploded = true;
        }
      }

      explode() {
        const count = Math.floor(Math.random() * 25) + 35;
        for (let i = 0; i < count; i++) {
          const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.4;
          const speed = Math.random() * 4.5 + 1.5;
          const color = this.palette[Math.floor(Math.random() * this.palette.length)];
          particles.push(new FirecrackerSpark(this.x, this.y, Math.cos(angle) * speed, Math.sin(angle) * speed, color));
        }

        // Crackling mini secondary pops
        const crackleCount = Math.floor(Math.random() * 6) + 4;
        for (let j = 0; j < crackleCount; j++) {
          const cAngle = Math.random() * Math.PI * 2;
          const cSpeed = Math.random() * 3 + 0.8;
          particles.push(new CracklePopper(this.x, this.y, Math.cos(cAngle) * cSpeed, Math.sin(cAngle) * cSpeed, '#FFE08A'));
        }
      }

      draw() {
        ctx.save();
        // Rocket trail
        for (let i = 0; i < this.trail.length; i++) {
          const pt = this.trail[i];
          const a = (i / this.trail.length) * 0.7;
          ctx.beginPath();
          ctx.arc(pt.x, pt.y, (i / this.trail.length) * 2 + 0.8, 0, Math.PI * 2);
          ctx.fillStyle = this.palette[0];
          ctx.globalAlpha = a;
          ctx.fill();
        }
        // Rocket head
        ctx.beginPath();
        ctx.arc(this.x, this.y, 2.5, 0, Math.PI * 2);
        ctx.fillStyle = '#FFFFFF';
        ctx.globalAlpha = 1;
        ctx.shadowColor = this.palette[0];
        ctx.shadowBlur = 10;
        ctx.fill();
        ctx.restore();
      }
    }

    class FirecrackerSpark {
      constructor(x, y, vx, vy, color) {
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;
        this.color = color;
        this.friction = 0.96;
        this.gravity = 0.07;
        this.alpha = 1.0;
        this.decay = Math.random() * 0.016 + 0.012;
        this.size = Math.random() * 2.4 + 1.2;
        this.twinkle = Math.random() > 0.35;
      }

      update() {
        this.vx *= this.friction;
        this.vy = this.vy * this.friction + this.gravity;
        this.x += this.vx;
        this.y += this.vy;
        this.alpha -= this.decay;
      }

      draw() {
        if (this.alpha <= 0) return;
        ctx.save();
        ctx.globalAlpha = this.twinkle ? (Math.random() > 0.3 ? this.alpha : this.alpha * 0.4) : this.alpha;
        ctx.fillStyle = this.color;
        ctx.shadowColor = this.color;
        ctx.shadowBlur = 6;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    }

    class CracklePopper {
      constructor(x, y, vx, vy, color) {
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;
        this.color = color;
        this.life = Math.floor(Math.random() * 20) + 12;
        this.age = 0;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;
        this.vx *= 0.94;
        this.vy *= 0.94;
        this.age++;
        if (this.age === this.life) {
          // Snap mini crackle
          for (let k = 0; k < 5; k++) {
            const angle = Math.random() * Math.PI * 2;
            const spd = Math.random() * 2 + 0.5;
            particles.push(new FirecrackerSpark(this.x, this.y, Math.cos(angle) * spd, Math.sin(angle) * spd, '#FFF2A8'));
          }
        }
      }

      draw() {
        if (this.age < this.life) {
          ctx.save();
          ctx.globalAlpha = 0.8;
          ctx.fillStyle = '#FFE08A';
          ctx.fillRect(this.x - 1, this.y - 1, 2, 2);
          ctx.restore();
        }
      }
    }

    // Auto launcher timer
    let lastLaunch = performance.now();
    let nextLaunchDelay = 900;

    function launchRandom() {
      rockets.push(new Rocket());
      if (Math.random() > 0.65) {
        setTimeout(() => {
          rockets.push(new Rocket());
        }, 160);
      }
    }

    // Interactive launch on clicking background
    window.addEventListener('pointerdown', (e) => {
      if (e.target.closest('button, a, input, select, textarea, .modal, .sidebar-brand, .slot-card, .table-responsive, .offer-card, .nav-item')) {
        return;
      }
      rockets.push(new Rocket(e.clientX, e.clientX, e.clientY));
    });

    function animate(time) {
      if (document.hidden) {
        requestAnimationFrame(animate);
        return;
      }

      if (time - lastLaunch > nextLaunchDelay) {
        launchRandom();
        lastLaunch = time;
        nextLaunchDelay = Math.random() * 900 + 800; // 0.8s to 1.7s interval
      }

      ctx.clearRect(0, 0, width, height);

      // Update & Draw Rockets
      for (let i = rockets.length - 1; i >= 0; i--) {
        const r = rockets[i];
        r.update();
        r.draw();
        if (r.exploded) {
          rockets.splice(i, 1);
        }
      }

      // Update & Draw Particles
      for (let j = particles.length - 1; j >= 0; j--) {
        const p = particles[j];
        p.update();
        p.draw();
        if (p.alpha !== undefined && p.alpha <= 0) {
          particles.splice(j, 1);
        } else if (p.age !== undefined && p.age >= p.life + 1) {
          particles.splice(j, 1);
        }
      }

      requestAnimationFrame(animate);
    }

    requestAnimationFrame(animate);
  }

  // ==========================================================
  // 4. SPA NAVIGATION & ROUTING
  // ==========================================================
  function initRouting() {
    // Nav tab clicks
    document.addEventListener('click', (e) => {
      const link = e.target.closest('[data-route]');
      if (!link) return;
      e.preventDefault();
      const route = link.getAttribute('data-route');
      navigateTo(route);

      // Close mobile sidebar if open
      closeMobileSidebar();
    });

    // Browser back / forward buttons
    window.addEventListener('popstate', (e) => {
      const path = location.pathname.replace(/^\//, '') || 'home';
      switchSection(path, false);
    });

    // Initial path
    const initialRoute = location.pathname.replace(/^\//, '') || 'home';
    switchSection(initialRoute, false);
  }

  function navigateTo(route) {
    if (state.activeTab === route) return;
    const path = route === 'home' ? '/' : `/${route}`;
    history.pushState({ route }, '', path);
    switchSection(route, true);
  }

  function switchSection(route, scrollUp = true) {
    const validSections = [
      'home', 'crypto-casinos', 'traditional-casinos', 'stream',
      'leaderboard', 'slot-voting', 'vpn', 'buy-crypto',
      'casino-explained', 'socials', 'bonus-hunt-archive',
      'gamban', 'promotions'
    ];

    let target = route;
    if (target === 'youtube') target = 'socials';
    if (route === 'admin') {
      openAdminModal();
      return;
    }
    if (!validSections.includes(target)) {
      target = 'home';
    }

    state.activeTab = target;

    // Toggle active class on sections
    document.querySelectorAll('.page-section').forEach((sec) => {
      sec.classList.remove('active');
    });
    const activeSec = document.getElementById(`section-${target}`);
    if (activeSec) {
      activeSec.classList.add('active');
    }

    // Update sidebar nav tab active states
    document.querySelectorAll('.nav-tab').forEach((tab) => {
      tab.classList.remove('active');
      if (tab.getAttribute('data-route') === target) {
        tab.classList.add('active');
      }
    });

    if (target === 'home') {
      setTimeout(() => window.dispatchEvent(new Event('resize')), 50);
    }

    if (scrollUp) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  function initMobileNav() {
    const hamburger = document.getElementById('hamburger-toggle');
    const closeBtn = document.getElementById('sidebar-close-btn');
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebar-overlay');

    if (hamburger && sidebar && overlay) {
      hamburger.addEventListener('click', () => {
        const isOpen = sidebar.classList.toggle('open');
        overlay.classList.toggle('open', isOpen);
        document.body.classList.toggle('drawer-open', isOpen);
      });

      overlay.addEventListener('click', () => {
        closeMobileSidebar();
      });

      if (closeBtn) {
        closeBtn.addEventListener('click', () => {
          closeMobileSidebar();
        });
      }
    }
  }

  function closeMobileSidebar() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebar-overlay');
    if (sidebar) sidebar.classList.remove('open');
    if (overlay) overlay.classList.remove('open');
    document.body.classList.remove('drawer-open');
  }

  // ==========================================================
  // 5. FETCH APPLICATION STATE & REAL-TIME UPDATES
  // ==========================================================
  async function fetchState(fullRender = false) {
    try {
      let res = await fetch('/api/state');
      if (!res.ok) {
        // Fallback to static data.json if API serverless function is unavailable
        res = await fetch('/data.json');
      }
      if (!res.ok) return;
      const data = await res.json();
      state = { ...state, ...data };

      // Render UI components
      renderStreamStatus();
      renderSlotVoting();
      renderFeaturedOffers();
      renderLeaderboard();
      renderBonusHunts();
      renderCasinoLists();
    } catch (err) {
      try {
        const fallbackRes = await fetch('/data.json');
        if (fallbackRes.ok) {
          const data = await fallbackRes.json();
          state = { ...state, ...data };
          renderStreamStatus();
          renderSlotVoting();
          renderFeaturedOffers();
          renderLeaderboard();
          renderBonusHunts();
          renderCasinoLists();
          return;
        }
      } catch (e) {}
      console.warn('Live fetch notice:', err);
    }
  }

  // ==========================================================
  // 6. RENDER STREAM STATUS (Sidebar & Stream Page)
  // ==========================================================
  function renderStreamStatus() {
    const s = state.stream_status || {};
    const liveWidget = document.getElementById('sidebar-live-widget');
    if (!liveWidget) return;

    const isLive = s.is_live ?? true;
    const title = s.title || '🎰 $10,000 BONUS HUNT + SHUFFLE LEADERBOARD RACE!';
    const viewers = s.viewers ? s.viewers.toLocaleString() : '1,842';

    // Only construct iframe once to avoid reloads during 4s polling
    const existingIframe = liveWidget.querySelector('.mini-kick-iframe');
    if (!existingIframe) {
      liveWidget.innerHTML = `
        <div class="live-card">
          <div class="live-header">
            <span class="live-pill ${isLive ? 'live' : 'offline'}">
              ${isLive ? '<span class="pulsing-dot"></span> LIVE ON KICK' : 'OFFLINE'}
            </span>
            <span class="live-viewers" id="mini-stream-viewers">${isLive ? `${viewers} Watching` : (s.next_stream || 'Next stream soon')}</span>
          </div>
          <div class="live-video-embed-wrap">
            <iframe src="https://player.kick.com/mashmanos?autoplay=true&muted=true"
                    class="mini-kick-iframe"
                    allowfullscreen
                    frameborder="0"
                    scrolling="no"></iframe>
          </div>
          <div class="live-action-bar">
            <a href="${s.stream_url || 'https://kick.com/mashmanos'}" target="_blank" rel="noopener" class="live-title-link" id="mini-stream-title" title="${title}">
              ${title}
            </a>
            <a href="${s.stream_url || 'https://kick.com/mashmanos'}" target="_blank" rel="noopener" class="live-watch-btn">
              WATCH &rarr;
            </a>
          </div>
        </div>
      `;
    } else {
      const vEl = document.getElementById('mini-stream-viewers');
      if (vEl) vEl.textContent = isLive ? `${viewers} Watching` : (s.next_stream || 'Next stream soon');
      const tEl = document.getElementById('mini-stream-title');
      if (tEl) {
        tEl.textContent = title;
        tEl.title = title;
      }
    }

    // Stream section embed
    const streamStatusBadge = document.getElementById('stream-page-status');
    if (streamStatusBadge) {
      streamStatusBadge.innerHTML = isLive
        ? `<span class="live-pill live"><span class="pulsing-dot"></span> LIVE ON KICK</span>`
        : `<span class="live-pill offline">OFFLINE</span>`;
    }
    const streamTitleEl = document.getElementById('stream-page-title');
    if (streamTitleEl) {
      streamTitleEl.textContent = title;
    }
    const streamViewersEl = document.getElementById('stream-page-viewers');
    if (streamViewersEl) {
      streamViewersEl.textContent = isLive ? `${viewers} Watching Now` : (s.next_stream || 'Stream scheduled');
    }
  }

  // ==========================================================
  // 7. RENDER FEATURED OFFERS (Home Page)
  // ==========================================================
  function renderFeaturedOffers() {
    const offersContainer = document.getElementById('featured-offers-container');
    if (!offersContainer || !state.featured_offers) return;

    const crypto = state.featured_offers.crypto;
    const trad = state.featured_offers.traditional;

    offersContainer.innerHTML = `
      <!-- Crypto Offer -->
      <div class="offer-card">
        <span class="offer-card-badge">${crypto.badge}</span>
        <div class="offer-card-top">
          <div class="offer-logo-wrap">
            <img src="${crypto.logo}" alt="${crypto.name}">
          </div>
        </div>
        <h3 class="offer-bonus-headline">100% Match up to <span>$1,000</span> + VIP Transfer</h3>
        <ul class="offer-bullets">
          ${crypto.highlights.map(h => `<li><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>${h}</li>`).join('')}
        </ul>
        <div class="offer-footer">
          <div class="offer-code-pill" onclick="window.copyPromoCode('${crypto.code}')" title="Click to copy code">
            CODE: <strong>${crypto.code}</strong>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
          </div>
          <a href="${crypto.affiliate_url}" target="_blank" rel="noopener" class="btn-shine btn-gold btn-md">
            CLAIM BONUS
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </a>
        </div>
      </div>

      <!-- Traditional Offer -->
      <div class="offer-card">
        <span class="offer-card-badge">${trad.badge}</span>
        <div class="offer-card-top">
          <div class="offer-logo-wrap">
            <img src="${trad.logo}" alt="${trad.name}">
          </div>
        </div>
        <h3 class="offer-bonus-headline">30 Free Spins — <span>Zero Wagering</span> Ever</h3>
        <ul class="offer-bullets">
          ${trad.highlights.map(h => `<li><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>${h}</li>`).join('')}
        </ul>
        <div class="offer-footer">
          <div class="offer-code-pill" onclick="window.copyPromoCode('${trad.code}')" title="Click to copy code">
            CODE: <strong>${trad.code}</strong>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
          </div>
          <a href="${trad.affiliate_url}" target="_blank" rel="noopener" class="btn-shine btn-gold btn-md">
            CLAIM BONUS
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </a>
        </div>
      </div>
    `;
  }

  // ==========================================================
  // 8. RENDER SLOT VOTING (Community Grid & Leader)
  // ==========================================================
  function renderSlotVoting() {
    const votingGrid = document.getElementById('slots-grid-container');
    const homePreviewGrid = document.getElementById('home-slot-preview-grid');
    const totalVotesEl = document.getElementById('total-votes-count');
    const votingStatusPill = document.getElementById('voting-status-pill');
    const topSlotShowcase = document.getElementById('top-voted-showcase-container');

    const totalVotes = state.voting_status?.total_votes || 0;
    const isOpen = state.voting_status?.is_open ?? true;

    if (totalVotesEl) totalVotesEl.textContent = totalVotes.toLocaleString();
    if (votingStatusPill) {
      votingStatusPill.className = isOpen ? 'live-pill live' : 'live-pill offline';
      votingStatusPill.innerHTML = isOpen
        ? '<span class="pulsing-dot"></span> VOTING ACTIVE'
        : 'VOTING PAUSED';
    }

    const sortedSlots = [...(state.slots || [])].sort((a, b) => (b.votes || 0) - (a.votes || 0));
    const leadingSlot = sortedSlots[0];

    // Render Showcase for #1 Leading Slot
    if (topSlotShowcase && leadingSlot) {
      const pct = totalVotes > 0 ? ((leadingSlot.votes / totalVotes) * 100).toFixed(1) : 0;
      topSlotShowcase.innerHTML = `
        <div class="top-voted-left">
          <div class="top-crown-icon">👑</div>
          <div class="top-slot-details">
            <span style="font-size: 0.72rem; color: var(--gold-primary); font-weight: 800; text-transform: uppercase; letter-spacing: 1.5px;">Current Community Favorite</span>
            <h3>${leadingSlot.name}</h3>
            <p>${leadingSlot.provider} &bull; ${leadingSlot.votes} Votes (${pct}%)</p>
          </div>
        </div>
        <button class="btn-shine btn-gold btn-md" onclick="window.castVote('${leadingSlot.id}')" ${!isOpen ? 'disabled' : ''}>
          VOTE THIS SLOT
        </button>
      `;
    }

    // Render Grid of All Slots
    if (votingGrid) {
      votingGrid.innerHTML = sortedSlots.map((slot, index) => {
        const isLeading = index === 0;
        const pct = totalVotes > 0 ? ((slot.votes / totalVotes) * 100).toFixed(1) : 0;
        return `
          <div class="slot-card ${isLeading ? 'leading' : ''}">
            <div class="slot-thumb-wrap">
              <span class="slot-rank-tag">#${index + 1}</span>
              <img src="${slot.image}" alt="${slot.name}" loading="lazy">
            </div>
            <div class="slot-body">
              <div class="slot-info-header">
                <span class="slot-provider">${slot.provider}</span>
                <h4 class="slot-name">${slot.name}</h4>
              </div>
              <div class="slot-meta-chips">
                <span>RTP: ${slot.rtp}</span>
                <span>Max: ${slot.max_win}</span>
              </div>
              <div class="vote-progress-wrap">
                <div class="vote-progress-header">
                  <span class="vote-count-label">${slot.votes.toLocaleString()} votes</span>
                  <span class="vote-pct-label">${pct}%</span>
                </div>
                <div class="vote-bar-bg">
                  <div class="vote-bar-fill" style="width: ${pct}%"></div>
                </div>
              </div>
              <button class="btn-shine ${isLeading ? 'btn-gold' : 'btn-purple'} btn-sm btn-vote"
                      onclick="window.castVote('${slot.id}')" ${!isOpen ? 'disabled' : ''}>
                ${isOpen ? 'VOTE' : 'PAUSED'}
              </button>
            </div>
          </div>
        `;
      }).join('');
    }

    // Home Page top 4 teaser
    if (homePreviewGrid) {
      homePreviewGrid.innerHTML = sortedSlots.slice(0, 4).map((slot, index) => {
        const pct = totalVotes > 0 ? ((slot.votes / totalVotes) * 100).toFixed(1) : 0;
        return `
          <div class="slot-card ${index === 0 ? 'leading' : ''}">
            <div class="slot-thumb-wrap">
              <span class="slot-rank-tag">#${index + 1}</span>
              <img src="${slot.image}" alt="${slot.name}" loading="lazy">
            </div>
            <div class="slot-body">
              <span class="slot-provider">${slot.provider}</span>
              <h4 class="slot-name">${slot.name}</h4>
              <div class="vote-progress-wrap">
                <div class="vote-progress-header">
                  <span>${slot.votes} votes</span>
                  <span class="vote-pct-label">${pct}%</span>
                </div>
                <div class="vote-bar-bg">
                  <div class="vote-bar-fill" style="width: ${pct}%"></div>
                </div>
              </div>
              <button class="btn-shine btn-gold btn-sm btn-vote" onclick="window.castVote('${slot.id}')">
                VOTE
              </button>
            </div>
          </div>
        `;
      }).join('');
    }
  }

  // Cast Vote Handler
  window.castVote = async function (slotId) {
    if (!state.voting_status?.is_open) {
      showToast('Voting is currently paused by Mashmanos.', 'warning');
      return;
    }

    try {
      const res = await fetch('/api/vote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          slot_id: slotId,
          voter_id: voterId
        })
      });

      const data = await res.json();
      if (data.success) {
        showToast(`🎉 ${data.message}`);
        triggerConfetti();
        fetchState(false);
      } else {
        showToast(data.error || 'Vote could not be processed.', 'warning');
      }
    } catch (err) {
      showToast('Network error while casting vote.', 'error');
    }
  };

  // ==========================================================
  // 9. RENDER LEADERBOARDS (NickelRewards Style)
  // ==========================================================
  function renderLeaderboard() {
    const lbContainer = document.getElementById('leaderboard-table-container');
    const heroBanner = document.getElementById('leaderboard-banner-info');
    if (!lbContainer) return;

    const sponsor = state.activeLbSponsor || 'shuffle';
    const lb = state.leaderboards?.[sponsor];
    if (!lb) return;

    // Render Hero Banner
    if (heroBanner) {
      heroBanner.innerHTML = `
        <div>
          <span style="font-size: 0.72rem; color: var(--gold-primary); font-weight: 800; letter-spacing: 1.5px; text-transform: uppercase;">
            ${lb.sponsor} Official Race
          </span>
          <h2 style="font-size: 2rem; font-weight: 900; margin-top: 4px;">${lb.title}</h2>
          <p style="color: var(--text-muted); font-size: 0.88rem; margin-top: 4px;">
            Total Prize Pool: <strong style="color: var(--gold-light); font-size: 1.1rem;">${lb.prize_pool}</strong>
          </p>
          <div class="countdown-box-wrap" id="lb-countdown-clock">
            <div class="countdown-unit"><span class="countdown-val" id="cd-days">04</span><span class="countdown-lbl">Days</span></div>
            <div class="countdown-unit"><span class="countdown-val" id="cd-hours">18</span><span class="countdown-lbl">Hours</span></div>
            <div class="countdown-unit"><span class="countdown-val" id="cd-mins">42</span><span class="countdown-lbl">Mins</span></div>
            <div class="countdown-unit"><span class="countdown-val" id="cd-secs">15</span><span class="countdown-lbl">Secs</span></div>
          </div>
        </div>
        <div class="prizes-cards-row">
          <div class="prize-pill-card gold-tier">
            <span style="font-size: 1.4rem;">🥇</span>
            <span style="font-size: 0.72rem; color: var(--text-muted); font-weight: 700;">1ST PLACE</span>
            <strong style="color: var(--gold-primary); font-size: 1.2rem; font-family: monospace;">$250.00</strong>
          </div>
          <div class="prize-pill-card silver-tier">
            <span style="font-size: 1.4rem;">🥈</span>
            <span style="font-size: 0.72rem; color: var(--text-muted); font-weight: 700;">2ND PLACE</span>
            <strong style="color: #FFFFFF; font-size: 1.2rem; font-family: monospace;">$125.00</strong>
          </div>
          <div class="prize-pill-card bronze-tier">
            <span style="font-size: 1.4rem;">🥉</span>
            <span style="font-size: 0.72rem; color: var(--text-muted); font-weight: 700;">3RD PLACE</span>
            <strong style="color: #CD7F32; font-size: 1.2rem; font-family: monospace;">$65.00</strong>
          </div>
        </div>
      `;
      startLeaderboardClock();
    }

    // Render 3D Podium and Table
    const searchFilter = (document.getElementById('lb-search-input')?.value || '').toLowerCase().trim();
    const allEntries = lb.entries || [];

    if (!searchFilter) {
      const p1 = allEntries.find(e => e.rank === 1) || allEntries[0];
      const p2 = allEntries.find(e => e.rank === 2) || allEntries[1];
      const p3 = allEntries.find(e => e.rank === 3) || allEntries[2];
      const runnersUp = allEntries.filter(e => e.rank > 3);

      lbContainer.innerHTML = `
        <!-- 3D Tiered Glass Podium for Top 3 (Super-Sized & Goofy Attributes) -->
        <div class="lb-podium-container">
          <!-- Rank 2: Silver (Left - Sweaty Tryhard) -->
          ${p2 ? `
          <div class="podium-pillar rank-2">
            <div class="podium-user-badge">
              <div class="podium-avatar-wrap">
                <!-- Goofy Floating Props -->
                <span class="goofy-prop prop-sweat-1">💦</span>
                <span class="goofy-prop prop-sweat-2">😤</span>
                <div class="podium-avatar">
                  <svg viewBox="0 0 100 100" class="goofy-avatar-svg">
                    <defs>
                      <radialGradient id="silverFaceGrad" cx="40%" cy="35%" r="70%">
                        <stop offset="0%" stop-color="#FFFFFF"/>
                        <stop offset="65%" stop-color="#CBD5E1"/>
                        <stop offset="100%" stop-color="#64748B"/>
                      </radialGradient>
                    </defs>
                    <circle cx="50" cy="50" r="48" fill="url(#silverFaceGrad)"/>
                    <!-- Red Headband -->
                    <path d="M 10 28 Q 50 14, 90 28" fill="none" stroke="#EF4444" stroke-width="14" stroke-linecap="round"/>
                    <path d="M 14 32 L 4 44 M 14 32 L 6 52" stroke="#EF4444" stroke-width="6" stroke-linecap="round"/>
                    <!-- Giant Stressed Eyes -->
                    <ellipse cx="35" cy="46" rx="13" ry="16" fill="#FFFFFF" stroke="#1A1033" stroke-width="3"/>
                    <ellipse cx="65" cy="46" rx="13" ry="16" fill="#FFFFFF" stroke="#1A1033" stroke-width="3"/>
                    <circle cx="38" cy="47" r="4.5" fill="#1A1033"/>
                    <circle cx="62" cy="47" r="4.5" fill="#1A1033"/>
                    <circle cx="40" cy="45" r="1.8" fill="#FFFFFF"/>
                    <circle cx="64" cy="45" r="1.8" fill="#FFFFFF"/>
                    <!-- Stressed mouth -->
                    <path d="M 32 74 Q 40 66, 50 74 T 68 74" fill="none" stroke="#1A1033" stroke-width="4.5" stroke-linecap="round"/>
                    <!-- Sweat drops -->
                    <path d="M 22 48 Q 18 56, 22 60 Q 26 56, 22 48" fill="#38BDF8" class="sweat-drop-anim"/>
                    <path d="M 78 52 Q 74 60, 78 64 Q 82 60, 78 52" fill="#38BDF8" class="sweat-drop-anim" style="animation-delay: 0.5s;"/>
                  </svg>
                </div>
                <div class="podium-medal">🥈</div>
              </div>
              <div class="podium-champ-ribbon silver-ribbon">🥈 CHOKE ARTIST</div>
              <div class="podium-user-name">${p2.username}</div>
              <div class="podium-personality-tag silver-personality">SWEAT LEVEL: MAXIMUM 🏃💨</div>
              <div class="podium-wager">$${p2.wagered.toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>
            </div>
            <div class="podium-stand silver-stand">
              <div class="podium-rank-num">2</div>
              <div class="podium-prize-tag">${p2.prize}</div>
              <div class="podium-trait-banner silver-trait">SO CLOSE YET SO FAR 😭</div>
            </div>
          </div>
          ` : ''}

          <!-- Rank 1: Gold (Center - Whale Final Boss) -->
          ${p1 ? `
          <div class="podium-pillar rank-1">
            <div class="podium-crown-floating">👑</div>
            <div class="podium-user-badge">
              <div class="podium-avatar-wrap">
                <!-- Goofy Floating Props -->
                <span class="goofy-prop prop-cash-1">💸</span>
                <span class="goofy-prop prop-cash-2">💰</span>
                <span class="goofy-prop prop-diamond">💎</span>
                <div class="podium-avatar">
                  <svg viewBox="0 0 100 100" class="goofy-avatar-svg">
                    <defs>
                      <radialGradient id="goldFaceGrad" cx="40%" cy="35%" r="70%">
                        <stop offset="0%" stop-color="#FFF2A8"/>
                        <stop offset="60%" stop-color="#F5C542"/>
                        <stop offset="100%" stop-color="#B7791F"/>
                      </radialGradient>
                    </defs>
                    <circle cx="50" cy="50" r="48" fill="url(#goldFaceGrad)"/>
                    <!-- Smug smile with gold tooth -->
                    <path d="M 30 64 Q 50 82, 70 64" fill="none" stroke="#1A1033" stroke-width="5" stroke-linecap="round"/>
                    <rect x="44" y="67" width="7" height="8" rx="1" fill="#FFE08A" stroke="#B7791F" stroke-width="1.2"/>
                    <polygon points="49,63 51,66 54,66 51,68 53,71 49,69 46,71 47,68 45,66 48,66" fill="#FFF"/>
                    <!-- 8-Bit Pixel Thug Life Sunglasses -->
                    <g>
                      <rect x="16" y="34" width="30" height="20" rx="2" fill="#0B0B12"/>
                      <rect x="54" y="34" width="30" height="20" rx="2" fill="#0B0B12"/>
                      <rect x="44" y="40" width="12" height="6" fill="#0B0B12"/>
                      <rect x="20" y="37" width="7" height="6" fill="#FFFFFF"/>
                      <rect x="27" y="43" width="5" height="5" fill="#FFFFFF"/>
                      <rect x="58" y="37" width="7" height="6" fill="#FFFFFF"/>
                      <rect x="65" y="43" width="5" height="5" fill="#FFFFFF"/>
                    </g>
                    <!-- Smoking Cigar -->
                    <g transform="translate(64, 62) rotate(-15)">
                      <rect x="0" y="0" width="22" height="8" rx="2" fill="#78350F"/>
                      <rect x="18" y="0" width="4" height="8" fill="#EF4444"/>
                      <circle cx="23" cy="4" r="3" fill="#F59E0B" class="cigar-ember"/>
                    </g>
                    <!-- Chunky Gold Chain with $ pendant -->
                    <path d="M 22 80 Q 50 104, 78 80" fill="none" stroke="#F5C542" stroke-width="7" stroke-dasharray="4,3" stroke-linecap="round"/>
                    <circle cx="50" cy="95" r="10" fill="#F5C542" stroke="#FFFFFF" stroke-width="2"/>
                    <text x="50" y="100" font-family="sans-serif" font-size="13" font-weight="900" fill="#1A1033" text-anchor="middle">$</text>
                  </svg>
                </div>
                <div class="podium-medal">🥇</div>
              </div>
              <div class="podium-champ-ribbon">👑 DEGEN FINAL BOSS 👑</div>
              <div class="podium-user-name">${p1.username}</div>
              <div class="podium-personality-tag gold-personality">WHALE STATUS: UNTOUCHABLE 🐋</div>
              <div class="podium-wager">$${p1.wagered.toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>
            </div>
            <div class="podium-stand gold-stand">
              <div class="podium-rank-num">1</div>
              <div class="podium-prize-tag">${p1.prize}</div>
              <div class="podium-trait-banner gold-trait">🔥 999x STREAK • NO LOSSES</div>
            </div>
          </div>
          ` : ''}

          <!-- Rank 3: Bronze (Right - Clueless Hero) -->
          ${p3 ? `
          <div class="podium-pillar rank-3">
            <div class="podium-user-badge">
              <div class="podium-avatar-wrap">
                <!-- Goofy Floating Props -->
                <span class="goofy-prop prop-pizza">🍕</span>
                <span class="goofy-prop prop-duck">🦆</span>
                <div class="podium-avatar">
                  <svg viewBox="0 0 100 100" class="goofy-avatar-svg">
                    <defs>
                      <radialGradient id="bronzeFaceGrad" cx="40%" cy="35%" r="70%">
                        <stop offset="0%" stop-color="#FDBA74"/>
                        <stop offset="65%" stop-color="#EA580C"/>
                        <stop offset="100%" stop-color="#7C2D12"/>
                      </radialGradient>
                    </defs>
                    <circle cx="50" cy="50" r="48" fill="url(#bronzeFaceGrad)"/>
                    <!-- Spinning Propeller Hat -->
                    <path d="M 24 24 C 24 10, 76 10, 76 24 Z" fill="#3B82F6"/>
                    <line x1="50" y1="10" x2="50" y2="2" stroke="#FFFFFF" stroke-width="4"/>
                    <ellipse cx="50" cy="2" rx="22" ry="5" fill="#EF4444" class="propeller-spin"/>
                    <!-- Groucho Marx disguise glasses -->
                    <circle cx="34" cy="44" r="13" fill="none" stroke="#0B0B12" stroke-width="4.5"/>
                    <circle cx="66" cy="44" r="13" fill="none" stroke="#0B0B12" stroke-width="4.5"/>
                    <line x1="47" y1="44" x2="53" y2="44" stroke="#0B0B12" stroke-width="4.5"/>
                    <!-- Giant Orange Nose -->
                    <ellipse cx="50" cy="54" rx="13" ry="16" fill="#FB923C" stroke="#7C2D12" stroke-width="2.5"/>
                    <!-- Bushy Mustache -->
                    <path d="M 28 68 C 38 60, 48 70, 50 67 C 52 70, 62 60, 72 68 C 66 79, 34 79, 28 68 Z" fill="#0B0B12"/>
                    <!-- Silly Tongue -->
                    <path d="M 44 76 Q 50 90, 56 76" fill="#F43F5E" stroke="#1A1033" stroke-width="2.5"/>
                    <line x1="50" y1="77" x2="50" y2="85" stroke="#BE123C" stroke-width="1.5"/>
                  </svg>
                </div>
                <div class="podium-medal">🥉</div>
              </div>
              <div class="podium-champ-ribbon bronze-ribbon">🥉 THIRD WHEEL HERO</div>
              <div class="podium-user-name">${p3.username}</div>
              <div class="podium-personality-tag bronze-personality">VIBES: 100% IMMACULATE 😂</div>
              <div class="podium-wager">$${p3.wagered.toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>
            </div>
            <div class="podium-stand bronze-stand">
              <div class="podium-rank-num">3</div>
              <div class="podium-prize-tag">${p3.prize}</div>
              <div class="podium-trait-banner bronze-trait">JUST HAPPY TO PARTICIPATE 🍕</div>
            </div>
          </div>
          ` : ''}
        </div>

        <!-- Runners Up Standings Table (Ranks 4-10) -->
        <div style="margin: 24px 0 14px; display: flex; align-items: center; justify-content: space-between;">
          <h4 style="font-size: 1.05rem; font-weight: 800; color: var(--gold-light); display: flex; align-items: center; gap: 8px;">
            <span>⚡</span> Runners-Up Standings (Ranks #4 - #${allEntries.length})
          </h4>
          <span style="font-size: 0.8rem; color: var(--text-muted); font-weight: 600;">${runnersUp.length} Competitors</span>
        </div>
        <div class="table-responsive">
          <table class="lb-table">
            <thead>
              <tr>
                <th style="width: 80px;">Rank</th>
                <th>Player</th>
                <th>Wagered Amount</th>
                <th>Est. Prize</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              ${runnersUp.map(e => `
                <tr class="rank-${e.rank}">
                  <td>
                    <span class="rank-badge">#${e.rank}</span>
                  </td>
                  <td>
                    <div class="user-cell">
                      <div class="user-avatar">${e.username.slice(0, 2).toUpperCase()}</div>
                      <span>${e.username}</span>
                    </div>
                  </td>
                  <td class="wager-amount">$${e.wagered.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                  <td class="prize-amount">${e.prize}</td>
                  <td>
                    <span style="font-size: 0.75rem; color: var(--gold-primary); font-weight: 700;">${e.status}</span>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      `;
    } else {
      // Search Active: Display all matching players
      const filteredEntries = allEntries.filter(e => e.username.toLowerCase().includes(searchFilter));

      lbContainer.innerHTML = `
        <div style="margin: 16px 0 12px; color: var(--text-muted); font-size: 0.88rem;">
          Showing results for "<strong style="color: #FFFFFF;">${searchFilter}</strong>" (${filteredEntries.length} found):
        </div>
        <div class="table-responsive">
          <table class="lb-table">
            <thead>
              <tr>
                <th style="width: 80px;">Rank</th>
                <th>Player</th>
                <th>Wagered Amount</th>
                <th>Est. Prize</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              ${filteredEntries.length > 0 ? filteredEntries.map(e => `
                <tr class="rank-${e.rank}">
                  <td>
                    <span class="rank-badge">${e.rank <= 3 ? ['🥇', '🥈', '🥉'][e.rank - 1] : `#${e.rank}`}</span>
                  </td>
                  <td>
                    <div class="user-cell">
                      <div class="user-avatar">${e.username.slice(0, 2).toUpperCase()}</div>
                      <span>${e.username}</span>
                    </div>
                  </td>
                  <td class="wager-amount">$${e.wagered.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                  <td class="prize-amount">${e.prize}</td>
                  <td>
                    <span style="font-size: 0.75rem; color: var(--gold-primary); font-weight: 700;">${e.status}</span>
                  </td>
                </tr>
              `).join('') : `
                <tr>
                  <td colspan="5" style="text-align: center; padding: 36px; color: var(--text-muted);">
                    No players matching "${searchFilter}" found in the ${lb.sponsor} race.
                  </td>
                </tr>
              `}
            </tbody>
          </table>
        </div>
      `;
    }
  }

  // Expose renderLeaderboard globally
  window.renderLeaderboard = renderLeaderboard;

  // Switch Leaderboard Sponsor Tab
  window.switchLbSponsor = function (sponsor) {
    state.activeLbSponsor = sponsor;
    document.querySelectorAll('.lb-tab-btn').forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-sponsor') === sponsor);
    });
    renderLeaderboard();
  };

  // Live countdown clock
  let countdownTimer = null;
  function startLeaderboardClock() {
    if (countdownTimer) clearInterval(countdownTimer);
    let target = new Date();
    target.setDate(target.getDate() + 5);
    target.setHours(23, 59, 59);

    function update() {
      const now = new Date();
      const diff = Math.max(0, target - now);

      const d = Math.floor(diff / (1000 * 60 * 60 * 24));
      const h = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const m = Math.floor((diff / 1000 / 60) % 60);
      const s = Math.floor((diff / 1000) % 60);

      const cdD = document.getElementById('cd-days');
      const cdH = document.getElementById('cd-hours');
      const cdM = document.getElementById('cd-mins');
      const cdS = document.getElementById('cd-secs');

      if (cdD) cdD.textContent = String(d).padStart(2, '0');
      if (cdH) cdH.textContent = String(h).padStart(2, '0');
      if (cdM) cdM.textContent = String(m).padStart(2, '0');
      if (cdS) cdS.textContent = String(s).padStart(2, '0');
    }
    update();
    countdownTimer = setInterval(update, 1000);
  }

  // ==========================================================
  // 10. RENDER BONUS HUNT ARCHIVE
  // ==========================================================
  function renderBonusHunts() {
    const huntsContainer = document.getElementById('hunts-table-container');
    const statsContainer = document.getElementById('hunts-stats-container');
    if (!huntsContainer) return;

    const hunts = state.bonus_hunts || [];

    // Summary Stats
    const totalHunts = hunts.length;
    const totalCost = hunts.reduce((acc, h) => acc + (h.start_cost || 0), 0);
    const totalWin = hunts.reduce((acc, h) => acc + (h.total_win || 0), 0);
    const overallProfit = totalWin - totalCost;
    const bestWinItem = [...hunts].sort((a, b) => b.multiplier - a.multiplier)[0];

    if (statsContainer) {
      statsContainer.innerHTML = `
        <div class="hunt-stat-card">
          <span class="hunt-stat-val">${totalHunts}</span>
          <span class="hunt-stat-lbl">Hunts Recorded</span>
        </div>
        <div class="hunt-stat-card">
          <span class="hunt-stat-val">$${totalCost.toLocaleString()}</span>
          <span class="hunt-stat-lbl">Total Cost</span>
        </div>
        <div class="hunt-stat-card">
          <span class="hunt-stat-val" style="color: ${overallProfit >= 0 ? 'var(--gold-primary)' : '#EF4444'}">
            ${overallProfit >= 0 ? '+' : ''}$${overallProfit.toLocaleString()}
          </span>
          <span class="hunt-stat-lbl">Community Net Result</span>
        </div>
        <div class="hunt-stat-card">
          <span class="hunt-stat-val">${bestWinItem ? `${bestWinItem.multiplier}x` : '0x'}</span>
          <span class="hunt-stat-lbl">Record Multiplier</span>
        </div>
      `;
    }

    // Filter by type & search
    let filtered = hunts.filter(h => {
      if (state.huntFilter === 'profit') return h.status === 'PROFIT';
      if (state.huntFilter === 'bust') return h.status === 'BUST';
      return true;
    });

    if (state.huntSearch) {
      const q = state.huntSearch.toLowerCase();
      filtered = filtered.filter(h =>
        h.title.toLowerCase().includes(q) ||
        h.best_win.toLowerCase().includes(q) ||
        h.date.includes(q)
      );
    }

    huntsContainer.innerHTML = `
      <div class="table-responsive">
        <table class="lb-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Hunt Title</th>
              <th>Start Cost</th>
              <th>Total Win</th>
              <th>ROI / Multiplier</th>
              <th>Bonuses</th>
              <th>Best Single Win</th>
              <th>Result</th>
            </tr>
          </thead>
          <tbody>
            ${filtered.map(h => `
              <tr>
                <td style="font-family: monospace; color: var(--text-muted);">${h.date}</td>
                <td><strong>${h.title}</strong></td>
                <td style="font-family: monospace;">$${h.start_cost.toLocaleString()}</td>
                <td style="font-family: monospace; font-weight: 700; color: #FFFFFF;">$${h.total_win.toLocaleString()}</td>
                <td style="font-family: monospace; font-weight: 800; color: ${h.multiplier >= 1 ? 'var(--gold-primary)' : 'var(--text-muted)'};">
                  ${h.multiplier}x
                </td>
                <td>${h.bonuses_opened}</td>
                <td style="font-size: 0.82rem; color: var(--gold-light);">${h.best_win}</td>
                <td>
                  <span class="${h.status === 'PROFIT' ? 'badge-profit' : 'badge-bust'}">${h.status}</span>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
  }

  // Filter bonus hunts
  window.setHuntFilter = function (filter) {
    state.huntFilter = filter;
    document.querySelectorAll('.filter-chip').forEach(c => {
      c.classList.toggle('active', c.getAttribute('data-filter') === filter);
    });
    renderBonusHunts();
  };

  window.handleHuntSearch = function (e) {
    state.huntSearch = e.target.value;
    renderBonusHunts();
  };

  // ==========================================================
  // 11. RENDER CASINO LISTS (Crypto & Traditional)
  // ==========================================================
  function renderCasinoLists() {
    // Crypto list
    const cryptoContainer = document.getElementById('crypto-casinos-container');
    if (cryptoContainer && state.crypto_casinos) {
      cryptoContainer.innerHTML = state.crypto_casinos.map(c => `
        <div class="casino-row-card">
          <div class="casino-brand-col">
            <div style="height: 40px; display: flex; align-items: center;">
              <img src="${c.logo}" alt="${c.name}" style="max-height: 100%; max-width: 140px;">
            </div>
            <span style="font-size: 0.72rem; color: var(--gold-primary); font-weight: 800;">${c.badge}</span>
          </div>
          <div class="casino-bonus-col">
            <h3 style="font-size: 1.15rem; font-weight: 900; color: #FFFFFF;">${c.bonus}</h3>
            <p style="font-size: 0.82rem; color: var(--text-secondary);">${c.secondary_perk}</p>
            <div style="display: flex; gap: 6px; margin-top: 6px;">
              ${c.deposit_methods.map(m => `<span style="font-size: 0.65rem; background: rgba(26,16,51,0.8); border: 1px solid var(--purple-border); padding: 2px 6px; border-radius: 4px;">${m}</span>`).join('')}
            </div>
          </div>
          <div class="casino-perks-col">
            ${c.pros.map(p => `<div><span style="color: var(--gold-primary); margin-right: 4px;">✓</span> ${p}</div>`).join('')}
          </div>
          <div style="display: flex; flex-direction: column; gap: 8px; align-items: flex-end;">
            <div class="offer-code-pill" onclick="window.copyPromoCode('${c.code}')">
              CODE: <strong>${c.code}</strong>
            </div>
            <a href="${c.affiliate_url}" target="_blank" rel="noopener" class="btn-shine btn-gold btn-md">
              CLAIM BONUS
            </a>
          </div>
        </div>
      `).join('');
    }

    // Traditional list
    const tradContainer = document.getElementById('traditional-casinos-container');
    if (tradContainer && state.traditional_casinos) {
      tradContainer.innerHTML = state.traditional_casinos.map(c => `
        <div class="casino-row-card">
          <div class="casino-brand-col">
            <div style="height: 40px; display: flex; align-items: center;">
              <img src="${c.logo}" alt="${c.name}" style="max-height: 100%; max-width: 140px;">
            </div>
            <span style="font-size: 0.72rem; color: #00E676; font-weight: 800;">${c.badge}</span>
          </div>
          <div class="casino-bonus-col">
            <h3 style="font-size: 1.15rem; font-weight: 900; color: #FFFFFF;">${c.bonus}</h3>
            <p style="font-size: 0.82rem; color: var(--text-secondary);">${c.secondary_perk}</p>
            <span style="font-size: 0.72rem; color: var(--text-muted); margin-top: 4px;">${c.license || 'Licensed Operator'}</span>
          </div>
          <div class="casino-perks-col">
            ${c.pros.map(p => `<div><span style="color: #00E676; margin-right: 4px;">✓</span> ${p}</div>`).join('')}
          </div>
          <div style="display: flex; flex-direction: column; gap: 8px; align-items: flex-end;">
            <div class="offer-code-pill" onclick="window.copyPromoCode('${c.code}')">
              CODE: <strong>${c.code}</strong>
            </div>
            <a href="${c.affiliate_url}" target="_blank" rel="noopener" class="btn-shine btn-gold btn-md">
              CLAIM BONUS
            </a>
          </div>
        </div>
      `).join('');
    }
  }

  // Copy Promo Code
  window.copyPromoCode = function (code) {
    navigator.clipboard.writeText(code).then(() => {
      showToast(`Copied bonus code "${code}" to clipboard!`);
    }).catch(() => {
      showToast(`Use bonus code: ${code}`);
    });
  };

  // ==========================================================
  // 12. PASSWORD-PROTECTED ADMIN PANEL
  // ==========================================================
  function initAdminModal() {
    const modal = document.getElementById('admin-modal');
    const closeBtn = document.getElementById('admin-close-btn');

    if (closeBtn && modal) {
      closeBtn.addEventListener('click', () => {
        modal.classList.remove('open');
      });
    }
  }

  window.openAdminModal = function () {
    const modal = document.getElementById('admin-modal');
    if (modal) {
      modal.classList.add('open');
      renderAdminView();
    }
  };

  function renderAdminView() {
    const body = document.getElementById('admin-window-body');
    if (!body) return;

    if (!state.isAdminLoggedIn) {
      body.innerHTML = `
        <div style="max-width: 400px; margin: 40px auto; text-align: center;">
          <div style="font-size: 2.5rem; margin-bottom: 12px;">🔐</div>
          <h2 style="font-size: 1.5rem; font-weight: 900; margin-bottom: 8px;">Mashmanos Admin Login</h2>
          <p style="color: var(--text-muted); font-size: 0.85rem; margin-bottom: 24px;">Enter the administrator passcode to access stream & site controls.</p>
          <div class="form-group" style="text-align: left;">
            <label>Admin Password</label>
            <input type="password" id="admin-pass-input" class="form-input" placeholder="Enter password (default: mash123)" onkeydown="if(event.key==='Enter') window.loginAdmin()">
          </div>
          <button class="btn-shine btn-gold btn-md" style="width: 100%; margin-top: 12px;" onclick="window.loginAdmin()">
            UNLOCK DASHBOARD
          </button>
        </div>
      `;
    } else {
      renderAdminDashboard();
    }
  }

  window.loginAdmin = async function () {
    const passInput = document.getElementById('admin-pass-input');
    const pass = passInput ? passInput.value : '';

    try {
      const res = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: pass })
      });
      const data = await res.json();
      if (data.success) {
        state.isAdminLoggedIn = true;
        state.adminToken = data.token;
        localStorage.setItem('mash_admin_token', data.token);
        showToast('Admin authenticated successfully!');
        renderAdminDashboard();
      } else {
        showToast(data.error || 'Invalid password.', 'error');
      }
    } catch (e) {
      showToast('Error connecting to auth server.', 'error');
    }
  };

  function renderAdminDashboard() {
    const body = document.getElementById('admin-window-body');
    if (!body) return;

    const stream = state.stream_status || {};
    const voting = state.voting_status || {};
    const slots = state.slots || [];

    body.innerHTML = `
      <div style="display: flex; gap: 20px; border-bottom: 1px solid var(--purple-border); padding-bottom: 16px; margin-bottom: 24px; overflow-x: auto;">
        <button class="filter-chip active" onclick="window.switchAdminTab('slots')">🎰 Manage Slots</button>
        <button class="filter-chip" onclick="window.switchAdminTab('stream')">📡 Stream Status</button>
        <button class="filter-chip" onclick="window.switchAdminTab('leaderboard')">🏆 Leaderboards</button>
        <button class="filter-chip" onclick="window.switchAdminTab('hunts')">🎯 Bonus Hunts</button>
      </div>

      <div id="admin-tab-content">
        <!-- Default: Slots Management -->
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px; flex-wrap: wrap; gap: 12px;">
          <div>
            <h3 style="font-size: 1.25rem; font-weight: 900;">Slot Voting Controls</h3>
            <p style="font-size: 0.8rem; color: var(--text-muted);">Manage slots, reset votes, and control round status.</p>
          </div>
          <div style="display: flex; gap: 10px;">
            <button class="btn-shine ${voting.is_open ? 'btn-purple' : 'btn-gold'} btn-sm" onclick="window.adminToggleVoting()">
              ${voting.is_open ? 'PAUSE VOTING' : 'OPEN VOTING'}
            </button>
            <button class="btn-shine btn-secondary btn-sm" style="color: #F87171; border-color: rgba(239, 68, 68, 0.4);" onclick="window.adminResetAllVotes()">
              RESET ALL VOTES
            </button>
          </div>
        </div>

        <!-- Add Slot Form -->
        <div style="background: rgba(26, 16, 51, 0.6); border: 1px solid var(--purple-border); border-radius: var(--radius-md); padding: 18px; margin-bottom: 24px;">
          <h4 style="font-size: 0.95rem; font-weight: 800; margin-bottom: 12px; color: var(--gold-light);">Add New Slot to Catalogue</h4>
          <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px;">
            <div class="form-group">
              <label>Slot Title</label>
              <input type="text" id="admin-new-name" class="form-input" placeholder="e.g. Gates of Olympus 1000">
            </div>
            <div class="form-group">
              <label>Provider</label>
              <input type="text" id="admin-new-provider" class="form-input" placeholder="e.g. Pragmatic Play">
            </div>
            <div class="form-group">
              <label>Initial Votes</label>
              <input type="number" id="admin-new-votes" class="form-input" value="0">
            </div>
          </div>
          <button class="btn-shine btn-gold btn-sm" style="margin-top: 8px;" onclick="window.adminAddSlot()">
            + ADD SLOT
          </button>
        </div>

        <!-- Current Slots Table -->
        <div class="table-responsive">
          <table class="lb-table">
            <thead>
              <tr>
                <th>Artwork</th>
                <th>Name</th>
                <th>Provider</th>
                <th>Votes</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              ${slots.map(s => `
                <tr>
                  <td><img src="${s.image}" style="width: 48px; height: 30px; object-fit: cover; border-radius: 4px;"></td>
                  <td><strong>${s.name}</strong></td>
                  <td style="color: var(--gold-primary); font-size: 0.8rem;">${s.provider}</td>
                  <td style="font-family: monospace; font-weight: 700;">${s.votes}</td>
                  <td>
                    <button class="btn-shine btn-secondary btn-sm" onclick="window.adminResetOneSlot('${s.id}')">Reset</button>
                    <button class="btn-shine btn-secondary btn-sm" style="color: #F87171;" onclick="window.adminDeleteSlot('${s.id}')">Delete</button>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;
  }

  window.switchAdminTab = function (tab) {
    const container = document.getElementById('admin-tab-content');
    if (!container) return;

    if (tab === 'slots') {
      renderAdminDashboard();
    } else if (tab === 'stream') {
      const stream = state.stream_status || {};
      container.innerHTML = `
        <h3 style="font-size: 1.25rem; font-weight: 900; margin-bottom: 16px;">Live Stream Controls</h3>
        <div style="background: rgba(26,16,51,0.6); border: 1px solid var(--purple-border); border-radius: var(--radius-md); padding: 20px;">
          <div class="form-group">
            <label>Live Status</label>
            <select id="admin-stream-live" class="form-input">
              <option value="true" ${stream.is_live ? 'selected' : ''}>● LIVE NOW (Red Badge + Thumbnail)</option>
              <option value="false" ${!stream.is_live ? 'selected' : ''}>OFFLINE (Next Stream Schedule)</option>
            </select>
          </div>
          <div class="form-group">
            <label>Stream Title</label>
            <input type="text" id="admin-stream-title" class="form-input" value="${stream.title || ''}">
          </div>
          <div class="form-group">
            <label>Viewer Count</label>
            <input type="number" id="admin-stream-viewers" class="form-input" value="${stream.viewers || 1500}">
          </div>
          <div class="form-group">
            <label>Next Stream Message</label>
            <input type="text" id="admin-stream-next" class="form-input" value="${stream.next_stream || ''}">
          </div>
          <button class="btn-shine btn-gold btn-md" onclick="window.adminSaveStream()">
            SAVE STREAM SETTINGS
          </button>
        </div>
      `;
    } else if (tab === 'leaderboard') {
      const lb = state.leaderboards?.shuffle || {};
      container.innerHTML = `
        <h3 style="font-size: 1.25rem; font-weight: 900; margin-bottom: 16px;">Leaderboard Settings</h3>
        <div style="background: rgba(26,16,51,0.6); border: 1px solid var(--purple-border); border-radius: var(--radius-md); padding: 20px;">
          <div class="form-group">
            <label>Prize Pool Text</label>
            <input type="text" id="admin-lb-pool" class="form-input" value="${lb.prize_pool || '$500 USD'}">
          </div>
          <div class="form-group">
            <label>Days Left</label>
            <input type="number" id="admin-lb-days" class="form-input" value="${lb.ends_in_days || 5}">
          </div>
          <button class="btn-shine btn-gold btn-md" onclick="window.adminSaveLeaderboard()">
            UPDATE LEADERBOARD
          </button>
        </div>
      `;
    } else if (tab === 'hunts') {
      container.innerHTML = `
        <h3 style="font-size: 1.25rem; font-weight: 900; margin-bottom: 16px;">Add Bonus Hunt Record</h3>
        <div style="background: rgba(26,16,51,0.6); border: 1px solid var(--purple-border); border-radius: var(--radius-md); padding: 20px;">
          <div class="form-group">
            <label>Hunt Title</label>
            <input type="text" id="admin-hunt-title" class="form-input" placeholder="e.g. Stream #43: High Stakes Hunt">
          </div>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
            <div class="form-group">
              <label>Start Cost ($)</label>
              <input type="number" id="admin-hunt-cost" class="form-input" value="2000">
            </div>
            <div class="form-group">
              <label>Total Win / Cashout ($)</label>
              <input type="number" id="admin-hunt-win" class="form-input" value="3400">
            </div>
          </div>
          <div class="form-group">
            <label>Best Single Win</label>
            <input type="text" id="admin-hunt-best" class="form-input" placeholder="e.g. Wanted Dead or a Wild — $2,100">
          </div>
          <button class="btn-shine btn-gold btn-md" onclick="window.adminAddHunt()">
            ADD HUNT TO ARCHIVE
          </button>
        </div>
      `;
    }
  };

  // Admin Actions
  window.adminToggleVoting = async function () {
    const res = await fetch('/api/admin/slots', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${state.adminToken}`
      },
      body: JSON.stringify({ action: 'toggle_voting' })
    });
    const d = await res.json();
    if (d.success) {
      showToast(d.message);
      fetchState(false);
      renderAdminDashboard();
    }
  };

  window.adminResetAllVotes = async function () {
    if (!confirm('⚠️ Are you sure you want to RESET ALL VOTES? This cannot be undone.')) return;
    const res = await fetch('/api/admin/slots', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${state.adminToken}`
      },
      body: JSON.stringify({ action: 'reset_all' })
    });
    const d = await res.json();
    if (d.success) {
      showToast(d.message);
      fetchState(false);
      renderAdminDashboard();
    }
  };

  window.adminResetOneSlot = async function (slotId) {
    const res = await fetch('/api/admin/slots', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${state.adminToken}`
      },
      body: JSON.stringify({ action: 'reset_one', slot_id: slotId })
    });
    const d = await res.json();
    if (d.success) {
      showToast(d.message);
      fetchState(false);
      renderAdminDashboard();
    }
  };

  window.adminDeleteSlot = async function (slotId) {
    if (!confirm('Remove this slot from the voting grid?')) return;
    const res = await fetch('/api/admin/slots', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${state.adminToken}`
      },
      body: JSON.stringify({ action: 'delete', slot_id: slotId })
    });
    const d = await res.json();
    if (d.success) {
      showToast(d.message);
      fetchState(false);
      renderAdminDashboard();
    }
  };

  window.adminAddSlot = async function () {
    const name = document.getElementById('admin-new-name')?.value;
    const provider = document.getElementById('admin-new-provider')?.value;
    const votes = document.getElementById('admin-new-votes')?.value;

    if (!name || !provider) {
      showToast('Please provide slot title and provider.', 'warning');
      return;
    }

    const res = await fetch('/api/admin/slots', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${state.adminToken}`
      },
      body: JSON.stringify({
        action: 'add',
        name,
        provider,
        votes: parseInt(votes) || 0,
        image: '/images/gates_of_olympus.svg'
      })
    });
    const d = await res.json();
    if (d.success) {
      showToast('Slot added successfully!');
      fetchState(false);
      renderAdminDashboard();
    }
  };

  window.adminSaveStream = async function () {
    const is_live = document.getElementById('admin-stream-live').value === 'true';
    const title = document.getElementById('admin-stream-title').value;
    const viewers = parseInt(document.getElementById('admin-stream-viewers').value) || 0;
    const next_stream = document.getElementById('admin-stream-next').value;

    const res = await fetch('/api/admin/stream', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${state.adminToken}`
      },
      body: JSON.stringify({ is_live, title, viewers, next_stream })
    });
    const d = await res.json();
    if (d.success) {
      showToast('Stream settings updated!');
      fetchState(false);
    }
  };

  window.adminSaveLeaderboard = async function () {
    const prize_pool = document.getElementById('admin-lb-pool').value;
    const ends_in_days = parseInt(document.getElementById('admin-lb-days').value) || 5;

    const res = await fetch('/api/admin/leaderboard', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${state.adminToken}`
      },
      body: JSON.stringify({ sponsor: state.activeLbSponsor, prize_pool, ends_in_days })
    });
    const d = await res.json();
    if (d.success) {
      showToast('Leaderboard settings saved!');
      fetchState(false);
    }
  };

  window.adminAddHunt = async function () {
    const title = document.getElementById('admin-hunt-title').value;
    const start_cost = parseFloat(document.getElementById('admin-hunt-cost').value);
    const total_win = parseFloat(document.getElementById('admin-hunt-win').value);
    const best_win = document.getElementById('admin-hunt-best').value;

    if (!title) {
      showToast('Please provide a title.', 'warning');
      return;
    }

    const res = await fetch('/api/admin/bonushunts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${state.adminToken}`
      },
      body: JSON.stringify({ action: 'add', title, start_cost, total_win, best_win })
    });
    const d = await res.json();
    if (d.success) {
      showToast('Bonus hunt recorded in archive!');
      fetchState(false);
    }
  };

  // ==========================================================
  // 13. TOAST NOTIFICATIONS & CONFETTI
  // ==========================================================
  function showToast(message, type = 'success') {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `
      <span>${type === 'warning' ? '⚠️' : type === 'error' ? '❌' : '✨'}</span>
      <span>${message}</span>
    `;

    container.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      toast.style.transition = 'opacity 0.3s, transform 0.3s';
      setTimeout(() => toast.remove(), 300);
    }, 3500);
  }

  function triggerConfetti() {
    // Lightweight inline gold particle burst
    const count = 35;
    for (let i = 0; i < count; i++) {
      const bit = document.createElement('div');
      bit.style.position = 'fixed';
      bit.style.top = '50%';
      bit.style.left = '50%';
      bit.style.width = `${Math.random() * 8 + 4}px`;
      bit.style.height = `${Math.random() * 8 + 4}px`;
      bit.style.backgroundColor = Math.random() > 0.5 ? '#F5C542' : '#FFE08A';
      bit.style.borderRadius = Math.random() > 0.5 ? '50%' : '2px';
      bit.style.zIndex = '9999999';
      bit.style.pointerEvents = 'none';

      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 200 + 100;
      const vx = Math.cos(angle) * speed;
      const vy = Math.sin(angle) * speed;

      document.body.appendChild(bit);

      bit.animate([
        { transform: 'translate(0, 0) rotate(0deg) scale(1)', opacity: 1 },
        { transform: `translate(${vx}px, ${vy}px) rotate(${Math.random() * 720}deg) scale(0)`, opacity: 0 }
      ], {
        duration: 800 + Math.random() * 400,
        easing: 'cubic-bezier(0.16, 1, 0.3, 1)'
      }).onfinish = () => bit.remove();
    }
  }

  // Accordion toggle helper
  window.toggleAccordion = function (header) {
    const item = header.closest('.accordion-item');
    if (item) {
      item.classList.toggle('open');
    }
  };

})();
