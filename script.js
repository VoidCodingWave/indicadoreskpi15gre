/* ═══════════════════════════════════════════════════════
   script.js – 15ª GRE · Painel Institucional
   Gráficos Chart.js + filtros + animações de KPI
════════════════════════════════════════════════════════ */

'use strict';

/* ─── Design Tokens (espelho do CSS) ─── */
const T = {
  primary:   '#003366',
  secondary: '#009739',
  accent:    '#FFCC00',
  danger:    '#CC0000',
  dark:      '#000000',
  white:     '#FFFFFF',
  gray100:   '#F5F5F5',
  gray300:   '#CFCFCF',
  gray500:   '#6B7280',
};

/* ─── Helpers de estilo Chart.js ─── */
Chart.defaults.font.family = "'Inter', 'Segoe UI', sans-serif";
Chart.defaults.color = T.gray500;

function rgba(hex, alpha) {
  const r = parseInt(hex.slice(1,3),16);
  const g = parseInt(hex.slice(3,5),16);
  const b = parseInt(hex.slice(5,7),16);
  return `rgba(${r},${g},${b},${alpha})`;
}

/* ═══════════════════════════════════════════
   1. DADOS BASE
═══════════════════════════════════════════ */

const ANOS = [2022, 2023, 2024];

/* Matrículas por ano / turno */
const dadosMatriculas = {
  todos: { 2022: 13100, 2023: 14340, 2024: 14820 },
  manha: { 2022:  6200, 2023:  6800, 2024:  7050 },
  tarde: { 2022:  4300, 2023:  4700, 2024:  4870 },
  noite: { 2022:  2600, 2023:  2840, 2024:  2900 },
};

/* Resultados do ano letivo */
const dadosResultados = {
  2024: { aprovacao: 76, reprovacao: 16, evasao: 8 },
  2023: { aprovacao: 71, reprovacao: 18, evasao: 11 },
  2022: { aprovacao: 68, reprovacao: 20, evasao: 12 },
};

/* IDEB por escola */
const escolasTop10 = [
  'EE Gov. João Agripino',
  'EE Pe. Rolim',
  'EEEFM Napoleão Laureano',
  'EE Prof. Alfredo Dantas',
  'EE Maria de Lourdes',
  'EE Dom Bosco',
  'EE Monsenhor Constantino',
  'EE Epitácio Pessoa',
  'EE São Francisco',
  'EE Santos Dumont',
];
const dadosIdeb = {
  2024: [5.8, 5.6, 5.4, 5.3, 5.1, 4.9, 4.8, 4.6, 4.4, 4.2],
  2023: [5.5, 5.3, 5.1, 5.0, 4.8, 4.6, 4.5, 4.3, 4.1, 3.9],
  2022: [5.1, 4.9, 4.8, 4.6, 4.4, 4.2, 4.1, 3.9, 3.8, 3.6],
};

/* Evasão por série */
const dadosEvasao = {
  labels: ['1º Ano', '2º Ano', '3º Ano'],
  2024: [11, 7, 4],
  2023: [14, 10, 6],
  2022: [15, 12, 7],
};

/* Rendimento bimestral */
const bimestres = ['1º Bim', '2º Bim', '3º Bim', '4º Bim'];
const dadosRendimento = {
  todos: { 2024: [67, 71, 74, 78], 2023: [63, 67, 69, 73], 2022: [60, 64, 66, 70] },
  '1ano':{ 2024: [63, 67, 71, 74], 2023: [59, 63, 65, 68], 2022: [56, 60, 63, 66] },
  '2ano':{ 2024: [68, 72, 75, 79], 2023: [65, 68, 71, 74], 2022: [62, 65, 67, 71] },
  '3ano':{ 2024: [71, 74, 77, 82], 2023: [67, 71, 73, 77], 2022: [63, 67, 69, 73] },
};

