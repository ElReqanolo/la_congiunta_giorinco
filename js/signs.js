/* La Congiunta 3D – Infoschilder für den Rundgang */
'use strict';
/* ---------- Infoschilder für den Rundgang ----------
   außen: Pultschilder auf zwei Stahlstützen, innen: Wandtafeln wie in einem Museum.
   x/z = Standort des Schilds (Gebäudesystem), ry = Blickrichtung der Schildfläche, room = wo man stehen muss */
var CIL=CP-T0,CZ1=cellZ(1);
function outsideB(p){return !inside(p)}
function inRoom(i){return function(p){return p.x>-Wi/2&&p.x<Wi/2&&p.z>zA(i)&&p.z<zB(i)}}
var HS=[
{k:'post',x:DOFF+1.6,z:-TOT/2-8.2,ry:Math.PI,room:outsideB,t:'Der Weg zum Museum',
 s:'Den Schlüssel holt man in der Osteria Giornico im Dorfzentrum, direkt an der Hauptstraße (Via San Gottardo 37). Die Osteria ist laut Stiftung täglich geöffnet, im Sommer 8–20 Uhr, im Winter 8–18 Uhr; der Besuch ist laut Ticino Turismo kostenlos. Von dort führt der Weg über die zwei alten Steinbrücken auf die andere Seite des Ticino und am romanischen San Nicolao vorbei nach Norden, laut Pireddu rund 750 m entlang der Via Stazione Vecchia, zu Fuß etwa zehn Minuten. Das Gebäude steht am nördlichen Dorfeingang zwischen Ticino und Bahnlinie. Nach der Satzung der 1986 eingetragenen Stiftung soll die Tür tagsüber offen stehen, damit jeder eintreten kann.',
 fm:'Zugang und Schlüssel hängen von einem Dritten ab, der Osteria. Zuletzt führt ein Feldweg zum Gebäude: Wegepflege und Haftung klären.',
 q:'[1] Pireddu 2025, Text und Fußnote 6; [2] Stiftung La Congiunta; [3] Ticino Turismo; Gehzeit geschätzt'},
{k:'post',x:3.6,z:-TOT/2-2.2,ry:Math.PI,room:outsideB,t:'Eingang und Fassade',
 s:'Eine schmale Stahltür an der nördlichen Stirnseite, also talaufwärts Richtung Gotthard, führt ins Innere; davor liegt eine Stufe. Die Stirnseite ist fensterlos und schmucklos, Tür und Lichtgaden sitzen aus der Mitte gerückt. Das Haus sollte nach Märkli weder wie ein Wohnhaus noch wie ein Fabrikgebäude aussehen, sondern etwas Eigenes sein. Pireddu beschreibt ein leicht basilikales Profil, das durch den erhöhten Mittelteil entsteht, und liest Stufe, Schwellen und die kleinen Türen als Sprache, die an das klassische Erbe anknüpft. Alle Türöffnungen sind laut Plan etwa 0,85 m breit und rund 2,15 m hoch und liegen gut 0,45 m westlich der Mitte auf einer Linie; die Türen der Zellen sind 0,7 m breit.',
 fm:'Die Stahltür ist der einzige Zugang. Schloss, Korrosionsschutz und Schlüsselverwaltung sind Wartungspunkte.',
 q:'[1] Pireddu 2025, Text, Grundriss und Foto S. 126–129; [4] Hauser & Wirth; [14] Märkli im Video'},
{k:'post',x:-4.6,z:-6,ry:-Math.PI/2,room:outsideB,t:'Der Beton',
 s:'Das ganze Gebäude ist aus Ortbeton gegossen und bleibt ohne Anstrich und ohne Verkleidung, innen wie außen, auch der Boden. Die Oberfläche trägt die Abdrücke der rauen Holzschalung und zeigt viele Grautöne. Auf Fotos sind außerdem senkrechte Wasserschlieren und dunkle Verfärbungen zu sehen, besonders unter den Dachkanten und am Sockel.',
 fm:'Wie man Sichtbeton erhält, ohne seine Oberfläche zu verfälschen, vom minimalen Eingriff bis zur Rekonstruktion, zeigen Piffaretti und Jean (SUPSI) an acht Fallbeispielen, darunter die Scuola Media in Morbio Inferiore im Tessin. Die Verfärbungen sind kein Schadensbefund, aber Anlass für eine Inspektion.',
 q:'[1] Pireddu 2025; [5] ArchEyes; [6] Piffaretti/Jean 2018; Fotos: [10] eigene Beobachtung'},
{k:'post',x:4.8,z:-10,ry:Math.PI/2,room:outsideB,t:'Dach und Lichtgaden',
 s:'Das flache Dach ist einfach gebaut: Holz-Dreischichtplatten auf Stahlträgern, abgedeckt mit einer beschichteten Bitumenbahn. Über jedem Hauptraum ist es der Länge nach aufgeschnitten; darauf sitzt ein Lichtgaden, etwa 1,7 m breit und 1,5 m hoch, rund 0,4 m westlich der Mitte. Seine Seiten sind mit Platten aus bernsteinfarbenem Plexiglas in einem Stahlrahmen verkleidet, oben ist er geschlossen. Die Platten streuen das Licht: Drinnen sieht man, ob die Sonne scheint oder Wolken ziehen, aber nichts wirft einen Schatten. Märkli wählte dieses Material, weil es ohne komplexe Hilfsmittel diffuses Licht gibt und direkt auf die Konstruktion passt; mit Glas wäre es viel aufwendiger geworden.',
 fm:'Bitumenbahn, Anschlüsse am Lichtgaden und die Kunststoffplatten (Alterung, Vergilbung, Dichtheit) gehören zu den wichtigsten Inspektionspunkten. Das ist allgemeines Fachwissen, für dieses Gebäude nicht belegt.',
 q:'[14] Märkli im Video; [1] Pireddu 2025, Text, Fotos und Schnitte S. 126–129; [7] swissBUILDINGS3D'},
{k:'post',x:8,z:2,ry:Math.PI/2,room:outsideB,t:'Lage im Tal',
 s:'La Congiunta steht am nördlichen Dorfeingang von Giornico im Leventinatal, auf rund 398 m ü. M. auf einer Wiese am Talboden. Etwa 40–45 m westlich und rund 16 m höher verläuft die Gotthardbahn auf einer Geländestufe, etwa 40 m östlich und knapp 9 m tiefer fließt der Ticino, jenseits davon die Kantonsstraße. Die Längsachse folgt dem Tal und ist rund 20° gegen Nord–Süd gedreht. Pireddu beschreibt einen abstrakten Baukörper in einem Tal, in dem Häuser und Monumente mit Dämmen, Brücken und Böschungen verschmelzen. Die Osteria liegt rund 585 m südöstlich, die Kirche San Nicolao rund 640 m südsüdöstlich (Luftlinie).',
 fm:'Flussnähe: Gefahrenkarten für Hochwasser prüfen. Bahnlinie: mögliche Erschütterungen und Lärm. Beides ist für dieses Gebäude nicht untersucht.',
 q:'[1] Pireddu 2025; [3] Ticino Turismo; Höhen und Abstände: eigene Messung in [7] swisstopo und [8] OpenStreetMap'},
{k:'post',x:-9,z:14.6,ry:-Math.PI/2,room:outsideB,t:'Die vier Zellen',
 s:'An der Westseite des dritten Raums liegen vier kleine Zellen nebeneinander, bei Pireddu „piccoli sacelli“, kleine Seitenkapellen. Der Zellentrakt misst laut Grundriss etwa 12,8 × 3,35 m; innen ist jede Zelle damit rund 3,0 × 2,8 m groß und laut Schnitten rund 4,3 m hoch. Märkli legte diese kleinen Räume seitlich an, damit die Bewegung um 90 Grad gewendet wird und man nicht einfach hinein- und wieder hinausgeht; Licht kommt durch ein kleines Oblicht senkrecht von oben. Die Werke in den Zellen stehen nach Pireddu im Dialog mit den späteren Hochreliefs im dritten Raum.',
 fm:'Unter Raum 3 und unter dem ganzen Zellentrakt liegt ein Keller, der unterirdische Lagerraum, den Pireddu als einzige Ausnahme beim Fehlen jeder Haustechnik nennt („deposito interrato“). Laut Kellergrundriss und Schnitten liegt sein Boden 2,44 m unter dem Erdgeschoss (lichte Höhe rund 2,2 m). Man erreicht ihn von außen: gleich nördlich der Zellen führt an der Westwand eine Treppe in einem schmalen Schacht hinunter zu Kellertür und Kellerfenster.',
 q:'[1] Pireddu 2025, Text, Grundriss und Schnitte S. 126–127; [7] swissBUILDINGS3D; [14] Märkli im Video'},
{k:'wall',x:1.3,z:0,y:1.5,ry:Math.PI,room:inRoom(0),t:'Raum 1: Vorraum',
 s:'Der erste Raum ist kürzer als die beiden folgenden und 5,30 m hoch. Sechs abstrakte Flachreliefs von Hans Josephsohn aus den frühen 1950er Jahren hängen symmetrisch an beiden Wänden. Peter Märkli lernte Josephsohn 1975 als Student der ETH in Zürich kennen; daraus wurde eine lange Freundschaft. 1986 kaufte die Stiftung das Grundstück und wurde im selben Jahr eingetragen; geplant und gebaut wurde 1986–1992, mit Stefan Bellwalder als Mitarbeiter. 2012 erhielt der Bau den Ehrenpreis des Tageslicht-Awards der Velux Stiftung.',
 fm:'Die Räume sind roh und ohne Verkleidung. Das spart Ausbau, macht aber den Beton selbst zum Pflegeobjekt.',
 q:'[1] Pireddu 2025, Text, Fußnote 6, Projektangaben S. 133; [4] Hauser & Wirth; [14] VernissageTV 2011'},
{k:'wall',x:-Wi/2,z:-5,y:1.5,ry:Math.PI/2,room:inRoom(1),t:'Raum 2: Der niedrigste Raum',
 s:'Mit 3,50 m ist dies der niedrigste Raum. Acht Hochreliefs aus den 1960er und 1970er Jahren sind entlang einer einzigen Seite aufgereiht. Weil die Werke in einer Reihe gesehen werden, konnte Märkli den Bau extrem schmal machen, innen etwa 4,6 m; dafür maß er in Zürich schmale Gassen und Straßen nach. Das Licht kommt nur von oben durch den Lichtgaden und ist diffus: Man sieht, ob die Sonne scheint oder Wolken ziehen, aber es fällt kein Schatten.',
 fm:'Außer einigen Notleuchten gibt es kein künstliches Licht. Besuche hängen deshalb faktisch von Tageslicht und Wetter ab.',
 q:'[1] Pireddu 2025; [2] Stiftung La Congiunta; [14] Märkli im Video'},
{k:'wall',x:-Wi/2,z:5.9,y:1.5,ry:Math.PI/2,room:inRoom(2),t:'Raum 3: Der höchste Raum',
 s:'Mit 6,60 m ist dies der höchste Raum; nach Märkli erlaubt gerade der hohe Raum über den Plastiken, den Bau auch hier so schmal zu lassen. Hier stehen drei große Halbfiguren, jede auf einem Betonsockel, der von der Wand abgerückt ist; an der Ostwand hängt eine Reihe späterer Hochreliefs, die mit den Werken in den vier Zellen im Dialog stehen. Josephsohn formte in Gips und ließ die Werke in Messing gießen; die Oberflächen blieben grob bearbeitet. Wände und Boden sind roher Ortbeton ohne Verkleidung.',
 fm:'Unbehandelter Betonboden: Abrieb, Staub und Reinigung sind Betriebsthemen. Ohne Heizung und Klimatisierung folgt das Raumklima dem Außenklima (Annahme, nicht gemessen).',
 q:'[1] Pireddu 2025; [5] ArchEyes; [13] Galerie Max Hetzler; [14] Märkli im Video'},
{k:'wall',x:-3.9,z:0,y:1.5,ry:0,room:function(p){return p.x>CX0+T0&&p.x<-W/2&&Math.abs(p.z-CZ1)<CIL/2},t:'In einer Zelle',
 s:'Du stehst in einer der vier Zellen; Licht fällt nur durch das kleine Oblicht senkrecht von oben. Hier zeigt sich ein Gebäude ohne Heizung, ohne Klimatisierung und ohne Haustechnik; als einzige Ausnahme nennt Pireddu einen unterirdischen Lagerraum. Darin liegt die Besonderheit für das Facility Management: Der Aufwand verlagert sich von der Technik auf Bausubstanz und Organisation.',
 fm:'Kosten fallen eher bei Reinigung, Versicherung und Instandsetzung an als bei Energie und Technik. Konkrete Zahlen liegen nicht vor (eigene Einschätzung).',
 q:'[1] Pireddu 2025; [5] ArchEyes; [14] Märkli im Video'},
/* Keller: Abgang aussen, Lager unter Raum 3, Keller unter den Zellen (lv = Fusshöhe des Geschosses) */
{k:'post',x:KPX0-1.1,z:KPZN-0.9,ry:Math.PI,lv:0,room:outsideB,t:'Abgang zum Keller',
 s:'Der Keller ist nur von außen erreichbar. Gleich nördlich der Zellen führt an der Westwand eine schmale Treppe mit 13 Stufen in einem knapp 0,9 m breiten Schacht 2,44 m hinunter. Unten am Podest liegen zwei Zugänge: eine 1,6 m breite Öffnung in den Lagerraum unter Raum 3 und eine schmale Tür in den Keller unter den Zellen. Eine Verbindung ins Museum zeigen die Pläne nicht. Lage und Maße stammen aus dem Kellergrundriss und den Schnitten; welche Öffnung Durchgang und welche Tür ist, ist aus den Plänen gelesen.',
 fm:'Offener Schacht: Laub, Schnee und Regenwasser sammeln sich unten am Podest. Entwässerung, Rutschfestigkeit der Stufen und Absturzsicherung prüfen; ein Geländer ist auf den Plänen nicht zu erkennen.',
 q:'[1] Pireddu 2025, Text S. 124–125, Erdgeschoss- und Kellergrundriss, Schnitte S. 126–127 (eigene Messung im Plan)'},
{k:'wall',x:Wi/2,z:(zS[2]+TOT/2)/2,y:-KD+1.5,ry:-Math.PI/2,lv:-KD,room:function(p){return p.y-1.65<-1.2&&p.x>-Wi/2&&p.x<Wi/2&&p.z>zS[2]&&p.z<TOT/2},t:'Der Lagerraum unter Raum 3',
 s:'Das ist der „deposito interrato“, den Pireddu als einzige Ausnahme vom Verzicht auf jede Haustechnik nennt. Er liegt genau unter Raum 3, innen rund 17,1 × 4,6 m (≈ 79 m²) und rund 2,2 m hoch; sein Boden liegt 2,44 m unter dem Erdgeschoss. Unter Raum 2 und Raum 1 ist nichts unterkellert. Wofür der Raum genutzt wird und wie er ausgestattet ist, ist nicht belegt: Im Modell ist er leer, das Licht der zwei Leuchtstoffröhren ist angenommen.',
 fm:'Ein Keller rund 40 m neben dem Ticino: Feuchte, Grundwasser und Hochwasser sind hier die wichtigsten Risiken. Bei Lagerung von Werken oder Material: Raumklima messen und nicht direkt auf dem Boden lagern (allgemeine Hinweise, für diesen Bau nicht untersucht).',
 q:'[1] Pireddu 2025, Text S. 124–125 („deposito interrato“), Kellergrundriss und Längsschnitt S. 126–127 (eigene Messung im Plan)'},
{k:'wall',x:CX0+T0,z:KPZS+T0+2.2,y:-KD+1.5,ry:Math.PI/2,lv:-KD,room:function(p){return p.y-1.65<-1.2&&p.x>CX0&&p.x<-W/2&&p.z>KPZS&&p.z<TOT/2},t:'Keller unter den Zellen',
 s:'Auch unter dem Zellentrakt liegt ein Kellerraum, innen rund 12,2 × 3,0 m (≈ 37 m²) und ebenfalls rund 2,2 m hoch. Im Plan trennt ihn die Westwand von Raum 3 vom Lager; er hat eine eigene schmale Tür, die in den Schacht aufschlägt. Zusammen haben die beiden Kellerräume rund 115 m² Fläche und 255 m³ Rauminhalt.',
 fm:'Zwei getrennte Kellerräume mit zwei Zugängen über denselben Schacht: Schlüssel, Kontrollgänge und Fluchtweg für beide Räume mitdenken (eigene Einschätzung).',
 q:'[1] Pireddu 2025, Kellergrundriss und Querschnitt S. 126–127 (eigene Messung im Plan)'}
];
HS[6].z=zB(0);HS[9].z=CZ1-CIL/2;
var hsG=[],signBoards=[],SIGN_F='system-ui,-apple-system,"Segoe UI",Roboto,Helvetica,Arial,sans-serif';
function wrapLines(x,text,maxW){var words=String(text).split(/\s+/),lines=[],cur='';words.forEach(function(w){var t=cur?cur+' '+w:w;if(cur&&x.measureText(t).width>maxW){lines.push(cur);cur=w}else cur=t});if(cur)lines.push(cur);return lines}
/* Schildtext auf eine Leinwand setzen: Titel, Text, FM-Hinweis, Quelle; Schriftgröße passt sich an */
function drawSign(h,i,done){
  var c=h.cv;if(!c){c=h.cv=document.createElement('canvas');c.width=1024;c.height=640}
  var x=c.getContext('2d'),CW=1024,CH=640,M=44;
  x.textBaseline='middle';x.textAlign='left';
  x.fillStyle='#f4f1e9';x.fillRect(0,0,CW,CH);
  x.fillStyle='#2e3033';x.fillRect(0,0,CW,96);
  x.fillStyle='#b8792a';x.beginPath();x.arc(56,48,27,0,6.2832);x.fill();
  x.fillStyle='#ffffff';x.font='italic bold 40px Georgia,"Times New Roman",serif';x.textAlign='center';x.fillText('i',56,50);x.textAlign='left';
  var tf=40,maxT=CW-100-M-(done?160:0);x.font='600 '+tf+'px '+SIGN_F;while(x.measureText(h.t).width>maxT&&tf>24){tf-=2;x.font='600 '+tf+'px '+SIGN_F}
  x.fillStyle='#f4f1e9';x.fillText(h.t,100,50);
  if(done){x.textAlign='right';x.fillStyle='#93d3a2';x.font='600 26px '+SIGN_F;x.fillText('✓ gelesen',CW-M+8,50);x.textAlign='left'}
  var top=122,bottom=CH-58,maxW=CW-2*M,fs=30,L1=[],L2=[],L3=[],lh=0,lh2=0,f3=0,need=0;
  for(;fs>=14;fs--){lh=Math.round(fs*1.3);x.font=fs+'px '+SIGN_F;L1=wrapLines(x,h.s,maxW);
    x.font=(fs-1)+'px '+SIGN_F;L2=h.fm?wrapLines(x,'FM-Blick: '+h.fm,maxW-26):[];lh2=Math.round((fs-1)*1.28);
    f3=Math.max(13,fs-6);x.font=f3+'px '+SIGN_F;L3=wrapLines(x,'Quellen: '+h.q,maxW);
    need=L1.length*lh+(L2.length?26+L2.length*lh2:0)+12+L3.length*Math.round(f3*1.3);if(top+need<=bottom)break}
  x.textBaseline='top';x.fillStyle='#24221e';x.font=fs+'px '+SIGN_F;var y=top;L1.forEach(function(l){x.fillText(l,M,y);y+=lh});
  if(L2.length){y+=12;var bh=L2.length*lh2+12;x.fillStyle='#e8e1d1';x.fillRect(M,y-6,maxW,bh);x.fillStyle='#b8792a';x.fillRect(M,y-6,5,bh);
    x.fillStyle='#3a352c';x.font=(fs-1)+'px '+SIGN_F;L2.forEach(function(l){x.fillText(l,M+18,y);y+=lh2});y+=14}
  y+=12;x.fillStyle='#6b665c';x.font=f3+'px '+SIGN_F;L3.forEach(function(l){x.fillText(l,M,y);y+=Math.round(f3*1.3)});
  x.textBaseline='alphabetic';x.fillStyle='#8a857a';x.font='18px '+SIGN_F;x.fillText('Rundgang La Congiunta · Schild '+(i+1)+' von '+HS.length,M,CH-22);
  x.textAlign='right';x.fillText(done?'Quellen im Fußbereich der Seite':'Lesen: E drücken oder Schild anklicken',CW-M,CH-22);x.textAlign='left';
  if(h.tex)h.tex.needsUpdate=true;return c}
