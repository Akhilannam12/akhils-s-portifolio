/* ============================================================
   Annam Akhil — Portfolio Scripts
   1. Theme toggle (persisted in localStorage)
   2. Mobile hamburger menu
   3. Navbar scroll state + active link highlighting
   4. Typing effect (hero role)
   5. Scroll reveal (IntersectionObserver)
   6. Project card cursor glow
   7. Contact form validation (UI only)
   8. Scroll-to-top button + dynamic year
   ============================================================ */

(function () {
  'use strict';

  /* ---------- 1. THEME TOGGLE ---------- */
  const root = document.documentElement;
  const themeToggle = document.getElementById('theme-toggle');
  const storedTheme = localStorage.getItem('theme');

  if (storedTheme) {
    root.setAttribute('data-theme', storedTheme);
  }

  themeToggle.addEventListener('click', () => {
    const next =
      root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
    // Keep browser UI chrome in sync
    document
      .querySelector('meta[name="theme-color"]')
      ?.setAttribute('content', next === 'dark' ? '#0a0e1a' : '#f6f7fb');
  });

  /* ---------- 2. MOBILE MENU ---------- */
  const hamburger = document.getElementById('hamburger');
  const navMenu = document.getElementById('nav-menu');

  function closeMenu() {
    navMenu.classList.remove('open');
    hamburger.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  hamburger.addEventListener('click', () => {
    const isOpen = navMenu.classList.toggle('open');
    hamburger.classList.toggle('open', isOpen);
    hamburger.setAttribute('aria-expanded', String(isOpen));
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  // Close menu when a link is clicked or Escape is pressed
  navMenu.querySelectorAll('.nav-link').forEach((link) =>
    link.addEventListener('click', closeMenu)
  );
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeMenu();
  });

  /* ---------- 3. NAVBAR SCROLL STATE + ACTIVE LINKS ---------- */
  const navbar = document.getElementById('navbar');
  const sections = [...document.querySelectorAll('main section[id]')];
  const navLinks = [...document.querySelectorAll('.nav-link')];

  function onScroll() {
    navbar.classList.toggle('scrolled', window.scrollY > 30);

    let currentId = sections[0]?.id;
    for (const section of sections) {
      if (window.scrollY >= section.offsetTop - 120) {
        currentId = section.id;
      }
    }
    navLinks.forEach((link) =>
      link.classList.toggle('active', link.getAttribute('href') === '#' + currentId)
    );
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- 4. TYPING EFFECT ---------- */
  const typingEl = document.getElementById('typing-text');
  const roles = [
    'Software Engineer',
    'Java Backend Developer',
    'Spring Boot Enthusiast',
    'Problem Solver'
  ];

  if (typingEl) {
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    if (prefersReducedMotion) {
      typingEl.textContent = roles[0];
    } else {
      let roleIndex = 0;
      let charIndex = 0;
      let deleting = false;

      (function type() {
        const word = roles[roleIndex];

        typingEl.textContent = word.slice(0, charIndex);

        if (!deleting && charIndex < word.length) {
          charIndex++;
          setTimeout(type, 85);
        } else if (!deleting) {
          deleting = true;
          setTimeout(type, 1800); // pause at full word
        } else if (charIndex > 0) {
          charIndex--;
          setTimeout(type, 45);
        } else {
          deleting = false;
          roleIndex = (roleIndex + 1) % roles.length;
          setTimeout(type, 400);
        }
      })();
    }
  }

  /* ---------- 5. SCROLL REVEAL ---------- */
  const revealEls = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target); // animate once only
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );
    revealEls.forEach((el) => observer.observe(el));
  } else {
    // Fallback for very old browsers
    revealEls.forEach((el) => el.classList.add('visible'));
  }

  /* ---------- 6. PROJECT CARD CURSOR GLOW ---------- */
  document.querySelectorAll('.project-card').forEach((card) => {
    card.addEventListener('pointermove', (e) => {
      const rect = card.getBoundingClientRect();
      card.style.setProperty('--mx', e.clientX - rect.left + 'px');
      card.style.setProperty('--my', e.clientY - rect.top + 'px');
    });
  });

  /* ---------- 7. CONTACT FORM (UI ONLY) ---------- */
  const form = document.getElementById('contact-form');
  const note = document.getElementById('form-note');

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = form.name.value.trim();
      const email = form.email.value.trim();
      const message = form.message.value.trim();
      const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

      note.classList.remove('success', 'error');

      if (!name || !email || !message) {
        showNote('Please fill in all required fields.', 'error');
        return;
      }
      if (!emailValid) {
        showNote('Please enter a valid email address.', 'error');
        return;
      }

      // No backend — open the visitor's mail client with a pre-filled draft
      const subject = encodeURIComponent(
        form.subject.value.trim() || 'Portfolio contact from ' + name
      );
      const body = encodeURIComponent(message + '\n\n— ' + name + ' (' + email + ')');
      window.location.href =
        'mailto:akhilannam81@gmail.com?subject=' + subject + '&body=' + body;

      showNote('Opening your email client… Thank you for reaching out!', 'success');
      form.reset();
    });

    function showNote(text, type) {
      note.textContent = text;
      note.classList.add(type);
    }
  }

  /* ---------- 8. SCROLL-TO-TOP + YEAR ---------- */
  const scrollTopBtn = document.getElementById('scroll-top');

  window.addEventListener('scroll', () => {
    scrollTopBtn.classList.toggle('show', window.scrollY > 600);
  }, { passive: true });

  scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  document.getElementById('year').textContent = new Date().getFullYear();
})();
