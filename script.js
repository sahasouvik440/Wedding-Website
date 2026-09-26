/**
 * ELEANOR & ALEXANDER WEDDING CELEBRATION
 * Interactive JavaScript:
 * - Rose Petals Cascading Particle Animation (White & Burgundy Petals)
 * - Modal Managers (RSVP, Map, Search)
 * - Image Lightbox Viewer
 * - Web Audio API Romantic Ambient Chords Toggle
 * - Search Functionality
 */

document.addEventListener('DOMContentLoaded', () => {
  initPetalAnimation();
  initModals();
  initLightbox();
  initSearch();
  initMobileNav();
  initAmbientAudio();
  initCountdown();
  initScrollAnimations();
  initScratchCard();
  initWeddingMomentsGallery();
  initFamilyPuzzle();
  initScrlaScrollAnimation();
});


/* ==========================================================================
   ROSE PETALS CASCADING CANVAS ANIMATION
   ========================================================================== */
function initPetalAnimation() {
  const canvas = document.getElementById('petals-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const petalCount = 45; // Balanced count for elegance and performance
  const petals = [];

  // Color palettes for white and burgundy petals
  const petalColors = [
    { fill: 'rgba(255, 250, 250, 0.75)', stroke: 'rgba(235, 220, 220, 0.4)', type: 'white' },
    { fill: 'rgba(255, 245, 245, 0.85)', stroke: 'rgba(240, 210, 215, 0.5)', type: 'ivory' },
    { fill: 'rgba(110, 18, 37, 0.65)',   stroke: 'rgba(74, 10, 24, 0.7)',   type: 'burgundy' },
    { fill: 'rgba(142, 28, 51, 0.7)',    stroke: 'rgba(88, 11, 24, 0.8)',   type: 'deep-rose' },
    { fill: 'rgba(77, 10, 24, 0.6)',     stroke: 'rgba(45, 5, 11, 0.8)',    type: 'velvet-wine' }
  ];

  class Petal {
    constructor() {
      this.reset(true);
    }

    reset(initial = false) {
      this.x = Math.random() * width;
      this.y = initial ? Math.random() * height : -30;
      this.size = Math.random() * 12 + 10;
      this.speedY = Math.random() * 1.2 + 0.8;
      this.speedX = Math.sin(Math.random() * 2) * 0.8;
      this.rotation = Math.random() * Math.PI * 2;
      this.rotationSpeed = (Math.random() - 0.5) * 0.025;
      this.sway = Math.random() * 2 + 1;
      this.swaySpeed = Math.random() * 0.02 + 0.01;
      this.swayAngle = Math.random() * Math.PI * 2;
      this.opacity = Math.random() * 0.35 + 0.55;
      this.color = petalColors[Math.floor(Math.random() * petalColors.length)];
      this.flip = Math.random() * Math.PI;
      this.flipSpeed = Math.random() * 0.03 + 0.01;
    }

    update() {
      this.swayAngle += this.swaySpeed;
      this.flip += this.flipSpeed;
      this.x += Math.sin(this.swayAngle) * this.sway + this.speedX;
      this.y += this.speedY;
      this.rotation += this.rotationSpeed;

      if (this.y > height + 40 || this.x < -40 || this.x > width + 40) {
        this.reset();
      }
    }

    draw() {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate(this.rotation);
      ctx.scale(Math.cos(this.flip), 1);
      ctx.globalAlpha = this.opacity;

      ctx.beginPath();
      // Draw organic curved rose petal path
      ctx.moveTo(0, -this.size);
      ctx.bezierCurveTo(this.size * 0.9, -this.size * 0.6, this.size * 0.8, this.size * 0.6, 0, this.size);
      ctx.bezierCurveTo(-this.size * 0.8, this.size * 0.6, -this.size * 0.9, -this.size * 0.6, 0, -this.size);
      ctx.closePath();

      ctx.fillStyle = this.color.fill;
      ctx.fill();

      ctx.strokeStyle = this.color.stroke;
      ctx.lineWidth = 0.6;
      ctx.stroke();

      ctx.restore();
    }
  }

  for (let i = 0; i < petalCount; i++) {
    petals.push(new Petal());
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);
    for (const petal of petals) {
      petal.update();
      petal.draw();
    }
    requestAnimationFrame(animate);
  }

  animate();
}

/* ==========================================================================
   MODAL CONTROLLER (RSVP & MAP)
   ========================================================================== */
