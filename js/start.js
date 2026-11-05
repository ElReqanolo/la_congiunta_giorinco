/* La Congiunta 3D – Aufbau in Stufen und Start */
'use strict';
/* ---------- Aufbau ---------- */
/* Feinstruktur für den Boden (512 × 512, bei „niedrig“ 256 × 256, kachelbar, im Gelände auf 4 m bzw. 3,2 m gelegt):
   R weiche Flecken, G Grasbüschel, B Kies und Steine (3–10 cm), A feine Körnung; G–A um 0,5 zentriert */
function detTex(){var N=qName==='niedrig'?256:512,a=new Uint8Array(N*N*4),r=mb32(17),F=[],k,i,j,q;
  for(k=0;k<14;k++)F.push([1+Math.floor(r()*9),Math.floor(r()*9)-4,r()*6.283,0.5/(1+k*0.35)*(k%2?1:0.8)]);
  /* sin(A+B) = sin A cos B + cos A sin B: Zeilen- und Spaltentabellen statt 3,7 Mio. Sinusaufrufen */
  var Su=[],Cu=[],St=[],Ct=[];for(k=0;k<14;k++){var su=new Float32Array(N),cu=new Float32Array(N),st=new Float32Array(N),ct=new Float32Array(N);
    for(i=0;i<N;i++){var A1=6.2832*F[k][0]*i/N,A2=6.2832*F[k][1]*i/N+F[k][2];su[i]=Math.sin(A1);cu[i]=Math.cos(A1);st[i]=Math.sin(A2);ct[i]=Math.cos(A2)}
    Su.push(su);Cu.push(cu);St.push(st);Ct.push(ct)}
  function vn(c,seed){var g=new Float32Array(c*c),rr=mb32(seed);for(var n=0;n<g.length;n++)g[n]=rr();var s=N/c,o=new Float32Array(N*N);
    for(var y=0;y<N;y++){var fy=y/s,y0=Math.floor(fy),ty=fy-y0,y1=(y0+1)%c;ty=ty*ty*(3-2*ty);
      for(var x=0;x<N;x++){var fx=x/s,x0=Math.floor(fx),tx=fx-x0,x1=(x0+1)%c;tx=tx*tx*(3-2*tx);
        o[y*N+x]=(g[y0*c+x0]*(1-tx)+g[y0*c+x1]*tx)*(1-ty)+(g[y1*c+x0]*(1-tx)+g[y1*c+x1]*tx)*ty}}return o}
  var n4=vn(N/4,3),n8=vn(N/8,5),n16=vn(N/16,7);
  /* Kies: Zellen (Worley), Steine hell mit dunklen Fugen, jede in eigener Helligkeit */
  var GC=N*3/32,cs=N/GC,P=new Float32Array(GC*GC*3),rg=mb32(13);for(k=0;k<GC*GC;k++){P[k*3]=((k%GC)+rg())*cs;P[k*3+1]=(Math.floor(k/GC)+rg())*cs;P[k*3+2]=rg()}
  var G=new Float32Array(N*N),K=new Float32Array(N*N),R=new Float32Array(N*N),m=[0,0,0];
  for(j=0;j<N;j++){var cy=Math.floor(j/cs);for(i=0;i<N;i++){var cx=Math.floor(i/cs),f1=1e9,f2=1e9,br=0;
    for(var dy=-1;dy<=1;dy++)for(var dx=-1;dx<=1;dx++){var gx=(cx+dx+GC)%GC,gy=(cy+dy+GC)%GC,pi=(gy*GC+gx)*3,px=P[pi]+(cx+dx-gx)*cs,py=P[pi+1]+(cy+dy-gy)*cs,dd=(px-i)*(px-i)+(py-j)*(py-j);
      if(dd<f1){f2=f1;f1=dd;br=P[pi+2]}else if(dd<f2)f2=dd}
    q=j*N+i;K[q]=Math.min(1,(Math.sqrt(f2)-Math.sqrt(f1))/(0.42*cs))*(0.55+0.45*br)*(0.8+0.4*n4[q]);
    G[q]=Math.pow(n16[q],1.6)*0.45+n8[q]*0.35+n4[q]*0.2;R[q]=n4[q]*0.6+rg()*0.4;m[0]+=G[q];m[1]+=K[q];m[2]+=R[q]}}
  for(k=0;k<3;k++)m[k]/=N*N;
  for(j=0;j<N;j++)for(i=0;i<N;i++){var v=0;for(k=0;k<14;k++)v+=(Su[k][i]*Ct[k][j]+Cu[k][i]*St[k][j])*F[k][3];q=j*N+i;var o=q*4;
    a[o]=clamp(128+v*60,0,255);a[o+1]=clamp(128+(G[q]-m[0])*420,0,255);a[o+2]=clamp(128+(K[q]-m[1])*210,0,255);a[o+3]=clamp(128+(R[q]-m[2])*300,0,255)}
  var t=new THREE.DataTexture(a,N,N,THREE.RGBAFormat);t.wrapS=t.wrapT=THREE.RepeatWrapping;t.generateMipmaps=true;t.minFilter=THREE.LinearMipmapLinearFilter;t.magFilter=THREE.LinearFilter;
  t.anisotropy=Math.min(8,maxAniso);t.needsUpdate=true;return t}
