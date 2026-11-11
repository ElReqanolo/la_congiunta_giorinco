/* La Congiunta 3D – Exponate nach Hans Josephsohn: Reliefs und Halbfiguren (Form angenähert) */
'use strict';
/* ---------- Exponate nach Hans Josephsohn: Reliefs und Halbfiguren (Form angenähert) ----------
   Josephsohn formte in Gips und liess in Messing giessen; die Oberflächen blieben grob bearbeitet [13].
   Prozedurale Höhenfelder liefern Geometrie, Patina und Feinstruktur; alle Werke teilen sich einen Texturatlas
   (ein Material, ein Shaderprogramm, nach dem Zusammenführen ein bis zwei Zeichenaufrufe). */
var EXQ=({ultra:{t:256,rel:[60,76],fig:[68,76]},hoch:{t:256,rel:[56,70],fig:[64,72]},mittel:{t:256,rel:[38,48],fig:[48,56]},niedrig:{t:128,rel:[24,30],fig:[32,40]}})[qName];
var EXS=[],EXA=null,exM=null;
(function(){
  var VN={};function R(k,w,h,d,s,x,y,z,ry){VN[k]=(VN[k]||0)+1;EXS.push({k:k,w:w,h:h,d:d,s:s,x:x,y:y,z:z,ry:ry,seed:101+EXS.length*37,v:VN[k]-1})}
  var l0=zB(0)-zA(0),l1=zB(1)-zA(1),k;
  /* Raum 1: sechs abstrakte Flachreliefs (frühe 1950er), symmetrisch an beiden Wänden */
  for(k=0;k<3;k++){R('flach',0.95,1.15,0.032,0.035,-Wi/2+0.004,1.55,zA(0)+(k+0.5)*l0/3,Math.PI/2);R('flach',0.95,1.15,0.032,0.035,Wi/2-0.004,1.55,zA(0)+(k+0.5)*l0/3,-Math.PI/2)}
  /* Raum 2: acht Hochreliefs (1960er/70er) entlang einer Seite */
  for(k=0;k<8;k++)R('hoch',1.2,1.5,0.13,0.05,Wi/2-0.004,1.6,zA(1)+1.2+k*(l1-2.4)/7,-Math.PI/2);
  /* Raum 3: vier spätere Hochreliefs an der Ostwand in der Nordhälfte, drei grosse Halbfiguren auf Betonsockeln (nach dem Video [14]) */
  for(k=0;k<4;k++)R('spaet',1.5,1.9,0.15,0.06,Wi/2-0.004,1.85,zA(2)+1.4+k*2.2,-Math.PI/2);
  /* Zellen: je ein Relief (angenommen) */
  for(k=0;k<4;k++)R('zelle',1.0,1.3,0.12,0.05,CX0+T0+0.004,1.6,cellZ(k),Math.PI/2);
  [[4.2,1.3,0.25],[8.9,1.48,-0.2],[13.6,1.22,0.4]].forEach(function(f){EXS.push({k:'fig',H:f[1],x:0.55,z:zA(2)+f[0],ry:Math.PI+f[2],base:0.7,seed:701+EXS.length*53})});
})();
/* schnelles Wertrauschen; P = Periode in x (für nahtlose Figurenoberflächen) */
var NZT=(function(){var a=new Float32Array(65536),r=mb32(4711);for(var i=0;i<65536;i++)a[i]=r();return a})();
function vn2(x,y,P){var xi=Math.floor(x),yi=Math.floor(y),xf=x-xi,yf=y-yi,u=xf*xf*(3-2*xf),v=yf*yf*(3-2*yf),x1=xi+1;
  if(P){xi=((xi%P)+P)%P;x1=((x1%P)+P)%P}
  var r0=(yi&255)<<8,r1=((yi+1)&255)<<8,a=NZT[r0|(xi&255)],b=NZT[r0|(x1&255)],c=NZT[r1|(xi&255)],d=NZT[r1|(x1&255)];
  return a+(b-a)*u+(c-a)*v+(a-b-c+d)*u*v}
