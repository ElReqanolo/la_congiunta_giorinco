/* La Congiunta 3D – Lichtstrahlen aus Laternen und Oberlichtern */
'use strict';
/* ---------- Lichtstrahlen aus den Laternen ---------- */
var BM=[],BK=0.085,SHF=[],BMU={uK:{value:0},uD:{value:new THREE.Vector2()},uCol:{value:new THREE.Color(1.0,0.80,0.56)}};
/* Lichtschächte unter den drei Laternen und den vier Oberlichtern der Zellen: ein weiches Volumen vom Glas bis zum Boden.
   Im Shader zählt nur, was die Sonne wirklich erreicht: der Strahl muss durch die Deckenöffnung passen; bei den Laternen (Glas an den Seiten,
   oben ein Blechdeckel) darf er den Deckel nicht treffen, bei den Oberlichtern der Zellen (Glas oben) muss er durch das Glas,
   der Punkt muss im Raum liegen; die Stahlträger unter den Laternen schneiden Streifen heraus. Flächen, die man streifend sieht, leuchten stärker. */
function buildBeams(){SHF.length=0;
  for(var i=0;i<3;i++){var za=zA(i),zb=zB(i),ol=zb-za,nb=Math.floor(ol/1.2);SHF.push({r:[LOFF-LW/2,LOFF+LW/2,za,zb],yc:H[i],yt:H[i]+RT+LH,box:[-Wi/2,Wi/2,za,zb],z0:za,p:ol/nb,s:1,j:i})}
  for(var k=0;k<4;k++){var cz=cellZ(k),il=CP-T0;SHF.push({r:[SKX0,SKX1,cz-SKZ,cz+SKZ],yc:CEIL_C,yt:CHH+SKH,box:[CX0+T0,-W/2,cz-il/2,cz+il/2],z0:0,p:0})}
  SHF.forEach(function(sh){
    var mt=new THREE.ShaderMaterial({uniforms:{uK:BMU.uK,uCol:BMU.uCol,uD:BMU.uD,uF:{value:1},uR:{value:new THREE.Vector4(sh.r[0],sh.r[1],sh.r[2],sh.r[3])},uB:{value:new THREE.Vector4(sh.box[0],sh.box[1],sh.box[2],sh.box[3])},uY:{value:new THREE.Vector2(sh.yc,sh.yt)},uZ0:{value:sh.z0},uP:{value:sh.p},uS:{value:sh.s||0}},
      transparent:true,depthWrite:false,blending:THREE.AdditiveBlending,side:THREE.DoubleSide,extensions:{derivatives:true},
      vertexShader:'varying vec3 vP;void main(){vec4 w=modelMatrix*vec4(position,1.0);vP=w.xyz;gl_Position=projectionMatrix*viewMatrix*w;}',
      fragmentShader:'uniform float uK,uF,uZ0,uP,uS;uniform vec3 uCol;uniform vec2 uD,uY;uniform vec4 uR,uB;varying vec3 vP;'+
        'bool inR(vec2 q){return q.x>uR.x-0.01&&q.x<uR.y+0.01&&q.y>uR.z-0.01&&q.y<uR.w+0.01;}'+
        'void main(){bool rm=vP.y<=uY.x&&vP.y>0.02&&vP.x>uB.x&&vP.x<uB.y&&vP.z>uB.z&&vP.z<uB.w;bool sh=vP.y>uY.x&&vP.y<uY.y&&inR(vP.xz);if(!(rm||sh))discard;'+
        'vec2 qc=vP.xz-uD*max(uY.x-vP.y,0.0),qt=vP.xz-uD*(uY.y-vP.y);if(!inR(qc)||(uS>0.5?inR(qt):!inR(qt)))discard;'+
        'float m=1.0;if(uP>0.0&&rm){float zt=qc.y+uD.y*0.14,hw=0.07+0.14*abs(uD.y),s=abs(fract((zt-uZ0)/uP)-0.5)*uP;m=smoothstep(hw,hw+0.05+0.012*(uY.x-vP.y),s);}'+
        'vec3 n=normalize(cross(dFdx(vP),dFdy(vP)));vec3 v=normalize(cameraPosition-vP);float g=1.0-abs(dot(n,v));float h=clamp(vP.y/uY.x,0.0,1.0);'+
        'float a=uK*uF*m*(0.3+0.7*pow(g,1.3))*mix(0.45,1.0,h)*smoothstep(0.0,0.5,vP.y);gl_FragColor=vec4(uCol,a);}'});
    var bg=new THREE.BufferGeometry();bg.setAttribute('position',new THREE.BufferAttribute(new Float32Array(24),3));
    bg.setIndex([0,1,5,0,5,4,1,2,6,1,6,5,2,3,7,2,7,6,3,0,4,3,4,7]);
    var bmm=new THREE.Mesh(bg,mt);bmm.frustumCulled=false;bmm.renderOrder=5;scene.add(bmm);BM.push(bmm)})}
