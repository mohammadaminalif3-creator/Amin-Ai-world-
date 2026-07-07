// ============================================================
// Amin AI World — script.js | Complete Edition
// ============================================================

let localPrompts = [];
let activeTag = 'all';
let searchTerm = '';

// ===== PARTICLES ANIMATION =====
function createParticles(){
  const container = document.getElementById('particles');
  if(!container) return;
  const colors = ['#7C5CFF','#4DE8FF','#FF6B9D','#10B981','#F97316','#FACC15'];
  for(let i=0;i<30;i++){
    const p = document.createElement('div');
    p.className = 'particle';
    const size = Math.random()*6+3;
    p.style.cssText = `
      width:${size}px;height:${size}px;
      left:${Math.random()*100}%;
      background:${colors[Math.floor(Math.random()*colors.length)]};
      animation-duration:${Math.random()*12+8}s;
      animation-delay:${Math.random()*8}s;
    `;
    container.appendChild(p);
  }
}

// ===== COUNTER ANIMATION =====
function animateCounters(){
  document.querySelectorAll('.wstat-num').forEach(el=>{
    const target = parseInt(el.dataset.target)||0;
    let cur = 0;
    const step = Math.ceil(target/40);
    const timer = setInterval(()=>{
      cur = Math.min(cur+step, target);
      el.textContent = cur+'+';
      if(cur>=target) clearInterval(timer);
    },40);
  });
}

// ===== PROFILE =====
function renderProfile(){
  const av = document.getElementById('profileAvatar');
  if(!av) return;
  av.style.background = PROFILE.avatarGradient;
  if(PROFILE.avatarImage){
    av.innerHTML = `<img src="${PROFILE.avatarImage}" style="width:100%;height:100%;object-fit:cover;border-radius:50%;" onerror="this.remove()">`;
  } else { av.textContent = 'A'; }
  const n=document.getElementById('profileName'); if(n) n.textContent=PROFILE.name;
  const ch=document.getElementById('profileChannel'); if(ch) ch.textContent='📺 '+PROFILE.channel;
  const bio=document.getElementById('profileBio'); if(bio) bio.textContent=PROFILE.bio;
  const yt=document.getElementById('profileYoutube'); if(yt) yt.href=PROFILE.youtube;
  const fb=document.getElementById('profileFacebook'); if(fb){if(PROFILE.facebook)fb.href=PROFILE.facebook;else fb.style.display='none';}
  const fbp=document.getElementById('profileFbPage'); if(fbp){if(PROFILE.facebookPage)fbp.href=PROFILE.facebookPage;else fbp.style.display='none';}
}

// ===== PROMPTS =====
function allPrompts(){ return [...localPrompts,...PROMPTS]; }

function renderChips(){
  const bar=document.getElementById('filterBar');
  if(!bar) return;
  const tags=['all',...new Set(allPrompts().flatMap(p=>p.tags||[]))];
  bar.innerHTML=tags.map(t=>`<button class="chip ${t===activeTag?'active':''}" data-tag="${t}">${t==='all'?'সব':t}</button>`).join('');
  bar.querySelectorAll('.chip').forEach(c=>{
    c.addEventListener('click',()=>{activeTag=c.dataset.tag;renderChips();renderPrompts();});
  });
}

