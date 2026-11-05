/* La Congiunta 3D – Bäume, Wiese und Reben */
'use strict';
/* ---------- Vegetation ---------- */
var vegGroup=new THREE.Group();env.add(vegGroup);
/* Teilgruppen, damit beim Start nacheinander eingeblendet und kompiliert werden kann */
var vegN=new THREE.Group(),vegM=new THREE.Group(),vegF=new THREE.Group(),grassG=new THREE.Group();vegGroup.add(vegN,vegM,vegF);env.add(grassG);
/* Schattenmaterial für Laub: gleiche Alphaschwelle wie das sichtbare Laub, gleicher Wind */
function depthMat(map,w,lod){var d=new THREE.MeshDepthMaterial({depthPacking:THREE.RGBADepthPacking,map:map,alphaTest:0.42});if(w||lod){var o={depth:1};if(w)o.wind=w;if(lod)o.lod=lod;patch(d,o)}return d}
var DUM=new THREE.Object3D();
function leafTex(seed,kind){var fill=kind==='needle'?[58,98,58]:(kind==='twig'?[74,62,52]:[98,138,62]);return alphaTex(256,256,function(x,w,h){var r=mb32(seed);x.clearRect(0,0,w,h);
  if(kind==='twig'){x.strokeStyle='rgba(74,62,52,1)';for(var i=0;i<26;i++){var a=r()*6.283,l=40+r()*80,cx=128,cy=128;x.lineWidth=1+r()*2.5;x.beginPath();x.moveTo(cx+(r()-0.5)*60,cy+(r()-0.5)*60);x.lineTo(cx+Math.cos(a)*l,cy+Math.sin(a)*l);x.stroke()}return}
  if(kind==='needle'){for(var j=0;j<900;j++){var px=r()*w,py=r()*h,t=py/h,half=(1-t)*w*0.5;if(Math.abs(px-w/2)>half)continue;var g=0.55+r()*0.6;x.strokeStyle='rgb('+Math.floor(58*g)+','+Math.floor(98*g)+','+Math.floor(58*g)+')';x.lineWidth=2;var a2=r()*6.283;x.beginPath();x.moveTo(px,py);x.lineTo(px+Math.cos(a2)*7,py+Math.sin(a2)*7);x.stroke()}return}
  x.strokeStyle='rgba(80,64,48,1)';x.lineWidth=3;for(var b=0;b<5;b++){x.beginPath();x.moveTo(128,250);x.quadraticCurveTo(128+(r()-0.5)*120,140,40+r()*176,20+r()*90);x.stroke()}
  for(var k=0;k<260;k++){var qx=r()*w,qy=r()*h,d=Math.hypot(qx-128,qy-118);if(d>118*(0.55+r()*0.45))continue;var a3=r()*6.283,l2=9+r()*13,wd=l2*0.5,g2=0.72+r()*0.55;
    x.fillStyle='rgb('+Math.floor(Math.min(255,98*g2))+','+Math.floor(Math.min(255,138*g2))+','+Math.floor(Math.min(255,62*g2))+')';x.save();x.translate(qx,qy);x.rotate(a3);x.beginPath();x.ellipse(0,0,l2/2,wd/2,0,0,6.283);x.fill();x.restore()}
},fill)}
function cardCrown(n,seed,sc){sc=sc||1;var r=mb32(seed),pos=[],nor=[],uv=[],idx=[],v=0,q=new THREE.Quaternion(),e=new THREE.Euler(),p=new THREE.Vector3(),nm=new THREE.Vector3();
  for(var i=0;i<n;i++){var u=r()*2-1,th=r()*6.283,rad=Math.pow(r(),0.45),sx=Math.sqrt(1-u*u)*Math.cos(th)*rad,sy=u*rad*0.82,sz=Math.sqrt(1-u*u)*Math.sin(th)*rad,s=(0.5+r()*0.35)*sc;
    e.set((r()-0.5)*2.4,r()*6.283,(r()-0.5)*2.4);q.setFromEuler(e);nm.set(sx,sy+0.35,sz).normalize();
    [[-1,-1],[1,-1],[1,1],[-1,1]].forEach(function(c){p.set(c[0]*s,c[1]*s,0).applyQuaternion(q);pos.push(sx+p.x,sy+p.y,sz+p.z);nor.push(nm.x,nm.y,nm.z);uv.push((c[0]+1)/2,(c[1]+1)/2)});
    idx.push(v,v+1,v+2,v,v+2,v+3);v+=4}
  var g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));g.setAttribute('normal',new THREE.Float32BufferAttribute(nor,3));g.setAttribute('uv',new THREE.Float32BufferAttribute(uv,2));g.setIndex(idx);return g}
