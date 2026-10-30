(()=>{'use strict';
const root=document.getElementById('ks-marathon');if(!root||root.dataset.ksBound==='1')return;root.dataset.ksBound='1';
const reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const dialog=root.querySelector('#enroll-dialog');let opener=null;
root.querySelectorAll('[data-product-name]').forEach(n=>n.textContent='Легче, Кисуль!');
let previousOverflow='';
function openDialog(trigger){
  opener=trigger||null;
  const selector=window.KSENIA_GC?.nativePopupTriggerSelector;
  if(selector){
    const target=document.querySelector(selector);
    if(target){target.click();return}
    console.warn('[Ksenia] GetCourse popup trigger not found:',selector);
  }
  if(!dialog)return;
  previousOverflow=document.body.style.overflow;
  if(typeof dialog.showModal==='function'){if(!dialog.open)dialog.showModal();}
  else dialog.setAttribute('open','');
  document.body.style.overflow='hidden';
}
function closeDialog(){if(!dialog)return;if(typeof dialog.close==='function'&&dialog.open)dialog.close();else dialog.removeAttribute('open');document.body.style.overflow=previousOverflow;opener?.focus();}
root.querySelectorAll('[data-enroll]').forEach(btn=>btn.addEventListener('click',()=>openDialog(btn)));
dialog?.querySelector('.dialog-close')?.addEventListener('click',closeDialog);
dialog?.addEventListener('cancel',e=>{e.preventDefault();closeDialog();});
dialog?.addEventListener('click',e=>{if(e.target===dialog)closeDialog()});
dialog?.addEventListener('close',()=>{document.body.style.overflow=previousOverflow;opener?.focus()});
root.querySelectorAll('a[href^="#"]').forEach(a=>a.addEventListener('click',e=>{const id=a.getAttribute('href');if(id==='#')return;const el=root.querySelector(id);if(el){e.preventDefault();el.scrollIntoView({behavior:reduced?'instant':'smooth'});}}));
const track=root.querySelector('.review-track');if(track){const buttons=[...root.querySelectorAll('[data-review-dir]')];const update=()=>buttons.forEach(b=>b.disabled=Number(b.dataset.reviewDir)<0?track.scrollLeft<2:track.scrollLeft+track.clientWidth>=track.scrollWidth-2);buttons.forEach(b=>b.addEventListener('click',()=>{const card=track.querySelector('.review-scan');const gap=18,step=(card?.getBoundingClientRect().width||track.clientWidth)+gap;track.scrollBy({left:Number(b.dataset.reviewDir)*step,behavior:reduced?'instant':'smooth'})}));track.addEventListener('scroll',update,{passive:true});window.addEventListener('resize',update);update();}
if(!reduced&&'IntersectionObserver' in window){const targets=[...root.querySelectorAll('.section h2,.ease-card,.stat,.review-scan,.join-card,.benefit-card')];targets.forEach(el=>el.classList.add('ks-reveal'));const observer=new IntersectionObserver(entries=>entries.forEach(en=>{if(en.isIntersecting){en.target.classList.add('ks-in');observer.unobserve(en.target)}}),{rootMargin:'0px 0px -28px 0px',threshold:.06});requestAnimationFrame(()=>{root.classList.add('ks-motion-ready');targets.forEach(el=>observer.observe(el));});}
const sticky=root.querySelector('[data-ks-sticky]'),hero=root.querySelector('.hero'),last=root.querySelector('.join-section');
function setSticky(){if(!sticky||!hero)return;const y=hero.getBoundingClientRect().bottom;const lastTop=last?.getBoundingClientRect().top??Infinity;sticky.classList.toggle('ks-show',y<0 && lastTop>innerHeight*.5&&!dialog?.open)}
window.addEventListener('scroll',setSticky,{passive:true});window.addEventListener('resize',setSticky);setSticky();
})();