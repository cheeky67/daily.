import{getApp,getApps,initializeApp}from'https://www.gstatic.com/firebasejs/13.1.0/firebase-app.js';
import{getAuth,onAuthStateChanged}from'https://www.gstatic.com/firebasejs/13.1.0/firebase-auth.js';
import{doc,getDoc,getFirestore}from'https://www.gstatic.com/firebasejs/13.1.0/firebase-firestore.js';
import{firebaseConfig}from'./firebase-config.js';

/* Add active-page state and Firebase-protected admin visibility. */
(()=>{
  const page=document.body.dataset.page||'home';
  const selected=page==='app'&&location.hash==='#this-week'?'recipes':page==='app'?'dashboard':page;
  document.querySelectorAll('[data-page-link]').forEach(link=>{
    if(link.dataset.pageLink===selected)link.setAttribute('aria-current','page');
    else link.removeAttribute('aria-current');
  });
  const toggle=document.querySelector('.daily-side-toggle');
  if(toggle)toggle.setAttribute('aria-label',document.documentElement.lang==='de'?'Menü öffnen / schließen':'Open / close menu');
  const drawer=document.querySelector('.daily-navigation');
  if(drawer){
    document.addEventListener('click',event=>{if(drawer.open&&!drawer.contains(event.target))drawer.open=false});
    document.addEventListener('keydown',event=>{if(event.key==='Escape'&&drawer.open){drawer.open=false;toggle?.focus()}});
  }
  const updateLanguage=()=>{
    if(toggle)toggle.setAttribute('aria-label',document.documentElement.lang==='de'?'Menü öffnen / schließen':'Open / close menu');
  };
  new MutationObserver(updateLanguage).observe(document.documentElement,{attributes:true,attributeFilter:['lang']});
  const addAnnouncement=async()=>{
    try{
      const app=getApps().length?getApp():initializeApp(firebaseConfig),db=getFirestore(app);
      const snapshot=await getDoc(doc(db,'dailySite','announcement'));
      if(!snapshot.exists())return;
      const notice=snapshot.data();if(notice.active!==true||(notice.expiresAt?.toMillis?.()&&notice.expiresAt.toMillis()<=Date.now()))return;
      const language=document.documentElement.lang==='de'?'de':'en';
      const title=language==='de'?notice.titleDe:notice.titleEn,body=language==='de'?notice.bodyDe:notice.bodyEn;
      if(!title&&!body)return;
      const version=notice.updatedAt?.toMillis?.()||'current';if(sessionStorage.getItem('daily-announcement-dismissed')===String(version))return;
      const bar=document.createElement('aside');bar.className='daily-announcement';bar.setAttribute('role','status');
      const copy=document.createElement('div');copy.className='daily-announcement-copy';
      if(title){const heading=document.createElement('strong');heading.textContent=title;copy.append(heading)}
      if(body){const message=document.createElement('span');message.textContent=body;copy.append(message)}
      const close=document.createElement('button');close.type='button';close.className='daily-announcement-close';close.setAttribute('aria-label',language==='de'?'Mitteilung schließen':'Dismiss announcement');close.textContent='×';
      close.addEventListener('click',()=>{sessionStorage.setItem('daily-announcement-dismissed',String(version));bar.remove()});bar.append(copy,close);
      const header=document.querySelector('header');if(header)header.insertAdjacentElement('afterend',bar);else document.body.prepend(bar);
    }catch(error){console.warn('Daily announcement could not load.',error)}
  };
  addAnnouncement();
  const adminLinks=[...document.querySelectorAll('[data-admin-only]')];
  if(!adminLinks.length)return;
  const hideAdmin=()=>adminLinks.forEach(link=>{link.hidden=true});
  hideAdmin();
  try{
    const app=getApps().length?getApp():initializeApp(firebaseConfig);
    const auth=getAuth(app),db=getFirestore(app);
    onAuthStateChanged(auth,async user=>{
      hideAdmin();
      if(!user?.emailVerified)return;
      try{
        const grant=await getDoc(doc(db,'dailyAdmins',user.uid));
        if(grant.exists()&&grant.data().enabled===true)adminLinks.forEach(link=>{link.hidden=false});
      }catch(error){console.warn('Daily admin navigation could not verify access.',error)}
    });
  }catch(error){console.warn('Daily admin navigation is unavailable.',error)}
})();