function renderPrompts(){
  const grid=document.getElementById('promptGrid');
  if(!grid) return;
  const list=allPrompts().filter(p=>{
    const inTag=activeTag==='all'||(p.tags||[]).includes(activeTag);
    const term=searchTerm.trim().toLowerCase();
    const inSearch=!term||(p.title||'').toLowerCase().includes(term)||(p.titleEn||'').toLowerCase().includes(term)||(p.prompt||'').toLowerCase().includes(term)||(p.tool||'').toLowerCase().includes(term);
    return inTag&&inSearch;
  });
  if(!list.length){grid.innerHTML='<div class="empty-state">কোনো প্রম্পট পাওয়া যায়নি।</div>';return;}
  grid.innerHTML=list.map(p=>`
    <article class="prompt-card">
      <div class="prompt-img" style="background:${p.gradient||'linear-gradient(135deg,#7C5CFF,#4DE8FF)'};position:relative;overflow:hidden;">
        ${p.image?`<img src="${p.image}" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;" onerror="this.style.display='none'">`:''}
        <span class="tag-tool">${p.tool||''}</span>
      </div>
      <div class="prompt-body">
        <h3>${p.title||''}<span class="en">${p.titleEn||''}</span></h3>
        <div class="prompt-text">${p.prompt||''}</div>
        <div class="tags">${(p.tags||[]).map(t=>`<span class="tag">#${t}</span>`).join('')}</div>
        <button class="copy-btn" data-prompt="${encodeURIComponent(p.prompt||'')}">প্রম্পট কপি করুন</button>
      </div>
    </article>`).join('');
  grid.querySelectorAll('.copy-btn').forEach(btn=>{
    btn.addEventListener('click',async()=>{
      try{
        await navigator.clipboard.writeText(decodeURIComponent(btn.dataset.prompt));
        btn.textContent='কপি হয়েছে ✓';btn.classList.add('copied');
        setTimeout(()=>{btn.textContent='প্রম্পট কপি করুন';btn.classList.remove('copied');},1800);
      }catch(e){btn.textContent='কপি ব্যর্থ';}
    });
  });
}

// ===== TOOLS =====
function renderTools(){
  const g=document.getElementById('toolsGrid');
  if(!g||!window.TOOLS) return;
  g.innerHTML=TOOLS.map(t=>`
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
  const g=document.getElementById('socialGrid');
  if(!g||!window.SOCIAL_LINKS) return;
  g.innerHTML=SOCIAL_LINKS.map(s=>`
    <a class="social-card" href="${s.link}" target="_blank" rel="noopener">
      <div class="social-icon" style="background:${s.color}22;color:${s.color};font-size:1.4rem;">${s.icon}</div>
      <div class="social-name">${s.name}</div>
      <div class="social-desc">${s.desc}</div>
    </a>`).join('');
}

// ===== MOVIES =====
function renderMovies(){
  const g=document.getElementById('movieGrid');
  if(!g||!window.MOVIE_LINKS) return;
  g.innerHTML=MOVIE_LINKS.map(m=>`
    <div class="movie-card">
      <div class="movie-name">🎬 ${m.name}</div>
      <div class="movie-desc">${m.desc}</div>
      <span class="movie-badge ${m.badge==='ফ্রি'?'free':'premium'}">${m.badge}</span>
      <a class="movie-link" href="${m.link}" target="_blank" rel="noopener">▶ এখনই দেখুন →</a>
    </div>`).join('');
}

// ===== TV =====
function renderTV(){
  const g=document.getElementById('tvGrid');
  if(!g||!window.TV_LINKS) return;
  g.innerHTML=TV_LINKS.map(t=>`
    <a class="tv-card" href="${t.link}" target="_blank" rel="noopener">
      <div class="tv-icon-wrap">${t.icon}</div>
      <div class="tv-name">${t.name}</div>
      <div class="tv-desc">${t.desc}</div>
    </a>`).join('');
}

// ===== INCOME =====
function renderIncome(){
  const g=document.getElementById('incomeGrid');
  if(!g||!window.INCOME_APPS) return;
  g.innerHTML=INCOME_APPS.map(a=>`
    <div class="income-card">
      <div class="income-video"><iframe src="https://www.youtube.com/embed/${a.videoId}" allowfullscreen loading="lazy"></iframe></div>
      <div class="income-body">
        <div class="income-name">💰 ${a.name}</div>
        <div class="income-desc">${a.desc}</div>
        <div class="income-btns">
          <a class="btn-play" href="${a.playLink}" target="_blank">📱 App Download</a>
          <button class="btn-download" onclick="window.open('https://www.youtube.com/watch?v=${a.videoId}','_blank')">▶ ভিডিও</button>
        </div>
      </div>
    </div>`).join('');
}

// ===== MUSIC =====
async function loadExtraMusic(){
  try{const r=await fetch('music-extra.json?v='+Date.now());if(r.ok){const d=await r.json();if(Array.isArray(d))return d;}}catch(e){}
  return [];
}
function renderMusic(list){
  const g=document.getElementById('musicGrid');
  if(!g) return;
  const cats={all:'সব',folk:'লোকগীতি',romantic:'রোমান্টিক',emotional:'আবেগময়',social:'সামাজিক',inspirational:'অনুপ্রেরণামূলক'};
  let activeCat='all';
  function renderF(){
    const mf=document.getElementById('musicFilter');
    if(!mf) return;
    mf.innerHTML=Object.entries(cats).map(([k,v])=>`<button class="chip ${k===activeCat?'active':''}" data-cat="${k}">${v}</button>`).join('');
    mf.querySelectorAll('.chip').forEach(c=>{c.addEventListener('click',()=>{activeCat=c.dataset.cat;renderF();renderC();});});
  }
  function renderC(){
    const filtered=list.filter(m=>activeCat==='all'||m.category===activeCat);
    g.innerHTML=filtered.map(m=>`
      <div class="music-card" data-id="${m.youtubeId}">
        <div class="music-thumb">
          <img src="https://img.youtube.com/vi/${m.youtubeId}/hqdefault.jpg" alt="${m.title}" loading="lazy">
          <div class="play-btn"><span>▶️</span></div>
          <span class="music-cat-badge">${cats[m.category]||m.category}</span>
        </div>
        <div class="music-body"><h3>${m.title}</h3></div>
      </div>`).join('');
    g.querySelectorAll('.music-card').forEach(card=>{
      card.addEventListener('click',()=>openMusicModal(card.dataset.id,card.querySelector('h3').textContent));
    });
  }
  renderF();renderC();
}
function openMusicModal(id,title){
  document.getElementById('modalTitle').textContent=title;
  document.getElementById('modalIframe').src=`https://www.youtube.com/embed/${id}?autoplay=1`;
  document.getElementById('musicModal').classList.add('open');
}
function closeMusicModal(){
  document.getElementById('musicModal').classList.remove('open');
  document.getElementById('modalIframe').src='';
}
document.getElementById('musicModal')?.addEventListener('click',e=>{if(e.target.id==='musicModal')closeMusicModal();});

// ===== QUOTES =====
const CAT_LABELS={all:'সব',quran:'কোরআন',hadith:'হাদিস',life:'জীবন',dream:'স্বপ্ন',motivation:'অনুপ্রেরণা',success:'সাফল্য',patriotic:'দেশপ্রেম',education:'শিক্ষা'};

function renderQuoteSection(data,filterId,gridId,extraFile){
  const filterEl=document.getElementById(filterId);
  const gridEl=document.getElementById(gridId);
  if(!filterEl||!gridEl) return;
  fetch(extraFile+'?v='+Date.now()).then(r=>r.ok?r.json():[]).catch(()=>[]).then(extra=>{
    const all=[...extra,...data];
    const cats=['all',...new Set(all.map(q=>q.category))];
    let active='all';
    function renderF(){
      filterEl.innerHTML=cats.map(c=>`<button class="chip ${c===active?'active':''}" data-c="${c}">${CAT_LABELS[c]||c}</button>`).join('');
      filterEl.querySelectorAll('.chip').forEach(b=>{b.addEventListener('click',()=>{active=b.dataset.c;renderF();renderC();});});
    }
    function renderC(){
      const list=active==='all'?all:all.filter(q=>q.category===active);
      gridEl.innerHTML=list.map(q=>`
        <div class="quote-card">
          <div class="quote-bg" style="background:${q.gradient||'linear-gradient(135deg,#065F46,#1E3A8A)'}">
            ${q.image?`<img src="${q.image}" onerror="this.style.display='none'" loading="lazy">`:''}
          </div>
          <div class="quote-overlay"></div>
          <div class="quote-body">
            <span class="quote-badge badge-${q.category||'life'}">${CAT_LABELS[q.category]||q.category}</span>
            <div class="quote-text">"${q.quote}"</div>
            <div class="quote-attribution">${q.attribution}</div>
            <div class="quote-actions">
              <button class="quote-copy-btn" data-text="${encodeURIComponent('"'+q.quote+'"\n'+q.attribution)}">📋 কপি</button>
            </div>
          </div>
        </div>`).join('');
      gridEl.querySelectorAll('.quote-copy-btn').forEach(btn=>{
        btn.addEventListener('click',async()=>{
          try{await navigator.clipboard.writeText(decodeURIComponent(btn.dataset.text));btn.textContent='✓ কপি';btn.classList.add('copied');setTimeout(()=>{btn.textContent='📋 কপি';btn.classList.remove('copied');},1800);}catch(e){}
        });
      });
    }
    renderF();renderC();
  });
}

// ===== ISLAMIC LINKS =====
function renderIslamicLinks(){
  const g=document.getElementById('islamicLinksGrid');
  if(!g||!window.ISLAMIC_LINKS) return;
  g.innerHTML=ISLAMIC_LINKS.map(l=>`
    <a class="islamic-link-card" href="${l.link}" target="_blank" rel="noopener">
      <div class="islamic-link-icon">${l.icon}</div>
      <div class="islamic-link-info"><div class="name">${l.name}</div><div class="desc">${l.desc}</div></div>
    </a>`).join('');
}

// ===== BLOG =====
let allBlogPosts = [];

async function loadBlogPosts(){
  try{
    const r=await fetch('blog-posts.json?v='+Date.now());
    if(r.ok){ const d=await r.json(); if(Array.isArray(d)) return d; }
  }catch(e){}
  return [];
}

const BLOG_CAT_LABELS={all:'সব',islamic:'ইসলামিক',inspiration:'প্রেরণা',ai:'AI টিপস',general:'সাধারণ',patriotic:'দেশপ্রেম',life:'জীবন'};

function renderBlog(posts){
  const g=document.getElementById('blogGrid');
  const filterEl=document.getElementById('blogFilter');
  if(!g) return;
  allBlogPosts=posts;
  const cats=['all',...new Set(posts.map(p=>p.category))];
  let active='all';

  function renderF(){
    if(!filterEl) return;
    filterEl.innerHTML=cats.map(c=>`<button class="chip ${c===active?'active':''}" data-c="${c}">${BLOG_CAT_LABELS[c]||c}</button>`).join('');
    filterEl.querySelectorAll('.chip').forEach(b=>{b.addEventListener('click',()=>{active=b.dataset.c;renderF();renderC();});});
  }

  function renderC(){
    const list=active==='all'?posts:posts.filter(p=>p.category===active);
    if(!list.length){
      g.innerHTML='<div class="empty-state" style="grid-column:1/-1">এখনো কোনো লেখা নেই। Admin Panel থেকে লেখা যোগ করুন।</div>';
      return;
    }
    g.innerHTML=list.map(p=>`
      <div class="blog-card" onclick="openBlogModal('${p.id}')">
        ${p.image
          ?`<img class="blog-img" src="${p.image}" alt="${p.title}" onerror="this.style.display='none'">`
          :`<div class="blog-img-placeholder">${p.emoji||'📝'}</div>`}
        <div class="blog-body">
          <div class="blog-meta">
            <span class="blog-cat cat-${p.category||'general'}">${BLOG_CAT_LABELS[p.category]||p.category}</span>
            <span class="blog-date">${p.date||''}</span>
          </div>
          <h3>${p.title}</h3>
          <p class="blog-excerpt">${p.content||''}</p>
          <span class="blog-read-more">আরও পড়ুন →</span>
        </div>
      </div>`).join('');
  }
  renderF();renderC();
}

function openBlogModal(id){
  const post=allBlogPosts.find(p=>p.id===id);
  if(!post) return;
  const inner=document.getElementById('blogModalInner');
  inner.innerHTML=`
    ${post.image?`<img class="blog-modal-img" src="${post.image}" alt="${post.title}">`:''}
    <div class="blog-modal-body">
      <div class="blog-meta" style="margin-bottom:12px;">
        <span class="blog-cat cat-${post.category||'general'}">${BLOG_CAT_LABELS[post.category]||post.category}</span>
        <span class="blog-date">${post.date||''}</span>
      </div>
      <h2>${post.title}</h2>
      <div style="height:1px;background:#232838;margin:14px 0;"></div>
      <div class="blog-modal-content">${post.content||''}</div>
    </div>`;
  document.getElementById('blogModal').classList.add('open');
  document.body.style.overflow='hidden';
}
function closeBlogModal(){
  document.getElementById('blogModal').classList.remove('open');
  document.body.style.overflow='';
}
document.getElementById('blogModal')?.addEventListener('click',e=>{if(e.target.id==='blogModal')closeBlogModal();});

// ===== ARTICLES =====
function renderArticles(){
  const g=document.getElementById('articleGrid');
  if(!g) return;
  g.innerHTML=(window.ARTICLES||[]).map(a=>`
    <article style="background:#151926;border:1px solid #232838;border-radius:14px;padding:20px;cursor:pointer;transition:border-color .2s,transform .2s;" onmouseover="this.style.borderColor='#7C5CFF'" onmouseout="this.style.borderColor='#232838'">
      <div style="font-family:'JetBrains Mono',monospace;font-size:.7rem;color:#4DE8FF;margin-bottom:7px;">${a.date}</div>
      <h3 style="font-family:'Space Grotesk';font-size:1rem;margin-bottom:7px;">${a.title}</h3>
      <p style="color:#8B93A7;font-size:.82rem;">${a.excerpt}</p>
    </article>`).join('')||'';
}

// ===== TERMINAL =====
function startTerminal(){
  const el=document.getElementById('typedOut');
  if(!el||!PROMPTS.length) return;
  const samples=PROMPTS.slice(0,8).map(p=>p.prompt);
  let pi=0,ci=0,del=false;
  function tick(){
    const full=samples[pi];
    if(!del){ci++;el.textContent=full.slice(0,ci);if(ci===full.length){del=true;setTimeout(tick,2000);return;}}
    else{ci--;el.textContent=full.slice(0,ci);if(ci===0){del=false;pi=(pi+1)%samples.length;}}
    setTimeout(tick,del?20:30);
  }
  tick();
}

// ===== MOBILE NAV =====
function setupMobileNav(){
  const toggle=document.getElementById('menuToggle');
  const nav=document.getElementById('mainNav');
  if(!toggle||!nav) return;
  toggle.addEventListener('click',()=>nav.classList.toggle('open'));
  nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>nav.classList.remove('open')));
}

