// ============================================================
// Amin AI World — script.js
// ============================================================

let localPrompts = JSON.parse(localStorage.getItem('aiw_local_prompts') || '[]');
let activeTag = 'all';
let searchTerm = '';
let currentVideoId = '';

function allPrompts(){ return [...localPrompts, ...PROMPTS]; }

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
    (p.titleEn||'').toLowerCase().includes(term) ||
    p.prompt.toLowerCase().includes(term) ||
    p.tool.toLowerCase().includes(term);
  return inTag && inSearch;
}

// ---------- Profile ----------
function renderProfile(){
  const avatar = document.getElementById('profileAvatar');
  if(PROFILE.avatarImage){
    avatar.style.background = `url('${PROFILE.avatarImage}') center/cover`;
    avatar.textContent = '';
  } else {
    avatar.style.background = PROFILE.avatarGradient;
    avatar.textContent = PROFILE.name.charAt(0).toUpperCase();
  }
  document.getElementById('profileName').textContent = PROFILE.name;
  document.getElementById('profileChannel').textContent = '📺 ' + PROFILE.channel;
  document.getElementById('profileBio').textContent = PROFILE.bio;
  document.getElementById('profileYoutube').href = PROFILE.youtube;
  const fb = document.getElementById('profileFacebook');
  if(PROFILE.facebook) fb.href = PROFILE.facebook;
  else fb.style.display = 'none';
}

// ---------- Filter chips ----------
function renderChips(){
  const bar = document.getElementById('filterBar');
  const tags = ['all', ...uniqueTags()];
  bar.innerHTML = tags.map(t =>
    `<button class="chip ${t===activeTag?'active':''}" data-tag="${t}">${t==='all'?'সব':t}</button>`
  ).join('');
  bar.querySelectorAll('.chip').forEach(c => {
    c.addEventListener('click', () => { activeTag = c.dataset.tag; renderChips(); renderPrompts(); });
  });
}