function coniferCards(seed){var r=mb32(seed),pos=[],nor=[],uv=[],idx=[],v=0;var tiers=8;
  for(var t=0;t<tiers;t++){var y=0.12+t*0.105,R=(1-y)*0.42+0.03,nb=7;for(var b=0;b<nb;b++){var a=b/nb*6.283+r()*0.6+t*0.7,ca=Math.cos(a),sa=Math.sin(a),dr=-0.10-r()*0.06,w=R*0.75;
      var P=[[0,y+0.02,0],[ca*R,y+dr,sa*R]],px=-sa*w/2,pz=ca*w/2;
      var c0=[P[0][0]-px*0.3,P[0][1],P[0][2]-pz*0.3],c1=[P[0][0]+px*0.3,P[0][1],P[0][2]+pz*0.3],c2=[P[1][0]+px,P[1][1],P[1][2]+pz],c3=[P[1][0]-px,P[1][1],P[1][2]-pz];
      [c0,c1,c2,c3].forEach(function(c,k){pos.push(c[0],c[1],c[2]);var nx=c[0],nz=c[2],l=Math.hypot(nx,0.6,nz);nor.push(nx/l,0.6/l,nz/l);uv.push(k===0||k===3?0:1,k<2?1:0)});
      idx.push(v,v+1,v+2,v,v+2,v+3);v+=4}}
  var g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));g.setAttribute('normal',new THREE.Float32BufferAttribute(nor,3));g.setAttribute('uv',new THREE.Float32BufferAttribute(uv,2));g.setIndex(idx);return g}
var leafMats=[],decidMeshes=[],TREES={near:[],mid:[],far:[]};
function inst(g,m,n,parent){var im=new THREE.InstancedMesh(g,m,Math.max(1,n));im.frustumCulled=false;(parent||vegGroup).add(im);return im}
function setI(m,i,x,y,z,sx,sy,sz,ry,col){DUM.position.set(x,y,z);DUM.scale.set(sx,sy,sz);DUM.rotation.set(0,ry||0,0);DUM.updateMatrix();m.setMatrixAt(i,DUM.matrix);if(col)m.setColorAt(i,col)}
function placeTrees(M){
  var r=mb32(4242),out={near:[],mid:[],far:[]};
  function grid(lo,hi,sp,inner,fn){for(var z=lo;z<hi;z+=sp)for(var x=lo;x<hi;x+=sp){var px=x+(r()-0.5)*sp*0.9,pz=z+(r()-0.5)*sp*0.9;if(inner&&Math.max(Math.abs(px),Math.abs(pz))<inner)continue;fn(px,pz)}}
  function typ(h){var el=h+BASE,pc=clamp((el-760)/650,0,1)*0.72+0.05;return r()<pc?1:0}
  grid(-98,98,QP.tN,0,function(x,z){if(maskAt(M.canN,100.06,x,z)>0.5){var h=hW(x,z);out.near.push([x,z,h,typ(h),r(),r()])}});
  grid(-398,398,QP.tM,98,function(x,z){if(maskAt(M.canM,400.2,x,z)>0.5){var h=hW(x,z);out.mid.push([x,z,h,typ(h),r(),r()])}});
  grid(-QP.fx,QP.fx,QP.tF,398,function(x,z){if(maskAt(M.canF,1600.9,x,z)>0.5){var h=hW(x,z);out.far.push([x,z,h,typ(h),r(),r()])}});
  return out}
var barkM=null;
/* Bäume in Detailstufen nach der Entfernung zur Kamera (nicht mehr nach festen Zonen): nah ausführliche Kronen mit Stamm und Schatten,
   weiter weg einfache Kronen, ganz fern einfache Körper. Die Übergänge blenden im Shader weich über (uLodC = Kamera, uLodR = Grenzen).
   Jeder Baumpunkt aus dem Luftbild hat die Rasterweite seiner Zone; braucht eine Stufe mehr Bäume, werden in seiner Zelle weitere ergänzt
   (nur wo das Luftbild Wald zeigt), braucht sie weniger, fällt ein fester Teil weg. So bleibt die Dichte überall stimmig. */