/* Escolas para tabela */
const escolas = [
  { nome: 'EE Gov. João Agripino',       municipio: 'Cajazeiras',    matriculas: 620, ideb: 5.8, aprovacao: 84, status: 'regular' },
  { nome: 'EE Pe. Rolim',                municipio: 'Cajazeiras',    matriculas: 540, ideb: 5.6, aprovacao: 82, status: 'regular' },
  { nome: 'EEEFM Napoleão Laureano',     municipio: 'Sousa',         matriculas: 710, ideb: 5.4, aprovacao: 80, status: 'regular' },
  { nome: 'EE Prof. Alfredo Dantas',     municipio: 'São José',      matriculas: 480, ideb: 5.3, aprovacao: 79, status: 'regular' },
  { nome: 'EE Maria de Lourdes',         municipio: 'Marizópolis',   matriculas: 310, ideb: 5.1, aprovacao: 77, status: 'regular' },
  { nome: 'EE Dom Bosco',               municipio: 'Bonito de Sta Cruz', matriculas: 290, ideb: 4.9, aprovacao: 75, status: 'regular' },
  { nome: 'EE Monsenhor Constantino',    municipio: 'Triunfo',       matriculas: 260, ideb: 4.8, aprovacao: 73, status: 'atencao' },
  { nome: 'EE Epitácio Pessoa',          municipio: 'Pombal',        matriculas: 550, ideb: 4.6, aprovacao: 72, status: 'atencao' },
  { nome: 'EE São Francisco',            municipio: 'Aparecida',     matriculas: 220, ideb: 4.4, aprovacao: 70, status: 'atencao' },
  { nome: 'EE Santos Dumont',            municipio: 'São João do Rio do Peixe', matriculas: 380, ideb: 4.2, aprovacao: 68, status: 'atencao' },
  { nome: 'EE Prof. Joaquim Rolim',      municipio: 'Poço José',     matriculas: 195, ideb: 3.9, aprovacao: 64, status: 'critico' },
  { nome: 'EE Santa Luzia',             municipio: 'Uiraúna',       matriculas: 210, ideb: 3.7, aprovacao: 61, status: 'critico' },
  { nome: 'EE João Pessoa',             municipio: 'Jericó',        matriculas: 180, ideb: 3.5, aprovacao: 59, status: 'critico' },
  { nome: 'EE Padre Ibiapina',          municipio: 'Brejo do Cruz', matriculas: 240, ideb: 4.0, aprovacao: 66, status: 'atencao' },
  { nome: 'EE Pres. Emílio Garrastazu', municipio: 'São Bento',     matriculas: 320, ideb: 4.3, aprovacao: 69, status: 'atencao' },
];

/* KPIs por ano */
const kpiData = {
  2024: { matriculas: 14820, professores: 892, escolas: 42, evasao: 8,  aprovacao: 76, ideb: 5.0 },
  2023: { matriculas: 14340, professores: 875, escolas: 42, evasao: 11, aprovacao: 71, ideb: 4.7 },
  2022: { matriculas: 13100, professores: 850, escolas: 42, evasao: 12, aprovacao: 68, ideb: 4.4 },
};

/* ═══════════════════════════════════════════
   2. CONTADOR ANIMADO DE KPIs
═══════════════════════════════════════════ */

function animateCounter(el, target, duration = 1400, decimal = 0, suffix = '') {
  const start = performance.now();
  function update(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const ease = 1 - Math.pow(1 - progress, 3);
    const current = target * ease;
    if (decimal) {
      el.textContent = current.toFixed(1) + suffix;
    } else {
      el.textContent = Math.floor(current).toLocaleString('pt-BR') + suffix;
    }
    if (progress < 1) requestAnimationFrame(update);
  }
  requestAnimationFrame(update);
}

