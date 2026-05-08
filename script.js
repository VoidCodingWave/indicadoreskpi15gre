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

const ANOS = [2024, 2025, 2026];

/* Matrículas por ano / turno */
const dadosMatriculas = {
  todos: { 2024: 8540, 2025: 8810, 2026: 9120 },
  manha: { 2024: 3900, 2025: 4020, 2026: 4180 },
  tarde: { 2024: 2840, 2025: 2930, 2026: 3040 },
  noite: { 2024: 1800, 2025: 1860, 2026: 1900 },
};

/* Resultados do ano letivo */
const dadosResultados = {
  2026: { aprovacao: 79, reprovacao: 14, evasao: 7 },
  2025: { aprovacao: 75, reprovacao: 16, evasao: 9 },
  2024: { aprovacao: 71, reprovacao: 18, evasao: 11 },
};

/* IDEB por escola – Top 10 das escolas reais */
const escolasTop10 = [
  'ECIT Francisco Ernesto do Rêgo',
  'ECIT Conselheiro José Braz do Rêgo',
  'ECIT Deputado Carlos Pessoa Filho',
  'ECIT Alcides Bezerra',
  'ECIT Severino Barbosa Camelo',
  'ECIT Presidente João Pessoa',
  'ECIT Prof.ª Maria Cecília de Castro',
  'ECIT Almirante Antônio H. do Rêgo',
  'ECIT Dr. Francisco de A. Montenegro',
  'EEEM José Tavares',
];
const dadosIdeb = {
  2026: [5.9, 5.7, 5.5, 5.4, 5.2, 5.0, 4.9, 4.7, 4.5, 4.3],
  2025: [5.6, 5.4, 5.2, 5.1, 4.9, 4.7, 4.6, 4.4, 4.2, 4.0],
  2024: [5.2, 5.0, 4.8, 4.7, 4.5, 4.3, 4.2, 4.0, 3.8, 3.7],
};

/* Evasão por série */
const dadosEvasao = {
  labels: ['1º Ano', '2º Ano', '3º Ano'],
  2026: [10, 6, 4],
  2025: [12, 8, 5],
  2024: [14, 10, 7],
};

/* Rendimento bimestral */
const bimestres = ['1º Bim', '2º Bim', '3º Bim', '4º Bim'];
const dadosRendimento = {
  todos: { 2024: [63, 67, 70, 73], 2025: [66, 70, 73, 77], 2026: [69, 73, 76, 80] },
  '1ano':{ 2024: [60, 64, 67, 70], 2025: [63, 67, 70, 73], 2026: [66, 70, 73, 77] },
  '2ano':{ 2024: [64, 68, 71, 74], 2025: [67, 71, 74, 78], 2026: [70, 74, 77, 81] },
  '3ano':{ 2024: [66, 70, 73, 77], 2025: [69, 73, 76, 80], 2026: [72, 76, 79, 83] },
};

/* ─── Cidades e escolas reais da 15ª GRE ─── */
const dadosCidades = {
  queimadas:              { nome: 'Queimadas',               isSede: true,  escolas: ['ECIT Francisco Ernesto do Rêgo', 'EEEM José Tavares', 'EEEEFM Tereza Alves de Moura'] },
  fagundes:               { nome: 'Fagundes',                isSede: false, escolas: ['ECI Joana Emilia da Silva', 'EEEF Frei Alberto'] },
  caturite:               { nome: 'Caturité',                isSede: false, escolas: ['ECI Felix Araujo'] },
  boqueirao:              { nome: 'Boqueirão',               isSede: false, escolas: ['ECIT Conselheiro José Braz do Rêgo', 'ECIT Severino Barbosa Camelo'] },
  cabaceiras:             { nome: 'Cabaceiras',              isSede: false, escolas: ['ECIT Alcides Bezerra', 'EEEFM Clovis Pedrosa'] },
  'barra-santana':        { nome: 'Barra de Santana',        isSede: false, escolas: ['ECIT Almirante Antônio Heráclito do Rêgo'] },
  'barra-sao-miguel':     { nome: 'Barra de São Miguel',     isSede: false, escolas: ['ECI Melquíades Tejo'] },
  umbuzeiro:              { nome: 'Umbuzeiro',               isSede: false, escolas: ['ECIT Presidente João Pessoa'] },
  'gado-bravo':           { nome: 'Gado Bravo',              isSede: false, escolas: ['ECI João da Silva Monteiro'] },
  aroeiras:               { nome: 'Aroeiras',                isSede: false, escolas: ['ECIT Deputado Carlos Pessoa Filho', 'EEEFM Deputado Major José Barbosa'] },
  natuba:                 { nome: 'Natuba',                  isSede: false, escolas: ['ECIT Doutor Francisco de Albuquerque Montenegro', 'EEEF Doutor Carlos Pessoa'] },
  'santa-cecilia':        { nome: 'Santa Cecília',           isSede: false, escolas: ['ECI Antônio Francisco Gomes'] },
  alcantil:               { nome: 'Alcantil',                isSede: false, escolas: ['ECIT Professora Maria Cecília de Castro'] },
  'riacho-santo-antonio': { nome: 'Riacho de Santo Antônio', isSede: false, escolas: ['ECI Ana Ferreira da Costa'] },
  'sao-domingos-cariri':  { nome: 'São Domingos do Cariri',  isSede: false, escolas: ['ECI Francisco Deodato do Nascimento'] },
};