var TL={D1:({ultra:180,hoch:130,mittel:110,niedrig:80})[qName]||110,D2:({ultra:900,hoch:700,mittel:560,niedrig:420})[qName]||560,R:[],G:{},M:null,N:null,Md:null,cx:1e9,cz:1e9,mx:1e9,mz:1e9,last:0};
U.uLodC={value:new THREE.Vector3(0,1e5,0)};U.uLodR={value:new THREE.Vector2(TL.D1,TL.D2)};
function treeCan(M,x,z){var m=Math.max(Math.abs(x),Math.abs(z));return m<99?maskAt(M.canN,100.06,x,z):(m<399?maskAt(M.canM,400.2,x,z):maskAt(M.canF,1600.9,x,z))}
function treeEmit(lev,cx,cz,rad,fn){var S=[QP.tN,QP.tM,QP.tF][lev],R=TL.R,G=TL.G,M=TL.M,r2=rad*rad,g0x=Math.floor((cx-rad)/50),g1x=Math.floor((cx+rad)/50),g0z=Math.floor((cz-rad)/50),g1z=Math.floor((cz+rad)/50);
  for(var gz=g0z;gz<=g1z;gz++)for(var gx=g0x;gx<=g1x;gx++){var Lc=G[gx+','+gz];if(!Lc)continue;
    for(var q=0;q<Lc.length;q++){var t=R[Lc[q]],sp=t[6],dx=t[0]-cx,dz=t[1]-cz,d2=dx*dx+dz*dz;if(d2>(rad+sp)*(rad+sp))continue;
      if(sp<=S*1.01){if(sp<S*0.99&&grH(t[0],t[1],7)>sp*sp/(S*S))continue;if(d2<=r2)fn(t[0],t[1],t[2],t[3],t[4],t[5]);continue}
      if(d2<=r2)fn(t[0],t[1],t[2],t[3],t[4],t[5]);
      var n=Math.round(sp*sp/(S*S));for(var j=1;j<n;j++){var px=t[0]+(grH(t[0],t[1],j*2+11)-0.5)*sp,pz=t[1]+(grH(t[0],t[1],j*2+12)-0.5)*sp,ex=px-cx,ez=pz-cz;
        if(ex*ex+ez*ez>r2||treeCan(M,px,pz)<0.5)continue;var h=hW(px,pz),pc=clamp((h+BASE-760)/650,0,1)*0.72+0.05;
        fn(px,pz,h,grH(px,pz,5)<pc?1:0,grH(px,pz,3),grH(px,pz,4))}}}}
/* Instanz direkt in die Puffer schreiben (Drehung um die Hochachse, Skalierung, Farbe) */
function wI(m,x,y,z,sx,sy,sz,ry,col){var i=m._k;if(i>=m._cap){m._ov=1;return}m._k++;var A=m.instanceMatrix.array,o=i*16,c=Math.cos(ry),s=Math.sin(ry);
  A[o]=sx*c;A[o+1]=0;A[o+2]=-sx*s;A[o+3]=0;A[o+4]=0;A[o+5]=sy;A[o+6]=0;A[o+7]=0;A[o+8]=sz*s;A[o+9]=0;A[o+10]=sz*c;A[o+11]=0;A[o+12]=x;A[o+13]=y;A[o+14]=z;A[o+15]=1;
  if(col&&m.instanceColor){var C=m.instanceColor.array;C[i*3]=col.r;C[i*3+1]=col.g;C[i*3+2]=col.b}}
var tTint=new THREE.Color();
function putTree(S,x,z,h,ty,r4,rs){var tint=tTint;
  if(ty){var H2=11+rs*13;tint.setHSL(0.30+rs*0.04,0.18+rs*0.12,0.72+rs*0.12);wI(S.c,x,h-0.3,z,H2*0.42,H2,H2*0.42,rs*6.28,tint);if(S.t)wI(S.t,x,h-0.2,z,0.45,H2*0.35,0.45,0)}
  else{var cr=2.0+rs*2.2,tH=2.2+r4*2.8,mI=S.d[Math.floor(r4*3)%3];tint.setHSL(0.17+rs*0.08,0.22+r4*0.2,0.74+rs*0.14);
    wI(mI,x,h+tH+cr*0.78,z,cr,cr*1.12,cr,rs*6.28,tint);if(S.t)wI(S.t,x,h-0.2,z,0.32+cr*0.09,tH+cr*0.6,0.32+cr*0.09,rs*6)}}
function treeFill(S,lev,wx,wz,rad,skip){for(var pass=0;pass<2;pass++){S.all.forEach(function(m){m._k=0;m._ov=0});
    if(!skip)treeEmit(lev,wx,wz,rad,function(x,z,h,ty,r4,rs){putTree(S,x,z,h,ty,r4,rs)});
    /* zu wenig Platz (dichter Wald im Blick): Puffer vergrössern und noch einmal füllen */
    if(!S.all.some(function(m){return m._ov})||pass)break;treeGrow(S)}
  /* nur den belegten Teil der Puffer hochladen */
  S.all.forEach(function(m){m.count=m._k;var im=m.instanceMatrix,ic=m.instanceColor;if(im.updateRange){im.updateRange.offset=0;im.updateRange.count=m._k*16}im.needsUpdate=true;
    if(ic){if(ic.updateRange){ic.updateRange.offset=0;ic.updateRange.count=m._k*3}ic.needsUpdate=true}})}
function treeGrow(S){var white=new THREE.Color(1,1,1);function g(m){if(!m._ov)return m;var cap=Math.ceil(m._cap*1.6),n=new THREE.InstancedMesh(m.geometry,m.material,cap);
    n.frustumCulled=false;n._cap=cap;n.castShadow=m.castShadow;n.receiveShadow=m.receiveShadow;n.customDepthMaterial=m.customDepthMaterial;n.setColorAt(0,white);n.count=0;
    var p=m.parent;if(p){p.add(n);p.remove(m)}if(m.dispose)m.dispose();var di=decidMeshes.indexOf(m);if(di>=0)decidMeshes[di]=n;return n}
  S.d=S.d.map(g);S.c=g(S.c);if(S.t)S.t=g(S.t);S.all=S.d.concat([S.c],S.t?[S.t]:[])}
