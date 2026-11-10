/* La Congiunta 3D – Hinweise, Maßlinien, Kamera, Bildschleife und Auflösung */
'use strict';
/* kurze Hinweise oben im Bild */
var toastEl=null,toastT=0;
/* auch vom Lader genutzt (Hinweis „Handy quer halten“ im Vollbild) */
// eslint-disable-next-line no-unused-vars
function toast(t){if(!toastEl){toastEl=document.createElement('div');toastEl.className='toast';toastEl.setAttribute('role','status');stage.appendChild(toastEl)}toastEl.textContent=t;toastEl.hidden=false;clearTimeout(toastT);toastT=setTimeout(function(){toastEl.hidden=true},5200)}
/* ---------- Maßlinien ---------- */
var dims=true,dimG=new THREE.Group();scene.add(dimG);
var dimSolid=new THREE.LineBasicMaterial({color:0xa8650f,fog:false});
function dline(a,b,t){[[a,b],[a.clone().sub(t),a.clone().add(t)],[b.clone().sub(t),b.clone().add(t)]].forEach(function(seg){dimG.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(seg),dimSolid))})}
function buildDims(){var zc=-TOT/2;L.forEach(function(l,i){dline(new THREE.Vector3(W/2+1.0,0.03,zc+l/2),new THREE.Vector3(W/2+1.0,H[i],zc+l/2),new THREE.Vector3(0.35,0,0));zc+=l});
  dline(new THREE.Vector3(W/2+2.2,0.06,-TOT/2),new THREE.Vector3(W/2+2.2,0.06,TOT/2),new THREE.Vector3(0.4,0,0));
  dline(new THREE.Vector3(-W/2,0.06,TOT/2+1.2),new THREE.Vector3(W/2,0.06,TOT/2+1.2),new THREE.Vector3(0,0,0.4));
  dline(new THREE.Vector3(CX0,0.06,TOT/2+2.2),new THREE.Vector3(-W/2,0.06,TOT/2+2.2),new THREE.Vector3(0,0,0.3));
  /* Untergeschoss unter Raum 3 und den Zellen: Umriss gestrichelt, durch Boden und Wände sichtbar */
  var km=new THREE.LineDashedMaterial({color:0xa8650f,dashSize:0.35,gapSize:0.22,depthTest:false,transparent:true,opacity:0.8,fog:false});kelM=km;km.color.copy(dimSolid.color);
  var y0=-KD,P=[[CX0,TOT/2],[CX0,CZ0],[-W/2,CZ0],[-W/2,zS[2]],[W/2,zS[2]],[W/2,TOT/2]];
  [y0,-0.02].forEach(function(yy){var pts=P.map(function(q){return new THREE.Vector3(q[0],yy,q[1])});pts.push(pts[0].clone());var g=new THREE.BufferGeometry().setFromPoints(pts),ln=new THREE.Line(g,km);ln.computeLineDistances();ln.renderOrder=6;dimG.add(ln)});
  P.forEach(function(q){var g=new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(q[0],y0,q[1]),new THREE.Vector3(q[0],-0.02,q[1])]),ln=new THREE.Line(g,km);ln.computeLineDistances();ln.renderOrder=6;dimG.add(ln)});}
