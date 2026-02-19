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
      { title: 'Conversational Systems', desc: 'Structured, domain-aware AI built for reliable human interaction.' },
      { title: 'Grounded Intelligence', desc: 'AI constrained to verified knowledge domains for precise responses.' },
      { title: 'System Integration', desc: 'Seamless AI integration into existing digital environments.' },
      { title: 'Real-Time AI', desc: 'Low-latency systems designed for fluid interaction.' },
      { title: 'Voice Intelligence', desc: 'Natural speech interfaces for adaptive human–AI communication.' },
      { title: 'AI Architecture', desc: 'Scalable, production-grade AI systems built for reliability.' }
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
      {
        parts: [
          { text: 'enterprises', className: 'hero__title-part--italic' },
          { text: ' and ', className: 'hero__title-part--bold' },
          { breakClass: 'hero__br--mobile' },
          { text: 'consumers.', className: 'hero__title-part--italic' }
        ]
      },
      {
        parts: [
          { text: 'systems', className: 'hero__title-part--italic' },
          { text: ' and ' },
          { text: 'people.', className: 'hero__title-part--italic' }
        ]
      },
      {
        parts: [
          { text: 'real-world impact.', className: 'hero__title-part--italic' }
        ]
      }
    ];
    var prefersReducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var typeDelay = 58;
    var deleteDelay = 30;
    var holdDelay = 10000;
    var introDelay = 62;
    var introStartDelay = 420;
    var timer = null;
    var phraseIndex = 0;
    var charIndex = 0;
    var mode = 'intro';
    var isIdle = false;
    var introIndex = 0;
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
        phraseIndex = (phraseIndex + 1) % phrases.length;
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

    var images = [1, 2, 3, 4, 5, 6, 7];
    
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

    var images = [1, 2, 3, 4];

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
    applyCarouselLoopDistance(recognizedTrack, 7);
    applyCarouselLoopDistance(partnerTrack, 4);
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
})();
