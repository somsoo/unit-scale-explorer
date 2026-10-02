const LANDMARKS = [
  { exp: -3, size: "1 mm", icon: "🐜", name: "모래알 / 개미 다리 (1mm)", desc: "1미터를 1,000등분한 미세 단위입니다." },
  { exp: -2, size: "1 cm", icon: "🪙", name: "동전 지름 / 손톱 (약 1cm)", desc: "1미터의 100분의 1 크기입니다." },
  { exp: -1, size: "10 cm", icon: "📱", name: "스마트폰 가로 폭 (약 10cm)", desc: "10cm는 0.1m, 즉 1데시미터(dm)입니다." },
  { exp: 0, size: "1 m", icon: "🚶", name: "사람 보폭 / 보행 (약 1m)", desc: "일상 길이 측정의 기본 기준 단위입니다." },
  { exp: 1, size: "10 m", icon: "🚌", name: "대형 시내버스 (약 12m)", desc: "10미터는 1데카미터(dam) 단위입니다." },
  { exp: 2, size: "100 m", icon: "⚽", name: "축구 경기장 길이 (약 105m)", desc: "100미터는 0.1km에 해당합니다." },
  { exp: 3, size: "1 km", icon: "🏃", name: "지하철 1개 역 구간 (약 1km)", desc: "1,000미터를 묶은 킬로미터(km)입니다." },
  { exp: 4, size: "10 km", icon: "✈️", name: "여객기 순항 고도 (약 10km)", desc: "마라톤 단축 코스나 상공 고도 단위입니다." },
  { exp: 5, size: "100 km", icon: "🚗", name: "서울-천안 간 고속도로 거리", desc: "시외 광역 이동 거리 단위입니다." },
  { exp: 6, size: "1,000 km", icon: "🌏", name: "한반도 종단 거리 (약 1,100km)", desc: "국가 및 대륙 단위의 거대한 스케일입니다." }
];

const scaleSlider = document.getElementById('scaleSlider');
const lenDisplay = document.getElementById('lenDisplay');
const conversionsRow = document.getElementById('conversionsRow');
const lmIcon = document.getElementById('lmIcon');
const lmName = document.getElementById('lmName');
const lmDesc = document.getElementById('lmDesc');

function updateScale(val) {
  const exponent = parseFloat(val);
  const meters = Math.pow(10, exponent);

  // Format meters
  let mStr = "";
  if (meters >= 1000) mStr = `${(meters/1000).toLocaleString()} km`;
  else if (meters >= 1) mStr = `${meters.toFixed(meters < 10 ? 1 : 0)} m`;
  else if (meters >= 0.01) mStr = `${(meters * 100).toFixed(1)} cm`;
  else mStr = `${(meters * 1000).toFixed(1)} mm`;

  lenDisplay.textContent = mStr;

  const mm = (meters * 1000).toLocaleString();
  const cm = (meters * 100).toLocaleString();
  const km = (meters / 1000).toFixed(4);
  conversionsRow.innerHTML = `<span>${mm} mm</span> | <span>${cm} cm</span> | <span>${km} km</span>`;

  // Closest landmark
  const closest = LANDMARKS.reduce((prev, curr) => 
    Math.abs(curr.exp - exponent) < Math.abs(prev.exp - exponent) ? curr : prev
  );
  lmIcon.textContent = closest.icon;
  lmName.textContent = closest.name;
  lmDesc.textContent = closest.desc;
}

scaleSlider.addEventListener('input', (e) => updateScale(e.target.value));
updateScale(0);

// Area Canvas Animation
const areaCanvas = document.getElementById('areaCanvas');
const ctx = areaCanvas.getContext('2d');
const btnAnimateTiles = document.getElementById('btnAnimateTiles');

function drawBaseArea() {
  ctx.clearRect(0, 0, 340, 340);
  ctx.fillStyle = '#0f172a';
  ctx.fillRect(0, 0, 340, 340);
  ctx.strokeStyle = '#38bdf8';
  ctx.lineWidth = 4;
  ctx.strokeRect(20, 20, 300, 300);
  ctx.fillStyle = '#f8fafc';
  ctx.font = 'bold 16px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('1 m (100 cm)', 170, 15);
  ctx.fillText('1 m (100 cm)', 170, 335);
}