function smin(a,b,k){var h=Math.max(k-Math.abs(a-b),0)/k;return Math.min(a,b)-h*h*k*0.25}
function smax(a,b){var k=0.3,h=Math.max(k-Math.abs(a-b),0)/k;return Math.max(a,b)+h*h*k*0.25}
/* Reliefs: Figuren als verschmolzene Massen (Kopf, Oberkörper, Unterkörper, Beine), Raum 1 als kantige Zeichen */
function relShapes(sp,r){var B=[],P=[],G=[],w=sp.w,h=sp.h,i,n;
  function E(x,y,rx,ry,hz,p){B.push([x/w,y/h,rx/w,ry/h,hz,B.length*7.31,p||2])}
  function stand(x,y0,H,lean){var s=0.9+r()*0.25;E(x+lean*0.2*H,y0+0.26*H,0.115*H*s,0.29*H,0.84,2.6);E(x+lean*0.58*H,y0+0.6*H,0.16*H*s,0.2*H,1.0,3.2);
    E(x+lean*0.9*H+(r()-0.5)*0.03*H,y0+0.88*H,0.072*H,0.088*H,0.92,2)}
  function sit(x,y0,H,lean){E(x+lean*0.62*H,y0+0.58*H,0.17*H,0.21*H,1.0,3.2);E(x+lean*H,y0+0.87*H,0.075*H,0.09*H,0.92,2);
    E(x+0.17*H,y0+0.33*H,0.28*H,0.1*H,0.9,2.6);E(x+0.39*H,y0+0.15*H,0.085*H,0.17*H,0.8,2.6)}
  function lie(x,y,Lm){E(x-0.42*Lm,y+0.02*Lm,0.07*Lm,0.065*Lm,0.85,2);E(x-0.17*Lm,y,0.21*Lm,0.1*Lm,1.0,3.2);E(x+0.2*Lm,y+0.005*Lm,0.26*Lm,0.075*Lm,0.88,2.6)}
  function rect(cx,cy,hw,hh,a,hz,tp){P.push([cx,cy,hw,hh,a,hz,0,tp||0])}function arch(cx,cy,rr,th,hz){P.push([cx,cy,rr,th,0,hz,1])}function line(x0,y0,x1,y1){G.push([x0,y0,x1,y1])}
  if(sp.k==='flach'){n=2+Math.floor(r()*2);var XS=[];
    for(i=0;i<n;i++){var xx=w*(0.24+0.52*(n>1?i/(n-1):0.5))+(r()-0.5)*0.08,Hh=h*(0.5+r()*0.22),y0=h*(0.07+r()*0.06),a=(r()-0.5)*0.16;XS.push([xx,y0+Hh*0.8]);
      rect(xx,y0+Hh*0.5,0.05+r()*0.035,Hh*0.5,a,0.75+r()*0.25,0.15+r()*0.25);rect(xx+(r()-0.5)*0.04,y0+Hh+0.055,0.045+r()*0.02,0.05,a+(r()-0.5)*0.4,0.95);
      if(r()<0.3)rect(xx,y0+Hh*(0.62+r()*0.1),0.1+r()*0.05,0.02,a+(r()-0.5)*0.8,0.6);if(r()<0.6)line(xx-0.025,y0+Hh*0.12,xx-0.025+(r()-0.5)*0.03,y0+Hh*0.75)}
    if(r()<0.6){var ka=Math.floor(r()*(n-1)),A0=XS[ka],A1=XS[ka+1];arch((A0[0]+A1[0])/2,Math.min(A0[1],A1[1]),Math.abs(A1[0]-A0[0])/2,0.022,0.7)}else rect(w*0.5,h*(0.2+r()*0.6),w*(0.3+r()*0.12),0.018,(r()-0.5)*0.3,0.45)}
  /* weitere Haltungen, damit keine zwei Reliefs gleich aussehen */
  function arm(x,y0,H,sd){E(x+sd*0.135*H,y0+0.83*H,0.034*H,0.12*H,0.72,2)}
  function kneel(x,y0,H,lean){E(x+lean*0.4*H,y0+0.56*H,0.15*H,0.19*H,1.0,3.0);E(x+lean*0.9*H,y0+0.84*H,0.07*H,0.085*H,0.92,2);E(x+0.13*H,y0+0.3*H,0.18*H,0.075*H,0.85,2.6);E(x-0.03*H,y0+0.13*H,0.06*H,0.13*H,0.8,2.4)}
  function bust(x,y0,H){E(x,y0+0.24*H,0.33*H,0.21*H,0.85,3.2);E(x,y0+0.49*H,0.075*H,0.08*H,0.8,2);E(x+(r()-0.5)*0.04*H,y0+0.7*H,0.16*H,0.2*H,1.0,2.2);line(x,y0+0.62*H,x+0.01*H,y0+0.74*H)}
  function head(x,y,H){E(x,y,0.3*H,0.37*H,1.0,2.2);E(x,y-0.48*H,0.14*H,0.12*H,0.8,2.2);line(x+0.01*H,y-0.12*H,x+0.02*H,y+0.1*H);rect(x,y+0.12*H,0.16*H/w*w,0.012,0,0.55)}
  function frame(hz){rect(w*0.5,h*0.955,w*0.47,0.022,0,hz);rect(w*0.035,h*0.5,0.022,h*0.47,0,hz);rect(w*0.965,h*0.5,0.022,h*0.47,0,hz)}
  var SEQ={hoch:['sit','stand1','pair','lie','kneel','group3','bustF','standArm'],spaet:['standBig','pair2','bust','kneelT','group2F'],zelle:['head','sit','standArm','lie']};
  if(sp.k!=='flach'){var cmp=(SEQ[sp.k]||SEQ.zelle)[(sp.v||0)%(SEQ[sp.k]||SEQ.zelle).length],j0=(r()-0.5)*0.06;
    if(cmp==='sit')sit(w*0.45,h*0.05,h*(0.72+r()*0.06),j0);
    else if(cmp==='stand1')stand(w*(0.5+j0),h*0.04,h*0.84,j0);
    else if(cmp==='standBig'){stand(w*0.5,h*0.02,h*0.93,j0);frame(0.35)}
    else if(cmp==='standArm'){stand(w*0.5,h*0.04,h*0.8,j0);arm(w*0.5,h*0.04,h*0.8,r()<0.5?-1:1)}
    else if(cmp==='pair'){stand(w*0.33,h*0.04,h*0.82,0.04);stand(w*0.66,h*0.04,h*0.7,-0.05)}
    else if(cmp==='pair2'){stand(w*0.3,h*0.02,h*0.9,0.03);sit(w*0.58,h*0.03,h*0.66,-0.04)}
    else if(cmp==='lie'){lie(w*0.5,h*(0.38+r()*0.2),w*0.86);rect(w*0.5,h*0.2,w*0.42,0.03,0,0.5)}
    else if(cmp==='kneel')kneel(w*0.44,h*0.05,h*0.8,j0);
    else if(cmp==='kneelT'){kneel(w*0.42,h*0.03,h*0.9,j0);frame(0.3)}
    else if(cmp==='group3'){stand(w*0.22,h*0.05,h*0.68,0.05);stand(w*0.5,h*0.03,h*0.86,0);stand(w*0.78,h*0.05,h*0.62,-0.05)}
    else if(cmp==='group2F'){stand(w*0.34,h*0.03,h*0.84,0.04);stand(w*0.66,h*0.03,h*0.84,-0.04);frame(0.4)}
    else if(cmp==='bust')bust(w*0.5,h*0.06,h*0.92);
    else if(cmp==='bustF'){bust(w*0.5,h*0.08,h*0.82);frame(0.45)}
    else if(cmp==='head')head(w*0.5,h*0.55,h*0.8)}
  return {B:B,P:P,G:G}}
