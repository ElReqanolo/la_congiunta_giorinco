/* La Congiunta 3D – Bedienung: Zeiger und Tastatur, Fliegen, Rundgang, Schildkarte, Links (#…), Einstellungen, Sonnenstand */
'use strict';
/* ---------- Bedienung ---------- */
var ptr={};
stage.addEventListener('pointerdown',function(e){if(e.target.closest&&e.target.closest('button,.card'))return;stage.setPointerCapture(e.pointerId);ptr[e.pointerId]={x:e.clientX,y:e.clientY,sx:e.clientX,sy:e.clientY,t:performance.now()}});
var rayc=new THREE.Raycaster(),ndc=new THREE.Vector2();
function pickSign(cx,cy){var rc=renderer.domElement.getBoundingClientRect();if(!rc.width)return false;ndc.set((cx-rc.left)/rc.width*2-1,-(cy-rc.top)/rc.height*2+1);rayc.setFromCamera(ndc,camera);
  var hits=rayc.intersectObjects(signBoards,false);for(var k=0;k<hits.length;k++){var si=hits[k].object.userData.si,h=HS[si];if(hits[k].distance<6&&(!h.room||h.room(fp))){interact(si);return true}}return false}
stage.addEventListener('pointerup',function(e){var p=ptr[e.pointerId];delete ptr[e.pointerId];if(walk&&!cardOpen&&p&&Math.hypot(e.clientX-p.sx,e.clientY-p.sy)<6&&performance.now()-p.t<600)pickSign(e.clientX,e.clientY)});
stage.addEventListener('pointercancel',function(e){delete ptr[e.pointerId]});
stage.addEventListener('pointermove',function(e){var p=ptr[e.pointerId];if(!p||FILM.on)return;var ids=Object.keys(ptr);
  if(ids.length===2){var o=ptr[ids[0]==e.pointerId?ids[1]:ids[0]],d0=Math.hypot(p.x-o.x,p.y-o.y),d1=Math.hypot(e.clientX-o.x,e.clientY-o.y);if(d1>0&&!fly)r=clamp(r*d0/d1,10,1400)}
  else{if(fly){fyaw-=(e.clientX-p.x)*0.004;fpitch=clamp(fpitch-(e.clientY-p.y)*0.004,-1.5,1.5)}else{th-=(e.clientX-p.x)*0.008;ph=clamp(ph-(e.clientY-p.y)*0.006,0.05,1.52);setPressed(null)}}
  p.x=e.clientX;p.y=e.clientY;draw()});
/* Sprungmarke: Fokus aufs Bild, ohne den Link-Anker (#…) der Ansicht zu ändern */
var skipL=document.querySelector('.skip');if(skipL)skipL.addEventListener('click',function(e){e.preventDefault();stage.focus()});
/* Tastatur in der Umlaufansicht (Bild hat den Fokus): Pfeile drehen und neigen, Plus und Minus zoomen, Shift = grössere Schritte */
stage.addEventListener('keydown',function(e){if(e.target!==stage||fly||FILM.on||e.altKey||e.ctrlKey||e.metaKey)return;var k=e.key,s=e.shiftKey?0.3:0.1;
  if(k==='ArrowLeft')th+=s;else if(k==='ArrowRight')th-=s;else if(k==='ArrowUp')ph=clamp(ph-s*0.6,0.05,1.52);else if(k==='ArrowDown')ph=clamp(ph+s*0.6,0.05,1.52);
  else if(k==='+'||k==='=')r=clamp(r*(e.shiftKey?0.7:0.88),10,1400);else if(k==='-'||k==='_')r=clamp(r/(e.shiftKey?0.7:0.88),10,1400);else return;
  e.preventDefault();if(k.indexOf('Arrow')===0)setPressed(null);draw()});
stage.addEventListener('wheel',function(e){e.preventDefault();if(FILM.on)return;
  if(fly){if(walk)return;var wv=new THREE.Vector3();camera.getWorldDirection(wv);fp.addScaledVector(wv,-e.deltaY*0.03);var gy=hB(fp.x,fp.z)+0.3;if(fp.y<gy)fp.y=gy;draw();return}
  r=clamp(r*(1+e.deltaY*0.0012),10,1400);draw()},{passive:false});
