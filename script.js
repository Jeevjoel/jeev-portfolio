const $ = (s, root=document) => root.querySelector(s);
const $$ = (s, root=document) => [...root.querySelectorAll(s)];
if (window.lucide) lucide.createIcons();
$('#year').textContent = new Date().getFullYear();

// Reveal on scroll
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('visible'); revealObserver.unobserve(entry.target); } });
}, { threshold: 0.12 });
$$('.reveal').forEach(el => revealObserver.observe(el));

// Reading progress
const progress = $('#scrollProgress');
window.addEventListener('scroll', () => {
  const max = document.documentElement.scrollHeight - window.innerHeight;
  progress.style.width = `${max > 0 ? window.scrollY / max * 100 : 0}%`;
}, { passive: true });

// Theme preference
const themeToggle = $('#themeToggle');
if (localStorage.getItem('jeev-theme') === 'light') document.body.classList.add('light');
function updateThemeIcon(){ themeToggle.innerHTML = document.body.classList.contains('light') ? '<i data-lucide="moon"></i>' : '<i data-lucide="sun-moon"></i>'; lucide.createIcons(); }
updateThemeIcon();
themeToggle.addEventListener('click', () => {
  document.body.classList.toggle('light');
  localStorage.setItem('jeev-theme', document.body.classList.contains('light') ? 'light' : 'dark');
  updateThemeIcon();
});

// Mobile menu
$('#menuToggle').addEventListener('click', () => $('#mobileMenu').classList.toggle('open'));
$$('#mobileMenu a').forEach(a => a.addEventListener('click', () => $('#mobileMenu').classList.remove('open')));

// Project filters
$$('.filter').forEach(button => button.addEventListener('click', () => {
  $$('.filter').forEach(b => b.classList.remove('active'));
  button.classList.add('active');
  const filter = button.dataset.filter;
  $$('.project-card').forEach(card => {
    const show = filter === 'all' || card.dataset.category.split(' ').includes(filter);
    card.classList.toggle('hidden', !show);
  });
}));

// Project detail modal
const projectData = {
  biaswatch: {
    kicker:'PROJECT / 001 — FULL STACK + GEN AI',
    title:'BiasWatch',
    description:'An AI-powered application for analysing and comparing Indian news coverage.',
    overview:'Built a Django and HTMX workflow to compare how different news outlets report the same topics, with an AI-assisted approach to separating factual statements from opinion.',
    tech:'Python · Django · HTMX · SQLite · Gemini'
  },
  'language-model': {
    kicker:'PROJECT / 002 — MACHINE LEARNING',
    title:'Character-Level Neural Language Model',
    description:'A small neural language model that learns character patterns and generates new word-like sequences.',
    overview:'Implemented character encoding, dataset construction, train/validation/test splits, mini-batch gradient descent, cross-entropy optimisation, and probabilistic autoregressive sampling. The model predicts the next character from an 8-character context.',
    tech:'Python · PyTorch · Embeddings · Fully connected neural networks'
  },
  'fifa-eda': {
    kicker:'PROJECT / 003 — DATA ANALYSIS',
    title:'FIFA World Cup — Exploratory Data Analysis',
    description:'An exploratory study of international football datasets, focused on patterns behind match outcomes.',
    overview:'Analysed goal distributions, team performance, FIFA rankings, recent form, head-to-head statistics, missing values, outliers, class imbalance, and feature correlations. Created visual and statistical analyses to examine relationships with match outcomes.',
    tech:'Python · pandas · NumPy · Matplotlib · Statistics'
  }
};
const modal = $('#projectModal');
function openProject(key) {
  const data = projectData[key]; if (!data) return;
  $('#modalKicker').textContent = data.kicker;
  $('#modalTitle').textContent = data.title;
  $('#modalDescription').textContent = data.description;
  $('#modalOverview').textContent = data.overview;
  $('#modalTech').textContent = data.tech;
  modal.classList.add('open'); modal.setAttribute('aria-hidden','false'); document.body.style.overflow='hidden';
  $('#modalClose').focus();
}
function closeProject(){ modal.classList.remove('open'); modal.setAttribute('aria-hidden','true'); document.body.style.overflow=''; }
$$('[data-open]').forEach(btn => btn.addEventListener('click', () => openProject(btn.dataset.open)));
$('#modalClose').addEventListener('click', closeProject);
modal.addEventListener('click', e => { if (e.target === modal) closeProject(); });

// Copy email
$('#copyEmail').addEventListener('click', async () => {
  const email = 'jeevjoelmanjila@gmail.com';
  try { await navigator.clipboard.writeText(email); }
  catch { const t=document.createElement('textarea'); t.value=email; document.body.appendChild(t); t.select(); document.execCommand('copy'); t.remove(); }
  const toast=$('#toast'); toast.classList.add('show'); setTimeout(()=>toast.classList.remove('show'),2100);
});

// Command palette: Cmd/Ctrl + K
const overlay = $('#commandOverlay'), commandInput = $('#commandInput');
function openCommand(){ overlay.classList.add('open'); overlay.setAttribute('aria-hidden','false'); commandInput.value=''; filterCommands(''); setTimeout(()=>commandInput.focus(),30); }
function closeCommand(){ overlay.classList.remove('open'); overlay.setAttribute('aria-hidden','true'); }
$('#commandHint').addEventListener('click', openCommand);
commandInput.addEventListener('input', e => filterCommands(e.target.value));
function filterCommands(value){
  const q=value.toLowerCase();
  $$('.command-items button').forEach(btn=>btn.style.display=btn.textContent.toLowerCase().includes(q)?'flex':'none');
}
$$('.command-items button').forEach(btn=>btn.addEventListener('click',()=>{
  closeCommand(); const target=$(btn.dataset.target); target?.scrollIntoView({behavior:'smooth'});
}));
overlay.addEventListener('click',e=>{if(e.target===overlay)closeCommand();});
document.addEventListener('keydown',e=>{
  if((e.metaKey||e.ctrlKey)&&e.key.toLowerCase()==='k'){e.preventDefault();openCommand();}
  if(e.key==='Escape'){closeCommand();closeProject();}
  if(e.key==='Enter'&&overlay.classList.contains('open')){
    const first=$('.command-items button:not([style*="display: none"])');
    if(first)first.click();
  }
});
