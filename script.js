// ============================================================
// Amin AI World — script.js | Complete Edition
// ============================================================

let localPrompts = JSON.parse(localStorage.getItem('aiw_prompts') || '[]');
let extraMusic = [];
let activeTag = 'all';
let searchTerm = '';
let currentAI = 'claude';
let chatHistory = [];

function allPrompts(){ return [...localPrompts, ...PROMPTS]; }

// ===== AI CHAT =====
function switchAI(ai, btn){
  currentAI = ai;
  document.querySelectorAll('.chat-tab').forEach(t => t.classList.remove('active'));
  btn.classList.add('active');
  const notice = document.getElementById('chatNotice');
  const welcomeDiv = document.querySelector('.chat-welcome p');
  if(ai === 'claude'){
    notice.innerHTML = 'Claude AI দিয়ে চ্যাট করছেন। অন্য AI — <a href="https://gemini.google.com" target="_blank">Gemini</a> | <a href="https://chat.openai.com" target="_blank">ChatGPT</a>';
    if(welcomeDiv) welcomeDiv.innerHTML = '<b>স্বাগতম! Amin AI World-এ!</b><br>আমি Claude AI। আপনার যেকোনো প্রশ্ন করুন।<br><small style="color:#8B93A7;margin-top:6px;display:block;">Powered by Anthropic Claude</small>';
  } else if(ai === 'gemini'){
    notice.innerHTML = '⚡ Gemini-তে চলে যাবে। <a href="https://gemini.google.com" target="_blank">Gemini সরাসরি খুলুন →</a>';
  } else {
    notice.innerHTML = '⚡ ChatGPT-তে চলে যাবে। <a href="https://chat.openai.com" target="_blank">ChatGPT সরাসরি খুলুন →</a>';
  }
}

async function sendChat(){
  const input = document.getElementById('chatInput');
  const msg = input.value.trim();
  if(!msg) return;

  if(currentAI === 'gemini'){
    window.open('https://gemini.google.com/?q=' + encodeURIComponent(msg), '_blank');
    input.value = '';
    return;
  }
  if(currentAI === 'chatgpt'){
    window.open('https://chat.openai.com/?q=' + encodeURIComponent(msg), '_blank');
    input.value = '';
    return;
  }

  // Claude AI via Anthropic API
  addChatMsg('user', msg);
  input.value = '';
  document.getElementById('chatSendBtn').disabled = true;
  showTyping();

  chatHistory.push({ role: 'user', content: msg });

  try {
    const resp = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'claude-sonnet-4-6',
        max_tokens: 1000,
        system: 'You are a helpful AI assistant on Amin AI World website — a Bangladeshi AI platform. When the user writes in Bengali, reply in Bengali. When in English, reply in English. Be friendly, helpful and concise. This site features AI prompts, tools directory, movies, music and entertainment for Bangladeshi audience.',
        messages: chatHistory
      })
    });
    const data = await resp.json();
    hideTyping();
    const reply = data.content?.[0]?.text || 'দুঃখিত, এই মুহূর্তে উত্তর দিতে পারছি না।';
    chatHistory.push({ role: 'assistant', content: reply });
    addChatMsg('ai', reply);
  } catch(e) {
    hideTyping();
    addChatMsg('ai', '❌ সংযোগ সমস্যা হয়েছে। একটু পরে আবার চেষ্টা করুন অথবা সরাসরি <a href="https://claude.ai" target="_blank" style="color:var(--cyan)">claude.ai</a>-তে যান।');
  }
  document.getElementById('chatSendBtn').disabled = false;
  input.focus();
}

function addChatMsg(role, text){
  const box = document.getElementById('chatMessages');
  const welcome = box.querySelector('.chat-welcome');
  if(welcome) welcome.remove();
  const div = document.createElement('div');
  div.className = 'msg ' + role;
  const avatar = role === 'user' ? 'আপনি' : 'AI';
  div.innerHTML = `<div class="msg-avatar">${role === 'user' ? '👤' : '🤖'}</div><div class="msg-bubble">${text.replace(/\n/g,'<br>')}</div>`;
  box.appendChild(div);
  box.scrollTop = box.scrollHeight;
}

