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
     HERO - Typewriter animation
     ------------------------------------------ */

  function initHeroAnimation() {
    var titleEl = document.getElementById('heroTitle');
    var textSpan = titleEl.querySelector('.hero__title-text');
    var canvas = document.getElementById('heroCanvas');

    if (!textSpan) return;

    // Hide canvas — not needed for typewriter
    if (canvas) canvas.style.display = 'none';

    // Parse HTML into tokens: text chars, line breaks, and italic spans
    var tokens = [];
    var html = textSpan.innerHTML;
    var inEm = false;
    var i = 0;
    while (i < html.length) {
      if (html.substr(i, 4).toLowerCase() === '<br>' || html.substr(i, 5).toLowerCase() === '<br/>' || html.substr(i, 6).toLowerCase() === '<br />') {
        tokens.push({ type: 'br' });
        i += html.charAt(i + 3) === '>' ? 4 : html.indexOf('>', i) + 1 - i;
      } else if (html.substr(i, 4).toLowerCase() === '<em>') {
        inEm = true;
        i += 4;
      } else if (html.substr(i, 5).toLowerCase() === '</em>') {
        inEm = false;
        i += 5;
      } else if (html.charAt(i) === '<') {
        // skip other tags
        var close = html.indexOf('>', i);
        i = close + 1;
      } else {
        var ch = html.charAt(i);
        if (ch.trim() !== '' || tokens.length > 0) {
          tokens.push({ type: 'char', char: ch, italic: inEm });
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

    function typeNext() {
      if (tokenIndex >= tokens.length) {
        // Typing done — keep cursor blinking for a moment, then fade it out
        currentEm = null;
        setTimeout(function () {
          cursor.classList.add('typewriter-cursor--fade');
        }, 1500);
        return;
      }

      var token = tokens[tokenIndex];
      if (token.type === 'br') {
        currentEm = null;
        textSpan.insertBefore(document.createElement('br'), cursor);
      } else {
        if (token.italic) {
          if (!currentEm) {
            currentEm = document.createElement('em');
            textSpan.insertBefore(currentEm, cursor);
          }
          currentEm.appendChild(document.createTextNode(token.char));
        } else {
          currentEm = null;
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
})();