var btns=document.querySelectorAll('#viewSeg button');
function setPressed(v){btns.forEach(function(b){b.setAttribute('aria-pressed',String(b.dataset.v===v))})}
var VIEWS={out:{c:0,th:0.8,ph:1.1,r:75,t:[0,2.5,0]},in:{c:1,th:0.8,ph:1.0,r:62,t:[0,2.5,0]},top:{c:1,th:0,ph:0.05,r:85,t:[0,0,0]},val:{c:0,th:3.49,ph:1.27,r:500,t:[110,0,250]}};
btns.forEach(function(b){b.addEventListener('click',function(){var v=VIEWS[b.dataset.v];stopFilm(true);stopFly();clear=!!v.c;th=v.th;ph=v.ph;r=v.r;tgt.set(v.t[0],v.t[1],v.t[2]);setPressed(b.dataset.v);draw()})});
var dimBtn=document.getElementById('dimBtn');dimBtn.addEventListener('click',function(){dims=!dims;dimBtn.setAttribute('aria-pressed',String(dims));draw()});
var flyBtn=document.getElementById('flyBtn'),pad=document.getElementById('pad'),hint=document.getElementById('hint');
function flyStep(dt){var agl=fp.y-hB(fp.x,fp.z),sp=(running()?22:8)*clamp(agl/25,1,12)*dt,f=(keys.f?1:0)-(keys.b?1:0),sd=(keys.r?1:0)-(keys.l?1:0),u=(keys.u?1:0)-(keys.d?1:0);
  if(f||sd||u){var dv=new THREE.Vector3(-Math.sin(fyaw)*Math.cos(fpitch),Math.sin(fpitch),-Math.cos(fyaw)*Math.cos(fpitch)),rv=new THREE.Vector3(Math.cos(fyaw),0,-Math.sin(fyaw));
    fp.addScaledVector(dv,f*sp).addScaledVector(rv,sd*sp);fp.y+=u*sp;fp.x=clamp(fp.x,-3000,3000);fp.z=clamp(fp.z,-3000,3000);var gy=hB(fp.x,fp.z)+0.3;if(fp.y<gy)fp.y=gy;fp.y=Math.min(fp.y,2600)}
  draw()}
flyBtn.addEventListener('click',function(){stopFilm(true);if(walk){stopFly();return}
  if(fly){stopFly();return}
  /* zuerst die aktuelle Kameraposition der Umlaufansicht bestimmen, dann in den Flugmodus wechseln */
  place();var wd=new THREE.Vector3();camera.getWorldDirection(wd);fp.copy(camera.position);fyaw=Math.atan2(-wd.x,-wd.z);fpitch=Math.asin(clamp(wd.y,-1,1));
  /* im Flug sind Dach und Wände wieder undurchsichtig, sonst stimmt das Licht innen nicht */
  clear=false;fly=true;keys={};flyBtn.setAttribute('aria-pressed','true');pad.hidden=false;hint.innerHTML=HINT0;showHint();last=performance.now();setPressed(null);draw()});
var kmap={KeyW:'f',ArrowUp:'f',KeyS:'b',ArrowDown:'b',KeyA:'l',ArrowLeft:'l',KeyD:'r',ArrowRight:'r',KeyE:'u',Space:'u',KeyQ:'d',KeyC:'d'};
window.addEventListener('keydown',function(e){
  if(FILM.on){var el=e.target||document.body,tg=el.tagName;if(tg==='INPUT'||tg==='SELECT'||tg==='TEXTAREA'||e.altKey||e.ctrlKey||e.metaKey)return;
    /* Esc beendet den Film immer (ausser ein Aufklappfeld ist offen). Leertaste und Pfeile wirken im Bild und auch dann,
       wenn zuletzt der Film-Knopf angeklickt wurde; die Knöpfe der Filmleiste behalten ihre eigene Leertaste. */
    if(e.code==='Escape'){if(hdr&&hdr.classList.contains('open'))return;stopFilm();e.preventDefault();return}
    if(el!==document.body&&el!==document.documentElement&&el.id!=='filmBtn'&&!stage.contains(el))return;
    if(e.code==='Space'){if(tg==='BUTTON'&&el.id!=='filmBtn')return;fmPause(!FILM.paused);e.preventDefault()}
    else if(e.code==='ArrowRight'||e.code==='ArrowLeft'){fmSeek(FILM.t+(e.code==='ArrowRight'?5:-5));e.preventDefault()}
    return}
  if(!fly)return;
  /* Bedienelemente behalten ihre Tasten: Enter und Leertaste lösen Knöpfe aus, Pfeile bedienen Regler und Listen */
  var te=e.target,ctl=te&&te!==document.body&&te!==stage&&/^(BUTTON|SUMMARY|A|SELECT|INPUT|TEXTAREA)$/.test(te.tagName),form=ctl&&/^(SELECT|INPUT|TEXTAREA)$/.test(te.tagName);
  if(walk){if(e.code==='KeyE'||(e.code==='Enter'&&!ctl)){interact();e.preventDefault();return}if(e.code==='Escape'){closeCard();return}}
  if((form&&e.code.indexOf('Arrow')===0)||(ctl&&(e.code==='Space'||e.code==='Enter')))return;
  if(kmap[e.code]){keys[kmap[e.code]]=1;e.preventDefault()}if(e.code.indexOf('Shift')===0)keys[e.code]=1});
