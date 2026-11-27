import * as THREE from 'three';
import {RoomEnvironment} from './lib/RoomEnvironment.js';
import {AGENTS,FLOWS,screenHtml,drawScreen} from './data.js';
import {rb,sp,cy,grp,mat,rbG,TEX,plant,chair,desk,imac,lamp,shelf,cabinet,glassWall,wallScreen,person} from './scene.js';
import {stepsHtml,mountSteps} from './steps.js';

const byId={};AGENTS.forEach(a=>byId[a.id]=a);
const RM=matchMedia('(prefers-reduced-motion: reduce)').matches;
await document.fonts.load('700 20px "Plus Jakarta Sans"').catch(()=>{});await document.fonts.load('500 20px "Plus Jakarta Sans"').catch(()=>{});

/* ================= renderare ================= */
const view=document.getElementById('view');
const renderer=new THREE.WebGLRenderer({antialias:true,alpha:true});
renderer.setPixelRatio(Math.min(devicePixelRatio,2));renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;
renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=.92;renderer.outputColorSpace=THREE.SRGBColorSpace;
view.appendChild(renderer.domElement);
const scene=new THREE.Scene();
const pm=new THREE.PMREMGenerator(renderer);scene.environment=pm.fromScene(new RoomEnvironment(renderer),.04).texture;scene.environmentIntensity=.35;
const hemi=new THREE.HemisphereLight('#fff6e8','#8f877b',.55);scene.add(hemi);
const W0=18;const sun=new THREE.DirectionalLight('#ffeacc',2.7);sun.position.set(W0+2,22,4);sun.target.position.set(8,0,6.5);scene.add(sun,sun.target);
sun.castShadow=true;sun.shadow.mapSize.set(2048,2048);Object.assign(sun.shadow.camera,{left:-14,right:14,top:14,bottom:-14,near:1,far:40});sun.shadow.bias=-.0004;sun.shadow.normalBias=.02;sun.shadow.radius=4;
const fill=new THREE.DirectionalLight('#dfeaff',.5);fill.position.set(30,8,-6);scene.add(fill);

/* ================= kontoret – öppen planlösning ================= */
const W=18,D=12.4,PH=.36;
function floorH(z){return z<5.55?PH:z<5.85?.24:z<6.15?.12:0}
const R={re:{x:.5,z:.4},co:{x:6.4,z:.4},sk:{x:12.2,z:.4},ra:{x:.5,z:7.3},hub:{x:6.4,z:7.3},lo:{x:12.2,z:7.3}};
for(const k in R){const r=R[k];r.w=5.3;r.back=r.z<3;r.d=r.back?4.7:4.6;r.y=r.back?PH:0;r.cx=r.x+2.65;r.cz=r.z+r.d/2;r.door={x:r.x+(r.back?2.65:k==='hub'?3.4:4.0),z:r.back?5.0:7.3}}
const plants=[],ROOMFLOOR={};
function canvasTex(w,h){const c=document.createElement('canvas');c.width=w;c.height=h;const t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace;t.anisotropy=8;return {c,ctx:c.getContext('2d'),t}}
const WHITE2='#F5F3EF';
/* sockel och skugga */
rb(scene,W+.5,.5,D+.5,.05,WHITE2,W/2,-.25,D/2-.12,{roughness:.8});
const shc=new THREE.Mesh(new THREE.PlaneGeometry(90,90),new THREE.ShadowMaterial({opacity:.08}));shc.rotation.x=-Math.PI/2;shc.position.set(W/2,-.5,D/2);shc.receiveShadow=true;scene.add(shc);
/* upphöjt plan med trappsteg */
const plat=new THREE.Mesh(rbG(W,PH,5.55,.01),new THREE.MeshStandardMaterial({map:TEX.concrete(),color:'#ECE8E0',roughness:.6}));plat.position.set(W/2,PH/2,5.55/2);plat.castShadow=plat.receiveShadow=true;scene.add(plat);
rb(scene,W,.24,.3,.01,'#A3B5A7',W/2,.12,5.7,{roughness:.7});rb(scene,W,.12,.3,.01,'#B3C3B6',W/2,.06,6.0,{roughness:.7});
/* trägolv */
const wood=TEX.oak();wood.repeat.set(7,5);
const wf=new THREE.Mesh(new THREE.PlaneGeometry(W,D-6.15),new THREE.MeshStandardMaterial({map:wood,roughness:.42}));wf.rotation.x=-Math.PI/2;wf.position.set(W/2,.003,(6.15+D)/2);wf.receiveShadow=true;scene.add(wf);
/* väggar */
const WH=3.5;
rb(scene,W+.25,WH,.25,.02,WHITE2,(W+.25)/2,WH/2,-.125,{roughness:.85});
rb(scene,.25,WH,D+.25,.02,WHITE2,W+.125,WH/2,(D-.25)/2,{roughness:.85});
function tileTex(){const c=document.createElement('canvas');c.width=c.height=256;const x=c.getContext('2d');for(let i=0;i<4;i++)for(let j=0;j<4;j++){x.fillStyle=(i+j)%2?'#B5C4B8':'#F0EDE6';x.fillRect(i*64,j*64,64,64)}
  x.strokeStyle='rgba(255,255,255,.75)';x.lineWidth=2;for(let i=0;i<=4;i++){x.beginPath();x.moveTo(i*64,0);x.lineTo(i*64,256);x.stroke();x.beginPath();x.moveTo(0,i*64);x.lineTo(256,i*64);x.stroke()}
  const t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace;t.wrapS=t.wrapT=THREE.RepeatWrapping;t.anisotropy=8;return t}
const tt=tileTex();tt.repeat.set(12/1.2,2.1/1.2);
const tw=new THREE.Mesh(new THREE.PlaneGeometry(12,2.1),new THREE.MeshStandardMaterial({map:tt,roughness:.35}));tw.position.set(6,PH+1.05,.003);tw.receiveShadow=true;scene.add(tw);
const ow=TEX.oak();ow.repeat.set(3,1);const opn=new THREE.Mesh(new THREE.PlaneGeometry(6,2.1),new THREE.MeshStandardMaterial({map:ow,roughness:.6}));opn.position.set(15,PH+1.05,.003);opn.receiveShadow=true;scene.add(opn);
rb(scene,W,.05,.05,.01,'#E8E4DC',W/2,PH+2.12,.02);
/* höga fönster längs bakväggen */
const FR='#D2B48C';
const cl=new THREE.Mesh(new THREE.PlaneGeometry(17.4,.62),new THREE.MeshBasicMaterial({map:TEX.sky(),toneMapped:false,color:'#fff4e2'}));cl.position.set(9,2.97,.004);scene.add(cl);
for(let i=0;i<=12;i++)rb(scene,.06,.68,.06,.01,FR,.3+i*17.4/12,2.97,.03);
rb(scene,17.5,.06,.07,.01,FR,9,2.64,.035);rb(scene,17.5,.06,.07,.01,FR,9,3.3,.035);
/* spotlights på skena */
rb(scene,16,.04,.04,.01,'#2E2E2C',9,2.48,.12);
for(let i=0;i<8;i++){const s=cy(scene,.05,.16,'#2E2E2C',1.5+i*2.15,2.4,.2,{roughness:.4});s.rotation.x=.7;}
/* stort fönster med rullgardin mot höger */
const wz0=.5,wz1=5.4,wy0=PH+.6,wy1=3.25,wcz=(wz0+wz1)/2,wcy=(wy0+wy1)/2;
const win=new THREE.Mesh(new THREE.PlaneGeometry(wz1-wz0,wy1-wy0),new THREE.MeshBasicMaterial({map:TEX.sky(),toneMapped:false,color:'#fff4e2'}));win.rotation.y=-Math.PI/2;win.position.set(W-.003,wcy,wcz);scene.add(win);
for(let i=0;i<=6;i++)rb(scene,.08,wy1-wy0,.06,.01,FR,W-.04,wcy,wz0+i*(wz1-wz0)/6);
for(let j=0;j<=3;j++)rb(scene,.08,.06,wz1-wz0+.06,.01,FR,W-.04,wy0+j*(wy1-wy0)/3,wcz);
rb(scene,.04,.75,wz1-wz0-.1,.01,'#F4E6CB',W-.1,wy1-.4,wcz,{roughness:.9,emissive:'#f5dcae',emissiveIntensity:.35});
rb(scene,.55,.08,wz1-wz0,.02,'#CFA678',W-.3,PH+.5,wcz,{roughness:.5});rb(scene,.5,.46,wz1-wz0-.2,.02,'#E9E4DA',W-.3,PH+.23,wcz);
{const bg=grp(scene,W-.3,PH+.54,0);plants.push(plant(bg,0,1.2,.45,1),plant(bg,0,4.6,.5));cy(bg,.07,.16,'#C46F4E',0,.08,2.4,{roughness:.4},.09)}
/* väggljus och tavlor på putsväggen */
const glow=(()=>{const c=document.createElement('canvas');c.width=c.height=128;const x=c.getContext('2d');const g=x.createRadialGradient(64,30,4,64,50,64);g.addColorStop(0,'rgba(255,214,150,.75)');g.addColorStop(1,'rgba(255,214,150,0)');x.fillStyle=g;x.fillRect(0,0,128,128);const t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace;return t})();
for(const z of [7.7,9.7,11.6]){const s=grp(scene,W-.02,2.55,z);rb(s,.1,.06,.06,.02,'#B8935A',-.03,0,0,{metalness:.6,roughness:.3});const sh=cy(s,.06,.14,'#C9A46A',-.1,-.05,0,{metalness:.6,roughness:.3},.04);sh.rotation.z=.5;
  const gm=new THREE.Mesh(new THREE.PlaneGeometry(1.2,1.7),new THREE.MeshBasicMaterial({map:glow,transparent:true,depthWrite:false,toneMapped:false}));gm.rotation.y=-Math.PI/2;gm.position.set(W-.006,1.75,z);scene.add(gm)}