function initModals() {
  const rsvpModal = document.getElementById('rsvp-modal');
  const mapModal = document.getElementById('map-modal');
  
  const rsvpBtn = document.getElementById('btn-rsvp-action');
  const navRsvpBtn = document.getElementById('link-rsvp');
  const rsvpCloseBtn = document.getElementById('rsvp-close-btn');
  
  const mapBtn = document.getElementById('btn-view-map');
  const mapCloseBtn = document.getElementById('map-close-btn');

  function openModal(modal) {
    if (!modal) return;
    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeModal(modal) {
    if (!modal) return;
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  if (rsvpBtn) rsvpBtn.addEventListener('click', () => openModal(rsvpModal));
  if (navRsvpBtn) navRsvpBtn.addEventListener('click', (e) => {
    e.preventDefault();
    const dropdown = document.getElementById('ambience-dropdown');
    if (dropdown) {
      dropdown.classList.toggle('open');
    }
  });

  // Close ambience dropdown when clicking outside
  document.addEventListener('click', (e) => {
    const dropdown = document.getElementById('ambience-dropdown');
    if (dropdown && (!navRsvpBtn || !navRsvpBtn.contains(e.target)) && !dropdown.contains(e.target)) {
      dropdown.classList.remove('open');
    }
  });

  // Music ON/OFF buttons in ambience dropdown
  const musicOnBtn = document.getElementById('ambience-music-on');
  const musicOffBtn = document.getElementById('ambience-music-off');
  const bgMusicEl = document.getElementById('bg-music');

  if (musicOnBtn) {
    musicOnBtn.addEventListener('click', () => {
      if (bgMusicEl) {
        bgMusicEl.volume = 0.3;
        bgMusicEl.play().catch(() => {});
      }
      musicOnBtn.classList.add('active');
      if (musicOffBtn) musicOffBtn.classList.remove('active');
      const dropdown = document.getElementById('ambience-dropdown');
      if (dropdown) dropdown.classList.remove('open');
    });
  }

  if (musicOffBtn) {
    musicOffBtn.addEventListener('click', () => {
      if (bgMusicEl) {
        bgMusicEl.pause();
      }
      musicOffBtn.classList.add('active');
      if (musicOnBtn) musicOnBtn.classList.remove('active');
      const dropdown = document.getElementById('ambience-dropdown');
      if (dropdown) dropdown.classList.remove('open');
    });
  }
  if (rsvpCloseBtn) rsvpCloseBtn.addEventListener('click', () => closeModal(rsvpModal));

  if (mapBtn) mapBtn.addEventListener('click', () => openModal(mapModal));
  if (mapCloseBtn) mapCloseBtn.addEventListener('click', () => closeModal(mapModal));

  // Backdrop click to close
  [rsvpModal, mapModal].forEach(modal => {
    if (!modal) return;
    const backdrop = modal.querySelector('.modal-backdrop');
    if (backdrop) backdrop.addEventListener('click', () => closeModal(modal));
  });

  // RSVP Form submission handler
  const rsvpForm = document.getElementById('rsvp-form');
  const successMsg = document.getElementById('rsvp-success-msg');
  if (rsvpForm) {
    rsvpForm.addEventListener('submit', (e) => {
      e.preventDefault();
      rsvpForm.style.display = 'none';
      if (successMsg) successMsg.style.display = 'block';
    });
  }
}

/* ==========================================================================
   IMAGE LIGHTBOX
   ========================================================================== */
function initLightbox() {
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxTitle = document.getElementById('lightbox-title');
  const closeBtn = document.getElementById('lightbox-close');
  const backdrop = lightbox ? lightbox.querySelector('.lightbox-backdrop') : null;

  if (!lightbox || !lightboxImg) return;

  const triggerElements = document.querySelectorAll('[data-lightbox]');
  triggerElements.forEach(item => {
    item.addEventListener('click', (e) => {
      const src = item.getAttribute('data-lightbox');
      const title = item.getAttribute('data-title') || '';
      if (src) {
        lightboxImg.src = src;
        lightboxImg.alt = title;
        lightboxTitle.textContent = title;
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
    });
  });

  function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
  if (backdrop) backdrop.addEventListener('click', closeLightbox);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightbox.classList.contains('active')) {
      closeLightbox();
    }
  });
}

/* ==========================================================================
   SEARCH SYSTEM
   ========================================================================== */