window.addEventListener('keyup',function(e){if(kmap[e.code])delete keys[kmap[e.code]];if(e.code.indexOf('Shift')===0)delete keys[e.code]});
pad.querySelectorAll('button[data-k]').forEach(function(b){b.addEventListener('pointerdown',function(e){e.stopPropagation();b.setPointerCapture(e.pointerId);keys[b.dataset.k]=1});
  ['pointerup','pointercancel','lostpointercapture'].forEach(function(n){b.addEventListener(n,function(){delete keys[b.dataset.k]})})});
var progEl=document.getElementById('prog'),cardEl=document.getElementById('card'),useBtn=document.getElementById('useBtn'),walkBtn=document.getElementById('walkBtn');
DEV.fineP=(function(){try{return matchMedia('(any-pointer:fine)').matches}catch(e){return true}})();
var HINT0=DEV.touch&&!DEV.fineP?'Fliegen: mit den Pfeilen unten rechts bewegen, ▲ / ▼ hoch und runter, Doppelpfeil = schneller, Bild ziehen = umsehen. Du kannst auch durch die Wände ins Innere fliegen.':hint.innerHTML,hintT=0;
/* Hinweis einblenden; auf Touchgeräten nach einigen Sekunden oder per Antippen wieder ausblenden */
function showHint(){hint.hidden=false;clearTimeout(hintT);if(DEV.touch||stage.clientWidth<=600)hintT=setTimeout(function(){hint.hidden=true},DEV.touch?9000:14000)}
hint.addEventListener('pointerdown',function(e){e.stopPropagation();hint.hidden=true});
[progEl,cardEl,useBtn].forEach(function(e){e.addEventListener('pointerdown',function(ev){ev.stopPropagation()})});
/* Bodenhöhe im Rundgang: Treppe und Podest im Kellerschacht, im Keller (Füsse unter -1,2 m) der Kellerboden, sonst das Gelände */
function hF(x,z,fy){
  if(x>KPX0-0.02&&x<KPX1+0.02){var run=(KPZM-KPZN)/13;
    if(z>KPZN&&z<=KPZM){var k=clamp(Math.floor((KPZM-z)/run),0,12);return -KD+(k+1)*KD/13}
    if(z>KPZM&&z<KPZS+0.02)return -KD}
  if(fy<-1.2&&((x>-W/2-0.02&&x<W/2&&z>zS[2]&&z<TOT/2)||(x>CX0&&x<=-W/2&&z>KPZS-0.02&&z<TOT/2)))return -KD;
  return hB(x,z)}
function collide(px,pz,rr,fy){fy=fy||0;for(var it=0;it<3;it++){for(var i=0;i<SO.length;i++){var b=SO[i];if(fy<b[4]-0.3||fy>b[5])continue;var cx=Math.max(b[0],Math.min(px,b[1])),cz=Math.max(b[2],Math.min(pz,b[3])),dx=px-cx,dz=pz-cz,d2=dx*dx+dz*dz;
  if(d2<rr*rr){if(d2>1e-8){var d=Math.sqrt(d2),k=(rr-d)/d;px+=dx*k;pz+=dz*k}else{var l=px-b[0],rt=b[1]-px,tt=pz-b[2],bt=b[3]-pz,m=Math.min(l,rt,tt,bt);if(m===l)px=b[0]-rr;else if(m===rt)px=b[1]+rr;else if(m===tt)pz=b[2]-rr;else pz=b[3]+rr}}}}return [px,pz]}
