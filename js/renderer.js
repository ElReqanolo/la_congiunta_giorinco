/* La Congiunta 3D – Renderer, Szene und Kamera; gemeinsame Shader-Bausteine (Wind, Wolken, Fluss, Kachelung); Bergschatten */
'use strict';
/* ---------- Renderer, Szene, Kamera ---------- */
var renderer;
/* Grafikchip vorab in einem kleinen Probe-Kontext erkennen, damit der eigentliche Renderer gleich passend angelegt wird */
(function(){try{var c=document.createElement('canvas'),o={powerPreference:'high-performance'},g=c.getContext('webgl2',o)||c.getContext('webgl',o);if(!g)return;var di=g.getExtension('WEBGL_debug_renderer_info');
  GPU=String(di?g.getParameter(di.UNMASKED_RENDERER_WEBGL):g.getParameter(g.RENDERER)||'');var lc=g.getExtension('WEBGL_lose_context');if(lc)lc.loseContext()}catch(e){}})();
/* 0 = Software, 0.5 = ältere Mobil-GPU, 1 = integriert oder mobil, 2 = eigenständige Grafikkarte bzw. Apple M */
function gpuTier(g){g=g.toLowerCase();if(/swiftshader|llvmpipe|softpipe|basic render|software|microsoft basic/.test(g))return 0;
  if(/mali-(4|t\d|g[35]\d\b)|adreno[^0-9]*[2-5]\d\d\b|powervr|sgx|videocore|tegra [234]/.test(g))return 0.5;
  if(/nvidia|geforce|quadro|rtx|gtx|radeon rx|radeon pro|radeon r9|apple m\d|arc a\d/.test(g))return 2;return 1}
function autoQ(){var t=gpuTier(GPU),q;
  if(t===0||DEV.save||(DEV.mem&&DEV.mem<=2)||(DEV.cores&&DEV.cores<=2))q='niedrig';
  else if(DEV.phone)q=(t>=1&&DEV.mem>=8)?'mittel':'niedrig';
  else if(DEV.tablet)q=t<1?'niedrig':'mittel';
  else if(t<1)q='niedrig';
  else q=(t===2&&(!DEV.mem||DEV.mem>=8)&&DEV.sw>=700)?'hoch':'mittel';
  /* war die Darstellung beim letzten Besuch zu langsam, eine Stufe tiefer beginnen */
  var cap=lsGet('lcAutoCap');if(QS[cap]&&QL.indexOf(cap)<QL.indexOf(q))q=cap;return q}
qName=qAuto?autoQ():qSel;
QP=QS[qName];if(DEV.rm)QP.wind=0;
logPush('zeit','Grafik: '+GPU+' · '+(DEV.phone?'Telefon':DEV.tablet?'Tablet':'Rechner')+(DEV.mem?' · '+DEV.mem+' GB':'')+(DEV.cores?' · '+DEV.cores+' Kerne':'')+' · Pixeldichte '+DEV.dpr+' → Qualität '+qName+(qAuto?' (automatisch)':''));
try{renderer=new THREE.WebGLRenderer({antialias:!QP.post,powerPreference:qName==='niedrig'?'default':'high-performance'})}catch(e){setStatus('WebGL ist in diesem Browser nicht verfügbar. Bitte einen aktuellen Browser verwenden oder die Hardwarebeschleunigung einschalten.',1);window.LC_ABORT=true;throw e}
if(!GPU){try{var g0=renderer.getContext(),di0=g0.getExtension('WEBGL_debug_renderer_info');GPU=String(di0?g0.getParameter(di0.UNMASKED_RENDERER_WEBGL):g0.getParameter(g0.RENDERER)||'')}catch(e){}}
/* Pixelverhältnis aus dem Pixelbudget: kleine Bildschirme mit hoher Pixeldichte bleiben scharf, grosse Monitore werden nicht überlastet */
function prHi(){var w=stage.clientWidth||window.innerWidth||1000,h=stage.clientHeight||window.innerHeight||700,b=Math.sqrt(QP.px*1e6/(w*h));
  return Math.max(Math.min(DEV.dpr,QP.prLo),Math.min(DEV.dpr,QP.prMax,b))}
