/* ==========================================
   KIND TECH - MAIN JAVASCRIPT
   ========================================== */

(function () {
  'use strict';

  /* ------------------------------------------
     MOBILE VIEWPORT HEIGHT (iOS-safe)
     ------------------------------------------ */

  function updateVhUnit() {
    var vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', vh + 'px');
  }

  updateVhUnit();
  window.addEventListener('resize', updateVhUnit, { passive: true });
  window.addEventListener('orientationchange', updateVhUnit, { passive: true });
  if (window.visualViewport) {
    window.visualViewport.addEventListener('resize', updateVhUnit, { passive: true });
  }

  /* ------------------------------------------
     NAVIGATION - Scroll effect & Mobile menu
     ------------------------------------------ */

  const nav = document.getElementById('nav');
  const mobileToggle = document.getElementById('mobileToggle');
  const mobileMenu = document.getElementById('mobileMenu');
  let mobileOpen = false;

  function handleNavScroll() {
    if (window.scrollY > 40) {
      nav.classList.add('nav--scrolled');
    } else {
      nav.classList.remove('nav--scrolled');
    }
  }

  window.addEventListener('scroll', handleNavScroll, { passive: true });

  mobileToggle.addEventListener('click', function () {
    mobileOpen = !mobileOpen;
    mobileMenu.classList.toggle('mobile-menu--open', mobileOpen);

    const spans = mobileToggle.querySelectorAll('span');
    if (mobileOpen) {
      spans[0].style.transform = 'rotate(45deg) translate(2px, 2px)';
      spans[1].style.transform = 'rotate(-45deg) translate(2px, -2px)';
    } else {
      spans[0].style.transform = '';
      spans[1].style.transform = '';
    }
  });

  // Close mobile menu on link click
  document.querySelectorAll('.mobile-menu__link').forEach(function (link) {
    link.addEventListener('click', function () {
      mobileOpen = false;
      mobileMenu.classList.remove('mobile-menu--open');
      var spans = mobileToggle.querySelectorAll('span');
      spans[0].style.transform = '';
      spans[1].style.transform = '';
    });
  });

  /* ------------------------------------------
     SCROLL-TRIGGERED ANIMATIONS
     ------------------------------------------ */

  function initScrollAnimations() {
    var elements = document.querySelectorAll('[data-animate]');

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry, i) {
          if (entry.isIntersecting) {
            var el = entry.target;
            var siblings = Array.from(el.parentNode.querySelectorAll('[data-animate]'));
            var index = siblings.indexOf(el);
            var delay = index * 100;

            setTimeout(function () {
              el.classList.add(
                el.classList.contains('card')
                  ? 'card--visible'
                  : el.classList.contains('affiliater-card')
                  ? 'affiliater-card--visible'
                  : 'card--visible'
              );
            }, delay);

            observer.unobserve(el);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    );

    elements.forEach(function (el) {
      observer.observe(el);
    });
  }

  initScrollAnimations();

  /* ------------------------------------------
     CAPABILITY TABS (Mobile)
     ------------------------------------------ */

  function initCapabilityTabs() {
    var tabBtns = document.querySelectorAll('.capabilities__tab-btn');
    var tabTitle = document.querySelector('.capabilities__tab-title');
    var tabDesc = document.querySelector('.capabilities__tab-desc');
    if (!tabBtns.length || !tabTitle || !tabDesc) return;

    var capabilities = [
      { title: 'Voice Intelligence', desc: 'AI you talk to, not type at. Built for people who never needed a manual.' },
      { title: 'Adaptive Dialogue', desc: 'Systems that learn who you are and get better with every conversation.' },
      { title: 'Emotional Intelligence', desc: 'Real-time sentiment detection that shapes how AI responds, moment to moment.' },
      { title: 'Grounded Intelligence', desc: 'Every answer anchored to verified knowledge. Not guesses dressed as facts.' },
      { title: 'Cognitive AI', desc: 'Technology designed for memory, stimulation and long-term human wellbeing.' },
      { title: 'Production Architecture', desc: 'Systems built to run in the real world, not just in demos.' }
    ];

    tabBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var index = parseInt(btn.getAttribute('data-tab'));
        tabBtns.forEach(function (b) { b.classList.remove('capabilities__tab-btn--active'); });
        btn.classList.add('capabilities__tab-btn--active');
        tabTitle.textContent = capabilities[index].title;
        tabDesc.textContent = capabilities[index].desc;
      });
    });
  }

  initCapabilityTabs();

  /* ------------------------------------------
     HERO - Headline typewriter rotator
     ------------------------------------------ */

  function initHeroHeadlineRotator() {
    var textSpan = document.getElementById('heroTitleText');
    var prefixContainer = document.getElementById('heroTitlePrefix');
    var tailContainer = document.getElementById('heroTitleTail');
    var prefixLead = document.getElementById('heroTitlePrefixLead');
    var prefixTail = document.getElementById('heroTitlePrefixTail');
    var dynamicText = document.getElementById('heroTitleDynamic');
    var cursor = document.getElementById('heroTitleCursor');
    var canvas = document.getElementById('heroCanvas');

    if (!textSpan || !dynamicText || !prefixLead || !prefixTail) {
      return {
        onInteraction: function () {},
        setIdleState: function () {}
      };
    }

    if (canvas) canvas.style.display = 'none';
    textSpan.classList.add('hero__title-text--typing');

    var phrases = [
      { parts: [{ text: 'human longevity.', className: 'hero__title-part--italic' }] },
      { parts: [{ text: 'those who need it most.', className: 'hero__title-part--italic' }] },
      { parts: [{ text: 'everyone.', className: 'hero__title-part--italic' }] },
      { parts: [{ text: 'what matters most.', className: 'hero__title-part--italic' }] },
      { parts: [{ text: 'the ones technology forgot.', className: 'hero__title-part--italic' }] }
    ];
    var prefersReducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var typeDelay = 58;
    var deleteDelay = 30;
    var holdDelay = 3000;
    var introDelay = 62;
    var introStartDelay = 420;
    var timer = null;
    var phraseIndex = 0;
    var charIndex = 0;
    var mode = 'intro';
    var isIdle = false;
    var introIndex = 0;
    var shuffleQueue = [];
    var shufflePos = 0;

    function buildShuffleQueue() {
      shuffleQueue = phrases.map(function (_, i) { return i; });
      for (var i = shuffleQueue.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var tmp = shuffleQueue[i]; shuffleQueue[i] = shuffleQueue[j]; shuffleQueue[j] = tmp;
      }
      shufflePos = 0;
    }

    function nextPhraseIndex() {
      if (shufflePos >= shuffleQueue.length) buildShuffleQueue();
      return shuffleQueue[shufflePos++];
    }

    buildShuffleQueue();
    var introLeadText = 'Reliable AI';
    var introTailText = '\u00A0for';
    var introFullText = introLeadText + introTailText;

    function renderIntro(count) {
      var safeCount = Math.max(0, Math.min(count, introFullText.length));
      var leadCount = Math.min(safeCount, introLeadText.length);
      var tailCount = Math.max(0, safeCount - introLeadText.length);

      prefixLead.textContent = introLeadText.slice(0, leadCount);
      prefixTail.textContent = introTailText.slice(0, tailCount);
    }

    function placeCursorInPrefix() {
      if (!cursor || !prefixContainer) return;
      prefixContainer.appendChild(cursor);
    }

    function placeCursorInTail() {
      if (!cursor || !tailContainer) return;
      tailContainer.appendChild(cursor);
    }

    function escapeHtml(text) {
      return text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
    }

    function getPhraseText(phraseConfig) {
      return phraseConfig.parts.map(function (part) {
        return part.text || '';
      }).join('');
    }

    function renderDynamic(phraseConfig, count) {
      var phraseText = getPhraseText(phraseConfig);
      var safeCount = Math.max(0, Math.min(count, phraseText.length));
      if (safeCount === 0) {
        dynamicText.textContent = '';
        return;
      }

      var consumed = 0;
      var html = '';

      phraseConfig.parts.forEach(function (part) {
        if (part.breakClass) {
          if (safeCount >= consumed) {
            html += '<br class="' + part.breakClass + '">';
          }
          return;
        }

        if (safeCount <= consumed) return;

        var visibleLen = Math.min(part.text.length, safeCount - consumed);
        var visibleText = escapeHtml(part.text.slice(0, visibleLen));
        if (part.className) {
          html += '<span class="' + part.className + '">' + visibleText + '</span>';
        } else {
          html += visibleText;
        }
        consumed += visibleLen;
      });

      dynamicText.innerHTML = html;
    }

    function clearTimer() {
      if (timer) {
        clearTimeout(timer);
        timer = null;
      }
    }

    function scheduleStep(delay) {
      clearTimer();
      timer = setTimeout(step, delay);
    }

    function step() {
      if (isIdle || prefersReducedMotion) {
        return;
      }

      if (mode === 'intro') {
        introIndex += 1;
        renderIntro(introIndex);
        if (introIndex >= introFullText.length) {
          placeCursorInTail();
          mode = 'typing';
          scheduleStep(240);
          return;
        }
        var introChar = introFullText.charAt(introIndex - 1);
        var introNextDelay = (introChar === ' ' || introChar === '\u00A0') ? 42 : introDelay + Math.random() * 22;
        scheduleStep(introNextDelay);
        return;
      }

      var phrase = phrases[phraseIndex];
      var phraseText = getPhraseText(phrase);

      if (mode === 'holding') {
        mode = 'deleting';
        scheduleStep(80);
        return;
      }

      if (mode === 'typing') {
        charIndex += 1;
        renderDynamic(phrase, charIndex);

        if (charIndex >= phraseText.length) {
          mode = 'holding';
          scheduleStep(holdDelay);
          return;
        }

        var typedChar = phraseText.charAt(charIndex - 1);
        var nextDelay = typedChar === ' ' ? 40 : typeDelay + Math.random() * 24;
        if (typedChar === '.' || typedChar === ',') {
          nextDelay = 160;
        }
        scheduleStep(nextDelay);
        return;
      }

      charIndex -= 1;
      if (charIndex < 0) charIndex = 0;
      renderDynamic(phrase, charIndex);

      if (charIndex === 0) {
        phraseIndex = nextPhraseIndex();
        mode = 'typing';
        scheduleStep(280);
        return;
      }

      scheduleStep(deleteDelay);
    }

    function setIdleState(idleState) {
      isIdle = !!idleState;
      if (isIdle) {
        clearTimer();
        return;
      }

      if (!prefersReducedMotion) {
        scheduleStep(220);
      }
    }

    if (prefersReducedMotion) {
      renderIntro(introFullText.length);
      renderDynamic(phrases[0], getPhraseText(phrases[0]).length);
      if (cursor) cursor.style.display = 'none';
      return {
        onInteraction: function () {},
        setIdleState: function () {}
      };
    }

    placeCursorInPrefix();
    renderIntro(0);
    dynamicText.textContent = '';
    scheduleStep(introStartDelay);

    return {
      onInteraction: function () {},
      setIdleState: setIdleState
    };
  }

  /* ------------------------------------------
     GLOBAL IDLE OVERLAY
     ------------------------------------------ */

  function initIdleOverlay(headlineController) {
    var overlay = document.getElementById('idleOverlay');
    if (!overlay) return;

    var idleDelay = 20000;
    var idleTimer = null;
    var idleActive = false;
    var lastSignalTime = 0;
    var activityEvents = ['scroll', 'wheel', 'mousemove', 'pointermove', 'pointerdown', 'keydown', 'touchstart', 'touchmove'];

    function showOverlay() {
      if (idleActive) return;
      idleActive = true;
      overlay.classList.add('idle-overlay--visible');
      overlay.setAttribute('aria-hidden', 'false');
      if (headlineController && headlineController.setIdleState) {
        headlineController.setIdleState(true);
      }
    }

    function hideOverlay() {
      if (!idleActive) return;
      idleActive = false;
      overlay.classList.remove('idle-overlay--visible');
      overlay.setAttribute('aria-hidden', 'true');
      if (headlineController && headlineController.setIdleState) {
        headlineController.setIdleState(false);
      }
    }

    function resetIdleTimer() {
      if (idleTimer) clearTimeout(idleTimer);
      idleTimer = setTimeout(showOverlay, idleDelay);
    }

    function handleActivity() {
      var now = Date.now();
      if (now - lastSignalTime < 120) return;
      lastSignalTime = now;

      hideOverlay();
      if (headlineController && headlineController.onInteraction) {
        headlineController.onInteraction();
      }
      resetIdleTimer();
    }

    activityEvents.forEach(function (eventName) {
      if (eventName === 'keydown') {
        window.addEventListener(eventName, handleActivity);
      } else {
        window.addEventListener(eventName, handleActivity, { passive: true });
      }
    });

    document.addEventListener('visibilitychange', function () {
      if (document.hidden) {
        if (idleTimer) clearTimeout(idleTimer);
      } else {
        lastSignalTime = 0;
        handleActivity();
      }
    });

    resetIdleTimer();
  }

  var heroHeadlineController = initHeroHeadlineRotator();
  initIdleOverlay(heroHeadlineController);


  /* ------------------------------------------
     CONTACT FORM
     ------------------------------------------ */

  var contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();

      var btn = contactForm.querySelector('.form__submit');
      var originalText = btn.innerHTML;
      btn.innerHTML = 'Sending...';
      btn.style.opacity = '0.6';
      btn.disabled = true;

      var formData = new FormData(contactForm);

      fetch(contactForm.action, {
        method: 'POST',
        body: formData,
        headers: { 'Accept': 'application/json' }
      }).then(function (response) {
        if (response.ok) {
          btn.innerHTML = 'Sent!';
          contactForm.reset();
        } else {
          btn.innerHTML = 'Error, try again';
        }
        setTimeout(function () {
          btn.innerHTML = originalText;
          btn.style.opacity = '';
          btn.disabled = false;
        }, 3000);
      }).catch(function () {
        btn.innerHTML = 'Error, try again';
        setTimeout(function () {
          btn.innerHTML = originalText;
          btn.style.opacity = '';
          btn.disabled = false;
        }, 3000);
      });
    });
  }

  /* ------------------------------------------
     SMOOTH SCROLL for nav links
     ------------------------------------------ */

  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var href = this.getAttribute('href');
      if (href === '#') return;

      var target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        var navHeight = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-height'));
        var top = target.getBoundingClientRect().top + window.pageYOffset - navHeight;

        window.scrollTo({
          top: top,
          behavior: 'smooth',
        });
      }
    });
  });

  /* ------------------------------------------
     CAROUSEL - RECOGNIZED BY
     ------------------------------------------ */

  function applyCarouselLoopDistance(track, setSize) {
    if (!track) return;
    var items = track.querySelectorAll('.carousel__item');
    if (!items.length || items.length < setSize + 1) return;

    var firstStart = items[0].getBoundingClientRect().left;
    var secondSetStart = items[setSize].getBoundingClientRect().left;
    var loopDistance = secondSetStart - firstStart;
    if (loopDistance > 0) {
      track.style.setProperty('--carousel-loop-distance', loopDistance + 'px');
    }
  }

  function initCarousel() {
    var carouselTrack = document.getElementById('carouselTrack');
    if (!carouselTrack) return;

    var images = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    
    // Shuffle array
    function shuffleArray(array) {
      var shuffled = array.slice();
      for (var i = shuffled.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = shuffled[i];
        shuffled[i] = shuffled[j];
        shuffled[j] = temp;
      }
      return shuffled;
    }

    var shuffledImages = shuffleArray(images);

    // Create carousel items (double them for seamless loop)
    var itemsHTML = '';
    
    // First set
    for (var i = 0; i < shuffledImages.length; i++) {
      itemsHTML += '<div class="carousel__item"><img src="assets/recognizedby/' + shuffledImages[i] + '.png" alt="Recognized by ' + i + '"></div>';
    }
    
    // Duplicate set for seamless loop
    for (var i = 0; i < shuffledImages.length; i++) {
      itemsHTML += '<div class="carousel__item"><img src="assets/recognizedby/' + shuffledImages[i] + '.png" alt="Recognized by ' + i + '"></div>';
    }

    carouselTrack.innerHTML = itemsHTML;
    requestAnimationFrame(function () {
      applyCarouselLoopDistance(carouselTrack, shuffledImages.length);
    });
  }

  initCarousel();

  /* ------------------------------------------
     PARTNER CAROUSEL
     ------------------------------------------ */

  function initPartnerCarousel() {
    var track = document.getElementById('partnerTrack');
    if (!track) return;

    var images = [1, 2, 3, 4, 5];

    function shuffleArray(array) {
      var shuffled = array.slice();
      for (var i = shuffled.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = shuffled[i];
        shuffled[i] = shuffled[j];
        shuffled[j] = temp;
      }
      return shuffled;
    }

    var shuffled = shuffleArray(images);
    var html = '';
    for (var i = 0; i < shuffled.length; i++) {
      html += '<div class="carousel__item"><img src="assets/partner/' + shuffled[i] + '.png" alt="Partner ' + i + '"></div>';
    }
    for (var i = 0; i < shuffled.length; i++) {
      html += '<div class="carousel__item"><img src="assets/partner/' + shuffled[i] + '.png" alt="Partner ' + i + '"></div>';
    }
    track.innerHTML = html;
    requestAnimationFrame(function () {
      applyCarouselLoopDistance(track, shuffled.length);
    });
  }

  initPartnerCarousel();

  function refreshHeroCarouselLoopDistances() {
    var recognizedTrack = document.getElementById('carouselTrack');
    var partnerTrack = document.getElementById('partnerTrack');
    applyCarouselLoopDistance(recognizedTrack, 9);
    applyCarouselLoopDistance(partnerTrack, 5);
  }

  window.addEventListener('load', refreshHeroCarouselLoopDistances);
  window.addEventListener('resize', refreshHeroCarouselLoopDistances, { passive: true });
  if (window.visualViewport) {
    window.visualViewport.addEventListener('resize', refreshHeroCarouselLoopDistances, { passive: true });
  }

  /* ------------------------------------------
     NEWS CAROUSEL - Arrow navigation
     ------------------------------------------ */

  function initNewsCarousel() {
    var track = document.getElementById('newsTrack');
    var leftBtn = document.getElementById('newsArrowLeft');
    var rightBtn = document.getElementById('newsArrowRight');
    if (!track || !leftBtn || !rightBtn) return;

    var scrollAmount = 324; // card width (300) + gap (24)

    leftBtn.addEventListener('click', function () {
      track.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
    });

    rightBtn.addEventListener('click', function () {
      track.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    });
  }

  initNewsCarousel();

  /* ------------------------------------------
     COLOR BENDS — Hero WebGL background
     ------------------------------------------ */

  function initColorBends() {
    if (typeof THREE === 'undefined') return;
    var canvas = document.getElementById('colorBendsCanvas');
    var heroEl = document.getElementById('hero');
    if (!canvas || !heroEl) return;

    var fragShader = `
      #define MAX_COLORS 8
      uniform vec2 uCanvas;
      uniform float uTime;
      uniform float uSpeed;
      uniform vec2 uRot;
      uniform int uColorCount;
      uniform vec3 uColors[MAX_COLORS];
      uniform int uTransparent;
      uniform float uScale;
      uniform float uFrequency;
      uniform float uWarpStrength;
      uniform vec2 uPointer;
      uniform float uMouseInfluence;
      uniform float uParallax;
      uniform float uNoise;
      uniform int uIterations;
      uniform float uIntensity;
      uniform float uBandWidth;
      varying vec2 vUv;
      void main() {
        float t = uTime * uSpeed;
        vec2 p = vUv * 2.0 - 1.0;
        p += uPointer * uParallax * 0.1;
        vec2 rp = vec2(p.x * uRot.x - p.y * uRot.y, p.x * uRot.y + p.y * uRot.x);
        vec2 q = vec2(rp.x * (uCanvas.x / uCanvas.y), rp.y);
        q /= max(uScale, 0.0001);
        q /= 0.5 + 0.2 * dot(q, q);
        q += 0.2 * cos(t) - 7.56;
        vec2 toward = (uPointer - rp);
        q += toward * uMouseInfluence * 0.2;
        for (int j = 0; j < 5; j++) {
          if (j >= uIterations - 1) break;
          vec2 rr = sin(1.5 * (q.yx * uFrequency) + 2.0 * cos(q * uFrequency));
          q += (rr - q) * 0.15;
        }
        vec3 col = vec3(0.0);
        float a = 1.0;
        if (uColorCount > 0) {
          vec2 s = q;
          vec3 sumCol = vec3(0.0);
          float cover = 0.0;
          for (int i = 0; i < MAX_COLORS; ++i) {
            if (i >= uColorCount) break;
            s -= 0.01;
            vec2 r = sin(1.5 * (s.yx * uFrequency) + 2.0 * cos(s * uFrequency));
            float m0 = length(r + sin(5.0 * r.y * uFrequency - 3.0 * t + float(i)) / 4.0);
            float kBelow = clamp(uWarpStrength, 0.0, 1.0);
            float kMix = pow(kBelow, 0.3);
            float gain = 1.0 + max(uWarpStrength - 1.0, 0.0);
            vec2 disp = (r - s) * kBelow;
            vec2 warped = s + disp * gain;
            float m1 = length(warped + sin(5.0 * warped.y * uFrequency - 3.0 * t + float(i)) / 4.0);
            float m = mix(m0, m1, kMix);
            float w = 1.0 - exp(-uBandWidth / exp(uBandWidth * m));
            sumCol += uColors[i] * w;
            cover = max(cover, w);
          }
          col = clamp(sumCol, 0.0, 1.0);
          a = uTransparent > 0 ? cover : 1.0;
        } else {
          vec2 s = q;
          for (int k = 0; k < 3; ++k) {
            s -= 0.01;
            vec2 r = sin(1.5 * (s.yx * uFrequency) + 2.0 * cos(s * uFrequency));
            float m0 = length(r + sin(5.0 * r.y * uFrequency - 3.0 * t + float(k)) / 4.0);
            float kBelow = clamp(uWarpStrength, 0.0, 1.0);
            float kMix = pow(kBelow, 0.3);
            float gain = 1.0 + max(uWarpStrength - 1.0, 0.0);
            vec2 disp = (r - s) * kBelow;
            vec2 warped = s + disp * gain;
            float m1 = length(warped + sin(5.0 * warped.y * uFrequency - 3.0 * t + float(k)) / 4.0);
            float m = mix(m0, m1, kMix);
            col[k] = 1.0 - exp(-uBandWidth / exp(uBandWidth * m));
          }
          a = uTransparent > 0 ? max(max(col.r, col.g), col.b) : 1.0;
        }
        col *= uIntensity;
        if (uNoise > 0.0001) {
          float n = fract(sin(dot(gl_FragCoord.xy + vec2(uTime), vec2(12.9898, 78.233))) * 43758.5453123);
          col += (n - 0.5) * uNoise;
          col = clamp(col, 0.0, 1.0);
        }
        vec3 rgb = (uTransparent > 0) ? col * a : col;
        gl_FragColor = vec4(rgb, a);
      }
    `;

    var vertShader = `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = vec4(position, 1.0);
      }
    `;

    var colors = ['#5ce0d6', '#0d1f30', '#000000'];
    var rotation = 90;
    var speed = 0.13;
    var scale = 0.5;
    var frequency = 1;
    var warpStrength = 0.85;
    var mouseInfluence = 0.6;
    var parallax = 0.03;
    var noise = 0.1;
    var iterations = 1;
    var intensity = 0.6;
    var bandWidth = 5;

    function toVec3(hex) {
      var h = hex.replace('#', '').trim();
      var r, g, b;
      if (h.length === 3) {
        r = parseInt(h[0] + h[0], 16);
        g = parseInt(h[1] + h[1], 16);
        b = parseInt(h[2] + h[2], 16);
      } else {
        r = parseInt(h.slice(0, 2), 16);
        g = parseInt(h.slice(2, 4), 16);
        b = parseInt(h.slice(4, 6), 16);
      }
      return new THREE.Vector3(r / 255, g / 255, b / 255);
    }

    var scene = new THREE.Scene();
    var camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    var geometry = new THREE.PlaneGeometry(2, 2);

    var MAX_COLORS = 8;
    var uColorsArray = Array.from({ length: MAX_COLORS }, function () { return new THREE.Vector3(0, 0, 0); });
    var colorVecs = colors.filter(Boolean).slice(0, MAX_COLORS).map(toVec3);
    for (var ci = 0; ci < MAX_COLORS; ci++) {
      if (ci < colorVecs.length) uColorsArray[ci].copy(colorVecs[ci]);
    }

    var rad = (rotation * Math.PI) / 180;
    var material = new THREE.ShaderMaterial({
      vertexShader: vertShader,
      fragmentShader: fragShader,
      uniforms: {
        uCanvas:         { value: new THREE.Vector2(1, 1) },
        uTime:           { value: 0 },
        uSpeed:          { value: speed },
        uRot:            { value: new THREE.Vector2(Math.cos(rad), Math.sin(rad)) },
        uColorCount:     { value: colorVecs.length },
        uColors:         { value: uColorsArray },
        uTransparent:    { value: 0 },
        uScale:          { value: scale },
        uFrequency:      { value: frequency },
        uWarpStrength:   { value: warpStrength },
        uPointer:        { value: new THREE.Vector2(0, 0) },
        uMouseInfluence: { value: mouseInfluence },
        uParallax:       { value: parallax },
        uNoise:          { value: noise },
        uIterations:     { value: iterations },
        uIntensity:      { value: intensity },
        uBandWidth:      { value: bandWidth }
      },
      premultipliedAlpha: false,
      transparent: false
    });

    scene.add(new THREE.Mesh(geometry, material));

    var renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      antialias: false,
      powerPreference: 'high-performance',
      alpha: false
    });
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setClearColor(0x000000, 1);

    function handleResize() {
      var w = heroEl.clientWidth || 1;
      var h = heroEl.clientHeight || 1;
      renderer.setSize(w, h, false);
      material.uniforms.uCanvas.value.set(w, h);
    }
    handleResize();

    if ('ResizeObserver' in window) {
      var ro = new ResizeObserver(handleResize);
      ro.observe(heroEl);
    } else {
      window.addEventListener('resize', handleResize, { passive: true });
    }

    var pointerTarget = new THREE.Vector2(0, 0);
    var pointerCurrent = new THREE.Vector2(0, 0);

    heroEl.addEventListener('pointermove', function (e) {
      var rect = heroEl.getBoundingClientRect();
      var x = ((e.clientX - rect.left) / (rect.width || 1)) * 2 - 1;
      var y = -(((e.clientY - rect.top) / (rect.height || 1)) * 2 - 1);
      pointerTarget.set(x, y);
    }, { passive: true });

    var prefRM = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var clock = new THREE.Clock();

    if (prefRM) {
      renderer.render(scene, camera);
      return;
    }

    function loop() {
      var dt = clock.getDelta();
      material.uniforms.uTime.value = clock.elapsedTime;
      pointerCurrent.lerp(pointerTarget, Math.min(1, dt * 8));
      material.uniforms.uPointer.value.copy(pointerCurrent);
      renderer.render(scene, camera);
      requestAnimationFrame(loop);
    }
    requestAnimationFrame(loop);
  }

  /* ------------------------------------------
     BORDER GLOW - edge-proximity card glow
     ------------------------------------------ */

  function initBorderGlow() {
    var cards = document.querySelectorAll('.border-glow-card');
    if (!cards.length) return;

    cards.forEach(function (card) {
      card.addEventListener('pointermove', function (e) {
        var rect = card.getBoundingClientRect();
        var x = e.clientX - rect.left;
        var y = e.clientY - rect.top;
        var w = rect.width;
        var h = rect.height;

        card.style.setProperty('--glow-x', ((x / w) * 100).toFixed(1) + '%');
        card.style.setProperty('--glow-y', ((y / h) * 100).toFixed(1) + '%');

        // Baseline 0.4 everywhere + ramps to 1.0 within 80px of any edge
        var edgeDist = Math.min(x, y, w - x, h - y);
        var proximity = 0.4 + 0.6 * (1 - Math.min(1, Math.max(0, edgeDist / 80)));
        card.style.setProperty('--edge-proximity', proximity.toFixed(3));
      });

      card.addEventListener('pointerleave', function () {
        card.style.setProperty('--edge-proximity', '0');
      });
    });
  }

  initBorderGlow();
  initColorBends();

  /* ------------------------------------------
     WAVEFORM PHRASE ROTATOR (DecryptedText)
     ------------------------------------------ */

  function initWaveformPhrase() {
    var el = document.getElementById('waveformPhrase');
    if (!el) return;

    var phrases = [
      'Sometimes all it takes is someone to listen.',
      'AI built for people, not just processes.',
      'Turning AI into care.',
      'The most natural interface ever built.'
    ];

    var CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%&?!';
    var SPEED = 22;          // ms per tick
    var HOLD_MS = 4000;      // pause after fully revealed
    var SCRAMBLE_TICKS = 2;  // ticks before each char locks in

    var phraseIndex = 0;
    var intervalId = null;
    var timeoutId = null;
    var hasStarted = false;

    function randChar() {
      return CHARS[Math.floor(Math.random() * CHARS.length)];
    }

    function renderHTML(text, revealedCount) {
      var html = '';
      for (var i = 0; i < text.length; i++) {
        if (text[i] === ' ') {
          html += ' ';
        } else if (i < revealedCount) {
          html += '<span>' + text[i] + '</span>';
        } else {
          html += '<span class="decrypt-char--scrambled">' + randChar() + '</span>';
        }
      }
      return html;
    }

    function decryptPhrase(text, onDone) {
      var revealed = 0;
      var ticks = 0;

      // Start fully scrambled
      el.innerHTML = renderHTML(text, 0);

      intervalId = setInterval(function () {
        ticks++;
        if (ticks % SCRAMBLE_TICKS === 0 && revealed < text.length) {
          // Skip spaces instantly
          revealed++;
          while (revealed < text.length && text[revealed] === ' ') revealed++;
        }
        el.innerHTML = renderHTML(text, revealed);

        if (revealed >= text.length) {
          clearInterval(intervalId);
          el.innerHTML = renderHTML(text, text.length);
          if (onDone) timeoutId = setTimeout(onDone, HOLD_MS);
        }
      }, SPEED);
    }

    function encryptOut(text, onDone) {
      var revealed = text.length;
      var ticks = 0;

      intervalId = setInterval(function () {
        ticks++;
        if (ticks % SCRAMBLE_TICKS === 0 && revealed > 0) {
          revealed--;
          while (revealed > 0 && text[revealed - 1] === ' ') revealed--;
        }
        el.innerHTML = renderHTML(text, revealed);

        if (revealed <= 0) {
          clearInterval(intervalId);
          el.innerHTML = '';
          if (onDone) onDone();
        }
      }, SPEED);
    }

    function showNext() {
      var current = phrases[phraseIndex];
      phraseIndex = (phraseIndex + 1) % phrases.length;
      var next = phrases[phraseIndex];

      decryptPhrase(current, function () {
        encryptOut(current, function () {
          decryptPhrase(next, function () {
            phraseIndex = (phraseIndex + 1) % phrases.length;
            timeoutId = setTimeout(function () {
              encryptOut(next, function () {
                showNext();
              });
            }, HOLD_MS);
          });
        });
      });
    }

    // Trigger when section enters view
    var section = document.getElementById('waveform');
    if (!section) return;

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting && !hasStarted) {
          hasStarted = true;
          showNext();
        }
      });
    }, { threshold: 0.2 });

    observer.observe(section);
  }

  /* ------------------------------------------
     WAVEFORM SECTION
     ------------------------------------------ */

  function initWaveform() {
    var canvas = document.getElementById('waveformCanvas');
    if (!canvas) return;

    var ctx = canvas.getContext('2d');
    var rafId = null;
    var isVisible = false;
    var prefersReducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Mouse tracking
    var mouseX = -9999;
    var mouseY = -9999;
    var mouseActive = false;

    var section = canvas.closest('.waveform-section') || canvas.parentElement;

    section.addEventListener('mousemove', function (e) {
      var rect = canvas.getBoundingClientRect();
      mouseX = e.clientX - rect.left;
      mouseY = e.clientY - rect.top;
      mouseActive = true;
    }, { passive: true });

    section.addEventListener('mouseleave', function () {
      mouseActive = false;
      mouseX = -9999;
      mouseY = -9999;
    }, { passive: true });

    function resize() {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      canvas.height = canvas.offsetHeight * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    }

    resize();
    window.addEventListener('resize', resize, { passive: true });

    var BAR_COUNT = 64;
    var BAR_GAP = 4;
    var time = 0;
    // Per-bar agitation state
    var barAgitation = new Array(BAR_COUNT).fill(0);
    var barVelocity = new Array(BAR_COUNT).fill(0);

    // Pastel palette — subtle, desaturated
    var pastels = [
      [180, 230, 240], // soft cyan
      [200, 180, 240], // soft lavender
      [180, 240, 210], // soft mint
      [240, 200, 180], // soft peach
      [240, 185, 210], // soft rose
      [185, 210, 240], // soft sky blue
      [220, 240, 180], // soft lime
    ];
    // Assign a random pastel to each bar once
    var barColors = [];
    for (var ci = 0; ci < BAR_COUNT; ci++) {
      barColors.push(pastels[Math.floor(Math.random() * pastels.length)]);
    }

    function drawBars(W, H, isStatic) {
      ctx.clearRect(0, 0, W, H);

      var totalBars = BAR_COUNT;
      var barWidth = (W * 0.68 - (totalBars - 1) * BAR_GAP) / totalBars;
      var startX = (W - (totalBars * (barWidth + BAR_GAP) - BAR_GAP)) / 2;
      var centerY = H / 2;
      var maxAmp = H * 0.46;
      var mouseRadius = W * 0.12;

      for (var i = 0; i < totalBars; i++) {
        var progress = i / (totalBars - 1);
        var x = startX + i * (barWidth + BAR_GAP) + barWidth / 2;

        // Organic base wave
        var amp = isStatic
          ? Math.sin(progress * Math.PI * 2.8) * 0.4 + Math.sin(progress * Math.PI * 5.2) * 0.3 + Math.sin(progress * Math.PI * 1.4) * 0.3
          : Math.sin(progress * Math.PI * 2.8 + time * 0.7) * 0.4 +
            Math.sin(progress * Math.PI * 5.2 + time * 1.2) * 0.3 +
            Math.sin(progress * Math.PI * 1.4 + time * 0.4) * 0.3;

        // Envelope: taper at edges
        var envelope = Math.sin(progress * Math.PI);

        // Mouse disturbance
        var disturbance = 0;
        if (!isStatic && mouseActive) {
          var dx = x - mouseX;
          var dy = centerY - mouseY;
          var dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < mouseRadius) {
            var force = (1 - dist / mouseRadius);
            force = force * force;
            // Push bars away + add agitation
            barVelocity[i] += force * 18 * (Math.random() - 0.3);
          }
        }

        // Spring physics for agitation
        barAgitation[i] += barVelocity[i];
        barAgitation[i] *= 0.72; // damping
        barVelocity[i] *= 0.68;
        disturbance = barAgitation[i];

        var baseHeight = Math.max(2, Math.abs(amp) * envelope * maxAmp);
        var barHeight = Math.max(2, baseHeight + Math.abs(disturbance));

        var bx = startX + i * (barWidth + BAR_GAP);

        // Base opacity — minimalist
        var brightness = mouseActive
          ? 0.18 + envelope * 0.42 + Math.min(0.3, Math.abs(disturbance) / 40)
          : 0.14 + envelope * 0.32;

        // Pastel tint on agitation: lerp from white to bar's pastel color
        var agitationNorm = Math.min(1, Math.abs(barAgitation[i]) / 28);
        var pc = barColors[i];
        var r = Math.round(255 + (pc[0] - 255) * agitationNorm);
        var g = Math.round(255 + (pc[1] - 255) * agitationNorm);
        var b = Math.round(255 + (pc[2] - 255) * agitationNorm);

        ctx.fillStyle = 'rgba(' + r + ',' + g + ',' + b + ',' + brightness + ')';
        ctx.beginPath();
        if (ctx.roundRect) {
          ctx.roundRect(bx, centerY - barHeight / 2, barWidth, barHeight, barWidth / 2);
        } else {
          ctx.rect(bx, centerY - barHeight / 2, barWidth, barHeight);
        }
        ctx.fill();
      }
    }

    function draw() {
      var W = canvas.offsetWidth;
      var H = canvas.offsetHeight;
      drawBars(W, H, false);
      time += 0.014;
      rafId = requestAnimationFrame(draw);
    }

    if (prefersReducedMotion) {
      drawBars(canvas.offsetWidth, canvas.offsetHeight, true);
      return;
    }

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting && !isVisible) {
          isVisible = true;
          draw();
        } else if (!entry.isIntersecting && isVisible) {
          isVisible = false;
          if (rafId) cancelAnimationFrame(rafId);
        }
      });
    }, { threshold: 0.1 });

    observer.observe(section);
  }

  initWaveformPhrase();
  initWaveform();

  /* ------------------------------------------
     SUGGEST MODAL
     ------------------------------------------ */

  function initSuggestModal() {
    var card = document.getElementById('suggestCardBtn');
    var modal = document.getElementById('suggestModal');
    var overlay = document.getElementById('suggestModalOverlay');
    var closeBtn = document.getElementById('suggestModalClose');
    var form = document.getElementById('suggestForm');
    var success = document.getElementById('suggestSuccess');

    if (!card || !modal) return;

    function openModal() {
      modal.setAttribute('aria-hidden', 'false');
      modal.classList.add('suggest-modal--open');
      document.body.style.overflow = 'hidden';
      var firstInput = modal.querySelector('input, textarea');
      if (firstInput) setTimeout(function () { firstInput.focus(); }, 50);
    }

    function closeModal() {
      modal.classList.remove('suggest-modal--open');
      modal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }

    card.addEventListener('click', openModal);
    card.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openModal(); }
    });
    closeBtn.addEventListener('click', closeModal);
    overlay.addEventListener('click', closeModal);
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeModal();
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var data = new FormData(form);
      var btn = form.querySelector('.suggest-modal__submit');
      btn.disabled = true;
      btn.textContent = 'A enviar...';

      fetch(form.action, {
        method: 'POST',
        body: data,
        headers: { 'Accept': 'application/json' }
      }).then(function (res) {
        if (res.ok) {
          form.reset();
          success.textContent = 'Idea received. Thank you — we will read it carefully.';
          btn.disabled = false;
          btn.innerHTML = 'Enviar ideia <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>';
          setTimeout(closeModal, 2800);
        } else {
          success.textContent = 'Algo correu mal. Tenta de novo ou envia para contact@kindtech.pt';
          btn.disabled = false;
          btn.innerHTML = 'Enviar ideia <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>';
        }
      }).catch(function () {
        success.textContent = 'Erro de ligação. Tenta de novo.';
        btn.disabled = false;
        btn.innerHTML = 'Enviar ideia <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>';
      });
    });
  }

  initSuggestModal();

  /* ------------------------------------------
     PROFILE CARDS — Tilt engine (spring physics)
     ------------------------------------------ */

  function initProfileCards() {
    var wrappers = document.querySelectorAll('.pc-card-wrapper');
    if (!wrappers.length) return;

    /* --------------------------------------------------
       Scattered icon mask — a few instances of the logo
       placed at deliberate positions (some cut by edges),
       drawn onto a card-sized canvas so we get the same
       scattered look as the React Bits reference, not a grid.
       -------------------------------------------------- */
    var ICON_URL = 'assets/board/icon-pattern.png';
    var CARD_W   = 220;
    var CARD_H   = 300;

    // Positions: [x, y, size, alpha] — relative to card top-left
    // Some intentionally off-edge so they appear partially cut
    var ICON_POSITIONS = [
      [-14,  18, 68, 0.55],   // top-left, cut by left edge
      [162,  -8, 64, 0.50],   // top-right, cut by top-right corner
      [  6, 118, 72, 0.48],   // mid-left
      [144, 104, 70, 0.72],   // mid-right (most prominent)
      [ 76, 218, 66, 0.42],   // lower-centre
      [154, 200, 62, 0.38]    // lower-right, partially cut
    ];

    function buildScatteredMask(iconImg) {
      var c = document.createElement('canvas');
      c.width  = CARD_W;
      c.height = CARD_H;
      var ctx = c.getContext('2d');
      ICON_POSITIONS.forEach(function (p) {
        ctx.globalAlpha = p[3];
        ctx.drawImage(iconImg, p[0], p[1], p[2], p[2]);
      });
      return c.toDataURL('image/png');
    }

    // Load icon, then apply mask to every .pc-shine
    var iconImg = new Image();
    iconImg.onload = function () {
      var maskDataUrl = buildScatteredMask(iconImg);
      document.querySelectorAll('.pc-card-wrapper .pc-shine').forEach(function (shine) {
        shine.style.maskImage       = 'url(' + maskDataUrl + ')';
        shine.style.webkitMaskImage = 'url(' + maskDataUrl + ')';
        shine.style.maskSize        = '100% 100%';
        shine.style.webkitMaskSize  = '100% 100%';
        shine.style.maskRepeat      = 'no-repeat';
        shine.style.webkitMaskRepeat = 'no-repeat';
      });
    };
    iconImg.src = ICON_URL;

    /* --------------------------------------------------
       Tilt engine — matches original component math
       --rotate-x = -(centerX / 5)  →  used for rotateY
       --rotate-y =  (centerY / 4)  →  used for rotateX
       -------------------------------------------------- */
    var SPRING = 0.14;

    wrappers.forEach(function (wrapper) {
      var card = wrapper.querySelector('.pc-card');
      if (!card) return;

      // mask-image applied globally after icon loads (see buildScatteredMask above)

      // Per-card tilt state (percentages 0-100, matching original)
      var curX = 50, curY = 50;
      var tgtX = 50, tgtY = 50;
      var isHovered = false;
      var rafId = null;

      function clamp(v, lo, hi) { return Math.min(hi, Math.max(lo, v)); }
      function adjust(v, fMin, fMax, tMin, tMax) {
        return tMin + ((tMax - tMin) * (v - fMin)) / (fMax - fMin);
      }

      function applyVars(px, py) {
        var cx = px - 50;
        var cy = py - 50;
        wrapper.style.setProperty('--pointer-x',           px.toFixed(1) + '%');
        wrapper.style.setProperty('--pointer-y',           py.toFixed(1) + '%');
        wrapper.style.setProperty('--background-x',        adjust(px, 0, 100, 35, 65).toFixed(1) + '%');
        wrapper.style.setProperty('--background-y',        adjust(py, 0, 100, 35, 65).toFixed(1) + '%');
        wrapper.style.setProperty('--pointer-from-left',   (px / 100).toFixed(3));
        wrapper.style.setProperty('--pointer-from-top',    (py / 100).toFixed(3));
        wrapper.style.setProperty('--pointer-from-center', clamp(Math.hypot(cy, cx) / 50, 0, 1).toFixed(3));
        // CSS: rotateX(--rotate-y) rotateY(--rotate-x)
        wrapper.style.setProperty('--rotate-x',            (-(cx / 5)).toFixed(2) + 'deg');
        wrapper.style.setProperty('--rotate-y',            (cy / 4).toFixed(2) + 'deg');
      }

      function tick() {
        curX += (tgtX - curX) * SPRING;
        curY += (tgtY - curY) * SPRING;
        applyVars(curX, curY);
        var stillMoving = Math.abs(tgtX - curX) > 0.05 || Math.abs(tgtY - curY) > 0.05;
        if (stillMoving || isHovered) {
          rafId = requestAnimationFrame(tick);
        } else {
          rafId = null;
        }
      }

      function startLoop() {
        if (!rafId) rafId = requestAnimationFrame(tick);
      }

      wrapper.addEventListener('pointerenter', function (e) {
        isHovered = true;
        wrapper.style.setProperty('--card-opacity', '1');
        card.classList.add('active');
        var rect = wrapper.getBoundingClientRect();
        tgtX = clamp((100 / (rect.width  || 1)) * (e.clientX - rect.left), 0, 100);
        tgtY = clamp((100 / (rect.height || 1)) * (e.clientY - rect.top),  0, 100);
        startLoop();
      });

      wrapper.addEventListener('pointermove', function (e) {
        var rect = wrapper.getBoundingClientRect();
        tgtX = clamp((100 / (rect.width  || 1)) * (e.clientX - rect.left), 0, 100);
        tgtY = clamp((100 / (rect.height || 1)) * (e.clientY - rect.top),  0, 100);
        startLoop();
      }, { passive: true });

      wrapper.addEventListener('pointerleave', function () {
        isHovered = false;
        tgtX = 50;
        tgtY = 50;
        wrapper.style.setProperty('--card-opacity', '0');
        card.classList.remove('active');
        startLoop();
      });

      // Initial settle animation (top-right → center, like original)
      var rect = wrapper.getBoundingClientRect();
      curX = (rect.width  || 220) - 70;
      curY = 60;
      applyVars(curX, curY);
      tgtX = 50;
      tgtY = 50;
      startLoop();
    });
  }

  /* ------------------------------------------
     HERO NOTE NOTIFICATION
     ------------------------------------------ */
  var heroNote = document.getElementById('heroNote');
  if (heroNote) {
    var heroNoteShown = false;
    var heroNoteTimer = null;

    function updateHeroNote() {
      var heroSection = document.getElementById('hero');
      var threshold = heroSection ? heroSection.offsetHeight * 0.5 : 400;
      var atTop = window.scrollY < threshold;

      if (atTop && !heroNoteShown) {
        heroNoteTimer = setTimeout(function() {
          heroNote.classList.add('is-visible');
          heroNoteShown = true;
        }, heroNoteShown ? 0 : 1400);
      } else if (!atTop) {
        clearTimeout(heroNoteTimer);
        heroNote.classList.remove('is-visible');
        heroNoteShown = false;
      }
    }

    updateHeroNote();
    window.addEventListener('scroll', updateHeroNote, { passive: true });
  }

  initProfileCards();

  /* ------------------------------------------
     BOARD TEXT FIT (meet the board)
     Binary-search each member's text max-width
     so the text block fills the card height.
     ------------------------------------------ */
  function fitBoardTextToCards() {
    document.querySelectorAll('.board-member').forEach(function(member) {
      var cardEl  = member.querySelector('.board-member__card');
      var textEl  = member.querySelector('.board-member__text');
      var bodyEl  = member.querySelector('.board-member__body');
      if (!cardEl || !textEl || !bodyEl) return;

      var targetH = cardEl.offsetHeight;
      var availW  = bodyEl.offsetWidth - 40; // subtract padding-left on text
      if (availW <= 0 || targetH <= 0) return;

      // Binary search: find the narrowest width where height <= targetH
      // Narrower = more lines = taller; wider = fewer lines = shorter
      var lo = 180, hi = availW, best = availW;
      for (var i = 0; i < 20; i++) {
        var mid = Math.round((lo + hi) / 2);
        textEl.style.maxWidth = mid + 'px';
        if (textEl.offsetHeight <= targetH) {
          best = mid;   // works — try even narrower
          hi = mid - 1;
        } else {
          lo = mid + 1; // too tall — need wider
        }
      }
      textEl.style.maxWidth = best + 'px';
    });
  }

  if (document.querySelector('.board-member')) {
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(fitBoardTextToCards);
    } else {
      setTimeout(fitBoardTextToCards, 120);
    }
    var _fitDebounce;
    window.addEventListener('resize', function() {
      clearTimeout(_fitDebounce);
      _fitDebounce = setTimeout(fitBoardTextToCards, 150);
    }, { passive: true });
  }

})();
