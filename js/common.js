/* ==========================================================================
   공공판 길잡이 — Shared Navigation, Modal, FAQ & Interactive Helpers
   ========================================================================== */

(function () {
  // Mobile menu toggle
  const menuBtn = document.getElementById('menuToggle');
  const drawer = document.getElementById('mobileDrawer');
  if (menuBtn && drawer) {
    menuBtn.addEventListener('click', () => {
      const open = drawer.classList.toggle('open');
      menuBtn.setAttribute('aria-expanded', String(open));
    });
    drawer.querySelectorAll('a, button').forEach((el) => {
      el.addEventListener('click', () => {
        drawer.classList.remove('open');
        menuBtn.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // Pilot / Contact Modal
  const modal = document.getElementById('pilotModal');
  const openBtns = document.querySelectorAll('[data-open-modal="pilot"]');
  const closeBtn = document.getElementById('pilotModalClose');
  const form = document.getElementById('pilotForm');
  const formWrap = document.getElementById('pilotFormWrap');
  const formDone = document.getElementById('pilotFormDone');

  function openModal(presetType) {
    if (!modal) return;
    if (presetType) {
      const select = document.getElementById('inquiryType');
      if (select) select.value = presetType;
    }
    if (formWrap && formDone) {
      formWrap.style.display = 'block';
      formDone.style.display = 'none';
    }
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    if (!modal) return;
    modal.classList.remove('open');
    document.body.style.overflow = '';
  }

  openBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      openModal(btn.getAttribute('data-preset') || '');
    });
  });

  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });
  }
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
  });

  if (form && formWrap && formDone) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      formWrap.style.display = 'none';
      formDone.style.display = 'block';
    });
  }

  // FAQ Accordion
  document.querySelectorAll('.faq-q').forEach((btn) => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.faq-item');
      const isOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item').forEach((i) => i.classList.remove('open'));
      if (!isOpen) item.classList.add('open');
    });
  });

  // Progressive Scroll Reveal (safe fallback: stays visible if observer unavailable)
  const reveals = document.querySelectorAll('.reveal');
  if (reveals.length && 'IntersectionObserver' in window) {
    document.documentElement.classList.add('js-reveal-ready');
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08, rootMargin: '0px 0px -24px 0px' }
    );
    reveals.forEach((el) => io.observe(el));
  }
})();