var IM={},MK=null,PREP=null;
function prep(t){if(!PREP){PREP=document.createElement('div');PREP.className='prep';PREP.setAttribute('role','status');stage.appendChild(PREP)}PREP.textContent=t;PREP.hidden=!t}
/* Start in Stufen: erst Gelände und Himmel, dann Gebäude, Bäume, Wiese, Dorf. Jede Stufe übersetzt nur wenige Shader,
   so bleibt die Seite auch auf schwächeren Grafikchips bedienbar */
var STG=[['Gelände',[]],['Gebäude',[bldG]],['Innenräume',[bldInt]],['Bäume in der Nähe',[vegN]],['Wald und Hänge',[vegM,vegF]],['Wiese und Reben',[grassG]],['Dorf, Bahn und Brücken',[vilG,infG]]];
if(QP.post)STG.push(['Leuchteffekte','post']);
STG.push(['Schilder für den Rundgang','compile']);
[bldG,bldInt,vegN,vegM,vegF,grassG,vilG,infG].forEach(function(g){g.visible=false});
var stageT0=0;
function reveal(k){if(k>=STG.length){prep('');prOn=true;if(FILM.pend){FILM.pend=false;applyHash()}logPush('zeit','Aufbau fertig nach '+((performance.now()-stageT0)/1000).toFixed(1)+' s');diagPanel();
  /* danach im Hintergrund die feinen Luftbilder entlang des Wegs */
  setTimeout(function(){try{hrStart()}catch(e){console.error(e)}},300);return}
  var st=STG[k],t0=performance.now();if(!k)stageT0=t0;
  try{if(st[1]==='post'){if(bloomPass)bloomPass.enabled=true}
    /* noch unsichtbare Teile (Schilder, Lichtstrahlen) vorab übersetzen, damit der Rundgang ohne Ruckler startet */
    else if(st[1]==='compile'){renderer.setRenderTarget(composer?composer.readBuffer:null);renderer.compile(scene,camera);renderer.setRenderTarget(null)}
    else st[1].forEach(function(g){g.visible=true})}catch(e){console.error(e)}
  prep('Grafik wird vorbereitet: '+st[0]+' ('+(k+1)+'/'+STG.length+') …');
  onRendered(function(){logPush('zeit','Stufe '+(k+1)+' ('+st[0]+'): '+(performance.now()-t0).toFixed(0)+' ms');if(!k)loadEl.hidden=true;setTimeout(function(){reveal(k+1)},40)})}