/* Rennen: Shift oder der Umschalter am Steuerkreuz (für Touchscreens); bleibt an, bis man ihn wieder antippt */
var runOn=false,runBtn=document.getElementById('runBtn');
function running(){return runOn||!!(keys.ShiftLeft||keys.ShiftRight)}
function setRun(o){runOn=o;if(runBtn)runBtn.setAttribute('aria-pressed',String(o))}
if(runBtn)runBtn.addEventListener('click',function(){setRun(!runOn)});
/* Gehen 4,5 m/s, nach knapp einer Sekunde ohne Pause bis 6 m/s; rennen 9 m/s. Schnelle Schritte in Teilschritten
   von höchstens 0,2 m, damit man bei wenigen Bildern pro Sekunde nicht durch eine Wand rutscht */
var walkHold=0;
function walkStep(dt){if(cardOpen)return;
  var f=(keys.f?1:0)-(keys.b?1:0),sd=(keys.r?1:0)-(keys.l?1:0);walkHold=(f||sd)?walkHold+dt:0;
  var sp=(running()?9:4.5*(1+0.33*sstep(0.6,1.8,walkHold)))*dt;
  var fy=fp.y-1.65;
  if(f||sd){var n=Math.max(1,Math.ceil(sp/0.2)),st=sp/n,mx=-Math.sin(fyaw)*f+Math.cos(fyaw)*sd,mz=-Math.cos(fyaw)*f-Math.sin(fyaw)*sd;
    for(var k=0;k<n;k++){var c=collide(fp.x+mx*st,fp.z+mz*st,0.25,fy),d=Math.hypot(c[0],c[1]);
      if(d>150){c[0]*=150/d;c[1]*=150/d}var g1=hF(c[0],c[1],fy),g0=hF(fp.x,fp.z,fy);if(g1-g0<0.7&&g1>-6){fp.x=c[0];fp.z=c[1]}else break;
      fy=hF(fp.x,fp.z,fy)}
    draw()}
  fp.y=1.65+hF(fp.x,fp.z,fy);fy=fp.y-1.65;
  var nd=2.4,pn=near;near=-1;
  HS.forEach(function(h,i){var d=Math.hypot(fp.x-h.x,fp.z-h.z);if(d<nd&&Math.abs((h.lv||0)-fy)<1.2&&(!h.room||h.room(fp))){nd=d;near=i}});
  useBtn.hidden=near<0;if(near>=0&&near!==pn)useBtn.textContent=(DEV.touch&&!DEV.fineP?'Schild lesen: ':'Schild lesen (E): ')+HS[near].t}
var cardBack=null;
function closeCard(){var had=cardEl.contains(document.activeElement);cardEl.hidden=true;cardOpen=false;
  if(had){var t=cardBack&&document.contains(cardBack)&&!cardBack.closest('[hidden]')?cardBack:stage;try{t.focus({preventScroll:true})}catch(e){}}cardBack=null;draw()}
function interact(idx){if(cardOpen){closeCard();return}var si=(typeof idx==='number')?idx:near;if(si<0)return;var h=HS[si],o=hsG[si];
  if(!o.done){o.done=true;found++;drawSign(h,si,true)}
  progEl.textContent='Schilder gelesen: '+found+' / '+HS.length;
  cardBack=document.activeElement;
  cardEl.innerHTML='<h2 id="cardTitle">'+h.t+'</h2><p>'+h.s+'</p>'+(h.fm?'<p class="fm"><b>FM-Blick:</b> '+h.fm+'</p>':'')+'<p class="q">Quellen: '+h.q+'. <button type="button" id="cardSrc" class="link">Alle Quellen anzeigen</button></p>'+(found===HS.length?'<p class="done">Geschafft! Du hast alle Schilder gelesen.</p>':'')+'<button type="button" id="cardClose">Schließen (Esc)</button>';
  cardEl.hidden=false;cardOpen=true;try{cardEl.focus({preventScroll:true})}catch(e){}document.getElementById('cardClose').addEventListener('click',closeCard);
  document.getElementById('cardSrc').addEventListener('click',showSources)}
