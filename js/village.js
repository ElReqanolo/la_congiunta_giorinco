/* La Congiunta 3D – Dorf, Bahn, Brücken, Leitungen, Feldweg und Ortsmarken */
'use strict';
/* ---------- Dorf: Häuser aus OpenStreetMap, Dachfarbe aus dem Luftbild ---------- */
FACADE_MAP='{vec4 tx_=mapTexelToLinear(texture2D(map,vUv));diffuseColor.rgb=mix(tx_.rgb,diffuseColor.rgb*vColor*(0.78+0.3*tx_.r),tx_.a);}';
var envTags=[];
var vilG=new THREE.Group(),infG=new THREE.Group();env.add(vilG,infG);
function facadeTex(){return canvasTex(256,256,function(x,w,h){var r=mb32(77),i;
  x.fillStyle='rgba(255,255,255,1)';x.fillRect(0,0,w,h);
  for(i=0;i<1600;i++){var g=200+Math.floor(r()*55);x.fillStyle='rgba('+g+','+g+','+g+',1)';x.fillRect(r()*w,r()*h,1+r()*3,1+r()*3)}
  var wx=w*0.33,ww=w*0.34,wy=h*0.22,wh=h*0.46;
  x.clearRect(wx-26,wy-6,ww+52,wh+12);
  x.fillStyle='rgba(84,98,86,1)';x.fillRect(wx-26,wy-4,24,wh+8);x.fillRect(wx+ww+2,wy-4,24,wh+8);
  x.fillStyle='rgba(60,72,62,1)';for(i=0;i<9;i++){x.fillRect(wx-24,wy+i*wh/9,20,2);x.fillRect(wx+ww+4,wy+i*wh/9,20,2)}
  x.fillStyle='rgba(232,230,224,1)';x.fillRect(wx-3,wy-3,ww+6,wh+6);
  x.fillStyle='rgba(32,36,40,1)';x.fillRect(wx+3,wy+3,ww-6,wh-6);
  x.fillStyle='rgba(232,230,224,1)';x.fillRect(wx+ww/2-2,wy+3,4,wh-6);x.fillRect(wx+3,wy+wh*0.45,ww-6,3);
  x.fillStyle='rgba(120,116,108,1)';x.fillRect(wx-6,wy+wh+3,ww+12,6);
},true)}
function stoneTex(){return canvasTex(256,256,function(x,w,h){var r=mb32(91);x.fillStyle='#5b5650';x.fillRect(0,0,w,h);
  for(var y=0;y<h;){var rh=10+r()*16;for(var xx=-r()*30;xx<w;){var rw=18+r()*34,g=118+Math.floor(r()*70),t=Math.floor(r()*14)-7;x.fillStyle='rgb('+(g+t)+','+(g)+','+(g-t-4)+')';x.fillRect(xx+1.5,y+1.5,rw-3,rh-3);xx+=rw}y+=rh}},true)}
function roofTex(){return canvasTex(256,256,function(x,w,h){var r=mb32(55);x.fillStyle='#8a8a8a';x.fillRect(0,0,w,h);
  for(var y=0;y<h;y+=16){for(var xx=-r()*20;xx<w;){var sw=16+r()*26,g=150+Math.floor(r()*80);x.fillStyle='rgb('+g+','+g+','+g+')';x.fillRect(xx+1,y+1,sw-2,15);x.fillStyle='rgba(0,0,0,0.25)';x.fillRect(xx,y+14,sw,2);xx+=sw}}},true)}
function hex2lin(h){return new THREE.Color('#'+h).convertSRGBToLinear()}
/* Gebäude im Dorf entlang des Wegs nach swissBUILDINGS3D 2.0 (swisstopo): echte Grundrisse, Höhen und Dachformen.
   Kodierung (A.s3d, Base64): 'S3D1', Anzahl; je Gebäude Art, Flags, Ecken, Dreiecke; dann alle Ecken als int16 in 5 cm
   (x Ost, y Höhe über 398,1 m, z Süd), dann die Dreiecke je Gebäude (uint8, mit Flag uint16). Arten: 0 Wohnhaus, 1 offenes
   Gebäude, 2 Kirche, 3 Kapelle, 4 grosse Mauer, 5 Turm, 6 Kirchturm. Ausgelassen sind Gebäude weiter als 200 m vom Weg und La Congiunta selbst. */
function s3dLoad(){var s=A.s3d;if(!s)return [];var bin;try{bin=atob(s)}catch(e){return []}
  var u=new Uint8Array(bin.length),i,j;for(i=0;i<bin.length;i++)u[i]=bin.charCodeAt(i);
  if(u[0]!==83||u[1]!==51||u[2]!==68||u[3]!==49)return [];var dv=new DataView(u.buffer),n=dv.getUint16(4,true),o=6,T=[],B=[];
  for(i=0;i<n;i++){T.push([u[o],u[o+1],dv.getUint16(o+2,true),dv.getUint16(o+4,true)]);o+=6}
  T.forEach(function(t){var v=new Float32Array(t[2]*3);for(j=0;j<v.length;j++){v[j]=dv.getInt16(o,true)*0.05;o+=2}B.push({t:t[0],v:v})});
  T.forEach(function(t,k){var f=new Uint16Array(t[3]*3);for(j=0;j<f.length;j++){if(t[1]&1){f[j]=dv.getUint16(o,true);o+=2}else f[j]=u[o++]}B[k].f=f});
  B.forEach(function(b){var v=b.v,x0=1e9,x1=-1e9,z0=1e9,z1=-1e9,y0=1e9,y1=-1e9,sx=0,sy=0,sz=0,m=v.length/3;
    for(j=0;j<v.length;j+=3){x0=Math.min(x0,v[j]);x1=Math.max(x1,v[j]);y0=Math.min(y0,v[j+1]);y1=Math.max(y1,v[j+1]);z0=Math.min(z0,v[j+2]);z1=Math.max(z1,v[j+2]);sx+=v[j];sy+=v[j+1];sz+=v[j+2]}
    b.bb=[x0,x1,z0,z1];b.y0=y0;b.y1=y1;b.c=[sx/m,sy/m,sz/m]});
  return B}