function artFrame(p,x,y,z,w,h,ry,draw){const g=grp(p,x,y,z);g.rotation.y=ry;rb(g,w,h,.04,.01,'#3A332C',0,0,0);const c=canvasTex(256,Math.round(256*h/w));draw(c.ctx,256,c.c.height);const m=new THREE.Mesh(new THREE.PlaneGeometry(w-.08,h-.08),new THREE.MeshStandardMaterial({map:c.t,roughness:.8}));m.position.z=.021;g.add(m);return g}
artFrame(scene,W-.02,1.75,8.7,.8,1.0,-Math.PI/2,(x,w,h)=>{x.fillStyle='#F4EEE3';x.fillRect(0,0,w,h);x.fillStyle='#7E9A8C';x.beginPath();x.arc(w*.42,h*.42,w*.28,0,7);x.fill();x.fillStyle='#D08A63';x.beginPath();x.arc(w*.62,h*.66,w*.22,Math.PI,0);x.fill();x.strokeStyle='#2F5A45';x.lineWidth=5;x.beginPath();x.moveTo(w*.15,h*.82);x.lineTo(w*.85,h*.82);x.stroke()});
artFrame(scene,W-.02,1.6,10.65,.65,.85,-Math.PI/2,(x,w,h)=>{x.fillStyle='#EFE9DD';x.fillRect(0,0,w,h);x.strokeStyle='#4E7A5A';x.lineWidth=4;x.beginPath();x.moveTo(w/2,h*.9);x.quadraticCurveTo(w*.48,h*.5,w*.55,h*.12);x.stroke();for(let i=0;i<6;i++){const y=h*(.78-i*.11),s=i%2?1:-1;x.fillStyle=i%2?'#6E9A6A':'#8FB283';x.beginPath();x.ellipse(w/2+s*w*.13,y,w*.14,h*.04,s*.5,0,7);x.fill()}});

/* väggklocka och tavlor på bakväggen */
{const ck=grp(scene,16.5,PH+1.75,.03);cy(ck,.26,.04,'#F7F4EE',0,0,0,{roughness:.4}).rotation.x=Math.PI/2;const rim=new THREE.Mesh(new THREE.TorusGeometry(.26,.025,10,40),mat('#2E2B27',{roughness:.4}));ck.add(rim);
  const hh=rb(ck,.02,.14,.01,.005,'#2E2B27',0,.05,.03);hh.rotation.z=-.9;hh.position.set(.055,.04,.03);const mh=rb(ck,.014,.2,.01,.005,'#2E2B27',0,.08,.03);mh.rotation.z=.35;mh.position.set(-.035,.09,.03);}
artFrame(scene,3.05,PH+1.7,.02,.55,.7,0,(x,w,h)=>{x.fillStyle='#EDE6D8';x.fillRect(0,0,w,h);x.fillStyle='#2F5A45';x.fillRect(w*.18,h*.55,w*.64,h*.3);x.fillStyle='#C99A3E';x.beginPath();x.arc(w*.5,h*.4,w*.18,0,7);x.fill()});
artFrame(scene,3.75,PH+1.55,.02,.45,.45,0,(x,w,h)=>{x.fillStyle='#F2EEE6';x.fillRect(0,0,w,h);x.strokeStyle='#7E9A8C';x.lineWidth=6;for(let i=0;i<4;i++){x.beginPath();x.arc(w/2,h,w*(.15+i*.12),Math.PI,0);x.stroke()}});
/* hjälpmöbler: hyllor, planteringar, pendlar, trästolar */
function pebbles(g,rad,y,n,len){for(let i=0;i<n;i++){let px,pz;if(len){px=(Math.random()-.5)*(len-.12);pz=(Math.random()-.5)*.38}else{const a=Math.random()*7,d=rad*Math.sqrt(Math.random());px=Math.sin(a)*d;pz=Math.cos(a)*d}
  const pb=sp(g,.035+Math.random()*.02,.018,.035+Math.random()*.02,Math.random()<.5?'#D6D2CA':'#B7B2A9',px,y+.012,pz,{roughness:.9});pb.castShadow=false;pb.receiveShadow=false}}
function planter(x,z,len,y){const g=grp(scene,x,y,z);g.rotation.y=Math.PI/2;rb(g,len,.42,.5,.05,'#ECE9E3',0,.21,0,{roughness:.55});pebbles(g,0,.42,Math.round(len*20),len);
  const pg=grp(g,0,.12,0);const n=Math.max(2,Math.round(len/.75));for(let i=0;i<n;i++)plants.push(plant(pg,-len/2+.45+i*(len-.9)/(n-1),i%2?.05:-.05,.85+(i%3)*.14,i%2));return g}
function lowShelf(x,z,len,y){const g=grp(scene,x,y,z);g.rotation.y=Math.PI/2;const O='#C9A27A',O2='#B48A60';
  rb(g,len,.05,.4,.015,O,0,.92,0);rb(g,len,.05,.4,.015,O,0,.04,0);rb(g,len,.03,.38,.01,O2,0,.48,0);
  const nc=4,cw=(len-.04)/nc;for(let i=0;i<=nc;i++)rb(g,.04,.9,.4,.01,O,-len/2+.02+i*cw,.47,0);
  const BC=['#2F5A45','#B9853A','#E6E2D8','#7E9A8C','#C46F4E','#5A7BA3','#F1EEE6'];let s=Math.round(x*97+z*13)+5;const rr=()=>{s=(s*16807)%2147483647;return s/2147483647};
  for(let c=0;c<nc;c++)for(const yb of [.065,.495]){if(rr()<.22)continue;let x0=-len/2+.07+c*cw;const xe=x0+cw-.16;while(x0<xe){const w=.035+rr()*.03,h=.26+rr()*.11;rb(g,w,h,.26,.006,BC[Math.floor(rr()*BC.length)],x0+w/2,yb+h/2,0,{roughness:.6});x0+=w+.006;if(rr()<.07)x0+=.1}}
  const top=grp(g,0,.945,0);plants.push(plant(top,-len/2+.35,0,.55,1),plant(top,len/2-.4,0,.5));cy(top,.06,.22,'#C46F4E',len*.1,.11,0,{roughness:.4},.08);return g}
function pendant(x,z,len,y0=3.45){cy(scene,.006,len,'#333',x,y0-len/2,z);const s=cy(scene,.03,.22,'#7E9A8C',x,y0-len-.1,z,{roughness:.5},.2);s.castShadow=false;
  const b=cy(scene,.17,.01,'#fff3d6',x,y0-len-.215,z,{emissive:'#ffdfa3',emissiveIntensity:2.2});b.castShadow=false;const L=new THREE.PointLight('#ffd49a',2.2,5,1.5);L.position.set(x,y0-len-.4,z);scene.add(L)}
function woodChair(p,x,z,ry){const g=grp(p,x,0,z);g.rotation.y=ry;const O='#C99A66';
  for(const q of [[-.17,-.15],[.17,-.15],[-.17,.17],[.17,.17]]){const l=cy(g,.018,.46,O,q[0],.22,q[1],{roughness:.5});l.rotation.z=q[0]*.35;l.rotation.x=-q[1]*.35}
  rb(g,.42,.04,.4,.03,O,0,.45,0,{roughness:.5});const b=rb(g,.42,.17,.03,.03,O,0,.76,.21,{roughness:.5});b.rotation.x=.15;cy(g,.016,.3,O,-.17,.6,.2);cy(g,.016,.3,O,.17,.6,.2);return g}
/* avgränsningar mellan arbetsytorna */
lowShelf(6.15,2.5,3.0,PH);planter(12.05,2.5,3.0,PH);planter(6.15,9.7,3.0,0);lowShelf(12.05,9.7,3.0,0);

