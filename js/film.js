/* La Congiunta 3D – Film: Schlüssel in der Osteria holen, dann zu Fuss zum Museum */
'use strict';
/* ---------- Film: Schlüssel in der Osteria holen, dann zu Fuß zum Museum ----------
   Weg nach der Beschreibung der Stiftung [2]: Schlüssel in der Osteria im Dorfzentrum (Via San Gottardo 37 [3]),
   über zwei alte Steinbrücken über den Ticino, talaufwärts zum Bau. Linienführung aus OpenStreetMap [8]
   (Gebäude, Brücken, Feldweg), zwischen den Häusern ausgewichen – im Modell angenähert. Koordinaten: Welt (x Ost, z Süd). */
var FMR=[[452,370,0],[450,368,0],[447,367,0],[436,367,0],[433,369,0],[427,369,0],[421,370,0],[393,381,0],[386,386,0],[384,386,1],[351,390,1],[349,390,0],[344,386,0],[340,386,0],[336,382,0],[313,372,0],[309,368,0],[303,367,0],[300,361.5,2],[297,362.5,2],[274,378.5,2],[260,356,0],[161,257,0],[152,253,0],[129,253,0],[118,242,0],[115.5,237.5,0],[112.5,233.5,0],[100,221.5,0],[98,219,0],[83,177,0],[77,164,0],[71,155.5,0],[52.5,108,0],[11,71,0],[1.5,52,0],[-24,-11,0],[-27.2,-21,0],[-22.5,-21.7,0],[-17.4,-22.1,0],[-12.3,-21.5,0],[-8.4,-21.4,0]];
var FMB={1:[[384,386],[351,390]],2:[[274,378.5],[297,362.5],[300,361.5]]};
/* Zeitplan in Sekunden: Überblick, Osteria, Weg (Zeitraffer), Ankunft, Ende */
var FMT={ost:6,key:11,walk:15,walkEnd:72,arrive:72,end:82};
var FILM={on:false,t:0,paused:false,lt:0,snap:true,chap:-1,focus:new THREE.Vector3(),save:null,ph:0},fmS=null,fmL=0,fmG=null,fmW=null,fmKey=null,fmPin=null,fmRib=null,fmSeg=0,fmB={};
var fmRN=null,FMU={uRT:{value:0},uWS:{value:0}};
/* Breite der Routenlinie wächst mit dem Abstand zur Kamera, damit sie auch aus der Luft zu sehen ist */
function fmRibUpd(){var a=fmRib.geometry.attributes.position,A=a.array,cx=fmCam.x,cy=fmCam.y,cz=fmCam.z;
  for(var i=0;i<fmS.length;i++){var p=fmS[i],n=fmRN[i],d=Math.sqrt((p.x-cx)*(p.x-cx)+(p.y-cy)*(p.y-cy)+(p.z-cz)*(p.z-cz)),hw=clamp(0.9+d*d*0.00002,0.9,8),y=n[2]+d*0.0015,o=i*6;
    A[o]=p.x+n[0]*hw;A[o+1]=y;A[o+2]=p.z+n[1]*hw;A[o+3]=p.x-n[0]*hw;A[o+4]=y;A[o+5]=p.z-n[1]*hw}
  a.needsUpdate=true}
var fmCam=new THREE.Vector3(),fmLook=new THREE.Vector3(),fmV=new THREE.Vector3(),fmV2=new THREE.Vector3();
/* Höhe auf der tatsächlich gezeichneten Geländefläche (gleiche Dreiecke wie das Geländenetz) */
function hT(x,z){if(!TERR)return hW(x,z);var ax=TERR.ax,N=TERR.N;
  function ix(v){var lo=0,hi=N;while(hi-lo>1){var m=(lo+hi)>>1;if(ax[m]<=v)lo=m;else hi=m}return lo}
  var i=ix(x),j=ix(z),fx=(x-ax[i])/(ax[i+1]-ax[i]),fz=(z-ax[j])/(ax[j+1]-ax[j]);
  var ha=hW(ax[i],ax[j]),hb=hW(ax[i+1],ax[j]),hc=hW(ax[i],ax[j+1]),hd=hW(ax[i+1],ax[j+1]);
  return fx+fz<=1?ha+(hb-ha)*fx+(hc-ha)*fz:hd+(hc-hd)*(1-fx)+(hb-hd)*(1-fz)}