function showTyping(){
  const box = document.getElementById('chatMessages');
  const d = document.createElement('div');
  d.className = 'msg ai'; d.id = 'typingMsg';
  d.innerHTML = '<div class="msg-avatar">🤖</div><div class="msg-bubble"><div class="typing-indicator"><div class="typing-dot"></div><div class="typing-dot"></div><div class="typing-dot"></div></div></div>';
  box.appendChild(d);
  box.scrollTop = box.scrollHeight;
}
function hideTyping(){ const t = document.getElementById('typingMsg'); if(t) t.remove(); }

// ===== PROFILE =====
function renderProfile(){
  const av = document.getElementById('profileAvatar');
  av.style.background = PROFILE.avatarGradient;
  if(PROFILE.avatarImage){
    av.innerHTML = `<img src="${PROFILE.avatarImage}" style="width:100%;height:100%;object-fit:cover;border-radius:50%;" onerror="this.remove();this.parentElement.textContent='A'">`;
  } else { av.textContent = 'A'; }
  document.getElementById('profileName').textContent = PROFILE.name;
  document.getElementById('profileChannel').textContent = '📺 ' + PROFILE.channel;
  document.getElementById('profileBio').textContent = PROFILE.bio;
  const yt = document.getElementById('profileYoutube'); if(yt) yt.href = PROFILE.youtube;
  const fb = document.getElementById('profileFacebook'); if(fb){ if(PROFILE.facebook) fb.href=PROFILE.facebook; else fb.style.display='none'; }
  const fbp = document.getElementById('profileFbPage'); if(fbp){ if(PROFILE.facebookPage) fbp.href=PROFILE.facebookPage; else fbp.style.display='none'; }
}

// ===== FILTER CHIPS =====
function renderChips(){
  const bar = document.getElementById('filterBar');
  const tags = ['all', ...new Set(allPrompts().flatMap(p => p.tags||[]))];
  bar.innerHTML = tags.map(t =>
    `<button class="chip ${t===activeTag?'active':''}" data-tag="${t}">${t==='all'?'সব':t}</button>`
  ).join('');
  bar.querySelectorAll('.chip').forEach(c => {
    c.addEventListener('click', () => { activeTag = c.dataset.tag; renderChips(); renderPrompts(); });
  });
}

