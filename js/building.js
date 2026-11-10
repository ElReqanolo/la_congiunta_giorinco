/* La Congiunta 3D – Gebäude nach Plänen und swissBUILDINGS3D: Räume, Laternen, Zellen, Keller, Beschriftungen */
'use strict';
/* ---------- Gebäude: Maße ---------- */
/* Grundriss und Schnitte bei Pireddu [1] S. 126–127 pixelgenau vermessen (Maßstab über die Gesamtlänge), abgeglichen mit swissBUILDINGS3D [7]:
   Breite 5,25 m (Plan 48,8 : 393,7 pt; swisstopo 5,27 m), Raumlängen bis Wandmitte 7,33 / 17,45 / 17,55 m (Anteile 0,1731 / 0,4122 / 0,4147),
   Türen 0,85 × 2,15 m, 0,47 m westlich der Mitte (Plan, Querschnitt und Foto S. 129); Laternen 1,7 m breit, rund 0,42 m westlich der Mitte
   über die ganze Raumlänge (Querschnitte, swisstopo), 1,5 m über dem Dach; Dachstärke rund 0,2 m (Doppellinie im Schnitt); lichte Höhen nach [1] Fußnote 10 */
var W=5.25,TOT=42.4,L=[0.1731*TOT,0.41224*TOT,0.41466*TOT],H=[5.3,3.5,6.6],LW=1.6,LH=1.42,LOFF=-0.42,DOFF=-0.47,T0=0.325,DW=0.85,DH=2.15,CDW=0.7,RT=0.2,EAV=0;
var Wi=W-2*T0,zS=[],zq=-TOT/2;L.forEach(function(l){zS.push(zq);zq+=l});
function zA(i){return zS[i]+(i===0?T0:T0/2)}
function zB(i){return zS[i]+L[i]-(i===2?T0:T0/2)}
/* Zellentrakt: 12,82 m lang, 3,34 m vor der Westwand (Plan und Querschnitt), Dach 4,5 m über dem Boden, innen 4,3 m hoch */
var CX0=-(W/2+3.34),CZ0=TOT/2-12.82,CHH=4.5,zE=TOT/2-T0/2,CP=(zE-(CZ0+T0/2))/4;
function cellZ(k){return zE-(k+0.5)*CP}
/* Untergeschoss (Lager) nach Kellergrundriss und Schnitten [1]: unter Raum 3 und dem ganzen Zellentrakt, Boden 2,44 m unter dem
   Erdgeschoss (lichte Höhe rund 2,2 m). Zugang von aussen: ein 0,87 m breiter Schacht an der Westwand gleich nördlich der Zellen,
   unten ein Podest mit Kellertür (0,85 m) und Kellerfenster (1,6 m), dann eine Treppe, die nach Norden zum Gelände steigt
   (Masse aus dem Kellergrundriss, Abstände von der Südfront: Podest 12,8–17,6 m, Treppe bis 21,0 m) */
var KEL={},KD=2.44,KPX1=-W/2,KPW=0.87,KPT=0.15,KPX0=KPX1-KPW,KPZS=TOT/2-12.82,KPZM=TOT/2-17.64,KPZN=TOT/2-21.04;
/* Oblicht je Zelle: klein, mit senkrechtem Lichteinfall (Märkli im Video [14]); Lage aus dem Schnitt, Grösse rund 1,0 × 0,6 m nach dem Videobild geschätzt */
var SKX0=(CX0+T0-W/2)/2-0.5,SKX1=SKX0+1.0,SKZ=0.3,CEIL_C=CHH-0.2,SKH=0.3;
ROOMS={cx1:-W/2,cz0:CZ0+T0/2,cp:CP,sx0:SKX0,sx1:SKX1,sz:SKZ,ch:CEIL_C,xa:Math.max(LOFF-LW/2,-Wi/2),xb:LOFF+LW/2,r:[]};
for(var ri0=0;ri0<3;ri0++){ROOMS.r.push({y:H[ri0],za:zA(ri0),zb:zB(ri0),zEnd:zS[ri0]+L[ri0]})}
WEATHER_CODE='{float ht_=(vWP.x<'+(-W/2).toFixed(3)+')?'+CHH.toFixed(2)+':((vWP.z<'+f6(zS[1])+')?5.3:((vWP.z<'+f6(zS[2])+')?3.5:6.6));float dt_=max(ht_-vWP.y,0.0);'+
  'float u_=(vWP.x+vWP.z)*4.0;float c_=floor(u_);float r_=fract(sin(c_*12.9898)*43758.5453);float r2_=fract(sin((c_+1.0)*12.9898)*43758.5453);'+
  'float sr_=mix(r_,r2_,smoothstep(0.0,1.0,fract(u_)));float st_=smoothstep(0.5,0.95,sr_)*exp(-dt_*(0.3+0.6*r_))*0.30;'+
  'float bs_=(1.0-smoothstep(0.0,0.5,vWP.y))*0.2;diffuseColor.rgb*=1.0-st_-bs_;diffuseColor.rgb*=mix(vec3(1.0),vec3(0.93,0.98,0.88),bs_*2.0);}\n';
var LANS=[],concs=[],clearMats=[],shells=[],lans=[],tags=[],SO=[],TREEC=[],plexis=[];
/* alle Gebäudeteile liegen in einer Gruppe und werden am Ende pro Material zu wenigen Netzen zusammengeführt */
var bldG=new THREE.Group(),bldExt=new THREE.Group(),bldInt=new THREE.Group();scene.add(bldG);
function alignUV(m,tu,tv){var g=m.geometry,P=g.attributes.position,N=g.attributes.normal,UV=g.attributes.uv;if(!P||!N||!UV||!P.getX||!N.getX||!UV.setXY)return;
  var ry=m.rotation.y||0,c=Math.cos(ry),s=Math.sin(ry),px=m.position.x,py=m.position.y,pz=m.position.z;
  for(var i=0;i<P.count;i++){var x=P.getX(i),y=P.getY(i),z=P.getZ(i),wx=x*c+z*s+px,wy=y+py,wz=-x*s+z*c+pz,nx=N.getX(i),ny=N.getY(i),nz=N.getZ(i),wnx=nx*c+nz*s,wnz=-nx*s+nz*c;
    if(Math.abs(ny)>0.7)UV.setXY(i,wx/tu,wz/tv);else if(Math.abs(wnx)>Math.abs(wnz))UV.setXY(i,(wnx>0?-wz:wz)/tu,wy/tv);else UV.setXY(i,(wnz>0?wx:-wx)/tu,wy/tv)}
  UV.needsUpdate=true}