function init(){
  setStatus('Luftbilder und Texturen werden geladen …');
  var K=['o19','o17','o15','o13','TA','TB','TI','TF','canN','canM','canF','grass','water'],src=A.img||{};
  Promise.all(K.map(function(k){return loadImg(src[k])})).then(function(ims){
    K.forEach(function(k,i){IM[k]=ims[i]});logPush('zeit','Bilder dekodiert');
    if(!IM.o19||!IM.o13){setStatus('Die Luftbilder konnten nicht geladen werden. Bitte die Seite neu laden.',1);return}
    var steps=[
      ['Gelände wird aus dem Höhenmodell aufgebaut …',function(){
        ['o19','o17','o15','o13'].forEach(function(k){var t=texFrom(IM[k],false,false);t.anisotropy=Math.min(16,maxAniso);TU['tO'+k.slice(1)]={value:t}});
        var wt=IM.water?texFrom(IM.water,false,false):new THREE.DataTexture(new Uint8Array(4),1,1,THREE.RGBAFormat);TU.tWM={value:wt};TU.tDet={value:detTex()};
        (HRT2?['Rt','R2']:HRT?['Rt']:[]).forEach(function(k){TU['t'+k]={value:new THREE.DataTexture(new Uint8Array(4),1,1,THREE.RGBAFormat)};TU['u'+k+'B']={value:new THREE.Vector4(0,0,1,1)};TU['u'+k+'On']={value:0}});
        buildTerrain()}],
      ['Exponate werden modelliert (1/3) …',function(){exBuild(0,3)}],['Exponate werden modelliert (2/3) …',function(){exBuild(1,3)}],['Exponate werden modelliert (3/3) …',function(){exBuild(2,3)}],
      ['Gebäude …',function(){buildBuilding(IM);buildHS();buildBeams();buildDims()}],
      ['Bäume nach dem Luftbild …',function(){MK={canN:imgData(IM.canN),canM:imgData(IM.canM),canF:imgData(IM.canF),grass:imgData(IM.grass),o19:imgData(IM.o19)};buildTrees(MK);
        TREEC.forEach(function(p){sb(p[0]-0.45,p[0]+0.45,p[1]-0.45,p[1]+0.45)})}],
      ['Wiese und Reben …',function(){buildGrass(MK);buildVines()}],
      ['Dorf, Bahn und Brücken …',function(){buildVillage();buildInfra()}],
      ['Licht und Himmel …',function(){
        tagEls=tags.map(function(t){var e=document.createElement('div');e.className=t.m?'tag tag-dim':'tag';e.textContent=t.t;e.hidden=true;stage.appendChild(e);return e});
        envTagEls=envTags.map(function(t){var e=document.createElement('div');e.className='tag env';e.textContent=t.t;e.hidden=true;stage.appendChild(e);return e});
        initPost();if(bloomPass)bloomPass.enabled=false;theme();resize();applySun();bakeEnv()}]
    ];
    function run(i){if(i>=steps.length){setStatus('Grafik wird vorbereitet …');applyHash();requestAnimationFrame(frame);reveal(0);
        window.__lcInfo=function(){var dbg=gl.getExtension('WEBGL_debug_renderer_info'),rn=dbg?gl.getParameter(dbg.UNMASKED_RENDERER_WEBGL):gl.getParameter(gl.RENDERER),ri=renderer.info;
          return 'WebGL '+(isGL2?2:1)+' · '+rn+'\nQualität '+qName+(qAuto?' (automatisch, '+(DEV.phone?'Telefon':DEV.tablet?'Tablet':'Rechner')+')':'')+' · Pixelverhältnis '+renderer.getPixelRatio().toFixed(2)+' · Nachbearbeitung '+(POST.on?'an, MSAA '+POST.samples:'aus')+'\nTextureinheiten '+gl.getParameter(gl.MAX_TEXTURE_IMAGE_UNITS)+' · Schattenkarte '+QP.sh+' · Shaderprogramme '+(ri.programs?ri.programs.length:'?')+'\nZeichenaufrufe '+ri.render.calls+' · Dreiecke '+ri.render.triangles+' · Geometrien '+ri.memory.geometries+' · Texturen '+ri.memory.textures+'\nBildrate ≈ '+fpsNow.toFixed(0)+' Bilder/s · Wind '+(windLvl>0&&!slowWind?windLvl:'aus')+(cloudsOn?' · Wolken':'')+(waterOn&&river?' · Fluss fließt':'')+' · Shader-Compilerhinweise '+(window.__lcShaderHints||0)};
        diagPanel();return}
      setStatus(steps[i][0]);setTimeout(function(){var ts=performance.now();try{steps[i][1]();logPush('zeit',steps[i][0].replace(/ …$/,'')+' '+(performance.now()-ts).toFixed(0)+' ms')}catch(e){console.error(e);setStatus('Fehler beim Aufbau ('+steps[i][0]+'): '+e.message,1);return}run(i+1)},20)}
    run(0);
  });
}
/* nur mit #diag: Testzugriff für automatische Prüfungen */
if(DIAG)window.__lcDbg={film:{start:startFilm,stop:stopFilm,seek:fmSeek,pause:fmPause,place:fmPlace,state:FILM,len:function(){return fmL},walker:function(){return fmW&&fmW.position},chapters:function(){return fmCH}},camera:camera,TU:TU,HR:HR,rib:function(){return fmRib},HS:HS,hsG:hsG,fp:fp,startWalk:startWalk,stopFly:stopFly,interact:interact,closeCard:closeCard,walkStep:walkStep,tags:function(){return tags.map(function(t,i){return {t:t.t,m:!!t.m,hidden:tagEls[i]?tagEls[i].hidden:null}})},dims:function(v){dims=v;dimBtn.setAttribute('aria-pressed',String(dims));draw()},render:function(){render(performance.now())}};
var lg=document.getElementById('legend');if(lg){try{if(window.innerHeight>=1000&&window.innerWidth>=1200)lg.open=true}catch(e){}lg.addEventListener('toggle',function(){resize()})}
if(window.ResizeObserver){try{new ResizeObserver(function(){resize()}).observe(stage)}catch(e){}}
init();