// ===== PROMPTS =====
function renderPrompts(){
  const grid = document.getElementById('promptGrid');
  const list = allPrompts().filter(p => {
    const inTag = activeTag === 'all' || (p.tags||[]).includes(activeTag);
    const term = searchTerm.trim().toLowerCase();
    const inSearch = !term || (p.title||'').toLowerCase().includes(term) || (p.titleEn||'').toLowerCase().includes(term) || (p.prompt||'').toLowerCase().includes(term) || (p.tool||'').toLowerCase().includes(term);
    return inTag && inSearch;
  });
  if(!list.length){ grid.innerHTML = '<div class="empty-state">কোনো প্রম্পট পাওয়া যায়নি।</div>'; return; }
  grid.innerHTML = list.map(p => `
    <article class="prompt-card">
      <div class="prompt-img" style="background:${p.gradient||'linear-gradient(135deg,#7C5CFF,#4DE8FF)'};position:relative;overflow:hidden;">
        ${p.image ? `<img src="${p.image}" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;" onerror="this.style.display='none'">` : ''}
        <span class="tag-tool">${p.tool||''}</span>
      </div>
      <div class="prompt-body">
        <h3>${p.title||''}<span class="en">${p.titleEn||''}</span></h3>
        <div class="prompt-text">${p.prompt||''}</div>
        <div class="tags">${(p.tags||[]).map(t=>`<span class="tag">#${t}</span>`).join('')}</div>
        <button class="copy-btn" data-prompt="${encodeURIComponent(p.prompt||'')}">প্রম্পট কপি করুন</button>
      </div>
    </article>`).join('');
  grid.querySelectorAll('.copy-btn').forEach(btn => {
    btn.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(decodeURIComponent(btn.dataset.prompt));
        btn.textContent = 'কপি হয়েছে ✓'; btn.classList.add('copied');
        setTimeout(() => { btn.textContent = 'প্রম্পট কপি করুন'; btn.classList.remove('copied'); }, 1800);
      } catch(e) { btn.textContent = 'কপি ব্যর্থ'; }
    });
  });
}

// ===== TOOLS =====
function renderTools(){
  document.getElementById('toolsGrid').innerHTML = TOOLS.map(t => `
    <div class="tool-card">
      <div class="tool-top">
        <div><div class="tool-name">${t.name}</div><div class="tool-cat">${t.category}</div></div>
        <span class="badge-free ${t.free?'yes':'no'}">${t.free?'ফ্রি':'পেইড'}</span>
      </div>
      <p class="tool-desc">${t.desc}</p>
      <a class="tool-link" href="${t.link}" target="_blank" rel="noopener">ভিজিট করুন →</a>
    </div>`).join('');
}

// ===== SOCIAL =====
function renderSocial(){
  const grid = document.getElementById('socialGrid');
  if(!grid || !SOCIAL_LINKS) return;
  grid.innerHTML = SOCIAL_LINKS.map(s => `
    <a class="social-card" href="${s.link}" target="_blank" rel="noopener">
      <div class="social-icon" style="background:${s.color}22;color:${s.color};font-size:1.4rem;">${s.icon}</div>
      <div class="social-name">${s.name}</div>
      <div class="social-desc">${s.desc}</div>
    </a>`).join('');
}

// ===== MOVIES =====
function renderMovies(){
  const grid = document.getElementById('movieGrid');
  if(!grid || !MOVIE_LINKS) return;
  grid.innerHTML = MOVIE_LINKS.map(m => `
    <div class="movie-card">
      <div class="movie-name">🎬 ${m.name}</div>
      <div class="movie-desc">${m.desc}</div>
      <span class="movie-badge ${m.badge==='ফ্রি'?'free':'premium'}">${m.badge}</span>
      <a class="movie-link" href="${m.link}" target="_blank" rel="noopener">▶ এখনই দেখুন →</a>
    </div>`).join('');
}

// ===== TV =====
function renderTV(){
  const grid = document.getElementById('tvGrid');
  if(!grid || !TV_LINKS) return;
  grid.innerHTML = TV_LINKS.map(t => `
    <a class="tv-card" href="${t.link}" target="_blank" rel="noopener">
      <div class="tv-icon-wrap">${t.icon}</div>
      <div class="tv-name">${t.name}</div>
      <div class="tv-desc">${t.desc}</div>
    </a>`).join('');
}

// ===== INCOME APPS =====
function renderIncome(){
  const grid = document.getElementById('incomeGrid');
  if(!grid || !INCOME_APPS) return;
  grid.innerHTML = INCOME_APPS.map(a => `
    <div class="income-card">
      <div class="income-video">
        <iframe src="https://www.youtube.com/embed/${a.videoId}" allowfullscreen loading="lazy"></iframe>
      </div>
      <div class="income-body">
        <div class="income-name">💰 ${a.name}</div>
        <div class="income-desc">${a.desc}</div>
        <div class="income-btns">
          <a class="btn-play" href="${a.playLink}" target="_blank">📱 Download App</a>
          <button class="btn-download" onclick="window.open('https://www.youtube.com/watch?v=${a.videoId}','_blank')">▶ ভিডিও দেখুন</button>
        </div>
      </div>
    </div>`).join('');
}

// ===== MUSIC =====
async function loadExtraMusic(){
  try {
    const r = await fetch('music-extra.json?v=' + Date.now());
    if(r.ok){ const d = await r.json(); if(Array.isArray(d)) return d; }
  } catch(e){}
  return [];
}

function renderMusic(musicList){
  const grid = document.getElementById('musicGrid');
  if(!grid) return;
  const cats = {all:'সব',folk:'লোকগীতি',romantic:'রোমান্টিক',emotional:'আবেগময়',social:'সামাজিক',inspirational:'অনুপ্রেরণামূলক'};
  let activeCat = 'all';

  function renderFilter(){
    const mf = document.getElementById('musicFilter');
    mf.innerHTML = Object.entries(cats).map(([k,v]) =>
      `<button class="chip ${k===activeCat?'active':''}" data-cat="${k}">${v}</button>`
    ).join('');
    mf.querySelectorAll('.chip').forEach(c => {
      c.addEventListener('click', () => { activeCat = c.dataset.cat; renderFilter(); renderCards(); });
    });
  }

  function renderCards(){
    const filtered = musicList.filter(m => activeCat==='all' || m.category===activeCat);
    grid.innerHTML = filtered.map(m => `
      <div class="music-card" data-id="${m.youtubeId}">
        <div class="music-thumb">
          <img src="https://img.youtube.com/vi/${m.youtubeId}/hqdefault.jpg" alt="${m.title}" loading="lazy">
          <div class="play-btn"><span>▶️</span></div>
          <span class="music-cat-badge">${cats[m.category]||m.category}</span>
        </div>
        <div class="music-body"><h3>${m.title}</h3></div>
      </div>`).join('');
    grid.querySelectorAll('.music-card').forEach(card => {
      card.addEventListener('click', () => openMusicModal(card.dataset.id, card.querySelector('h3').textContent));
    });
  }
  renderFilter(); renderCards();
}

function openMusicModal(videoId, title){
  document.getElementById('modalTitle').textContent = title;
  document.getElementById('modalIframe').src = `https://www.youtube.com/embed/${videoId}?autoplay=1`;
  document.getElementById('musicModal').classList.add('open');
}
function closeMusicModal(){
  document.getElementById('musicModal').classList.remove('open');
  document.getElementById('modalIframe').src = '';
}
document.getElementById('musicModal')?.addEventListener('click', e => { if(e.target.id==='musicModal') closeMusicModal(); });

// ===== ARTICLES =====
function renderArticles(){
  const grid = document.getElementById('articleGrid');
  if(!grid) return;
  grid.innerHTML = (ARTICLES||[]).map(a => `
    <article class="article-card">
      <div class="article-date">${a.date}</div>
      <h3>${a.title}</h3>
      <p>${a.excerpt}</p>
    </article>`).join('') || '<div class="empty-state">শীঘ্রই আসছে।</div>';
}

// ===== TERMINAL ANIMATION =====
function startTerminal(){
  const el = document.getElementById('typedOut');
  if(!el) return;
  const samples = PROMPTS.slice(0, 8).map(p => p.prompt);
  let pi = 0, ci = 0, del = false;
  function tick(){
    const full = samples[pi];
    if(!del){ ci++; el.textContent = full.slice(0, ci); if(ci===full.length){ del=true; setTimeout(tick,1800); return; } }
    else { ci--; el.textContent = full.slice(0, ci); if(ci===0){ del=false; pi=(pi+1)%samples.length; } }
    setTimeout(tick, del ? 18 : 28);
  }
  tick();
}

// ===== MOBILE NAV =====
function setupMobileNav(){
  const toggle = document.getElementById('menuToggle');
  const nav = document.getElementById('mainNav');
  if(!toggle || !nav) return;
  toggle.addEventListener('click', () => nav.classList.toggle('open'));
  nav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => nav.classList.remove('open')));
}