var prCur=prHi();renderer.setPixelRatio(prCur);
renderer.outputEncoding=THREE.sRGBEncoding;
renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=0.65;
renderer.shadowMap.enabled=true;renderer.shadowMap.type=qName==='niedrig'?THREE.PCFShadowMap:THREE.PCFSoftShadowMap;
stage.insertBefore(renderer.domElement,stage.firstChild);
renderer.info.autoReset=false;
renderer.domElement.addEventListener('webglcontextlost',function(e){e.preventDefault();logPush('error','WebGL-Kontext verloren');diag('Die Grafikkarte hat die 3D-Darstellung zurückgesetzt. Bitte die Seite neu laden oder „Qualität: mittel“ wählen.')},false);
renderer.domElement.addEventListener('webglcontextrestored',function(){logPush('log','WebGL-Kontext wiederhergestellt');try{if(diagEl)diagEl.hidden=true;bakeEnv()}catch(e){}draw()},false);
var gl=renderer.getContext(),isGL2=renderer.capabilities.isWebGL2;
var maxAniso=renderer.capabilities.getMaxAnisotropy();
/* feine Luftbilder nachladen (hires.js): braucht WebGL 2, freie Textureinheiten und kein Datensparen; die Umgebung nur bei „hoch“ */
var HRT=isGL2&&renderer.capabilities.maxTextures>=16&&!DEV.save,HRT2=HRT&&qName!=='niedrig';
var scene=new THREE.Scene();
var camera=new THREE.PerspectiveCamera(40,1,0.3,22000);
scene.fog=new THREE.FogExp2(0xb8c4cf,0.00009);
var env=new THREE.Group();env.rotation.y=-TH;scene.add(env);env.updateMatrixWorld(true);
/* ---------- gemeinsame Shader-Uniforms ---------- */
var U={uTime:{value:0},uNearCut:{value:0},uFocus:{value:new THREE.Vector3()},uFocusR:{value:0},tTS1:{value:null},tTS2:{value:null},uAmber:{value:new THREE.Color(1.0,0.80,0.55)},uSkyL:{value:new THREE.Color(0,0,0)},
  uSnow:{value:5000},uSeason:{value:1},uSunB:{value:new THREE.Vector3(0,1,0)},uSunC:{value:new THREE.Color(1,1,1)},uClear:{value:0},
  uWind:{value:new THREE.Vector4(0,-0.4512,-0.8924,0.62)},uWT:{value:0},uCloud:{value:new THREE.Vector4(0,0,0,0.60)}};
function rep(s,a,b,tag){if(s.indexOf(a)<0){console.warn('[LC] Shader-Anpassung nicht gefunden:',tag||a.slice(0,50));return s}return s.split(a).join(b)}
function f6(v){return v.toFixed(6)}
var GLSL_TS='uniform sampler2D tTS1,tTS2;\nvec2 toW(vec3 p){return vec2(p.x*'+f6(CT)+'+p.z*'+f6(ST)+',-p.x*'+f6(ST)+'+p.z*'+f6(CT)+');}\n'+
  'float terrSun(vec3 p){vec2 w=toW(p);float m=max(abs(w.x),abs(w.y));float a=texture2D(tTS1,w/2400.0+0.5).r;float b=texture2D(tTS2,w/18000.0+0.5).r;return mix(a,b,smoothstep(1040.0,1180.0,m))*cloudSh(p,uSunB);}\n';
var VWP_CALC='\n{vec4 q_=vec4(transformed,1.0);\n#ifdef USE_INSTANCING\nq_=instanceMatrix*q_;\n#endif\nvWP=(modelMatrix*q_).xyz;}\n';
/* Wind: Verschiebung in lokalen Koordinaten, Phase aus der Instanzposition */
/* Wind: Böen ziehen talaufwärts durch die Landschaft (uWind: Stärke, Richtung x/z in Weltkoordinaten), jede Pflanze biegt sich
   mit der Bö in Windrichtung und schwingt zurück; Laub und Gras flattern zusätzlich. uWindP je Material: Biegung (m je m^1.5 Höhe),
   Abstand des Fusspunkts unter dem Instanz-Ursprung (lokal), Flattern (m). Die Verschiebung wird in Weltmetern gerechnet und in
   lokale Koordinaten der Instanz zurückgerechnet, so biegen sich grosse und kleine Bäume richtig. */
var CLH=2400; // Wolkenuntergrenze über dem Talboden (rund 2800 m ü. M.)
/* Wolkenmuster: kachelbares Wertrauschen (5 Oktaven, 10 bis 160 Zellen auf 10,24 km), einmal beim Start berechnet.
   Boden und Himmel lesen dieselbe Textur (verschoben um uCloud.yz), die Lichtstrahlen innen dieselben Werte in JS. */