function renderKPIs(year = 2024) {
  const d = kpiData[year];
  const items = [
    { target: d.matriculas,   suffix: '',  decimal: 0 },
    { target: d.professores,  suffix: '',  decimal: 0 },
    { target: d.escolas,      suffix: '',  decimal: 0 },
    { target: d.evasao,       suffix: '%', decimal: 0 },
    { target: d.aprovacao,    suffix: '%', decimal: 0 },
    { target: d.ideb,         suffix: '',  decimal: 1 },
  ];

  document.querySelectorAll('.kpi-value').forEach((el, i) => {
    const { target, suffix, decimal } = items[i];
    animateCounter(el, target, 1200, decimal, suffix);
  });
}

/* ─── Filtros de KPI ─── */
document.querySelectorAll('#kpiFilters .filter-btn').forEach(btn => {
  btn.addEventListener('click', function () {
    document.querySelectorAll('#kpiFilters .filter-btn').forEach(b => b.classList.remove('active'));
    this.classList.add('active');
    renderKPIs(parseInt(this.dataset.year));
  });
});

/* ═══════════════════════════════════════════
   3. GRÁFICOS
═══════════════════════════════════════════ */

/* ─── Instâncias globais ─── */
let chartMatriculas, chartResultados, chartIdeb, chartEvasao, chartRendimento;

/* Opções base reutilizáveis */
const baseOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: { legend: { display: false } },
};

/* 3.1 Matrículas por Ano (Bar) */
function buildChartMatriculas(turno = 'todos') {
  const ctx = document.getElementById('chartMatriculas').getContext('2d');
  const dados = ANOS.map(a => dadosMatriculas[turno][a]);

  if (chartMatriculas) chartMatriculas.destroy();
  chartMatriculas = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ANOS.map(String),
      datasets: [{
        label: 'Matrículas',
        data: dados,
        backgroundColor: [rgba(T.primary, 0.15), rgba(T.primary, 0.5), T.primary],
        borderColor:     [rgba(T.primary, 0.4), rgba(T.primary, 0.8), T.primary],
        borderWidth: 2,
        borderRadius: 8,
        borderSkipped: false,
      }],
    },
    options: {
      ...baseOptions,
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: ctx => ' ' + ctx.raw.toLocaleString('pt-BR') + ' matrículas',
          },
        },
      },
      scales: {
        y: {
          beginAtZero: false,
          grid: { color: rgba(T.gray300, 0.5) },
          ticks: { callback: v => v.toLocaleString('pt-BR') },
        },
        x: { grid: { display: false } },
      },
    },
  });
}

/* 3.2 Resultados do Ano Letivo (Doughnut) */
function buildChartResultados(ano = 2024) {
  const ctx = document.getElementById('chartResultados').getContext('2d');
  const d = dadosResultados[ano];

  if (chartResultados) chartResultados.destroy();
  chartResultados = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: ['Aprovados', 'Reprovados', 'Evadidos'],
      datasets: [{
        data: [d.aprovacao, d.reprovacao, d.evasao],
        backgroundColor: [T.secondary, rgba(T.accent, 0.9), T.danger],
        borderColor: T.white,
        borderWidth: 3,
        hoverOffset: 6,
      }],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      cutout: '65%',
      plugins: {
        legend: {
          display: true,
          position: 'bottom',
          labels: { usePointStyle: true, padding: 16, font: { size: 12 } },
        },
        tooltip: {
          callbacks: { label: ctx => ` ${ctx.label}: ${ctx.raw}%` },
        },
      },
    },
  });
}