function inward(g){var ix=g.index.array;for(var i=0;i<ix.length;i+=3){var t=ix[i+1];ix[i+1]=ix[i+2];ix[i+2]=t}var n=g.attributes.normal.array;for(i=0;i<n.length;i++)n[i]=-n[i];g.attributes.normal.needsUpdate=true;return g}
function mergeGroup(G){G.updateMatrixWorld(true);var B={},order=[],nm=new THREE.Matrix3(),v=new THREE.Vector3(),u32=isGL2||!!renderer.extensions.get('OES_element_index_uint');
  G.traverse(function(o){if(!o.isMesh)return;var g=o.geometry,multi=Array.isArray(o.material),mats=multi?o.material:[o.material],pos=g.attributes.position,nor=g.attributes.normal,uv=g.attributes.uv,idx=g.index,cnt=idx?idx.count:pos.count;
    var groups=(multi&&g.groups.length)?g.groups:[{start:0,count:cnt,materialIndex:0}],flip=o.matrixWorld.determinant()<0;nm.getNormalMatrix(o.matrixWorld);
    groups.forEach(function(gr){var m=mats[gr.materialIndex];if(!m||m.visible===false)return;var key=m.uuid+'|'+(o.castShadow?1:0)+(o.receiveShadow?1:0),b=B[key];
      if(!b||b.vc>60000){if(b)key+='+'+order.length;b=B[key]={m:m,cs:o.castShadow,rs:o.receiveShadow,p:[],n:[],u:[],i:[],vc:0};order.push(key)}
      var map=new Int32Array(pos.count).fill(-1),end=Math.min(gr.start+gr.count,cnt),tri=[0,0,0];
      for(var k=gr.start;k+2<end;k+=3){for(var q=0;q<3;q++){var vi=idx?idx.getX(k+q):k+q;
          if(map[vi]<0){map[vi]=b.vc++;v.fromBufferAttribute(pos,vi).applyMatrix4(o.matrixWorld);b.p.push(v.x,v.y,v.z);
            if(nor){v.fromBufferAttribute(nor,vi).applyMatrix3(nm).normalize();b.n.push(v.x,v.y,v.z)}else b.n.push(0,1,0);
            if(uv)b.u.push(uv.getX(vi),uv.getY(vi));else b.u.push(0,0)}tri[q]=map[vi]}
        if(flip)b.i.push(tri[0],tri[2],tri[1]);else b.i.push(tri[0],tri[1],tri[2])}})});
  var old=G.children.slice();old.forEach(function(c){G.remove(c);c.traverse(function(x){if(x.geometry)x.geometry.dispose()})});
  order.forEach(function(key){var b=B[key],g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(b.p,3));g.setAttribute('normal',new THREE.Float32BufferAttribute(b.n,3));g.setAttribute('uv',new THREE.Float32BufferAttribute(b.u,2));
    g.setIndex(b.vc>65535&&u32?new THREE.Uint32BufferAttribute(b.i,1):new THREE.Uint16BufferAttribute(b.i,1));g.computeBoundingSphere();var mm=new THREE.Mesh(g,b.m);mm.castShadow=b.cs;mm.receiveShadow=b.rs;G.add(mm)});
  return order.length}