var kelM=null;
function theme(){dimSolid.color.set(css('--accent')||'#a8650f');if(kelM)kelM.color.copy(dimSolid.color)}
/* ---------- Kamera und Darstellung ---------- */
var th=0.8,ph=1.1,r=75,tgt=new THREE.Vector3(0,2.5,0),clear=false;
var fly=false,fp=new THREE.Vector3(),fyaw=0,fpitch=0,keys={},last=0,walk=false,near=-1,found=0,cardOpen=false;
var tagEls=[],envTagEls=[],lastR=0,needs=true,expo=0.65,expoT=0.65,svB=new THREE.Vector3(0,1,0),svW=new THREE.Vector3(0,1,0),sunEl=0.5;
var needle=document.getElementById('needle'),NORTH=w2b(0,-1);
function place(){
  if(FILM.on){fmPlace(FILM.pdt||0);return}
  if(fly){camera.position.copy(fp);camera.rotation.set(fpitch,fyaw,0,'YXZ');if(camera.near!==0.08){camera.near=0.08;camera.updateProjectionMatrix()}return}
  camera.position.set(tgt.x+r*Math.sin(ph)*Math.sin(th),tgt.y+r*Math.cos(ph),tgt.z+r*Math.sin(ph)*Math.cos(th));
  var gy=hB(camera.position.x,camera.position.z)+1.6;if(camera.position.y<gy)camera.position.y=gy;
  camera.lookAt(tgt);var nr=clamp(r*0.004,0.15,2);if(Math.abs(camera.near-nr)>0.01){camera.near=nr;camera.updateProjectionMatrix()}
}
var fsC=new THREE.Vector3();
/* Schattenbereich: beim Gehen und Fliegen dieselbe Reichweite (Grundwert QP.shR je Qualität, mit der Höhe über Boden grösser),
   vor die Kamera geschoben; im Gebäude kleiner und dafür schärfer; im Film um die Figur, sonst um den Drehpunkt */
function fitShadow(){var c,R,B=QP.shR;
  if(FILM.on){c=FILM.focus;R=B*1.2}
  else if(fly&&inside(fp)){c=fp;R=clamp(B*0.6,26,64)}
  else if(fly){var hg=Math.max(0,fp.y-hB(fp.x,fp.z)-1.65);R=clamp(B+hg*1.1,B,B*2.6);var cp=Math.cos(fpitch);fsC.set(fp.x-Math.sin(fyaw)*R*0.5*cp,0,fp.z-Math.cos(fyaw)*R*0.5*cp);c=fsC}
  else{c=tgt;R=B*(r>160?1.7:1)}
  R=Math.round(R/4)*4;var sc=sun.shadow.camera,tx=Math.round(c.x/2)*2,tz=Math.round(c.z/2)*2,sd=Math.max(320,R*1.2);
  sun.target.position.set(tx,0,tz);sun.position.set(tx+svB.x*sd,svB.y*sd,tz+svB.z*sd);sun.target.updateMatrixWorld();
  /* Versatz gegen Schattenakne wächst mit der Texelgrösse (grösserer Bereich = gröbere Schattenkarte) */
  if(sc.right!==R){sc.left=-R;sc.right=R;sc.top=R;sc.bottom=-R;sc.near=20;sc.far=sd+R*1.5;sc.updateProjectionMatrix();sun.shadow.normalBias=clamp(1.6*R/QP.sh,0.02,0.12)}}
function inside(p){return p.x>CX0-0.1&&p.x<W/2&&p.z>-TOT/2&&p.z<TOT/2&&p.y<6.9&&(p.x>-W/2||p.z>CZ0)}
/* neu zeichnen, wenn sich etwas ändert; Wind läuft nur 20 s nach der letzten Änderung, danach ruht die Grafikkarte */
var lastAct=0,animT=0,waterT=0,slowWind=false,slowN=0,aAcc=0,aN=0,lastAnim=0,afterR=[];
/* Wind und Wolken (Einstellung im Menü, gemerkt im Browser): Stärke 0 = aus; ohne Bedienung läuft der Wind 2 Minuten
   (Telefon 40 s) weiter, dann ruht die Grafikkarte */