/* 3.3 IDEB por Escola (Horizontal Bar) */
function buildChartIdeb(ano = 2024) {
  const ctx = document.getElementById('chartIdeb').getContext('2d');
  const dados = dadosIdeb[ano];

  const colors = dados.map(v =>
    v >= 5.0 ? T.secondary :
    v >= 4.0 ? rgba(T.accent, 0.85) : T.danger
  );

  if (chartIdeb) chartIdeb.destroy();
  chartIdeb = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: escolasTop10,
      datasets: [{
        label: 'IDEB',
        data: dados,
        backgroundColor: colors,
        borderColor:     colors,
        borderWidth: 1,
        borderRadius: 4,
        borderSkipped: false,
      }],
    },
    options: {
      ...baseOptions,
      indexAxis: 'y',
      plugins: {
        legend: { display: false },
        tooltip: { callbacks: { label: ctx => ` IDEB: ${ctx.raw}` } },
        annotation: {},
      },
      scales: {
        x: {
          min: 3,
          max: 7,
          grid: { color: rgba(T.gray300, 0.5) },
          ticks: { callback: v => v.toFixed(1) },
        },
        y: {
          grid: { display: false },
          ticks: { font: { size: 11 } },
        },
      },
    },
  });
}

/* 3.4 Evasão por Série (Bar) */
function buildChartEvasao(ano = 2024) {
  const ctx = document.getElementById('chartEvasao').getContext('2d');
  const dados = dadosEvasao[ano];

  if (chartEvasao) chartEvasao.destroy();
  chartEvasao = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: dadosEvasao.labels,
      datasets: [{
        label: 'Evasão (%)',
        data: dados,
        backgroundColor: [rgba(T.danger, 0.8), rgba(T.danger, 0.55), rgba(T.danger, 0.35)],
        borderColor:     T.danger,
        borderWidth: 2,
        borderRadius: 8,
        borderSkipped: false,
      }],
    },
    options: {
      ...baseOptions,
      plugins: {
        legend: { display: false },
        tooltip: { callbacks: { label: ctx => ` ${ctx.raw}% de evasão` } },
      },
      scales: {
        y: {
          beginAtZero: true,
          max: 20,
          grid: { color: rgba(T.gray300, 0.5) },
          ticks: { callback: v => v + '%' },
        },
        x: { grid: { display: false } },
      },
    },
  });
}

/* 3.5 Rendimento Bimestral (Line) */
function buildChartRendimento(serie = 'todos') {
  const ctx = document.getElementById('chartRendimento').getContext('2d');
  const serieData = dadosRendimento[serie];

  if (chartRendimento) chartRendimento.destroy();

  const datasets = ANOS.map((ano, idx) => {
    const alphas = [0.35, 0.65, 1];
    const color  = [T.accent, T.secondary, T.primary];
    return {
      label: String(ano),
      data: serieData[ano],
      borderColor: color[idx],
      backgroundColor: rgba(color[idx], 0.08),
      borderWidth: idx === 2 ? 3 : 1.5,
      pointRadius: 5,
      pointHoverRadius: 7,
      pointBackgroundColor: color[idx],
      tension: 0.4,
      fill: idx === 2,
    };
  });

  chartRendimento = new Chart(ctx, {
    type: 'line',
    data: { labels: bimestres, datasets },
    options: {
      ...baseOptions,
      plugins: {
        legend: {
          display: true,
          position: 'top',
          align: 'end',
          labels: { usePointStyle: true, pointStyleWidth: 12, padding: 16, font: { size: 12 } },
        },
        tooltip: { callbacks: { label: ctx => ` ${ctx.dataset.label}: ${ctx.raw}%` } },
      },
      scales: {
        y: {
          min: 50,
          max: 90,
          grid: { color: rgba(T.gray300, 0.5) },
          ticks: { callback: v => v + '%' },
        },
        x: { grid: { color: rgba(T.gray300, 0.3) } },
      },
    },
  });
}

/* ─── Eventos dos selects ─── */
document.getElementById('selectTurno').addEventListener('change', function () {
  buildChartMatriculas(this.value);
});

document.getElementById('selectAnoResultado').addEventListener('change', function () {
  buildChartResultados(parseInt(this.value));
});

document.getElementById('selectAnoIdeb').addEventListener('change', function () {
  buildChartIdeb(parseInt(this.value));
});

document.getElementById('selectSerieRendimento').addEventListener('change', function () {
  buildChartRendimento(this.value);
});