// ===== SEARCH =====
function setupSearch(){
  const inp=document.getElementById('searchInput');
  if(inp) inp.addEventListener('input',e=>{searchTerm=e.target.value;renderPrompts();});
}

// ===== INIT =====
document.addEventListener('DOMContentLoaded', async()=>{
  // Load extra prompts
  try{
    const pr=await fetch('prompts-extra.json?v='+Date.now());
    if(pr.ok){const d=await pr.json();if(Array.isArray(d)&&d.length)localPrompts=[...d];}
  }catch(e){}

  // Load extra music
  const extraMus=await loadExtraMusic();
  const allMusic=[...extraMus,...(window.MUSIC||[])];

  // Load blog posts
  const blogPosts=await loadBlogPosts();

  // Render all sections
  createParticles();
  renderProfile();
  renderChips();
  renderPrompts();
  renderTools();
  renderSocial();
  renderMovies();
  renderTV();
  renderIncome();
  renderMusic(allMusic);
  renderBlog(blogPosts);
  renderArticles();
  renderQuoteSection(window.ISLAMIC_QUOTES||[],'islamicFilter','islamicGrid','islamic-extra.json');
  renderQuoteSection(window.INSPIRATION_QUOTES||[],'inspirationFilter','inspirationGrid','inspiration-extra.json');
  renderIslamicLinks();
  startTerminal();
  setupSearch();
  setupMobileNav();

  document.getElementById('year').textContent=new Date().getFullYear();

  // Counter animation on scroll
  const statsEl=document.querySelector('.welcome-stats');
  if(statsEl){
    const obs=new IntersectionObserver(entries=>{
      if(entries[0].isIntersecting){animateCounters();obs.disconnect();}
    },{threshold:.3});
    obs.observe(statsEl);
  }
});