function fmDeck(B,x,z){var tot=0,cum=[0],i;for(i=1;i<B.length;i++){tot+=Math.hypot(B[i][0]-B[i-1][0],B[i][1]-B[i-1][1]);cum.push(tot)}
  var best=1e9,f=0;for(i=1;i<B.length;i++){var ax=B[i-1][0],az=B[i-1][1],vx=B[i][0]-ax,vz=B[i][1]-az,l=vx*vx+vz*vz,t=clamp(((x-ax)*vx+(z-az)*vz)/l,0,1),qx=ax+vx*t-x,qz=az+vz*t-z,d=qx*qx+qz*qz;
    if(d<best){best=d;f=(cum[i-1]+t*Math.sqrt(l))/tot}}
  /* gleiche Wölbung wie die Steinbrücken im Modell */
  var ya=hW(B[0][0],B[0][1]),yb=hW(B[B.length-1][0],B[B.length-1][1]);return ya+(yb-ya)*f+0.35+Math.min(2.2,tot*0.08)*Math.sin(Math.PI*f)}
function fmBuild(){if(fmS)return;
  /* Route im Meterabstand abtasten, Höhe vom Gelände bzw. von der Brückenfahrbahn, in Szenenkoordinaten umrechnen */
  var P=[],i,k;
  for(i=0;i<FMR.length-1;i++){var a=FMR[i],b=FMR[i+1],l=Math.hypot(b[0]-a[0],b[1]-a[1]),n=Math.max(1,Math.ceil(l));
    for(k=0;k<n;k++){var t=k/n,br=(a[2]&&a[2]===b[2])?a[2]:0;P.push([a[0]+(b[0]-a[0])*t,a[1]+(b[1]-a[1])*t,br])}}
  var e=FMR[FMR.length-1];P.push([e[0],e[1],0]);
  var ys=P.map(function(p){return p[2]?fmDeck(FMB[p[2]],p[0],p[1]):hT(p[0],p[1])});
  var ys2=ys.map(function(y,i){var s=0,w=0;for(var k=-2;k<=2;k++){var j=i+k;if(j<0||j>=ys.length)continue;var q=(P[j][2]===P[i][2])?1:0.6;s+=ys[j]*q;w+=q}return P[i][2]?y:s/w});
  fmS=[];var acc=0;
  P.forEach(function(p,i){var b=w2b(p[0],p[1]);if(i){var q=fmS[i-1];acc+=Math.hypot(b[0]-q.x,b[1]-q.z)}fmS.push({x:b[0],y:ys2[i],z:b[1],s:acc,br:p[2],wx:p[0],wz:p[1]})});
  fmL=acc;
  /* Abschnitte für Bildführung und Texte: erste Brücke, Ende der zweiten Brücke */
  var b1=-1,b2=-1;fmS.forEach(function(p){if(p.br===1&&b1<0)b1=p.s;if(p.br===2)b2=p.s});fmB={b1:b1,b2:b2};
  /* Linie der Route: Band knapp über Boden bzw. Brücke; wird beim Überblick nach und nach gezeichnet */
  var pts=fmS.map(function(p){return [p.x,p.z]}),yy=fmS.map(function(p){return p.y+(p.br?0.07:0.16)});
  var rm=new THREE.MeshBasicMaterial({color:0xffb347,transparent:true,opacity:0.9,depthWrite:false,side:THREE.DoubleSide,toneMapped:false,polygonOffset:true,polygonOffsetFactor:-6,polygonOffsetUnits:-6});
  /* Band mit weichen Rändern und hellem Kern; vor der Figur wandernde Striche, hinter ihr (schon gegangen) blasser.
     aR = (quer −1…1, Meter entlang der Route) */
  rm.onBeforeCompile=function(sh){sh.uniforms.uRT=FMU.uRT;sh.uniforms.uWS=FMU.uWS;
    sh.vertexShader=sh.vertexShader.replace('#include <common>','#include <common>\nattribute vec2 aR;\nvarying vec2 vR;\nvarying vec3 vRW;')
      .replace('#include <begin_vertex>','#include <begin_vertex>\nvR=aR;vRW=(modelMatrix*vec4(position,1.0)).xyz;');
    sh.fragmentShader=sh.fragmentShader.replace('#include <common>','#include <common>\nuniform float uRT,uWS;\nvarying vec2 vR;\nvarying vec3 vRW;')
      .replace('#include <color_fragment>','#include <color_fragment>\n{float ax=abs(vR.x),cd=distance(cameraPosition,vRW),ph=fract((vR.y-uRT*5.0)/(7.0+cd*0.05));\n'+
        'float dash=mix(1.0,smoothstep(0.0,0.07,ph)*(1.0-smoothstep(0.55,0.62,ph)),0.65*(1.0-smoothstep(110.0,240.0,cd)));\n'+
        'float ah=step(uWS,vR.y);diffuseColor.rgb=mix(vec3(1.0,0.66,0.26),vec3(1.0,0.95,0.84),(1.0-smoothstep(0.0,0.55,ax))*0.75);\n'+
        'diffuseColor.a*=(1.0-smoothstep(0.45,1.0,ax))*mix(0.42,mix(0.4,1.0,dash),ah);}')};
  fmRib=new THREE.Mesh(ribbonG(pts,yy,3.2,0),rm);fmRib.frustumCulled=false;fmRib.renderOrder=3;fmSeg=pts.length-1;
  var ar=new Float32Array(pts.length*4);fmS.forEach(function(p,i){ar[i*4]=1;ar[i*4+1]=p.s;ar[i*4+2]=-1;ar[i*4+3]=p.s});fmRib.geometry.setAttribute('aR',new THREE.BufferAttribute(ar,2));
  fmRN=pts.map(function(p,i){var d=dirAt(pts,i);return [-d[1],d[0],yy[i]]});
  /* Besucherin oder Besucher (1,75 m) */
  function sm(c,ro,me){return patch(new THREE.MeshStandardMaterial({color:c,roughness:ro,metalness:me||0}),{})}
  var jk=sm(0xb8352b,0.7),tr=sm(0x2c3340,0.85),sk=sm(0xd7ad88,0.6);
  fmW=new THREE.Group();
  var body=new THREE.Mesh(new THREE.CylinderGeometry(0.19,0.23,0.74,12),jk);body.position.y=1.17;
  var head=new THREE.Mesh(new THREE.SphereGeometry(0.115,14,10),sk);head.position.y=1.66;
  var lg=new THREE.CylinderGeometry(0.075,0.065,0.82,8).translate(0,-0.41,0),legL=new THREE.Mesh(lg,tr),legR=new THREE.Mesh(lg,tr);legL.position.set(-0.1,0.82,0);legR.position.set(0.1,0.82,0);
  var ag=new THREE.CylinderGeometry(0.05,0.045,0.62,8).translate(0,-0.31,0),armL=new THREE.Mesh(ag,jk),armR=new THREE.Mesh(ag,jk);armL.position.set(-0.25,1.5,0);armR.position.set(0.25,1.5,0);
  [body,head,legL,legR,armL,armR].forEach(function(m){m.castShadow=true;fmW.add(m)});fmW.userData={legL:legL,legR:legR,armL:armL,armR:armR};
  /* Markierung über der Figur, wächst mit dem Abstand der Kamera; immer obenauf, auch wenn Laub die Figur verdeckt.
     Weiss, damit sie sich von der orangen Routenlinie abhebt */
  fmPin=new THREE.Mesh(new THREE.ConeGeometry(0.5,1.3,18).rotateX(Math.PI),new THREE.MeshBasicMaterial({color:0xfff6e6,toneMapped:false,depthTest:false,depthWrite:false,transparent:true}));fmPin.renderOrder=20;
  /* Schlüssel aus Messing */
  var gold=patch(new THREE.MeshStandardMaterial({color:0xd9aa4a,metalness:1,roughness:0.3,emissive:0x8a5a10,emissiveIntensity:0.9}),{});
  fmKey=new THREE.Group();
  var bow=new THREE.Mesh(new THREE.TorusGeometry(0.2,0.055,10,28),gold),shaft=new THREE.Mesh(new THREE.BoxGeometry(0.62,0.07,0.06),gold),bit1=new THREE.Mesh(new THREE.BoxGeometry(0.07,0.17,0.06),gold),bit2=new THREE.Mesh(new THREE.BoxGeometry(0.07,0.12,0.06),gold);
  shaft.position.x=0.5;bit1.position.set(0.68,-0.11,0);bit2.position.set(0.56,-0.085,0);fmKey.add(bow,shaft,bit1,bit2);
  fmKey.children.forEach(function(m){m.castShadow=true});
  fmG=new THREE.Group();fmG.add(fmRib,fmW,fmPin,fmKey);fmG.visible=false;scene.add(fmG)}