/* je Bild: Kamera an die Shader; die Baumlisten nur neu, wenn sich die Kamera ein Stück bewegt hat */
function treesUpd(force){if(!TL.N)return;var c=camera.position;U.uLodC.value.copy(c);var now=performance.now();if(!force&&now-TL.last<120)return;
  var w=b2w(c.x,c.z),ch=false;
  if(force||Math.hypot(w[0]-TL.cx,w[1]-TL.cz)>10){TL.cx=w[0];TL.cz=w[1];treeFill(TL.N,0,w[0],w[1],TL.D1+14,c.y-hB(c.x,c.z)>TL.D1+40);ch=true}
  if(force||Math.hypot(w[0]-TL.mx,w[1]-TL.mz)>50){TL.mx=w[0];TL.mz=w[1];treeFill(TL.Md,1,w[0],w[1],TL.D2+60);ch=true}
  if(ch){TL.last=now;draw()}}
function buildTrees(M){
  [vegN,vegM,vegF].forEach(function(G){while(G.children.length){var c=G.children[0];G.remove(c);if(c.geometry)c.geometry.dispose()}});
  TREES=placeTrees(M);TREEC.length=0;leafMats.length=0;decidMeshes.length=0;TL.M=M;
  var R=TL.R=[],GG=TL.G={};
  [['near',QP.tN],['mid',QP.tM],['far',QP.tF]].forEach(function(z){TREES[z[0]].forEach(function(t){var k=Math.floor(t[0]/50)+','+Math.floor(t[1]/50);(GG[k]||(GG[k]=[])).push(R.length);R.push([t[0],t[1],t[2],t[3],t[4],t[5],z[1]])})});
  var lt=leafTex(11,'leaf'),nt=leafTex(12,'needle');
  /* Wind je Baumart: Laubkrone (Ursprung in der Kronenmitte, Fuss rund 1,6 Kronenhöhen tiefer) biegt sich stärker und flattert,
     Nadelbaum (Ursprung am Fuss) schwingt langsamer; der Stamm biegt sich mit */
  var wD=[0.016,1.6,0.06],wC=[0.005,0,0.025],wB=[0.008,0,0];
  function leafMat(map,o,lod,wind){var m=new THREE.MeshStandardMaterial({map:map,alphaTest:0.42,side:THREE.DoubleSide,roughness:0.82,metalness:0,envMapIntensity:0.7});var oo={leaf:0.45,season:(o&&o.season)||0,foliage:1,lod:lod,lodA:1,wind:wind,gust:0.13};patch(m,oo);leafMats.push(m);return m}
  barkM=patch(new THREE.MeshStandardMaterial({color:0x5b4c3e,roughness:0.95,envMapIntensity:0.6}),{lod:1,wind:wB});
  var trunkG=new THREE.CylinderGeometry(0.35,0.5,1,7,1,true).translate(0,0.5,0),white=new THREE.Color(1,1,1);
  function mk(G,g,m,cap,shadow,dmap,w){var im=inst(g,m,cap,G);im._cap=cap;im.receiveShadow=true;if(shadow){im.castShadow=true;im.customDepthMaterial=depthMat(dmap||null,w||null,1)}im.setColorAt(0,white);im.count=0;return im}
  function set(G,lod,cards,base,rad,S0,shadow,trunks){
    var sc=Math.min(1.25,Math.sqrt(base/cards)),crowns=[cardCrown(cards,7+base,sc),cardCrown(cards,8+base,sc),cardCrown(cards,9+base,sc)],conG=coniferCards(5);
    var cap=Math.ceil(Math.PI*rad*rad/(S0*S0)*0.7)+300,dM=leafMat(lt,{season:0.65},lod,wD),cM=leafMat(nt,{},lod,wC);
    var S={d:crowns.map(function(g){var m=mk(G,g,dM,cap,shadow,lt,wD);decidMeshes.push(m);return m}),c:mk(G,conG,cM,cap,shadow,nt,wC),t:trunks?mk(G,trunkG,barkM,cap,shadow,null,wB):null};
    S.all=S.d.concat([S.c],S.t?[S.t]:[]);return S}
  TL.N=set(vegN,1,QP.cards,46,TL.D1+14,QP.tN,true,true);TL.Md=set(vegM,2,QP.midCards,16,TL.D2+60,QP.tM,false,false);
  TREES.near.forEach(function(t){var b=w2b(t[0],t[1]);if(Math.abs(b[0])<70&&Math.abs(b[1])<90)TREEC.push([b[0],b[1],0.45])});
  /* ferne Bäume: einfache Kronen, einmal für das ganze Tal (nahe blendet der Shader sie aus) */
  var fdM=patch(new THREE.MeshStandardMaterial({color:0xffffff,roughness:1,envMapIntensity:0.45}),{season:0.6,lod:3,gust:0.12}),fcM=patch(new THREE.MeshStandardMaterial({color:0xffffff,roughness:1,envMapIntensity:0.45}),{season:0,lod:3,gust:0.08});
  var fd=0,fc=0,FR=QP.fx*1.42,tf=QP.tF;treeEmit(2,0,0,FR,function(x,z,h,ty){if(ty)fc++;else fd++});
  var ico=new THREE.IcosahedronGeometry(1,0),con=new THREE.ConeGeometry(1,1,6).translate(0,0.5,0);
  var fI=mk(vegF,ico,fdM,fd+1,false),fC=mk(vegF,con,fcM,fc+1,false),tint=new THREE.Color();fI._k=0;fC._k=0;
  treeEmit(2,0,0,FR,function(x,z,h,ty,r4,rs){
    if(ty){var H3=13+rs*12,cr3=tf*(0.27+rs*0.1);tint.setHSL(0.31+rs*0.03,0.35,0.11+rs*0.04);wI(fC,x,h-0.5,z,cr3,H3,cr3,0,tint)}
    else{var c2=tf*(0.34+rs*0.16);tint.setHSL(0.21+rs*0.07,0.45,0.165+rs*0.06);wI(fI,x,h+c2*1.15,z,c2,c2*0.95,c2,rs*6,tint)}});
  [fI,fC].forEach(function(m){m.count=m._k;m.instanceMatrix.needsUpdate=true;if(m.instanceColor)m.instanceColor.needsUpdate=true});
  TL.cx=TL.mx=1e9;treesUpd(true);
}
/* Gras um das Gebäude: Farbe aus dem Luftbild */
var grassMesh=null;
/* Wiese: Grasbüschel überall dort, wo das Luftbild Wiese zeigt, in einem Umkreis um den Blickpunkt (Grösse je nach Qualität).
   Jede 1-m-Zelle hat feste, aus ihren Koordinaten abgeleitete Büschel; bewegt sich der Blickpunkt, wird nur neu verteilt,
   nichts springt. Zum Rand hin werden die Büschel kleiner, dort übernimmt die Feinstruktur des Bodens. */
