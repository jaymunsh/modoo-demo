/* ==========================================================================
   Radar & Agency Procurement Map Interactive Logic
   ========================================================================== */

(function () {
  const OPPORTUNITIES = [
    {
      id: 'r1',
      org: '○○시 환경과',
      title: '대기측정기 구매 및 관제 연동',
      type: '사전규격',
      badgeClass: 'badge-accent',
      tagText: '사전규격 D-5',
      budget: '1억 4,000만원',
      region: '충남',
      source: '조달청 사전규격 OpenAPI (기준일: 2026.11.24)',
      mapKey: 'city',
      guide: '규격서 내 특정 외산 센서 단독 스펙 여부를 점검하고, 국내 KC·공인시험성적서 기반 동등 성능 인정 의견을 등록하세요.',
      actions: ['사전규격 의견서 제출 (마감 5일 전)', '시청 환경과 담당자 1쪽 비교표 전달', '직접생산확인증명서 유효기간 점검']
    },
    {
      id: 'r2',
      org: '○○시설관리공단',
      title: '공공시설 IoT 환경 센서 유지보수',
      type: '발주계획',
      badgeClass: 'badge-blue',
      tagText: '발주계획 3월',
      budget: '6,800만원',
      region: '충남',
      source: '조달청 발주계획 OpenAPI (기준일: 2026.11.24)',
      mapKey: 'corp',
      guide: '본 공고까지 약 2~3개월 여유가 있습니다. 시설관리팀에 무상 현장 점검 또는 3분 데모 시연을 제안해 요구사항을 사전에 파악하세요.',
      actions: ['시설관리팀 사용부서 사전 미팅 요청', '유지보수 SLA·긴급출동 대응표 준비', '발주계획 변경 여부 월 1회 추적']
    },
    {
      id: 'r3',
      org: '○○교육청',
      title: '관내 초·중교 실내공기질 측정 시범 도입',
      type: '수의계약',
      badgeClass: 'badge-teal',
      tagText: '수의계약 가능',
      budget: '1,850만원',
      region: '충남',
      source: '자체조달·구매지도 모니터링 (추정가 2천만원 이하)',
      mapKey: 'edu',
      guide: '추정가격 2천만 원 이하 소액 수의계약 범위입니다. 학교 행정실·교육지원청 담당자에게 1쪽 도입효과서와 표준 견적서를 전달하세요.',
      actions: ['2천만원 이하 패키지 견적서 구성', '교육지원청 학교지원팀 방문 상담', '1개교 시범설치 후 인근 학교 확산']
    },
    {
      id: 'r4',
      org: '아산시 안전총괄과',
      title: '침수위험 지하차도 수위감지 알림장치',
      type: '사전규격',
      badgeClass: 'badge-accent',
      tagText: '사전규격 D-3',
      budget: '9,200만원',
      region: '충남 아산',
      source: '조달청 사전규격 OpenAPI (기준일: 2026.11.24)',
      mapKey: 'city',
      guide: '장마철 이전 설치가 목표인 사업입니다. 납기 준수 능력과 기존 관제망 연동 프로토콜 지원 여부를 의견서에 명시하세요.',
      actions: ['사전규격 기술 의견등록 (D-3)', '유사 지자체 설치 레퍼런스 첨부', '충남테크노파크 구매상담회 매칭 요청']
    },
    {
      id: 'r5',
      org: '충청남도 탄소중립경제과',
      title: '중소사업장 에너지 효율화 계측기 보급',
      type: '시범구매',
      badgeClass: 'badge-navy',
      tagText: '혁신제품 시범구매',
      budget: '2억 1,000만원',
      region: '충남 도청',
      source: '조달청 혁신장터 · 충남도 공공구매 추진계획',
      mapKey: 'prov',
      guide: '혁신제품 지정 기업 대상 시범구매 연계 가능 사업입니다. 지정 전이라면 2027년 상반기 패스트트랙 신청과 병행하세요.',
      actions: ['혁신장터 시범구매 수요매칭 신청', '도청 사업담당자 대상 1쪽 제안서 발송', '충남경제진흥원 판로지원 사업 연계']
    },
    {
      id: 'r6',
      org: '천안시 교통정책과',
      title: '어린이보호구역 스마트 보행안전 안내판',
      type: '수의계약',
      badgeClass: 'badge-teal',
      tagText: '수의계약 가능',
      budget: '1,920만원',
      region: '충남 천안',
      source: '지자체 자체구매 모니터링 (국가계약법 시행령 제26조)',
      mapKey: 'city',
      guide: '창업기업·여성기업·장애인기업 등 우선구매 자격 보유 시 수의계약 한도가 확대될 수 있으므로 기관 계약부서 규정을 함께 확인하세요.',
      actions: ['우선구매 자격(창업·중소기업) 확인서 준비', '교통정책과 사용부서 현장 시연 제안', '설치 후 유지관리 단가표 첨부']
    }
  ];

  const MAPS = {
    city: {
      name: '기초지자체 (시·군청)',
      sub: '예: 아산시·천안시 환경과/안전과',
      budgetCycle: '전년도 6~8월 본예산 요구 · 2~3월 추경',
      limit: '추정가 2천만 원 이하 (여성·장애인·창업기업 등 특례 시 5천만 원 이하, 기관별 규정 확인)',
      nonBidTip: '계약부서(회계과)가 아닌 사용부서(환경과·안전과)에 먼저 1쪽 문제해결 제안서를 전달해야 규격과 예산에 반영됩니다.',
      steps: [
        { role: '1단계 · 핵심 접촉', title: '사용부서', desc: '현장 문제 인식 및 제품 검토. 1쪽 소개서·시연으로 필요성 설득.', key: true },
        { role: '2단계 · 규격 작성', title: '사업담당', desc: '과업지시서·규격서 초안 작성. 사전규격 의견등록 대응 구간.', key: true },
        { role: '3단계 · 6~8월', title: '예산부서', desc: '본예산 심의 및 우선순위 확정. 도입효과·유사 사례 근거 중요.', key: false },
        { role: '4단계 · 집행', title: '계약부서(회계과)', desc: '소액 수의계약 또는 나라장터 입찰 공고 및 계약 체결.', key: false }
      ]
    },
    edu: {
      name: '교육청 · 각급 학교',
      sub: '예: 충남교육청·지역 교육지원청',
      budgetCycle: '전년도 9~10월 학교회계·본예산 편성 · 3월 신학기 집행',
      limit: '2천만 원 이하 1인 견적 수의계약 (S2B 학교장터 등록 시 접근성 대폭 향상)',
      nonBidTip: '학교장터(S2B) 등록 후 지역 교육지원청 및 선도학교 1~2곳에 시범 도입하면 인근 학교로 빠르게 확산됩니다.',
      steps: [
        { role: '1단계 · 핵심 접촉', title: '학교 담당교사·지원청', desc: '안전·환경·교육 개선 수요 확인. 학생 안전성·인증 증빙 중시.', key: true },
        { role: '2단계 · 품의', title: '학교 행정실', desc: '예산 범위 확인 및 학교장터(S2B)·소액 수의계약 품의 진행.', key: true },
        { role: '3단계 · 9~10월', title: '교육청 예산팀', desc: '시범사업 및 차년도 일괄 보급 예산 편성.', key: false },
        { role: '4단계 · 계약', title: '계약담당자', desc: 'S2B 또는 자체 수의계약으로 신속 집행.', key: false }
      ]
    },
    corp: {
      name: '지방공단 · 출연기관',
      sub: '예: 시설관리공단·도시공사·TP',
      budgetCycle: '전년도 8~10월 사업계획 확정 · 연초 발주 집중',
      limit: '추정가 2천만 원 이하 소액 수의계약 · 기술 실증(테스트베드) 연계 유리',
      nonBidTip: '유지보수·안전관리 수요가 연중 꾸준히 발생합니다. 테스트베드 실증 후 본사업 전환 전략이 효과적입니다.',
      steps: [
        { role: '1단계 · 핵심 접촉', title: '현장 운영팀', desc: '시설 유지보수·안전 애로사항 파악. 즉각적인 운영 효율 개선 강조.', key: true },
        { role: '2단계 · 기획', title: '사업관리팀', desc: '발주계획 수립 및 과업 범위 확정.', key: false },
        { role: '3단계 · 8~10월', title: '경영기획·예산팀', desc: '연간 운영예산 및 시설투자비 배정.', key: false },
        { role: '4단계 · 발주', title: '재무·계약팀', desc: '나라장터 또는 자체 계약 시스템으로 발주.', key: false }
      ]
    },
    prov: {
      name: '광역지자체 (충남도청)',
      sub: '예: 탄소중립경제과·기업지원과',
      budgetCycle: '전년도 5~7월 시책구상 · 8~9월 본예산 심의',
      limit: '도 단위 시범사업·혁신제품 시범구매·공공구매 상담회 연계 핵심',
      nonBidTip: '광역 도청은 시·군으로 확산되는 표준 정책 사업을 기획합니다. 충남도 공공구매 추진계획 및 상담회 일정과 맞춰 움직이세요.',
      steps: [
        { role: '1단계 · 핵심 접촉', title: '정책 사업부서', desc: '도정 과제(탄소중립·안전·디지털)와 맞닿은 신기술 수요 발굴.', key: true },
        { role: '2단계 · 확산', title: '시·군 연계 담당', desc: '도비+시군비 매칭 사업 설계. 지역 기업 우선 검토.', key: true },
        { role: '3단계 · 5~8월', title: '예산담당관실', desc: '신규 시책 예산 심의 및 의회 상정.', key: false },
        { role: '4단계 · 집행', title: '회계과·조달청', desc: '중앙조달 의뢰 또는 혁신제품 시범구매 집행.', key: false }
      ]
    }
  };

  let activeFilter = 'all';
  let searchQuery = '';
  let selectedId = OPPORTUNITIES[0].id;
  let activeMapKey = 'city';

  const listEl = document.getElementById('radarList');
  const detailEl = document.getElementById('radarDetail');
  const mapTabsEl = document.getElementById('mapTabs');
  const mapCardEl = document.getElementById('mapDetailCard');

  function renderRadar() {
    const filtered = OPPORTUNITIES.filter((item) => {
      const matchType = activeFilter === 'all' || item.type === activeFilter;
      const q = searchQuery.trim().toLowerCase();
      const matchSearch = !q || `${item.org} ${item.title} ${item.region} ${item.type}`.toLowerCase().includes(q);
      return matchType && matchSearch;
    });

    if (filtered.length === 0) {
      listEl.innerHTML = '<div class="card" style="text-align:center;color:var(--muted);">조건에 맞는 수요가 없습니다. 필터를 변경해 보세요.</div>';
      return;
    }

    if (!filtered.some((i) => i.id === selectedId)) {
      selectedId = filtered[0].id;
    }

    listEl.innerHTML = filtered.map((item) => `
      <div class="radar-card ${item.id === selectedId ? 'active' : ''}" data-rid="${item.id}">
        <div class="radar-top">
          <div>
            <div style="font-size:12.5px;font-weight:700;color:var(--muted);margin-bottom:3px;">${item.org} · ${item.region}</div>
            <h3 class="radar-title">${item.title}</h3>
          </div>
          <span class="badge ${item.badgeClass} num">${item.tagText}</span>
        </div>
        <div class="radar-meta">
          <span>추정가 <strong class="num" style="color:var(--navy);">${item.budget}</strong></span>
          <span>경로: ${item.type}</span>
        </div>
      </div>
    `).join('');

    listEl.querySelectorAll('.radar-card').forEach((card) => {
      card.addEventListener('click', () => {
        selectedId = card.getAttribute('data-rid');
        renderRadar();
      });
    });

    const cur = filtered.find((i) => i.id === selectedId) || filtered[0];
    detailEl.innerHTML = `
      <div style="display:flex;justify-content:space-between;align-items:center;gap:10px;margin-bottom:10px;">
        <span class="badge ${cur.badgeClass}">${cur.tagText}</span>
        <span style="font-size:12px;color:var(--muted);">${cur.region}</span>
      </div>
      <h3 style="margin:0 0 6px;font-size:20px;font-weight:800;color:var(--navy);">${cur.org} · ${cur.title}</h3>
      <div style="font-size:13px;color:var(--muted);margin-bottom:16px;">출처: ${cur.source}</div>

      <div style="background:var(--surface);border:1px solid var(--line);border-radius:12px;padding:14px 16px;margin-bottom:16px;">
        <div style="font-size:12.5px;font-weight:800;color:var(--accent);margin-bottom:4px;">실무 검수 대응 전략</div>
        <p style="margin:0;font-size:14px;color:var(--ink-2);line-height:1.6;">${cur.guide}</p>
      </div>

      <div style="font-size:13.5px;font-weight:800;color:var(--navy);margin-bottom:8px;">추천 실행 순서</div>
      <ul class="check-list" style="margin-bottom:18px;">
        ${cur.actions.map((a) => `
          <li>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
            <span>${a}</span>
          </li>
        `).join('')}
      </ul>

      <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;">
        <button type="button" class="btn btn-primary btn-sm" id="jumpMapBtn">해당 기관 구매지도 보기</button>
        <a href="./diagnosis.html" class="btn btn-outline btn-sm">내 준비도 진단</a>
      </div>
    `;

    document.getElementById('jumpMapBtn')?.addEventListener('click', () => {
      activeMapKey = cur.mapKey;
      renderMap();
      document.getElementById('map-section')?.scrollIntoView({ behavior: 'smooth' });
    });
  }

  function renderMap() {
    mapTabsEl.innerHTML = Object.entries(MAPS).map(([key, m]) => `
      <button type="button" class="map-tab ${key === activeMapKey ? 'active' : ''}" data-mkey="${key}">
        ${m.name}
        <span>${m.sub}</span>
      </button>
    `).join('');

    mapTabsEl.querySelectorAll('.map-tab').forEach((btn) => {
      btn.addEventListener('click', () => {
        activeMapKey = btn.getAttribute('data-mkey');
        renderMap();
      });
    });

    const m = MAPS[activeMapKey];
    mapCardEl.innerHTML = `
      <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:10px;margin-bottom:18px;">
        <div>
          <h3 style="margin:0 0 4px;font-size:21px;font-weight:800;color:var(--navy);">${m.name} 구매결정 경로</h3>
          <span style="font-size:13.5px;color:var(--muted);">${m.sub} · 주황색 박스가 공고 이전 핵심 접촉 지점입니다.</span>
        </div>
        <span class="badge badge-accent">충남 20개 기관 우선 구축</span>
      </div>

      <div class="flow-grid">
        ${m.steps.map((s) => `
          <div class="flow-box ${s.key ? 'key' : ''}">
            <div style="font-size:11.5px;font-weight:800;color:${s.key ? 'var(--accent)' : 'var(--muted)'};">${s.role}</div>
            <h4>${s.title}</h4>
            <p>${s.desc}</p>
          </div>
        `).join('')}
      </div>

      <div class="map-facts">
        <div class="map-fact">
          <div class="map-fact-label">예산편성 시기</div>
          <div class="map-fact-val">${m.budgetCycle}</div>
          <p>예산 요구 전 1~2개월 안에 사용부서에 1쪽 소개서를 전달해야 차년도 사업에 반영됩니다.</p>
        </div>
        <div class="map-fact">
          <div class="map-fact-label">수의계약 한도 (비입찰)</div>
          <div class="map-fact-val">${m.limit}</div>
          <p>국가계약법 시행령 제26조 기준. 실제 적용 시 기관별 계약규정 확인 필요.</p>
        </div>
        <div class="map-fact">
          <div class="map-fact-label">34년 실무 접근 팁</div>
          <div class="map-fact-val">사용부서 중심 선제 접촉</div>
          <p>${m.nonBidTip}</p>
        </div>
      </div>
    `;
  }

  document.querySelectorAll('.pill-btn[data-filter]').forEach((btn) => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.pill-btn[data-filter]').forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      activeFilter = btn.getAttribute('data-filter');
      renderRadar();
    });
  });

  document.getElementById('radarSearch')?.addEventListener('input', (e) => {
    searchQuery = e.target.value;
    renderRadar();
  });

  renderRadar();
  renderMap();
})();