function fmAt(s,out){s=clamp(s,0,fmL);var lo=0,hi=fmS.length-1;while(hi-lo>1){var m=(lo+hi)>>1;if(fmS[m].s<=s)lo=m;else hi=m}
  var a=fmS[lo],b=fmS[hi],t=(b.s>a.s)?(s-a.s)/(b.s-a.s):0;return out.set(a.x+(b.x-a.x)*t,a.y+(b.y-a.y)*t,a.z+(b.z-a.z)*t)}
var fmTA=new THREE.Vector3(),fmTB=new THREE.Vector3(),fmTC=new THREE.Vector3(),fmTD=new THREE.Vector3(),fmPC=new THREE.PerspectiveCamera(40,1,0.3,22000);
function fmDir(s,back,ahead,out){fmAt(s-back,fmTA);fmAt(s+ahead,fmTB);out.set(fmTB.x-fmTA.x,0,fmTB.z-fmTA.z);if(out.lengthSq()<1e-6)out.set(0,0,1);return out.normalize()}
/* Oberkante der Untertitel als Bildschirmkoordinate (-1 unten … 1 oben), etwas Luft für die Figur */
function fmCapY(){var cap=document.getElementById('filmCap'),sr=stage.getBoundingClientRect(),cr=cap&&cap.getBoundingClientRect();
  FILM.capY=(cr&&sr.height>0&&cr.height>0)?clamp(1-2*(cr.top-sr.top)/sr.height+0.08,-0.8,0.1):-0.6}
