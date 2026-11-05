/* La Congiunta 3D – Bilder und Texturen, Gelände aus Höhenmodell und Luftbild, Fluss */
'use strict';
/* ---------- Bilder und Texturen ---------- */
function loadImg(src){return new Promise(function(res){if(!src){res(null);return}var im=new Image();im.onload=function(){res(im)};im.onerror=function(){res(null)};im.src=src})}
function imgData(im){if(!im)return null;var c=document.createElement('canvas');c.width=im.width;c.height=im.height;var x=c.getContext('2d');x.drawImage(im,0,0);return {d:x.getImageData(0,0,im.width,im.height).data,w:im.width,h:im.height}}
function maskAt(M,half,x,z){if(!M)return 0;var u=Math.floor((x+half)/(2*half)*M.w),v=Math.floor((z+half)/(2*half)*M.h);if(u<0||v<0||u>=M.w||v>=M.h)return 0;return M.d[(v*M.w+u)*4]/255}
function pixAt(M,half,x,z){var u=clamp(Math.floor((x+half)/(2*half)*M.w),0,M.w-1),v=clamp(Math.floor((z+half)/(2*half)*M.h),0,M.h-1),i=(v*M.w+u)*4;return [M.d[i]/255,M.d[i+1]/255,M.d[i+2]/255]}
function potCopy(im){var w=1,h=1;while(w<im.width)w*=2;while(h<im.height)h*=2;if(w===im.width&&h===im.height)return im;var c=document.createElement('canvas');c.width=w;c.height=h;c.getContext('2d').drawImage(im,0,0,w,h);return c}
function texFrom(im,srgb,rep){if(rep&&!isGL2)im=potCopy(im);var t=new THREE.Texture(im);t.needsUpdate=true;if(srgb)t.encoding=THREE.sRGBEncoding;t.anisotropy=Math.min(8,maxAniso);if(rep){t.wrapS=t.wrapT=THREE.RepeatWrapping}else{t.wrapS=t.wrapT=THREE.ClampToEdgeWrapping}return t}
/* Normalenkarte aus der Helligkeit einer Fototextur (Schalungsfugen = Vertiefungen) */
function normalFrom(im,str,blur){var w=im.width,h=im.height,c=document.createElement('canvas');c.width=w;c.height=h;var x=c.getContext('2d');x.drawImage(im,0,0);
  var d=x.getImageData(0,0,w,h).data,L=new Float32Array(w*h),B=new Float32Array(w*h),i,j;
  for(i=0;i<w*h;i++)L[i]=(d[i*4]*0.3+d[i*4+1]*0.59+d[i*4+2]*0.11)/255;
  var r=blur||10;for(j=0;j<h;j++){var s=0;for(i=-r;i<=r;i++)s+=L[j*w+((i+w)%w)];for(i=0;i<w;i++){B[j*w+i]=s/(2*r+1);s+=L[j*w+((i+r+1)%w)]-L[j*w+((i-r+w)%w)]}}
  var B2=new Float32Array(w*h);for(i=0;i<w;i++){var s2=0;for(j=-r;j<=r;j++)s2+=B[((j+h)%h)*w+i];for(j=0;j<h;j++){B2[j*w+i]=s2/(2*r+1);s2+=B[((j+r+1)%h)*w+i]-B[((j-r+h)%h)*w+i]}}
  for(i=0;i<w*h;i++)L[i]=L[i]-B2[i];
  var o=x.createImageData(w,h),od=o.data;
  for(j=0;j<h;j++)for(i=0;i<w;i++){var gx=(L[j*w+(i+1)%w]-L[j*w+(i-1+w)%w])*str,gy=(L[((j+1)%h)*w+i]-L[((j-1+h)%h)*w+i])*str,l=Math.sqrt(gx*gx+gy*gy+1),k=(j*w+i)*4;
    od[k]=(-gx/l*0.5+0.5)*255;od[k+1]=(gy/l*0.5+0.5)*255;od[k+2]=(1/l*0.5+0.5)*255;od[k+3]=255}
  x.putImageData(o,0,0);var t=new THREE.CanvasTexture(c);t.wrapS=t.wrapT=THREE.RepeatWrapping;t.anisotropy=Math.min(8,maxAniso);return t}