/* Spachtelspuren: viele kleine, gestreckte Aufträge und Eindrücke wie in Gips (Grössen in Metern) */
function exDabs(F,M,T,g,wm,hm,count,amp,rmin,rmax,r,wrap,cf,am){var n=T-2*g,px0=n/wm,py=n/hm,px=px0;
  for(var k=0;k<count;k++){var cu=r(),cv=r(),rad=rmin+(rmax-rmin)*r()*r(),neg=r()<0.3,el=neg?2+r()*2.5:1+r()*1.4,an=r()*Math.PI,ca=Math.cos(an),sa=Math.sin(an),rx=rad*el,ry=rad;
    var ci=g+cu*n,cj=g+(1-cv)*n;if(cf)px=px0/cf[Math.max(0,Math.min(T-1,cj|0))];var ii0=Math.min(T-1,Math.max(0,ci|0)),jj0=Math.min(T-1,Math.max(0,cj|0)),mk=(M?(0.4+0.6*M[jj0*T+ii0]):1)*(am?am[jj0]:1),a=amp*(0.45+0.55*r())*mk*Math.sqrt(rad/rmax)*(neg?-0.7:1);
    var Rx=Math.ceil(rx*px)+1,Ry=Math.ceil(rx*py)+1;
    for(var dj=-Ry;dj<=Ry;dj++){var j=(cj+dj)|0;if(j<0||j>=T)continue;var ym=dj/py;
      for(var di=-Rx;di<=Rx;di++){var i=(ci+di)|0;if(wrap)i=((i%T)+T)%T;else if(i<0||i>=T)continue;var xm=di/px,a2=(xm*ca+ym*sa)/rx,b2=(-xm*sa+ym*ca)/ry,d=a2*a2+b2*b2;if(d<1){var q=1-d;F[j*T+i]+=a*q*q}}}}}