/* ================= skärmtexturer ================= */
const SCR={};let tick=0;
function boardDraw(a,ctx,w,h){const F='Plus Jakarta Sans, system-ui';ctx.fillStyle='#FBFBF8';ctx.fillRect(0,0,w,h);ctx.fillStyle=a.c;ctx.beginPath();ctx.arc(34,40,10,0,7);ctx.fill();
  ctx.fillStyle='#1E3A2D';ctx.font='700 30px '+F;ctx.textBaseline='middle';ctx.fillText(a.dept,56,40);
  const items={re:[['Underlag i inkorgen',String(14-(tick%5))],['Bokfört denna vecka',String(62+tick%7)],['Att stämma av','3']],co:[['Rapporter i månaden','4'],['Budgetavvikelse','+3,2 %'],['Nyckeltal bevakade','12']],sk:[['Nästa deadline','12 dec'],['Deklarationer i år','37'],['Missade datum','0']],ra:[['Bokslut pågår','2'],['Årsredovisningar klara','9'],['Inlämnat i tid','100 %']],lo:[['Anställda','6'],['Nästa lönedag','25 dec'],['Frånvaro registrerad','11 dgr']]}[a.id];
  items.forEach((r,i)=>{const y=100+i*56;ctx.fillStyle='#E6E5DF';ctx.fillRect(28,y+24,w-56,2);ctx.fillStyle='#4A5A50';ctx.font='500 22px '+F;ctx.fillText(r[0],28,y);ctx.fillStyle='#1E3A2D';ctx.font='800 30px '+F;ctx.textAlign='right';ctx.fillText(r[1],w-28,y);ctx.textAlign='left'})}
function updScreens(){AGENTS.forEach(a=>{const s=SCR[a.id];drawScreen(s.m.ctx,a.id,tick,a.c,640,370);s.m.t.needsUpdate=true;boardDraw(a,s.b.ctx,640,300);s.b.t.needsUpdate=true})}

/* ================= arbetsplatser ================= */
const AG={};const SPOT={};
function deskProps(g,dx,dz,a){cy(g,.045,.1,a.c,dx+.55,.735,dz+.2,{roughness:.35});cy(g,.038,.004,'#5b3a22',dx+.55,.786,dz+.2);
  const pf=grp(g,dx-.7,.685,dz-.22);pf.rotation.y=.5;const fr=rb(pf,.16,.2,.02,.01,'#3B3530',0,.1,0);fr.rotation.x=-.18;
  rb(pf,.12,.15,.004,.003,new THREE.MeshStandardMaterial({color:new THREE.Color(a.c).lerp(new THREE.Color('#F5E9D4'),.45),roughness:.8}),0,.105,.013).rotation.x=-.18;
  const su=grp(g,dx-.8,.685,dz+.18);cy(su,.05,.08,'#E9E3D8',0,.04,0,{},.04);sp(su,.06,.05,.06,'#5E9C55',0,.1,0,{roughness:.9});
  rb(g,.24,.03,.32,.01,'#E8E2D6',dx+.78,.7,dz-.15).rotation.y=-.12;rb(g,.24,.03,.32,.01,a.c,dx+.78,.73,dz-.15,{roughness:.6}).rotation.y=-.05}
AGENTS.forEach(a=>{const r=R[a.id];const g=grp(scene,r.x,r.y,r.z);g.userData.pick=a.id;
  const dx=2.4,dz=r.back?1.7:1.6;
  SCR[a.id]={m:canvasTex(640,370),b:canvasTex(640,300)};
  desk(g,dx,dz,1.8);const mon=imac(g,dx+.3,dz-.12,SCR[a.id].m.t);
  rb(g,.22,.03,.3,.01,'#2B2B2B',dx-.3,.7,dz+.08).rotation.y=.3;deskProps(g,dx,dz,a);
  const ch=chair(g,dx-.05,dz+.78);ch.scale.y=.82;
  pendant(r.x+dx,r.z+dz-.05,r.back?.9:1.2);
  const rug=new THREE.Mesh(rbG(3.6,.012,2.8,.006),new THREE.MeshStandardMaterial({color:new THREE.Color(a.c).lerp(new THREE.Color('#EFE7D8'),.55),roughness:.95}));rug.position.set(r.x+dx,r.y+.008,r.z+dz+.55);rug.receiveShadow=true;rug.userData.pick=a.id;scene.add(rug);ROOMFLOOR[a.id]=rug;
  const P=person(scene,Object.assign({gender:a.gender},a.look));P.root.userData.pick=a.id;
  const seat=new THREE.Vector3(r.x+dx-.05,0,r.z+dz+.7);
  AG[a.id]={a,P,chair:ch,seat,stand:new THREE.Vector3(r.x+dx-.05,0,r.z+dz+1.35),pos:seat.clone(),y:r.y,yaw:Math.PI,tyaw:Math.PI,state:'sit',q:[],cur:null,
    pose:{},tpose:'type',phase:0,carry:null,next:8+Math.random()*25,away:false,status:a.work[0],blinkT:Math.random()*3,lookT:0,mon};
  if(r.back)plants.push(plant(g,.35,4.3,1.0),plant(g,5.0,4.3,.85,1));
  else plants.push(plant(g,5.0,.45,1.0),plant(g,.4,4.2,.85,1));
  if(a.id==='re'){shelf(g,4.4,.3,1.5,1.9);cabinet(g,.75,3.7,.8,.7);const pr=grp(g,.75,.7,3.7);rb(pr,.55,.25,.42,.05,'#E9E9E6',0,.125,0,{roughness:.4});rb(pr,.4,.03,.2,.01,'#3A3F3C',0,.255,-.05);
    const paper=new THREE.Mesh(new THREE.PlaneGeometry(.21,.28),mat('#ffffff',{roughness:.9}));paper.rotation.x=-Math.PI/2;paper.position.set(0,.2,.2);pr.add(paper);SPOT.printerPaper=paper;
    SPOT.re_shelf={x:r.x+4.4,z:r.z+1.05,yaw:Math.PI};SPOT.re_print={x:r.x+.75,z:r.z+4.35,yaw:Math.PI}}
  if(a.id==='co'){shelf(g,4.4,.3,1.2,1.5,0,['#2A8A7E','#9DB7A5','#2F5A45','#E6E2D8']);
    const fc=grp(g,4.5,0,3.0);for(const sx of [-.3,.3])rb(fc,.04,1.5,.04,.01,'#3A3F3C',sx,.75,-.1).rotation.x=-.08;
    const fct=canvasTex(320,400);(c=>{const x=c.ctx;x.fillStyle='#fff';x.fillRect(0,0,320,400);x.fillStyle='#1E3A2D';x.font='700 30px Plus Jakarta Sans';x.fillText('Resultat 2026',24,50);x.strokeStyle='#ccc';x.setLineDash([8,6]);x.lineWidth=3;x.beginPath();x.moveTo(24,330);x.lineTo(296,210);x.stroke();x.setLineDash([]);x.strokeStyle='#2A8A7E';x.lineWidth=7;x.beginPath();[[24,340],[70,320],[115,325],[160,270],[205,250],[250,200],[296,160]].forEach((p,i)=>i?x.lineTo(...p):x.moveTo(...p));x.stroke();x.fillStyle='#4A5A50';x.font='500 20px Plus Jakarta Sans';x.fillText('Utfall mot budget',24,385)})(fct);
    const fp=new THREE.Mesh(rbG(.72,.9,.02,.01),[mat('#fff'),mat('#fff'),mat('#fff'),mat('#fff'),new THREE.MeshStandardMaterial({map:fct.t,roughness:.9}),mat('#fff')]);fp.position.set(0,1.15,0);fp.castShadow=true;fc.add(fp);
    SPOT.co_chart={x:r.x+3.85,z:r.z+3.35,yaw:Math.PI/2+.4,pose:'point'}}
  if(a.id==='sk'){cabinet(g,4.0,.35,.5,.75);cabinet(g,4.55,.35,.5,.75);
    const cal=canvasTex(300,260);(c=>{const x=c.ctx;x.fillStyle='#fff';x.fillRect(0,0,300,260);x.fillStyle='#B9853A';x.fillRect(0,0,300,50);x.fillStyle='#fff';x.font='700 26px Plus Jakarta Sans';x.fillText('December',18,34);x.font='600 18px Plus Jakarta Sans';for(let d=1;d<=31;d++){const cx=22+((d-1)%7)*40,cy=82+Math.floor((d-1)/7)*38;if(d===12||d===27){x.fillStyle='#B9853A';x.beginPath();x.arc(cx+8,cy-6,16,0,7);x.fill();x.fillStyle='#fff'}else x.fillStyle='#1E3A2D';x.fillText(d,cx,cy)}})(cal);
    const cm=new THREE.Mesh(new THREE.PlaneGeometry(.7,.6),new THREE.MeshStandardMaterial({map:cal.t,roughness:.9}));cm.position.set(3.2,1.55,-.385);g.add(cm);
    SPOT.sk_phone={x:17.0,z:r.z+2.6,yaw:Math.PI/2,pose:'phone'}}
  if(a.id==='ra'){shelf(g,.95,.4,1.3,1.1,0,['#2F533C','#B9853A','#2F533C','#8E8B86','#E6E2D8','#4FA35A']);
    const ac=grp(g,4.65,0,3.75);ac.rotation.y=-.6;rb(ac,.75,.28,.7,.1,'#C9A15A',0,.3,0,{roughness:.95});rb(ac,.75,.55,.16,.08,'#C29852',0,.62,.3,{roughness:.95});rb(ac,.14,.35,.66,.06,'#C29852',-.36,.48,0,{roughness:.95});rb(ac,.14,.35,.66,.06,'#C29852',.36,.48,0,{roughness:.95});
    for(const q of [[-.3,-.28],[.3,-.28],[-.3,.28],[.3,.28]])cy(ac,.02,.16,'#7A5A3A',q[0],.08,q[1]);
    const fl=grp(g,4.95,0,4.35);cy(fl,.15,.02,'#2E2E2C',0,.01,0);cy(fl,.012,1.4,'#2E2E2C',0,.7,0);cy(fl,.1,.2,'#F3E6CC',0,1.45,0,{emissive:'#ffdca0',emissiveIntensity:.8},.16);
    SPOT.ra_shelf={x:r.x+.95,z:r.z+1.15,yaw:Math.PI,shelf:true}}
  if(a.id==='lo'){cabinet(g,.95,.4,.8,.75);const t=grp(g,4.7,0,3.55);cy(t,.42,.03,'#F2F1EE',0,.72,0,{roughness:.4});cy(t,.035,.7,'#7E9A8C',0,.36,0);cy(t,.22,.02,'#7E9A8C',0,.01,0);
    woodChair(g,4.7,4.2,0);cy(t,.04,.09,'#5A7BA3',.1,.78,-.05,{roughness:.35});SPOT.lo_cab={x:r.x+.95,z:r.z+1.05,yaw:Math.PI,pose:'file'}}
});
/* ================= kundhörnan ================= */
(function(){const r=R.hub;const g=grp(scene,r.x,0,r.z);
  const rug=new THREE.Mesh(new THREE.CylinderGeometry(1.45,1.45,.012,48),new THREE.MeshStandardMaterial({color:'#D9B48E',roughness:.95}));rug.position.set(r.x+2.7,.008,r.z+2.85);rug.receiveShadow=true;scene.add(rug);ROOMFLOOR.hub=rug;
  /* spjälvägg med logga */
  const lw=grp(g,1.6,0,.35);for(let i=0;i<20;i++)rb(lw,.07,2.15,.07,.015,'#C79B6C',-1.3+i*2.6/19,1.075,0,{roughness:.55});rb(lw,2.75,.07,.14,.02,'#A87F57',0,2.17,0);rb(lw,2.75,.07,.14,.02,'#A87F57',0,.035,0);
  const lt=new THREE.TextureLoader().load('logo-color.png');lt.colorSpace=THREE.SRGBColorSpace;lt.anisotropy=8;
  const lp=grp(lw,0,1.3,.07);rb(lp,1.9,.78,.025,.04,'#ffffff',0,0,0,{roughness:.4});const lm=new THREE.Mesh(new THREE.PlaneGeometry(1.6,.52),new THREE.MeshBasicMaterial({map:lt,transparent:true,toneMapped:false}));lm.position.z=.014;lp.add(lm);
  /* kaffebar */
  const k=grp(g,4.55,0,.5);rb(k,1.2,.9,.6,.03,'#F2F1EE',0,.45,0,{roughness:.45});rb(k,1.24,.04,.64,.01,'#C59B6D',0,.92,0,{roughness:.45});
  const cm=grp(k,-.3,.94,-.05);rb(cm,.32,.42,.32,.05,'#2B2F2D',0,.21,0,{roughness:.35,metalness:.3});rb(cm,.22,.06,.1,.02,'#A9ADAA',0,.3,.17,{metalness:.7});SPOT.steamAt=new THREE.Vector3(r.x+4.25,1.3,r.z+.62);
  cy(k,.04,.1,'#ffffff',.15,.99,0,{roughness:.3});cy(k,.04,.1,'#C46F4E',.28,.99,.08,{roughness:.3});cy(k,.04,.1,'#2F5A45',.42,.99,-.05,{roughness:.3});
  SPOT.coffee={x:r.x+4.25,z:r.z+1.2,yaw:Math.PI,pose:'coffee'};SPOT.coffee2={x:r.x+4.95,z:r.z+1.3,yaw:Math.PI,pose:'coffee'};
  pendant(r.x+4.55,r.z+.55,1.0);
  /* växtö */
  const pi=grp(g,.95,0,2.2);cy(pi,.72,.24,'#F1EFEA',0,.12,0,{roughness:.6});pebbles(pi,.62,.24,45);const pg=grp(pi,0,.1,0);plants.push(plant(pg,-.25,-.15,1.15,1),plant(pg,.28,.05,.9),plant(pg,-.05,.35,.75,1));
  /* kafébord */
  const t=grp(g,2.7,0,2.75);cy(t,.42,.035,'#F4F2ED',0,.73,0,{roughness:.35});cy(t,.035,.7,'#7E9A8C',0,.37,0);cy(t,.24,.025,'#7E9A8C',0,.012,0);
  for(const th of [Math.PI,1.9,-1.9])woodChair(t,Math.sin(th)*.68,Math.cos(th)*.68,th);
  cy(t,.04,.09,'#ffffff',-.12,.79,.05,{roughness:.3});cy(t,.04,.09,'#B9853A',.15,.79,-.08,{roughness:.3});
  pendant(r.x+2.7,r.z+2.75,1.25);
  /* soffa */
  const s=grp(g,2.8,0,4.15);s.rotation.y=Math.PI/2;rb(s,.8,.4,1.8,.12,'#C7D1C9',0,.25,0,{roughness:.95});rb(s,.25,.75,1.8,.12,'#B9C5BB',-.3,.42,0,{roughness:.95});
  rb(s,.2,.3,.3,.08,'#D08A63',-.12,.6,-.55,{roughness:.95}).rotation.z=.25;rb(s,.2,.3,.3,.08,'#E6D9B8',-.12,.6,.5,{roughness:.95}).rotation.z=.25;
  plants.push(plant(g,4.95,4.15,1.0,1));
})();
plants.push(plant(scene,.35,6.85,.8),plant(scene,17.6,6.85,.8,1));
updScreens();