/* Quellenliste im Fußbereich öffnen und hinscrollen */
function showSources(){closeCard();stopFilm();var qs=document.getElementById('quellen');if(qs)qs.open=true;if(qs)setTimeout(function(){try{qs.scrollIntoView({behavior:'smooth',block:'start'})}catch(e){qs.scrollIntoView()}},60)}
function startWalk(){fly=true;walk=true;clear=false;keys={};
  flyBtn.setAttribute('aria-pressed','false');walkBtn.setAttribute('aria-pressed','true');setPressed(null);
  fp.set(DOFF,1.65+hB(DOFF,-TOT/2-12.5),-TOT/2-12.5);fyaw=Math.PI;fpitch=-0.05;
  hint.textContent=DEV.touch&&!DEV.fineP?'Rundgang: mit den Pfeilen unten rechts laufen, Doppelpfeil = rennen, Bild ziehen = umsehen. Lies die '+HS.length+' Infoschilder: hingehen und „Schild lesen“ oder das Schild antippen.':'Rundgang: W A S D laufen, Maus ziehen = umsehen, Shift = schneller. Lies die '+HS.length+' Infoschilder: hingehen und E drücken oder das Schild anklicken.';showHint();
  pad.hidden=false;pad.querySelectorAll('[data-k=u],[data-k=d]').forEach(function(b){b.hidden=true});
  progEl.hidden=false;progEl.textContent='Schilder gelesen: '+found+' / '+HS.length;stage.classList.add('walking');hsG.forEach(function(o){o.g.visible=true});last=performance.now();draw()}
function stopFly(){if(!fly&&!walk)return;fly=false;walk=false;keys={};setRun(false);
  flyBtn.setAttribute('aria-pressed','false');walkBtn.setAttribute('aria-pressed','false');
  pad.hidden=hint.hidden=true;pad.querySelectorAll('[data-k=u],[data-k=d]').forEach(function(b){b.hidden=false});
  progEl.hidden=true;useBtn.hidden=true;closeCard();stage.classList.remove('walking');hsG.forEach(function(o){o.g.visible=false});hint.innerHTML=HINT0;draw()}
walkBtn.addEventListener('click',function(){stopFilm(true);if(walk){stopFly()}else{if(fly)stopFly();startWalk()}});
/* Film: Schlüssel holen und Weg zum Museum */
var filmBtn=document.getElementById('filmBtn');if(filmBtn)filmBtn.addEventListener('click',function(){if(FILM.on)stopFilm();else startFilm()});
/* Ansichten über den Link-Anker, z. B. #raum3-t0930-winter oder #tal */
var WALKP={eingang:[DOFF,-TOT/2-7,Math.PI,0.05],raum1:[DOFF+0.3,-TOT/2+1.3,Math.PI,0.08],raum2:[DOFF,zS[1]+1.0,Math.PI,0.05],raum3:[-0.6,zS[2]+1.4,Math.PI,0.16],decke:[-0.2,zS[2]+7.5,Math.PI,1.05],zelle:[-2.75,1.05,0.94,0.38],
  /* vor einzelnen Exponaten: Flachrelief in Raum 1, Hochrelief in Raum 2, Halbfigur in Raum 3 */
  flachrelief:[Wi/2-1.7,(zA(0)+zB(0))/2,-Math.PI/2,0.0],hochrelief:[Wi/2-1.9,zA(1)+1.2+3*(zB(1)-zA(1)-2.4)/7,-Math.PI/2,0.0],halbfigur:[-0.75,zA(2)+4.2-2.7,-2.69,-0.1],
  /* im Keller: Lager unter Raum 3 (Blick nach Süden), Schacht unten am Podest */
  keller:[0.6,zS[2]+1.6,Math.PI,0.02,-KD],schacht:[(KPX0+KPX1)/2,KPZM+0.8,Math.PI,0.0,-KD]};