function initSearch() {
  const searchBtn = document.getElementById('btn-search');
  const searchModal = document.getElementById('search-modal');
  const closeBtn = document.getElementById('search-close-btn');
  const input = document.getElementById('wedding-search-input');
  const resultsBox = document.getElementById('search-results-box');
  const chips = document.querySelectorAll('.search-chip');

  if (!searchBtn || !searchModal) return;

  const weddingKnowledge = [
    { title: 'The Date & Schedule', section: '#rsvp', desc: 'October 14 • Ceremony starts at 4:30 PM EST' },
    { title: 'The Venue', section: '#rsvp', desc: 'City Opera House, 100 Symphony Way' },
    { title: 'Guest Capacity', section: '#rsvp', desc: '150 Guests — Black-Tie formal gala' },
    { title: 'Our Love Story', section: '#story', desc: 'Souvik and Tanusree’s romance & opera journey' },
    { title: 'Wedding Rings & Details', section: '#story', desc: 'Solitaire diamond ring, gold bands, burgundy roses & velvet shoes' },
    { title: 'Gift Registry', section: '#registry', desc: 'Florence Honeymoon, Art & Home Couture, Philanthropy Fund' },
    { title: 'Photo Gallery', section: '#gallery', desc: 'The Kiss, The Dance, The Reception dinner' },
    { title: 'Contact Coordinator', section: '#main-header', desc: 'Contact: 9874785443 for concierge & travel queries' }
  ];

  function openSearch() {
    searchModal.classList.add('active');
    if (input) {
      input.value = '';
      resultsBox.innerHTML = '';
      setTimeout(() => input.focus(), 150);
    }
  }

  function closeSearch() {
    searchModal.classList.remove('active');
  }

  searchBtn.addEventListener('click', openSearch);
  if (closeBtn) closeBtn.addEventListener('click', closeSearch);

  const backdrop = searchModal.querySelector('.modal-backdrop');
  if (backdrop) backdrop.addEventListener('click', closeSearch);

  function performSearch(query) {
    if (!resultsBox) return;
    const q = query.toLowerCase().trim();
    if (!q) {
      resultsBox.innerHTML = '';
      return;
    }

    const matches = weddingKnowledge.filter(item => 
      item.title.toLowerCase().includes(q) || item.desc.toLowerCase().includes(q)
    );

    if (matches.length === 0) {
      resultsBox.innerHTML = '<p style="padding:10px; color:#888;">No details matching "'+ query +'" found.</p>';
      return;
    }

    resultsBox.innerHTML = matches.map(item => `
      <div class="search-result-item" onclick="document.getElementById('search-modal').classList.remove('active'); document.querySelector('${item.section}').scrollIntoView({behavior:'smooth'});">
        <strong>${item.title}</strong>
        <p style="font-size:0.8rem; color:#666; margin-top:2px;">${item.desc}</p>
      </div>
    `).join('');
  }

  if (input) {
    input.addEventListener('input', (e) => performSearch(e.target.value));
  }

  chips.forEach(chip => {
    chip.addEventListener('click', () => {
      const term = chip.getAttribute('data-search');
      if (input) {
        input.value = term;
        performSearch(term);
      }
    });
  });
}

/* ==========================================================================
   MOBILE NAV TOGGLE
   ========================================================================== */
function initMobileNav() {
  const toggle = document.getElementById('mobile-toggle');
  const drawer = document.getElementById('mobile-drawer');

  if (!toggle || !drawer) return;

  toggle.addEventListener('click', () => {
    drawer.classList.toggle('open');
  });

  const links = drawer.querySelectorAll('.mobile-link');
  links.forEach(link => {
    link.addEventListener('click', () => {
      drawer.classList.remove('open');
    });
  });
}

/* ==========================================================================
   BACKGROUND MUSIC PLAYER
   ========================================================================== */
function initAmbientAudio() {
  const audio = document.getElementById('bg-music');
  const btn = document.getElementById('music-toggle-btn');
  if (!audio || !btn) return;

  let isPlaying = false;

  function toggleMusic() {
    if (audio.paused) {
      audio.play().then(() => {
        isPlaying = true;
        btn.classList.add('is-playing');
      }).catch(err => {
        console.warn('Playback prevented:', err);
      });
    } else {
      audio.pause();
      isPlaying = false;
      btn.classList.remove('is-playing');
    }
  }

  btn.addEventListener('click', toggleMusic);

  // Auto-play on first user interaction (browser policy compliant)
  const startOnFirstGesture = () => {
    if (audio.paused && !isPlaying) {
      audio.play().then(() => {
        isPlaying = true;
        btn.classList.add('is-playing');
      }).catch(() => {});
    }
    window.removeEventListener('click', startOnFirstGesture);
    window.removeEventListener('touchstart', startOnFirstGesture);
  };
  window.addEventListener('click', startOnFirstGesture, { once: true });
  window.addEventListener('touchstart', startOnFirstGesture, { once: true });
}

/* ==========================================================================
   COUNTDOWN TIMER
   ========================================================================== */
function initCountdown() {
  const cdDays = document.getElementById('cd-days');
  const cdHours = document.getElementById('cd-hours');
  const cdMinutes = document.getElementById('cd-minutes');
  const cdSeconds = document.getElementById('cd-seconds');
  
  if (!cdDays || !cdHours || !cdMinutes || !cdSeconds) return;

  // Target date: December 13, 2026
  const targetDate = new Date("December 13, 2026 00:00:00").getTime();

  function updateTimer() {
    const now = new Date().getTime();
    const distance = targetDate - now;

    if (distance <= 0) {
      cdDays.textContent = "00";
      cdHours.textContent = "00";
      cdMinutes.textContent = "00";
      cdSeconds.textContent = "00";
      return;
    }
    
    const d = Math.floor(distance / (1000 * 60 * 60 * 24));
    const h = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const m = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const s = Math.floor((distance % (1000 * 60)) / 1000);
    
    cdDays.textContent = d.toString().padStart(2, '0');
    cdHours.textContent = h.toString().padStart(2, '0');
    cdMinutes.textContent = m.toString().padStart(2, '0');
    cdSeconds.textContent = s.toString().padStart(2, '0');
  }

  updateTimer(); // Initial call to avoid 1-second delay
  setInterval(updateTimer, 1000);
}