var CLS=10240,CLN=512,CLD=new Uint8Array(CLN*CLN*4);
(function(){var t0=performance.now(),r=mb32(7),acc=new Float32Array(CLN*CLN),tot=0;
  [[10,1],[20,0.5],[40,0.25],[80,0.125],[160,0.0625]].forEach(function(o){var c=o[0],a=o[1],g=new Float32Array(c*c),i,x,y;for(i=0;i<g.length;i++)g[i]=r();
    var I0=new Int32Array(CLN),I1=new Int32Array(CLN),F=new Float32Array(CLN);
    for(i=0;i<CLN;i++){var t=i*c/CLN,k=Math.floor(t),f=t-k;I0[i]=k;I1[i]=(k+1)%c;F[i]=f*f*f*(f*(f*6-15)+10)}
    for(y=0;y<CLN;y++){var r0=I0[y]*c,r1=I1[y]*c,fy=F[y];for(x=0;x<CLN;x++){var fx=F[x],a0=g[r0+I0[x]],b0=g[r0+I1[x]],c0=g[r1+I0[x]],d0=g[r1+I1[x]];
      acc[y*CLN+x]+=a*((a0+(b0-a0)*fx)*(1-fy)+(c0+(d0-c0)*fx)*fy)}}tot+=a});
  for(var i=0;i<acc.length;i++){var v=Math.round(acc[i]/tot*255);CLD[i*4]=v;CLD[i*4+1]=v;CLD[i*4+2]=v;CLD[i*4+3]=255}
  var tx=new THREE.DataTexture(CLD,CLN,CLN,THREE.RGBAFormat);tx.wrapS=tx.wrapT=THREE.RepeatWrapping;tx.magFilter=THREE.LinearFilter;tx.minFilter=THREE.LinearMipmapLinearFilter;tx.generateMipmaps=true;tx.needsUpdate=true;
  U.tCl={value:tx};logPush('zeit','Wolkenmuster '+(performance.now()-t0).toFixed(0)+' ms')})();
/* Wert des Musters an einer Stelle (Weltkoordinaten), bilinear wie die Grafikkarte */
function cloudAt(wx,wz){var c=U.uCloud.value,u=((wx+c.y)/CLS)*CLN-0.5,v=((wz+c.z)/CLS)*CLN-0.5,x0=Math.floor(u),y0=Math.floor(v),fx=u-x0,fy=v-y0;
  function g(x,y){x=((x%CLN)+CLN)%CLN;y=((y%CLN)+CLN)%CLN;return CLD[(y*CLN+x)*4]/255}
  return (g(x0,y0)*(1-fx)+g(x0+1,y0)*fx)*(1-fy)+(g(x0,y0+1)*(1-fx)+g(x0+1,y0+1)*fx)*fy}
var WIND_DECL='uniform vec4 uWind;\nuniform vec4 uCloud;\nuniform sampler2D tCl;\nvec2 toW2(vec3 p){return vec2(p.x*'+f6(CT)+'+p.z*'+f6(ST)+',-p.x*'+f6(ST)+'+p.z*'+f6(CT)+');}\n'+
  /* Böen: zwei Wellen ziehen mit rund 10 m/s talaufwärts; uWind.w = langsames Auf und Ab des ganzen Winds (in JS) */
  'float windG(vec2 w){vec2 d=uWind.yz;float a=dot(w,d),b=dot(w,vec2(-d.y,d.x)),t=uTime;\n'+
  'return max(0.05,uWind.w+0.24*sin(a*0.031-t*0.34+1.4*sin(b*0.017+0.6))+0.16*sin(a*0.083-t*0.86+b*0.041));}\n'+
  'float cloudV(vec2 w){return texture2D(tCl,(w+uCloud.yz)/'+CLS.toFixed(1)+').r;}\n'+
  'float cloudSh(vec3 p,vec3 s){if(uCloud.x<=0.0)return 1.0;vec3 pc=p+s*(('+CLH.toFixed(1)+'-p.y)/max(s.y,0.08));\n'+
  'return 1.0-uCloud.x*0.62*smoothstep(uCloud.w,uCloud.w+0.07,cloudV(toW2(pc)));}\n';
var WIND_CODE='\n{mat3 m_=mat3(modelMatrix);vec3 ip_=modelMatrix[3].xyz;\n#ifdef USE_INSTANCING\nm_=m_*mat3(instanceMatrix);ip_=(modelMatrix*instanceMatrix[3]).xyz;\n#endif\n'+
  'vec2 w_=toW2(ip_);float g_=windG(w_)*uWind.x;float sy_=length(m_[1]);\n'+
  'float hy_=max((m_*(transformed+vec3(0.0,uWindP.y,0.0))).y,0.0);float am_=uWindP.x*pow(hy_,1.5);\n'+
  'float ph_=uTime*2.6/sqrt(1.0+sy_*0.15)+dot(w_,vec2(0.37,0.23));\n'+
  'vec2 dw_=(uWind.yz*(0.75+0.42*sin(ph_))+vec2(-uWind.z,uWind.y)*0.22*sin(ph_*0.73+1.3))*g_*am_;\n'+
  'vec3 ds_=vec3(dw_.x*'+f6(CT)+'-dw_.y*'+f6(ST)+',-0.5*dot(dw_,dw_)/max(hy_,0.3),dw_.x*'+f6(ST)+'+dw_.y*'+f6(CT)+');\n'+
  'if(uWindP.z>0.0){float fq_=uTime*7.0+dot(position,vec3(9.1,5.3,7.7))*3.0;ds_+=vec3(sin(fq_),0.6*sin(fq_*1.3+1.0),cos(fq_*0.9+2.0))*uWindP.z*g_*min(hy_,1.0);}\n'+
  'transformed+=vec3(dot(m_[0],ds_)/max(dot(m_[0],m_[0]),1e-6),dot(m_[1],ds_)/max(dot(m_[1],m_[1]),1e-6),dot(m_[2],ds_)/max(dot(m_[2],m_[2]),1e-6));}\n';
