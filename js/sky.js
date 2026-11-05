/* La Congiunta 3D – Himmel, Sonne, Wolken, Umgebungslicht und Nachbearbeitung */
'use strict';
/* ---------- Himmel (Preetham-Modell), Sonne, Umgebungslicht ---------- */
var sky=null;
if(THREE.Sky){sky=new THREE.Sky();sky.scale.setScalar(9000);sky.material.depthTest=false;sky.material.depthWrite=false;sky.renderOrder=-10;sky.frustumCulled=false;scene.add(sky);
  var su=sky.material.uniforms;su.turbidity.value=3.2;su.rayleigh.value=1.05;su.mieCoefficient.value=0.0045;su.mieDirectionalG.value=0.82}
/* Wolken: eine Schicht in rund 2800 m ü. M., dasselbe Muster wie die Wolkenschatten am Boden (cloudV), zieht mit dem Wind */
var cloudM=null;(function(){try{
  var mt=new THREE.ShaderMaterial({uniforms:{uTime:U.uTime,uWind:U.uWind,uCloud:U.uCloud,tCl:U.tCl,uSunB:U.uSunB,uSunC:U.uSunC,uSkyL:U.uSkyL},transparent:true,depthWrite:false,side:THREE.DoubleSide,
    vertexShader:'varying vec3 vWP;\nvoid main(){vec4 w=modelMatrix*vec4(position,1.0);vWP=w.xyz;gl_Position=projectionMatrix*viewMatrix*w;}',
    fragmentShader:'varying vec3 vWP;\nuniform float uTime;\nuniform vec3 uSunB,uSunC,uSkyL;\n'+WIND_DECL+
      /* Rand der Wolken feiner (zweite, kleinere Abtastung derselben Textur), Unterseite im Kern grauer, Silberrand zur Sonne */
      'void main(){if(uCloud.x<=0.0)discard;vec2 w=toW2(vWP);float th=uCloud.w,v=cloudV(w)+(texture2D(tCl,(w+uCloud.yz)*4.7/'+CLS.toFixed(1)+'+vec2(0.37,0.61)).r-0.5)*0.10;\n'+
      'float c=smoothstep(th+0.005,th+0.04,v);if(c<0.004)discard;\n'+
      'vec3 vd=normalize(vWP-cameraPosition);float d=length(vWP.xz-cameraPosition.xz),fade=1.0-smoothstep(5000.0,14000.0,d);\n'+
      'float thick=smoothstep(th+0.03,th+0.20,v),fwd=pow(max(dot(vd,uSunB),0.0),6.0);\n'+
      'vec3 col=uSkyL*0.42*(1.0-0.30*thick)+uSunC*(0.30*(1.0-0.40*thick)+0.45*fwd*(1.0-thick));\n'+
      'gl_FragColor=vec4(col,c*fade*min(uCloud.x,1.0)*0.92);\n#include <tonemapping_fragment>\n#include <encodings_fragment>\n}'});
  cloudM=new THREE.Mesh(new THREE.PlaneGeometry(36000,36000,1,1).rotateX(-Math.PI/2),mt);cloudM.position.y=CLH;cloudM.frustumCulled=false;cloudM.renderOrder=-5;scene.add(cloudM)}catch(e){console.warn('[LC] Wolken',e)}})();
var sun=new THREE.DirectionalLight(0xffffff,2);sun.castShadow=true;scene.add(sun);scene.add(sun.target);
sun.shadow.mapSize.set(QP.sh,QP.sh);sun.shadow.bias=-0.00025;sun.shadow.normalBias=0.03;sun.shadow.radius=2;
var amb=new THREE.HemisphereLight(0x9fb3c8,0x4a4a3c,0.0);scene.add(amb); // nur nachts leicht aktiv
var pm=new THREE.PMREMGenerator(renderer),envRT=null,skyScene=new THREE.Scene(),skyE=null,ringM=null,groundE=null;
if(THREE.Sky){skyE=new THREE.Sky();skyE.scale.setScalar(900);skyScene.add(skyE)}
groundE=new THREE.Mesh(new THREE.CircleGeometry(800,24).rotateX(-Math.PI/2),new THREE.MeshBasicMaterial({color:0x1b1d14}));groundE.position.y=-30;skyScene.add(groundE);
/* Horizontlinie der Berge, vom Gebäude aus (verdeckt im Umgebungslicht den unteren Himmel) */
var HOR=[];(function(){for(var k=0;k<72;k++){var a=k/72*Math.PI*2,dx=Math.sin(a),dz=-Math.cos(a);HOR.push(Math.atan(Math.max(0,horizon(0,0,hRaw(0,0)+1.7,dx,dz))))}
  var pos=[],idx=[],r=600;for(k=0;k<=72;k++){var a2=k/72*Math.PI*2,e=HOR[k%72],x=Math.sin(a2)*r,z=-Math.cos(a2)*r,b=w2b(x,z);pos.push(b[0],-40,b[1],b[0],Math.tan(e)*r+2,b[1]);if(k<72)idx.push(2*k,2*k+2,2*k+1,2*k+1,2*k+2,2*k+3)}
  var g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));g.setIndex(idx);
  ringM=new THREE.Mesh(g,new THREE.MeshBasicMaterial({color:0x223022,side:THREE.DoubleSide}));skyScene.add(ringM)})();