/* ================= kamera ================= */
const cam=new THREE.OrthographicCamera(-1,1,1,-1,.1,200);
const C={tx:9,ty:.4,tz:6.6,zoom:7,yaw:.7,pitch:.62,goal:null};
const G={tx:9,ty:.4,tz:6.6,zoom:7,yaw:.7};
function overviewZoom(){const asp=innerWidth/innerHeight;const mob=innerWidth<=760;const hw=mob?7.2:12.2;return Math.max(hw/asp,mob?5:7.4)*1.3}
function applyCam(){const asp=innerWidth/innerHeight;const h=C.zoom;cam.left=-h*asp;cam.right=h*asp;cam.top=h;cam.bottom=-h;cam.updateProjectionMatrix();
  const d=new THREE.Vector3(-Math.sin(C.yaw)*Math.cos(C.pitch),Math.sin(C.pitch),Math.cos(C.yaw)*Math.cos(C.pitch));
  /* panelen tar plats till höger: förskjut bilden */
  cam.position.set(C.tx+d.x*50,C.ty+d.y*50,C.tz+d.z*50);cam.lookAt(C.tx,C.ty,C.tz);cam.updateMatrixWorld();
  const off=C.off||0;if(off){cam.left+=off;cam.right+=off;cam.updateProjectionMatrix()}
  C.offy=C.offy||0;if(C.offy){cam.top+=C.offy;cam.bottom+=C.offy;cam.updateProjectionMatrix()}}
function resize(){renderer.setSize(innerWidth,innerHeight,false);if(!cur)overview(true)}
let cur=null,follow=null;
function overview(instant){cur=null;follow=null;const mob=innerWidth<=760;Object.assign(G,{tx:mob?8.6:9.2,ty:.4,tz:mob?6.4:6.5,zoom:overviewZoom(),off:0,offy:mob?-1.2:-.6,yaw:.7+Math.round((G.yaw-.7)/(Math.PI*2))*Math.PI*2,pitch:.62});if(instant)Object.assign(C,G);setFocus(null)}

/* ================= etiketter ================= */
const LBL=document.getElementById('labels');
function lbl(html,cls){const d=document.createElement('div');d.className='lb';d.innerHTML=html;LBL.appendChild(d);return d}
const SIGNS=[];
AGENTS.forEach(a=>{const r=R[a.id];const el=lbl('<div class="sign" style="--c:'+a.c+'" data-agent="'+a.id+'"><i></i><span class="tx"><b>'+a.role+'</b><small>'+a.dept+'</small></span></div>');SIGNS.push({el,p:new THREE.Vector3(r.cx,2.55+r.y,r.z+(r.back?.3:.6))});
  const ag=AG[a.id];ag.stEl=lbl('<div class="status" style="--c:'+a.c+'">'+a.work[0]+'</div>');ag.pgEl=lbl('<div class="ping" style="--c:'+a.c+'"></div>')});

LBL.addEventListener('click',e=>{const s=e.target.closest('[data-agent]');if(s)focusAgent(s.dataset.agent)});
const V3=new THREE.Vector3();
function place(el,p,dy=0){V3.copy(p).project(cam);const x=(V3.x*.5+.5)*innerWidth,y=(-V3.y*.5+.5)*innerHeight+dy;el.style.transform='translate('+x.toFixed(1)+'px,'+y.toFixed(1)+'px)'}

