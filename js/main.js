/* ==========================================
   KIND TECH - MAIN JAVASCRIPT
   ========================================== */

(function () {
  'use strict';

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
     HERO - Typewriter animation
     ------------------------------------------ */

  function initHeroAnimation() {
    var titleEl = document.getElementById('heroTitle');
    var textSpan = titleEl.querySelector('.hero__title-text');
    var canvas = document.getElementById('heroCanvas');

    if (!textSpan) return;

    // Hide canvas — not needed for typewriter
    if (canvas) canvas.style.display = 'none';

    // Parse HTML into tokens: text chars, line breaks, italic spans, and gradient spans
    var tokens = [];
    var html = textSpan.innerHTML;
    var inEm = false;
    var inGradient = false;
    var gradientOpenTag = 'hero__gradient-text';
    var i = 0;
    while (i < html.length) {
      if (html.substr(i, 3).toLowerCase() === '<br') {
        var brClose = html.indexOf('>', i);
        var brTag = html.substring(i, brClose + 1);
        var brClass = '';
        var classMatch = brTag.match(/class="([^"]*)"/);
        if (classMatch) brClass = classMatch[1];
        tokens.push({ type: 'br', className: brClass });
        i = brClose + 1;
      } else if (html.substr(i, 4).toLowerCase() === '<em>') {
        inEm = true;
        i += 4;
      } else if (html.substr(i, 5).toLowerCase() === '</em>') {
        inEm = false;
        i += 5;
      } else if (html.charAt(i) === '<' && html.indexOf(gradientOpenTag, i) !== -1 && html.indexOf(gradientOpenTag, i) - i < 60) {
        inGradient = true;
        var close = html.indexOf('>', i);
        i = close + 1;
      } else if (html.substr(i, 7) === '</span>') {
        inGradient = false;
        i += 7;
      } else if (html.charAt(i) === '<') {
        var close = html.indexOf('>', i);
        i = close + 1;
      } else {
        var ch = html.charAt(i);
        if (ch.trim() !== '' || tokens.length > 0) {
          tokens.push({ type: 'char', char: ch, italic: inEm, gradient: inGradient });
        }
        i++;
      }
    }
    // Trim leading/trailing whitespace tokens
    while (tokens.length && tokens[0].type === 'char' && tokens[0].char.trim() === '') tokens.shift();
    while (tokens.length && tokens[tokens.length - 1].type === 'char' && tokens[tokens.length - 1].char.trim() === '') tokens.pop();

    textSpan.textContent = '';
    textSpan.classList.add('hero__title-text--typing');

    // Add cursor element
    var cursor = document.createElement('span');
    cursor.className = 'typewriter-cursor';
    cursor.textContent = '|';
    textSpan.appendChild(cursor);

    var tokenIndex = 0;
    var baseSpeed = 55;
    var currentEm = null; // track active <em> wrapper
    var currentGradient = null; // track active gradient wrapper

    function typeNext() {
      if (tokenIndex >= tokens.length) {
        // Typing done — cursor keeps blinking forever
        currentEm = null;
        currentGradient = null;
        return;
      }

      var token = tokens[tokenIndex];
      if (token.type === 'br') {
        currentEm = null;
        currentGradient = null;
        var brEl = document.createElement('br');
        if (token.className) brEl.className = token.className;
        textSpan.insertBefore(brEl, cursor);
      } else {
        if (token.gradient) {
          if (!currentGradient) {
            currentGradient = document.createElement('span');
            currentGradient.className = 'hero__gradient-text';
            textSpan.insertBefore(currentGradient, cursor);
          }
          currentGradient.appendChild(document.createTextNode(token.char));
        } else if (token.italic) {
          currentGradient = null;
          if (!currentEm) {
            currentEm = document.createElement('em');
            textSpan.insertBefore(currentEm, cursor);
          }
          currentEm.appendChild(document.createTextNode(token.char));
        } else {
          currentEm = null;
          currentGradient = null;
          textSpan.insertBefore(document.createTextNode(token.char), cursor);
        }
      }
      tokenIndex++;

      var char = token.type === 'br' ? '\n' : token.char;

      // Variable speed: pause longer on punctuation
      var delay = baseSpeed;
      if (char === '.' || char === ',' || char === '—') {
        delay = 280;
      } else if (char === ' ') {
        delay = 40;
      } else {
        // Slight random variation for natural feel
        delay = baseSpeed + Math.random() * 30;
      }

      setTimeout(typeNext, delay);
    }

    typeNext();
  }

  // Start hero animation after a brief delay
  setTimeout(initHeroAnimation, 600);


  /* ------------------------------------------
     CONTACT FORM
     ------------------------------------------ */

  var contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();

      var btn = contactForm.querySelector('.form__submit');
      var originalText = btn.innerHTML;
      btn.innerHTML = 'Sent';
      btn.style.opacity = '0.6';
      btn.disabled = true;

      setTimeout(function () {
        btn.innerHTML = originalText;
        btn.style.opacity = '';
        btn.disabled = false;
        contactForm.reset();
      }, 2500);
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
  }

  initPartnerCarousel();

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
