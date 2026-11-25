/* ==========================================================================
   Home Page — Showcase Tabs & Mini Readiness Widget
   ========================================================================== */

(function () {
  // Showcase Tabs
  const tabs = document.querySelectorAll('.showcase-tab');
  const panels = document.querySelectorAll('.showcase-panel');

  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      const key = tab.getAttribute('data-tab');
      tabs.forEach((t) => {
        const active = t === tab;
        t.classList.toggle('active', active);
        t.setAttribute('aria-selected', String(active));
      });
      panels.forEach((p) => {
        p.classList.toggle('active', p.getAttribute('data-panel') === key);
      });
    });
  });

  // Mini Diagnosis Interactive Score
  const checkboxes = document.querySelectorAll('.mini-q');
  const badge = document.getElementById('miniScoreBadge');
  const bar = document.getElementById('miniScoreBar');
  const gapBox = document.getElementById('miniGapBox');

  function updateMiniScore() {
    let score = 0;
    const missing = [];
    checkboxes.forEach((cb, idx) => {
      if (cb.checked) {
        score += Number(cb.value || 0);
      } else {
        const hints = [
          '나라장터 조달업체 등록',
          '기관용 1쪽 소개서 작성',
          '직접생산확인·혁신제품 자격 검토',
          '목표 기관 구매지도(예산·부서) 확인',
          '사전규격 의견등록·구매상담회 연계'
        ];
        missing.push(hints[idx]);
      }
    });
    if (badge) badge.textContent = `현재 ${score}점`;
    if (bar) bar.style.width = `${score}%`;
    if (gapBox) {
      if (missing.length === 0) {
        gapBox.innerHTML = '<strong style="color:var(--teal);">준비 완료:</strong> 즉시 사전규격 의견등록과 사용부서 미팅을 시작할 수 있습니다.';
      } else {
        gapBox.innerHTML = `<strong style="color:var(--accent);">우선 보완 추천:</strong> ${missing.slice(0, 2).join(' · ')}`;
      }
    }
  }

  checkboxes.forEach((cb) => cb.addEventListener('change', updateMiniScore));
  if (checkboxes.length) updateMiniScore();
})();