/* Figur im Bild halten: verschwände sie hinter den Untertiteln oder am Rand (vor allem im Hochformat),
   wird der Blickpunkt so wenig wie nötig zu ihr gezogen (Halbierungssuche, damit die Kamera ruhig bleibt) */
function fmIn(des,look,W,f){fmTD.copy(look).lerp(W,f);fmPC.position.copy(des);fmPC.lookAt(fmTD);fmPC.updateMatrixWorld(true);
  var p=fmTC.copy(W).project(fmPC);return p.z<1&&p.y>FILM.capY&&p.y<0.6&&Math.abs(p.x)<0.65}
function fmKeep(des,look,W){fmPC.fov=camera.fov;fmPC.aspect=camera.aspect;fmPC.updateProjectionMatrix();if(fmIn(des,look,W,0))return;
  var lo=0,hi=1;for(var k=0;k<7;k++){var m=(lo+hi)/2;if(fmIn(des,look,W,m))hi=m;else lo=m}look.lerp(W,hi)}
/* gleichmässiges Gehen mit kurzem Anlaufen und Abbremsen */
function fmEase(u,a){u=clamp(u,0,1);var v=1/(1-a);if(u<a)return v*u*u/(2*a);if(u>1-a)return 1-v*(1-u)*(1-u)/(2*a);return v*(u-a/2)}
function fmSAt(t){if(t<=FMT.walk)return 0;if(t>=FMT.walkEnd)return fmL;return fmL*fmEase((t-FMT.walk)/(FMT.walkEnd-FMT.walk),0.05)}
function fmTimeOfS(s){var lo=FMT.walk,hi=FMT.walkEnd;for(var i=0;i<40;i++){var m=(lo+hi)/2;if(fmSAt(m)<s)lo=m;else hi=m}return (lo+hi)/2}
function sm01(x){x=clamp(x,0,1);return x*x*(3-2*x)}
function fmW2S(x,y,z,out){var b=w2b(x,z);return out.set(b[0],y,b[1])}
/* Kapitel: Titel, Text, Startzeit */
function fmChapters(){var m=Math.round(fmL/10)*10,min=Math.max(1,Math.round(fmL/75));
  return [{t:0,h:'Film · Schlüssel holen und Weg zum Museum',x:'Für den Besuch holt man den Schlüssel in der Osteria im Dorfzentrum von Giornico, direkt an der Hauptstraße.'},
    {t:FMT.ost,h:'1 · Schlüssel abholen',x:'Osteria Giornico, Via San Gottardo 37. Täglich geöffnet: Sommerzeit 8–20 Uhr, Winterzeit 8–18 Uhr.'},
    {t:FMT.walk,h:'2 · Zu Fuß zum Ticino',x:'Den kurzen Weg macht man am besten zu Fuß: vom Dorfzentrum hinunter zum Fluss (im Film im Zeitraffer).'},
    {t:fmTimeOfS(fmB.b1-12),h:'3 · Zwei alte Steinbrücken',x:'Zwei alte Steinbrücken führen über den Ticino, dazwischen liegt eine kleine Insel mit dem Grotto dei Due Ponti.'},
    {t:fmTimeOfS(fmB.b2+20),h:'4 · Talaufwärts',x:'Am anderen Ufer geht es talaufwärts, zwischen Fluss und Bahnlinie. Als Wegmarke nennt die Stiftung die frühromanische Kirche San Nicolao; sie steht etwas südlich der Brücken.'},
    {t:fmTimeOfS(fmL-250),h:'5 · Ankunft',x:'Von weitem sieht man den fensterlosen, hohen Betonbau mit seinem Lichtgaden. Der Eingang liegt an der Nordseite.'},
    {t:FMT.arrive,h:'Angekommen',x:'Weg im Modell rund '+m+' m, zu Fuß etwa '+min+' Minuten. Route nach OpenStreetMap, im Modell angenähert. Quellen: [1] Pireddu, [2] Stiftung La Congiunta, [3] Ticino Turismo, [8] OpenStreetMap.',end:1}]}