/* ================= vägar ================= */
const CORZ=6.85;
function roomOf(x,z){for(const k in R){const r=R[k];if(x>=r.x-.1&&x<=r.x+r.w+.1&&z>=r.z-.1&&z<=r.z+r.d+.1)return k}return 'cor'}
function path(from,to){const a=roomOf(from.x,from.z),b=roomOf(to.x,to.z);const P=[];
  if(a===b&&a!=='cor')return [to];
  if(a!=='cor'){const r=R[a];if(r.back)P.push({x:r.door.x,z:r.door.z-.6},{x:r.door.x,z:r.door.z});else P.push({x:r.door.x,z:from.z},{x:r.door.x,z:r.door.z});P.push({x:r.door.x,z:CORZ})}
  if(b!=='cor'){const r=R[b];P.push({x:r.door.x,z:CORZ},{x:r.door.x,z:r.door.z});P.push(r.back?{x:r.door.x,z:r.door.z-.6}:{x:r.door.x,z:to.z})}
  P.push(to);return P}

/* ================= poser och animation ================= */
const J=['hy','thL','knL','thR','knR','shL','shLz','elL','shR','shRz','elR','hdY','hdX','tsX'];
const POSES={
  stand:{hy:.43,thL:0,knL:0,thR:0,knR:0,shL:0,shLz:-.08,elL:-.1,shR:0,shRz:.08,elR:-.1,hdY:0,hdX:0,tsX:0},
  sit:{hy:.42,thL:-1.45,knL:1.25,thR:-1.45,knR:1.25,shL:-.3,shLz:-.1,elL:-.6,shR:-.3,shRz:.1,elR:-.6,hdY:0,hdX:.05,tsX:.05},
  type:{hy:.42,thL:-1.45,knL:1.25,thR:-1.45,knR:1.25,shL:-1.0,shLz:-.05,elL:-.55,shR:-1.0,shRz:.05,elR:-.55,hdY:0,hdX:.08,tsX:.08},
  coffee:{hy:.43,thL:0,knL:0,thR:0,knR:0,shL:0,shLz:-.08,elL:-.1,shR:-.55,shRz:.12,elR:-1.25,hdY:0,hdX:0,tsX:0},
  sip:{hy:.43,thL:0,knL:0,thR:0,knR:0,shL:0,shLz:-.08,elL:-.1,shR:-1.15,shRz:.25,elR:-1.9,hdY:0,hdX:-.15,tsX:-.03},
  reach:{hy:.43,thL:0,knL:0,thR:0,knR:0,shL:-2.5,shLz:-.1,elL:-.25,shR:-2.2,shRz:.1,elR:-.3,hdY:0,hdX:-.25,tsX:-.04},
  reach2:{hy:.43,thL:0,knL:0,thR:0,knR:0,shL:-1.4,shLz:-.1,elL:-.5,shR:-1.6,shRz:.1,elR:-.4,hdY:.1,hdX:-.05,tsX:0},
  point:{hy:.43,thL:0,knL:0,thR:0,knR:0,shL:-.3,shLz:-.2,elL:-1.4,shR:-1.6,shRz:-.35,elR:-.15,hdY:-.5,hdX:-.05,tsX:0},
  phone:{hy:.43,thL:0,knL:0,thR:0,knR:0,shL:-.4,shLz:-.1,elL:-1.3,shR:-.35,shRz:.65,elR:-2.5,hdY:.15,hdX:.05,tsX:0},
  give:{hy:.43,thL:0,knL:0,thR:0,knR:0,shL:0,shLz:-.08,elL:-.1,shR:-1.25,shRz:.05,elR:-.25,hdY:0,hdX:.12,tsX:.05},
  file:{hy:.4,thL:-.35,knL:.6,thR:-.1,knR:.25,shL:-.9,shLz:-.05,elL:-.6,shR:-1.1,shRz:.05,elR:-.4,hdY:0,hdX:.3,tsX:.15},
  carry:{shR:-.6,shRz:.1,elR:-1.3},
};
function setJ(P,k,v){switch(k){case'hy':P.hips.position.y=v;break;case'thL':P.thL.rotation.x=v;break;case'knL':P.knL.rotation.x=v;break;case'thR':P.thR.rotation.x=v;break;case'knR':P.knR.rotation.x=v;break;
  case'shL':P.shL.rotation.x=v;break;case'shLz':P.shL.rotation.z=v;break;case'elL':P.elL.rotation.x=v;break;case'shR':P.shR.rotation.x=v;break;case'shRz':P.shR.rotation.z=v;break;case'elR':P.elR.rotation.x=v;break;
  case'hdY':P.head.rotation.y=v;break;case'hdX':P.head.rotation.x=v;break;case'tsX':P.torso.rotation.x=v;break}}
for(const id in AG){const g=AG[id];Object.assign(g.pose,POSES.type)}

/* föremål */
function item(kind,c){const g=new THREE.Group();
  if(kind==='cup'){cy(g,.045,.11,'#FFFFFF',0,0,.04,{roughness:.3});cy(g,.038,.005,'#5b3a22',0,.054,.04)}
  if(kind==='folder'){rb(g,.03,.3,.24,.01,c,0,-.02,.05,{roughness:.5});rb(g,.025,.28,.22,.005,'#ffffff',.012,-.02,.05)}
  if(kind==='binder'){rb(g,.07,.32,.26,.01,c,0,.05,.05,{roughness:.5})}
  if(kind==='phone'){rb(g,.02,.15,.07,.01,'#1d1d1d',.02,.04,0,{roughness:.3})}
  if(kind==='paper'){rb(g,.01,.28,.21,.002,'#ffffff',0,-.04,.05)}
  g.traverse(o=>{if(o.isMesh)o.castShadow=true});return g}
function hold(ag,kind,c){drop(ag);if(!kind)return;ag.carry=item(kind,c);ag.P.hR.add(ag.carry)}
function drop(ag){if(ag.carry){ag.carry.removeFromParent();ag.carry=null}}

/* ================= uppgifter ================= */
function T(ag,list){ag.q.push(...list)}
function goTo(ag,spot){return {k:'walk',pts:null,spot}}
function busyCount(){let n=0;for(const id in AG)if(AG[id].away)n++;return n}
const occupied={};
function start(ag,kind){ag.away=true;const a=ag.a;const q=[{k:'standup'}];const back=[{k:'walk',to:ag.stand},{k:'sitdown'}];
  if(kind==='coffee'){const s=occupied.coffee?SPOT.coffee2:SPOT.coffee;const key=occupied.coffee?'coffee2':'coffee';occupied[key]=1;
    q.push({k:'status',tx:'Hämtar kaffe'},{k:'walk',to:s},{k:'face',yaw:s.yaw},{k:'steam'},{k:'act',pose:'stand',dur:1.6},{k:'hold',it:'cup'},{k:'act',pose:'coffee',dur:1.2},{k:'act',pose:'sip',dur:1.3},{k:'act',pose:'coffee',dur:1.4},{k:'free',key},{k:'status',tx:'På väg tillbaka med kaffe'},...back,{k:'hold',it:null},{k:'deskcup'})}
  if(kind==='archive'){const s=a.id==='re'?SPOT.re_shelf:SPOT.ra_shelf;const col=a.c;
    q.push({k:'status',tx:'Hämtar pärm från arkivet'},{k:'walk',to:s},{k:'face',yaw:s.yaw},{k:'act',pose:'reach',dur:1.3},{k:'hold',it:'binder',c:col},{k:'act',pose:'stand',dur:.6},{k:'status',tx:'Arkiverar verifikationer'},{k:'act',pose:'reach2',dur:2.2},{k:'act',pose:'reach',dur:1.2},{k:'hold',it:null},{k:'act',pose:'stand',dur:.5},...back)}
  if(kind==='print'){const s=SPOT.re_print;q.push({k:'status',tx:'Hämtar utskrift'},{k:'printer'},{k:'walk',to:s},{k:'face',yaw:s.yaw},{k:'act',pose:'reach2',dur:1.2},{k:'hold',it:'paper'},{k:'act',pose:'give',dur:1.0},...back,{k:'hold',it:null})}
  if(kind==='chart'){const s=SPOT.co_chart;q.push({k:'status',tx:'Går igenom resultatet'},{k:'walk',to:s},{k:'face',yaw:s.yaw},{k:'act',pose:'point',dur:2.4},{k:'act',pose:'stand',dur:.8},{k:'act',pose:'point',dur:2.0},...back)}
  if(kind==='phone'){const s=SPOT.sk_phone;q.push({k:'status',tx:'Ringer Skatteverket'},{k:'walk',to:s},{k:'face',yaw:s.yaw},{k:'hold',it:'phone'},{k:'act',pose:'phone',dur:5.5,talk:1},{k:'hold',it:null},...back)}
  if(kind==='file'){const s=SPOT.lo_cab;q.push({k:'status',tx:'Arkiverar lönebesked'},{k:'walk',to:s},{k:'face',yaw:s.yaw},{k:'act',pose:'file',dur:3.2},{k:'act',pose:'stand',dur:.6},...back)}
  if(kind&&kind.flow){const f=kind.flow;const to=AG[f[1]];const s={x:to.seat.x+1.0,z:to.seat.z-.15,yaw:-Math.PI/2};
    q.push({k:'hold',it:'folder',c:a.c},{k:'status',tx:'Lämnar '+f[2].toLowerCase()+' till '+to.a.role.toLowerCase()},{k:'walk',to:s,line:f},{k:'face',yaw:s.yaw},{k:'look',who:f[1]},{k:'act',pose:'give',dur:1.3},{k:'deliver',f},{k:'hold',it:null},{k:'act',pose:'stand',dur:1.2,talk:1},...back)}
  q.push({k:'done'});T(ag,q)}