var GR={R:({ultra:90,hoch:64,mittel:48,niedrig:30})[qName]||48,den:({ultra:2.5,hoch:2.3,mittel:1.9,niedrig:1.5})[qName]||1.9,cx:1e9,cz:1e9,on:false,last:0,M:null,cap:0};
function grH(x,z,k){var h=Math.sin(x*127.1+z*311.7+k*74.7)*43758.5453;return h-Math.floor(h)}
/* Abstand zum Baukörper (Hauptbau und Zellentrakt), 0 = innen */
function bDist(bx,bz){var hx=W/2,hz=TOT/2,dx=Math.max(0,Math.abs(bx)-hx),dz=Math.max(0,Math.abs(bz)-hz),d=Math.hypot(dx,dz);
  var ex=Math.max(0,CX0-bx,bx+hx),ez=Math.max(0,CZ0-bz,bz-hz);return Math.min(d,Math.hypot(ex,ez))}
/* Wiese laut Luftbild: grünlich, nicht zu dunkel (Wald, Schatten) und nicht zu hell (Kies, Strasse) */
function grassAt(M,x,z){var b=w2b(x,z),bx=b[0],bz=b[1];
  if(bDist(bx,bz)<0.15)return 0;if(bx>-3.9&&bx<-2.5&&bz>0&&bz<8.6)return 0;if(Math.abs(bx-DOFF)<0.85&&bz<-21&&bz>-31.5)return 0;
  var m=Math.max(Math.abs(x),Math.abs(z)),c;
  /* kein Gras im Flussbett (Wassermaske aus dem Luftbild) */
  if(M.water&&m<399&&maskAt(M.water,400.2,x,z)>0.25)return 0;
  if(m<99)c=pixAt(M.o19,100.06,x,z);else if(M.o17&&m<399)c=pixAt(M.o17,400.2,x,z);else return 0;
  var lum=0.3*c[0]+0.59*c[1]+0.11*c[2],gm=m<99&&maskAt(M.grass,100.06,x,z)>0.5;
  if(!gm&&!(c[1]>c[0]*1.03&&c[1]>c[2]*1.07&&lum>0.13&&lum<0.72))return 0;
  var cn=m<99?maskAt(M.canN,100.06,x,z):maskAt(M.canM,400.2,x,z);return cn>0.5?0.25:1}