let tileAnimId = null;
btnAnimateTiles.addEventListener('click', () => {
  drawBaseArea();
  let step = 0;
  clearInterval(tileAnimId);
  tileAnimId = setInterval(() => {
    step += 5;
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.4)';
    ctx.lineWidth = 1;
    for (let i = 0; i <= step; i += 5) {
      const p = 20 + (i / 100) * 300;
      ctx.beginPath();
      ctx.moveTo(p, 20); ctx.lineTo(p, 320); ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(20, p); ctx.lineTo(320, p); ctx.stroke();
    }
    if (step >= 100) {
      clearInterval(tileAnimId);
      ctx.fillStyle = 'rgba(56, 189, 248, 0.2)';
      ctx.fillRect(20, 20, 300, 300);
      alert('10,000개의 1cm² 타일이 모두 채워졌습니다! (1m² = 10,000cm²)');
    }
  }, 40);
});

drawBaseArea();

// Tabs
const tabLength = document.getElementById('tabLength');
const tabArea = document.getElementById('tabArea');
const tabQuiz = document.getElementById('tabQuiz');
const panelLength = document.getElementById('panelLength');
const panelArea = document.getElementById('panelArea');
const panelQuiz = document.getElementById('panelQuiz');

function switchTab(t, p) {
  [tabLength, tabArea, tabQuiz].forEach(b => b.classList.remove('active'));
  [panelLength, panelArea, panelQuiz].forEach(b => b.classList.add('hidden'));
  t.classList.add('active'); p.classList.remove('hidden');
}
tabLength.addEventListener('click', () => switchTab(tabLength, panelLength));
tabArea.addEventListener('click', () => switchTab(tabArea, panelArea));
tabQuiz.addEventListener('click', () => { switchTab(tabQuiz, panelQuiz); loadQuiz(); });

// Quiz
const QUIZZES = [
  { q: "서울에서 부산까지의 거리를 나타내기에 가장 알맞은 단위는?", opts: ["밀리미터(mm)", "센티미터(cm)", "미터(m)", "킬로미터(km)"], ans: 3, exp: "도시 간 먼 거리는 킬로미터(km)로 나타냅니다 (약 400km)." },
  { q: "스마트폰 액정의 두께를 측정하기에 가장 알맞은 단위는?", opts: ["밀리미터(mm)", "센티미터(cm)", "미터(m)", "킬로미터(km)"], ans: 0, exp: "1cm보다 얇은 미세한 두께는 밀리미터(mm)를 사용합니다." },
  { q: "1m²는 몇 cm²와 같을까요?", opts: ["100 cm²", "1,000 cm²", "10,000 cm²", "100,000 cm²"], ans: 2, exp: "100cm × 100cm = 10,000 cm² 입니다." }
];
let qIdx = 0;
const quizQ = document.getElementById('quizQ');
const quizOptions = document.getElementById('quizOptions');
const quizFeedback = document.getElementById('quizFeedback');
const btnNextQuiz = document.getElementById('btnNextQuiz');

function loadQuiz() {
  const item = QUIZZES[qIdx];
  quizQ.textContent = item.q;
  quizOptions.innerHTML = '';
  quizFeedback.className = 'quiz-feedback hidden';

  item.opts.forEach((opt, idx) => {
    const btn = document.createElement('button');
    btn.className = 'quiz-opt-btn';
    btn.textContent = opt;
    btn.addEventListener('click', () => {
      quizFeedback.classList.remove('hidden');
      if (idx === item.ans) {
        quizFeedback.className = 'quiz-feedback correct';
        quizFeedback.textContent = `정답입니다! 🌟 ${item.exp}`;
      } else {
        quizFeedback.className = 'quiz-feedback wrong';
        quizFeedback.textContent = `오답입니다. 다시 생각해보세요! ${item.exp}`;
      }
    });
    quizOptions.appendChild(btn);
  });
}
btnNextQuiz.addEventListener('click', () => {
  qIdx = (qIdx + 1) % QUIZZES.length;
  loadQuiz();
});