const tmpV=new THREE.Vector3();
function runTasks(ag,dt){
  if(!ag.cur){ag.cur=ag.q.shift();if(!ag.cur)return;ag.cur.t=0}
  const c=ag.cur;c.t+=dt;let fin=false;
  switch(c.k){
    case 'standup':ag.state='stand';ag.tpose='stand';ag.pos.lerp(ag.stand,Math.min(1,dt*4));ag.chairPull=Math.min(1,(ag.chairPull||0)+dt*2);if(c.t>.55){ag.pos.copy(ag.stand);fin=true}break;
    case 'sitdown':ag.tyaw=Math.PI;if(c.t<.35)break;ag.pos.lerp(ag.seat,Math.min(1,dt*5));ag.tpose='type';ag.chairPull=Math.max(0,(ag.chairPull||0)-dt*2);if(c.t>.9){ag.pos.copy(ag.seat);ag.state='sit';fin=true}break;
    case 'walk':{if(!c.pts){c.pts=path(ag.pos,c.to);c.i=0;if(c.line)c.lineObj=floorLine(ag.a.c,[{x:ag.pos.x,z:ag.pos.z},...c.pts])}
      ag.state='walk';const p=c.pts[c.i];const dx=p.x-ag.pos.x,dz=p.z-ag.pos.z,dist=Math.hypot(dx,dz);const sp=1.0*dt;
      if(dist<sp+.01){ag.pos.x=p.x;ag.pos.z=p.z;c.i++;if(c.i>=c.pts.length){fin=true;ag.state='stand';if(c.lineObj)fadeLine(c.lineObj)}}
      else{ag.pos.x+=dx/dist*sp;ag.pos.z+=dz/dist*sp;ag.tyaw=Math.atan2(dx,dz);ag.phase+=sp*7.5}break}
    case 'face':ag.tyaw=c.yaw;if(c.t>.35)fin=true;break;
    case 'act':ag.tpose=c.pose;ag.talk=c.talk;if(c.t>=c.dur){fin=true;ag.talk=0}break;
    case 'hold':hold(ag,c.it,c.c);fin=true;break;
    case 'status':status(ag,c.tx,true);fin=true;break;
    case 'free':occupied[c.key]=0;fin=true;break;
    case 'look':{const o=AG[c.who];o.lookAt=ag;fin=true;break}
    case 'deliver':{const f=c.f;arrive(f);AG[f[1]].lookAt=null;fin=true;break}
    case 'steam':steam(SPOT.steamAt,3);fin=true;break;
    case 'printer':printOut();fin=true;break;
    case 'deskcup':fin=true;break;
    case 'done':ag.away=false;status(ag,ag.a.work[Math.floor(Math.random()*ag.a.work.length)],false);ag.next=performance.now()/1000+35+Math.random()*45;fin=true;break;
  }
  if(fin)ag.cur=null}
function status(ag,text,away){const el=ag.stEl.firstChild;el.textContent=text;el.classList.toggle('away',!!away)}

/* ================= linjer, ånga, skrivare ================= */
function floorLine(c,pts){const v=[];pts.forEach(p=>v.push(new THREE.Vector3(p.x,floorH(p.z)+.03,p.z)));const g=new THREE.BufferGeometry().setFromPoints(v);
  const m=new THREE.LineDashedMaterial({color:c,dashSize:.12,gapSize:.14,transparent:true,opacity:.85,linewidth:2});const l=new THREE.Line(g,m);l.computeLineDistances();scene.add(l);return l}
function fadeLine(l){let o=.85;const iv=setInterval(()=>{o-=.06;l.material.opacity=o;if(o<=0){clearInterval(iv);l.removeFromParent()}},40)}
const puffs=[];
function steam(at,n){for(let i=0;i<n*4;i++){const m=new THREE.Mesh(new THREE.SphereGeometry(1,12,8),new THREE.MeshStandardMaterial({color:'#ffffff',transparent:true,opacity:0,depthWrite:false,roughness:1}));m.scale.setScalar(.04);m.position.copy(at);scene.add(m);puffs.push({m,t:-i*.25,vx:(Math.random()-.5)*.05})}}
function printOut(){SPOT.printerPaper.userData.t=0}

/* ================= flöden ================= */
const DOC='<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M4 1.5h5.5L12.5 4.5V14.5H4Z"/><path d="M9 1.5V5h3.5M6 8h4.5M6 10.5h4.5"/></svg>';
const feed={insertBefore(){},children:[],firstChild:null,removeChild(){}};let verif=1044;
function nameOf(id){return id==='hub'?'dig':byId[id].role}
function colorOf(id){return id==='hub'?'#2F5A45':byId[id].c}
function addFeed(f){const now=new Date();const li=document.createElement('li');
  li.innerHTML='<span class="dots"><i style="background:'+colorOf(f[0])+'"></i><s></s><i style="background:'+colorOf(f[1])+'"></i></span><span><b>'+nameOf(f[0])+'</b> → '+(f[1]==='hub'?'dig':'<b>'+nameOf(f[1])+'</b>')+'<br>'+f[3]+'</span><time>'+String(now.getHours()).padStart(2,'0')+':'+String(now.getMinutes()).padStart(2,'0')+'</time>';
  feed.insertBefore(li,feed.firstChild);while(feed.children.length>4)feed.removeChild(feed.lastChild)}
function arrive(f){addFeed(f);if(f[1]!=='hub'){const b=AG[f[1]];const pg=b.pgEl.firstChild;pg.textContent='+1 '+f[2].toLowerCase();pg.classList.add('show');setTimeout(()=>pg.classList.remove('show'),2400);pulse(f[1])}else pulse('hub');
  if(f[0]==='re'){verif++;const s1=document.getElementById('s1');if(s1)s1.textContent=(verif-1).toLocaleString('sv-SE')}}
function pulse(k){const m=ROOMFLOOR[k].material;const base=m.color.clone();const hi=new THREE.Color(k==='hub'?'#2F5A45':byId[k].c).lerp(new THREE.Color('#ffffff'),.45);let t=0;const iv=setInterval(()=>{t+=.05;const s=Math.sin(Math.min(1,t)*Math.PI);m.color.copy(base).lerp(hi,s*.7);if(t>=1){clearInterval(iv);m.color.copy(base)}},40)}
/* digitala flöden: ett litet dokument som glider längs golvet */
const PK=[];
function digital(f){const A0=f[0]==='hub'?null:AG[f[0]];const from={x:A0.seat.x,z:A0.seat.z+.5};const to=f[1]==='hub'?{x:R.hub.door.x,z:R.hub.z+1.8}:{x:AG[f[1]].seat.x+.6,z:AG[f[1]].seat.z};
  const pts=[from,...path(from,to)];const c=colorOf(f[0]);const line=floorLine(c,pts);
  const orb=new THREE.Mesh(new THREE.SphereGeometry(.09,18,12),new THREE.MeshStandardMaterial({color:c,emissive:c,emissiveIntensity:.8,roughness:.3}));scene.add(orb);
  const el=lbl('<div class="pkt" style="--c:'+c+'">'+DOC+'<span>'+f[2]+'</span></div>');
  let L=[],tot=0;for(let i=1;i<pts.length;i++){const l=Math.hypot(pts[i].x-pts[i-1].x,pts[i].z-pts[i-1].z);L.push(l);tot+=l}
  PK.push({f,pts,L,tot,t:0,dur:Math.max(2.5,tot/2.6),orb,el,line})}
let fi=0;
function nextFlow(){const f=FLOWS[fi++%FLOWS.length];
  if(f[4]&&!RM){const ag=AG[f[0]];if(!ag.away&&busyCount()<1&&!(cur===f[0])){start(ag,{flow:f});return}}
  digital(f)}

/* ================= panel och fokus ================= */
const panel=document.getElementById('panel'),pbody=document.getElementById('pbody');
function setFocus(id){document.body.classList.toggle('focus',!!id);
  for(const k in AG)AG[k].stEl.firstChild.classList.toggle('me',k===id);
  document.querySelectorAll('.rb').forEach(b=>b.setAttribute('aria-pressed',b.dataset.id===(id||'all')));
  if(!id||id==='hub'){panel.classList.remove('open','chatting');panel.setAttribute('aria-hidden','true');return}
  const a=byId[id];panel.style.setProperty('--c',a.c);const av=document.getElementById('pav');['c','skin','hair','top'].forEach(k=>av.style.setProperty('--'+k,k==='c'?a.c:k==='top'?a.look.jacket:a.look[k]));
  document.getElementById('pname').textContent=a.role;document.getElementById('pdept').textContent=a.dept+' · digital medarbetare';
  pbody.innerHTML='<h3>Ansvarar för</h3><p class="p-lead">'+a.lead+'</p><div class="chips" style="margin-top:10px">'+a.tasks.map(t=>'<span>'+t+'</span>').join('')+'</div>'+
   '<h3>Skärmen just nu</h3><div class="mon"><div class="scr" id="pscr">'+screenHtml(a.id,tick,a.c)+'</div></div>'+
   '<h3>Vad gör '+a.role.toLowerCase()+'?</h3>'+stepsHtml(a.id)+
   '<div class="more" id="pmoretx"><h3>Om '+a.role.toLowerCase()+'</h3><p class="p-lead">'+a.more+'</p><h3>Samarbetar med teamet</h3><div class="flowlist"><div><b>Får in</b>'+a.from+'</div><div><b>Lämnar vidare</b>'+a.to+'</div></div></div>';
  document.getElementById('pmore').textContent='Läs mer';document.getElementById('pchat').textContent='Chatta med '+a.role.toLowerCase();
  panel.classList.remove('chatting');panel.classList.add('open');panel.setAttribute('aria-hidden','false');pbody.scrollTop=0;mountSteps(pbody)}