/* Bö auf Laub, Gras und Wiesen: heller (Blattunterseiten, gebogene Halme); im Vertex-Shader gerechnet (vGs), k = Stärke je Material */
var GUST_V='\nvGs=smoothstep(0.72,1.15,windG(toW2(vWP)))*min(uWind.x,1.3);\n';
function gustSheen(k,green){return '\n{float gs_=vGs;'+(green?'gs_*=clamp((diffuseColor.g-max(diffuseColor.r,diffuseColor.b))*14.0,0.0,1.0);':'')+'diffuseColor.rgb*=1.0+'+k.toFixed(3)+'*gs_;}\n'}
var ROOMS=null; // wird beim Gebäude gesetzt (für das Oberlicht im Shader)
function glslSky(){var R=ROOMS,s=''+
  'float rectFF(vec3 p,vec3 n,vec3 c0,vec3 c1,vec3 c2,vec3 c3){vec3 v0=normalize(c0-p),v1=normalize(c1-p),v2=normalize(c2-p),v3=normalize(c3-p);float s=0.0;'+
  's+=acos(clamp(dot(v0,v1),-1.0,1.0))*dot(normalize(cross(v0,v1)),n);s+=acos(clamp(dot(v1,v2),-1.0,1.0))*dot(normalize(cross(v1,v2)),n);'+
  's+=acos(clamp(dot(v2,v3),-1.0,1.0))*dot(normalize(cross(v2,v3)),n);s+=acos(clamp(dot(v3,v0),-1.0,1.0))*dot(normalize(cross(v3,v0)),n);return max(0.0,s*0.1591549);}\n'+
  'float skyFF(vec3 p,vec3 n){\n';
  s+='if(p.x<'+f6(R.cx1)+'&&p.z>'+f6(R.cz0)+'){float k=clamp(floor((p.z-'+f6(R.cz0)+')/'+f6(R.cp)+'),0.0,3.0);float zc='+f6(R.cz0)+'+(k+0.5)*'+f6(R.cp)+';'+
    'return rectFF(p,n,vec3('+f6(R.sx0)+','+f6(R.ch)+',zc-'+f6(R.sz)+'),vec3('+f6(R.sx0)+','+f6(R.ch)+',zc+'+f6(R.sz)+'),vec3('+f6(R.sx1)+','+f6(R.ch)+',zc+'+f6(R.sz)+'),vec3('+f6(R.sx1)+','+f6(R.ch)+',zc-'+f6(R.sz)+'))+0.045;}\n';
  s+='float y=0.0,za=0.0,zb=0.0;\n';
  for(var i=0;i<3;i++){var r=R.r[i];s+=(i?'else ':'')+(i<2?'if(p.z<'+f6(r.zEnd)+')':'')+'{y='+f6(r.y)+';za='+f6(r.za)+';zb='+f6(r.zb)+';}\n'}
  s+='return rectFF(p,n,vec3('+f6(R.xa)+',y,za),vec3('+f6(R.xa)+',y,zb),vec3('+f6(R.xb)+',y,zb),vec3('+f6(R.xb)+',y,za))+0.035;}\n';
  return s}