function buildGrass(M){
  if(grassMesh){grassG.remove(grassMesh);grassMesh.geometry.dispose()}
  var r=mb32(99);GR.M=M;if(!M.o17&&IM.o17)M.o17=imgData(IM.o17);if(!M.water&&IM.water)M.water=imgData(IM.water);
  var gt=alphaTex(128,128,function(x,w,h){x.clearRect(0,0,w,h);for(var i=0;i<46;i++){var bx=6+r()*116,hh=50+r()*76,lean=(r()-0.5)*28,g=0.75+r()*0.5;x.strokeStyle='rgb('+Math.floor(Math.min(255,215*g))+','+Math.floor(Math.min(255,235*g))+','+Math.floor(Math.min(255,175*g))+')';x.lineWidth=1.5+r()*2;x.beginPath();x.moveTo(bx,h);x.quadraticCurveTo(bx+lean*0.3,h-hh*0.6,bx+lean,h-hh);x.stroke()}},[215,235,175]);
  var pos=[],nor=[],uv=[],idx=[];for(var k=0;k<3;k++){var a=k*Math.PI/3,c=Math.cos(a)*0.5,s=Math.sin(a)*0.5,v=k*4;pos.push(-c,0,-s,c,0,s,c,1,s,-c,1,-s);for(var q=0;q<4;q++)nor.push(0,1,0);uv.push(0,0,1,0,1,1,0,1);idx.push(v,v+1,v+2,v,v+2,v+3)}
  var g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));g.setAttribute('normal',new THREE.Float32BufferAttribute(nor,3));g.setAttribute('uv',new THREE.Float32BufferAttribute(uv,2));g.setIndex(idx);
  var mt=patch(new THREE.MeshStandardMaterial({map:gt,alphaTest:0.42,side:THREE.DoubleSide,roughness:0.9,envMapIntensity:0.75}),{wind:[0.45,0,0.015],gust:0.12,leaf:0,season:0.8,foliage:1});
  GR.cap=Math.ceil(Math.PI*GR.R*GR.R*GR.den*1.05)+64;
  grassMesh=new THREE.InstancedMesh(g,mt,GR.cap);grassMesh.frustumCulled=false;grassMesh.receiveShadow=true;
  grassMesh.setColorAt(0,new THREE.Color(1,1,1));grassMesh.count=0;grassG.add(grassMesh);leafMats.push(mt);GR.cx=1e9;grassUpd(true)}
var grF=new THREE.Vector3();
function grassUpd(force){if(!grassMesh||!GR.M)return;var now=performance.now();if(!force&&now-GR.last<110)return;
  /* Blickpunkt: Film = Figur, Flug/Rundgang = Kamera, sonst Drehpunkt; zu hoch oder zu weit weg: kein Gras */
  var f=grF,show=true;if(FILM.on)f.copy(FILM.focus);else if(fly){f.copy(fp);if(fp.y-hB(fp.x,fp.z)>GR.R*0.9)show=false}else{f.copy(tgt);if(r>230)show=false}
  if(!show){if(grassMesh.count){grassMesh.count=0;GR.cx=1e9;draw()}return}
  var w=b2w(f.x,f.z);if(!force&&Math.hypot(w[0]-GR.cx,w[1]-GR.cz)<Math.max(2.5,GR.R/18))return;GR.last=now;GR.cx=w[0];GR.cz=w[1];
  var M=GR.M,R=GR.R,R2=R*R,A=grassMesh.instanceMatrix.array,C=grassMesh.instanceColor.array,n=0,cap=GR.cap,x0=Math.floor(w[0]-R),x1=Math.ceil(w[0]+R),z0=Math.floor(w[1]-R),z1=Math.ceil(w[1]+R);
  for(var cz=z0;cz<=z1&&n<cap;cz++)for(var cx=x0;cx<=x1&&n<cap;cx++){var dx=cx+0.5-w[0],dz=cz+0.5-w[1],d2=dx*dx+dz*dz;if(d2>R2)continue;
    var gk=grassAt(M,cx+0.5,cz+0.5);if(!gk)continue;var nn=GR.den*gk,cnt=Math.floor(nn)+(grH(cx,cz,9)<nn-Math.floor(nn)?1:0);
    for(var j=0;j<cnt&&n<cap;j++){var px=cx+grH(cx,cz,j*3+1),pz=cz+grH(cx,cz,j*3+2),dd=Math.sqrt((px-w[0])*(px-w[0])+(pz-w[1])*(pz-w[1])),fe=clamp((R-dd)/Math.max(7,R*0.14),0,1);if(fe<=0.02)continue;
      if(gk<1&&!grassAt(M,px,pz))continue;var bb=w2b(px,pz),bd=bDist(bb[0],bb[1]);if(bd<0.12||(Math.abs(bb[0]-DOFF)<0.85&&bb[1]<-21&&bb[1]>-31.5))continue;
      var h3=grH(cx,cz,j*3+3),sc=Math.min((0.55+h3*0.7)*fe,2*bd+0.2),sy=(0.2+grH(px,pz,5)*0.3)*fe,ry=h3*40,co=Math.cos(ry),si=Math.sin(ry),y=hW(px,pz)-0.02,o=n*16;
      A[o]=sc*co;A[o+1]=0;A[o+2]=-sc*si;A[o+3]=0;A[o+4]=0;A[o+5]=sy;A[o+6]=0;A[o+7]=0;A[o+8]=sc*si;A[o+9]=0;A[o+10]=sc*co;A[o+11]=0;A[o+12]=px;A[o+13]=y;A[o+14]=pz;A[o+15]=1;
      var m=Math.max(Math.abs(px),Math.abs(pz)),c=m<99?pixAt(M.o19,100.06,px,pz):pixAt(M.o17,400.2,px,pz),o3=n*3;
      C[o3]=Math.pow(Math.min(1,c[0]*1.05),2.2);C[o3+1]=Math.pow(Math.min(1,c[1]*1.05),2.2);C[o3+2]=Math.pow(c[2]*0.95,2.2);n++}}
  grassMesh.count=n;grassMesh.instanceMatrix.needsUpdate=true;grassMesh.instanceColor.needsUpdate=true;draw()}