function applyHash(){var tk=(location.hash||'').replace('#','').toLowerCase().split('-'),v=null,VM={aussen:'out',innen:'in',drauf:'top',tal:'val'};
  var qq=tk.filter(function(t){return QS[t]||t==='auto'})[0];if(qq&&(qq==='auto'?!qAuto:qq!==qName)){try{location.reload()}catch(e){}return}
  if(tk.indexOf('diag')>=0&&!DIAG){DIAG=true;setInterval(diagPanel,2000);diagPanel()}
  /* #cam:x,y,z,richtung,neigung (m = minus): Flugmodus an einer festen Stelle, für Prüfungen */
  var cm_=tk.filter(function(t){return t.indexOf('cam:')===0})[0];if(cm_){var cv_=cm_.slice(4).split(',').map(function(q){return parseFloat(q.replace(/m/g,'-'))});if(cv_.length>=5&&cv_.every(isFinite)){if(!fly)flyBtn.click();fp.set(cv_[0],cv_[1],cv_[2]);fyaw=cv_[3];fpitch=cv_[4];draw()}}
  tk.forEach(function(t){if(t==='sommer'||t==='winter'||t==='aequi')seasonS.value=t;else if(/^t\d{4}$/.test(t))timeR.value=String(parseInt(t.slice(1,3),10)+parseInt(t.slice(3,5),10)/60);else if(VM[t])v=VM[t];else if(WALKP[t])v='w:'+t;else if(/^schild\d+$/.test(t)&&HS[parseInt(t.slice(6),10)-1])v='s:'+(parseInt(t.slice(6),10)-1)});
  applySun();
  /* ein Anker zu einer Ansicht oder Stelle beendet einen laufenden Film (wie die Ansichtsknöpfe) */
  if(v&&FILM.on&&tk.indexOf('film')<0)stopFilm(true);
  if(v&&v.indexOf('w:')===0){var p=WALKP[v.slice(2)];if(fly)stopFly();startWalk();var pz=v==='w:zelle'?cellZ(1)+p[1]:p[1];fp.set(p[0],1.65+(p[4]!==undefined?hF(p[0],pz,p[4]):hB(p[0],pz)),pz);fyaw=p[2];fpitch=p[3];draw()}
  /* #schild3 usw.: im Rundgang direkt vor das Schild stellen */
  else if(v&&v.indexOf('s:')===0){var hs=HS[+v.slice(2)],d=hs.k==='wall'?1.25:1.35,sx=hs.x+Math.sin(hs.ry)*d,sz=hs.z+Math.cos(hs.ry)*d;if(fly)stopFly();startWalk();fp.set(sx,1.65+hF(sx,sz,hs.lv||0),sz);fyaw=hs.ry;fpitch=hs.k==='wall'?-0.06:-0.42;draw()}
  else if(v){var b=document.querySelector('#viewSeg button[data-v="'+v+'"]');if(b)b.click()}
  /* #film startet den Film; #film-s40 springt zu Sekunde 40, #film-s40-pause hält dort an */
  if(tk.indexOf('film')>=0){if(!prOn){FILM.pend=true;return}if(!FILM.on)startFilm();var fs_=tk.filter(function(t){return /^s\d+$/.test(t)})[0];if(fs_)fmSeek(parseInt(fs_.slice(1),10));if(tk.indexOf('pause')>=0)fmPause(true)}}
window.addEventListener('hashchange',applyHash);
useBtn.addEventListener('click',interact);
/* ---------- Sonnenstand ---------- */
var timeR=document.getElementById('timeR'),timeV=document.getElementById('timeV'),sunV=document.getElementById('sunV'),seasonS=document.getElementById('seasonS'),qualS=document.getElementById('qualS');
var windS=document.getElementById('windS'),cloudOn=document.getElementById('cloudOn');
if(windS){var wo=[].map.call(windS.options||[],function(o){return +o.value}),wb=0;wo.forEach(function(v,i){if(Math.abs(v-windLvl)<Math.abs(wo[wb]-windLvl))wb=i});if(wo.length)windS.selectedIndex=wb;
  windS.addEventListener('change',function(){windLvl=+windS.value;slowWind=false;lsSet('lcWind',String(windLvl));windApply();draw()})}