function focusAgent(id){const mob=innerWidth<=760;hideHint();
  if(id==='hub'){cur='hub';follow=null;setFocus('hub');Object.assign(G,{tx:R.hub.cx,ty:.6,tz:R.hub.cz,zoom:mob?3.6:3.4,off:0,offy:0});return}
  cur=id;follow=AG[id];setFocus(id);Object.assign(G,{zoom:mob?1.9:1.75,off:mob?0:1.75*innerWidth/innerHeight*.33,offy:mob?-1.0:0})}
document.getElementById('pclose').onclick=()=>overview();
document.getElementById('pmore').onclick=function(){const m=document.getElementById('pmoretx');const o=m.classList.toggle('open');this.textContent=o?'Visa mindre':'Läs mer';if(o)m.scrollIntoView({behavior:'smooth',block:'start'})};
const msgs=document.getElementById('msgs'),sugg=document.getElementById('sugg');
function addMsg(t,who){const m=document.createElement('div');m.className='m '+who;m.textContent=t;msgs.appendChild(m);msgs.scrollTop=msgs.scrollHeight;return m}
function reply(t){const ty=document.createElement('div');ty.className='m a typing';ty.innerHTML='<i></i><i></i><i></i>';msgs.appendChild(ty);msgs.scrollTop=msgs.scrollHeight;setTimeout(()=>{ty.remove();addMsg(t,'a')},900+Math.min(1400,t.length*8))}
document.getElementById('pchat').onclick=()=>{const a=byId[cur];panel.classList.add('chatting');msgs.innerHTML='';
  addMsg('Hej! Jag är '+a.role.toLowerCase()+' på Ekonomika och arbetar med '+a.dept.toLowerCase()+'. Vad vill du veta?','a');
  sugg.innerHTML='';a.qa.forEach(q=>{const b=document.createElement('button');b.type='button';b.textContent=q[0];b.onclick=()=>{addMsg(q[0],'u');b.remove();reply(q[1])};sugg.appendChild(b)});
  const back=document.createElement('button');back.type='button';back.textContent='← Tillbaka till profilen';back.onclick=()=>panel.classList.remove('chatting');sugg.appendChild(back)};
document.getElementById('cform').onsubmit=e=>{e.preventDefault();const i=document.getElementById('cin');const v=i.value.trim();if(!v)return;addMsg(v,'u');i.value='';
  reply('Bra fråga! I den färdiga versionen svarar '+byId[cur].role.toLowerCase()+' på den här direkt. I prototypen finns bara exempelsvaren ovan, men du når oss alltid via kontaktsidan.')};
const roster=document.getElementById('roster');
roster.innerHTML='<button type="button" class="rb all" data-id="all" aria-pressed="true"><i></i>Hela kontoret</button>'+AGENTS.map(a=>'<button type="button" class="rb" data-id="'+a.id+'" style="--c:'+a.c+'" aria-pressed="false"><i></i>'+a.role+'</button>').join('');
roster.onclick=e=>{const b=e.target.closest('.rb');if(!b)return;if(b.dataset.id==='all')overview();else focusAgent(b.dataset.id)};

/* ================= interaktion ================= */
const hintEl=document.getElementById('hint');function hideHint(){hintEl.style.opacity=0}setTimeout(hideHint,7000);
const ray=new THREE.Raycaster(),mv=new THREE.Vector2();
function pickAt(x,y){mv.set(x/innerWidth*2-1,-(y/innerHeight)*2+1);ray.setFromCamera(mv,cam);const hits=ray.intersectObjects(scene.children,true);
  for(const h of hits){let o=h.object;if(o.material&&o.material.transparent&&o.material.opacity<.3)continue;while(o){if(o.userData.pick)return o.userData.pick;o=o.parent}}return null}
let drag=null,moved=0;const pts={};let pin=null;
view.addEventListener('contextmenu',e=>e.preventDefault());
view.addEventListener('pointerdown',e=>{pts[e.pointerId]={x:e.clientX,y:e.clientY};const k=Object.keys(pts);
  if(k.length===1){drag={x:e.clientX,y:e.clientY,rot:!(e.button===2||e.shiftKey),tx:G.tx,tz:G.tz,yaw:G.yaw,pitch:G.pitch??.62};moved=0}
  else{drag=null;const a=pts[k[0]],b=pts[k[1]];pin={d:Math.hypot(a.x-b.x,a.y-b.y),z:G.zoom,mx:(a.x+b.x)/2,my:(a.y+b.y)/2,tx:G.tx,tz:G.tz}}});
addEventListener('pointermove',e=>{if(!pts[e.pointerId]){if(e.target===renderer.domElement&&!(e.timeStamp%3<1)){}return}pts[e.pointerId]={x:e.clientX,y:e.clientY};const k=Object.keys(pts);
  if(pin&&k.length>=2){const a=pts[k[0]],b=pts[k[1]];G.zoom=clampZ(pin.z*pin.d/Math.hypot(a.x-b.x,a.y-b.y));moved=99;C.zoom=G.zoom;if(follow)follow=null;pan((a.x+b.x)/2-pin.mx,(a.y+b.y)/2-pin.my,pin.tx,pin.tz);return}
  if(!drag)return;const dx=e.clientX-drag.x,dy=e.clientY-drag.y;moved=Math.max(moved,Math.abs(dx)+Math.abs(dy));if(moved<6)return;view.classList.add('drag');hideHint();
  if(drag.rot){G.yaw=drag.yaw+dx*.006;G.pitch=Math.max(.18,Math.min(1.42,drag.pitch+dy*.004));return}
  if(follow){follow=null}
  pan(dx,dy,drag.tx,drag.tz)});
function up(e){const wasDrag=moved>6;delete pts[e.pointerId];if(Object.keys(pts).length<2)pin=null;
  if(drag&&!wasDrag&&e.type==='pointerup'&&e.target===renderer.domElement){const id=pickAt(e.clientX,e.clientY);if(id)focusAgent(id)}
  drag=null;view.classList.remove('drag')}
addEventListener('pointerup',up);addEventListener('pointercancel',up);
let hovT=0;view.addEventListener('pointermove',e=>{if(drag||performance.now()-hovT<90)return;hovT=performance.now();const hid=pickAt(e.clientX,e.clientY);view.classList.toggle('hov',!!hid);for(const k in AG)AG[k].stEl.firstChild.classList.toggle('hov',k===hid)});
function clampZ(z){return Math.max(1.1,Math.min(overviewZoom()*1.2,z))}
function pan(dx,dy,tx0,tz0){const wpp=2*C.zoom/innerHeight;const yaw=C.yaw;const rx=Math.cos(yaw),rz=Math.sin(yaw);const fx=Math.sin(yaw),fz=-Math.cos(yaw);const sp=Math.max(.3,Math.sin(C.pitch));
  G.tx=tx0-rx*dx*wpp+fx*dy*wpp/sp;G.tz=tz0-rz*dx*wpp+fz*dy*wpp/sp;G.tx=Math.max(-2,Math.min(W+2,G.tx));G.tz=Math.max(-2,Math.min(D+2,G.tz));C.tx=G.tx;C.tz=G.tz}
function clampYaw(y){return Math.max(.25,Math.min(1.25,y))}
const EMB=new URLSearchParams(location.search).has('embed');let act=!EMB;
if(EMB){document.body.classList.add('emb');view.addEventListener('pointerdown',()=>act=true);document.addEventListener('mouseleave',()=>act=false);addEventListener('blur',()=>act=false);
  const coarse=matchMedia('(pointer:coarse)').matches;if(coarse)view.style.touchAction='pan-y';
  document.getElementById('hint').textContent=coarse?'Dra åt sidan för att vrida kontoret. Tryck på en medarbetare för att läsa mer.':'Dra för att vrida runt kontoret. Klicka i kontoret och scrolla för att zooma.'}
view.addEventListener('wheel',e=>{if(!act&&!e.ctrlKey&&!e.metaKey)return;e.preventDefault();G.zoom=clampZ(G.zoom*Math.exp(e.deltaY*.0012));C.zoom=C.zoom+(G.zoom-C.zoom)*.5;hideHint()},{passive:false});
document.getElementById('zin').onclick=()=>G.zoom=clampZ(G.zoom/1.3);document.getElementById('zout').onclick=()=>G.zoom=clampZ(G.zoom*1.3);
document.getElementById('rl').onclick=()=>G.yaw-=Math.PI/4;document.getElementById('rr').onclick=()=>G.yaw+=Math.PI/4;
addEventListener('keydown',e=>{if(e.key==='Escape'){if(panel.classList.contains('chatting'))panel.classList.remove('chatting');else overview()}});
addEventListener('resize',resize);
const fb=document.getElementById('flowbtn');let flowOn=true;fb.onclick=()=>{flowOn=!flowOn;fb.setAttribute('aria-pressed',flowOn)};