var fmUI=null,fmCH=[];
function fmBuildUI(){if(fmUI)return;
  fmUI=document.getElementById('filmUI');fmCH=fmChapters();
  var tr=document.getElementById('filmTrack');tr.setAttribute('aria-valuemin','0');tr.setAttribute('aria-valuemax',String(FMT.end));fmCH.forEach(function(c,i){if(!i)return;var e=document.createElement('span');e.className='tick';e.style.left=(100*c.t/FMT.end)+'%';tr.appendChild(e)});
  function seekEv(e){var r=tr.getBoundingClientRect();if(!r.width)return;fmSeek(clamp((e.clientX-r.left)/r.width,0,1)*FMT.end)}
  tr.addEventListener('pointerdown',function(e){e.stopPropagation();tr.setPointerCapture(e.pointerId);seekEv(e);tr.onpointermove=seekEv});
  tr.addEventListener('pointerup',function(){tr.onpointermove=null});
  tr.addEventListener('keydown',function(e){if(e.key==='ArrowRight'){fmSeek(FILM.t+5);e.preventDefault();e.stopPropagation()}else if(e.key==='ArrowLeft'){fmSeek(FILM.t-5);e.preventDefault();e.stopPropagation()}});
  document.getElementById('filmPlay').addEventListener('click',function(){fmPause(!FILM.paused)});
  document.getElementById('filmClose').addEventListener('click',function(){stopFilm()});
  fmUI.addEventListener('pointerdown',function(e){e.stopPropagation()});
  fmUI.addEventListener('wheel',function(e){e.stopPropagation()},{passive:true})}