/* ==========================================================================
   SCROLL ANIMATIONS (INTERSECTION OBSERVER)
   ========================================================================== */
function initScrollAnimations() {
  const scrollElements = document.querySelectorAll('.fade-in-scroll');
  
  if (scrollElements.length === 0) return;

  const elementInView = (el, dividend = 1) => {
    const elementTop = el.getBoundingClientRect().top;
    return (elementTop <= (window.innerHeight || document.documentElement.clientHeight) / dividend);
  };

  const displayScrollElement = (element) => {
    element.classList.add('is-visible');
  };

  const hideScrollElement = (element) => {
    element.classList.remove('is-visible');
  };

  const handleScrollAnimation = () => {
    scrollElements.forEach((el) => {
      if (elementInView(el, 1.1)) {
        displayScrollElement(el);
      } else {
        hideScrollElement(el);
      }
    });
  }

  // Initial check on load
  handleScrollAnimation();
  
  // Check on scroll
  window.addEventListener('scroll', () => {
    handleScrollAnimation();
  });
}

// Background Music Toggle
document.addEventListener('DOMContentLoaded', () => {
  const bgMusic = document.getElementById('bg-music');
  const musicToggleBtn = document.getElementById('music-toggle-btn');
  const musicIcon = musicToggleBtn.querySelector('i');
  
  if (bgMusic && musicToggleBtn) {
    // Start with volume at 30% for soft background effect
    bgMusic.volume = 0.3;

    musicToggleBtn.addEventListener('click', () => {
      if (bgMusic.paused) {
        bgMusic.play().then(() => {
          musicToggleBtn.classList.add('playing');
          // Change icon to pause or volume-high? Volume-up is nice
          musicIcon.classList.remove('fa-music');
          musicIcon.classList.add('fa-volume-up');
        }).catch((err) => {
          console.error('Audio playback failed:', err);
        });
      } else {
        bgMusic.pause();
        musicToggleBtn.classList.remove('playing');
        // Revert icon
        musicIcon.classList.remove('fa-volume-up');
        musicIcon.classList.add('fa-music');
      }
    });
  }
});



/* ==========================================================================
   SCRATCH CARD - Pink Spray Paint Reveal for Countdown Timer
   ========================================================================== */