var windLvl=QP.wind?1:0,cloudsOn=qName!=='niedrig',waterOn=!DEV.rm&&qName!=='niedrig',IDLE=DEV.phone?40000:120000;
(function(){var w=lsGet('lcWind'),c=lsGet('lcCloud'),f=lsGet('lcWater');if(w!==''&&!isNaN(+w))windLvl=+w;if(c)cloudsOn=c==='1';if(f)waterOn=f==='1'})();
function windApply(){U.uWind.value.x=windLvl;U.uCloud.value.x=cloudsOn?1:0;intLUpd()}
/* Wolkenmuster wie im Shader (cloudV, 4 Oktaven): Schatten am Bau; drinnen wird es dann dunkler, ohne Schatten (diffuses Licht) */
function cloudB(){var c=U.uCloud.value;if(c.x<=0)return 1;var sb=U.uSunB.value,f=CLH/Math.max(sb.y,0.08),px=sb.x*f,pz=sb.z*f;
  return 1-c.x*0.62*sstep(c.w,c.w+0.07,cloudAt(px*CT+pz*ST,-px*ST+pz*CT))}
/* Innenhelligkeit: Himmelsanteil plus Sonnenanteil, den die Platten des Lichtgadens streuen; ziehen Wolken vor die Sonne, wird es drinnen dunkler */
var INTL={b:0,s:0},INT_SUN=3.0;
function intLUpd(){U.uIntL.value.setRGB(1.0,0.92,0.80).multiplyScalar(INTL.b+INTL.s*cloudB())}
windApply();
function draw(){needs=true;lastAct=performance.now()}
function onRendered(f){afterR.push(f);needs=true}
function render(t){
  place();fitShadow();if(grassG.visible)grassUpd();treesUpd();
  U.uTime.value=animT;U.uWT.value=waterT;
  var cl=clear?1:0;U.uClear.value=cl;
  clearMats.forEach(function(c){if(c.transparent!==!!cl){c.transparent=!!cl;c.depthWrite=!cl;c.needsUpdate=true}c.opacity=cl?0.16:1});
  var inB=fly&&inside(camera.position);dimG.visible=dims&&!walk&&!FILM.on&&!inB;
  if(sky)sky.position.copy(camera.position);
  if(cloudM){cloudM.visible=cloudsOn&&camera.position.y<CLH-150;cloudM.position.x=camera.position.x;cloudM.position.z=camera.position.z}
  var tin=(fly&&inside(camera.position))?1.8:1;expoT=expoBase*tin;expo+=(expoT-expo)*(fly?0.08:1);
  if(finPass)finPass.uniforms.exposure.value=expo;else renderer.toneMappingExposure=expo;
  renderer.info.reset();var rt0=performance.now();
  if(composer)composer.render();else renderer.render(scene,camera);
  if(nRend<6){nRend++;logPush('zeit','Bild '+nRend+' gerendert in '+(performance.now()-rt0).toFixed(0)+' ms')}
  if(DIAG&&glChk<900){glChk++;var ge=gl.getError();if(ge)logPush('glError','0x'+ge.toString(16)+' nach Bild '+glChk)}
  var w=stage.clientWidth,h=stage.clientHeight,v=new THREE.Vector3();
  /* Beschriftungen: überdeckt eine Marke eine bereits gesetzte, wird sie ausgeblendet (wichtig auf schmalen Bildschirmen) */
  var placed=[];
  tags.forEach(function(tg,i){var el=tagEls[i];if(!el)return;v.copy(tg.p).project(camera);var hide=v.z>1||(tg.m&&!dims)||(fly?camera.position.distanceTo(tg.p)>260:r>260)||walk||FILM.on||inB;
    if(!hide){var x=(v.x*0.5+0.5)*w,y=(-v.y*0.5+0.5)*h;if(el.hidden)el.hidden=false;if(!tg.bw){tg.bw=el.offsetWidth||90;tg.bh=el.offsetHeight||20}
      if(tg.bw+8<w)x=Math.max(tg.bw/2+4,Math.min(w-tg.bw/2-4,x));
      var a0=x-tg.bw/2-3,a1=x+tg.bw/2+3,b0=y-tg.bh/2-2,b1=y+tg.bh/2+2;for(var q=0;q<placed.length;q++){var P=placed[q];if(a0<P[2]&&a1>P[0]&&b0<P[3]&&b1>P[1]){hide=true;break}}
      if(!hide){placed.push([a0,b0,a1,b1]);el.style.left=x+'px';el.style.top=y+'px'}}
    el.hidden=hide});
  /* Orts-Beschriftungen ebenfalls ohne Überdeckung; „La Congiunta“ hat Vorrang */
  var eo=envTags.map(function(tg,i){return i}).sort(function(a2,b2){return (envTags[b2].film===2?1:0)-(envTags[a2].film===2?1:0)});
  eo.forEach(function(i){var tg=envTags[i];v.copy(tg.p).project(camera);var el=envTagEls[i];var hide=v.z>1||Math.abs(v.x)>1.05||Math.abs(v.y)>1.05||(FILM.on?(!tg.film||FILM.t>=FMT.arrive-1):(r<130||fly||tg.film===2));
    if(!hide){var x=(v.x*0.5+0.5)*w,y=(-v.y*0.5+0.5)*h-12;if(el.hidden)el.hidden=false;if(!tg.bw){tg.bw=el.offsetWidth||90;tg.bh=el.offsetHeight||20}
      /* am Bildrand ganz lesbar halten (schmale Bildschirme) */
      if(tg.bw+8<w)x=Math.max(tg.bw/2+4,Math.min(w-tg.bw/2-4,x));
      var a0=x-tg.bw/2-3,a1=x+tg.bw/2+3,b0=y-tg.bh/2-2,b1=y+tg.bh/2+2;for(var q=0;q<placed.length;q++){var P=placed[q];if(a0<P[2]&&a1>P[0]&&b0<P[3]&&b1>P[1]){hide=true;break}}
      if(!hide){placed.push([a0,b0,a1,b1]);el.style.left=x+'px';el.style.top=y+'px'}}
    el.hidden=hide});
  var dir=new THREE.Vector3();camera.getWorldDirection(dir);var yaw=Math.atan2(dir.x,dir.z),ny=Math.atan2(NORTH[0],NORTH[1]);
  if(needle)needle.style.transform='rotate('+((yaw-ny)*180/Math.PI)+'deg)';
}
var nRend=0,glChk=0,fpsAcc=0,fpsN=0,fpsNow=0,fpsLast=0;
function frame(t){requestAnimationFrame(frame);if(document.hidden)return;
  var dt=Math.min(0.05,(t-last)/1000);last=t;
  if(fly){if(walk)walkStep(dt);else flyStep(dt)}
  /* Animation läuft für Wind oder fließendes Wasser (der Fluss strömt auch bei Windstille) */
  var windOn=(windLvl>0||(waterOn&&!!river))&&!slowWind&&!cardOpen&&(t-lastAct<IDLE);
  var anim=windOn&&(t-lastR>38),fplay=FILM.on&&!FILM.paused;
  if(FILM.on){var fdt=FILM.lt?Math.min(0.1,(t-FILM.lt)/1000):0;FILM.lt=t;FILM.pdt=fdt;if(fplay)fmTick(fdt)}
  if(!needs&&!anim&&!fly&&!fplay)return;
  if(windOn){var adt=Math.min(0.06,(t-lastR)/1000),cs=10*windLvl+3;animT+=adt;if(waterOn)waterT+=adt;U.uWind.value.w=0.62+0.10*Math.sin(animT*0.19)+0.06*Math.sin(animT*0.53+1.0);U.uCloud.value.y-=U.uWind.value.y*cs*adt;U.uCloud.value.z-=U.uWind.value.z*cs*adt;if(cloudsOn&&INTL.s>0)intLUpd()}
  var inter=needs||fly||fplay;needs=false;lastR=t;render(t);prTick(t,inter);
  /* zu langsame Grafik: Windanimation abschalten, damit die Seite bedienbar bleibt */
  if(anim&&!document.hidden){if(lastAnim&&t-lastAnim<250){aAcc+=t-lastAnim;aN++;if(aN>=30){if(aAcc/aN>115){slowN++;if(slowN>=2){slowWind=true;logPush('zeit','Windanimation aus (Bildabstand '+(aAcc/aN).toFixed(0)+' ms)')}}else slowN=0;aAcc=0;aN=0}}lastAnim=t}else lastAnim=0;
  if(fpsLast&&t-fpsLast<1000){fpsAcc+=t-fpsLast;fpsN++;if(fpsN>=20){fpsNow=1000*fpsN/fpsAcc;fpsAcc=0;fpsN=0}}fpsLast=t;
  if(afterR.length){var cb=afterR;afterR=[];cb.forEach(function(f){try{f()}catch(e){console.error(e)}})}}
