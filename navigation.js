/* Shared expandable navigation for Daily. Existing localized links are reused. */
(()=>{
  const language=()=>document.documentElement.lang?document.documentElement.lang.toLowerCase().startsWith('de')?'de':'en':localStorage.getItem('daily-language')==='de'?'de':'en';
  const labels={en:{more:'Menu',menu:'Your Daily space'},de:{more:'Menü',menu:'Dein Daily-Bereich'}};
  const current=new URL(location.href);
  const isCurrent=link=>{const target=new URL(link.href,location.href);return target.pathname===current.pathname&&(!target.hash||target.hash===current.hash)};
  document.querySelectorAll('.nav-center,.navlinks,.account-navlinks').forEach(list=>{
    if(list.dataset.dailyEnhanced)return;
    const links=[...list.querySelectorAll(':scope > a')];if(links.length<3)return;
    list.dataset.dailyEnhanced='true';
    const keep=Math.max(1,Number(list.dataset.navPrimary)||2);
    links.forEach(link=>{if(isCurrent(link))link.setAttribute('aria-current','page')});
    const hiddenLinks=links.slice(keep);if(!hiddenLinks.length)return;
    const details=document.createElement('details');details.className='daily-more';
    const summary=document.createElement('summary');summary.setAttribute('aria-label',labels[language()].more);summary.innerHTML=`<span>${labels[language()].more}</span><i aria-hidden="true"></i>`;
    const panel=document.createElement('div');panel.className='daily-more-panel';panel.setAttribute('aria-label',labels[language()].menu);
    const heading=document.createElement('div');heading.className='daily-more-heading';heading.innerHTML=`<span>${labels[language()].menu}</span><b aria-hidden="true">↗</b>`;panel.append(heading);
    hiddenLinks.forEach((link,index)=>{link.classList.add('daily-more-link');link.dataset.menuIndex=String(index+1).padStart(2,'0');link.style.setProperty('--menu-order',index);panel.append(link);if(isCurrent(link))details.classList.add('has-current')});
    details.append(summary,panel);list.append(details);
  });
  const updateLabels=()=>{const text=labels[language()];document.querySelectorAll('.daily-more').forEach(menu=>{menu.querySelector('summary span').textContent=text.more;menu.querySelector('summary').setAttribute('aria-label',text.more);menu.querySelector('.daily-more-panel').setAttribute('aria-label',text.menu);menu.querySelector('.daily-more-heading span').textContent=text.menu})};
  new MutationObserver(updateLabels).observe(document.documentElement,{attributes:true,attributeFilter:['lang']});
  document.addEventListener('click',event=>{document.querySelectorAll('.daily-more[open]').forEach(menu=>{if(!menu.contains(event.target))menu.open=false})});
  document.addEventListener('keydown',event=>{if(event.key==='Escape')document.querySelectorAll('.daily-more[open]').forEach(menu=>{menu.open=false;menu.querySelector('summary').focus()})});
  document.querySelectorAll('.daily-mobile-nav a').forEach(link=>{const href=link.getAttribute('href')||'';link.dataset.symbol=href.includes('shopping')?'▤':href.includes('household')?'◌':href.includes('settings')?'⚙':href.includes('this-week')?'◒':'▦'});
})();