function fbm3(x,y,P){return vn2(x,y,P)*0.55+vn2(x*2+31,y*2+11.3,P*2)*0.3+vn2(x*4+7,y*4+53.9,P*4)*0.15}
/* Halbfigur: Profil (Anteil der Höhe) mit Becken, Brust, Schultern, Hals, Kopf; Kopf leicht vorgeneigt */
var FK=[[0,.20,.15,0],[.25,.21,.155,.005],[.45,.225,.165,.01],[.56,.24,.16,0],[.62,.225,.15,0],[.67,.165,.12,.01],[.705,.088,.083,.025],[.735,.068,.074,.03],[.775,.092,.102,.042],[.85,.104,.116,.048],[.93,.09,.1,.038],[.985,.05,.055,.026],[1,.001,.001,.02]];
function fprof(t){for(var i=1;i<FK.length;i++){if(t<=FK[i][0]){var a=FK[i-1],b=FK[i],s=(t-a[0])/(b[0]-a[0]);s=s*s*(3-2*s);return [a[1]+(b[1]-a[1])*s,a[2]+(b[2]-a[2])*s,a[3]+(b[3]-a[3])*s]}}return [.001,.001,.02]}
/* Halbfigur: grosse Formen analytisch (Arme, Brust, Gesicht) und Knetmasse; Spachtelspuren kommen im Höhenfeld dazu */
function figBase(u,t,ox){var a=u*Math.PI*2-Math.PI/2;a=a-Math.PI*2*Math.floor((a+Math.PI)/(Math.PI*2));var aa=Math.abs(a),hd=sstep(0.72,0.78,t);
  var d=(fbm3(u*5,t*5+ox,5)-0.5)*0.24*(1-0.65*hd);
  d+=0.10*sstep(0.26,0.34,t)*(1-sstep(0.58,0.64,t))*Math.exp(-Math.pow((aa-1.25)/0.24,2));
  d+=0.06*sstep(0.44,0.5,t)*(1-sstep(0.56,0.6,t))*Math.exp(-Math.pow((aa-0.42)/0.24,2));
  if(hd>0)d+=hd*(0.09*Math.exp(-a*a/0.0169)*Math.exp(-Math.pow((t-0.83)/0.028,2))-0.05*Math.exp(-Math.pow((aa-0.35)/0.13,2))*Math.exp(-Math.pow((t-0.86)/0.022,2))+0.04*Math.exp(-a*a/0.25)*Math.exp(-Math.pow((t-0.885)/0.022,2)));
  return d}