/* Auflösung automatisch anpassen: ruckelt die Darstellung bei Bewegung, sinkt das Pixelverhältnis; mit Reserve steigt es wieder.
   Ist sie auch dann noch sehr langsam, wird beim nächsten Besuch eine Stufe tiefer begonnen (nur bei automatischer Qualität). */
var prOn=false,prAcc=0,prN=0,prPrev=0,prChg=0,prFlip=0,prDir=0,prSlow=0,tipEl=null;
function prTick(t,inter){if(!prOn||!inter||document.hidden){prPrev=0;return}
  if(prPrev&&t-prPrev<250){prAcc+=t-prPrev;prN++}prPrev=t;if(prN<36)return;
  var avg=prAcc/prN;prAcc=0;prN=0;if(t-prChg<1500)return;
  var hi=prHi(),nv=prCur;
  if(avg>36&&prCur>QP.prMin+0.01)nv=Math.max(QP.prMin,prCur*0.84);
  else if(avg<19.5&&prCur<hi-0.01&&prFlip<4)nv=Math.min(hi,prCur*1.12);
  if(nv!==prCur){var d=nv<prCur?-1:1;if(prDir&&d!==prDir)prFlip++;prDir=d;prCur=nv;prChg=t;resize();logPush('zeit','Pixelverhältnis '+prCur.toFixed(2)+' (Bildabstand '+avg.toFixed(0)+' ms)')}
  if(avg>70&&prCur<=QP.prMin+0.01){if(++prSlow>=2&&qAuto&&qName!=='niedrig'&&!tipEl)slowTip()}else prSlow=0}
