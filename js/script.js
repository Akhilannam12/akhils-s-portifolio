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

  // Enforce dark mode as the default on every open / fresh load
  root.setAttribute('data-theme', 'dark');
  try {
    localStorage.removeItem('theme');
  } catch (e) {
    // Restricted environment fallback
  }

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const current = root.getAttribute('data-theme') || 'dark';
      const next = current === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-theme', next);
      // Keep browser UI chrome in sync
      document
        .querySelector('meta[name="theme-color"]')
        ?.setAttribute('content', next === 'dark' ? '#0a0e1a' : '#f6f7fb');
    });
  }

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
    'Freelance Software Developer',
    'Custom SaaS & CRM Builder',
    'Mobile App Developer (Flutter)',
    'Java Backend Architect'
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

  /* ---------- 6. CARD CURSOR GLOW (PROJECTS & SERVICES) ---------- */
  document.querySelectorAll('.project-card, .service-card, .redirect-card').forEach((card) => {
    card.addEventListener('pointermove', (e) => {
      const rect = card.getBoundingClientRect();
      card.style.setProperty('--mx', e.clientX - rect.left + 'px');
      card.style.setProperty('--my', e.clientY - rect.top + 'px');
    });
  });

  /* ---------- 7. CONTACT FORM (LEAD STORAGE + MAILTO) ---------- */
  const form = document.getElementById('contact-form');
  const note = document.getElementById('form-note');

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = form.name.value.trim();
      const email = form.email.value.trim();
      const phone = form.phone ? form.phone.value.trim() : '';
      const service = form.service ? form.service.value : 'Custom Software Project';
      const userSubject = form.subject.value.trim();
      const message = form.message.value.trim();
      const termsAccepted = form.terms ? form.terms.checked : true;
      const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
      const phoneValid = !phone || /^[\d\s\+\-\(\)]{7,20}$/.test(phone);

      note.classList.remove('success', 'error');

      if (!name || !email || !phone || !message) {
        showNote('Please fill in all required fields.', 'error');
        return;
      }
      if (!emailValid) {
        showNote('Please enter a valid email address.', 'error');
        return;
      }
      if (!phoneValid) {
        showNote('Please enter a valid phone / WhatsApp number.', 'error');
        form.phone?.focus();
        return;
      }
      if (!termsAccepted) {
        showNote('Please agree to the Terms & Conditions before submitting.', 'error');
        form.terms?.focus();
        return;
      }

      // Persist lead directly into localStorage for the Admin Portal
      const newLead = {
        id: 'lead_' + Date.now(),
        timestamp: new Date().toISOString(),
        name: name,
        email: email,
        phone: phone,
        service: service,
        subject: userSubject || `Inquiry for ${service}`,
        message: message,
        termsAccepted: true,
        status: 'new'
      };

      try {
        const storedLeads = localStorage.getItem('akhil_portfolio_leads');
        const leads = storedLeads ? JSON.parse(storedLeads) : [];
        leads.unshift(newLead);
        localStorage.setItem('akhil_portfolio_leads', JSON.stringify(leads));
      } catch (err) {
        console.warn('Could not store lead to localStorage:', err);
      }

      // Open visitor's mail client with a structured pre-filled draft
      const finalSubject = encodeURIComponent(
        userSubject ? `${userSubject} [${service}]` : `Inquiry for ${service} — ${name}`
      );
      const finalBody = encodeURIComponent(
        `Service / Project Type: ${service}\n\nClient Name: ${name}\nClient Email: ${email}\nClient Phone / WhatsApp: ${phone || 'N/A'}\n\nProject Scope & Message:\n${message}\n\nTerms Accepted: Yes\n\n— Sent via akhilannam.dev`
      );

      showNote('Inquiry recorded successfully! Opening your email client to send direct copy…', 'success');
      form.reset();

      setTimeout(() => {
        window.location.href = `mailto:akhilannam81@gmail.com?subject=${finalSubject}&body=${finalBody}`;
      }, 600);
    });

    function showNote(text, type) {
      note.textContent = text;
      note.classList.add(type);
    }
  }

  /* ---------- 8. TERMS & CONDITIONS MODAL CONTROLLER ---------- */
  const termsModal = document.getElementById('terms-modal');
  const openTermsBtn = document.getElementById('open-terms-btn');
  const closeTermsBtn = document.getElementById('close-terms-btn');
  const acceptTermsBtn = document.getElementById('accept-terms-btn');
  const termsBackdrop = document.getElementById('terms-backdrop');
  const termsCheckbox = document.getElementById('cf-terms');

  function openTermsModal() {
    if (!termsModal) return;
    termsModal.classList.add('active');
    termsModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeTermsModal() {
    if (!termsModal) return;
    termsModal.classList.remove('active');
    termsModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  if (openTermsBtn) {
    openTermsBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      openTermsModal();
    });
  }

  if (closeTermsBtn) closeTermsBtn.addEventListener('click', closeTermsModal);
  if (termsBackdrop) termsBackdrop.addEventListener('click', closeTermsModal);

  if (acceptTermsBtn) {
    acceptTermsBtn.addEventListener('click', () => {
      if (termsCheckbox) {
        termsCheckbox.checked = true;
      }
      closeTermsModal();
      if (form) {
        const currentNote = document.getElementById('form-note');
        if (currentNote && currentNote.textContent.includes('Terms')) {
          currentNote.textContent = '';
          currentNote.className = 'form-note';
        }
      }
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && termsModal && termsModal.classList.contains('active')) {
      closeTermsModal();
    }
  });

  /* ---------- 9. INVISIBLE ADMIN SHORTCUTS ---------- */
  // 1. Keyboard Shortcut: Ctrl + Shift + A or Alt + A
  document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey && e.shiftKey && (e.key === 'A' || e.key === 'a')) ||
        (e.altKey && (e.key === 'A' || e.key === 'a'))) {
      e.preventDefault();
      window.location.href = 'admin.html';
    }
  });

  // 2. Secret Triple Click on Footer Copy text
  const footerCopy = document.querySelector('.footer-copy');
  if (footerCopy) {
    let clicks = 0;
    let clickTimeout = null;
    footerCopy.addEventListener('click', () => {
      clicks++;
      if (clicks === 3) {
        window.location.href = 'admin.html';
        clicks = 0;
      }
      clearTimeout(clickTimeout);
      clickTimeout = setTimeout(() => { clicks = 0; }, 600);
    });
  }

  /* ---------- 9. SCROLL-TO-TOP + YEAR ---------- */
  const scrollTopBtn = document.getElementById('scroll-top');

  window.addEventListener('scroll', () => {
    scrollTopBtn.classList.toggle('show', window.scrollY > 600);
  }, { passive: true });

  scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  document.getElementById('year').textContent = new Date().getFullYear();
})();
