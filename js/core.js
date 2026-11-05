/* La Congiunta 3D – Grundlagen: Fehleranzeige und Diagnose (#diag), Koordinaten, Hilfsfunktionen, Qualitätsstufen, Gerät, Höhenmodell */
'use strict';
var A=window.LC_ASSETS||{};
var root=document.documentElement;
function css(n){return getComputedStyle(root).getPropertyValue(n).trim()}
var stage=document.getElementById('stage'),loadEl=document.getElementById('load'),loadTxt=document.getElementById('loadTxt');
function setStatus(t,err){if(loadTxt){loadTxt.textContent=t;loadTxt.className=err?'err':''}}
/* Diagnose: echte Fehler sichtbar machen; mit #diag im Link zusätzlich ein vollständiges Protokoll */
var DIAG=/(^|[#-])diag($|-)/i.test(location.hash||''),LOG=[],diagEl=null,diagN=0,diagSeen={};window.__lcLog=LOG;
function fmtArg(a){try{if(a&&a.message)return a.message;if(typeof a==='object')return (a&&a.constructor&&a.constructor.name)||'Objekt';return String(a)}catch(e){return '?'}}
function logPush(kind,msg){if(LOG.length<400)LOG.push((performance.now()/1000).toFixed(1)+'s '+kind+': '+String(msg).slice(0,500));if(DIAG)diagPanel()}
function benign(m){return /ResizeObserver loop|Script error\.?$/i.test(m)}
function diag(msg){try{msg=String(msg).slice(0,300);if(diagSeen[msg])return;diagSeen[msg]=1;
  if(!diagEl){diagEl=document.createElement('div');diagEl.className='diag';diagEl.setAttribute('role','alert');var x=document.createElement('button');x.className='diagx';x.textContent='Schließen';x.addEventListener('click',function(){diagEl.hidden=true});diagEl.appendChild(x);stage.appendChild(diagEl)}
  if(diagN++<6){var p=document.createElement('div');p.textContent=msg;diagEl.appendChild(p);diagEl.hidden=false}}catch(e){}}
(function(){var oe=console.error,ow=console.warn,ol=console.log;
  console.error=function(){var m=Array.prototype.map.call(arguments,fmtArg).join(' ');logPush('error',m);if(!benign(m)&&/THREE|\[LC\]|WebGL|shader/i.test(m))diag('Fehler: '+m);return oe.apply(console,arguments)};
  console.warn=function(){var m=Array.prototype.map.call(arguments,fmtArg).join(' ');if(/getProgramInfoLog/.test(m)&&!/error/i.test(m)){window.__lcShaderHints=(window.__lcShaderHints||0)+1;return ow.apply(console,arguments)}logPush('warn',m);if(/\[LC\]/.test(m))diag('Hinweis: '+m);return ow.apply(console,arguments)};
  console.log=function(){var m=Array.prototype.map.call(arguments,fmtArg).join(' ');if(/THREE/.test(m))logPush('log',m);return ol.apply(console,arguments)};
  window.addEventListener('error',function(e){if(window.LC_ABORT)return;var m=(e&&e.message)||String(e);if(e&&e.filename)m+=' ('+String(e.filename).split('/').pop().slice(0,40)+':'+e.lineno+')';logPush('uncaught',m);if(!benign(e&&e.message||''))diag('Fehler: '+m)});
  window.addEventListener('unhandledrejection',function(e){var r=e&&e.reason,m='Promise: '+((r&&r.message)||String(r));logPush('uncaught',m);diag('Fehler: '+m)})})();
var diagBox=null,diagTO=0;
function diagPanel(){if(!DIAG)return;clearTimeout(diagTO);diagTO=setTimeout(function(){try{if(!diagBox){diagBox=document.createElement('pre');diagBox.className='diagp';diagBox.addEventListener('wheel',function(e){e.stopPropagation()},{passive:true});stage.appendChild(diagBox)}
  var info=window.__lcInfo?window.__lcInfo():'',atEnd=diagBox.scrollTop>0&&diagBox.scrollTop+diagBox.clientHeight>=diagBox.scrollHeight-24;diagBox.textContent='Diagnose (#diag)\n'+info+'\n— Protokoll ('+LOG.length+') —\n'+(LOG.length?LOG.join('\n'):'keine Fehler oder Warnungen');if(atEnd)diagBox.scrollTop=diagBox.scrollHeight}catch(e){}},200)}
if(DIAG)setInterval(diagPanel,2000);
(function(){var nv=null;try{nv=performance.getEntriesByType('navigation')[0]}catch(e){}logPush('zeit','Seite geladen (load-Ereignis) nach '+(nv&&nv.loadEventStart?(nv.loadEventStart/1000).toFixed(2)+' s':'?')+', three.js geladen nach '+((window.LC_T1||0)/1000).toFixed(2)+' s')})();

/* ---------- Koordinaten: Szene = Gebäudesystem B (Längsachse = z, Eingang bei -z),
   Welt W: x Ost, z Süd, Ursprung Gebäudemitte (46.4056231 N, 8.8704691 E), y = Höhe über 398,1 m ü. M.
   Die Gebäudeachse ist um TH = 21,1° gegen Nord-Süd gedreht (nach swissBUILDINGS3D [7]): W = R(TH)·B ---------- */
var TH=0.36826,CT=Math.cos(TH),ST=Math.sin(TH),BASE=398.1;
function b2w(x,z){return [x*CT+z*ST,-x*ST+z*CT]}
function w2b(x,z){return [x*CT-z*ST,x*ST+z*CT]}
function sstep(a,b,x){var t=Math.max(0,Math.min(1,(x-a)/(b-a)));return t*t*(3-2*t)}
function clamp(x,a,b){return x<a?a:(x>b?b:x)}
function mb32(a){return function(){a|=0;a=a+0x6D2B79F5|0;var t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}}
/* ---------- Qualitätsstufen ---------- */
/* px = Pixelbudget in Megapixeln (bestimmt das Pixelverhältnis), prLo/prMax = Grenzen beim Start, prMin = Untergrenze der automatischen Anpassung */
/* fx = Ausdehnung des Waldes um das Gebäude (m), tF = Abstand der fernen Bäume; ultra nur auf Wunsch (nie automatisch) */
var QS={ultra:{px:5.0,prLo:1,prMax:2,prMin:0.85,sh:4096,ms:4,post:1,grid:480,tN:3.0,tM:5.2,tF:9,fx:1600,cards:46,midCards:12,grass:11000,bloom:1,wind:1,shR:80},
  hoch:{px:3.2,prLo:1,prMax:2,prMin:0.75,sh:3072,ms:4,post:1,grid:400,tN:3.3,tM:5.8,tF:10,fx:1600,cards:40,midCards:12,grass:11000,bloom:1,wind:1,shR:64},
  mittel:{px:2.1,prLo:1,prMax:2,prMin:0.7,sh:2048,ms:0,post:0,grid:320,tN:3.8,tM:7.2,tF:14,fx:1400,cards:30,midCards:10,grass:5500,bloom:0,wind:1,shR:56},
  niedrig:{px:1.0,prLo:0.85,prMax:1.75,prMin:0.6,sh:1024,ms:0,post:0,grid:220,tN:5.0,tM:10,tF:20,fx:1200,cards:22,midCards:8,grass:1500,bloom:0,wind:0,shR:48}};
var QL=['niedrig','mittel','hoch','ultra'];
function lsGet(k){try{return localStorage.getItem(k)||''}catch(e){return ''}}
function lsSet(k,v){try{if(v)localStorage.setItem(k,v);else localStorage.removeItem(k)}catch(e){}}
/* Wahl der Qualität: Link-Anker (#hoch, #mittel, #niedrig, #auto) vor gespeicherter Wahl vor Automatik */
var qHash=((location.hash||'').replace('#','').toLowerCase().split('-').filter(function(t){return QS[t]||t==='auto'})[0])||'';
var qSel=qHash||(QS[lsGet('lcQual')]?lsGet('lcQual'):'')||'auto',qAuto=qSel==='auto';
var qName='',QP=null,GPU='';
/* Gerät: Telefon, Tablet oder Rechner; Arbeitsspeicher, Kerne, Datensparmodus, reduzierte Bewegung */
var DEV=(function(){function mm(q){try{return matchMedia(q).matches}catch(e){return false}}
  var n=window.navigator||{},sc=window.screen||{},ua=n.userAgent||'',sw=Math.min(sc.width||800,sc.height||800),coarse=mm('(pointer:coarse)'),fine=mm('(any-pointer:fine)'),
    iPad=/iPad/.test(ua)||(/Macintosh/.test(ua)&&(n.maxTouchPoints||0)>1),phone=(/iPhone|iPod|Android.+Mobile|Mobile.+Firefox/.test(ua)||(coarse&&!fine&&sw<600))&&!iPad,
    tablet=!phone&&(iPad||/Android/.test(ua)||(coarse&&!fine&&sw<1200));
  return {phone:phone,tablet:tablet,touch:coarse||(n.maxTouchPoints||0)>0,mem:n.deviceMemory||0,cores:n.hardwareConcurrency||0,
    save:!!(n.connection&&n.connection.saveData),rm:mm('(prefers-reduced-motion:reduce)'),dpr:window.devicePixelRatio||1,sw:sw}})();

/* ---------- Höhenmodell (swisstopo, über den Profil-Dienst abgetastet) ---------- */
function u16(b64){var s=atob(b64),n=s.length>>1,a=new Float32Array(n);for(var i=0;i<n;i++)a[i]=(s.charCodeAt(2*i)|(s.charCodeAt(2*i+1)<<8))/10-BASE;return a}
var DN={a:u16(A.dem_near),n:121,h:180},DM={a:u16(A.dem_mid),n:81,h:1200},DF={a:u16(A.dem_far),n:81,h:9000};
function samp(G,x,z){var n=G.n,f=(n-1)/(2*G.h),fx=(x+G.h)*f,fz=(z+G.h)*f;
  if(fx<0)fx=0;else if(fx>n-1.001)fx=n-1.001;if(fz<0)fz=0;else if(fz>n-1.001)fz=n-1.001;
  var ix=fx|0,iz=fz|0,tx=fx-ix,tz=fz-iz,a=G.a,i=iz*n+ix;
  return (a[i]*(1-tx)+a[i+1]*tx)*(1-tz)+(a[i+n]*(1-tx)+a[i+n+1]*tx)*tz}
function hMF(x,z){var m=Math.max(Math.abs(x),Math.abs(z));if(m>=1150)return samp(DF,x,z);var h=samp(DM,x,z);if(m>1050){var w=(1150-m)/100;h=h*w+samp(DF,x,z)*(1-w)}return h}
function hRaw(x,z){var m=Math.max(Math.abs(x),Math.abs(z));if(m>=172)return hMF(x,z);var h=samp(DN,x,z);if(m>150){var w=(172-m)/22;h=h*w+hMF(x,z)*(1-w)}return h}
/* Gebäudeplateau: das Gelände wird unter und direkt um das Gebäude auf 0 geglättet */
function padB(bx,bz){var dx=Math.max(-7.8-bx,0,bx-4.6),dz=Math.max(-24.5-bz,0,bz-23.6),d=Math.sqrt(dx*dx+dz*dz);return d<7?1-sstep(0,7,d):0}
function hW(x,z){var h=hRaw(x,z);if(Math.abs(x)<40&&Math.abs(z)<40){var b=w2b(x,z),p=padB(b[0],b[1]);if(p>0)h*=1-p}return h}
function hB(x,z){var w=b2w(x,z);return hW(w[0],w[1])}