function alphaTex(w,h,fn,fill){var c=document.createElement('canvas');c.width=w;c.height=h;var x=c.getContext('2d');fn(x,w,h);
  var d=x.getImageData(0,0,w,h).data,a=new Uint8Array(w*h*4);
  for(var j=0;j<h;j++)for(var i=0;i<w;i++){var s=(j*w+i)*4,o=((h-1-j)*w+i)*4,al=d[s+3];if(al<6){a[o]=fill[0];a[o+1]=fill[1];a[o+2]=fill[2];a[o+3]=0}else{a[o]=d[s];a[o+1]=d[s+1];a[o+2]=d[s+2];a[o+3]=al}}
  var t=new THREE.DataTexture(a,w,h,THREE.RGBAFormat);t.encoding=THREE.sRGBEncoding;t.wrapS=t.wrapT=THREE.ClampToEdgeWrapping;t.minFilter=THREE.LinearMipmapLinearFilter;t.magFilter=THREE.LinearFilter;t.generateMipmaps=true;t.anisotropy=Math.min(4,maxAniso);t.needsUpdate=true;return t}
function canvasTex(w,h,fn,srgb){var c=document.createElement('canvas');c.width=w;c.height=h;fn(c.getContext('2d'),w,h);var t=new THREE.CanvasTexture(c);t.wrapS=t.wrapT=THREE.RepeatWrapping;t.anisotropy=Math.min(8,maxAniso);if(srgb)t.encoding=THREE.sRGBEncoding;return t}
/* ---------- Gelände ---------- */
TERRAIN_DECL='varying vec3 vW;\nuniform sampler2D tO19,tO17,tO15,tO13,tWM,tDet;\nuniform float uWT;\nfloat wet_=0.0;\n'+
  (HRT?'uniform sampler2D tRt;\nuniform vec4 uRtB;\nuniform float uRtOn;\n':'')+
  (HRT2?'uniform sampler2D tR2;\nuniform vec4 uR2B;\nuniform float uR2On;\n':'')+
  'vec3 s2l(vec3 c){return pow(max(c,vec3(0.0)),vec3(2.2));}\n'+
  /* Schärfen, solange ein Luftbild vergrössert erscheint: Bild minus nächstgröbere Mipmap-Stufe (WebGL 2) */
  (isGL2?'vec3 shp(sampler2D t,vec2 uv,vec3 c,float k){vec2 g=uv*vec2(textureSize(t,0));float lod=log2(max(max(length(dFdx(g)),length(dFdy(g))),1e-4));\n'+
  'return max(c+(c-textureLod(t,uv,1.0).rgb)*k*(1.0-smoothstep(-0.8,0.3,lod)),vec3(0.0));}\n':'vec3 shp(sampler2D t,vec2 uv,vec3 c,float k){return c;}\n')+
  /* feine Luftbilder (siehe hires.js) wie die eingebetteten bearbeiten: Schlagschatten gegenüber dem örtlichen Mittel
     (gröbere Mipmap-Stufe) aufhellen, leicht entsättigen; Gewicht mit weichem Rand */
  (HRT?'vec3 hrCol(sampler2D t,vec2 uq){vec3 cr=s2l(shp(t,uq,texture2D(t,uq).rgb,0.5)),cb=s2l(texture2D(t,uq,5.0).rgb);\n'+
  'float lr=dot(cr,vec3(0.2126,0.7152,0.0722))+1e-4,lb=dot(cb,vec3(0.2126,0.7152,0.0722))+1e-4,rr=lr/lb;cr*=rr<0.75?pow(0.75/max(rr,0.05),0.55):1.0;\n'+
  'cr=cr*0.92+0.004;float l2=dot(cr,vec3(0.2126,0.7152,0.0722));cr=l2+(cr-l2)*0.9;return pow(clamp(cr,0.0,1.0),vec3(0.4545));}\n'+
  'float hrW(vec2 q,vec4 B,float fe){return smoothstep(0.0,fe,min(min(q.x,1.0-q.x)/B.z,min(q.y,1.0-q.y)/B.w));}\n':'');