/* ─── Filtros globais de ano nos gráficos ─── */
document.querySelectorAll('#chartYearFilters .filter-btn').forEach(btn => {
  btn.addEventListener('click', function () {
    document.querySelectorAll('#chartYearFilters .filter-btn').forEach(b => b.classList.remove('active'));
    this.classList.add('active');
    const year = this.dataset.chartYear;

    if (year === 'todos') {
      buildChartMatriculas(document.getElementById('selectTurno').value);
      buildChartRendimento(document.getElementById('selectSerieRendimento').value);
    } else {
      const y = parseInt(year);
      document.getElementById('selectAnoResultado').value = year;
      document.getElementById('selectAnoIdeb').value = year;
      buildChartResultados(y);
      buildChartIdeb(y);
    }
  });
});

/* ═══════════════════════════════════════════
   4. TABELA DE ESCOLAS
═══════════════════════════════════════════ */

function statusBadge(s) {
  const map = {
    regular: ['badge-regular', 'Regular'],
    atencao: ['badge-atencao', 'Atenção'],
    critico: ['badge-critico', 'Crítico'],
  };
  const [cls, txt] = map[s] || ['badge-regular', 'Regular'];
  return `<span class="badge-status ${cls}">${txt}</span>`;
}

function idebBar(val) {
  const pct = Math.min((val / 10) * 100, 100);
  const color = val >= 5 ? 'var(--color-secondary)' : val >= 4 ? 'var(--color-accent)' : 'var(--color-danger)';
  return `
    <div class="ideb-bar">
      <span style="min-width:28px;font-weight:700;font-size:.85rem">${val.toFixed(1)}</span>
      <div class="ideb-track"><div class="ideb-fill" style="width:${pct}%;background-color:${color}"></div></div>
    </div>`;
}

function renderEscolas(list = escolas) {
  const tbody = document.getElementById('escolaTbody');
  if (!list.length) {
    tbody.innerHTML = `<tr><td colspan="6" class="text-center py-4" style="color:var(--color-gray-500)">Nenhuma escola encontrada.</td></tr>`;
    return;
  }
  tbody.innerHTML = list.map(e => `
    <tr>
      <td>${e.nome}</td>
      <td>${e.municipio}</td>
      <td>${e.matriculas.toLocaleString('pt-BR')}</td>
      <td>${idebBar(e.ideb)}</td>
      <td>
        <span style="font-weight:600;color:${e.aprovacao >= 75 ? 'var(--color-secondary)' : e.aprovacao >= 65 ? '#8a6e00' : 'var(--color-danger)'}">${e.aprovacao}%</span>
      </td>
      <td>${statusBadge(e.status)}</td>
    </tr>`).join('');
}

/* Busca ao vivo */
document.getElementById('escolaSearch').addEventListener('input', function () {
  const q = this.value.toLowerCase().trim();
  if (!q) return renderEscolas();
  renderEscolas(escolas.filter(e =>
    e.nome.toLowerCase().includes(q) || e.municipio.toLowerCase().includes(q)
  ));
});

/* ═══════════════════════════════════════════
   5. FORMULÁRIO – TOAST
═══════════════════════════════════════════ */

function handleFormSubmit() {
  const toast = new bootstrap.Toast(document.getElementById('successToast'), { delay: 3500 });
  toast.show();
}

/* ═══════════════════════════════════════════
   6. INTERSECTION OBSERVER – lazy KPI animation
═══════════════════════════════════════════ */

const kpiSection = document.getElementById('kpis');
const kpiObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      renderKPIs(2024);
      kpiObserver.disconnect();
    }
  });
}, { threshold: 0.2 });
kpiSection && kpiObserver.observe(kpiSection);

/* ═══════════════════════════════════════════
   7. INIT
═══════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {
  buildChartMatriculas();
  buildChartResultados();
  buildChartIdeb();
  buildChartEvasao();
  buildChartRendimento();
  renderEscolas();
});