function exBlur(S,T,r,wrap){var O=new Float32Array(T*T),M=new Float32Array(T*T),w=2*r+1,i,j,s;
  function cx(i){return wrap?((i%T)+T)%T:(i<0?0:(i>=T?T-1:i))}function cy(j){return j<0?0:(j>=T?T-1:j)}
  for(j=0;j<T;j++){var o=j*T;s=0;for(i=-r;i<=r;i++)s+=S[o+cx(i)];for(i=0;i<T;i++){M[o+i]=s/w;s+=S[o+cx(i+r+1)]-S[o+cx(i-r)]}}
  for(i=0;i<T;i++){s=0;for(j=-r;j<=r;j++)s+=M[cy(j)*T+i];for(j=0;j<T;j++){O[j*T+i]=s/w;s+=M[cy(j+r+1)*T+i]-M[cy(j-r)*T+i]}}
  return O}
/* Messing mit Patina: tiefe Stellen dunkel, Grate abgegriffen hell, selten olivgrün in Vertiefungen */
var BR=[[14,14,13],[32,31,29],[54,52,47],[92,88,78]];   /* dunkle Patina wie auf den Fotos (Video [14]), Kanten heller */
function brass(t,out,o){t=t<0?0:(t>1?1:t);var s=t*3,k=Math.min(2,s|0),f=s-k,a=BR[k],b=BR[k+1];out[o]=a[0]+(b[0]-a[0])*f;out[o+1]=a[1]+(b[1]-a[1])*f;out[o+2]=a[2]+(b[2]-a[2])*f;out[o+3]=255}
function exTile(i){var sp=EXS[i],T=EXA.T,g=EXA.g,n=T-2*g,F=new Float32Array(T*T),M=new Float32Array(T*T),fig=sp.k==='fig',r=mb32(sp.seed),ox=r()*40,oy=r()*40,u,v,j,ii,q;
  if(fig){for(j=0;j<T;j++){v=Math.max(0,Math.min(1,1-(j-g+0.5)/n));for(ii=0;ii<T;ii++){u=(ii-g+0.5)/n;F[j*T+ii]=figBase(u,v,ox)}}
    var circ=6.2832*0.19*sp.H,cf=new Float32Array(T),am=new Float32Array(T);for(j=0;j<T;j++){var tq=Math.max(0,Math.min(1,1-(j-g+0.5)/n)),pq=fprof(tq);cf[j]=Math.max(0.25,(pq[0]+pq[1])*0.5/0.19);am[j]=1-0.55*sstep(0.7,0.76,tq)}
    exDabs(F,null,T,g,circ,sp.H,Math.round(circ*sp.H*110),0.11,0.045,0.13,r,true,cf,am);exDabs(F,null,T,g,circ,sp.H,Math.round(circ*sp.H*1100),0.04,0.012,0.05,r,true,cf,am)}
  else{var S=relShapes(sp,r),B=S.B,P=S.P,G=S.G,w0=sp.w,h0=sp.h,flat=sp.k==='flach',massA=sp.k==='spaet'?0.3:(flat?0.08:0.16);
    for(j=0;j<T;j++){v=1-(j-g+0.5)/n;var vm=v*sp.h;for(ii=0;ii<T;ii++){u=(ii-g+0.5)/n;var um=u*sp.w,h=0;
      if(B.length){var su=1,ws=0,hs=0,dome=0;
        for(q=0;q<B.length;q++){var b=B[q],dx=(u-b[0])/b[2];if(dx>=2||dx<=-2)continue;var dy=(v-b[1])/b[3],d2=dx*dx+dy*dy;if(d2>=4)continue;
          var adx=Math.abs(dx),ady=Math.abs(dy),dn=(b[6]===2?Math.sqrt(d2):Math.pow(Math.pow(adx,b[6])+Math.pow(ady,b[6]),1/b[6]))*Math.sqrt(1+(vn2(um*6+b[5],vm*6+ox,0)-0.5)*0.45+(vn2(um*17+oy,vm*17+b[5],0)-0.5)*0.2),sd=(dn-1)*Math.min(b[2]*w0,b[3]*h0);
          su=smin(su,sd,0.05);var wq=1/(1+Math.exp(sd/0.03));ws+=wq;hs+=wq*b[4];if(dn<1)dome=Math.max(dome,(1-dn*dn)*0.34)}
        if(su<0.01)h=(ws>0?hs/ws:1)*(0.64*sstep(0.006,-0.032,su)+dome*sstep(0.0,-0.04,su))}
      for(q=0;q<P.length;q++){var p=P[q],cxm=um-p[0],cym=vm-p[1];
        if(p[6]){sd=Math.abs(Math.sqrt(cxm*cxm+cym*cym)-p[2])-p[3];if(cym<0)sd=Math.max(sd,-cym)}else{var cs=Math.cos(p[4]),sn=Math.sin(p[4]),ly=-cxm*sn+cym*cs;sd=Math.max(Math.abs(cxm*cs+cym*sn)-p[2]*(1+p[7]*Math.max(-1,Math.min(1,ly/p[3]))),Math.abs(ly)-p[3])}
        sd+=(vn2(um*14+q*7.3,vm*14,0)-0.5)*0.02+(vn2(um*40,vm*40+q*3.1,0)-0.5)*0.006;if(sd<0.02)h=Math.max(h,p[5]*sstep(0.02,-0.012,sd))}
      for(q=0;q<G.length;q++){var gl=G[q],ex=gl[2]-gl[0],ey=gl[3]-gl[1],ll=ex*ex+ey*ey||1,tt=Math.max(0,Math.min(1,((um-gl[0])*ex+(vm-gl[1])*ey)/ll)),qx=um-gl[0]-ex*tt,qy=vm-gl[1]-ey*tt,dl=Math.sqrt(qx*qx+qy*qy);
        if(dl<0.011){var gq=1-dl/0.011;h-=0.16*gq*gq}}
      M[j*T+ii]=Math.min(1,Math.max(0,h));
      h=smax(Math.max(0,h),0.05+massA*(fbm3(um*1.1+ox,vm*1.1+oy,0)-0.35));
      var e=Math.min(u,1-u,v,1-v);if(e<0.025)h*=Math.max(0,e/0.025);F[j*T+ii]=h}}
    if(!flat)exDabs(F,M,T,g,sp.w,sp.h,Math.round(sp.w*sp.h*110),sp.k==='spaet'?0.12:0.1,0.035,0.1,r,false);
    exDabs(F,M,T,g,sp.w,sp.h,Math.round(sp.w*sp.h*(flat?1100:1700)),flat?0.04:(sp.k==='spaet'?0.075:0.065),0.012,flat?0.035:0.05,r,false);
    for(j=0;j<T;j++){v=1-(j-g+0.5)/n;for(ii=0;ii<T;ii++){u=(ii-g+0.5)/n;var k1=j*T+ii,e2=Math.min(u,1-u,v,1-v);F[k1]=Math.max(0,F[k1]);if(e2<0.02)F[k1]*=Math.max(0,e2/0.02)}}}
  var rm=Math.max(2,Math.round(T/(fig?EXQ.fig[0]:EXQ.rel[0]))),Fb=exBlur(F,T,rm,fig),Fc=exBlur(F,T,Math.max(2,Math.round(T/(fig?40:64))),fig),tile={cx:i%4,cy:(i/4)|0};
  if(fig)tile.Db=Fb;else tile.Hb=Fb;
  var ia=EXA.xA.createImageData(T,T),ib=EXA.xN.createImageData(T,T),A=ia.data,N=ib.data,K=fig?2.6:2.4,dep=fig?0:sp.d,R=new Float32Array(T*T),scs=new Float32Array(T);
  for(j=0;j<T;j++){v=1-(j-g+0.5)/n;if(fig){var pf=fprof(Math.max(0,Math.min(1,v)));scs[j]=Math.max(0.03,(pf[0]+pf[1])*0.5*sp.H)}else scs[j]=1;
    for(ii=0;ii<T;ii++){u=(ii-g+0.5)/n;var k2=j*T+ii,um2=u*(fig?6.2832*scs[j]:sp.w),vm2=v*(fig?sp.H:sp.h);R[k2]=(F[k2]-Fb[k2])*(fig?scs[j]:dep)+(vn2(um2*60+ox,vm2*60+oy,0)-0.5)*0.0012}}
  for(j=0;j<T;j++){v=1-(j-g+0.5)/n;var pw=fig?6.2832*scs[j]/n:sp.w/n,ph=fig?sp.H/n:sp.h/n,yu=Math.max(0,j-1),yd=Math.min(T-1,j+1);
    for(ii=0;ii<T;ii++){u=(ii-g+0.5)/n;var k3=j*T+ii,o=k3*4,cav=F[k3]-Fc[k3],low=vn2(u*3+ox,v*3+oy,0)*0.7+vn2(u*13+oy,v*13+ox,0)*0.3;
      brass(0.6+cav*K*1.15+(low-0.5)*0.28+(fig?0:(F[k3]<0.06?-0.1:0.03)),A,o);
      if(cav<-0.02){var sp2=vn2(u*11+oy,v*11+ox,0);if(sp2>0.8){var mm=Math.min(1,(sp2-0.8)*5)*0.35;A[o]+=(64-A[o])*mm;A[o+1]+=(66-A[o+1])*mm;A[o+2]+=(48-A[o+2])*mm}}
      var xl=fig?((ii-1+T)%T):Math.max(0,ii-1),xr=fig?((ii+1)%T):Math.min(T-1,ii+1);
      var gx=(R[j*T+xr]-R[j*T+xl])/(2*pw),gy=(R[yu*T+ii]-R[yd*T+ii])/(2*ph),il=1/Math.sqrt(gx*gx+gy*gy+1);
      N[o]=(-gx*il*0.5+0.5)*255;N[o+1]=(-gy*il*0.5+0.5)*255;N[o+2]=(il*0.5+0.5)*255;N[o+3]=255}}
  EXA.xA.putImageData(ia,tile.cx*T,tile.cy*T);EXA.xN.putImageData(ib,tile.cx*T,tile.cy*T);EXA.tiles[i]=tile}