function slowTip(){var lo=QL[QL.indexOf(qName)-1];lsSet('lcAutoCap',lo);
  tipEl=document.createElement('div');tipEl.className='tip';tipEl.setAttribute('role','status');
  tipEl.innerHTML='Die Darstellung ist auf diesem Gerät langsam. Beim nächsten Laden startet automatisch die Qualität „'+lo+'“. <button type="button">Jetzt wechseln</button> <button type="button" aria-label="Hinweis schließen">×</button>';
  var bb=tipEl.querySelectorAll('button');bb[0].addEventListener('click',function(){try{location.reload()}catch(e){}});bb[1].addEventListener('click',function(){tipEl.hidden=true});
  tipEl.addEventListener('pointerdown',function(e){e.stopPropagation()});stage.appendChild(tipEl)}
function resize(){var w=stage.clientWidth,h=stage.clientHeight;if(!w||!h)return;var hi=prHi();if(prCur>hi||!prOn)prCur=hi;if(Math.abs(renderer.getPixelRatio()-prCur)>0.001)renderer.setPixelRatio(prCur);renderer.setSize(w,h,false);if(composer){composer.setPixelRatio(renderer.getPixelRatio());composer.setSize(w,h)}
  /* Hochformat (Handy): Blickwinkel vergrößern, damit das lange Gebäude ins Bild passt */
  if(FILM)FILM.capY=null;
  var asp=w/h;camera.fov=asp<1?Math.min(62,2*Math.atan(Math.tan(20*Math.PI/180)/Math.pow(asp,0.6))*180/Math.PI):40;camera.aspect=asp;camera.updateProjectionMatrix();draw()}
window.addEventListener('resize',resize);