function fmPause(p){if(FILM.t>=FMT.end&&!p){fmSeek(0)}FILM.paused=p;var b=document.getElementById('filmPlay');b.textContent=p?'▶':'❚❚';b.setAttribute('aria-label',p?'Abspielen':'Pause');FILM.lt=0;draw()}
function fmSeek(t){FILM.t=clamp(t,0,FMT.end);FILM.snap=true;if(FILM.t<FMT.end&&FILM.chap===fmCH.length-1)FILM.chap=-1;draw()}
function startFilm(){fmBuild();fmBuildUI();if(fly)stopFly();closeCard();setOpen&&setOpen(false);
  if(!FILM.save)FILM.save={th:th,ph:ph,r:r,tgt:tgt.clone(),clear:clear,time:timeR.value,pressed:[].map.call(btns,function(b){return b.getAttribute('aria-pressed')})};
  /* nachts gäbe es nichts zu sehen: dann Vormittagslicht */
  if(sunEl<0.1){timeR.value='10.5';applySun()}
  clear=false;FILM.on=true;FILM.t=0;FILM.paused=false;FILM.snap=true;FILM.chap=-1;FILM.sec=-1;FILM.lt=0;fmG.visible=true;fmUI.hidden=false;stage.classList.add('filming');
  var fb=document.getElementById('filmBtn');if(fb)fb.setAttribute('aria-pressed','true');setPressed(null);fmPause(false);logPush('zeit','Film gestartet ('+Math.round(fmL)+' m Weg)');draw()}
function stopFilm(keepView){if(!FILM.on)return;var ae=document.activeElement,lost=!ae||ae===document.body||fmUI.contains(ae);
  FILM.on=false;U.uNearCut.value=0;U.uFocusR.value=0;fmG.visible=false;fmUI.hidden=true;stage.classList.remove('filming');
  var fb=document.getElementById('filmBtn');if(fb)fb.setAttribute('aria-pressed','false');
  /* Tastaturfokus nicht im Leeren lassen: zurück auf den Film-Knopf */
  if(lost&&fb&&!keepView)fb.focus({preventScroll:true});
  var s=FILM.save;FILM.save=null;
  if(s){if(s.time!==timeR.value){timeR.value=s.time;applySun()}if(!keepView){th=s.th;ph=s.ph;r=s.r;tgt.copy(s.tgt);clear=s.clear;btns.forEach(function(b,i){b.setAttribute('aria-pressed',s.pressed[i])})}}
  draw()}