function initScratchCard() {
  const canvas  = document.getElementById('scratch-canvas');
  const wrap    = document.getElementById('countdown-wrap');
  const hint    = document.getElementById('scratch-hint');
  if (!canvas || !wrap) return;

  const ctx = canvas.getContext('2d');
  let isScratching = false;
  let scratchedPixels = 0;
  let totalPixels = 0;
  let revealed = false;

  function resizeCanvas() {
    const rect = wrap.getBoundingClientRect();
    canvas.width  = rect.width;
    canvas.height = rect.height;
    drawSprayPaint();
  }

  function drawSprayPaint() {
    const w = canvas.width;
    const h = canvas.height;

    // Base golden coat
    const grad = ctx.createLinearGradient(0, 0, w, h);
    grad.addColorStop(0,   '#c8a020');
    grad.addColorStop(0.3, '#e8c040');
    grad.addColorStop(0.6, '#d4a017');
    grad.addColorStop(1,   '#b8860b');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);

    // Spray paint splatter dots for texture
    for (let i = 0; i < 3000; i++) {
      const x = Math.random() * w;
      const y = Math.random() * h;
      const r = Math.random() * 4 + 0.5;
      const alpha = Math.random() * 0.5 + 0.1;
      const g = Math.floor(Math.random() * 60 + 140);
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${Math.floor(Math.random()*40+190)}, ${g}, 0, ${alpha})`;
      ctx.fill();
    }

    // Gold shimmer highlights
    for (let i = 0; i < 600; i++) {
      const x = Math.random() * w;
      const y = Math.random() * h;
      ctx.beginPath();
      ctx.arc(x, y, Math.random() * 2, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255,230,100,${Math.random() * 0.6})`;
      ctx.fill();
    }

    totalPixels = w * h;
  }

  function hideHint() {
    if (hint && !hint.classList.contains('hidden')) {
      hint.classList.add('hidden');
    }
  }

  function scratch(x, y) {
    hideHint();
    ctx.globalCompositeOperation = 'destination-out';
    // Eraser brush - spray effect (2x size)
    for (let i = 0; i < 20; i++) {
      const angle  = Math.random() * Math.PI * 2;
      const radius = Math.random() * 44;
      const ex = x + radius * Math.cos(angle);
      const ey = y + radius * Math.sin(angle);
      ctx.beginPath();
      ctx.arc(ex, ey, Math.random() * 20 + 12, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(0,0,0,${Math.random() * 0.8 + 0.2})`;
      ctx.fill();
    }
    ctx.globalCompositeOperation = 'source-over';

    // Check reveal progress every 30 scratches
    if (!revealed) checkReveal();
  }

  let checkCount = 0;
  function checkReveal() {
    checkCount++;
    if (checkCount % 30 !== 0) return;
    const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
    let transparent = 0;
    for (let i = 3; i < data.length; i += 4) {
      if (data[i] < 10) transparent++;
    }
    const pct = (transparent / (canvas.width * canvas.height)) * 100;
    if (pct > 55) autoReveal();
  }

  function autoReveal() {
    revealed = true;
    canvas.classList.add('revealed');
    hideHint();
  }

  function getPos(e) {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width  / rect.width;
    const scaleY = canvas.height / rect.height;
    if (e.touches) {
      return {
        x: (e.touches[0].clientX - rect.left) * scaleX,
        y: (e.touches[0].clientY - rect.top)  * scaleY
      };
    }
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top)  * scaleY
    };
  }

  canvas.addEventListener('mousedown',  (e) => { isScratching = true; hideHint(); scratch(...Object.values(getPos(e))); });
  canvas.addEventListener('mousemove',  (e) => { if (isScratching) scratch(...Object.values(getPos(e))); });
  canvas.addEventListener('mouseup',    ()  => { isScratching = false; });
  canvas.addEventListener('mouseleave', ()  => { isScratching = false; });
  canvas.addEventListener('touchstart', (e) => { e.preventDefault(); isScratching = true; hideHint(); scratch(...Object.values(getPos(e))); }, { passive: false });
  canvas.addEventListener('touchmove',  (e) => { e.preventDefault(); if (isScratching) scratch(...Object.values(getPos(e))); }, { passive: false });
  canvas.addEventListener('touchend',   ()  => { isScratching = false; });

  if (hint) {
    hint.addEventListener('click', hideHint);
    hint.addEventListener('touchstart', hideHint, { passive: true });
  }

  // Init after layout
  setTimeout(resizeCanvas, 300);
  window.addEventListener('resize', resizeCanvas);
}

/* ==========================================================================
   3D WEDDING MOMENTS COVERFLOW GALLERY (LUXURY BURGUNDY CAROUSEL)
   ========================================================================== */
function initWeddingMomentsGallery() {
  const wrapper = document.getElementById('moments-swiper-wrapper');
  const swiperEl = document.getElementById('moments-swiper');
  if (!wrapper || !swiperEl) return;

  const totalPhotos = 56;
  const captions = [
    "Royal Grandeur • The Grand Opera",
    "Golden Chandelier • Luminous Love",
    "The Royal Walk • Steps of Devotion",
    "Symphony of Hearts • First Waltz",
    "Couture Velvet • Burgundy Romance",
    "Sacred Promise • Eyes of Devotion",
    "Candelabra Radiance • Feast of Joy",
    "Timeless Majesty • Souvik & Tanusree",
    "A Stolen Gaze • Whispers of Eternity",
    "Enchanted Ballroom • Divine Grace",
    "Gilded Memories • Unbreakable Bond",
    "The Golden Staircase • Ascending Together",
    "Velvet & Roses • Petals of Passion",
    "In Your Arms • Safe & Beloved",
    "Chandelier Dreams • An Opera Romance",
    "Crowned in Joy • Our Sacred Chapter"
  ];

  // Dynamically populate all 56 wedding photos
  let slidesHTML = '';
  for (let i = 1; i <= totalPhotos; i++) {
    const numStr = String(i).padStart(2, '0');
    const photoSrc = `assets/gallery_album/photo_${numStr}.jpg`;
    const captionText = captions[(i - 1) % captions.length];
    const slideTitle = `Souvik & Tanusree • Moment ${numStr}`;

    slidesHTML += `
      <div class="swiper-slide" data-slide-index="${i - 1}">
        <div class="moment-premium-card" data-lightbox="${photoSrc}" data-title="${slideTitle} - ${captionText}">
          <img src="${photoSrc}" alt="${slideTitle}" class="moment-img" loading="${i <= 4 ? 'eager' : 'lazy'}">
          <div class="moment-card-gradient"></div>
          <div class="moment-card-border-glow"></div>
          <div class="moment-corner-tl"></div>
          <div class="moment-corner-br"></div>
          <div class="moment-card-caption">
            <span class="moment-caption-tag">SOUVIK &amp; TANUSREE</span>
            <h3 class="moment-caption-title">${captionText}</h3>
          </div>
          <div class="moment-zoom-badge" aria-label="Enlarge Photo">
            <i class="fa-solid fa-expand"></i>
          </div>
        </div>
      </div>
    `;
  }
  wrapper.innerHTML = slidesHTML;

  // Initialize Swiper 3D Coverflow
  if (typeof Swiper === 'undefined') {
    console.warn('Swiper library not loaded yet');
    return;
  }

  const momentsSwiper = new Swiper('#moments-swiper', {
    effect: 'coverflow',
    grabCursor: true,
    centeredSlides: true,
    slidesPerView: 'auto',
    initialSlide: 2,
    slideToClickedSlide: true,
    speed: 750,
    coverflowEffect: {
      rotate: 20,
      stretch: 0,
      depth: 250,
      modifier: 1,
      slideShadows: true,
    },
    keyboard: {
      enabled: true,
      onlyInViewport: true,
    },
    navigation: {
      nextEl: '#moments-next',
      prevEl: '#moments-prev',
    },
    autoplay: {
      delay: 3600,
      disableOnInteraction: false,
      pauseOnMouseEnter: true,
    },
    on: {
      init: function () {
        updateGalleryCounter(this.activeIndex + 1);
      },
      slideChange: function () {
        updateGalleryCounter(this.activeIndex + 1);
      }
    }
  });

  function updateGalleryCounter(current) {
    const currentIdxEl = document.getElementById('moments-current-idx');
    if (currentIdxEl) {
      currentIdxEl.textContent = String(current).padStart(2, '0');
    }
  }

  // Connect to Lightbox
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxTitle = document.getElementById('lightbox-title');

  swiperEl.addEventListener('click', (e) => {
    const card = e.target.closest('.moment-premium-card');
    if (!card) return;

    const slide = card.closest('.swiper-slide');
    const isZoomBadge = e.target.closest('.moment-zoom-badge');
    const isActiveSlide = slide && slide.classList.contains('swiper-slide-active');

    // If active slide or clicked directly on expand badge, open full lightbox
    if (isActiveSlide || isZoomBadge) {
      const src = card.getAttribute('data-lightbox');
      const title = card.getAttribute('data-title') || 'Souvik & Tanusree Wedding Celebration';
      if (src && lightbox && lightboxImg) {
        lightboxImg.src = src;
        lightboxImg.alt = title;
        if (lightboxTitle) lightboxTitle.textContent = title;
        lightbox.classList.add('active');
        lightbox.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
      }
    }
  });
}

/* ==========================================================================
   FAMILY LOVE PUZZLE - ONLY PUZZLE PIECES TO SOLVE
   ========================================================================== */
function initFamilyPuzzle() {
  const puzzleSection = document.getElementById('puzzle');
  if (!puzzleSection) return;

  const board = document.getElementById('puzzle-board');
  const tray = document.getElementById('puzzle-scatter-tray');
  const pieces = Array.from(puzzleSection.querySelectorAll('.puzzle-piece'));
  const slots = Array.from(puzzleSection.querySelectorAll('.puzzle-slot'));

  let placedCount = 0;
  const initialRotations = [-6, 5, -5];
  const initialOffsets = [
    { x: -8, y: -4 },
    { x: 6, y: 4 },
    { x: -5, y: -3 }
  ];

  function scatterPieces(isReset = false) {
    pieces.forEach((piece, idx) => {
      if (piece.parentElement !== tray) {
        tray.appendChild(piece);
      }
      piece.classList.remove('is-placed', 'is-dragging');
      piece.removeAttribute('style');

      const rot = isReset ? (Math.random() * 14 - 7).toFixed(1) : initialRotations[idx];
      const ox = isReset ? (Math.random() * 12 - 6).toFixed(1) : initialOffsets[idx].x;
      const oy = isReset ? (Math.random() * 8 - 4).toFixed(1) : initialOffsets[idx].y;

      piece.style.transform = `rotate(${rot}deg) translate(${ox}px, ${oy}px)`;
      piece.dataset.currentRot = rot;
      piece.dataset.currentOx = ox;
      piece.dataset.currentOy = oy;
    });

    slots.forEach(slot => slot.classList.remove('is-filled'));
    placedCount = 0;
    if (board) board.classList.remove('board-completed');
  }

  function placePiece(piece) {
    if (!piece) return;
    const pieceIdx = piece.dataset.piece;
    const slot = document.getElementById('puzzle-slot-' + pieceIdx);
    if (!slot) return;

    board.appendChild(piece);
    piece.classList.remove('is-dragging');
    piece.classList.add('is-placed');
    piece.removeAttribute('style');

    slot.classList.add('is-filled');
    placedCount++;

    if (placedCount === 3) {
      if (board) board.classList.add('board-completed');
    }
  }

  function unplacePiece(piece) {
    if (!piece || !piece.classList.contains('is-placed')) return;
    const pieceIdx = piece.dataset.piece;
    const slot = document.getElementById('puzzle-slot-' + pieceIdx);
    if (slot) slot.classList.remove('is-filled');

    tray.appendChild(piece);
    piece.classList.remove('is-placed');
    revertToTray(piece);
    placedCount = Math.max(0, placedCount - 1);
    if (board) board.classList.remove('board-completed');
  }

  function revertToTray(piece) {
    piece.classList.remove('is-dragging');
    piece.removeAttribute('style');
    const rot = piece.dataset.currentRot || 0;
    const ox = piece.dataset.currentOx || 0;
    const oy = piece.dataset.currentOy || 0;
    piece.style.transform = `rotate(${rot}deg) translate(${ox}px, ${oy}px)`;
  }

  // Pointer drag & tap handling
  pieces.forEach(piece => {
    let isDragging = false;
    let startX = 0;
    let startY = 0;
    let initialRect = null;
    let hasMoved = false;

    piece.addEventListener('pointerdown', (e) => {
      if (e.button !== 0) return;

      if (piece.classList.contains('is-placed')) {
        // If all placed, clicking puzzle scatters again to replay
        if (placedCount === 3) {
          scatterPieces(true);
        } else {
          unplacePiece(piece);
        }
        return;
      }

      startX = e.clientX;
      startY = e.clientY;
      hasMoved = false;
      isDragging = true;
      initialRect = piece.getBoundingClientRect();

      try {
        piece.setPointerCapture(e.pointerId);
      } catch (err) {}
    });

    piece.addEventListener('pointermove', (e) => {
      if (!isDragging) return;

      const deltaX = e.clientX - startX;
      const deltaY = e.clientY - startY;

      if (!hasMoved && Math.hypot(deltaX, deltaY) > 6) {
        hasMoved = true;
        piece.classList.add('is-dragging');
        piece.style.position = 'fixed';
        piece.style.width = initialRect.width + 'px';
        piece.style.height = initialRect.height + 'px';
        piece.style.zIndex = '9999';
        piece.style.margin = '0';
        piece.style.pointerEvents = 'none';
      }

      if (hasMoved) {
        piece.style.left = (initialRect.left + deltaX) + 'px';
        piece.style.top = (initialRect.top + deltaY) + 'px';
      }
    });

    const finishDrag = (e) => {
      if (!isDragging) return;
      isDragging = false;

      try {
        piece.releasePointerCapture(e.pointerId);
      } catch (err) {}

      // If clicked without dragging, place directly
      if (!hasMoved) {
        placePiece(piece);
        return;
      }

      // Drag release: calculate distance to target slot or board
      const pieceIdx = piece.dataset.piece;
      const targetSlot = document.getElementById('puzzle-slot-' + pieceIdx);
      if (!targetSlot) {
        revertToTray(piece);
        return;
      }

      const slotRect = targetSlot.getBoundingClientRect();
      const currentRect = piece.getBoundingClientRect();
      const pCenterX = currentRect.left + currentRect.width / 2;
      const pCenterY = currentRect.top + currentRect.height / 2;
      const sCenterX = slotRect.left + slotRect.width / 2;
      const sCenterY = slotRect.top + slotRect.height / 2;

      const dist = Math.hypot(pCenterX - sCenterX, pCenterY - sCenterY);
      const snapThreshold = Math.max(slotRect.width, slotRect.height) * 0.9;

      if (dist < snapThreshold) {
        placePiece(piece);
      } else {
        revertToTray(piece);
      }
    };

    piece.addEventListener('pointerup', finishDrag);
    piece.addEventListener('pointercancel', finishDrag);
  });

  scatterPieces(false);
}

/* ==========================================================================
   SCRLA CINEMATIC ENGAGEMENT FILM SCROLL WHEEL ANIMATION
   ========================================================================== */
function initScrlaScrollAnimation() {
  const container = document.getElementById('scrla-container');
  const canvas = document.getElementById('scrla-canvas');
  const fallbackImg = document.getElementById('scrla-fallback');
  const hint = document.getElementById('scrla-hint');

  if (!container || !canvas) return;

  const ctx = canvas.getContext('2d', { alpha: false });
  const frameCount = 240;
  const images = new Array(frameCount);
  const loaded = new Array(frameCount).fill(false);

  let currentFrame = 0;
  let targetFrame = 0;
  let lastRenderedFrame = -1;
  let isCanvasDrawn = false;
  let hasInteracted = false;
  let isWheelActive = false;
  let wheelTimeout = null;

  // Format frame filename: frame_000.jpg to frame_239.jpg
  function getFrameSrc(idx) {
    const padded = String(idx).padStart(3, '0');
    return `assets/scrla_frames/frame_${padded}.jpg`;
  }

  // Preload a single frame
  function preloadFrame(idx, onComplete) {
    if (images[idx]) {
      if (loaded[idx] && onComplete) onComplete(images[idx]);
      return images[idx];
    }
    const img = new Image();
    img.src = getFrameSrc(idx);
    img.onload = () => {
      loaded[idx] = true;
      if (!isCanvasDrawn && idx === 0) {
        drawFrame(0);
        container.classList.add('canvas-ready');
      }
      if (onComplete) onComplete(img);
    };
    img.onerror = () => {
      setTimeout(() => {
        if (!loaded[idx]) img.src = getFrameSrc(idx);
      }, 1000);
    };
    images[idx] = img;
    return img;
  }

  // Draw specific frame onto canvas with nearest-loaded fallback
  function drawFrame(idx) {
    idx = Math.max(0, Math.min(frameCount - 1, Math.round(idx)));

    let targetImg = null;
    if (loaded[idx]) {
      targetImg = images[idx];
      lastRenderedFrame = idx;
    } else {
      let minDiff = Infinity;
      let closestIdx = lastRenderedFrame;
      for (let i = 0; i < frameCount; i++) {
        if (loaded[i]) {
          const diff = Math.abs(i - idx);
          if (diff < minDiff) {
            minDiff = diff;
            closestIdx = i;
          }
        }
      }
      if (closestIdx >= 0 && loaded[closestIdx]) {
        targetImg = images[closestIdx];
      }
    }

    if (targetImg && targetImg.complete && targetImg.naturalWidth > 0) {
      ctx.drawImage(targetImg, 0, 0, canvas.width, canvas.height);
      isCanvasDrawn = true;
      if (fallbackImg && !container.classList.contains('canvas-ready')) {
        container.classList.add('canvas-ready');
      }
    }
  }

  // Progressive staggered preloading for peak performance
  function startPreloadingSequence() {
    // 1. Preload initial frame
    preloadFrame(0, () => {
      drawFrame(0);
    });

    // 2. High priority keyframes every 4th frame
    const strideKeyframes = [];
    for (let i = 4; i < frameCount; i += 4) {
      strideKeyframes.push(i);
    }

    // 3. Medium priority even frames
    const evenFrames = [];
    for (let i = 2; i < frameCount; i += 4) {
      evenFrames.push(i);
    }

    // 4. Remaining odd frames
    const oddFrames = [];
    for (let i = 1; i < frameCount; i += 2) {
      oddFrames.push(i);
    }

    const loadQueue = strideKeyframes.concat(evenFrames).concat(oddFrames);
    let activeLoads = 0;
    const MAX_CONCURRENT = 6;

    function pumpQueue() {
      while (activeLoads < MAX_CONCURRENT && loadQueue.length > 0) {
        const nextIdx = loadQueue.shift();
        activeLoads++;
        preloadFrame(nextIdx, () => {
          activeLoads--;
          pumpQueue();
        });
      }
    }

    setTimeout(pumpQueue, 100);
  }

  function dismissHint() {
    if (!hasInteracted && hint) {
      hasInteracted = true;
      hint.classList.add('hint-hidden');
    }
  }

  // Mouse Wheel Scrubbing on container
  container.addEventListener(
    'wheel',
    (e) => {
      dismissHint();

      // Normalize delta across browsers and devices
      let delta = e.deltaY;
      if (e.deltaMode === 1) delta *= 28;
      else if (e.deltaMode === 2) delta *= 400;

      const scrubStep = delta * 0.16;
      const nextTarget = targetFrame + scrubStep;

      // Allow natural page scrolling when at extreme ends of animation
      const isAtEnd = targetFrame >= frameCount - 1 && delta > 0;
      const isAtStart = targetFrame <= 0 && delta < 0;

      if (!isAtEnd && !isAtStart) {
        e.preventDefault();
        targetFrame = Math.max(0, Math.min(frameCount - 1, nextTarget));
        isWheelActive = true;
        clearTimeout(wheelTimeout);
        wheelTimeout = setTimeout(() => {
          isWheelActive = false;
        }, 1200);
      }
    },
    { passive: false }
  );

  // Sync with general page scrolling when user is scrolling the document
  window.addEventListener(
    'scroll',
    () => {
      if (isWheelActive) return;

      const rect = container.getBoundingClientRect();
      const vh = window.innerHeight || document.documentElement.clientHeight;

      if (rect.top <= vh && rect.bottom >= 0) {
        const totalSpan = vh + rect.height;
        const currentProgress = (vh - rect.top) / totalSpan;
        const clamped = Math.max(0, Math.min(1, currentProgress));
        targetFrame = clamped * (frameCount - 1);
      }
    },
    { passive: true }
  );

  // Mobile Touch Scrubbing
  let touchStartY = 0;
  let touchStartFrame = 0;
  let isTouching = false;

  container.addEventListener(
    'touchstart',
    (e) => {
      if (e.touches.length === 1) {
        isTouching = true;
        touchStartY = e.touches[0].clientY;
        touchStartFrame = targetFrame;
        dismissHint();
      }
    },
    { passive: true }
  );

  container.addEventListener(
    'touchmove',
    (e) => {
      if (!isTouching || e.touches.length !== 1) return;
      const currentY = e.touches[0].clientY;
      const diffY = touchStartY - currentY;
      const frameDelta = (diffY / (window.innerHeight * 0.45)) * frameCount;
      targetFrame = Math.max(0, Math.min(frameCount - 1, touchStartFrame + frameDelta));
    },
    { passive: true }
  );

  container.addEventListener('touchend', () => {
    isTouching = false;
  });

  // Smooth lerp loop with requestAnimationFrame
  function loop() {
    const diff = targetFrame - currentFrame;
    if (Math.abs(diff) > 0.04) {
      currentFrame += diff * 0.18;
      drawFrame(currentFrame);
    } else if (Math.round(currentFrame) !== Math.round(targetFrame)) {
      currentFrame = targetFrame;
      drawFrame(currentFrame);
    }
    requestAnimationFrame(loop);
  }

  // Start preloading and animation loop
  startPreloadingSequence();
  requestAnimationFrame(loop);
}