// ===== SEARCH =====
function setupSearch(){
  const inp = document.getElementById('searchInput');
  if(inp) inp.addEventListener('input', e => { searchTerm = e.target.value; renderPrompts(); });
}

// ===== INIT =====
document.addEventListener('DOMContentLoaded', async () => {
  // Load extra prompts
  try {
    const pr = await fetch('prompts-extra.json?v=' + Date.now());
    if(pr.ok){ const d = await pr.json(); if(Array.isArray(d) && d.length) localPrompts = [...d, ...localPrompts]; }
  } catch(e){}

  // Load extra music
  const extraMus = await loadExtraMusic();
  const allMusic = [...extraMus, ...MUSIC];

  renderProfile();
  renderChips();
  renderPrompts();
  renderTools();
  renderSocial();
  renderMovies();
  renderTV();
  renderIncome();
  renderMusic(allMusic);
  renderArticles();
  renderQuoteSection(ISLAMIC_QUOTES,'islamicFilter','islamicGrid','islamic-extra.json');
  renderQuoteSection(INSPIRATION_QUOTES,'inspirationFilter','inspirationGrid','inspiration-extra.json');
  renderIslamicLinks();
  startTerminal();
  setupSearch();
  setupMobileNav();

  document.getElementById('year').textContent = new Date().getFullYear();

  // Enter key for chat
  document.getElementById('chatInput')?.addEventListener('keypress', e => { if(e.key==='Enter') sendChat(); });
});

