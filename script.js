// ---------- State ----------
let localPrompts = JSON.parse(localStorage.getItem('aiw_local_prompts') || '[]');
let activeTag = 'all';
let searchTerm = '';

function allPrompts(){ return [...localPrompts, ...PROMPTS]; }

// ---------- Helpers ----------
function uniqueTags(){
  const t = new Set();
  allPrompts().forEach(p => p.tags.forEach(x => t.add(x)));
  return [...t];
}

function matchesFilter(p){
  const inTag = activeTag === 'all' || p.tags.includes(activeTag);
  const term = searchTerm.trim().toLowerCase();
  const inSearch = !term ||
    p.title.toLowerCase().includes(term) ||
    p.titleEn.toLowerCase().includes(term) ||
    p.prompt.toLowerCase().includes(term) ||
    p.tool.toLowerCase().includes(term);
  return inTag && inSearch;
}

// ---------- Render: filter chips ----------
function renderChips(){
  const bar = document.getElementById('filterBar');
  const tags = ['all', ...uniqueTags()];
  bar.innerHTML = tags.map(t =>
    `<button class="chip ${t===activeTag?'active':''}" data-tag="${t}">${t==='all' ? 'সব' : t}</button>`
  ).join('');
  bar.querySelectorAll('.chip').forEach(c => {
    c.addEventListener('click', () => {
      activeTag = c.dataset.tag;
      renderChips();
      renderPrompts();
    });
  });
}