/* Textur ohne sichtbare Wiederholung (nach I. Quilez): eine weiche Rauschzahl wählt je Zone einen Versatz, an den Zonengrenzen wird gemischt */
var NT_GLSL='#if __VERSION__ >= 300\nfloat ntH(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}\n'+
  'float ntN(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.0-2.0*f);return mix(mix(ntH(i),ntH(i+vec2(1.0,0.0)),f.x),mix(ntH(i+vec2(0.0,1.0)),ntH(i+vec2(1.0)),f.x),f.y);}\n'+
  'vec4 texNT(sampler2D s,vec2 uv,vec2 dm){float l=ntN(uv*0.45)*8.0;float ia=floor(l),f=fract(l);vec2 oa=sin(vec2(3.0,7.0)*ia)*dm,ob=sin(vec2(3.0,7.0)*(ia+1.0))*dm;\n'+
  'vec2 gx=dFdx(uv),gy=dFdy(uv);vec4 a=textureGrad(s,uv+oa,gx,gy),b=textureGrad(s,uv+ob,gx,gy);return mix(a,b,smoothstep(0.2,0.8,f-0.1*dot(a.rgb-b.rgb,vec3(1.0))));}\n'+
  '#else\nvec4 texNT(sampler2D s,vec2 uv,vec2 dm){return texture2D(s,uv);}\n#endif\n';
/* Fluss: Wasserfläche über dem Flussbett (siehe buildRiver). aRv = (s Weg flussabwärts in m, q Abstand quer zur Achse in m,
   Fließrichtung x/z lokal). Wasser = Maske aus dem Luftbild (±400 m) bzw. Breite um die Achse; Schaumstreifen und Wellen ziehen mit
   rund 2,3 und 3 m/s flussabwärts (zwei Lagen des Wolkenrauschens, längs gestreckt), Abschnitte mit Stromschnellen schäumen stärker;
   die Wellen kippen die Normale, so wandern Glanzlichter mit der Strömung. */
var RIVER_HW=14.0;
var WATER_DECL='varying vec4 vRv;\nvarying vec3 vW;\nvarying vec2 vFd;\nuniform sampler2D tWM;\nuniform float uWT;\nfloat wfo_=0.0;\nvec3 wdn_=vec3(0.0);\n'+
  'float wN(vec2 u){return texture2D(tCl,u).r;}\n';
var WATER_CODE='\n{float m_=max(abs(vW.x),abs(vW.z)),at_=abs(vRv.y);\n'+
  'float nr_=texture2D(tWM,vec2(vW.x/800.4+0.5,0.5-vW.z/800.4)).r*step(m_,398.0);nr_=smoothstep(0.3,0.8,nr_)*(1.0-smoothstep('+(RIVER_HW-3).toFixed(1)+','+RIVER_HW.toFixed(1)+',at_));\n'+
  'float wa_=mix(nr_,1.0-smoothstep(4.5,8.5,at_),smoothstep(330.0,396.0,m_));if(wa_<0.004)discard;\n'+
  'float s_=vRv.x,q_=vRv.y,T_=uWT;vec2 u1_=vec2((s_-T_*2.3)/90.0,q_/16.0+0.23),u2_=vec2((s_-T_*3.0)/30.0+q_*0.021+0.37,q_/6.5+0.61);\n'+
  'float f_=wN(u1_)*0.55+wN(u2_)*0.45,rp_=wN(vec2(s_/900.0+0.13,0.29));\n'+
  'float th_=0.60-0.22*(rp_-0.5);wfo_=smoothstep(th_,th_+0.06,f_);\n'+
  'float e_=0.6,hs_=(wN(u1_+vec2(e_/90.0,0.0))*0.55+wN(u2_+vec2(e_/30.0,0.0))*0.45-f_)/e_,hq_=(wN(u1_+vec2(0.0,e_/16.0))*0.55+wN(u2_+vec2(0.0,e_/6.5))*0.45-f_)/e_;\n'+
  'vec2 g_=vFd*hs_+vec2(-vFd.y,vFd.x)*hq_;wdn_=vec3(-g_.x,0.0,-g_.y)*5.0;\n'+
  'diffuseColor.rgb=mix(vec3(0.10,0.17,0.17),vec3(0.86,0.89,0.89),wfo_);diffuseColor.a=wa_*(0.34+0.56*wfo_);}\n';