var envTO=0;
function bakeEnv(){try{
  if(skyE&&sky){for(var k in sky.material.uniforms)if(skyE.material.uniforms[k]&&k!=='sunPosition')skyE.material.uniforms[k].value=sky.material.uniforms[k].value;skyE.material.uniforms.sunPosition.value.copy(sky.material.uniforms.sunPosition.value)}
  var t0=performance.now();var rt=pm.fromScene(skyScene,0,0.1,2500);if(envRT)envRT.dispose();envRT=rt;scene.environment=rt.texture;if(nEnv++<3)logPush('zeit','Umgebungslicht '+(performance.now()-t0).toFixed(0)+' ms');draw()}catch(e){console.warn('[LC] env',e)}}
var nEnv=0;
function envQueue(){clearTimeout(envTO);envTO=setTimeout(bakeEnv,120)}
/* ---------- Nachbearbeitung: MSAA, Bloom, ACES, Belichtung ---------- */
var composer=null,bloomPass=null,finPass=null,POST={on:false,samples:0};
function initPost(){
  composer=null;if(!QP.post)return;
  try{
    if(!(THREE.EffectComposer&&THREE.ShaderPass&&THREE.RenderPass))return;
    if(!(isGL2&&renderer.extensions.has('EXT_color_buffer_float')))return;
    var w=stage.clientWidth||800,h=stage.clientHeight||500,rt;
    var opt={type:THREE.HalfFloatType,format:THREE.RGBAFormat,minFilter:THREE.LinearFilter,magFilter:THREE.LinearFilter};
    var maxS=0;try{maxS=gl.getParameter(gl.MAX_SAMPLES)||0;var fs=gl.getInternalformatParameter(gl.RENDERBUFFER,gl.RGBA16F,gl.SAMPLES);if(fs&&fs.length)maxS=Math.min(maxS,fs[0])}catch(e){maxS=0}
    var smp=Math.min(QP.ms,maxS);
    if(smp>0&&THREE.WebGLMultisampleRenderTarget){rt=new THREE.WebGLMultisampleRenderTarget(w,h,opt);rt.samples=smp}else rt=new THREE.WebGLRenderTarget(w,h,opt);
    renderer.setRenderTarget(rt);var fbs=gl.checkFramebufferStatus(gl.FRAMEBUFFER);renderer.setRenderTarget(null);
    if(fbs!==gl.FRAMEBUFFER_COMPLETE){logPush('warn','HDR-Puffer nicht verfügbar (Status '+fbs+'), einfache Darstellung');rt.dispose();return}
    POST.samples=smp;
    var cp=new THREE.EffectComposer(renderer,rt);cp.setPixelRatio(renderer.getPixelRatio());cp.setSize(w,h);
    cp.addPass(new THREE.RenderPass(scene,camera));
    if(QP.bloom&&THREE.UnrealBloomPass){bloomPass=new THREE.UnrealBloomPass(new THREE.Vector2(w,h),0.22,0.55,1.6);cp.addPass(bloomPass)}
    finPass=new THREE.ShaderPass({uniforms:{tDiffuse:{value:null},exposure:{value:0.65},uVig:{value:0.35}},
      vertexShader:'varying vec2 vUv;void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}',
      fragmentShader:'uniform sampler2D tDiffuse;uniform float exposure,uVig;varying vec2 vUv;'+
      'vec3 fitRRT(vec3 v){vec3 a=v*(v+0.0245786)-0.000090537;vec3 b=v*(0.983729*v+0.4329510)+0.238081;return a/b;}'+
      'vec3 toS(vec3 c){c=max(c,vec3(0.0));return mix(c*12.92,1.055*pow(c,vec3(1.0/2.4))-0.055,step(0.0031308,c));}'+
      'float hash(vec2 p){return fract(sin(dot(p,vec2(12.9898,78.233)))*43758.5453);}'+
      'void main(){vec3 c=texture2D(tDiffuse,vUv).rgb*exposure/0.6;'+
      'mat3 im=mat3(vec3(0.59719,0.07600,0.02840),vec3(0.35458,0.90834,0.13383),vec3(0.04823,0.01566,0.83777));'+
      'mat3 om=mat3(vec3(1.60475,-0.10208,-0.00327),vec3(-0.53108,1.10813,-0.07276),vec3(-0.07367,-0.00605,1.07602));'+
      'c=clamp(om*fitRRT(im*c),0.0,1.0);vec2 d=vUv-0.5;c*=1.0-dot(d,d)*uVig;c=toS(c);c+=(hash(vUv*1733.0)-0.5)/255.0;'+
      'gl_FragColor=vec4(c,1.0);}'});
    finPass.renderToScreen=true;cp.addPass(finPass);
    renderer.toneMapping=THREE.NoToneMapping;composer=cp;POST.on=true;
  }catch(e){console.warn('[LC] Nachbearbeitung nicht verfügbar',e);composer=null;renderer.toneMapping=THREE.ACESFilmicToneMapping}
}