var HR_GLSL='float wq=0.0;\n'+
  (HRT2?'if(uR2On>0.001){vec2 q2=(p-uR2B.xy)*uR2B.zw;if(q2.x>0.0&&q2.x<1.0&&q2.y>0.0&&q2.y<1.0){float w2=hrW(q2,uR2B,40.0)*uR2On;col=mix(col,hrCol(tR2,vec2(q2.x,1.0-q2.y)),w2);wq=0.5*w2;}}\n':'')+
  (HRT?'if(uRtOn>0.001){vec2 q=(p-uRtB.xy)*uRtB.zw;if(q.x>0.0&&q.x<1.0&&q.y>0.0&&q.y<1.0){float w1=hrW(q,uRtB,30.0)*uRtOn;col=mix(col,hrCol(tRt,vec2(q.x,1.0-q.y)),w1);wq=max(wq,w1);}}\n':'');
TERRAIN_MAP='{vec2 p=vW.xz;float m=max(abs(p.x),abs(p.y));\n'+
  /* Kellerschacht an der Westwand (siehe main3.js: KPX0-KPT, KPX1, KPZN, KPZS) */
  'if(vWP.x>-3.645&&vWP.x<-2.625&&vWP.z>0.16&&vWP.z<8.38)discard;\n'+
  'vec3 c13=texture2D(tO13,vec2(p.x/12807.2+0.5,0.5-p.y/12807.2)).rgb;\n'+
  'vec3 c15=texture2D(tO15,vec2(p.x/3201.8+0.5,0.5-p.y/3201.8)).rgb;\n'+
  'vec2 u17=vec2(p.x/800.4+0.5,0.5-p.y/800.4);vec3 c17=shp(tO17,u17,texture2D(tO17,u17).rgb,0.35);\n'+
  'vec2 u19=vec2(p.x/200.12+0.5,0.5-p.y/200.12);vec3 c19=shp(tO19,u19,texture2D(tO19,u19).rgb,0.5);\n'+
  'float lum13=dot(c13,vec3(0.3,0.59,0.11));vec3 gen=mix(vec3(0.25,0.29,0.20),vec3(0.42,0.41,0.38),smoothstep(0.30,0.45,lum13));\n'+
  'vec3 col=mix(c13,gen,smoothstep(5600.0,6350.0,m));\n'+
  'col=mix(c15,col,smoothstep(1380.0,1590.0,m));col=mix(c17,col,smoothstep(330.0,396.0,m));\n'+HR_GLSL+
  'col=mix(c19,col,smoothstep(78.0,98.0,m));\n'+
  'col=s2l(col);\n'+
  /* künstliche Feinstruktur nur dort voll, wo das Luftbild grob ist */
  'float cd=distance(cameraPosition,vWP);float dn=(1.0-smoothstep(25.0,140.0,cd))*(1.0-0.5*wq);\n'+
  'float d1=texture2D(tDet,p*0.31).r;col*=mix(1.0,0.80+0.40*d1,dn);\n'+
  'wet_=texture2D(tWM,vec2(p.x/800.4+0.5,0.5-p.y/800.4)).r*step(m,398.0);wet_=smoothstep(0.25,0.85,wet_)*(1.0-smoothstep(330.0,396.0,m));\n'+
  /* Feinstruktur nach Bodenart, aus der Farbe geschätzt: Gras (grünlich) mit Büscheln, heller Boden mit Kies und Steinen,
     dunkler Belag (Asphalt, Schatten) mit feiner Körnung; zwei gedrehte Lagen gegen sichtbare Wiederholung, nah voll, ab 160 m weg */
  'vec4 dA=texture2D(tDet,p*0.25+vec2(0.37,0.11)),dB=texture2D(tDet,mat2(0.8,-0.6,0.6,0.8)*p*0.173+vec2(0.61,0.29));\n'+
  'float lmn=dot(col,vec3(0.2126,0.7152,0.0722))+1e-4,gr=smoothstep(1.04,1.3,col.g/max(max(col.r,col.b),1e-4)),fl=smoothstep(0.09,0.035,lmn);\n'+
  'float dv=0.5*(mix(mix(dA.b,dA.a,fl),dA.g,gr)+mix(mix(dB.b,dB.a,fl),dB.g,gr));\n'+
  'col*=1.0+(dv-0.5)*mix(0.75,1.0,gr)*(1.0-smoothstep(35.0,160.0,cd))*(1.0-0.8*wet_);\n'+
  'col=mix(col,col*vec3(0.55,0.62,0.66),wet_*0.6);\n'+
  /* Kontaktschatten am Gebäudefuß */
  'vec2 bq=vec2(vWP.x,vWP.z);vec2 d0=max(vec2(-2.625,-21.2)-bq,bq-vec2(2.625,21.2));float e0=length(max(d0,0.0))+min(max(d0.x,d0.y),0.0);\n'+
  'vec2 d1b=max(vec2(-5.965,8.38)-bq,bq-vec2(-2.625,21.2));float e1=length(max(d1b,0.0))+min(max(d1b.x,d1b.y),0.0);float eb=min(e0,e1);\n'+
  'col*=1.0-0.42*exp(-max(eb,0.0)*2.2)*step(-0.05,eb);\n'+
  /* Jahreszeit: Wiese im Winter strohfarben, Schnee über der Schneegrenze */
  'float lm=dot(col,vec3(0.3,0.59,0.11));float green=smoothstep(0.0,0.05,col.g-col.r)*smoothstep(0.0,0.03,col.g-col.b);\n'+
  'col=mix(col,vec3(lm*1.25,lm*1.08,lm*0.70),green*clamp(uSeason,0.0,1.0)*0.75);\n'+
  'float el=vW.y+398.1;float sn=smoothstep(uSnow-120.0,uSnow+180.0,el+(texture2D(tDet,p*0.011).r-0.5)*260.0);\n'+
  'vec3 nWt=inverseTransformDirection(normalize(vNormal),viewMatrix);float flat_=smoothstep(0.55,0.85,abs(nWt.y));sn*=mix(0.35,1.0,flat_)*(1.0-0.55*smoothstep(0.08,0.02,lm));\n'+
  'col=mix(col,vec3(0.86,0.88,0.92),clamp(sn,0.0,0.95));\n'+
  'diffuseColor.rgb*=col;}\n';