function exBuild(part,parts){if(!EXA){var T=EXQ.t,c1=document.createElement('canvas'),c2=document.createElement('canvas');c1.width=c2.width=4*T;c1.height=c2.height=8*T;
    EXA={T:T,g:Math.max(2,T>>6),W:4*T,H:8*T,cA:c1,cN:c2,xA:c1.getContext('2d'),xN:c2.getContext('2d'),tiles:[]}}
  var nn=EXS.length,i0=Math.floor(nn*part/parts),i1=Math.floor(nn*(part+1)/parts);for(var i=i0;i<i1;i++)exTile(i)}
function exUV(tile,u,v){var T=EXA.T,g=EXA.g;return [(tile.cx*T+g+u*(T-2*g))/EXA.W,1-(tile.cy*T+g+(1-v)*(T-2*g))/EXA.H]}
function relGeo(sp,tile){var nx=EXQ.rel[0],ny=EXQ.rel[1],T=EXA.T,g=EXA.g,Hb=tile.Hb,pos=[],uv=[],idx=[],i,j;
  function samp(u,v){var fx=Math.max(0,Math.min(T-1.001,g+u*(T-2*g)-0.5)),fy=Math.max(0,Math.min(T-1.001,g+(1-v)*(T-2*g)-0.5)),ix=fx|0,iy=fy|0,tx=fx-ix,ty=fy-iy,k=iy*T+ix;
    return (Hb[k]*(1-tx)+Hb[k+1]*tx)*(1-ty)+(Hb[k+T]*(1-tx)+Hb[k+T+1]*tx)*ty}
  for(j=0;j<=ny;j++)for(i=0;i<=nx;i++){var u=i/nx,v=j/ny,e=(i===0||i===nx||j===0||j===ny),wx=e?(vn2(v*9+sp.seed%50,u*9,0)-0.5)*0.03:0,wy=e?(vn2(u*9,v*9+sp.seed%40,0)-0.5)*0.03:0,t=exUV(tile,u,v);
    pos.push((u-0.5)*sp.w+wx,(v-0.5)*sp.h+wy,sp.s+sp.d*samp(u,v));uv.push(t[0],t[1])}
  for(j=0;j<ny;j++)for(i=0;i<nx;i++){var a=j*(nx+1)+i;idx.push(a,a+1,a+nx+2,a,a+nx+2,a+nx+1)}
  /* Kanten der Platte bis zur Wand */
  var ring=[];for(i=0;i<=nx;i++)ring.push(i);for(j=1;j<=ny;j++)ring.push(j*(nx+1)+nx);for(i=nx-1;i>=0;i--)ring.push(ny*(nx+1)+i);for(j=ny-1;j>=1;j--)ring.push(j*(nx+1));
  var base=pos.length/3;ring.forEach(function(k){pos.push(pos[k*3],pos[k*3+1],pos[k*3+2],pos[k*3],pos[k*3+1],0);uv.push(uv[k*2],uv[k*2+1],uv[k*2],uv[k*2+1])});
  for(var q=0;q<ring.length;q++){var f0=base+q*2,f1=base+((q+1)%ring.length)*2;idx.push(f0,f0+1,f1+1,f0,f1+1,f1)}
  var gg=new THREE.BufferGeometry();gg.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));gg.setAttribute('uv',new THREE.Float32BufferAttribute(uv,2));gg.setIndex(idx);gg.computeVertexNormals();return gg}