// ===== QUOTE RENDER =====
const CAT_LABELS = {
  all:'সব', quran:'কোরআন', hadith:'হাদিস',
  life:'জীবন', dream:'স্বপ্ন', motivation:'অনুপ্রেরণা',
  success:'সাফল্য', patriotic:'দেশপ্রেম', education:'শিক্ষা'
};

function renderQuoteSection(data, filterId, gridId, extraFile){
  const filterEl = document.getElementById(filterId);
  const gridEl = document.getElementById(gridId);
  if(!filterEl || !gridEl) return;

  // load extra from github
  fetch(extraFile+'?v='+Date.now())
    .then(r=>r.ok?r.json():[])
    .catch(()=>[])
    .then(extra=>{
      const all = [...extra, ...data];
      const cats = ['all', ...new Set(all.map(q=>q.category))];
      let active = 'all';

      function renderFilter(){
        filterEl.innerHTML = cats.map(c=>
          `<button class="chip ${c===active?'active':''}" data-c="${c}">${CAT_LABELS[c]||c}</button>`
        ).join('');
        filterEl.querySelectorAll('.chip').forEach(b=>{
          b.addEventListener('click',()=>{active=b.dataset.c;renderFilter();renderCards();});
        });
      }

      function renderCards(){
        const list = active==='all' ? all : all.filter(q=>q.category===active);
        gridEl.innerHTML = list.map(q=>`
          <div class="quote-card">
            <div class="quote-bg" style="background:${q.gradient||'linear-gradient(135deg,#065F46,#1E3A8A)'}">
              ${q.image?`<img src="${q.image}" onerror="this.style.display='none'" loading="lazy">`:''}
            </div>
            <div class="quote-overlay"></div>
            <div class="quote-body">
              <span class="quote-badge badge-${q.category||'life'}">${CAT_LABELS[q.category]||q.category}</span>
              <div class="quote-text">${q.quote}</div>
              <div class="quote-attribution">${q.attribution}</div>
              <div class="quote-actions">
                <button class="quote-copy-btn" data-text="${encodeURIComponent(q.quote+'\n'+q.attribution)}">📋 কপি</button>
              </div>
            </div>
          </div>`).join('');

        gridEl.querySelectorAll('.quote-copy-btn').forEach(btn=>{
          btn.addEventListener('click',async()=>{
            try{
              await navigator.clipboard.writeText(decodeURIComponent(btn.dataset.text));
              btn.textContent='✓ কপি হয়েছে';btn.classList.add('copied');
              setTimeout(()=>{btn.textContent='📋 কপি';btn.classList.remove('copied');},1800);
            }catch(e){}
          });
        });
      }

      renderFilter(); renderCards();
    });
}

// ===== ISLAMIC LINKS =====
function renderIslamicLinks(){
  const grid = document.getElementById('islamicLinksGrid');
  if(!grid || !window.ISLAMIC_LINKS) return;
  grid.innerHTML = ISLAMIC_LINKS.map(l=>`
    <a class="islamic-link-card" href="${l.link}" target="_blank" rel="noopener">
      <div class="islamic-link-icon">${l.icon}</div>
      <div class="islamic-link-info">
        <div class="name">${l.name}</div>
        <div class="desc">${l.desc}</div>
      </div>
    </a>`).join('');
}