/* Geração da lista de escolas para a tabela a partir de dadosCidades */
const idebBase = {
  'ECIT Francisco Ernesto do Rêgo':              5.2,
  'EEEM José Tavares':                           3.7,
  'EEEEFM Tereza Alves de Moura':                4.1,
  'ECI Joana Emilia da Silva':                   4.4,
  'EEEF Frei Alberto':                           3.9,
  'ECI Felix Araujo':                            4.2,
  'ECIT Conselheiro José Braz do Rêgo':          5.0,
  'ECIT Severino Barbosa Camelo':                4.5,
  'ECIT Alcides Bezerra':                        4.8,
  'EEEFM Clovis Pedrosa':                        4.0,
  'ECIT Almirante Antônio Heráclito do Rêgo':    4.4,
  'ECI Melquíades Tejo':                         3.8,
  'ECIT Presidente João Pessoa':                 4.3,
  'ECI João da Silva Monteiro':                  3.6,
  'ECIT Deputado Carlos Pessoa Filho':           4.7,
  'EEEFM Deputado Major José Barbosa':           4.1,
  'ECIT Doutor Francisco de Albuquerque Montenegro': 4.2,
  'EEEF Doutor Carlos Pessoa':                   3.7,
  'ECI Antônio Francisco Gomes':                 4.0,
  'ECIT Professora Maria Cecília de Castro':     4.6,
  'ECI Ana Ferreira da Costa':                   3.5,
  'ECI Francisco Deodato do Nascimento':         3.8,
};

const matriculasBase = {
  'ECIT Francisco Ernesto do Rêgo':              680,
  'EEEM José Tavares':                           520,
  'EEEEFM Tereza Alves de Moura':                410,
  'ECI Joana Emilia da Silva':                   295,
  'EEEF Frei Alberto':                           210,
  'ECI Felix Araujo':                            185,
  'ECIT Conselheiro José Braz do Rêgo':          490,
  'ECIT Severino Barbosa Camelo':                340,
  'ECIT Alcides Bezerra':                        380,
  'EEEFM Clovis Pedrosa':                        265,
  'ECIT Almirante Antônio Heráclito do Rêgo':    310,
  'ECI Melquíades Tejo':                         190,
  'ECIT Presidente João Pessoa':                 330,
  'ECI João da Silva Monteiro':                  175,
  'ECIT Deputado Carlos Pessoa Filho':           420,
  'EEEFM Deputado Major José Barbosa':           280,
  'ECIT Doutor Francisco de Albuquerque Montenegro': 350,
  'EEEF Doutor Carlos Pessoa':                   225,
  'ECI Antônio Francisco Gomes':                 200,
  'ECIT Professora Maria Cecília de Castro':     295,
  'ECI Ana Ferreira da Costa':                   155,
  'ECI Francisco Deodato do Nascimento':         170,
};

function calcStatus(ideb) {
  return ideb >= 4.8 ? 'regular' : ideb >= 4.0 ? 'atencao' : 'critico';
}
function calcAprovacao(ideb) {
  return Math.round(55 + ideb * 5.2);
}

const escolas = Object.values(dadosCidades).flatMap(cidade =>
  cidade.escolas.map(nome => ({
    nome,
    municipio: cidade.nome,
    isSede: cidade.isSede,
    matriculas: matriculasBase[nome] || 200,
    ideb:       idebBase[nome]       || 4.0,
    aprovacao:  calcAprovacao(idebBase[nome] || 4.0),
    status:     calcStatus(idebBase[nome]    || 4.0),
  }))
);

/* KPIs por ano */
const totalEscolas = escolas.length;
const kpiData = {
  2026: { matriculas: 9120,  professores: 548, escolas: totalEscolas, evasao: 7,  aprovacao: 79, ideb: 4.6 },
  2025: { matriculas: 8810,  professores: 531, escolas: totalEscolas, evasao: 9,  aprovacao: 75, ideb: 4.3 },
  2024: { matriculas: 8540,  professores: 514, escolas: totalEscolas, evasao: 11, aprovacao: 71, ideb: 4.1 },
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

function renderKPIs(year = 2026) {
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
function buildChartResultados(ano = 2026) {
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
function buildChartIdeb(ano = 2026) {
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
function buildChartEvasao(ano = 2026) {
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
      renderKPIs(2026);
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