function figGeo(sp,tile){var nu=EXQ.fig[0],nv=EXQ.fig[1],H=sp.H,r=mb32(sp.seed);r();/* erste Zufallszahl überspringen, damit die Figuren gleich bleiben */
  var sx=0.92+r()*0.16,sz=0.92+r()*0.14,lean=(r()-0.3)*0.06,tw=(r()-0.5)*0.25,pos=[],uv=[],idx=[],i,j;
  var T=EXA.T,g=EXA.g,Db=tile.Db;function samp(u,t){var fx=g+u*(T-2*g)-0.5,fy=Math.max(0,Math.min(T-1.001,g+(1-t)*(T-2*g)-0.5)),ix=Math.floor(fx),iy=fy|0,tx=fx-ix,ty=fy-iy,i0=((ix%T)+T)%T,i1=(((ix+1)%T)+T)%T;
    return (Db[iy*T+i0]*(1-tx)+Db[iy*T+i1]*tx)*(1-ty)+(Db[(iy+1)*T+i0]*(1-tx)+Db[(iy+1)*T+i1]*tx)*ty}
  for(j=0;j<=nv;j++){var t=j/nv,pf=fprof(t);for(i=0;i<=nu;i++){var u=i/nu,th=u*Math.PI*2+tw*t,dd=1+samp(u,t),q=exUV(tile,u,t);
      pos.push(pf[0]*H*sx*dd*Math.cos(th),t*H,(pf[2]+lean*t*t)*H+pf[1]*H*sz*dd*Math.sin(th));uv.push(q[0],q[1])}}
  for(j=0;j<nv;j++)for(i=0;i<nu;i++){var a=j*(nu+1)+i,b=a+1,c=a+nu+2,d=a+nu+1;idx.push(a,c,b,a,d,c)}
  var ci=pos.length/3,q0=exUV(tile,0.5,0);pos.push(0,0,fprof(0)[2]*H);uv.push(q0[0],q0[1]);for(i=0;i<nu;i++)idx.push(ci,i,i+1);
  var gg=new THREE.BufferGeometry();gg.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));gg.setAttribute('uv',new THREE.Float32BufferAttribute(uv,2));gg.setIndex(idx);gg.computeVertexNormals();
  /* Naht schliessen: Normalen am Anfang und Ende jeder Reihe mitteln */
  var nr=gg.attributes.normal;for(j=0;j<=nv;j++){var s0=j*(nu+1),s1=s0+nu,x=nr.getX(s0)+nr.getX(s1),y=nr.getY(s0)+nr.getY(s1),z=nr.getZ(s0)+nr.getZ(s1),l=Math.hypot(x,y,z)||1;nr.setXYZ(s0,x/l,y/l,z/l);nr.setXYZ(s1,x/l,y/l,z/l)}
  return gg}
function exMaterial(){var tA=new THREE.CanvasTexture(EXA.cA),tN=new THREE.CanvasTexture(EXA.cN);tA.encoding=THREE.sRGBEncoding;tA.anisotropy=tN.anisotropy=Math.min(8,maxAniso);
  exM=patch(new THREE.MeshStandardMaterial({map:tA,normalMap:tN,normalScale:new THREE.Vector2(1.4,1.4),metalness:0.35,roughness:0.5,envMapIntensity:0.06}),{interior:1});return exM}