/* patch(): erweitert Standard-Materialien um Bergschatten, Wind, Innenraumlicht, Gelände usw. */
function patch(mat,o){
  o=o||{};
  var F=['terrain','wind','depth','interior','facade','weather','leaf','foliage','plexi','season','notile','notileu','lod','cut','gust','water'].filter(function(k){return o[k]!==undefined&&o[k]!==null&&o[k]!==false});
  var key='lc2:'+F.join(',')+(o.lod?'/'+o.lod+(o.lodA?'a':''):'')+(o.gust?'/g'+o.gust:'');
  var MU={uWindP:{value:new THREE.Vector3().fromArray(o.wind||[0,0,0])},uLeafK:{value:+o.leaf||0},uSeasonK:{value:+o.season||0},uAlphaK:{value:1}};
  mat.userData.lcU=MU;mat.userData.lcF=F;
  mat.customProgramCacheKey=function(){return key};
  mat.onBeforeCompile=function(sh){
    for(var k in U)sh.uniforms[k]=U[k];
    for(var k3 in MU)sh.uniforms[k3]=MU[k3];
    if(o.terrain)for(var k2 in TU)sh.uniforms[k2]=TU[k2];
    if(o.water)sh.uniforms.tWM=TU.tWM;
    var vs=sh.vertexShader,fs=sh.fragmentShader;
    vs=rep(vs,'#include <common>','#include <common>\nvarying vec3 vWP;\nuniform float uTime;\nuniform vec3 uWindP;\n'+(o.wind||o.gust?WIND_DECL:'')+(o.gust?'varying float vGs;\n':'')+(o.terrain?'varying vec3 vW;\n':'')+(o.water?'attribute vec4 aRv;\nvarying vec4 vRv;\nvarying vec3 vW;\nvarying vec2 vFd;\n':''));
    if(o.wind)vs=rep(vs,'#include <begin_vertex>','#include <begin_vertex>'+WIND_CODE);
    vs=rep(vs,'#include <project_vertex>','#include <project_vertex>'+VWP_CALC+(o.terrain?'vW=position;\n':'')+(o.water?'vRv=aRv;vW=position;vFd=normalize((modelMatrix*vec4(aRv.z,0.0,aRv.w,0.0)).xz);\n':'')+(o.gust&&!o.depth?GUST_V:''));
    /* Detailstufen der Bäume: 1 = nah, 2 = mittel, 3 = fern; Abstand des Instanz-Ursprungs zur Kamera (uLodC), weich überblendet */
    if(o.lod){var fe_=o.lod===1?'1.0-smoothstep(uLodR.x-7.0,uLodR.x,ld_)':(o.lod===2?'smoothstep(uLodR.x-7.0,uLodR.x,ld_)*(1.0-smoothstep(uLodR.y-40.0,uLodR.y,ld_))':'smoothstep(uLodR.y-40.0,uLodR.y,ld_)');
      vs=rep(vs,'#include <common>','#include <common>\nuniform vec3 uLodC;\nuniform vec2 uLodR;\nvarying float vLodF;\n');
      vs=rep(vs,'#include <project_vertex>','#include <project_vertex>\n{vec4 lq_=vec4(0.0,0.0,0.0,1.0);\n#ifdef USE_INSTANCING\nlq_=instanceMatrix*lq_;\n#endif\nfloat ld_=distance((modelMatrix*lq_).xyz,uLodC);vLodF='+fe_+';if(vLodF<'+(o.lodA&&!o.depth?'0.004':'0.5')+')gl_Position=vec4(0.0,0.0,-2.0,1.0);}\n','lod')}
    if(o.depth){sh.vertexShader=vs;return}
    fs=rep(fs,'#include <common>','#include <common>\nvarying vec3 vWP;\nuniform float uTime;\nuniform vec3 uAmber,uSunB,uSunC,uSkyL;\nuniform float uSnow,uSeason,uClear,uLeafK,uSeasonK,uAlphaK,uNearCut,uFocusR;\nuniform vec3 uFocus;\n'+WIND_DECL+(o.gust?'varying float vGs;\n':'')+GLSL_TS+((o.notile||o.notileu)?NT_GLSL:'')+(o.interior?glslSky():'')+(o.terrain?TERRAIN_DECL:'')+(o.facade?FACADE_DECL:'')+(o.water?WATER_DECL:''));
    var lb=THREE.ShaderChunk.lights_fragment_begin;
    lb=rep(lb,'getDirectionalDirectLightIrradiance( directionalLight, geometry, directLight );','getDirectionalDirectLightIrradiance( directionalLight, geometry, directLight );\n\t\tdirectLight.color*=terrSun(vWP)'+(o.interior?'*uAmber':'')+';','dir-light');
    fs=rep(fs,'#include <lights_fragment_begin>',lb);
    if(o.terrain){fs=rep(fs,'#include <map_fragment>',TERRAIN_MAP);fs=rep(fs,'#include <roughnessmap_fragment>','#include <roughnessmap_fragment>\nroughnessFactor=mix(roughnessFactor,0.06,wet_);');
      fs=rep(fs,'#include <normal_fragment_maps>','#include <normal_fragment_maps>\nif(wet_>0.01){vec2 rp_=vW.xz;float t_=uWT;vec3 wn_=vec3(sin(rp_.x*1.7+t_*2.1)+sin(rp_.y*2.3-t_*1.7)*0.7,0.0,cos(rp_.y*1.9+t_*1.9)+sin(rp_.x*2.9+t_*2.6)*0.6)*0.06*wet_;normal=normalize(normal+(viewMatrix*vec4(wn_,0.0)).xyz);}');}
    if(o.water){fs=rep(fs,'#include <color_fragment>','#include <color_fragment>'+WATER_CODE,'water');
      fs=rep(fs,'#include <roughnessmap_fragment>','#include <roughnessmap_fragment>\nroughnessFactor=mix(0.05,0.75,wfo_);');
      fs=rep(fs,'#include <normal_fragment_maps>','#include <normal_fragment_maps>\nnormal=normalize(normal+(viewMatrix*vec4(wdn_*(1.0-wfo_*0.6),0.0)).xyz);');}
    if(o.facade){fs=rep(fs,'#include <map_fragment>','');fs=rep(fs,'#include <color_fragment>',FACADE_MAP);}
    /* Kachelmuster brechen: Textur in Zonen versetzt abtasten und weich mischen (Wände nur waagrecht, damit die Schalungsfugen bleiben) */
    if(o.notile||o.notileu){var nd_=o.notileu?'vec2(1.0,0.0)':'vec2(1.0)';fs=rep(fs,'#include <map_fragment>',THREE.ShaderChunk.map_fragment.replace('texture2D( map, vUv )','texNT( map, vUv, '+nd_+' )'));
      if(THREE.ShaderChunk.normal_fragment_maps.indexOf('texture2D( normalMap, vUv )')>=0)fs=rep(fs,'#include <normal_fragment_maps>',THREE.ShaderChunk.normal_fragment_maps.replace('texture2D( normalMap, vUv )','texNT( normalMap, vUv, '+nd_+' )'))}
    if(o.weather)fs=rep(fs,'#include <color_fragment>','#include <color_fragment>\n'+WEATHER_CODE);
    if(o.gust)fs=rep(fs,'#include <color_fragment>','#include <color_fragment>'+gustSheen(+o.gust,!!o.terrain),'gust');
    /* Innenraum: Licht der Oberlichter (Formfaktor) diffus und gespiegelt – so glänzen Messing und Stahl dort, wo sie das Oberlicht sehen */
    if(o.interior)fs=rep(fs,'#include <aomap_fragment>','#include <aomap_fragment>\n{vec3 nW_=inverseTransformDirection(normal,viewMatrix);reflectedLight.indirectDiffuse+=material.diffuseColor*(uSkyL*skyFF(vWP,nW_)+uClear*0.22*vec3(1.0,0.97,0.92));'+
      'vec3 rW_=reflect(normalize(vWP-cameraPosition),nW_);reflectedLight.indirectSpecular+=material.specularColor*uSkyL*(skyFF(vWP,rW_)*(1.25-material.specularRoughness)+0.035);}');
    if(o.leaf)fs=rep(fs,'#include <aomap_fragment>','#include <aomap_fragment>\n{vec3 vd_=normalize(vWP-cameraPosition);float bl_=pow(max(dot(vd_,uSunB),0.0),3.0);reflectedLight.indirectDiffuse+=diffuseColor.rgb*uSunC*bl_*uLeafK*terrSun(vWP);}');
    /* Laub: in der Ferne dichter; im Film nahe der Kamera und auf der Sichtlinie zur Figur ausgeblendet (uFocus, Radius uFocusR) */
    /* Dorf im Film: Dächer und Wände auf der Sichtlinie zur Figur ausschneiden (enge Gassen, die Figur bleibt sichtbar) */
    if(o.cut)fs=rep(fs,'#include <clipping_planes_fragment>','#include <clipping_planes_fragment>\nif(uFocusR>0.0){vec3 ab_=uFocus-cameraPosition;float h_=dot(vWP-cameraPosition,ab_)/max(dot(ab_,ab_),0.0001);if(h_>0.0&&h_<0.96&&length(vWP-cameraPosition-ab_*h_)<uFocusR*0.75)discard;}\n','cut');
    if(o.lod&&o.lodA){fs=rep(fs,'#include <common>','#include <common>\nvarying float vLodF;\n');fs=rep(fs,'#include <alphamap_fragment>','#include <alphamap_fragment>\ndiffuseColor.a*=vLodF;')}
    if(o.foliage)fs=rep(fs,'#include <alphamap_fragment>','#include <alphamap_fragment>\n{float cd_=distance(vWP,cameraPosition);float k_=clamp((cd_-uNearCut)/max(uNearCut,0.001),0.0,1.0);\nif(uFocusR>0.0){vec3 ab_=uFocus-cameraPosition;float h_=dot(vWP-cameraPosition,ab_)/max(dot(ab_,ab_),0.0001);\nif(h_>0.0&&h_<0.98)k_*=smoothstep(uFocusR*0.5,uFocusR,length(vWP-cameraPosition-ab_*h_));}\ndiffuseColor.a=min(1.0,diffuseColor.a*uAlphaK*(1.0+0.012*cd_))*k_;}');
    if(o.foliage)fs=rep(fs,'#include <normal_fragment_begin>','#include <normal_fragment_begin>\n#ifdef DOUBLE_SIDED\nnormal=normal*(float(gl_FrontFacing)*2.0-1.0);\n#endif');
    if(o.plexi)fs=rep(fs,'#include <emissivemap_fragment>','#include <emissivemap_fragment>\nif(!gl_FrontFacing){totalEmissiveRadiance+=uSkyL*0.9;diffuseColor.rgb*=0.15;}');
    if(o.season)fs=rep(fs,'#include <color_fragment>','#include <color_fragment>\n{float lm_=dot(diffuseColor.rgb,vec3(0.3,0.59,0.11));vec3 dry_=vec3(lm_*1.25,lm_*1.05,lm_*0.62);diffuseColor.rgb=mix(diffuseColor.rgb,dry_,uSeasonK*clamp(uSeason,0.0,1.0));}');
    sh.vertexShader=vs;sh.fragmentShader=fs;
  };
  return mat;
}
var TU={};var TERRAIN_DECL='',TERRAIN_MAP='',FACADE_DECL='',FACADE_MAP='',WEATHER_CODE='';
/* ---------- Bergschatten: Horizont-Strahlverfolgung im Höhenmodell ---------- */
var TS1=128,TS2=112;
var tsA=new Uint8Array(TS1*TS1*4),tsB=new Uint8Array(TS2*TS2*4);
function mkDT(a,n){var t=new THREE.DataTexture(a,n,n,THREE.RGBAFormat);t.magFilter=t.minFilter=THREE.LinearFilter;t.wrapS=t.wrapT=THREE.ClampToEdgeWrapping;t.generateMipmaps=false;t.needsUpdate=true;return t}
for(var ii=0;ii<tsA.length;ii++)tsA[ii]=255;for(ii=0;ii<tsB.length;ii++)tsB[ii]=255;
U.tTS1.value=mkDT(tsA,TS1);U.tTS2.value=mkDT(tsB,TS2);
function horizon(x,z,h0,dx,dz){var t=8,mx=-10;while(t<16000){var hx=x+dx*t,hz=z+dz*t;if(hx>9000||hx<-9000||hz>9000||hz<-9000)break;var a=(hMF(hx,hz)-h0)/t;if(a>mx)mx=a;t=t*1.075+6}return mx}
function fillTS(arr,n,half,dx,dz,el,soft,y0,y1){
  for(var j=y0;j<y1;j++){var z=-half+(j+0.5)*2*half/n;for(var i=0;i<n;i++){var x=-half+(i+0.5)*2*half/n;
    var h0=hMF(x,z)+2,a=Math.atan(horizon(x,z,h0,dx,dz)),v=clamp((el-a)/soft+0.5,0,1);arr[(j*n+i)*4]=Math.round(v*255)}}}