/* Verschattung der Oberlichter durch höhere Nachbarbauten (z. B. Raum 3 über den Zellen am Morgen): Anteil freier Strahlen auf dem Glas */
function shRay(o,d,b){var t0=0,t1=1e9;for(var a=0;a<3;a++){var lo=b[a*2],hi=b[a*2+1];if(Math.abs(d[a])<1e-6){if(o[a]<lo||o[a]>hi)return false;continue}
    var ta=(lo-o[a])/d[a],tb=(hi-o[a])/d[a];if(ta>tb){var q=ta;ta=tb;tb=q}t0=Math.max(t0,ta);t1=Math.min(t1,tb);if(t0>t1)return false}return t1>0.02}
function beamsUpdate(svB,k){
  BMU.k0=(0.3+0.5*Math.min(1,svB.y*1.5))*k*BK;BMU.uK.value=BMU.k0*cloudB();
  var dx=-svB.x/Math.max(svB.y,0.04),dz=-svB.z/Math.max(svB.y,0.04);BMU.uD.value.set(dx,dz);
  /* Verdecker: Raumhüllen und Laternendeckel (das Laternenglas lässt das Licht durch) */
  var occ=[];for(var j=0;j<3;j++){var LA=LANS[j];occ.push([-W/2,W/2,0,H[j]+RT,zS[j],zS[j]+L[j]],[LA.x0-0.06,LA.x1+0.06,LA.y1,LA.y1+0.08,LA.z0,LA.z1])}
  occ.push([CX0,-W/2,0,CHH,CZ0,TOT/2]);var sd=[svB.x,svB.y,svB.z];
  BM.forEach(function(bm,i){var on=beamsOn.checked&&svB.y>0.04&&k>0.02;bm.visible=on;if(!on)return;var sh=SHF[i],r=sh.r,y=sh.s?sh.yc:sh.yt;
    var free=0,nS=0;for(var a=0;a<3;a++)for(var b=0;b<3;b++){var o=[r[0]+(r[1]-r[0])*(a+0.5)/3,y+0.05,r[2]+(r[3]-r[2])*(b+0.5)/3];nS++;if(!occ.some(function(B,bi){return !(sh.s&&(bi===2*sh.j||bi===2*sh.j+1))&&shRay(o,sd,B)}))free++}
    bm.material.uniforms.uF.value=free/nS;if(!free){bm.visible=false;return}
    var cs=[[r[0],r[2]],[r[1],r[2]],[r[1],r[3]],[r[0],r[3]]],P=bm.geometry.attributes.position,q=0;
    cs.forEach(function(c){P.setXYZ(q,c[0],y,c[1]);q++});
    cs.forEach(function(c){P.setXYZ(q,c[0]+dx*y,0,c[1]+dz*y);q++});
    P.needsUpdate=true});
}