// ---------- Prompts ----------
function renderPrompts(){
  const grid = document.getElementById('promptGrid');
  const list = allPrompts().filter(matchesFilter);
  if(list.length === 0){
    grid.innerHTML = `<div class="empty-state">কোনো প্রম্পট পাওয়া যায়নি।</div>`;
    return;
  }
  grid.innerHTML = list.map(p => `
    <article class="prompt-card">
      <div class="prompt-img" style="background:${p.image ? `url('${p.image}') center/cover` : p.gradient}">
        <span class="tag-tool">${p.tool}</span>
      </div>
      <div class="prompt-body">
        <h3>${p.title}<span class="en">${p.titleEn||''}</span></h3>
        <div class="prompt-text">${p.prompt}</div>
        <div class="tags">${(p.tags||[]).map(t=>`<span class="tag">#${t}</span>`).join('')}</div>
        <button class="copy-btn" data-prompt="${encodeURIComponent(p.prompt)}">প্রম্পট কপি করুন</button>
      </div>
    </article>
  `).join('');
  grid.querySelectorAll('.copy-btn').forEach(btn => {
    btn.addEventListener('click', async () => {
      try{
        await navigator.clipboard.writeText(decodeURIComponent(btn.dataset.prompt));
        btn.textContent = 'কপি হয়েছে ✓'; btn.classList.add('copied');
        setTimeout(()=>{btn.textContent='প্রম্পট কপি করুন';btn.classList.remove('copied');},1800);
      }catch(e){btn.textContent='কপি ব্যর্থ';}
    });
  });
}

// ---------- Tools ----------
function renderTools(){
  const grid = document.getElementById('toolsGrid');
  grid.innerHTML = TOOLS.map(t => `
    <div class="tool-card">
      <div class="tool-top">
        <div><div class="tool-name">${t.name}</div><div class="tool-cat">${t.category}</div></div>
        <span class="badge-free ${t.free?'yes':'no'}">${t.free?'ফ্রি':'পেইড'}</span>
      </div>
      <p class="tool-desc">${t.desc}</p>
      <a class="tool-link" href="${t.link}" target="_blank" rel="noopener">ভিজিট করুন →</a>
    </div>
  `).join('');
}

// ---------- Music / Entertainment ----------
function renderMusic(){
  const grid = document.getElementById('musicGrid');
  if(!grid) return;

  const categories = {
    'all':'সব', 'folk':'লোকগীতি', 'romantic':'রোমান্টিক',
    'emotional':'আবেগময়', 'social':'সামাজিক', 'inspirational':'অনুপ্রেরণামূলক'
  };
  let activeCat = 'all';

  function renderMusicFilter(){
    const mf = document.getElementById('musicFilter');
    mf.innerHTML = Object.entries(categories).map(([k,v])=>
      `<button class="chip ${k===activeCat?'active':''}" data-cat="${k}">${v}</button>`
    ).join('');
    mf.querySelectorAll('.chip').forEach(c=>{
      c.addEventListener('click',()=>{activeCat=c.dataset.cat;renderMusicFilter();renderMusicCards();});
    });
  }

  function renderMusicCards(){
    const filtered = MUSIC.filter(m => activeCat==='all' || m.category===activeCat);
    grid.innerHTML = filtered.map(m => `
      <div class="music-card" data-id="${m.youtubeId}">
        <div class="music-thumb">
          <img src="https://img.youtube.com/vi/${m.youtubeId}/hqdefault.jpg" alt="${m.title}" loading="lazy">
          <div class="play-btn"><span>▶️</span></div>
          <span class="music-cat">${categories[m.category]||m.category}</span>
        </div>
        <div class="music-body"><h3>${m.title}</h3></div>
      </div>
    `).join('');
    grid.querySelectorAll('.music-card').forEach(card=>{
      card.addEventListener('click',()=>openMusicModal(card.dataset.id, card.querySelector('h3').textContent));
    });
  }

  renderMusicFilter();
  renderMusicCards();
}

function openMusicModal(videoId, title){
  let modal = document.getElementById('musicModal');
  if(!modal){
    modal = document.createElement('div');
    modal.id = 'musicModal';
    modal.className = 'music-modal';
    modal.innerHTML = `
      <div class="modal-inner">
        <div class="modal-top">
          <h3 id="modalTitle"></h3>
          <button class="modal-close" id="modalClose">✕</button>
        </div>
        <div class="modal-video"><iframe id="modalIframe" allowfullscreen allow="autoplay"></iframe></div>
      </div>`;
    document.body.appendChild(modal);
    document.getElementById('modalClose').addEventListener('click', closeMusicModal);
    modal.addEventListener('click', e=>{ if(e.target===modal) closeMusicModal(); });
  }
  document.getElementById('modalTitle').textContent = title;
  document.getElementById('modalIframe').src = `https://www.youtube.com/embed/${videoId}?autoplay=1`;
  modal.classList.add('open');
}

function closeMusicModal(){
  const modal = document.getElementById('musicModal');
  if(modal){ modal.classList.remove('open'); document.getElementById('modalIframe').src=''; }
}

// ---------- Articles ----------
function renderArticles(){
  const grid = document.getElementById('articleGrid');
  if(!grid) return;
  if(!ARTICLES.length){
    grid.innerHTML = `<div class="empty-state">শীঘ্রই আসছে।</div>`; return;
  }
  grid.innerHTML = ARTICLES.map(a=>`
    <article class="article-card">
      <div class="article-date">${a.date}</div>
      <h3>${a.title}</h3>
      <p>${a.excerpt}</p>
    </article>
  `).join('');
}

// ---------- Terminal animation ----------
function startTerminal(){
  const el = document.getElementById('typedOut');
  const samples = PROMPTS.slice(0,6).map(p=>p.prompt);
  let pi=0, ci=0, deleting=false;
  function tick(){
    const full = samples[pi];
    if(!deleting){ ci++; el.textContent=full.slice(0,ci);
      if(ci===full.length){deleting=true;setTimeout(tick,1800);return;}
    } else { ci--; el.textContent=full.slice(0,ci);
      if(ci===0){deleting=false;pi=(pi+1)%samples.length;}
    }
    setTimeout(tick,deleting?18:28);
  }
  tick();
}

// ---------- Upload form ----------
function setupForm(){
  const form = document.getElementById('uploadForm');
  if(!form) return;
  form.addEventListener('submit', e=>{
    e.preventDefault();
    const fd = new FormData(form);
    const newP = {
      id:'local_'+Date.now(),
      title:fd.get('title'), titleEn:fd.get('titleEn')||fd.get('title'),
      prompt:fd.get('prompt'), tool:fd.get('tool'),
      tags:fd.get('tags').split(',').map(t=>t.trim()).filter(Boolean),
      image:fd.get('image')||'', gradient:'linear-gradient(135deg,#7C5CFF,#4DE8FF)'
    };
    localPrompts.unshift(newP);
    localStorage.setItem('aiw_local_prompts',JSON.stringify(localPrompts));
    form.reset(); renderChips(); renderPrompts();
    document.getElementById('formStatus').textContent='যোগ হয়েছে ✓';
    setTimeout(()=>document.getElementById('formStatus').textContent='',3000);
  });
}

// ---------- Search ----------
function setupSearch(){
  document.getElementById('searchInput').addEventListener('input', e=>{
    searchTerm=e.target.value; renderPrompts();
  });
}

// ---------- Mobile nav ----------
function setupMobileNav(){
  const toggle = document.getElementById('menuToggle');
  const nav = document.getElementById('mainNav');
  toggle.addEventListener('click',()=>nav.classList.toggle('open'));
  nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>nav.classList.remove('open')));
}

// ---------- Init ----------
document.addEventListener('DOMContentLoaded', ()=>{
  renderProfile();
  renderChips();
  renderPrompts();
  renderTools();
  renderMusic();
  renderArticles();
  startTerminal();
  setupForm();
  setupSearch();
  setupMobileNav();
  document.getElementById('year').textContent = new Date().getFullYear();
});