var tsJob=0,nTS=0;
function updateTS(sw){ // sw: Sonnenrichtung in W
  var job=++tsJob,hl=Math.hypot(sw.x,sw.z)||1e-6,el=Math.atan2(sw.y,hl),dx=sw.x/hl,dz=sw.z/hl;
  if(el<-0.06){for(var i=0;i<tsA.length;i+=4)tsA[i]=0;for(i=0;i<tsB.length;i+=4)tsB[i]=0;U.tTS1.value.needsUpdate=U.tTS2.value.needsUpdate=true;sunVisB=0;draw();return}
  /* Sonne am Bau sofort bestimmen (ein Strahl), damit Licht und Anzeige nicht auf die Schattenkarten warten */
  sunVisB=clamp((el-Math.atan(horizon(0,0,hRaw(0,0)+2.5,dx,dz)))/0.012+0.5,0,1);
  var step=0;
  function run(){if(job!==tsJob)return;var tc=performance.now();
    if(step<4){fillTS(tsA,TS1,1200,dx,dz,el,0.03,step*TS1/4,(step+1)*TS1/4)}else{var q=step-4;fillTS(tsB,TS2,9000,dx,dz,el,0.045,q*TS2/4,(q+1)*TS2/4)}
    if(nTS<10){nTS++;logPush('zeit','Bergschatten Teil '+step+': '+(performance.now()-tc).toFixed(0)+' ms')}
    step++;
    if(step<8)setTimeout(run,0);else{U.tTS1.value.needsUpdate=U.tTS2.value.needsUpdate=true;var h0=hRaw(0,0)+2.5;sunVisB=clamp((el-Math.atan(horizon(0,0,h0,dx,dz)))/0.012+0.5,0,1);afterSun();draw()}}
  run();
}
var sunVisB=1;