/* Kamera und Figuren für den Zeitpunkt t */
function fmTick(dt){FILM.t=Math.min(FMT.end,FILM.t+dt);if(FILM.t>=FMT.end&&!FILM.paused)fmPause(true)}
function fmPlace(dt){var t=FILM.t,s=fmSAt(t),W=fmAt(s,fmV),D=fmDir(s,6,14,fmV2),des=new THREE.Vector3(),look=new THREE.Vector3(),ost=fmS[0];
  if(t<FMT.ost){/* Überblick von Osten über das Dorf auf die ganze Route */
    var u=sm01(t/FMT.ost),ux=900+(540-900)*u,uz=330+(320-330)*u;fmW2S(ux,0,uz,des);des.y=hT(ux,uz)+320+(110-320)*u;
    fmW2S(250+(452-250)*u,0,220+(370-220)*u,look);look.y=ost.y+5*u}
  else if(t<FMT.walk){/* über der Osteria, steil von oben, damit Figur und Schlüssel zwischen den Dächern sichtbar bleiben */
    /* von Nordosten auf die Strassenseite der Osteria: das Haus steht hinter der Figur, nicht davor */
    var u2=sm01((t-FMT.ost)/(FMT.walk-FMT.ost));fmW2S(474+(462-474)*u2,0,330+(346-330)*u2,des);des.y=ost.y+48+(34-48)*u2;look.set(ost.x,ost.y+2,ost.z)}
  else if(t<FMT.arrive){/* Verfolgerkamera: über dem Weg, an den Brücken seitlich, zum Schluss höher mit Blick auf den Bau */
    /* im Dorf steil von oben (Dächer), an den Brücken seitlich, am Westufer über den Baumkronen */
    var wBr=sm01((s-(fmB.b1-30))/25)*(1-sm01((s-(fmB.b2+8))/30)),wApp=sm01((s-(fmL-260))/90),wV=1-sm01((s-(fmB.b1-45))/30);
    var bBack=12*wV+18*(1-wV),bUp=30,bSide=4;
    /* zum Schluss weiter hinter der Figur und flacher: so passen Figur (unten) und Bau (oben) auch ins Querformat;
       Laub auf der Sichtlinie wird ausgeblendet */
    var back=(bBack+(12-bBack)*wBr)*(1-wApp)+62*wApp,up=(bUp+(20-bUp)*wBr)*(1-wApp)+28*wApp,side=(bSide+(19-bSide)*wBr)*(1-wApp)+8*wApp;
    /* Kamerarichtung: sonst die Gehrichtung, auf den letzten Metern fest von Süden – so schwenkt sie beim Bogen zum Eingang nicht in den Wald */
    var C=fmTB.set(D.x*(1-wApp)-0.15*wApp,0,D.z*(1-wApp)-wApp).normalize();
    var ea=w2b(1,0),no=NORTH,px=-C.z,pz=C.x,qx=ea[0]*(1-wBr)+no[0]*wBr,qz=ea[1]*(1-wBr)+no[1]*wBr,dp=px*qx+pz*qz;
    des.set(W.x-C.x*back+px*dp*side,W.y+up,W.z-C.z*back+pz*dp*side);
    /* Blickpunkt knapp hinter und unter der Figur: sie steht im oberen Bilddrittel, über den Untertiteln */
    var dn=9*(1-wBr)+5*wBr;look.set(W.x+D.x*2,W.y+1.4-dn*(1-wApp),W.z+D.z*2);look.lerp(fmTA.set(0,6,0),wApp*0.55);
    if(FILM.capY==null)fmCapY();fmKeep(des,look,W)}
  else{/* Ankunft vor dem Eingang an der Nordseite */
    des.set(DOFF-7,hB(DOFF-7,-TOT/2-12)+2.4,-TOT/2-12);look.set(DOFF,2.1,-TOT/2)}
  var wg=b2w(des.x,des.z),gmin=hT(wg[0],wg[1])+2.5;if(des.y<gmin)des.y=gmin;
  if(FILM.snap||dt<=0){fmCam.copy(des);fmLook.copy(look);FILM.snap=false}
  else{var k1=1-Math.exp(-dt/0.55),k2=1-Math.exp(-dt/0.35);fmCam.lerp(des,k1);fmLook.lerp(look,k2)}
  var fol=t>=FMT.walk-1&&t<FMT.arrive;U.uNearCut.value=fol?9:0;U.uFocus.value.set(W.x,W.y+1.2,W.z);U.uFocusR.value=fol?4.5:0;
  camera.position.copy(fmCam);camera.lookAt(fmLook);fmRibUpd();FMU.uRT.value=FILM.t;FMU.uWS.value=(t>=FMT.walk&&t<FMT.arrive)?s:0;if(Math.abs(camera.near-0.3)>0.01){camera.near=0.3;camera.updateProjectionMatrix()}
  FILM.focus.copy(t<FMT.walk?fmTB.set(ost.x,ost.y,ost.z):W);
  /* Figur: erscheint an der Osteria, geht los, schaut am Ende zur Tür */
  fmW.visible=t>=FMT.ost-0.5;fmW.position.copy(W);
  var yaw=t>=FMT.walkEnd-0.6?Math.atan2(0,1):Math.atan2(D.x,D.z);if(t<FMT.walk)yaw=Math.atan2(fmCam.x-W.x,fmCam.z-W.z);fmW.rotation.y=yaw;
  var walking=t>FMT.walk&&t<FMT.walkEnd,ud=fmW.userData;FILM.ph+=walking?dt*9:0;var sw=walking?Math.sin(FILM.ph)*0.55:0;
  ud.legL.rotation.x=sw;ud.legR.rotation.x=-sw;ud.armL.rotation.x=-sw*0.7;ud.armR.rotation.x=sw*0.7;
  /* Markierung über der Figur */
  var dist=fmCam.distanceTo(W),kk=clamp(dist/20,1,12);fmW.scale.setScalar(clamp(dist/40,1,2.2));fmPin.visible=t>=FMT.key+1.4&&t<FMT.arrive;fmPin.scale.setScalar(kk);fmPin.position.set(W.x,W.y+2.2+kk*1.1+Math.sin(FILM.t*3)*0.12*kk,W.z);
  /* Schlüssel: schwebt über der Osteria, wandert zur Figur und verschwindet in der Tasche */
  var kp=clamp((t-FMT.key)/1.4,0,1);fmKey.visible=kp<1;
  if(fmKey.visible){var hov=fmTA.set(ost.x,ost.y+7+Math.sin(FILM.t*2)*0.3,ost.z),hand=fmTB.set(W.x,W.y+1.15,W.z);fmKey.position.copy(hov).lerp(hand,sm01(kp));
    fmKey.scale.setScalar(4+(0.45-4)*sm01(kp));fmKey.rotation.set(0,FILM.t*1.6,0.35)}
  document.getElementById('filmKey').hidden=kp<1;
  /* Route zeichnen */
  var rp=clamp((t-0.8)/4.7,0,1);fmRib.geometry.setDrawRange(0,6*Math.floor(fmSeg*rp));
  /* Kapitel, Fortschritt */
  var ci=0;for(var i=0;i<fmCH.length;i++)if(t>=fmCH[i].t-0.01)ci=i;
  if(ci!==FILM.chap){FILM.chap=ci;var c=fmCH[ci],cap=document.getElementById('filmCap');
    cap.innerHTML='<b>'+c.h+'</b><span>'+c.x+'</span>'+(c.end?'<span class="film-end"><button type="button" data-a="again">Nochmal</button><button type="button" data-a="walk">Rundgang starten</button><button type="button" data-a="close">Schließen</button></span>':'');
    cap.querySelectorAll('button').forEach(function(b){b.addEventListener('click',function(){var a=b.dataset.a;if(a==='again'){fmSeek(0);fmPause(false);document.getElementById('filmPlay').focus({preventScroll:true})}else if(a==='walk'){stopFilm(true);startWalk()}else stopFilm()})});
    cap.classList.remove('in');void cap.offsetWidth;cap.classList.add('in');FILM.capY=null}
  document.getElementById('filmFill').style.width=(100*t/FMT.end)+'%';
  /* Position für Bildschirmleser, nur bei jeder vollen Sekunde neu */
  var sec=Math.round(t);if(sec!==FILM.sec){FILM.sec=sec;var trk=document.getElementById('filmTrack');trk.setAttribute('aria-valuenow',String(sec));trk.setAttribute('aria-valuetext',fmMS(sec)+' von '+fmMS(FMT.end)+', '+fmCH[ci].h)}}
function fmMS(s){return Math.floor(s/60)+':'+('0'+(s%60)).slice(-2)}
