/* ==========================================================================
   공공미리 — Shared Navigation, Modal, FAQ & Interactive Helpers
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
    window.addEventListener('resize', () => {
      if (window.innerWidth > 820 && drawer.classList.contains('open')) {
        drawer.classList.remove('open');
        menuBtn.setAttribute('aria-expanded', 'false');
      }
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

  // Scroll-spy for index anchor (#pricing) + Back-to-top button
  const pricingSec = document.getElementById('pricing');
  const navIntro = document.querySelector('.nav-links a[href="./index.html"]');
  const navPricing = document.querySelector('.nav-links a[href="#pricing"]');

  function updateNavSpy() {
    if (!pricingSec || !navIntro || !navPricing) return;
    const rect = pricingSec.getBoundingClientRect();
    const inPricing = rect.top <= 160 && rect.bottom > 160;
    navIntro.classList.toggle('active', !inPricing);
    navPricing.classList.toggle('active', inPricing);
  }

  const topBtn = document.createElement('button');
  topBtn.type = 'button';
  topBtn.className = 'back-to-top no-print';
  topBtn.setAttribute('aria-label', '맨 위로 이동');
  topBtn.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><polyline points="18 15 12 9 6 15"></polyline></svg>';
  document.body.appendChild(topBtn);
  topBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  window.addEventListener('scroll', () => {
    topBtn.classList.toggle('show', window.scrollY > 420);
    updateNavSpy();
  }, { passive: true });
})();
