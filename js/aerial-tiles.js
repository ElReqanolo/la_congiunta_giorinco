/* La Congiunta 3D – Schärfere Luftbilder: SWISSIMAGE-Kacheln von swisstopo zur Laufzeit nachladen */
'use strict';
/* ---------- Schärfere Luftbilder: SWISSIMAGE-Kacheln von swisstopo zur Laufzeit ----------
   Die eingebetteten Luftbilder haben um das Gebäude 0,2 m, weiter weg 0,8 bis 3 m pro Pixel. Nach dem Start lädt die Seite
   deshalb vom Kacheldienst wmts.geo.admin.ch nach und blendet weich ein:
   – „Weg“: Dorf, Brücken und Westufer bis zum Gebäude, Zoomstufe 19 (≈ 0,21 m pro Pixel; auf schwachen Geräten Stufe 18),
   – „Umgebung“: um das Gebäude ±600 m (mittel: Zoomstufe 17, ≈ 0,82 m pro Pixel; hoch: Stufe 18, ≈ 0,41 m), bei ultra ±800 m in Stufe 18.
   Ohne Netz oder ohne Zugriff (z. B. in der Vorschau im Chat) bleibt es bei den eingebetteten Bildern.
   Welt: x Ost, z Süd, Meter um die Gebäudemitte (46.4056231 N, 8.8704691 E). */
var HR={st:0,regs:[],log:[]};
function hrStart(){if(!HRT||HR.st||!/^https?:$/.test(location.protocol))return;HR.st=1;
  var L=[{k:'Rt',z:qName==='niedrig'?18:19,box:[-50,490,80,430]}];if(HRT2){var e2=qName==='ultra'?800:600;L.push({k:'R2',z:qName==='mittel'?17:18,box:[-e2,e2,-e2,e2]})}
  var i=0;(function next(){if(i<L.length&&HR.st===1)hrLoad(L[i++],next);else HR.st=2})()}
function hrLoad(R,done){
  var z=R.z,lat=46.4056231*Math.PI/180,n=256*Math.pow(2,z),s=Math.sin(lat),
    X0=(8.8704691+180)/360*n,Y0=(0.5-Math.log((1+s)/(1-s))/(4*Math.PI))*n,mpp=156543.03392*Math.cos(lat)/Math.pow(2,z),b=R.box,
    tx0=Math.floor((X0+b[0]/mpp)/256),tx1=Math.floor((X0+b[1]/mpp)/256),ty0=Math.floor((Y0+b[2]/mpp)/256),ty1=Math.floor((Y0+b[3]/mpp)/256),
    W=(tx1-tx0+1)*256,H=(ty1-ty0+1)*256,bx0=(tx0*256-X0)*mpp,bz0=(ty0*256-Y0)*mpp;
  R.n=(tx1-tx0+1)*(ty1-ty0+1);R.ok=0;R.fail=0;HR.regs.push(R);
  if(W>renderer.capabilities.maxTextureSize||H>renderer.capabilities.maxTextureSize){R.st=-1;done();return}
  var cv=document.createElement('canvas');cv.width=W;cv.height=H;var cx=cv.getContext('2d');
  /* Untergrund aus den eingebetteten Bildern: fehlt eine Kachel, bleibt dort das bisherige Bild statt eines Lochs */
  [[IM.o15,1600.9],[IM.o17,400.2],[IM.o19,100.06]].forEach(function(a){var im=a[0],h=a[1];if(!im)return;var k=im.width/(2*h);
    try{cx.drawImage(im,(bx0+h)*k,(bz0+h)*k,W*mpp*k,H*mpp*k,0,0,W,H)}catch(e){}});
  /* Reihenfolge: zuerst die Kacheln am Weg bzw. am Gebäude */
  var q=[],P=R.k==='Rt'&&typeof FMR!=='undefined'?FMR:[[0,0]];
  for(var ty=ty0;ty<=ty1;ty++)for(var tx=tx0;tx<=tx1;tx++){var cxw=((tx+0.5)*256-X0)*mpp,czw=((ty+0.5)*256-Y0)*mpp,dm=1e9;
    for(var j=0;j<P.length;j++){var d=Math.hypot(P[j][0]-cxw,P[j][1]-czw);if(d<dm)dm=d}q.push([tx,ty,dm])}
  q.sort(function(a,c){return a[2]-c[2]});
  var t0=performance.now(),act=0,idx=0,fin=false;
  function one(t,cb){var im=new Image();im.crossOrigin='anonymous';
    im.onload=function(){try{cx.drawImage(im,(t[0]-tx0)*256,(t[1]-ty0)*256);R.ok++}catch(e){R.fail++}cb()};
    im.onerror=function(){R.fail++;cb()};
    im.src='https://wmts.geo.admin.ch/1.0.0/ch.swisstopo.swissimage/default/current/3857/'+z+'/'+t[0]+'/'+t[1]+'.jpeg'}
  function stop(msg){if(fin)return;fin=true;R.st=-1;logPush('log',msg);HR.st=-1;done()}
  function pump(){while(act<6&&idx<q.length){act++;one(q[idx++],function(){act--;if(fin)return;
      if(R.fail>Math.max(3,R.n*0.03)){stop('Feine Luftbilder nicht verfügbar ('+R.fail+' Kacheln fehlen)');return}
      if(R.ok+R.fail===R.n)finish();else pump()})}}
  /* Probe mit der ersten Kachel: schlägt sie fehl (kein Netz, Zugriff gesperrt), gar nicht erst weiterladen */
  one(q[idx++],function(){if(!R.ok){stop('Feine Luftbilder nicht erreichbar');return}if(R.n===1)finish();else pump()});
  function finish(){if(fin)return;fin=true;R.st=2;
    var t=new THREE.CanvasTexture(cv);t.wrapS=t.wrapT=THREE.ClampToEdgeWrapping;t.anisotropy=Math.min(16,maxAniso);
    TU['t'+R.k].value=t;TU['u'+R.k+'B'].value.set(bx0,bz0,1/(W*mpp),1/(H*mpp));
    logPush('zeit','Feine Luftbilder ('+(R.k==='Rt'?'Weg':'Umgebung')+'): '+R.ok+'/'+R.n+' Kacheln, Stufe '+z+', '+W+'×'+H+' px, '+((performance.now()-t0)/1000).toFixed(1)+' s');
    var f0=performance.now(),U2=TU['u'+R.k+'On'];(function fade(){var k=Math.min(1,(performance.now()-f0)/900);U2.value=k*k*(3-2*k);draw();if(k<1)requestAnimationFrame(fade)})();
    setTimeout(done,200)}}
