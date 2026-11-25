/* ==========================================================================
   Agency Dashboard — Interactive Stage Funnel & Company Pipeline Table
   ========================================================================== */

(function () {
  // Base background counts to match business plan wireframe (38 / 14 / 6 / 2 = 60 total)
  // Top 10 editable sample companies + 50 background cohort companies
  const BASE_OFFSETS = { '진단': 35, '접촉': 11, '제안': 4, '계약': 0 };

  const COMPANIES = [
    { id: 1, name: '(주)그린센서테크', sector: '환경·계측', score: 62, stage: '접촉', recent: '○○시 환경과 사전규격 의견등록 완료', next: '하반기 공공구매 상담회 매칭' },
    { id: 2, name: '(주)아산세이프티', sector: '안전·방재', score: 84, stage: '계약', recent: '○○교육청 실내안전 장치 수의계약 성사 (1,850만원)', next: '인근 3개 교육지원청 레퍼런스 확산' },
    { id: 3, name: '충남에코에너지', sector: '에너지·절감', score: 78, stage: '제안', recent: '충남도청 탄소중립 시범구매 1쪽 제안서 제출', next: '사용부서 현장 시연 일정 조율' },
    { id: 4, name: '(주)호서로보틱스', sector: '로봇·자동화', score: 54, stage: '진단', recent: '진입 준비도 진단 완료 (직접생산확인 미보유)', next: '직접생산확인 신청 및 1쪽 소개서 코칭' },
    { id: 5, name: '천안스마트모빌리티', sector: '교통·안전', score: 88, stage: '계약', recent: '○○시 교통정책과 소액 수의계약 완료 (1,920만원)', next: '차년도 본예산(6~8월) 확대 사업 연계' },
    { id: 6, name: '(주)서해워터솔루션', sector: '수질·환경', score: 71, stage: '접촉', recent: '○○시설관리공단 담당자 1차 미팅 완료', next: '3월 발주계획 대비 시험성적서 보완' },
    { id: 7, name: '백제바이오팜', sector: '바이오·위생', score: 48, stage: '진단', recent: '진입 준비도 진단 완료 (나라장터 등록 진행중)', next: '공공시장 진입 반일 워크숍 참가 안내' },
    { id: 8, name: '(주)내포클라우드', sector: 'IT·SW', score: 76, stage: '제안', recent: '○○공단 유지보수 사전규격 의견등록 완료', next: 'GS인증·SW직접생산확인 증빙 점검' },
    { id: 9, name: '당진스틸안전', sector: '기계·시설', score: 66, stage: '접촉', recent: '아산시 안전총괄과 1쪽 소개서 전달', next: '현장 데모 샘플 시연 지원' },
    { id: 10, name: '(주)온양에듀테크', sector: '교육·콘텐츠', score: 58, stage: '진단', recent: '진입 준비도 진단 완료 (학교장터 S2B 미등록)', next: 'S2B 등록 가이드 제공' }
  ];

  const STAGES = [
    { key: '진단', color: '#0F2544', desc: '준비도 진단 완료' },
    { key: '접촉', color: '#1D3E6E', desc: '의견등록·부서 미팅' },
    { key: '제안', color: '#2563EB', desc: '수의계약·시범구매 제안' },
    { key: '계약', color: '#D95D1E', desc: '첫 공공매출 달성' }
  ];

  let activeStage = 'all';
  let query = '';

  const funnelGrid = document.getElementById('funnelGrid');
  const tbody = document.getElementById('companyTableBody');
  const kpiContract = document.getElementById('kpiContract');
  const showAllBtn = document.getElementById('showAllStagesBtn');

  function getCounts() {
    const counts = { ...BASE_OFFSETS };
    COMPANIES.forEach((c) => {
      counts[c.stage] = (counts[c.stage] || 0) + 1;
    });
    return counts;
  }

  function render() {
    const counts = getCounts();
    const maxCount = Math.max(...Object.values(counts), 1);

    if (kpiContract) kpiContract.textContent = `${counts['계약']}개사`;

    funnelGrid.innerHTML = STAGES.map((s) => {
      const cnt = counts[s.key] || 0;
      const pct = Math.max(8, Math.round((cnt / maxCount) * 100));
      return `
        <button type="button" class="funnel-btn ${activeStage === s.key ? 'active' : ''}" data-stage="${s.key}">
          <div style="display:flex;justify-content:space-between;align-items:baseline;">
            <strong style="font-size:15px;color:var(--navy);">${s.key}</strong>
            <span class="num" style="font-size:24px;font-weight:800;color:${s.color};">${cnt}</span>
          </div>
          <div class="funnel-bar-bg">
            <div class="funnel-bar-fill" style="width:${pct}%;background:${s.color};"></div>
          </div>
          <div style="font-size:12px;color:var(--muted);">${s.desc}</div>
        </button>
      `;
    }).join('');

    funnelGrid.querySelectorAll('.funnel-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        activeStage = btn.getAttribute('data-stage');
        showAllBtn?.classList.remove('active');
        render();
      });
    });

    const filtered = COMPANIES.filter((c) => {
      const matchStage = activeStage === 'all' || c.stage === activeStage;
      const q = query.trim().toLowerCase();
      const matchQ = !q || `${c.name} ${c.sector} ${c.recent}`.toLowerCase().includes(q);
      return matchStage && matchQ;
    });

    tbody.innerHTML = filtered.map((c) => `
      <tr>
        <td style="font-weight:700;color:var(--navy);">${c.name}</td>
        <td>${c.sector}</td>
        <td><span class="badge ${c.score >= 75 ? 'badge-teal' : c.score >= 60 ? 'badge-accent' : 'badge-gray'} num">${c.score}점</span></td>
        <td>
          <select class="stage-select" data-cid="${c.id}" aria-label="${c.name} 진행 단계">
            ${STAGES.map((s) => `<option value="${s.key}" ${c.stage === s.key ? 'selected' : ''}>${s.key}</option>`).join('')}
          </select>
        </td>
        <td>${c.recent}</td>
        <td style="color:var(--navy);font-weight:600;">${c.next}</td>
      </tr>
    `).join('');

    tbody.querySelectorAll('.stage-select').forEach((sel) => {
      sel.addEventListener('change', () => {
        const id = Number(sel.getAttribute('data-cid'));
        const target = COMPANIES.find((c) => c.id === id);
        if (target) {
          target.stage = sel.value;
          render();
        }
      });
    });
  }

  showAllBtn?.addEventListener('click', () => {
    activeStage = 'all';
    showAllBtn.classList.add('active');
    render();
  });

  document.getElementById('companySearch')?.addEventListener('input', (e) => {
    query = e.target.value;
    render();
  });

  render();
})();