/* ================= huvudloop ================= */
const WALLS={back:[],right:[]};{scene.updateMatrixWorld(true);const bx=new THREE.Box3();const persons=new Set();for(const id in AG)AG[id].P.root.traverse(o=>persons.add(o));
  scene.traverse(o=>{if(!(o.isMesh||o.isLine)||persons.has(o))return;bx.setFromObject(o);if(bx.max.z<.35&&bx.max.y>.5)WALLS.back.push(o);else if(bx.min.x>17.75)WALLS.right.push(o)})}
resize();overview(true);C.zoom=G.zoom*1.5;C.yaw=G.yaw-.25;C.pitch=.8;
let last=performance.now(),flowT=2.5,scrT=0;
const STARTS={re:['coffee','archive','print'],co:['coffee','chart'],sk:['coffee','phone','archive'],ra:['coffee','archive'],lo:['coffee','file']};
function frame(now){const dt=Math.min(.05,(now-last)/1000);last=now;const t=now/1000;
  /* kamera mjukt mot mål */
  if(follow){const p=follow.pos;G.tx=p.x+(follow.state==='sit'?.1:0);G.tz=p.z-(follow.state==='sit'?.55:0);G.ty=.75+follow.y}
  const k=1-Math.exp(-dt*4.5);C.tx+=(G.tx-C.tx)*k;C.ty+=((G.ty??.4)-C.ty)*k;C.tz+=(G.tz-C.tz)*k;C.zoom+=(G.zoom-C.zoom)*k;C.yaw+=(G.yaw-C.yaw)*k;C.pitch+=((G.pitch??.62)-C.pitch)*k;
  {const cp=Math.cos(C.pitch),dz=Math.cos(C.yaw)*cp,dx=-Math.sin(C.yaw)*cp;const hb=dz<.12,hr=dx>-.12;if(hb!==WALLS.hb){WALLS.hb=hb;WALLS.back.forEach(o=>o.visible=!hb)}if(hr!==WALLS.hr){WALLS.hr=hr;WALLS.right.forEach(o=>o.visible=!hr)}}
  C.off=(C.off||0)+((G.off||0)-(C.off||0))*k;C.offy=(C.offy||0)+((G.offy||0)-(C.offy||0))*k;applyCam();
  /* beteenden */
  for(const id in AG){const ag=AG[id];
    if(!ag.away&&!ag.q.length&&!ag.cur&&t>ag.next&&busyCount()<1&&cur!==id&&!RM){const list=STARTS[id];start(ag,list[Math.floor(Math.random()*list.length)])}
    if(ag.q.length||ag.cur)runTasks(ag,dt);
    /* tillbaka till skrivbordet när man fokuserar */
    animate(ag,dt,t)}
  /* digitala flöden */
  if(flowOn){flowT-=dt;if(flowT<=0){flowT=9;nextFlow()}}
  for(let i=PK.length-1;i>=0;i--){const p=PK[i];p.t+=dt;let q=Math.min(1,p.t/p.dur);q=q<.5?2*q*q:1-Math.pow(-2*q+2,2)/2;let d=q*p.tot,j=0;while(j<p.L.length-1&&d>p.L[j]){d-=p.L[j];j++}
    const u=p.L[j]?d/p.L[j]:1;const x=p.pts[j].x+(p.pts[j+1].x-p.pts[j].x)*u,z=p.pts[j].z+(p.pts[j+1].z-p.pts[j].z)*u;p.orb.position.set(x,floorH(z)+.35,z);tmpV.set(x,floorH(z)+.5,z);place(p.el,tmpV);
    if(q>=1){p.orb.removeFromParent();p.el.remove();fadeLine(p.line);arrive(p.f);PK.splice(i,1)}}
  /* ånga */
  for(let i=puffs.length-1;i>=0;i--){const p=puffs[i];p.t+=dt;if(p.t<0)continue;p.m.position.y+=dt*.25;p.m.position.x+=p.vx*dt;p.m.scale.setScalar(.04+p.t*.05);p.m.material.opacity=Math.max(0,.5-p.t*.3);if(p.t>1.7){p.m.removeFromParent();puffs.splice(i,1)}}
  /* skrivarpapper */
  const pp=SPOT.printerPaper;if(pp.userData.t!==undefined){pp.userData.t+=dt;pp.position.z=.2+Math.min(.25,pp.userData.t*.12);if(pp.userData.t>4){delete pp.userData.t;pp.position.z=.2}}
  /* växter */
  
  /* skärmar */
  scrT+=dt;if(scrT>2.6){scrT=0;tick++;updScreens();if(cur&&cur!=='hub'){const ps=document.getElementById('pscr');if(ps)ps.innerHTML=screenHtml(cur,tick,byId[cur].c)}}
  /* etiketter */
  SIGNS.forEach(s=>place(s.el,s.p));
  for(const id in AG){const ag=AG[id];tmpV.set(ag.pos.x,ag.y+(ag.state==='sit'?1.45:1.55),ag.pos.z);place(ag.stEl,tmpV);tmpV.y+=.32;place(ag.pgEl,tmpV)}
  renderer.render(scene,cam);requestAnimationFrame(frame)}

function animate(ag,dt,t){const P=ag.P;
  /* rotation */
  let dy=ag.tyaw-ag.yaw;while(dy>Math.PI)dy-=Math.PI*2;while(dy<-Math.PI)dy+=Math.PI*2;ag.yaw+=dy*Math.min(1,dt*5);
  ag.y+=(floorH(ag.pos.z)-ag.y)*Math.min(1,dt*12);P.root.position.set(ag.pos.x,ag.y,ag.pos.z);P.root.rotation.y=ag.yaw;
  /* stolen dras ut när man reser sig */
  ag.chair.position.z=(ag.chairBase??(ag.chairBase=ag.chair.position.z))+(ag.chairPull||0)*.35;
  /* målpose */
  const tp=Object.assign({},POSES[ag.tpose]||POSES.stand);
  if(ag.state==='walk'){const s=Math.sin(ag.phase),c=Math.cos(ag.phase);Object.assign(tp,POSES.stand,{thL:-.55*s,thR:.55*s,knL:Math.max(0,.9*-Math.sin(ag.phase-.9)),knR:Math.max(0,.9*Math.sin(ag.phase-.9)),shL:.45*s,shR:-.45*s,elL:-.35,elR:-.35,hy:.43+Math.abs(c)*.025,tsX:.06});
    if(ag.carry)Object.assign(tp,POSES.carry)}
  if(ag.tpose==='type'&&ag.state==='sit'){const k=Math.sin(t*8+ag.blinkT*5);tp.elL+=k*.025;tp.elR-=k*.025;
    /* tittar ibland upp eller åt sidan */
    ag.lookT-=dt;if(ag.lookT<0){ag.lookT=7+Math.random()*9;ag.lookY=Math.random()<.18?(Math.random()-.5)*.8:0}tp.hdY=ag.lookY||0;if(Math.abs(tp.hdY)>.2){tp.shL=-.4;tp.shR=-.4;tp.elL=-.9;tp.elR=-.9}}
  if(ag.lookAt){const o=ag.lookAt.pos;const want=Math.atan2(o.x-ag.pos.x,o.z-ag.pos.z)-ag.yaw;let w=want;while(w>Math.PI)w-=Math.PI*2;while(w<-Math.PI)w+=Math.PI*2;tp.hdY=Math.max(-1.3,Math.min(1.3,w));tp.hdX=-.05}
  if(ag.talk){tp.hdX+=Math.sin(t*3)*.03;tp.shL+=Math.sin(t*2)*.06}
  if(ag.state==='stand'&&ag.tpose==='stand'){tp.hdY=Math.sin(t*.4+ag.blinkT)*.06}
  const kk=1-Math.exp(-dt*(ag.state==='walk'?14:4));
  for(const j of J){const v=ag.pose[j]??0;const nv=v+((tp[j]??0)-v)*kk;ag.pose[j]=nv;setJ(P,j,nv)}
  /* andning och blinkning */
  P.torso.scale.y=1+Math.sin(t*1.6+ag.blinkT)*.006;
  ag.blinkT+=dt;const bt=(ag.blinkT%4.2);P.eyes.scale.y=bt<.12?.12:1;
  const mb=P.mouthBase||(P.mouthBase=P.mouth.scale.clone());P.mouth.scale.set(mb.x*(ag.talk?1+Math.abs(Math.sin(t*12))*.3:1),mb.y*(ag.talk?1+Math.abs(Math.sin(t*12))*1.6:1),mb.z);
  P.blob.material.opacity=ag.state==='sit'?.06:.13}

document.getElementById('loading').style.opacity=0;setTimeout(()=>document.getElementById('loading').remove(),700);
requestAnimationFrame(frame);
window.__dbg={AG,G,C,start,focusAgent,overview};