var waterCb=document.getElementById('waterOn');
if(waterCb){waterCb.checked=waterOn;waterCb.addEventListener('change',function(){waterOn=waterCb.checked;slowWind=false;lsSet('lcWater',waterOn?'1':'0');draw()})}
if(cloudOn){cloudOn.checked=cloudsOn;cloudOn.addEventListener('change',function(){cloudsOn=cloudOn.checked;lsSet('lcCloud',cloudsOn?'1':'0');windApply();draw()})}
/* Qualität: „automatisch“ wählt nach Gerät und Grafikchip; eine feste Wahl wird im Browser gespeichert */
function setQ(v){lsSet('lcQual',v==='auto'?'':v);if(v==='auto'||QS[v])lsSet('lcAutoCap','');
  var tk=(location.hash||'').replace('#','').split('-').filter(function(t){return t&&!QS[t.toLowerCase()]&&t.toLowerCase()!=='auto'});if(v!=='auto')tk.unshift(v);
  try{history.replaceState(null,'',location.pathname+location.search+(tk.length?'#'+tk.join('-'):''))}catch(e){}
  try{location.reload()}catch(e){}}
(function(){var o=qualS.querySelector('option[value="auto"]');if(o)o.textContent='Qualität: automatisch ('+(qAuto?qName:autoQ())+')'})();
qualS.value=qAuto?'auto':qName;qualS.addEventListener('change',function(){setQ(qualS.value)});
/* Handy und Tablet: Licht und Qualität als aufklappbares Feld unter der Kopfzeile */
var hdr=document.querySelector('header'),setBtn=document.getElementById('setBtn');
function setOpen(o){if(!hdr||!setBtn)return;hdr.classList.toggle('open',o);setBtn.setAttribute('aria-expanded',String(o))}
if(setBtn){setBtn.addEventListener('click',function(){setOpen(!hdr.classList.contains('open'))});
  document.addEventListener('pointerdown',function(e){if(hdr.classList.contains('open')&&!hdr.contains(e.target))setOpen(false)},true);
  window.addEventListener('keydown',function(e){if(e.key==='Escape'&&hdr.classList.contains('open')){setOpen(false);setBtn.focus()}})}
function fmt(t){var h=Math.floor(t),m=Math.round((t-h)*60);if(m===60){h++;m=0}return (h<10?'0':'')+h+':'+(m<10?'0':'')+m}
var LAT=46.4056*Math.PI/180,expoBase=0.65,seasonPrev='';
function applySun(){
  var tt=parseFloat(timeR.value),sea=seasonS.value,dec={sommer:23.44,aequi:0,winter:-23.44}[sea]*Math.PI/180,hh=(tt-12)*15*Math.PI/180;
  var el=Math.asin(clamp(Math.sin(LAT)*Math.sin(dec)+Math.cos(LAT)*Math.cos(dec)*Math.cos(hh),-1,1));
  var az=Math.atan2(Math.sin(hh),Math.cos(hh)*Math.sin(LAT)-Math.tan(dec)*Math.cos(LAT));
  svW.set(-Math.sin(az)*Math.cos(el),Math.sin(el),Math.cos(az)*Math.cos(el));var b=w2b(svW.x,svW.z);svB.set(b[0],svW.y,b[1]).normalize();sunEl=el;
  U.uSunB.value.copy(svB);if(sky)sky.material.uniforms.sunPosition.value.copy(svB);
  if(sea!==seasonPrev){seasonPrev=sea;dayTrack(dec);U.uSeason.value={sommer:0,aequi:0.12,winter:1}[sea];U.uSnow.value={sommer:3300,aequi:2350,winter:1050}[sea];
    /* Winter: Laubbäume lichter – über einen Uniform-Wert, damit kein Shader neu übersetzt werden muss */
    leafMats.forEach(function(m){var k=(sea==='winter'&&decidMat(m))?0.42/0.82:1;if(m.userData.lcU)m.userData.lcU.uAlphaK.value=k})}
  updateTS(svW);afterSun();
}
/* Spur des Uhrzeit-Reglers: Nacht, Dämmerung und Tag der gewählten Jahreszeit, mit derselben Formel wie oben */
var trackDec=0;
function dayTrack(dec){if(dec!==undefined)trackDec=dec;dec=trackDec;
  function rgb(n,f){var h=(css(n)||f).replace('#','');return [0,2,4].map(function(i){return parseInt(h.substr(i,2),16)})}
  function mix(a,b,t){return 'rgb('+a.map(function(v,i){return Math.round(v+(b[i]-v)*clamp(t,0,1))}).join(',')+')'}
  var ni=rgb('--c-night','#2c3445'),am=rgb('--c-amber','#d9962e'),dy=rgb('--c-day','#dfe5e8'),mn=+timeR.min,mx=+timeR.max,N=34,st=[];
  for(var i=0;i<=N;i++){var hh=(mn+(mx-mn)*i/N-12)*15*Math.PI/180,e=Math.asin(clamp(Math.sin(LAT)*Math.sin(dec)+Math.cos(LAT)*Math.cos(dec)*Math.cos(hh),-1,1))*180/Math.PI;
    st.push((e<1?mix(ni,am,(e+6)/7):mix(am,dy,(e-1)/11))+' '+(100*i/N).toFixed(1)+'%')}
  timeR.style.setProperty('--track','linear-gradient(90deg,'+st.join(',')+')')}