var flatN=null;
function buildHS(){
  flatN=new THREE.DataTexture(new Uint8Array([128,128,255,255]),1,1,THREE.RGBAFormat);flatN.needsUpdate=true;
  var frameOut=patch(new THREE.MeshStandardMaterial({color:0x3b3e41,roughness:0.55,metalness:0.55,envMapIntensity:0.8}),{}),
      frameIn=patch(new THREE.MeshStandardMaterial({color:0x3b3e41,roughness:0.55,metalness:0.4,envMapIntensity:0.08}),{interior:1});
  HS.forEach(function(h,i){var g=new THREE.Group(),indoor=h.k==='wall',kel=(h.lv||0)<-1;
    drawSign(h,i,false);var tex=new THREE.CanvasTexture(h.cv);tex.encoding=THREE.sRGBEncoding;tex.anisotropy=Math.min(8,maxAniso);h.tex=tex;
    /* gleiche Shaderprogramme wie Laternenblech (außen) bzw. Innenwände (innen): kein zusätzliches Übersetzen nötig */
    var bm=kel?patch(new THREE.MeshStandardMaterial({color:0x111111,map:tex,emissive:0xffffff,emissiveMap:tex,emissiveIntensity:0.82,roughness:0.8,metalness:0}),{}):indoor?patch(new THREE.MeshStandardMaterial({color:new THREE.Color(1.7,1.7,1.7),map:tex,normalMap:flatN,normalScale:new THREE.Vector2(0,0),roughness:0.74,metalness:0,envMapIntensity:0.05}),{interior:1})
                 :patch(new THREE.MeshStandardMaterial({map:tex,roughness:0.74,metalness:0,envMapIntensity:0.6}),{}),board,back;
    if(indoor){
      back=new THREE.Mesh(new THREE.BoxGeometry(0.83,0.53,0.012),kel?frameOut:frameIn);back.position.set(0,h.y,0.006);
      board=new THREE.Mesh(new THREE.PlaneGeometry(0.8,0.5),bm);board.position.set(0,h.y,0.0125);
      g.add(back,board);g.position.set(h.x,0,h.z);
    }else{
      var tilt=0.62,bw=0.92,bh=0.575,cy=1.0,pv=new THREE.Group();pv.position.y=cy;pv.rotation.x=-tilt;g.add(pv);
      back=new THREE.Mesh(new THREE.BoxGeometry(bw+0.04,bh+0.04,0.03),frameOut);pv.add(back);
      board=new THREE.Mesh(new THREE.PlaneGeometry(bw,bh),bm);board.position.z=0.0165;pv.add(board);
      [-0.34,0.34].forEach(function(px){var post=new THREE.Mesh(new THREE.BoxGeometry(0.05,cy+0.02,0.05),frameOut);post.position.set(px,(cy+0.02)/2-0.04,-0.07);post.castShadow=true;post.receiveShadow=true;g.add(post)});
      back.castShadow=true;g.position.set(h.x,hB(h.x,h.z)-0.02,h.z);
      var ew=Math.abs(Math.sin(h.ry))>0.5;sb(h.x-(ew?0.22:0.5),h.x+(ew?0.22:0.5),h.z-(ew?0.5:0.22),h.z+(ew?0.5:0.22));
    }
    back.receiveShadow=board.receiveShadow=true;g.rotation.y=h.ry;board.userData.si=i;signBoards.push(board);
    g.visible=false;scene.add(g);hsG.push({g:g,board:board,done:false})})}