/* Reben (Pergola) nördlich des Eingangs und in den Weinbergen nach OSM */
function buildVines(){
  var posts=[],rows=[],r=mb32(5);
  function row(x0,z0,x1,z1){var L2=Math.hypot(x1-x0,z1-z0),n=Math.max(1,Math.round(L2/2.6)),a=Math.atan2(x1-x0,z1-z0);for(var i=0;i<=n;i++){var t=i/n;posts.push([x0+(x1-x0)*t,z0+(z1-z0)*t])}
    for(i=0;i<n;i++){var t2=(i+0.5)/n;rows.push([x0+(x1-x0)*t2,z0+(z1-z0)*t2,a,L2/n])}}
  [3,5.4,7.8,10.2,12.6,15].forEach(function(vx){var a=b2w(vx,-52),b=b2w(vx,-28);row(a[0],a[1],b[0],b[1])});
  (A.osm&&A.osm.vin||[]).forEach(function(p){var pts=[];for(var i=0;i<p.length;i+=2)pts.push([p[i],p[i+1]]);
    var cx=0,cz=0;pts.forEach(function(q){cx+=q[0];cz+=q[1]});cx/=pts.length;cz/=pts.length;if(Math.hypot(cx,cz)>650)return;
    var best=0,ang=0;for(i=0;i<pts.length-1;i++){var l=Math.hypot(pts[i+1][0]-pts[i][0],pts[i+1][1]-pts[i][1]);if(l>best){best=l;ang=Math.atan2(pts[i+1][0]-pts[i][0],pts[i+1][1]-pts[i][1])}}
    var ux=Math.sin(ang),uz=Math.cos(ang),vx2=uz,vz2=-ux;var mnU=1e9,mxU=-1e9,mnV=1e9,mxV=-1e9;pts.forEach(function(q){var u=(q[0]-cx)*ux+(q[1]-cz)*uz,v=(q[0]-cx)*vx2+(q[1]-cz)*vz2;mnU=Math.min(mnU,u);mxU=Math.max(mxU,u);mnV=Math.min(mnV,v);mxV=Math.max(mxV,v)});
    function inside(x,z){var c=false;for(var a=0,b=pts.length-1;a<pts.length;b=a++){if(((pts[a][1]>z)!==(pts[b][1]>z))&&(x<(pts[b][0]-pts[a][0])*(z-pts[a][1])/(pts[b][1]-pts[a][1])+pts[a][0]))c=!c}return c}
    for(var v=mnV+1.1;v<mxV;v+=2.3){var s=null;for(var u=mnU;u<=mxU+0.01;u+=1.0){var x=cx+ux*u+vx2*v,z=cz+uz*u+vz2*v,ins=inside(x,z);if(ins&&s===null)s=[x,z];if((!ins||u+1>mxU)&&s){if(Math.hypot(x-s[0],z-s[1])>2.5)row(s[0],s[1],x,z);s=null}}}});
  /* Pfähle: verwittertes, graues Holz, leicht unterschiedlich hoch und schief */
  var pM=patch(new THREE.MeshStandardMaterial({color:0x6c645a,roughness:0.92}),{});
  var pI=inst(new THREE.BoxGeometry(0.075,1.85,0.075).translate(0,0.925,0),pM,posts.length,grassG);pI.castShadow=true;pI.receiveShadow=true;
  posts.forEach(function(p,i){DUM.position.set(p[0],hW(p[0],p[1])-0.08,p[1]);DUM.scale.set(1,0.92+r()*0.12,1);DUM.rotation.set((r()-0.5)*0.06,r()*3,(r()-0.5)*0.06);DUM.updateMatrix();pI.setMatrixAt(i,DUM.matrix)});
  pI.instanceMatrix.needsUpdate=true;
  /* Laubwand: drei senkrechte Blattebenen und eine obere, damit die Reihe von allen Seiten dicht und plastisch wirkt;
     darunter die knorrigen Rebstämme, dazwischen zwei Drähte */
  var vt=alphaTex(256,256,function(x,w,h){var q=mb32(77);x.clearRect(0,0,w,h);x.strokeStyle='rgba(92,74,52,1)';x.lineWidth=2.2;
      for(var b=0;b<7;b++){x.beginPath();var y0=h*(0.15+q()*0.7);x.moveTo(0,y0);x.bezierCurveTo(w*0.3,y0+(q()-0.5)*60,w*0.7,y0+(q()-0.5)*60,w,y0+(q()-0.5)*20);x.stroke()}
      for(var k=0;k<170;k++){var cx=q()*w,cy=h*(0.06+q()*0.9),rr=9+q()*10,g=0.7+q()*0.55,a=q()*6.283;
        x.fillStyle='rgb('+Math.floor(Math.min(255,92*g))+','+Math.floor(Math.min(255,134*g))+','+Math.floor(Math.min(255,58*g))+')';
        x.save();x.translate(cx,cy);x.rotate(a);x.beginPath();for(var l=0;l<5;l++){var t0=l/5*6.283;x.lineTo(Math.cos(t0)*rr,Math.sin(t0)*rr);x.lineTo(Math.cos(t0+0.63)*rr*0.55,Math.sin(t0+0.63)*rr*0.55)}x.closePath();x.fill();x.restore()}
      for(var gq=0;gq<9;gq++){var gx=q()*w,gy=h*(0.45+q()*0.4);x.fillStyle='rgb(58,52,70)';for(var gb=0;gb<9;gb++){x.beginPath();x.arc(gx+(q()-0.5)*9,gy+gb*1.8+(q()-0.5)*4,2.6,0,6.283);x.fill()}}},[92,134,58]);vt.wrapS=THREE.RepeatWrapping;
  var vw=[0.06,0,0.02],vo={leaf:0.4,season:0.75,foliage:1,wind:vw,gust:0.1};
  var vM=patch(new THREE.MeshStandardMaterial({map:vt,alphaTest:0.42,side:THREE.DoubleSide,roughness:0.85,envMapIntensity:0.7}),vo);leafMats.push(vM);
  var hp=[],hn=[],hu=[],hi=[],hv=0;function quad(a,b,c,d,n,u0,u1){[a,b,c,d].forEach(function(p,k){hp.push(p[0],p[1],p[2]);hn.push(n[0],n[1],n[2]);hu.push(k===0||k===3?u0:u1,k<2?0:1)});hi.push(hv,hv+1,hv+2,hv,hv+2,hv+3);hv+=4}
  [-0.36,0,0.36].forEach(function(xo){var nx=xo<0?-0.55:(xo>0?0.55:0),nl=Math.hypot(nx,0.8);quad([xo,0,-0.5],[xo,0,0.5],[xo,1,0.5],[xo,1,-0.5],[nx/nl,0.8/nl,0],0,2)});
  quad([-0.42,0.96,-0.5],[-0.42,0.96,0.5],[0.42,1.0,0.5],[0.42,1.0,-0.5],[0,1,0],0,2);
  var hg=new THREE.BufferGeometry();hg.setAttribute('position',new THREE.Float32BufferAttribute(hp,3));hg.setAttribute('normal',new THREE.Float32BufferAttribute(hn,3));hg.setAttribute('uv',new THREE.Float32BufferAttribute(hu,2));hg.setIndex(hi);
  var vI=inst(hg,vM,rows.length,grassG);vI.castShadow=true;vI.receiveShadow=true;vI.customDepthMaterial=depthMat(vt,vw);var col=new THREE.Color();
  rows.forEach(function(q,i){col.setHSL(0.21+r()*0.05,0.32+r()*0.1,0.74+r()*0.08);setI(vI,i,q[0],hW(q[0],q[1])+0.62,q[1],0.62,1.05+r()*0.15,q[3]*0.99,q[2],col)});
  vI.instanceMatrix.needsUpdate=true;if(vI.instanceColor)vI.instanceColor.needsUpdate=true;
  /* Rebstämme (etwa alle 0,9 m) und Drähte */
  var stems=[];rows.forEach(function(q){var n=Math.max(1,Math.round(q[3]/0.9)),sx=Math.sin(q[2]),sz=Math.cos(q[2]);for(var k=0;k<n;k++){var t=(k+0.5)/n-0.5;stems.push([q[0]+sx*t*q[3],q[1]+sz*t*q[3]])}});
  var sM=patch(new THREE.MeshStandardMaterial({color:0x4a3b2e,roughness:0.95}),{});
  var sI=inst(new THREE.CylinderGeometry(0.022,0.04,0.78,5,1,true).translate(0,0.39,0),sM,stems.length,grassG);sI.receiveShadow=true;
  stems.forEach(function(p,i){DUM.position.set(p[0],hW(p[0],p[1])-0.05,p[1]);DUM.scale.set(1,0.85+r()*0.3,1);DUM.rotation.set((r()-0.5)*0.35,r()*3,(r()-0.5)*0.35);DUM.updateMatrix();sI.setMatrixAt(i,DUM.matrix)});
  sI.instanceMatrix.needsUpdate=true;
  var wM=patch(new THREE.MeshStandardMaterial({color:0x3c3f42,roughness:0.5,metalness:0.6}),{});
  var wI2=inst(new THREE.BoxGeometry(0.012,0.012,1),wM,rows.length*2,grassG),wk=0;
  rows.forEach(function(q){var h0=hW(q[0],q[1]);[0.72,1.38].forEach(function(hh){setI(wI2,wk++,q[0],h0+hh,q[1],1,1,q[3]*1.0,q[2])})});
  wI2.instanceMatrix.needsUpdate=true;
}
