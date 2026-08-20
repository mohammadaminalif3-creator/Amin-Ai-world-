// ============================================================
// Amin AI World — script.js
// Renders all sections using the data arrays from data.js
// ============================================================

document.getElementById('year').textContent = new Date().getFullYear();

const menuBtn = document.getElementById('menuBtn');
const navLinks = document.getElementById('navLinks');
menuBtn.addEventListener('click', () => navLinks.classList.toggle('open'));
navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', () => navLinks.classList.remove('open')));

function animateCount(id, target){
  const el = document.getElementById(id);
  let cur = 0;
  if(!target){ el.textContent = '0'; return; }
  const step = Math.max(1, Math.ceil(target/30));
  const tick = () => { cur = Math.min(target, cur+step); el.textContent = cur; if(cur<target) requestAnimationFrame(tick); };
  tick();
}

// ---------- TOOLS ----------
const toolsGrid = document.getElementById('toolsGrid');
toolsGrid.innerHTML = TOOLS.map(t => `
  <a class="card" href="${t.link}" target="_blank" rel="noopener">
    <span class="badge">${t.category}</span>
    <h3>${t.name}</h3>
    <p>${t.desc}</p>
    <span class="linkbtn">${t.free ? '✅ ফ্রি ব্যবহার করুন' : '⭐ প্রিমিয়াম'} →</span>
  </a>
`).join('');
animateCount('cnt-tools', TOOLS.length);

// ---------- PROMPTS ----------
const promptsGrid = document.getElementById('promptsGrid');
const promptTags = ['সব', ...new Set(PROMPTS.flatMap(p => p.tags))].slice(0, 14);
document.getElementById('promptFilters').innerHTML = promptTags.map((tag,i) =>
  `<button data-tag="${tag}" class="${i===0?'active':''}">${tag}</button>`
).join('');

function renderPrompts(filterTag){
  const list = (!filterTag || filterTag === 'সব') ? PROMPTS : PROMPTS.filter(p => p.tags.includes(filterTag));
  promptsGrid.innerHTML = list.map(p => `
    <div class="card prompt-card" style="background:${p.gradient}">
      <span class="p-tool">${p.tool}</span>
      <h3>${p.title}</h3>
      <button class="copy" data-id="${p.id}">📋 প্রম্পট কপি করুন</button>
    </div>
  `).join('');
  promptsGrid.querySelectorAll('button.copy').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = PROMPTS.find(p => p.id === btn.dataset.id);
      navigator.clipboard?.writeText(item.prompt).then(() => {
        btn.textContent = '✅ কপি হয়েছে!';
        btn.classList.add('copied');
        setTimeout(() => { btn.textContent = '📋 প্রম্পট কপি করুন'; btn.classList.remove('copied'); }, 1800);
      });
    });
  });
}
renderPrompts('সব');
document.getElementById('promptFilters').addEventListener('click', e => {
  if(e.target.tagName !== 'BUTTON') return;
  document.querySelectorAll('#promptFilters button').forEach(b => b.classList.remove('active'));
  e.target.classList.add('active');
  renderPrompts(e.target.dataset.tag);
});
animateCount('cnt-prompts', PROMPTS.length);

// ---------- ISLAMIC ----------
const dq = ISLAMIC_QUOTES[Math.floor(Math.random()*ISLAMIC_QUOTES.length)];
document.getElementById('dailyQuote').textContent = `"${dq.quote}"`;
document.getElementById('dailyQuoteAttr').textContent = dq.attribution;

document.getElementById('islamicGrid').innerHTML = ISLAMIC_QUOTES.map(q => `
  <div class="card" style="background:${q.gradient};color:#fff;">
    <h3 style="color:#fff;">${q.title}</h3>
    <p style="color:rgba(255,255,255,0.9);">"${q.quote}"</p>
    <span class="p-tool" style="opacity:.85;">${q.attribution}</span>
  </div>
`).join('');

document.getElementById('islamicLinksGrid').innerHTML = ISLAMIC_LINKS.map(l => `
  <a class="card" href="${l.link}" target="_blank" rel="noopener">
    <div class="icon">${l.icon}</div>
    <h3>${l.name}</h3>
    <p>${l.desc}</p>
  </a>
`).join('');
animateCount('cnt-islamic', ISLAMIC_QUOTES.length);

// ---------- INSPIRATION ----------
document.getElementById('inspirationGrid').innerHTML = INSPIRATION_QUOTES.map(q => `
  <div class="card" style="background:${q.gradient};color:#fff;">
    <h3 style="color:#fff;">${q.title}</h3>
    <p style="color:rgba(255,255,255,0.9);">"${q.quote}"</p>
    <span class="p-tool" style="opacity:.85;">${q.attribution}</span>
  </div>
`).join('');

// ---------- BLOG ----------
document.getElementById('blogGrid').innerHTML = ARTICLES.map(a => `
  <div class="card">
    <div class="icon">📝</div>
    <h3>${a.title}</h3>
    <p>${a.excerpt}</p>
    <span class="badge">${a.date}</span>
  </div>
`).join('') || `<div class="card"><p>শীঘ্রই আরও পোস্ট আসছে।</p></div>`;

// ---------- ENTERTAINMENT (MUSIC) ----------
document.getElementById('entertainmentGrid').innerHTML = MUSIC.map(m => `
  <a class="card" href="https://www.youtube.com/watch?v=${m.youtubeId}" target="_blank" rel="noopener">
    <div class="icon">🎵</div>
    <h3>${m.title}</h3>
    <span class="badge">${m.category}</span>
  </a>
`).join('');
animateCount('cnt-music', MUSIC.length);

// ---------- INCOME APPS ----------
document.getElementById('incomeGrid').innerHTML = INCOME_APPS.map((app,i) => `
  <div class="cta-card ${i%2===0?'a':'b'}">
    <h3>💰 ${app.name}</h3>
    <p>${app.desc}</p>
    <iframe class="income-video" src="https://www.youtube.com/embed/${app.videoId}" title="${app.name}" frameborder="0" allowfullscreen loading="lazy"></iframe>
    <a href="${app.playLink}" target="_blank" rel="noopener" class="btn btn-gold">📲 অ্যাপ ডাউনলোড করুন</a>
  </div>
`).join('');

// ---------- SOCIAL ----------
document.getElementById('socialGrid').innerHTML = SOCIAL_LINKS.map(s => `
  <a class="social-card" href="${s.link}" target="_blank" rel="noopener">
    <span class="s-icon" style="background:${s.color}">${s.icon}</span>
    <span class="s-text"><b>${s.name}</b>${s.desc}</span>
  </a>
`).join('');

/* ---------------- PWA install prompt ---------------- */
const installBanner = document.getElementById('installBanner');
let deferredPrompt = null;
const isStandalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;
const dismissed = localStorage.getItem('installDismissed') === '1';
window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
  if(!isStandalone && !dismissed) installBanner.classList.add('show');
});
document.getElementById('installGo').addEventListener('click', async () => {
  if(deferredPrompt){ deferredPrompt.prompt(); await deferredPrompt.userChoice; deferredPrompt=null; }
  installBanner.classList.remove('show');
});
document.getElementById('installClose').addEventListener('click', () => {
  installBanner.classList.remove('show');
  localStorage.setItem('installDismissed','1');
});

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('sw.js').catch(()=>{});
}