function decidMat(m){return decidMeshes.some(function(d){return d.material===m})}
function afterSun(){
  var el=sunEl,s=Math.sin(el),sv=sunVisB;
  var dl=sstep(-0.12,0.32,s);
  sun.intensity=2.5*sstep(-0.015,0.10,s)*(0.42+0.58*sstep(0,0.55,s));
  var warm=1-sstep(0.04,0.55,s);sun.color.setRGB(1.0,0.97-0.42*warm,0.92-0.66*warm);U.uSunC.value.copy(sun.color).multiplyScalar(sun.intensity);
  amb.intensity=0.05*(1-dl);
  var k=sv*sstep(-0.01,0.08,s);
  var sk=0.10+1.25*dl;U.uSkyL.value.setRGB(1.0,0.86,0.66).multiplyScalar(sk*0.85+1.6*Math.max(0,s)*k);
  /* innen nur gestreutes Licht: der Sonnenanteil kommt diffus durch die Platten (kein Sonnenfleck), Wolken dämpfen ihn */
  INTL.b=sk*1.4;INTL.s=INT_SUN*Math.max(0,s)*k;intLUpd();
  var fc=new THREE.Color().setRGB(0.46,0.54,0.64).lerp(new THREE.Color(0.80,0.58,0.42),warm*0.55*dl).multiplyScalar(0.05+0.95*dl);scene.fog.color.copy(fc);
  expoBase=clamp(0.66/(0.07+0.93*dl),0.64,3.2);
  var gI=sun.intensity*Math.max(0,s)*k+0.32*dl+0.004;
  /* Boden und Berghänge im Umgebungslicht: neutral grau-oliv statt satt grün (sonst färben sie die Betonwände grünlich;
     auf den Fotos ist der Beton hell und neutral grau) */
  if(groundE)groundE.material.color.setRGB(0.12,0.12,0.10).multiplyScalar(gI);
  if(ringM)ringM.material.color.setRGB(0.13,0.13,0.115).multiplyScalar(gI*0.8+0.02*dl);
  envQueue();
  var hidden=(s>0.0&&sv<0.5);
  /* Uhrzeit und Sonnenstand in getrennten Zeilen, damit die Anzeige beim Ziehen nicht umbricht */
  var deg=Math.round(el*180/Math.PI),clock=fmt(parseFloat(timeR.value));
  var sunT=deg>0?'Sonne '+deg+'° hoch':deg<0?'Sonne '+(-deg)+'° unter dem Horizont':'Sonne am Horizont';
  timeV.textContent=clock;
  sunV.textContent=sunT+(hidden?' · hinter dem Berg':'');
  timeR.setAttribute('aria-valuetext',clock+' Uhr, '+sunT.replace('°',' Grad')+(hidden?', hinter dem Berg':''));
  draw();
}
[timeR,seasonS].forEach(function(e){e.addEventListener('input',applySun);e.addEventListener('change',applySun)});
var mq=window.matchMedia('(prefers-color-scheme: dark)');if(mq.addEventListener)mq.addEventListener('change',function(){theme();dayTrack();draw()})
/* Hell/Dunkel-Schalter (js/loader.js) */
document.addEventListener('lc-theme',function(){theme();dayTrack();draw()});
