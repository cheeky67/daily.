/* Daily's shared left-side application navigation. */
(()=>{
  const locale=()=>document.documentElement.lang?.toLowerCase().startsWith('de')||localStorage.getItem('daily-language')==='de'?'de':'en';
  const words={
    en:{menu:'Open navigation',close:'Close navigation',brand:'daily.',tagline:'GOOD FOOD, FIGURED OUT',home:'Home',dashboard:'Dashboard',recipes:'Recipes',shopping:'Shopping list',family:'Family & friends',profile:'Profile',settings:'Settings',feedback:'Suggest an idea',plan:'Plan my week',caption:'A little more joy on your plate',collapse:'Collapse menu',expand:'Expand menu'},
    de:{menu:'Navigation öffnen',close:'Navigation schließen',brand:'daily.',tagline:'GUTES ESSEN. EINFACH GEPLANT.',home:'Startseite',dashboard:'Dashboard',recipes:'Rezepte',shopping:'Einkaufsliste',family:'Familie & Freunde',profile:'Profil',settings:'Einstellungen',feedback:'Idee vorschlagen',plan:'Woche planen',caption:'Ein bisschen mehr Freude auf dem Teller',collapse:'Menü einklappen',expand:'Menü ausklappen'}
  };
  const isHome=!!document.querySelector('.site-header');
  const copy=()=>words[locale()];
  document.body.classList.toggle('daily-home-shell',isHome);
  document.body.classList.toggle('has-side-nav',!isHome);
  const entries=[
    ['home','index.html','⌂'],['dashboard','app.html#dashboard','▦'],['recipes','app.html#this-week','◒'],
    ['shopping','shopping.html','▤'],['family','household.html','◌'],['profile','profile.html','●'],
    ['settings','settings.html','⚙'],['feedback','feedback.html','↗']
  ];
  const linkIsCurrent=href=>{const target=new URL(href,location.href),here=new URL(location.href);if(target.pathname!==here.pathname)return false;if(!target.hash)return true;return target.hash===here.hash||(!here.hash&&target.hash==='#dashboard')};
  const nav=document.createElement('aside');nav.className='daily-sidebar';nav.id='daily-sidebar';nav.setAttribute('aria-label',locale()==='de'?'Seitennavigation':'Side navigation');
  nav.innerHTML=`<div class="daily-sidebar-top"><a class="daily-side-brand" href="index.html" aria-label="Daily home"><span class="daily-side-mark">d</span><span class="daily-side-word">daily<span>.</span></span></a><button class="daily-sidebar-collapse" type="button"><span aria-hidden="true">⇤</span><span class="daily-collapse-label"></span></button></div><div class="daily-sidebar-caption"></div><nav class="daily-sidebar-links"></nav><a class="daily-sidebar-plan" href="app.html#dashboard"><span class="daily-plan-icon" aria-hidden="true">↗</span><span class="daily-sidebar-plan-label"></span></a><div class="daily-sidebar-bottom"><span class="daily-sidebar-orb" aria-hidden="true"></span><span class="daily-sidebar-tagline"></span></div>`;
  const links=nav.querySelector('.daily-sidebar-links');
  for(const [key,href,icon] of entries){const a=document.createElement('a');a.href=href;a.dataset.sideKey=key;a.className='daily-side-link';a.innerHTML=`<span class="daily-side-icon" aria-hidden="true">${icon}</span><span class="daily-side-label"></span><span class="daily-side-arrow" aria-hidden="true">↗</span>`;if(linkIsCurrent(href))a.setAttribute('aria-current','page');links.append(a)}
  document.body.prepend(nav);
  const backdrop=document.createElement('button');backdrop.className='daily-side-backdrop';backdrop.type='button';backdrop.setAttribute('aria-label',locale()==='de'?'Navigation schließen':'Close navigation');document.body.append(backdrop);
  const toggle=document.createElement('button');toggle.className='daily-side-toggle';toggle.type='button';toggle.setAttribute('aria-controls','daily-sidebar');toggle.setAttribute('aria-expanded','false');toggle.setAttribute('aria-label',locale()==='de'?'Navigation öffnen':'Open navigation');toggle.innerHTML='<span></span><span></span><span></span>';document.body.append(toggle);
  const text=(selector,value)=>{const node=nav.querySelector(selector);if(node)node.textContent=value};
  const updateLanguage=()=>{const w=copy();nav.setAttribute('aria-label',locale()==='de'?'Seitennavigation':'Side navigation');backdrop.setAttribute('aria-label',w.close);toggle.setAttribute('aria-label',w.menu);nav.querySelectorAll('[data-side-key]').forEach(a=>a.querySelector('.daily-side-label').textContent=w[a.dataset.sideKey]);text('.daily-sidebar-caption',w.caption);text('.daily-sidebar-tagline',w.tagline);text('.daily-sidebar-plan-label',w.plan);text('.daily-collapse-label',document.body.classList.contains('side-nav-collapsed')?w.expand:w.collapse)};
  const setDrawer=open=>{document.body.classList.toggle('side-nav-open',open);toggle.setAttribute('aria-expanded',String(open));toggle.setAttribute('aria-label',open?copy().close:copy().menu)};
  toggle.addEventListener('click',()=>setDrawer(!document.body.classList.contains('side-nav-open')));
  backdrop.addEventListener('click',()=>setDrawer(false));
  nav.querySelector('.daily-sidebar-collapse').addEventListener('click',()=>{document.body.classList.toggle('side-nav-collapsed');try{localStorage.setItem('daily-side-collapsed',String(document.body.classList.contains('side-nav-collapsed')))}catch{}updateLanguage()});
  nav.addEventListener('click',event=>{if(event.target.closest('a'))setDrawer(false)});
  document.addEventListener('keydown',event=>{if(event.key==='Escape')setDrawer(false)});
  if(!isHome){try{if(localStorage.getItem('daily-side-collapsed')==='true')document.body.classList.add('side-nav-collapsed')}catch{}}
  updateLanguage();
  new MutationObserver(updateLanguage).observe(document.documentElement,{attributes:true,attributeFilter:['lang']});
  document.querySelectorAll('.daily-mobile-nav').forEach(el=>el.remove());
})();