function buildVillage(){
  var B=(A.osm&&A.osm.bld)||[],S3=s3dLoad();
  /* OSM-Häuser nur dort, wo swissBUILDINGS3D nichts hat */
  function inS3(x,z){for(var i=0;i<S3.length;i++){var bb=S3[i].bb;if(x>bb[0]-0.5&&x<bb[1]+0.5&&z>bb[2]-0.5&&z<bb[3]+0.5)return true}return false}
  var WP={p:[],n:[],u:[],c:[]},WS={p:[],n:[],u:[],c:[]},RF={p:[],n:[],u:[],c:[]};
  function vtx(G,x,y,z,nx,ny,nz,u,v,c){G.p.push(x,y,z);G.n.push(nx,ny,nz);G.u.push(u,v);G.c.push(c.r,c.g,c.b)}
  function tri(G,a,b,c,col){var e1=[b[0]-a[0],b[1]-a[1],b[2]-a[2]],e2=[c[0]-a[0],c[1]-a[1],c[2]-a[2]],n=[e1[1]*e2[2]-e1[2]*e2[1],e1[2]*e2[0]-e1[0]*e2[2],e1[0]*e2[1]-e1[1]*e2[0]],l=Math.hypot(n[0],n[1],n[2])||1;
    [a,b,c].forEach(function(p){vtx(G,p[0],p[1],p[2],n[0]/l,n[1]/l,n[2]/l,p[3],p[4],col)})}
  function triOut(G,a,b,c,out,col){var e1=[b[0]-a[0],b[1]-a[1],b[2]-a[2]],e2=[c[0]-a[0],c[1]-a[1],c[2]-a[2]],n=[e1[1]*e2[2]-e1[2]*e2[1],e1[2]*e2[0]-e1[0]*e2[2],e1[0]*e2[1]-e1[1]*e2[0]];
    if(n[0]*out[0]+n[1]*out[1]+n[2]*out[2]<0)tri(G,a,c,b,col);else tri(G,a,b,c,col)}
  function quadOut(G,a,b,c,d,out,col){var e1=[b[0]-a[0],b[1]-a[1],b[2]-a[2]],e2=[c[0]-a[0],c[1]-a[1],c[2]-a[2]],n=[e1[1]*e2[2]-e1[2]*e2[1],e1[2]*e2[0]-e1[0]*e2[2],e1[0]*e2[1]-e1[1]*e2[0]];
    if(n[0]*out[0]+n[1]*out[1]+n[2]*out[2]<0){tri(G,a,c,b,col);tri(G,a,d,c,col)}else{tri(G,a,b,c,col);tri(G,a,c,d,col)}}
  B.forEach(function(b){
    var pts=[],i;
    if(b.r){var cx=b.r[0],cz=b.r[1],w=b.r[2],d=b.r[3],a=b.r[4],ca=Math.cos(a),sa=Math.sin(a);[[-w/2,-d/2],[w/2,-d/2],[w/2,d/2],[-w/2,d/2]].forEach(function(q){pts.push([cx+ca*q[0]-sa*q[1],cz+sa*q[0]+ca*q[1]])})}
    else for(i=0;i<b.p.length;i+=2)pts.push([b.p[i],b.p[i+1]]);
    var n=pts.length;if(n<3)return;
    var ccx=0,ccz=0;pts.forEach(function(p){ccx+=p[0];ccz+=p[1]});ccx/=n;ccz/=n;
    if(S3.length&&inS3(ccx,ccz)){if(b.n&&/Nicolao/.test(b.n)){var bn=w2b(ccx,ccz);envTags.push({p:new THREE.Vector3(bn[0],hW(ccx,ccz)+b.h+16,bn[1]),t:'San Nicolao (romanisch)'})}return}
    var ar=0;for(i=0;i<n;i++){var p0=pts[i],p1=pts[(i+1)%n];ar+=p0[0]*p1[1]-p1[0]*p0[1]}if(ar<0)pts.reverse();ar=Math.abs(ar)/2;
    var g=0,ymin=1e9;pts.forEach(function(p){var hh=hW(p[0],p[1]);g+=hh;ymin=Math.min(ymin,hh)});g/=n;ymin-=0.6;var top=g+b.h;
    var stone=(b.k===2||b.k===1||b.wc.charAt(0)<'c'),G=stone?WS:WP,wc=hex2lin(b.wc),rc=hex2lin(b.rc);
    var cum=0;
    for(i=0;i<n;i++){var A0=pts[i],B0=pts[(i+1)%n],dx=B0[0]-A0[0],dz=B0[1]-A0[1],len=Math.hypot(dx,dz);if(len<0.05)continue;var out=[dz/len,0,-dx/len];
      var u0=cum/3.2,u1=(cum+len)/3.2,v0=(ymin-g)/3.0,v1=(top-g)/3.0;cum+=len;
      quadOut(G,[A0[0],ymin,A0[1],u0,v0],[B0[0],ymin,B0[1],u1,v0],[B0[0],top,B0[1],u1,v1],[A0[0],top,A0[1],u0,v1],out,wc)}
    var o=0.35,tp=0.58;
    if(b.r&&n===4){
      var w2=b.r[2],d2=b.r[3],ang=b.r[4],ux=Math.cos(ang),uz=Math.sin(ang);if(d2>w2){var t=w2;w2=d2;d2=t;ux=-Math.sin(ang);uz=Math.cos(ang)}
      var vx=-uz,vz=ux,cx2=b.r[0],cz2=b.r[1],hu=w2/2+o,hv=d2/2+o,ye=top-o*tp,yr=top+d2/2*tp;
      function P(u,v,y,su,sv){return [cx2+ux*u+vx*v,y,cz2+uz*u+vz*v,su,sv]}
      var sl=Math.hypot(hv,yr-ye)/2.0;
      [-1,1].forEach(function(sg){quadOut(RF,P(-hu,sg*hv,ye,0,0),P(hu,sg*hv,ye,w2/2.0,0),P(hu,0,yr,w2/2.0,sl),P(-hu,0,yr,0,sl),[vx*sg,1,vz*sg],rc)});
      [-1,1].forEach(function(sg){triOut(G,P(sg*w2/2,-d2/2,top,0,(top-g)/3),P(sg*w2/2,d2/2,top,d2/3.2,(top-g)/3),P(sg*w2/2,0,yr,d2/6.4,(yr-g)/3),[ux*sg,0,uz*sg],wc)});
    }else{
      var cxp=0,czp=0;pts.forEach(function(p){cxp+=p[0];czp+=p[1]});cxp/=n;czp/=n;var rh=clamp(Math.sqrt(ar)*0.2,1,3.5),inset=0.3;
      var eav=pts.map(function(p){var dx=p[0]-cxp,dz=p[1]-czp,l=Math.hypot(dx,dz)||1;return [p[0]+dx/l*o,p[1]+dz/l*o]}),inn=pts.map(function(p){return [cxp+(p[0]-cxp)*inset,czp+(p[1]-czp)*inset]});
      for(i=0;i<n;i++){var j=(i+1)%n,ex=(eav[i][0]+eav[j][0])/2-cxp,ez=(eav[i][1]+eav[j][1])/2-czp;
        quadOut(RF,[eav[i][0],top-0.15,eav[i][1],0,0],[eav[j][0],top-0.15,eav[j][1],1,0],[inn[j][0],top+rh,inn[j][1],1,1],[inn[i][0],top+rh,inn[i][1],0,1],[ex,1,ez],rc)}
      try{var v2=inn.map(function(p){return new THREE.Vector2(p[0],p[1])}),tris=THREE.ShapeUtils.triangulateShape(v2,[]);
        tris.forEach(function(t3){var a3=inn[t3[0]],b3=inn[t3[1]],c3=inn[t3[2]];var cr=(b3[0]-a3[0])*(c3[1]-a3[1])-(b3[1]-a3[1])*(c3[0]-a3[0]);var y3=top+rh;
          if(cr<0)tri(RF,[a3[0],y3,a3[1],0,0],[b3[0],y3,b3[1],1,0],[c3[0],y3,c3[1],0,1],rc);else tri(RF,[a3[0],y3,a3[1],0,0],[c3[0],y3,c3[1],0,1],[b3[0],y3,b3[1],1,0],rc)})}catch(e){}
    }
    if(b.n&&/Nicolao/.test(b.n)){var bb=w2b(cxp||pts[0][0],czp||pts[0][1]);envTags.push({p:new THREE.Vector3(bb[0],top+16,bb[1]),t:'San Nicolao (romanisch)'})}
  });
  /* swissBUILDINGS3D: Wände verputzt (Pastelltöne wie im Dorf) oder aus Bruchstein, Kirchen, Türme und Mauern aus Stein;
     Dachfarbe aus dem Luftbild; Fensterraster je Geschoss (3 m) entlang jeder Wand; Wandfuss 1,2 m tiefer gegen Lücken am Hang */
  if(S3.length){
    var M19=(typeof MK!=='undefined'&&MK&&MK.o19)||(IM.o19?imgData(IM.o19):null),M17=(typeof MK!=='undefined'&&MK&&MK.o17)||(IM.o17?imgData(IM.o17):null),M15=IM.o15?imgData(IM.o15):null;
    var aer=function(x,z){var m=Math.max(Math.abs(x),Math.abs(z));if(m<99&&M19)return pixAt(M19,100.06,x,z);if(m<399&&M17)return pixAt(M17,400.2,x,z);if(M15)return pixAt(M15,1600.9,x,z);return [0.45,0.44,0.42]};
    var PL=['e8ddc4','eadb9e','e4b9a0','cfd6ad','dcd8cf','efede6','dcbf86','e6c9c3','d9cdb0','e2d6b8'],ST=['cbc5ba','bfb8ac','d3cdc2','b7b1a6','c6bdb0'];
    /* die Osteria (Start des Films, am Platz vor dem Haus): lachsfarben verputzt wie in Wirklichkeit */
    var ost=-1,od=15;S3.forEach(function(sb,bi){var d=Math.hypot(Math.max(sb.bb[0]-452,0,452-sb.bb[1]),Math.max(sb.bb[2]-370,0,370-sb.bb[3]));if(d<od){od=d;ost=bi}});
    S3.forEach(function(sb,bi){var v=sb.v,f=sb.f,c=sb.c,hh=grH(c[0],c[2],3),t=sb.t,stone=(t>=2||hh<0.26)&&bi!==ost,
      wc=hex2lin(bi===ost?'e2a487':stone?ST[Math.floor(grH(c[0],c[2],5)*ST.length)%ST.length]:PL[Math.floor(grH(c[0],c[2],7)*PL.length)%PL.length]);
      if(t===1)wc=hex2lin('8a7a66');
      /* Dachfarbe: Mittel der Luftbildfarbe über die Dachflächen, leicht aufgehellt (Schatten im Bild) */
      var rs=[0,0,0],rn=0,k,P=[[0,0,0],[0,0,0],[0,0,0]];
      for(k=0;k<f.length;k+=3){var a=f[k]*3,b2=f[k+1]*3,d=f[k+2]*3,e1x=v[b2]-v[a],e1y=v[b2+1]-v[a+1],e1z=v[b2+2]-v[a+2],e2x=v[d]-v[a],e2y=v[d+1]-v[a+1],e2z=v[d+2]-v[a+2],ny=e1z*e2x-e1x*e2z,
          nl=Math.hypot(e1y*e2z-e1z*e2y,ny,e1x*e2y-e1y*e2x)||1;if(ny/nl>0.35){var q=aer((v[a]+v[b2]+v[d])/3,(v[a+2]+v[b2+2]+v[d+2])/3);rs[0]+=q[0];rs[1]+=q[1];rs[2]+=q[2];rn++}}
      var rc=new THREE.Color();if(rn){rc.setRGB(Math.min(1,rs[0]/rn*1.18),Math.min(1,rs[1]/rn*1.15),Math.min(1,rs[2]/rn*1.12));var lm=(rc.r+rc.g+rc.b)/3;if(rc.g>rc.r*1.04&&rc.g>rc.b*1.04)rc.setRGB(lm,lm*0.98,lm*0.95);rc.convertSRGBToLinear()}else rc.copy(hex2lin('6e6a66'));
      var G=stone?WS:WP;
      for(k=0;k<f.length;k+=3){
        for(var q2=0;q2<3;q2++){var ix=f[k+q2]*3,yy=v[ix+1];P[q2][0]=v[ix];P[q2][1]=yy<sb.y0+0.3?yy-1.2:yy;P[q2][2]=v[ix+2]}
        var ax=P[1][0]-P[0][0],ay=P[1][1]-P[0][1],az=P[1][2]-P[0][2],bx=P[2][0]-P[0][0],by=P[2][1]-P[0][1],bz=P[2][2]-P[0][2],
          nx=ay*bz-az*by,ny2=az*bx-ax*bz,nz=ax*by-ay*bx,ln=Math.hypot(nx,ny2,nz);if(ln<1e-6)continue;ny2/=ln;
        if(Math.abs(ny2)>0.35){tri(RF,[P[0][0],P[0][1],P[0][2],P[0][0]/2.2,P[0][2]/2.2],[P[1][0],P[1][1],P[1][2],P[1][0]/2.2,P[1][2]/2.2],[P[2][0],P[2][1],P[2][2],P[2][0]/2.2,P[2][2]/2.2],ny2>0?rc:new THREE.Color(rc.r*0.45,rc.g*0.45,rc.b*0.45))}
        else{var hl=Math.hypot(nx,nz)||1,tx=-nz/hl,tz=nx/hl;
          tri(G,[P[0][0],P[0][1],P[0][2],(P[0][0]*tx+P[0][2]*tz)/3.2,(P[0][1]-sb.y0)/3.0],[P[1][0],P[1][1],P[1][2],(P[1][0]*tx+P[1][2]*tz)/3.2,(P[1][1]-sb.y0)/3.0],[P[2][0],P[2][1],P[2][2],(P[2][0]*tx+P[2][2]*tz)/3.2,(P[2][1]-sb.y0)/3.0],wc)}}
    })}
  function mk(G,mat){var g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(G.p,3));g.setAttribute('normal',new THREE.Float32BufferAttribute(G.n,3));g.setAttribute('uv',new THREE.Float32BufferAttribute(G.u,2));g.setAttribute('color',new THREE.Float32BufferAttribute(G.c,3));
    var m=new THREE.Mesh(g,mat);m.castShadow=true;m.receiveShadow=true;m.frustumCulled=false;vilG.add(m);return m}
  var fT=facadeTex();fT.wrapS=fT.wrapT=THREE.RepeatWrapping;
  mk(WP,patch(new THREE.MeshStandardMaterial({map:fT,vertexColors:true,roughness:0.9,envMapIntensity:0.8}),{facade:1,cut:1}));
  mk(WS,patch(new THREE.MeshStandardMaterial({map:stoneTex(),vertexColors:true,roughness:0.95,envMapIntensity:0.75}),{cut:1}));
  mk(RF,patch(new THREE.MeshStandardMaterial({map:roofTex(),vertexColors:true,roughness:0.85,envMapIntensity:0.8,side:THREE.DoubleSide}),{cut:1}));
}
/* ---------- Bahn, Brücken, Leitungen, Feldweg ---------- */
function polyPts(arr){var p=[];for(var i=0;i<arr.length;i+=2)p.push([arr[i],arr[i+1]]);return p}
function resample(p,step){var out=[];for(var i=0;i<p.length-1;i++){var a=p[i],b=p[i+1],l=Math.hypot(b[0]-a[0],b[1]-a[1]),n=Math.max(1,Math.ceil(l/step));for(var k=0;k<n;k++){var t=k/n;out.push([a[0]+(b[0]-a[0])*t,a[1]+(b[1]-a[1])*t])}}out.push(p[p.length-1]);return out}
function dirAt(p,i){var a=p[Math.max(0,i-1)],b=p[Math.min(p.length-1,i+1)],dx=b[0]-a[0],dz=b[1]-a[1],l=Math.hypot(dx,dz)||1;return [dx/l,dz/l]}
function ribbonG(pts,ys,w,skirt){var pos=[],idx=[],n=pts.length;for(var i=0;i<n;i++){var d=dirAt(pts,i),nx=-d[1],nz=d[0],x=pts[i][0],z=pts[i][1],y=ys[i];
    pos.push(x+nx*w/2,y,z+nz*w/2,x-nx*w/2,y,z-nz*w/2);if(skirt)pos.push(x+nx*w/2,y-skirt,z+nz*w/2,x-nx*w/2,y-skirt,z-nz*w/2)}
  var st=skirt?4:2;for(i=0;i<n-1;i++){var k=i*st,k2=k+st;idx.push(k,k+1,k2,k+1,k2+1,k2);if(skirt){idx.push(k,k2,k+2,k2,k2+2,k+2,k+1,k+3,k2+1,k2+1,k+3,k2+3)}}
  var g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));g.setIndex(idx);g.computeVertexNormals();return g}