var terrain=null;
var TERR=null;
function buildTerrain(){
  if(terrain){env.remove(terrain);terrain.geometry.dispose()}
  var u32=isGL2||!!renderer.extensions.get('OES_element_index_uint'),N=u32?QP.grid:Math.min(QP.grid,254),Aa=9000,K=5.8,SH=Math.sinh(K),ax=new Float32Array(N+1),i,j;
  for(i=0;i<=N;i++){var s=-1+2*i/N;ax[i]=Aa*Math.sinh(K*s)/SH}TERR={ax:ax,N:N};
  var n1=N+1,pos=new Float32Array(n1*n1*3),idx=u32?new Uint32Array(N*N*6):new Uint16Array(N*N*6),t=0;
  for(j=0;j<=N;j++)for(i=0;i<=N;i++){var k=(j*n1+i)*3;pos[k]=ax[i];pos[k+1]=hW(ax[i],ax[j]);pos[k+2]=ax[j]}
  for(j=0;j<N;j++)for(i=0;i<N;i++){var a=j*n1+i,b=a+1,c=a+n1,d=c+1;idx[t++]=a;idx[t++]=c;idx[t++]=b;idx[t++]=b;idx[t++]=c;idx[t++]=d}
  var g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.BufferAttribute(pos,3));g.setIndex(new THREE.BufferAttribute(idx,1));g.computeVertexNormals();
  g.boundingSphere=new THREE.Sphere(new THREE.Vector3(0,0,0),13000);
  var m=patch(new THREE.MeshStandardMaterial({color:0xffffff,roughness:0.94,metalness:0,envMapIntensity:0.9}),{terrain:1,gust:0.08});
  terrain=new THREE.Mesh(g,m);terrain.receiveShadow=true;terrain.castShadow=false;terrain.frustumCulled=false;env.add(terrain);
  buildRiver();
}
/* Fluss: Band über dem Ticino entlang der Flussachse aus OpenStreetMap [8] (Punkte in Fließrichtung, also talabwärts), alle 3 m
   abgetastet und geglättet, 2 × 14 m breit, auf der gezeichneten Geländefläche (hT) knapp darüber; der Nebenarm bei der Insel
   läuft an beiden Enden schmal aus, damit sich die Flächen nicht doppeln. Wasser und Schaum zeichnet der Shader (WATER_CODE). */