/* Hindernis für den Rundgang: Grundriss-Rechteck, gültig zwischen den Fusshöhen y0 und y1 (ohne Angabe: Erdgeschoss und darüber) */
function sb(x0,x1,z0,z1,y0,y1){SO.push([Math.min(x0,x1),Math.max(x0,x1),Math.min(z0,z1),Math.max(z0,z1),y0===undefined?-0.6:y0,y1===undefined?99:y1])}
function buildBuilding(T){
  var hid=new THREE.MeshBasicMaterial({visible:false});
  function tx(im,rep){return im?texFrom(im,true,rep!==false):null}
  /* Fototexturen nahtlos machen: Rand aus einer um die halbe Breite versetzten Kopie, Mitte aus dem Original (weich überblendet) */
  function seamless(im,f){if(!im)return im;var w=im.width,h=im.height,c=document.createElement('canvas');c.width=w;c.height=h;var x=c.getContext('2d');
    x.drawImage(im,-w/2,-h/2);x.drawImage(im,w/2,-h/2);x.drawImage(im,-w/2,h/2);x.drawImage(im,w/2,h/2);
    var m=document.createElement('canvas');m.width=w;m.height=h;var mx=m.getContext('2d');mx.drawImage(im,0,0);mx.globalCompositeOperation='destination-in';
    [[w,0],[0,h]].forEach(function(d){var g=mx.createLinearGradient(0,0,d[0],d[1]);g.addColorStop(0,'rgba(0,0,0,0)');g.addColorStop(f,'rgba(0,0,0,1)');g.addColorStop(1-f,'rgba(0,0,0,1)');g.addColorStop(1,'rgba(0,0,0,0)');mx.fillStyle=g;mx.fillRect(0,0,w,h)});
    x.drawImage(m,0,0);return c}
  ['TA','TB','TI','TF'].forEach(function(k){if(T[k])T[k]=seamless(T[k],k==='TF'?0.2:0.14)});
  var tA=tx(T.TA),tB=tx(T.TB),tI=tx(T.TI),tF=tx(T.TF);
  var nA=T.TA?normalFrom(T.TA,7,10):null,nB=T.TB?normalFrom(T.TB,7,10):null,nI=T.TI?normalFrom(T.TI,6,8):null,nF=T.TF?normalFrom(T.TF,3,12):null;
  function std(p,o){var m=new THREE.MeshStandardMaterial(p);return patch(m,o||{})}
  var conc=std({color:new THREE.Color(1.32,1.31,1.28),map:tA,normalMap:nA,normalScale:new THREE.Vector2(0.7,0.7),roughness:0.93,envMapIntensity:1.15},{weather:1,notileu:1});
  var concB=std({color:new THREE.Color(1.32,1.31,1.28),map:tB,normalMap:nB,normalScale:new THREE.Vector2(0.7,0.7),roughness:0.93,envMapIntensity:1.15},{weather:1,notileu:1});
  var concTop=std({color:0x9c9a94,map:tA,roughness:0.97,envMapIntensity:0.8},{});
  concs.push(conc,concB);
  var I={interior:1};
  var intM=std({color:0xf2f0ea,map:tI,normalMap:nI,normalScale:new THREE.Vector2(0.6,0.6),roughness:0.92,envMapIntensity:0.03},{interior:1,notileu:1});
  var floorM=std({color:0xe4e2dc,map:tF,normalMap:nF,normalScale:new THREE.Vector2(0.3,0.3),roughness:0.62,envMapIntensity:0.05},{interior:1,notile:1});
  /* Decke: Unterseite der Holz-Dreischichtplatten, im Video [14] grau; Stahlträger heller grau */
  var ceilM=std({color:0x56595b,roughness:0.85,envMapIntensity:0.02},I);
  var steelI=std({color:0x9a9ea1,roughness:0.55,metalness:0.3,envMapIntensity:0.08},I);
  /* Dachhaut: beschichtete Bitumenbahn (Märkli [14]), dunkel und matt; auch Dachrand und Deckel des Lichtgadens */
  var roofM=std({color:0x2c2c2b,roughness:0.92,metalness:0,envMapIntensity:0.6},{});
  /* Glas der Oberlichter: durchsichtig mit Spiegelung des Himmels; von innen hell wie der Himmel */
  var plexiM=std({color:0x0b0f10,roughness:0.04,metalness:0,envMapIntensity:3.0,side:THREE.DoubleSide,transparent:true,opacity:0.22,depthWrite:false},{plexi:1});
  var steel=std({color:0x6c7276,roughness:0.45,metalness:0.7,envMapIntensity:1},{});
  /* Laternen: Stahlrahmen dunkel gestrichen; Seitenglas durchscheinend bernsteinfarben (von aussen hell, von innen leuchtend) */
  var lanF=std({color:0x7d8184,roughness:0.5,metalness:0.45,envMapIntensity:0.9},{});
  var plexiS=std({color:0xe2d4b2,roughness:0.32,metalness:0,envMapIntensity:1.5,side:THREE.DoubleSide,transparent:true,opacity:0.84,depthWrite:false},{plexi:1});
  var doorM=std({color:0x585c5f,roughness:0.55,metalness:0.55,envMapIntensity:1},{});
  clearMats=[conc,concB,concTop,lanF,roofM];
  function scaleUV(g,w,h,d,tu,tv){tu=tu||2.3;tv=tv||2.3;var uv=g.attributes.uv;for(var f=0;f<6;f++){var su,sv,ox=Math.random(),oy=Math.random();if(f<2){su=d;sv=h}else if(f<4){su=w;sv=d}else{su=w;sv=h}for(var k=0;k<4;k++){var j=f*4+k;uv.setXY(j,uv.getX(j)*su/tu+ox,uv.getY(j)*sv/tv+oy)}}uv.needsUpdate=true}
  function cbox(w,h,d,mat,tu,tv){var g=new THREE.BoxGeometry(w,h,d);scaleUV(g,w,h,d,tu,tv);return new THREE.Mesh(g,mat)}
  function add(m){bldG.add(m);return m}
  var z=-TOT/2;
  L.forEach(function(l,i){
    /* Aussenwände bis zur Dachfläche hochgezogen, alle Baukörper aus demselben Beton (die Dachplatte sitzt bündig zwischen den Wänden) */
    var cm=conc,m=cbox(W,H[i]+RT,l,[cm,(i===2)?hid:cm,hid,cm,(i===2)?cm:hid,hid]);
    m.position.set(0,(H[i]+RT)/2,z+l/2);add(m);shells.push(m);
    var zc0=z+l/2,lf0=(i===0)?EAV:0,lf1=(i===2)?EAV:0,z0=z-lf0,z1=z+l+lf1,xmin=-(W/2+EAV),xmax=W/2+EAV;
    /* Deckenöffnung unter der Laterne von Innenwand zu Innenwand (Innenfoto S. 129: das Licht reicht bis an die Stirnwand) */
    var oa=LOFF-LW/2,ob=LOFF+LW/2,zo0=zA(i),zo1=zB(i),ol=zo1-zo0;zc0=(zo0+zo1)/2;
    function strip(xa,xb,za,zb){var sp=cbox(xb-xa,RT,zb-za,[hid,hid,roofM,ceilM,hid,hid],1,1);sp.position.set((xa+xb)/2,H[i]+RT/2,(za+zb)/2);add(sp)}
    strip(xmin,oa,z0,z1);strip(ob,xmax,z0,z1);strip(oa,ob,z0,zo0);strip(oa,ob,zo1,z1);
    /* Dachrand: dunkler Rand der Bitumenabdeckung über der Wandkrone, 3 cm vorstehend (Video [14]); an einem höheren Nachbarraum keiner */
    var hN0=i===0?0:H[i-1],hS0=i===2?0:H[i+1],re=0.03,ry0=H[i]+RT-0.15,ry1=H[i]+RT+0.03,rh=ry1-ry0,ryc=(ry0+ry1)/2;
    [-1,1].forEach(function(sd){var e=cbox(re,rh,l,roofM,1,1);e.position.set(sd*(W/2+re/2),ryc,z+l/2);add(e)});
    [[z,-1,hN0],[z+l,1,hS0]].forEach(function(e){if(e[2]>H[i])return;var b=cbox(W+2*re,rh,re,roofM,1,1);b.position.set(0,ryc,e[0]+e[1]*re/2);add(b)});
    /* Laterne nach den Fotos (Pireddu S. 126 und 129) und dem Längsschnitt (S. 127): ringsum durchscheinendes Plexiglas in einem
       Stahlrahmen (Pfosten rund alle 1,2 m, Schwelle und Rähm), oben ein Blechdeckel, innen je Feld eine diagonale Zugstange (die
       Diagonale im Laternenkasten der Querschnitte). Die Verglasung läuft über die ganze Raumlänge; an der Aussenwand und über der
       Wand zum niedrigeren Nachbarraum ist die Stirn die hochgezogene Betonwand, am höheren Nachbarn stösst sie an dessen Wand.
       Lüftungsgitter an der Westseite nahe dem Nordende (Foto S. 126, Längsschnitt). Das Licht fällt durch die Seiten. */
    var hN=i===0?0:H[i-1],hS=i===2?0:H[i+1],bN=i===0?T0:(hN<H[i]?T0/2:0),bS=i===2?T0:(hS<H[i]?T0/2:0);
    var gz0=z+bN,gz1=z+l-bS,lL=gz1-gz0,gzc=(gz0+gz1)/2,lB=LW+0.1,y0=H[i]+RT,y1=y0+LH,fw=0.07,nr=Math.max(2,Math.round(lL/1.2)),ly0=y0+fw,ly1=y1-fw,gh=ly1-ly0;
    function frame(w,h,d,x,y,zz){var b=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),lanF);b.position.set(x,y,zz);add(b);return b}
    /* Glas an den langen Seiten, etwas hinter der Rahmenaussenkante */
    [-1,1].forEach(function(sd){var gp=new THREE.Mesh(new THREE.PlaneGeometry(lL-fw,gh).rotateY(sd*Math.PI/2),plexiS);gp.position.set(LOFF+sd*(lB/2-0.02),(ly0+ly1)/2,gzc);add(gp);plexis.push(gp)});
    /* Rahmen: Schwelle und Rähm an beiden Seiten, Pfosten rund alle 1,2 m */
    [y0+fw/2,y1-fw/2].forEach(function(yy){frame(fw,fw,lL,LOFF-lB/2+fw/2,yy,gzc);frame(fw,fw,lL,LOFF+lB/2-fw/2,yy,gzc)});
    for(var k=0;k<=nr;k++){var pz=gz0+fw/2+k*(lL-fw)/nr;frame(fw,LH,fw,LOFF-lB/2+fw/2,y0+LH/2,pz);frame(fw,LH,fw,LOFF+lB/2-fw/2,y0+LH/2,pz)}
    /* Stirnen: hochgezogene Betonwand (Aussenwand oder Wand zum niedrigeren Nachbarn) */
    [[bN,z,1],[bS,z+l-bS,0]].forEach(function(e){if(e[0]<=0)return;var eb=cbox(lB+0.02,LH+0.08,e[0],conc,2.3,2.3);eb.position.set(LOFF,y0+(LH+0.08)/2,e[1]+e[0]/2);add(eb);shells.push(eb)});
    /* Deckel: Blech, 8 cm stark, seitlich 6 cm Überstand; unten dunkel */
    var cap=new THREE.Mesh(new THREE.BoxGeometry(lB+0.12,0.08,lL),[roofM,roofM,roofM,ceilM,roofM,roofM]);cap.position.set(LOFF,y1+0.04,gzc);add(cap);lans.push(cap);
    /* Zugstangen: in jedem Feld eine Diagonale quer über die Laterne, abwechselnd steigend und fallend */
    var dl=Math.hypot(LW,LH);for(k=0;k<nr;k++){var rz=gz0+(k+0.5)*lL/nr,rd=new THREE.Mesh(new THREE.BoxGeometry(dl,0.022,0.022),steelI);rd.position.set(LOFF,y0+LH/2,rz);rd.rotation.z=(k%2?1:-1)*Math.atan2(LH,LW);add(rd)}
    /* Leibung der Deckenöffnung (Dachstärke) */
    var lin=new THREE.Mesh(inward(new THREE.BoxGeometry(LW-0.02,RT+0.02,ol)),[ceilM,ceilM,hid,hid,ceilM,ceilM]);lin.position.set(LOFF,H[i]+RT/2,zc0);add(lin);
    /* Lüftungsgitter an der Westseite nahe dem Nordende */
    var vz=gz0+0.75,vx=LOFF-lB/2-0.012,vt=new THREE.Mesh(new THREE.BoxGeometry(0.03,0.42,0.5),lanF);vt.position.set(vx,y0+LH*0.55,vz);add(vt);
    for(k=0;k<6;k++){var lv=new THREE.Mesh(new THREE.BoxGeometry(0.05,0.012,0.46),steel);lv.position.set(vx-0.025,y0+LH*0.55-0.17+k*0.068,vz);lv.rotation.z=-0.5;add(lv)}
    LANS.push({x0:LOFF-lB/2,x1:LOFF+lB/2,z0:gz0,z1:gz1,y0:y0,y1:y1});
    var nb=Math.floor(ol/1.2);
    for(k=0;k<nb;k++){var bm=new THREE.Mesh(new THREE.BoxGeometry(Wi+0.2,0.28,0.14),steelI);bm.position.set(0,H[i]-0.14,zo0+(k+0.5)*ol/nb);add(bm)}
    tags.push({m:1,p:new THREE.Vector3(0,H[i]+RT+LH+1.2,zc0),t:'Raum '+(i+1)+' · '+H[i].toFixed(2).replace('.',',')+' m'});
    z+=l;
  });
  var fg=new THREE.PlaneGeometry(W-0.02,TOT-0.02),fuv=fg.attributes.uv;for(var fi=0;fi<fuv.count;fi++)fuv.setXY(fi,fuv.getX(fi)*W/3,fuv.getY(fi)*TOT/3);
  var floor=new THREE.Mesh(fg,floorM);floor.rotation.x=-Math.PI/2;floor.position.y=0.03;add(floor);
  /* Zellentrakt an der Westseite von Raum 3 */
  var cw=-W/2-CX0,czm=(CZ0+TOT/2)/2,cl=TOT/2-CZ0;
  var cb=cbox(cw,CHH,cl,[hid,conc,hid,conc,conc,conc]);cb.position.set((CX0-W/2)/2,CHH/2,czm);add(cb);shells.push(cb);
  /* Dach des Zellentrakts mit den vier Öffnungen der Oberlichter (sonst fiele kein Sonnenlicht in die Zellen) */
  var crs=new THREE.Shape();crs.moveTo(CX0,-TOT/2);crs.lineTo(-W/2,-TOT/2);crs.lineTo(-W/2,-CZ0);crs.lineTo(CX0,-CZ0);crs.lineTo(CX0,-TOT/2);
  for(var ch3=0;ch3<4;ch3++){var cz3=cellZ(ch3),hp3=new THREE.Path();hp3.moveTo(SKX0,-(cz3+SKZ));hp3.lineTo(SKX1,-(cz3+SKZ));hp3.lineTo(SKX1,-(cz3-SKZ));hp3.lineTo(SKX0,-(cz3-SKZ));hp3.lineTo(SKX0,-(cz3+SKZ));crs.holes.push(hp3)}
  var crg=new THREE.ShapeGeometry(crs),cru=crg.attributes.uv;for(var cu=0;cu<cru.count;cu++)cru.setXY(cu,cru.getX(cu)/2.3,cru.getY(cu)/2.3);crg.rotateX(-Math.PI/2);
  var crf=new THREE.Mesh(crg,roofM);crf.position.y=CHH;add(crf);
  /* Dachrand des Zellentrakts: Westseite und beide Stirnen */
  (function(){var re=0.03,ry0=CHH-0.15,ry1=CHH+0.03,rh=ry1-ry0,ryc=(ry0+ry1)/2,e=cbox(re,rh,cl+2*re,roofM,1,1);e.position.set(CX0-re/2,ryc,czm);add(e);
    [[CZ0,-1],[TOT/2,1]].forEach(function(q){var b=cbox(cw+re,rh,re,roofM,1,1);b.position.set((CX0-re-W/2)/2,ryc,q[0]+q[1]*re/2);add(b)})})();
  for(var ck=0;ck<4;ck++){
    var cz=cellZ(ck),iw=cw-T0,il=CP-T0;
    var ci=new THREE.Mesh(inward(new THREE.BoxGeometry(iw,CEIL_C,il)),[hid,intM,hid,hid,intM,intM]);
    ci.position.set(CX0+T0+iw/2,CEIL_C/2,cz);add(ci);
    var shp=new THREE.Shape();shp.moveTo(-iw/2,-il/2);shp.lineTo(iw/2,-il/2);shp.lineTo(iw/2,il/2);shp.lineTo(-iw/2,il/2);shp.lineTo(-iw/2,-il/2);
    var hx0=SKX0-(CX0+T0+iw/2)+0.03,hx1=SKX1-(CX0+T0+iw/2)-0.03,sz2=SKZ-0.03,hole=new THREE.Path();hole.moveTo(hx0,-sz2);hole.lineTo(hx1,-sz2);hole.lineTo(hx1,sz2);hole.lineTo(hx0,sz2);hole.lineTo(hx0,-sz2);shp.holes.push(hole);
    var cg=new THREE.ShapeGeometry(shp);cg.rotateX(Math.PI/2);var cm2=new THREE.Mesh(cg,ceilM);cm2.position.set(CX0+T0+iw/2,CEIL_C-0.002,cz);add(cm2);
    var sk=cbox(SKX1-SKX0+0.16,SKH,2*SKZ+0.16,[conc,conc,hid,hid,conc,conc],1,1);sk.position.set((SKX0+SKX1)/2,CHH+SKH/2,cz);add(sk);shells.push(sk);
    var ski=new THREE.Mesh(inward(new THREE.BoxGeometry(SKX1-SKX0,CHH-CEIL_C+SKH-0.01,2*SKZ)),[ceilM,ceilM,hid,hid,ceilM,ceilM]);ski.position.set((SKX0+SKX1)/2,(CEIL_C+CHH+SKH)/2,cz);add(ski);
    var spx=new THREE.Mesh(new THREE.PlaneGeometry(SKX1-SKX0+0.16,2*SKZ+0.16).rotateX(-Math.PI/2),plexiM);spx.position.set((SKX0+SKX1)/2,CHH+SKH+0.012,cz);add(spx);plexis.push(spx);
    /* Rahmen um das Glas des Oberlichts (Stahlwinkel) und eine Mittelsprosse */
    var sw=SKX1-SKX0+0.16,sl=2*SKZ+0.16,sxm=(SKX0+SKX1)/2;
    [[sw,0.06,sxm,cz-sl/2+0.03],[sw,0.06,sxm,cz+sl/2-0.03],[0.06,sl,SKX0-0.05,cz],[0.06,sl,SKX1+0.05,cz],[sw,0.04,sxm,cz]].forEach(function(f){var fb=new THREE.Mesh(new THREE.BoxGeometry(f[0],0.05,f[1]),lanF);fb.position.set(f[2],CHH+SKH+0.025,f[3]);add(fb)});
  }
  var cfg=new THREE.PlaneGeometry(-W/2-(CX0+T0)+0.02,TOT/2-T0/2-(CZ0+T0/2)),cfu=cfg.attributes.uv;for(var cf=0;cf<cfu.count;cf++)cfu.setXY(cf,cfu.getX(cf)*3.35/3,cfu.getY(cf)*12.5/3);
  var cfl=new THREE.Mesh(cfg,floorM);cfl.rotation.x=-Math.PI/2;cfl.position.set((CX0+T0-W/2)/2,0.03,(CZ0+T0/2+TOT/2-T0/2)/2);add(cfl);
  /* Eingang (offene Stahltür, Stufe) */
  var door=new THREE.Mesh(new THREE.BoxGeometry(DW,DH,0.06),doorM);door.position.set(DOFF+DW/2-0.02,DH/2,-TOT/2-DW/2);door.rotation.y=Math.PI/2;add(door);
  var sill=cbox(DW+0.1,0.14,0.4,conc);sill.position.set(DOFF,0.07,-TOT/2-0.2);add(sill);
  /* Innenwände mit Türöffnungen */
  function wallGeo(w,h,holes,off,tu,tv){tu=tu||2;tv=tv||3.4;
    var sh=new THREE.Shape();sh.moveTo(0,0);sh.lineTo(w,0);sh.lineTo(w,h);sh.lineTo(0,h);sh.lineTo(0,0);
    holes.forEach(function(o){var hp=new THREE.Path();hp.moveTo(o.x,0.01);hp.lineTo(o.x,o.h);hp.lineTo(o.x+o.w,o.h);hp.lineTo(o.x+o.w,0.01);hp.lineTo(o.x,0.01);sh.holes.push(hp)});
    var g=new THREE.ShapeGeometry(sh),uv=g.attributes.uv,ps=g.attributes.position;for(var a=0;a<uv.count;a++)uv.setXY(a,ps.getX(a)/tu+off,ps.getY(a)/tv);return g}
  function wall(w,h,holes,x,zz,ry){var m=new THREE.Mesh(wallGeo(w,h,holes,Math.random()),intM);m.position.set(x,0,zz);m.rotation.y=ry;add(m)}
  function rvl(x,zz,alongZ,dw){var dw_=dw||DW;
    [-dw_/2,dw_/2].forEach(function(o){var b=new THREE.Mesh(alongZ?new THREE.BoxGeometry(0.05,DH,T0):new THREE.BoxGeometry(T0,DH,0.05),intM);b.position.set(alongZ?x+o:x,DH/2,alongZ?zz:zz+o);add(b)});
    var t=new THREE.Mesh(alongZ?new THREE.BoxGeometry(dw_+0.1,0.05,T0):new THREE.BoxGeometry(T0,0.05,dw_+0.1),intM);t.position.set(x,DH+0.025,zz);add(t)}
  for(var ri=0;ri<3;ri++){
    var a0=zA(ri),b0=zB(ri),h0=H[ri],len=b0-a0,wh=[];
    if(ri===2){for(var ck2=0;ck2<4;ck2++){var zd=cellZ(ck2);wh.push({x:b0-zd-CDW/2,w:CDW,h:DH});rvl(-(W/2-T0/2),zd,false,CDW)}}
    wall(len,h0,wh,-Wi/2,b0,Math.PI/2);
    wall(len,h0,[],Wi/2,a0,-Math.PI/2);
    wall(Wi,h0,[{x:DOFF+Wi/2-DW/2,w:DW,h:DH}],-Wi/2,a0,0);
    wall(Wi,h0,ri<2?[{x:Wi/2-DOFF-DW/2,w:DW,h:DH}]:[],Wi/2,b0,Math.PI);
    if(ri<2)rvl(DOFF,(b0+zA(ri+1))/2,true);
  }
  function xp(w,h,base,x,zz,ry,mat){var m=new THREE.Mesh(wallGeo(w,h,[],Math.random(),2.3,2.3),mat||conc);m.position.set(x,base,zz);m.rotation.y=ry;add(m);shells.push(m)}
  for(var ck4=0;ck4<4;ck4++){var cz4=cellZ(ck4),il4=CP-T0;wall(il4,CEIL_C,[{x:il4/2-CDW/2,w:CDW,h:DH}],-W/2-0.002,cz4-il4/2,-Math.PI/2)}
  xp(W,H[0]-H[1],H[1]+RT,-W/2,zS[1],0);
  xp(W,H[2]-H[1],H[1]+RT,W/2,zS[2],Math.PI);
  xp(CZ0-zS[2],H[2]+RT,0,-W/2,zS[2],-Math.PI/2);
  xp(TOT/2-CZ0,H[2]+RT-CHH,CHH,-W/2,CZ0,-Math.PI/2);
  var ew=new THREE.Mesh(wallGeo(W,H[0]+RT,[{x:W/2-DOFF-DW/2,w:DW,h:DH}],Math.random(),2.3,2.3),conc);ew.position.set(W/2,0,-TOT/2);ew.rotation.y=Math.PI;add(ew);shells.push(ew);
  rvl(DOFF,-TOT/2+T0/2,true);
  /* Keller (begehbar): Schacht an der Westwand mit Stützmauer, Podest und 13 Stufen; unten eine 1,6 m breite Öffnung in den Lagerraum
     unter Raum 3 (offene Doppeltür) und eine schmale Tür in der Nordwand des Kellers unter den Zellen (schlägt in den Schacht auf,
     wie der Türbogen im Kellergrundriss). Keine Verbindung ins Museum. Licht: zwei Leuchtstoffröhren je Raum (angenommen). */
  (function(){
    /* Materialien: von den Röhren gleichmässig beleuchtet (selbstleuchtend), die Sonne erreicht den Keller nicht */
    function kMat(tex,k){return std({color:0x0b0b0b,map:tex,roughness:0.95,metalness:0,envMapIntensity:0.02,emissive:new THREE.Color(k,k,k*0.97),emissiveMap:tex},{})}
    var kWM=kMat(tI,0.46),kFM=kMat(tB,0.34),kCM=std({color:0x0b0b0b,roughness:0.9,emissive:new THREE.Color(0.16,0.16,0.155)},{});
    var neonM=new THREE.MeshBasicMaterial({color:0xf4f6ff});
    function plane(w,h,mat,x,y,z,ry,rx,holes){var sh=new THREE.Shape();sh.moveTo(0,0);sh.lineTo(w,0);sh.lineTo(w,h);sh.lineTo(0,h);sh.lineTo(0,0);
      (holes||[]).forEach(function(o){var hp=new THREE.Path();hp.moveTo(o[0],o[1]);hp.lineTo(o[2],o[1]);hp.lineTo(o[2],o[3]);hp.lineTo(o[0],o[3]);hp.lineTo(o[0],o[1]);sh.holes.push(hp)});
      var g=new THREE.ShapeGeometry(sh),u=g.attributes.uv,ps=g.attributes.position;for(var a=0;a<u.count;a++)u.setXY(a,ps.getX(a)/2.3,ps.getY(a)/2.3);
      var m=new THREE.Mesh(g,mat);m.position.set(x,y,z);m.rotation.order='YXZ';m.rotation.y=ry||0;m.rotation.x=rx||0;add(m);return m}
    var ceil=-0.23,kh=KD+ceil;
    /* Öffnungen (Abstände von der Südfront nach dem Kellergrundriss) */
    var oz0=TOT/2-16.61,oz1=TOT/2-14.99,oh=2.0,dx0=KPX0+0.035,dx1=KPX0+0.835;KEL.oz=[oz0,oz1];KEL.dx=[dx0,dx1];
    /* Schacht: Gebäudewand mit Öffnung, Stützmauer, Nordwand des Zellenkellers mit Tür, Podest, Stufen */
    plane(KPZS-KPZN,KD,conc,KPX1,-KD,KPZN,-Math.PI/2,0,[[oz0-KPZN,0.01,oz1-KPZN,oh]]);
    plane(KPW+KPT,KD,conc,KPX1,-KD,KPZS,Math.PI,0,[[KPX1-dx1,0.01,KPX1-dx0,oh]]);
    var rw=cbox(KPT,KD+0.05,KPZS-KPZN,conc);rw.position.set(KPX0-KPT/2,(0.05-KD)/2,(KPZS+KPZN)/2);add(rw);
    var lf=cbox(KPW,0.2,KPZS-KPZM,concB);lf.position.set((KPX0+KPX1)/2,-KD-0.1,(KPZS+KPZM)/2);add(lf);
    var ns=13,run=(KPZM-KPZN)/ns;for(var k=0;k<ns;k++){var top=-KD+(k+1)*KD/ns,st=cbox(KPW,top+KD+0.2,run,concB,1,1);st.position.set((KPX0+KPX1)/2,(top-KD-0.2)/2,KPZM-(k+0.5)*run);add(st)}
    /* Leibungen der beiden Öffnungen */
    [[oz0,oz1]].forEach(function(o){var a=cbox(T0,oh,0.02,conc);a.position.set(KPX1+T0/2,-KD+oh/2,o[0]);add(a);var b=cbox(T0,oh,0.02,conc);b.position.set(KPX1+T0/2,-KD+oh/2,o[1]);add(b);var c=cbox(T0,0.02,o[1]-o[0],conc);c.position.set(KPX1+T0/2,-KD+oh,(o[0]+o[1])/2);add(c)});
    [[dx0,dx1]].forEach(function(o){var a=cbox(0.02,oh,T0,conc);a.position.set(o[0],-KD+oh/2,KPZS+T0/2);add(a);var b=cbox(0.02,oh,T0,conc);b.position.set(o[1],-KD+oh/2,KPZS+T0/2);add(b);var c=cbox(o[1]-o[0],0.02,T0,conc);c.position.set((o[0]+o[1])/2,-KD+oh,KPZS+T0/2);add(c)});
    /* Türen: Doppeltür zum Lager nach innen ganz aufgeschlagen, schmale Tür in den Schacht aufgeschlagen (an der Gebäudewand) */
    var hw=(oz1-oz0)/2;[[oz0-hw/2],[oz1+hw/2]].forEach(function(o){var d=new THREE.Mesh(new THREE.BoxGeometry(0.05,oh-0.02,hw-0.02),doorM);d.position.set(-Wi/2+0.04,-KD+oh/2,o[0]);add(d)});
    var nd=new THREE.Mesh(new THREE.BoxGeometry(0.05,oh-0.02,dx1-dx0-0.02),doorM);nd.position.set(KPX1-0.04,-KD+oh/2,KPZS-(dx1-dx0)/2);add(nd);
    /* Lager unter Raum 3: innen so breit wie der Raum darüber (4,6 m), von der Wand zu Raum 2 bis zur Südwand */
    var mz0=zS[2]+T0/2,mz1=TOT/2-T0,ml=mz1-mz0;
    plane(Wi,ml,kFM,-Wi/2,-KD+0.002,mz1,0,-Math.PI/2);
    plane(Wi,ml,kCM,-Wi/2,ceil,mz0,0,Math.PI/2);
    plane(ml,kh,kWM,Wi/2,-KD,mz0,-Math.PI/2,0);
    plane(ml,kh,kWM,-Wi/2,-KD,mz1,Math.PI/2,0,[[mz1-oz1,0.01,mz1-oz0,oh]]);
    plane(Wi,kh,kWM,Wi/2,-KD,mz1,Math.PI,0);
    plane(Wi,kh,kWM,-Wi/2,-KD,mz0,0,0);
    /* Keller unter den Zellen: innen von der Westwand des Trakts bis zur Westwand von Raum 3 */
    var cx0=CX0+T0,cx1=-W/2,cz0=KPZS+T0,cz1=TOT/2-T0,cw=cx1-cx0,cl=cz1-cz0;
    plane(cw,cl,kFM,cx0,-KD+0.002,cz1,0,-Math.PI/2);
    plane(cw,cl,kCM,cx0,ceil,cz0,0,Math.PI/2);
    plane(cl,kh,kWM,cx1,-KD,cz0,-Math.PI/2,0);
    plane(cl,kh,kWM,cx0,-KD,cz1,Math.PI/2,0);
    plane(cw,kh,kWM,cx1,-KD,cz1,Math.PI,0);
    plane(cw,kh,kWM,cx0,-KD,cz0,0,0,[[dx0-cx0,0.01,dx1-cx0,oh]]);
    /* Leuchtstoffröhren an der Decke */
    [[0,mz0+ml*0.3],[0,mz0+ml*0.7],[(cx0+cx1)/2,cz0+cl*0.3],[(cx0+cx1)/2,cz0+cl*0.7]].forEach(function(q){var t=new THREE.Mesh(new THREE.BoxGeometry(0.07,0.05,1.5),neonM);t.position.set(q[0],ceil-0.04,q[1]);add(t)});
    /* Kollisionen: Stützmauer auf allen Höhen; Kellerwände nur im Keller (Höhe der Füsse unter -0,4 m) */
    sb(KPX0-KPT,KPX0,KPZN-0.2,KPZS,-9,99);
    var KB=-9,KT=-0.4;
    sb(-W/2,-W/2+T0,KPZN,oz0,KB,KT);sb(-W/2,-W/2+T0,oz1,TOT/2,KB,KT);
    sb(W/2-T0,W/2,zS[2],TOT/2,KB,KT);sb(CX0,W/2,TOT/2-T0,TOT/2,KB,KT);sb(-W/2,W/2,zS[2]-T0/2,zS[2]+T0/2,KB,KT);
    sb(CX0,CX0+T0,KPZS,TOT/2,KB,KT);sb(CX0,dx0,KPZS,KPZS+T0,KB,KT);sb(dx1,-W/2,KPZS,KPZS+T0,KB,KT);
  })();
  /* Exponate nach Josephsohn: Reliefs an den Wänden, Halbfiguren auf Betonsockeln, rund 0,7 m hoch und von der Wand abgerückt (Video [14]; Form und Lage angenähert) */
  exMaterial();
  EXS.forEach(function(sp,i){var tile=EXA.tiles[i],gp=new THREE.Group(),m;
    if(sp.k==='fig'){m=new THREE.Mesh(figGeo(sp,tile),exM);gp.position.set(sp.x,sp.base,sp.z);
      var bs=cbox(0.66,sp.base,0.54,intM);bs.position.set(sp.x,sp.base/2,sp.z);bs.rotation.y=sp.ry;add(bs);sb(sp.x-0.4,sp.x+0.4,sp.z-0.4,sp.z+0.4)}
    else{m=new THREE.Mesh(relGeo(sp,tile),exM);gp.position.set(sp.x,sp.y,sp.z)}
    /* innen gibt es kein direktes Sonnenlicht, also werfen die Exponate keinen Sonnenschatten */
    gp.rotation.y=sp.ry;gp.add(m);m.castShadow=false;m.receiveShadow=false;bldG.add(gp)});
  /* Beschriftungen */
  tags.push({p:new THREE.Vector3(DOFF,3.4,-TOT/2-1.6),t:'Eingang (Nordseite)'});
  tags.push({m:1,p:new THREE.Vector3((CX0-W/2)/2,CHH+1.6,cellZ(1.5)),t:'4 Zellen · Trakt ≈ 12,8 × 3,35 m, 4,3 m hoch'});
  tags.push({m:1,p:new THREE.Vector3(W/2+2.2,0.6,-6),t:'Länge ≈ 42,4 m · Luftbild'});
  tags.push({m:1,p:new THREE.Vector3(0,0.6,TOT/2+2.4),t:'Breite 5,25 m außen · innen ≈ 4,6 m'});
  tags.push({m:1,p:new THREE.Vector3(-1.2,-1.3,(zS[2]+TOT/2)/2+2),t:'Untergeschoss (Lager) · ≈ 2,2 m hoch'});
  tags.push({m:1,p:new THREE.Vector3((KPX0+KPX1)/2,0.9,(KPZS+KPZM)/2),t:'Kellerzugang'});
  var person=new THREE.Group(),skin=std({color:0xc89a78,roughness:0.7},{}),cloth=std({color:0x2d4f73,roughness:0.85},{}),pants=std({color:0x2b2a28,roughness:0.9},{});
  var legs=new THREE.Mesh(new THREE.CylinderGeometry(0.15,0.12,0.85,10),pants);legs.position.y=0.43;
  var torso=new THREE.Mesh(new THREE.CylinderGeometry(0.19,0.16,0.66,12),cloth);torso.position.y=1.17;
  var hd=new THREE.Mesh(new THREE.SphereGeometry(0.11,16,12),skin);hd.position.y=1.63;
  person.add(legs,torso,hd);person.position.set(2.2,0,-TOT/2-3);add(person);
  tags.push({m:1,p:new THREE.Vector3(2.2,2.25,-TOT/2-3),t:'Person 1,75 m (Maßstab)'});
  /* Dachränder: schmale Blechabdeckung auf der Wandkrone, nur wo die Wand frei endet (nicht dort, wo ein höherer Raum anschliesst) */
  var copM=std({color:0x55585a,roughness:0.5,metalness:0.55,envMapIntensity:0.9},{}),cw2=T0+0.05,ch2=0.05;
  function cop(w,d,x,y,zz){var c=new THREE.Mesh(new THREE.BoxGeometry(w,ch2,d),copM);c.position.set(x,y+ch2/2,zz);add(c)}
  for(var ci2=0;ci2<3;ci2++){var yt2=H[ci2]+RT,za2=zS[ci2],zb2=zS[ci2]+L[ci2];
    cop(cw2,L[ci2],W/2-T0/2+0.025,yt2,(za2+zb2)/2);cop(cw2,L[ci2],-W/2+T0/2-0.025,yt2,(za2+zb2)/2);
    if(ci2===0)cop(W+0.05,cw2,0,yt2,za2+T0/2-0.025);if(ci2===2)cop(W+0.05,cw2,0,yt2,zb2-T0/2+0.025);
    if(ci2===0)cop(W,cw2,0,yt2,zb2-T0/2+0.025);if(ci2===2)cop(W,cw2,0,yt2,za2+T0/2-0.025)}
  /* Schalungsbild an allen Aussenwänden nach Weltkoordinaten: die Bretterfugen laufen über Ecken und von Baukörper zu Baukörper durch */
  shells.forEach(function(m){alignUV(m,2.3,2.3)});
  bldG.children.forEach(function(o){if(o.isMesh){o.castShadow=true;o.receiveShadow=true}});
  plexis.forEach(function(p){p.castShadow=false});
  /* Wände und Dächer werfen mit Vorder- und Rückseite Schatten: so dick, dass an Wandfuss und Deckenrand kein Sonnenlicht durchsickert */
  bldG.traverse(function(o){if(o.isMesh&&o.castShadow&&o.material){(Array.isArray(o.material)?o.material:[o.material]).forEach(function(m){if(m&&!m.transparent)m.shadowSide=THREE.DoubleSide})}});
  var nParts=bldG.children.length,nM=mergeGroup(bldG);logPush('zeit','Gebäude: '+nParts+' Teile zu '+nM+' Netzen zusammengeführt');
  /* außen und innen getrennt, damit beim Start die Shader in zwei kleineren Portionen übersetzt werden */
  bldG.children.slice().forEach(function(m){var f=m.material&&m.material.userData&&m.material.userData.lcF||[];bldG.remove(m);(f.indexOf('interior')>=0?bldInt:bldExt).add(m)});bldG.add(bldExt,bldInt);
  /* Kollisionen für den Rundgang */
  var t=T0,gp=DW/2;
  function cross(zc,gaps){var cur=-W/2;gaps.forEach(function(g){sb(cur,g-gp,zc-t/2,zc+t/2);cur=g+gp});sb(cur,W/2,zc-t/2,zc+t/2)}
  cross(-TOT/2+t/2,[DOFF]);cross(zS[1],[DOFF]);cross(zS[2],[DOFF]);cross(TOT/2-t/2,[]);
  sb(W/2-t,W/2,-TOT/2,TOT/2);
  var cur=-TOT/2,dHalf=CDW/2;[3,2,1,0].forEach(function(k){var g=cellZ(k);sb(-W/2,-W/2+t,cur,g-dHalf);cur=g+dHalf});sb(-W/2,-W/2+t,cur,TOT/2);
  for(var k5=0;k5<5;k5++)sb(CX0,-W/2,zE-CP*k5-t/2,zE-CP*k5+t/2);
  sb(CX0,CX0+t,CZ0,TOT/2);
}