function buildInfra(){
  var O=A.osm||{},std=function(c,ro,me){return patch(new THREE.MeshStandardMaterial({color:c,roughness:ro||0.9,metalness:me||0,envMapIntensity:0.85}),{})};
  var ballM=std(0x77716a,0.97),railM=std(0x8d8f90,0.4,0.7),slM=std(0x5d544b,0.95),mastM=std(0x7d8286,0.5,0.5),concM=std(0xa7a49d,0.9);
  var wireM=new THREE.LineBasicMaterial({color:0x1b1b1b,fog:false,transparent:true,opacity:0.45,depthWrite:false});
  var rails=(O.rail||[]).map(function(r){return {b:r.b,p:resample(polyPts(r.p),4)}}).filter(function(r){return r.p.length>1});
  var slp=[],masts=[];
  rails.forEach(function(r,ri){
    var pts=r.p.filter(function(q){return Math.max(Math.abs(q[0]),Math.abs(q[1]))<1150});if(pts.length<2)return;
    var ys=pts.map(function(q){return hW(q[0],q[1])+0.12});
    if(r.b){var y0=ys[0],y1=ys[ys.length-1];ys=ys.map(function(y,i){return y0+(y1-y0)*i/(ys.length-1)+0.3});var dk=new THREE.Mesh(ribbonG(pts,ys.map(function(y){return y-0.05}),5.2,1.6),concM);dk.receiveShadow=true;dk.castShadow=true;infG.add(dk)}
    var bl=new THREE.Mesh(ribbonG(pts,ys,4.2,1.8),ballM);bl.receiveShadow=true;infG.add(bl);
    var near=[],nys=[];pts.forEach(function(q,i){if(Math.hypot(q[0],q[1])<800){near.push(q);nys.push(ys[i]+0.2)}});
    if(near.length>1)[-0.72,0.72].forEach(function(o){var sh=near.map(function(q,i){var d=dirAt(near,i);return [q[0]-d[1]*o,q[1]+d[0]*o]});var rm=new THREE.Mesh(ribbonG(sh,nys,0.075,0.14),railM);rm.receiveShadow=true;infG.add(rm)});
    var acc=0;for(var i=1;i<pts.length;i++){var d0=Math.hypot(pts[i][0]-pts[i-1][0],pts[i][1]-pts[i-1][1]),dist=Math.hypot(pts[i][0],pts[i][1]);
      if(dist<240){var dd=dirAt(pts,i);for(var s=0;s<d0;s+=0.62)slp.push([pts[i-1][0]+(pts[i][0]-pts[i-1][0])*s/d0,ys[i-1]+0.06,pts[i-1][1]+(pts[i][1]-pts[i-1][1])*s/d0,Math.atan2(dd[0],dd[1])])}
      acc+=d0;if(acc>=58&&dist<1100){acc=0;masts.push({ri:ri,x:pts[i][0],z:pts[i][1],y:ys[i],d:dirAt(pts,i)})}}
  });
  /* Masten auf der Außenseite des Gleispaars */
  function nearOther(x,z,ri){var best=1e9;rails.forEach(function(r,k){if(k===ri)return;for(var i=0;i<r.p.length;i+=3){var q=r.p[i],d=(q[0]-x)*(q[0]-x)+(q[1]-z)*(q[1]-z);if(d<best)best=d}});return Math.sqrt(best)}
  var mG=new THREE.BoxGeometry(0.24,7.6,0.24).translate(0,3.8,0),aG=new THREE.BoxGeometry(0.09,0.09,3.3).translate(0,0,1.65);
  var mI=inst(mG,mastM,masts.length,infG),aI=inst(aG,mastM,masts.length,infG);mI.castShadow=aI.castShadow=true;
  var wp=[];
  masts.forEach(function(m,i){var nx=-m.d[1],nz=m.d[0],s=nearOther(m.x+nx*3.2,m.z+nz*3.2,m.ri)>nearOther(m.x-nx*3.2,m.z-nz*3.2,m.ri)?1:-1,px=m.x+nx*3.2*s,pz=m.z+nz*3.2*s,gy=hW(px,pz);
    var base=Math.min(gy,m.y);setI(mI,i,px,base,pz,1,(m.y+7.4-base)/7.6,1,0);setI(aI,i,px,m.y+6.4,pz,1,1,1,Math.atan2(-nx*s,-nz*s));
    m.cw=[m.x,m.y+5.75,m.z];});
  mI.instanceMatrix.needsUpdate=true;aI.instanceMatrix.needsUpdate=true;
  var bysR={};masts.forEach(function(m){(bysR[m.ri]=bysR[m.ri]||[]).push(m)});
  Object.keys(bysR).forEach(function(k){var ms=bysR[k];for(var i=1;i<ms.length;i++){var a=ms[i-1],b=ms[i];if(Math.hypot(a.x-b.x,a.z-b.z)>90)continue;
    for(var s=0;s<8;s++){var t0=s/8,t1=(s+1)/8;[0,1.15].forEach(function(up){var sag=up?0.55:0.08;function P(t){return [a.cw[0]+(b.cw[0]-a.cw[0])*t,a.cw[1]+(b.cw[1]-a.cw[1])*t+up-sag*4*t*(1-t),a.cw[2]+(b.cw[2]-a.cw[2])*t]}var p0=P(t0),p1=P(t1);wp.push(p0[0],p0[1],p0[2],p1[0],p1[1],p1[2])})}}});
  var sI=inst(new THREE.BoxGeometry(2.6,0.13,0.26),slM,slp.length,infG);sI.receiveShadow=true;slp.forEach(function(s,i){setI(sI,i,s[0],s[1],s[2],1,1,1,s[3])});sI.instanceMatrix.needsUpdate=true;
  /* Brücken (A2-Viadukte und kleinere Brücken) */
  var widths={1:11.5,2:9,3:8.5,4:7,5:5.5,6:4.5,7:3.5,8:2.5},piers=[];
  /* die zwei alten Steinbrücken zwischen Dorf, Insel und Westufer: gewölbt, aus Naturstein */
  var OLDB=[[367.5,388],[288,369]],stoneM=patch(new THREE.MeshStandardMaterial({color:0xc4bcae,map:stoneTex(),roughness:0.95,side:THREE.DoubleSide,flatShading:true}),{cut:1});
  /* Bruchsteinbild auf Bogen und Brüstung: Textur nach Lage und Richtung der Fläche */
  function uvStone(g){g=g.toNonIndexed();g.computeVertexNormals();var P=g.attributes.position,N=g.attributes.normal,uv=new Float32Array(P.count*2);for(var i=0;i<P.count;i++){var x=P.getX(i),y=P.getY(i),z=P.getZ(i),nx=N.getX(i),ny=N.getY(i),nz=N.getZ(i);
      if(Math.abs(ny)>0.6){uv[i*2]=x/1.6;uv[i*2+1]=z/1.6}else{var hl=Math.hypot(nx,nz)||1;uv[i*2]=(x*-nz/hl+z*nx/hl)/1.6;uv[i*2+1]=y/1.1}}g.setAttribute('uv',new THREE.BufferAttribute(uv,2));return g}
  function isOld(p){var mx=0,mz=0;p.forEach(function(q){mx+=q[0];mz+=q[1]});mx/=p.length;mz/=p.length;return OLDB.some(function(o){return Math.hypot(mx-o[0],mz-o[1])<12})}
  /* Bogenkörper: Fahrbahn oben, Stirnmauern seitlich, Gewölbe unten (Kämpfer unter dem Ufer, Scheitel 1 m unter der Fahrbahn) */
  function archBody(p,ys,w,cum,S){var pos=[],idx=[],n=p.length,ya=hW(p[0][0],p[0][1]),yb=hW(p[n-1][0],p[n-1][1]),ysp=Math.min(ya,yb)-1.2,crown=ys[n>>1]-1.0;
    for(var i=0;i<n;i++){var d=dirAt(p,i),nx=-d[1],nz=d[0],x=p[i][0],z=p[i][1],f=S?cum[i]/S:0,yt=ys[i]-0.05,yi=Math.min(yt-0.6,ysp+(crown-ysp)*Math.pow(Math.sin(Math.PI*f),0.5));
      pos.push(x+nx*w/2,yt,z+nz*w/2,x-nx*w/2,yt,z-nz*w/2,x+nx*w/2,yi,z+nz*w/2,x-nx*w/2,yi,z-nz*w/2)}
    for(i=0;i<n-1;i++){var k=i*4,q=k+4;idx.push(k,k+1,q,k+1,q+1,q,k,q,k+2,q,q+2,k+2,k+1,k+3,q+1,q+1,k+3,q+3,k+2,q+2,k+3,k+3,q+2,q+3)}
    var g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));g.setIndex(idx);g.computeVertexNormals();return g}
  (O.hw||[]).forEach(function(h){if(!h.b)return;var p=resample(polyPts(h.p),3);if(p.length<2)return;
    var old=isOld(p),w=old?Math.min(widths[h.c]||4,3.6):(widths[h.c]||4),th=h.c<=2?2.4:0.7,ya=hW(p[0][0],p[0][1]),yb=hW(p[p.length-1][0],p[p.length-1][1]),S=0,cum=[0];for(var i=1;i<p.length;i++){S+=Math.hypot(p[i][0]-p[i-1][0],p[i][1]-p[i-1][1]);cum.push(S)}
    var rise=old?Math.min(2.2,S*0.08):0,ys=cum.map(function(c){var f=S?c/S:0;return ya+(yb-ya)*f+0.35+rise*Math.sin(Math.PI*f)});
    if(old){var ab=new THREE.Mesh(uvStone(archBody(p,ys,w,cum,S)),stoneM);ab.castShadow=ab.receiveShadow=true;infG.add(ab);
      [-1,1].forEach(function(sg){var sh=p.map(function(q,i){var d=dirAt(p,i);return [q[0]-d[1]*sg*(w/2-0.2),q[1]+d[0]*sg*(w/2-0.2)]});var pr=new THREE.Mesh(uvStone(ribbonG(sh,ys.map(function(y){return y+0.6}),0.4,0.65)),stoneM);pr.castShadow=pr.receiveShadow=true;infG.add(pr)});return}
    var dk=new THREE.Mesh(ribbonG(p,ys,w,th),concM);dk.castShadow=dk.receiveShadow=true;infG.add(dk);
    [-1,1].forEach(function(sg){var sh=p.map(function(q,i){var d=dirAt(p,i);return [q[0]-d[1]*sg*(w/2-0.15),q[1]+d[0]*sg*(w/2-0.15)]});var pr=new THREE.Mesh(ribbonG(sh,ys.map(function(y){return y+0.9}),0.3,0.9),concM);pr.receiveShadow=true;infG.add(pr)});
    if(w>=7){var nx=0;for(i=0;i<p.length;i++){if(cum[i]<nx)continue;nx=cum[i]+40;var gy=hW(p[i][0],p[i][1]),hh=ys[i]-th-gy;if(hh>3&&cum[i]>15&&cum[i]<S-15){var d=dirAt(p,i);piers.push([p[i][0],gy-1,p[i][1],hh+1,Math.atan2(d[0],d[1])])}}}});
  var pI=inst(new THREE.BoxGeometry(2.4,1,5.2).translate(0,0.5,0),concM,piers.length,infG);pI.castShadow=pI.receiveShadow=true;piers.forEach(function(q,i){setI(pI,i,q[0],q[1],q[2],1,q[3],1,q[4])});pI.instanceMatrix.needsUpdate=true;
  /* Hochspannungsleitungen: Gittermasten und Seile */
  var latT=canvasTex(128,256,function(x,w,h){x.clearRect(0,0,w,h);x.strokeStyle='rgba(70,72,74,1)';x.lineWidth=7;x.strokeRect(3,0,w-6,h);x.lineWidth=3;for(var y=0;y<h;y+=32){x.beginPath();x.moveTo(0,y);x.lineTo(w,y+32);x.moveTo(w,y);x.lineTo(0,y+32);x.stroke()}},true);
  var latM=patch(new THREE.MeshStandardMaterial({map:latT,alphaTest:0.42,side:THREE.DoubleSide,roughness:0.6,metalness:0.4}),{});
  var towG=new THREE.CylinderGeometry(0.9,3.4,32,4,1,true).rotateY(Math.PI/4).translate(0,16,0),armG=new THREE.BoxGeometry(15,0.5,0.7);
  var tow=[],plw=[];
  (O.pow||[]).forEach(function(pl){var p=polyPts(pl.p);if(pl.k!==1)return;var prev=null;
    p.forEach(function(q,i){if(Math.max(Math.abs(q[0]),Math.abs(q[1]))>4200){prev=null;return}var d=dirAt(p,i),ang=Math.atan2(d[0],d[1]),gy=hW(q[0],q[1]);tow.push([q[0],gy,q[1],ang]);
      var nx=Math.cos(ang),nz=-Math.sin(ang),tips=[[7,26],[-7,26],[5,30.5],[-5,30.5],[0,32.4]].map(function(t){return [q[0]+nx*t[0],gy+t[1],q[1]+nz*t[0]]});
      if(prev){var span=Math.hypot(q[0]-prev.x,q[1]-prev.z);if(span<900&&Math.hypot((q[0]+prev.x)/2,(q[1]+prev.z)/2)<1800)for(var k=0;k<5;k++){var a=prev.t[k],b=tips[k],sag=span*0.028;for(var s=0;s<12;s++){var t0=s/12,t1=(s+1)/12;plw.push(a[0]+(b[0]-a[0])*t0,a[1]+(b[1]-a[1])*t0-sag*4*t0*(1-t0),a[2]+(b[2]-a[2])*t0,a[0]+(b[0]-a[0])*t1,a[1]+(b[1]-a[1])*t1-sag*4*t1*(1-t1),a[2]+(b[2]-a[2])*t1)}}}
      prev={x:q[0],z:q[1],t:tips}})});
  var tI=inst(towG,latM,tow.length,infG),aI2=inst(armG,patch(new THREE.MeshStandardMaterial({color:0x55585a,roughness:0.6,metalness:0.4}),{}),tow.length*2,infG);
  tow.forEach(function(t,i){setI(tI,i,t[0],t[1],t[2],1,1,1,t[3]);setI(aI2,i*2,t[0],t[1]+26,t[2],1,1,1,t[3]);setI(aI2,i*2+1,t[0],t[1]+30.5,t[2],0.7,1,1,t[3])});
  tI.instanceMatrix.needsUpdate=true;aI2.instanceMatrix.needsUpdate=true;
  /* Feldweg westlich des Gebäudes: Trockenmauer und Holzmasten */
  var wallB=[],poles=[],pw=[];
  (O.lane||[]).forEach(function(l){if(l.c<5||l.b)return;var p=resample(polyPts(l.p),3.0);var acc=0,prev=null;
    p.forEach(function(q,i){var b=w2b(q[0],q[1]);if(Math.abs(b[0])>40||b[1]<-210||b[1]>250)return;var d=dirAt(p,i),nx=-d[1],nz=d[0],t1=w2b(q[0]+nx,q[1]+nz)[0]<b[0]?1:-1;
      if(b[1]>-130&&b[1]<70){var wx=q[0]+nx*t1*2.4,wz=q[1]+nz*t1*2.4;wallB.push([wx,hW(wx,wz),wz,Math.atan2(d[0],d[1])])}
      acc+=3;if(acc>=39){acc=0;var px=q[0]+nx*t1*1.9,pz=q[1]+nz*t1*1.9,gy=hW(px,pz);poles.push([px,gy,pz,Math.atan2(d[0],d[1])]);var cur=[[px+nx*0.7,gy+8.0,pz+nz*0.7],[px-nx*0.7,gy+8.0,pz-nz*0.7],[px,gy+7.4,pz]];
        if(prev&&Math.hypot(prev[2][0]-px,prev[2][2]-pz)<60)for(var k=0;k<3;k++){var a=prev[k],c=cur[k];for(var s=0;s<6;s++){var u0=s/6,u1=(s+1)/6;pw.push(a[0]+(c[0]-a[0])*u0,a[1]+(c[1]-a[1])*u0-0.5*4*u0*(1-u0),a[2]+(c[2]-a[2])*u0,a[0]+(c[0]-a[0])*u1,a[1]+(c[1]-a[1])*u1-0.5*4*u1*(1-u1),a[2]+(c[2]-a[2])*u1)}}prev=cur}})});
  var stT=stoneTex();var sw=patch(new THREE.MeshStandardMaterial({map:stT,color:0xd8d2c8,roughness:0.95,envMapIntensity:0.75}),{});
  var wI=inst(new THREE.BoxGeometry(0.7,1.0,3.15),sw,wallB.length,infG);wI.castShadow=wI.receiveShadow=true;wallB.forEach(function(q,i){setI(wI,i,q[0],q[1]+0.3,q[2],1,1,1,q[3])});wI.instanceMatrix.needsUpdate=true;
  var poleM=std(0x6a5a45,0.9),plI=inst(new THREE.CylinderGeometry(0.11,0.15,8.6,7).translate(0,4.3,0),poleM,poles.length,infG),caI=inst(new THREE.BoxGeometry(1.6,0.1,0.1),poleM,poles.length,infG);plI.castShadow=caI.castShadow=true;
  poles.forEach(function(q,i){setI(plI,i,q[0],q[1]-0.2,q[2],1,1,1,0);setI(caI,i,q[0],q[1]+8.0,q[2],1,1,1,q[3])});plI.instanceMatrix.needsUpdate=true;caI.instanceMatrix.needsUpdate=true;
  [wp,plw,pw].forEach(function(arr){if(!arr.length)return;var g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(arr,3));var ls=new THREE.LineSegments(g,wireM);ls.frustumCulled=false;infG.add(ls)});
  /* ausgetretener Pfad vom Feldweg zur Tür */
  var ac=[[DOFF,-21.3],[-4,-24.4],[-8.6,-26.8],[-13.5,-28.2],[-18.2,-29.2]].map(function(q){return b2w(q[0],q[1])});
  var acp=resample(ac,0.8),pm=patch(new THREE.MeshStandardMaterial({color:0x8d8170,roughness:1,transparent:true,opacity:0.55,depthWrite:false,polygonOffset:true,polygonOffsetFactor:-2,polygonOffsetUnits:-2}),{});
  var path=new THREE.Mesh(ribbonG(acp,acp.map(function(q){return hW(q[0],q[1])+0.03}),1.3,0),pm);path.receiveShadow=true;infG.add(path);
  /* Landmarken */
  function tagW(x,z,dy,t){var b=w2b(x,z);envTags.push({p:new THREE.Vector3(b[0],hW(x,z)+dy,b[1]),t:t})}
  (O.poi||[]).forEach(function(q){if(/Osteria Giornico/.test(q[3]))tagW(q[0],q[1],22,'Osteria Giornico · Schlüssel');if(/Castello/.test(q[3]))tagW(q[0],q[1],24,'Castello di Santa Maria')});
  function nearestOn(list,x,z){var best=null,bd=1e9;list.forEach(function(a){for(var i=0;i<a.length;i+=2){var d=Math.hypot(a[i]-x,a[i+1]-z);if(d<bd){bd=d;best=[a[i],a[i+1]]}}});return best}
  var q1=nearestOn(O.river||[],60,-40);if(q1)tagW(q1[0],q1[1],9,'Ticino');
  var q2=nearestOn((O.rail||[]).map(function(r){return r.p}),-60,-70);if(q2)tagW(q2[0],q2[1],13,'Gotthardbahn');
  var q3=nearestOn((O.lane||[]).filter(function(l){return l.c===3}).map(function(l){return l.p}),110,-60);if(q3)tagW(q3[0],q3[1],11,'Kantonsstraße');
  var mw=(O.hw||[]).filter(function(h){return h.c===1});if(mw.length){var bestP=null,bd=1e9;mw.forEach(function(h){var p=polyPts(h.p);p.forEach(function(q){var d=Math.hypot(q[0]+150,q[1]+250);if(d<bd){bd=d;bestP=q}})});if(bestP)tagW(bestP[0],bestP[1],22,'Autobahn A2')}
  /* im Film: Osteria, Ticino, San Nicolao und der Bau selbst */
  envTags.forEach(function(t){if(/Osteria|Ticino|Nicolao/.test(t.t))t.film=1});envTags.push({p:new THREE.Vector3(0,16,0),t:'La Congiunta',film:2});
}