var river=null;
function buildRiver(){try{
  if(river){env.remove(river);river.geometry.dispose();river=null}
  var L=(A.osm&&A.osm.river)||[];if(!L.length)return;
  var pos=[],rv=[],idx=[],M=6,nv=0;
  L.forEach(function(pl,li){
    var p=[],i,k;for(i=0;i+1<pl.length;i+=2)p.push([pl[i],pl[i+1]]);if(p.length<2)return;
    var cum=[0];for(i=1;i<p.length;i++)cum.push(cum[i-1]+Math.hypot(p[i][0]-p[i-1][0],p[i][1]-p[i-1][1]));var tot=cum[cum.length-1];
    var n=Math.max(2,Math.round(tot/3)),S=[],j=1;
    for(k=0;k<=n;k++){var d=tot*k/n;while(j<p.length-1&&cum[j]<d)j++;var f=(d-cum[j-1])/Math.max(cum[j]-cum[j-1],1e-6);S.push([p[j-1][0]+(p[j][0]-p[j-1][0])*f,p[j-1][1]+(p[j][1]-p[j-1][1])*f])}
    for(var it=0;it<4;it++){var T=S.map(function(q){return q.slice()});for(k=1;k<S.length-1;k++){S[k][0]=(T[k-1][0]+2*T[k][0]+T[k+1][0])/4;S[k][1]=(T[k-1][1]+2*T[k][1]+T[k+1][1])/4}}
    var s=0,base=nv;
    for(k=0;k<S.length;k++){if(k)s+=Math.hypot(S[k][0]-S[k-1][0],S[k][1]-S[k-1][1]);
      var a=S[Math.max(0,k-1)],b=S[Math.min(S.length-1,k+1)],tx=b[0]-a[0],tz=b[1]-a[1],tl=Math.hypot(tx,tz)||1;tx/=tl;tz/=tl;
      /* Nebenarm: an beiden Enden auf 25 m schmal auslaufen */
      var hw=RIVER_HW*(li>0?Math.min(1,s/25,(tot-s)/25):1);hw=Math.max(hw,0.3);
      for(var c=0;c<=M;c++){var q=(-1+2*c/M)*hw,x=S[k][0]-tz*q,z=S[k][1]+tx*q;pos.push(x,hT(x,z)+0.2,z);rv.push(s,q,tx,tz)}
      nv+=M+1;
      if(k)for(c=0;c<M;c++){var v0=base+(k-1)*(M+1)+c,v1=v0+1,v2=v0+M+1,v3=v2+1;idx.push(v0,v1,v2,v1,v3,v2)}}
  });
  if(!nv)return;
  var g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));g.setAttribute('aRv',new THREE.Float32BufferAttribute(rv,4));
  g.setIndex(nv>65535?new THREE.Uint32BufferAttribute(idx,1):new THREE.Uint16BufferAttribute(idx,1));g.computeVertexNormals();g.computeBoundingSphere();
  var m=patch(new THREE.MeshStandardMaterial({color:0xffffff,roughness:0.1,metalness:0,envMapIntensity:1.0,transparent:true,depthWrite:false,polygonOffset:true,polygonOffsetFactor:-2,polygonOffsetUnits:-4}),{water:1});
  river=new THREE.Mesh(g,m);river.receiveShadow=true;river.castShadow=false;river.renderOrder=1;env.add(river);
  logPush('zeit','Fluss: '+nv+' Ecken')}catch(e){console.warn('[LC] Fluss',e)}}