// ---------- Render: prompt grid ----------
function renderPrompts(){
  const grid = document.getElementById('promptGrid');
  const list = allPrompts().filter(matchesFilter);

  if(list.length === 0){
    grid.innerHTML = `<div class="empty-state">কোনো প্রম্পট পাওয়া যায়নি। অন্য কিছু খুঁজে দেখুন।</div>`;
    return;
  }

  grid.innerHTML = list.map(p => `
    <article class="prompt-card">
      <div class="prompt-img" style="background:${p.image ? `url('${p.image}') center/cover` : p.gradient}">
        <span class="tag-tool">${p.tool}</span>
      </div>
      <div class="prompt-body">
        <h3>${p.title}<span class="en">${p.titleEn}</span></h3>
        <div class="prompt-text">${p.prompt}</div>
        <div class="tags">${p.tags.map(t => `<span class="tag">#${t}</span>`).join('')}</div>
        <button class="copy-btn" data-prompt="${encodeURIComponent(p.prompt)}">প্রম্পট কপি করুন</button>
      </div>
    </article>
  `).join('');

  grid.querySelectorAll('.copy-btn').forEach(btn => {
    btn.addEventListener('click', async () => {
      const text = decodeURIComponent(btn.dataset.prompt);
      try{
        await navigator.clipboard.writeText(text);
        btn.textContent = 'কপি হয়েছে ✓';
        btn.classList.add('copied');
        setTimeout(() => { btn.textContent = 'প্রম্পট কপি করুন'; btn.classList.remove('copied'); }, 1800);
      }catch(e){
        btn.textContent = 'কপি ব্যর্থ হয়েছে';
      }
    });
  });
}

// ---------- Render: profile ----------
function renderProfile(){
  const avatar = document.getElementById('profileAvatar');
  avatar.style.background = PROFILE.avatarGradient;
  avatar.textContent = PROFILE.name.charAt(0).toUpperCase();
  document.getElementById('profileName').textContent = PROFILE.name;
  document.getElementById('profileChannel').textContent = '📺 ' + PROFILE.channel;
  document.getElementById('profileBio').textContent = PROFILE.bio;
  const yt = document.getElementById('profileYoutube');
  yt.href = PROFILE.youtube;
  const fb = document.getElementById('profileFacebook');
  if(PROFILE.facebook) fb.href = PROFILE.facebook;
  else fb.style.display = 'none';
}

// ---------- Render: articles ----------
function renderArticles(){
  const grid = document.getElementById('articleGrid');
  if(!grid) return;
  if(ARTICLES.length === 0){
    grid.innerHTML = `<div class="empty-state">এখনো কোনো লেখা যোগ করা হয়নি।</div>`;
    return;
  }
  grid.innerHTML = ARTICLES.map(a => `
    <article class="article-card">
      <div class="article-date">${a.date}</div>
      <h3>${a.title}</h3>
      <p>${a.excerpt}</p>
    </article>
  `).join('');
}

// ---------- Render: videos ----------
function renderVideos(){
  const grid = document.getElementById('videoGrid');
  if(!grid) return;
  grid.innerHTML = VIDEOS.map(v => {
    const ready = v.youtubeId && v.youtubeId !== 'REPLACE_WITH_YOUTUBE_ID';
    return `
    <article class="video-card">
      <div class="video-frame">
        ${ready
          ? `<iframe src="https://www.youtube.com/embed/${v.youtubeId}" title="${v.title}" allowfullscreen loading="lazy"></iframe>`
          : `<div style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;color:var(--muted);font-size:0.85rem;text-align:center;padding:20px;">এই ভিডিওর YouTube লিংক এখনো যোগ করা হয়নি</div>`
        }
      </div>
      <div class="video-body">
        <span class="video-tool-badge">${v.tool}</span>
        <h3>${v.title}<span class="en">${v.titleEn}</span></h3>
        <div class="video-prompt">${v.prompt}</div>
      </div>
    </article>`;
  }).join('');
}

// ---------- Render: tools ----------
function renderTools(){
  const grid = document.getElementById('toolsGrid');
  grid.innerHTML = TOOLS.map(t => `
    <div class="tool-card">
      <div class="tool-top">
        <div>
          <div class="tool-name">${t.name}</div>
          <div class="tool-cat">${t.category}</div>
        </div>
        <span class="badge-free ${t.free ? 'yes':'no'}">${t.free ? 'ফ্রি' : 'পেইড'}</span>
      </div>
      <p class="tool-desc">${t.desc}</p>
      <a class="tool-link" href="${t.link}" target="_blank" rel="noopener">ভিজিট করুন →</a>
    </div>
  `).join('');
}

// ---------- Terminal typing animation ----------
function startTerminal(){
  const el = document.getElementById('typedOut');
  const samples = PROMPTS.map(p => p.prompt);
  let pi = 0, ci = 0, deleting = false;

  function tick(){
    const full = samples[pi];
    if(!deleting){
      ci++;
      el.textContent = full.slice(0, ci);
      if(ci === full.length){ deleting = true; setTimeout(tick, 1800); return; }
    } else {
      ci--;
      el.textContent = full.slice(0, ci);
      if(ci === 0){ deleting = false; pi = (pi+1) % samples.length; }
    }
    setTimeout(tick, deleting ? 18 : 28);
  }
  tick();
}

// ---------- Upload form ----------
function setupForm(){
  const form = document.getElementById('uploadForm');
  if(!form) return;
  form.addEventListener('submit', e => {
    e.preventDefault();
    const fd = new FormData(form);
    const newPrompt = {
      id: 'local_' + Date.now(),
      title: fd.get('title'),
      titleEn: fd.get('titleEn') || fd.get('title'),
      prompt: fd.get('prompt'),
      tool: fd.get('tool'),
      tags: fd.get('tags').split(',').map(t => t.trim()).filter(Boolean),
      image: fd.get('image') || '',
      gradient: 'linear-gradient(135deg,#7C5CFF,#4DE8FF)'
    };
    localPrompts.unshift(newPrompt);
    localStorage.setItem('aiw_local_prompts', JSON.stringify(localPrompts));
    form.reset();
    renderChips();
    renderPrompts();
    document.getElementById('formStatus').textContent = 'যোগ হয়েছে ✓ — নিচে গ্যালারিতে দেখুন';
    setTimeout(() => document.getElementById('formStatus').textContent = '', 3000);
  });
}

// ---------- Search ----------
function setupSearch(){
  const input = document.getElementById('searchInput');
  input.addEventListener('input', () => {
    searchTerm = input.value;
    renderPrompts();
  });
}

// ---------- Mobile nav ----------
function setupMobileNav(){
  const toggle = document.getElementById('menuToggle');
  const nav = document.getElementById('mainNav');
  toggle.addEventListener('click', () => nav.classList.toggle('open'));
  nav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => nav.classList.remove('open')));
}

// ---------- Init ----------
document.addEventListener('DOMContentLoaded', () => {
  renderProfile();
  renderChips();
  renderPrompts();
  renderTools();
  renderVideos();
  renderArticles();
  startTerminal();
  setupForm();
  setupSearch();
  setupMobileNav();
  document.getElementById('year').textContent = new Date().getFullYear();
});
