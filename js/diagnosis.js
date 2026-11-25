/* ==========================================================================
   Diagnosis Page — 20-Item Readiness Scoring & 2w/1m/3m Action Report
   ========================================================================== */

(function () {
  const CATEGORIES = [
    {
      id: 'cert',
      name: '등록·인증',
      items: [
        { id: 'c1', text: '나라장터(G2B) 경쟁입찰참가자격 등록을 완료했다', gap: '나라장터 조달업체 신규 등록 완료', priority: 1 },
        { id: 'c2', text: '중소기업확인서(공공구매종합정보망 SCPP)를 보유 중이다', gap: '중소기업확인서 발급 및 SCPP 등록', priority: 1 },
        { id: 'c3', text: '직접생산확인증명서를 보유하고 있다 (제조·SW 품목 해당 시)', gap: '직접생산확인 신청 (중소기업유통원)', priority: 1 },
        { id: 'c4', text: '혁신제품·성능인증·녹색인증·여성/창업기업 등 우선구매 자격을 갖췄다', gap: '혁신제품·창업기업 우선구매 자격 검토', priority: 2 },
        { id: 'c5', text: '공인 시험성적서, KS, KC 등 공공 규격 대응 품질 증빙이 있다', gap: '핵심 품목 공인 시험성적서·인증 확보', priority: 2 }
      ]
    },
    {
      id: 'track',
      name: '납품 실적',
      items: [
        { id: 't1', text: '민간 기업 또는 B2B 유상 납품 실적을 1건 이상 보유했다', gap: '민간 납품 레퍼런스 사례 정리', priority: 2 },
        { id: 't2', text: '공공기관·지자체·학교·공기업 납품 또는 시범설치 경험이 있다', gap: '소액 수의계약·시범구매로 첫 공공실적 확보', priority: 1 },
        { id: 't3', text: '납품실적증명서 또는 세금계산서·계약서 증빙을 즉시 제출할 수 있다', gap: '실적 증빙 패키지(계약서·검수조서) 표준화', priority: 2 },
        { id: 't4', text: '납품 이후 유지보수·AS 대응 체계 및 담당 인력이 정해져 있다', gap: '공공기관용 AS·유지보수 대응 매뉴얼 작성', priority: 3 },
        { id: 't5', text: '계약 체결 후 30~60일 내 납품 가능한 생산·공급 체계를 갖췄다', gap: '납기 준수 생산·조달 일정표 정리', priority: 3 }
      ]
    },
    {
      id: 'prop',
      name: '제안 자료',
      items: [
        { id: 'p1', text: '공공기관 담당자가 3분 내 이해할 수 있는 ‘기관용 1쪽 소개서’가 있다', gap: '기관용 1쪽 소개서 작성 (도입효과·예산 범위 명시)', priority: 1 },
        { id: 'p2', text: '기존 제품·방식 대비 성능·비용 개선 효과를 비교표로 정리했다', gap: '기존 대비 성능·비용 비교표 제작', priority: 2 },
        { id: 'p3', text: '2천만 원 이하 소액 수의계약용 표준 견적·단가 산출 근거가 있다', gap: '소액 수의계약(2천만원 이하) 패키지 단가 구성', priority: 1 },
        { id: 'p4', text: '사전규격 공개 시 제출할 기술 의견서 양식을 준비했다', gap: '사전규격 의견등록 표준 양식 준비', priority: 2 },
        { id: 'p5', text: '사용부서 미팅 시 시연 가능한 데모 장비·샘플 또는 영상이 있다', gap: '현장 미팅용 3분 시연 영상·샘플 준비', priority: 3 }
      ]
    },
    {
      id: 'org',
      name: '기관 이해',
      items: [
        { id: 'o1', text: '우리 제품을 실제로 쓸 목표 기관의 ‘사용부서(과·팀)’를 특정했다', gap: '기관 구매지도로 핵심 사용부서 5곳 선정', priority: 1 },
        { id: 'o2', text: '지자체 본예산 편성 시기(전년도 6~8월)와 추경 시기를 알고 있다', gap: '목표 기관 예산편성 캘린더(6~8월) 반영', priority: 2 },
        { id: 'o3', text: '조달청 발주계획·사전규격 공개 정보를 주기적으로 확인하고 있다', gap: '수요 레이더 주간 모니터링 시작', priority: 2 },
        { id: 'o4', text: '수의계약 한도(국가계약법 시행령 제26조)와 시범구매 제도를 이해한다', gap: '비입찰 경로(수의계약·시범구매) 요건 숙지', priority: 2 },
        { id: 'o5', text: '지역 테크노파크·경제진흥원 등 지원기관 구매상담회에 연계되어 있다', gap: '충남권 지원기관 공공구매 상담회 신청', priority: 2 }
      ]
    }
  ];

  // Default sample matching business plan (~60-65 pts, missing direct production & 1-page intro)
  const SAMPLE_CHECKED = new Set([
    'c1', 'c2',
    't1', 't4',
    'p2', 'p4', 'p5',
    'o1', 'o2', 'o3', 'o4', 'o5'
  ]);

  const state = new Set(SAMPLE_CHECKED);

  const container = document.getElementById('questionContainer');
  const totalScoreEl = document.getElementById('totalScore');
  const gradeBadgeEl = document.getElementById('gradeBadge');
  const summaryTextEl = document.getElementById('scoreSummaryText');
  const catBarsEl = document.getElementById('categoryBars');
  const gapListEl = document.getElementById('gapList');
  const actionPlanEl = document.getElementById('actionPlanList');
  const companyInput = document.getElementById('companyNameInput');
  const reportCompanyLabel = document.getElementById('reportCompanyLabel');

  function renderQuestions() {
    container.innerHTML = '';
    CATEGORIES.forEach((cat, idx) => {
      const checkedCount = cat.items.filter((i) => state.has(i.id)).length;
      const card = document.createElement('div');
      card.className = 'cat-card';
      card.innerHTML = `
        <div class="cat-head">
          <h3>0${idx + 1}. ${cat.name}</h3>
          <span class="badge badge-gray num" data-cat-count="${cat.id}">${checkedCount} / ${cat.items.length}</span>
        </div>
        <div class="q-list">
          ${cat.items.map((item) => `
            <label class="q-item ${state.has(item.id) ? 'checked' : ''}">
              <input type="checkbox" data-qid="${item.id}" ${state.has(item.id) ? 'checked' : ''} />
              <span>${item.text}</span>
            </label>
          `).join('')}
        </div>
      `;
      container.appendChild(card);
    });

    container.querySelectorAll('input[data-qid]').forEach((cb) => {
      cb.addEventListener('change', () => {
        const id = cb.getAttribute('data-qid');
        if (cb.checked) state.add(id);
        else state.delete(id);
        cb.closest('.q-item').classList.toggle('checked', cb.checked);
        updateReport();
      });
    });
  }

  function updateReport() {
    const score = state.size * 5;
    totalScoreEl.textContent = String(score);

    // Grade & Summary
    if (score >= 80) {
      gradeBadgeEl.textContent = '즉시 제안·계약 추진 단계';
      gradeBadgeEl.className = 'badge badge-teal';
      summaryTextEl.textContent = '사전규격 의견등록과 사용부서 미팅을 바로 실행할 수 있습니다.';
    } else if (score >= 50) {
      gradeBadgeEl.textContent = '사전접촉 준비 단계';
      gradeBadgeEl.className = 'badge badge-accent';
      summaryTextEl.textContent = '핵심 보완 2~3건을 채우면 첫 기관 미팅과 수의계약 제안이 가능합니다.';
    } else {
      gradeBadgeEl.textContent = '기초 자격 정비 단계';
      gradeBadgeEl.className = 'badge badge-blue';
      summaryTextEl.textContent = '나라장터 등록·1쪽 소개서 등 진입 기반을 먼저 갖추는 것이 우선입니다.';
    }

    // Category Bars & counts
    catBarsEl.innerHTML = CATEGORIES.map((cat) => {
      const cnt = cat.items.filter((i) => state.has(i.id)).length;
      const pct = Math.round((cnt / cat.items.length) * 100);
      const countBadge = document.querySelector(`[data-cat-count="${cat.id}"]`);
      if (countBadge) countBadge.textContent = `${cnt} / ${cat.items.length}`;
      return `
        <div class="mini-bar-row">
          <span>${cat.name}</span>
          <div class="mini-track"><div class="mini-fill ${pct < 50 ? 'accent' : ''}" style="width:${pct}%;"></div></div>
          <span class="num">${pct}%</span>
        </div>
      `;
    }).join('');

    // Missing gaps sorted by priority
    const missing = [];
    CATEGORIES.forEach((cat) => {
      cat.items.forEach((item) => {
        if (!state.has(item.id)) missing.push(item);
      });
    });
    missing.sort((a, b) => a.priority - b.priority);

    if (missing.length === 0) {
      gapListEl.innerHTML = '<li>모든 기본 진입 요건을 충족했습니다. 수요 레이더에서 바로 타깃 기관을 선정하세요.</li>';
    } else {
      gapListEl.innerHTML = missing.slice(0, 3).map((m) => `<li>${m.gap}</li>`).join('');
    }

    // Dynamic 2w / 1m / 3m Action Plan
    const w2 = !state.has('p1')
      ? '기관용 1쪽 소개서(도입효과·2천만원 이하 패키지 포함) 작성 및 수요 레이더 사전규격 D-Day 사업 2건 검토'
      : '수요 레이더에서 포착된 사전규격 공개 건에 기술 의견등록 실행 및 핵심 사용부서 3곳 리스트업';

    const m1 = !state.has('c3')
      ? '직접생산확인증명서 신청 착수 + 기관 구매지도 기반으로 목표 지자체 사용부서(환경과·안전과 등) 1차 접촉'
      : '기관 구매지도에 따라 목표 지자체·공단 사용부서 미팅 2건 진행 및 소액 수의계약 시범 도입 제안';

    const m3 = '지역 지원기관(테크노파크·경제진흥원) 공공구매 상담회 연계 및 혁신제품 시범구매·차년도 본예산(6~8월) 반영 추진';

    actionPlanEl.innerHTML = `
      <div class="plan-item">
        <strong>1단계 · 2주 내 실행</strong>
        <p>${w2}</p>
      </div>
      <div class="plan-item">
        <strong>2단계 · 1개월 내 실행</strong>
        <p>${m1}</p>
      </div>
      <div class="plan-item">
        <strong>3단계 · 3개월 목표</strong>
        <p>${m3}</p>
      </div>
    `;
  }

  if (companyInput && reportCompanyLabel) {
    companyInput.addEventListener('input', () => {
      reportCompanyLabel.textContent = companyInput.value.trim() || '진단 기업';
    });
  }

  document.getElementById('loadSampleBtn')?.addEventListener('click', () => {
    state.clear();
    SAMPLE_CHECKED.forEach((id) => state.add(id));
    if (companyInput) companyInput.value = '충남 환경센서 제조기업 (예시)';
    if (reportCompanyLabel) reportCompanyLabel.textContent = '충남 환경센서 제조기업 (예시)';
    renderQuestions();
    updateReport();
  });

  document.getElementById('resetDiagBtn')?.addEventListener('click', () => {
    state.clear();
    renderQuestions();
    updateReport();
  });

  renderQuestions();
  updateReport();
})();
