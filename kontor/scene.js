/* Kontorets miljö och figurer, byggda i three.js */
import * as THREE from 'three';
import {RoundedBoxGeometry} from './lib/RoundedBoxGeometry.js';

const GC={};
export function rbG(w,h,d,r){const k=[w,h,d,r].map(v=>v.toFixed(3)).join();return GC[k]||(GC[k]=new RoundedBoxGeometry(w,h,d,4,Math.min(r,w/2-.0005,h/2-.0005,d/2-.0005)))}
const SPH=new THREE.SphereGeometry(1,28,20),CYL=new THREE.CylinderGeometry(1,1,1,28),TOR=new THREE.TorusGeometry(1,.14,10,32);
const MC={};
export function mat(c,o={}){const k=c+JSON.stringify(o);if(MC[k])return MC[k];
  const m=new THREE.MeshStandardMaterial(Object.assign({color:c,roughness:.75,metalness:0},o));return MC[k]=m}
function sh(m){m.castShadow=true;m.receiveShadow=true;return m}
export function rb(p,w,h,d,r,c,x=0,y=0,z=0,o){const m=sh(new THREE.Mesh(rbG(w,h,d,r),typeof c==='string'?mat(c,o):c));m.position.set(x,y,z);p.add(m);return m}
export function sp(p,sx,sy,sz,c,x=0,y=0,z=0,o){const m=sh(new THREE.Mesh(SPH,typeof c==='string'?mat(c,o):c));m.scale.set(sx,sy,sz);m.position.set(x,y,z);p.add(m);return m}
export function cy(p,rt,h,c,x=0,y=0,z=0,o,rb2){const g=rb2!==undefined?new THREE.CylinderGeometry(rt,rb2,h,28):null;const m=sh(new THREE.Mesh(g||CYL,typeof c==='string'?mat(c,o):c));if(!g)m.scale.set(rt,h,rt);m.position.set(x,y,z);p.add(m);return m}
export function grp(p,x=0,y=0,z=0){const g=new THREE.Group();g.position.set(x,y,z);p.add(g);return g}

/* ---------- texturer ---------- */
function canvasTex(w,h,draw,rep){const c=document.createElement('canvas');c.width=w;c.height=h;draw(c.getContext('2d'),w,h);const t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace;t.anisotropy=8;
  if(rep){t.wrapS=t.wrapT=THREE.RepeatWrapping;t.repeat.set(rep[0],rep[1])}return t}
function rnd(s){return function(){s=(s*16807)%2147483647;return (s-1)/2147483646}}
export const TEX={
  concrete:()=>canvasTex(512,512,(x,w,h)=>{const r=rnd(7);x.fillStyle='#bdbab3';x.fillRect(0,0,w,h);
    for(let i=0;i<5000;i++){const v=r();x.fillStyle=`rgba(${v>.5?255:60},${v>.5?255:58},${v>.5?250:52},${.03+r()*.05})`;const s=1+r()*3;x.fillRect(r()*w,r()*h,s,s)}
    for(let i=0;i<40;i++){x.fillStyle=`rgba(255,255,255,${r()*.05})`;x.beginPath();x.ellipse(r()*w,r()*h,20+r()*60,10+r()*40,r()*3,0,7);x.fill()}},[6,4]),
  oak:()=>canvasTex(512,256,(x,w,h)=>{const r=rnd(3);x.fillStyle='#B98D62';x.fillRect(0,0,w,h);
    for(let i=0;i<w;i+=64){x.fillStyle='rgba(70,40,15,.18)';x.fillRect(i,0,2,h)}
    for(let i=0;i<260;i++){const y=r()*h,x0=r()*w;x.strokeStyle=`rgba(${r()>.5?110:220},${r()>.5?70:170},40,${.06+r()*.08})`;x.lineWidth=.6+r()*1.4;x.beginPath();x.moveTo(x0,y);x.bezierCurveTo(x0+30,y+r()*4-2,x0+60,y+r()*6-3,x0+90+r()*60,y+r()*4-2);x.stroke()}},[4,1]),
  sky:()=>canvasTex(512,256,(x,w,h)=>{const g=x.createLinearGradient(0,0,0,h);g.addColorStop(0,'#cfe2ea');g.addColorStop(1,'#eef4f1');x.fillStyle=g;x.fillRect(0,0,w,h);const r=rnd(11);
    for(let i=0;i<22;i++){const bw=20+r()*40,bh=50+r()*150,bx=r()*w;x.fillStyle=`rgba(150,170,175,${.25+r()*.25})`;x.fillRect(bx,h-bh,bw,bh);x.fillStyle='rgba(255,255,255,.25)';for(let k=0;k<bh/12;k++)x.fillRect(bx+4,h-bh+6+k*12,bw-8,3)}
    x.fillStyle='rgba(120,160,110,.45)';for(let i=0;i<30;i++){x.beginPath();x.arc(r()*w,h-r()*12,10+r()*16,0,7);x.fill()}}),
};

/* ---------- möbler ---------- */
const WHITE='#F2F1EE',OAKC='#C09468';
export function plant(p,x,z,s=1,kind=0){const g=grp(p,x,0,z);g.scale.setScalar(s);
  cy(g,.2,.42,'#EDEBE6',0,.21,0,{roughness:.5},.16);cy(g,.17,.012,'#5a4632',0,.428,0).castShadow=false;
  const fol=grp(g,0,.42,0);const greens=['#4E8B4A','#5E9C55','#3F7A3F','#6FAE62'];
  const pts=kind?[[0,.35,0,.26],[.12,.6,.05,.2],[-.1,.75,-.05,.18],[.05,.95,.02,.15],[-.12,.45,.1,.18]]:[[0,.25,0,.3],[.18,.38,.05,.22],[-.17,.42,-.04,.22],[.02,.6,-.08,.22],[-.05,.52,.16,.18],[.14,.6,-.12,.16]];
  pts.forEach((q,i)=>sp(fol,q[3],q[3]*.9,q[3],greens[i%4],q[0],q[1],q[2],{roughness:.9}));g.userData.sway=fol;g.userData.ph=Math.random()*6;return g}
export function chair(p,x,z,ry=0){const g=grp(p,x,0,z);g.rotation.y=ry;
  for(let i=0;i<5;i++){const a=i/5*Math.PI*2;const l=rb(g,.04,.03,.32,.015,'#C9CCCF',Math.sin(a)*.15,.06,Math.cos(a)*.15,{metalness:.7,roughness:.3});l.rotation.y=a;sp(g,.035,.035,.035,'#EDEDED',Math.sin(a)*.3,.035,Math.cos(a)*.3)}
  cy(g,.03,.3,'#C9CCCF',0,.22,0,{metalness:.7,roughness:.3});
  rb(g,.46,.07,.44,.03,WHITE,0,.39,0);rb(g,.4,.05,.38,.02,'#DADBD8',0,.43,0,{roughness:.95});
  const back=rb(g,.44,.5,.05,.04,WHITE,0,.72,.22);back.rotation.x=.12;rb(g,.36,.36,.02,.02,'#D5D6D3',0,.72,.19,{roughness:.95}).rotation.x=.12;
  rb(g,.04,.2,.04,.015,WHITE,-.25,.52,.05);rb(g,.04,.2,.04,.015,WHITE,.25,.52,.05);rb(g,.06,.03,.26,.015,WHITE,-.25,.63,0);rb(g,.06,.03,.26,.015,WHITE,.25,.63,0);
  return g}
export function desk(p,x,z,w=1.7){const g=grp(p,x,0,z);const T='#D9B78F',L='#8FA697';
  rb(g,w,.05,.8,.012,T,0,.66,0,{roughness:.5});rb(g,.05,.64,.74,.01,L,-w/2+.06,.32,0,{roughness:.6});rb(g,.05,.64,.74,.01,L,w/2-.06,.32,0,{roughness:.6});
  rb(g,w-.2,.3,.03,.01,'#A7B9AC',0,.48,-.34,{roughness:.6});return g}
export function imac(p,x,z,tex,big=1){const g=grp(p,x,.685,z);g.scale.setScalar(big);
  rb(g,.2,.012,.16,.006,'#D6D8DA',0,.006,0,{metalness:.6,roughness:.3});const st=rb(g,.12,.26,.025,.01,'#D6D8DA',0,.14,-.035,{metalness:.6,roughness:.3});st.rotation.x=-.12;
  rb(g,.68,.46,.03,.02,'#E3E5E7',0,.45,-.01,{metalness:.35,roughness:.35});rb(g,.66,.08,.031,.015,'#D2D4D6',0,.26,-.008,{metalness:.4,roughness:.35});
  const scr=new THREE.Mesh(new THREE.PlaneGeometry(.62,.36),new THREE.MeshBasicMaterial({map:tex,toneMapped:false}));scr.position.set(0,.48,.0065);g.add(scr);g.userData.scr=scr;
  const kb=rb(g,.36,.012,.12,.005,'#F3F3F3',0,.006,.28,{roughness:.4});sp(g,.03,.012,.05,'#F3F3F3',.27,.008,.28);return g}
export function lamp(p,x,z){const g=grp(p,x,.685,z);cy(g,.07,.01,'#E0E0DE',0,.005,0,{metalness:.5,roughness:.3});cy(g,.008,.34,'#E0E0DE',0,.18,0,{metalness:.5,roughness:.3});cy(g,.1,.012,'#EEEEEC',0,.36,0,{emissive:'#fff7e0',emissiveIntensity:.4});return g}
export function shelf(p,x,z,w=1.4,h=1.9,ry=0,cols){const g=grp(p,x,0,z);g.rotation.y=ry;const d=.36;
  rb(g,w,.04,d,.01,OAKC,0,h,0);rb(g,w,.04,d,.01,OAKC,0,.02,0);rb(g,.04,h,d,.01,OAKC,-w/2,h/2,0);rb(g,.04,h,d,.01,OAKC,w/2,h/2,0);rb(g,w,h,.02,.005,'#A87E56',0,h/2,-d/2+.01);
  const rows=Math.floor(h/.45);const C=cols||['#2F5A45','#6CBF6C','#B9853A','#5A7BA3','#E6E2D8','#2F533C','#9DB7A5'];const slots=[];
  for(let r=1;r<rows;r++)rb(g,w-.04,.03,d-.02,.01,OAKC,0,r*h/rows,0);
  let k=0;for(let r=0;r<rows;r++){const y0=r*h/rows+.04;let xx=-w/2+.08;while(xx<w/2-.12){if(Math.random()<.12&&slots.length<4){slots.push([xx+.035,y0+.16,0]);xx+=.08;continue}
      const bw=.065;rb(g,bw,.32,.27,.01,C[k++%C.length],xx+bw/2,y0+.16,.02,{roughness:.6});xx+=bw+.008}}
  g.userData.slots=slots;return g}
export function cabinet(p,x,z,w=.5,h=.7,ry=0){const g=grp(p,x,0,z);g.rotation.y=ry;rb(g,w,h,.5,.02,'#ECEBE7',0,h/2,0,{roughness:.5});for(let i=0;i<3;i++)rb(g,w*.5,.02,.02,.01,'#BDBEBA',0,h*(i+.6)/3.2,.26,{metalness:.6});return g}
export function glassWall(p,x1,z1,x2,z2,h=2.1){const g=grp(p,0,0,0);const L=Math.hypot(x2-x1,z2-z1),a=Math.atan2(z2-z1,x2-x1);
  const gl=new THREE.Mesh(rbG(L,h,.03,.005),new THREE.MeshStandardMaterial({color:'#dcebe7',transparent:true,opacity:.16,roughness:.05,metalness:.1,depthWrite:false}));
  gl.position.set((x1+x2)/2,h/2,(z1+z2)/2);gl.rotation.y=-a;g.add(gl);gl.renderOrder=2;
  const fr=new THREE.Group();fr.position.copy(gl.position);fr.rotation.y=-a;g.add(fr);
  rb(fr,L,.05,.06,.01,'#4E5552',0,h/2,0);rb(fr,L,.04,.06,.01,'#4E5552',0,-h/2+.02,0);
  const n=Math.max(1,Math.round(L/1.4));for(let i=0;i<=n;i++)rb(fr,.04,h,.06,.01,'#4E5552',-L/2+i*L/n,0,0);return g}
export function wallScreen(p,x,y,z,w,h,tex,ry=0){const g=grp(p,x,y,z);g.rotation.y=ry;rb(g,w+.06,h+.06,.04,.015,'#2A2E2C',0,0,0);
  const m=new THREE.Mesh(new THREE.PlaneGeometry(w,h),new THREE.MeshBasicMaterial({map:tex,toneMapped:false}));m.position.z=.021;g.add(m);return g}

/* ---------- figurer ---------- */
export function person(p,L){
  const root=grp(p,0,0,0);const R={root};
  const fab=c=>new THREE.MeshPhysicalMaterial({color:c,roughness:.82,sheen:1,sheenRoughness:.7,sheenColor:new THREE.Color(c).lerp(new THREE.Color('#ffffff'),.55)});
  const skin=new THREE.MeshPhysicalMaterial({color:L.skin,roughness:.5,sheen:.6,sheenRoughness:.5,sheenColor:new THREE.Color('#ffd9c4')}),hair=new THREE.MeshPhysicalMaterial({color:L.hair,roughness:.38,clearcoat:.35,clearcoatRoughness:.4}),jacket=fab(L.jacket),top=fab(L.top),low=fab(L.low),shoe=mat(L.shoe,{roughness:.35});
  /* skugg-blob under foten för mjukare kontakt */
  const blob=new THREE.Mesh(new THREE.CircleGeometry(.32,24),new THREE.MeshBasicMaterial({color:'#000',transparent:true,opacity:.12,depthWrite:false}));blob.rotation.x=-Math.PI/2;blob.position.y=.004;root.add(blob);R.blob=blob;
  const hips=grp(root,0,.43,0);R.hips=hips;
  if(L.skirt){const s=cy(hips,.15,.22,low,0,-.02,0,{},.19)}
  else rb(hips,.27,.12,.18,.06,low,0,.02,0);
  const leg=(sx)=>{const th=grp(hips,sx*.075,0,0);rb(th,.11,.22,.12,.055,L.skirt?skin:low,0,-.1,0);const kn=grp(th,0,-.19,0);rb(kn,.1,.2,.1,.05,L.skirt?skin:low,0,-.09,0);
    const ft=rb(kn,.12,.07,.2,.035,shoe,0,-.19,.04);return {th,kn}};
  const lg=leg(-1),rg=leg(1);R.thL=lg.th;R.knL=lg.kn;R.thR=rg.th;R.knR=rg.kn;
  const torso=grp(hips,0,.06,0);R.torso=torso;
  rb(torso,.33,.36,.21,.1,jacket,0,.18,0);
  if(L.tie){rb(torso,.11,.2,.03,.012,top,0,.24,.095);rb(torso,.04,.17,.02,.008,mat(L.tie),0,.21,.112)}
  else{rb(torso,.13,.17,.03,.03,top,0,.27,.095);if(L.gender!=='m')sp(torso,.012,.012,.012,'#D8B45A',0,.205,.112,{metalness:.8,roughness:.3})}
  rb(torso,.07,.07,.02,.01,top,-.1,.23,.104).visible=false;
  cy(torso,.05,.07,skin,0,.39,0);
  const head=grp(torso,0,.42,0);R.head=head;
  sp(head,.22,.205,.205,skin,0,.19,0);
  sp(head,.035,.05,.03,skin,-.215,.18,0);sp(head,.035,.05,.03,skin,.215,.18,0);
  const eyes=grp(head,0,.19,0);R.eyes=eyes;
  for(const sx of [-1,1]){sp(eyes,.055,.062,.03,'#FFFFFF',sx*.075,0,.172,{roughness:.2});sp(eyes,.034,.04,.02,'#3B2414',sx*.075,-.004,.19,{roughness:.15});sp(eyes,.02,.024,.012,'#0d0b0a',sx*.075,-.004,.2,{roughness:.1});sp(eyes,.011,.011,.006,'#ffffff',sx*.075+.012,.013,.207,{emissive:'#ffffff',emissiveIntensity:.6})}
  for(const sx of [-1,1]){const b=rb(head,.075,.02,.02,.009,mat(L.hair),sx*.075,.275,.18);b.rotation.z=sx*-.12}
  sp(head,.024,.02,.022,skin,0,.15,.205);
  const mouth=sp(head,.045,.014,.012,'#7A3A35',0,.095,.19,{roughness:.4});R.mouth=mouth;
  sp(head,.032,.02,.008,'#E99A8E',-.125,.125,.17,{roughness:.8,transparent:true,opacity:.45});sp(head,.032,.02,.008,'#E99A8E',.125,.125,.17,{roughness:.8,transparent:true,opacity:.45});
  if(L.glasses){const gm=mat('#1c1c1c',{roughness:.3});for(const sx of [-1,1]){const t=new THREE.Mesh(TOR,gm);t.scale.set(.068,.068,.068);t.position.set(sx*.075,.19,.21);head.add(t)}rb(head,.04,.012,.012,.005,gm,0,.2,.215);rb(head,.012,.012,.18,.005,gm,-.2,.2,.12);rb(head,.012,.012,.18,.005,gm,.2,.2,.12)}
  const H=L.hairStyle;
  if(H==='side'){sp(head,.232,.17,.225,hair,0,.27,-.02);sp(head,.226,.2,.2,hair,0,.2,-.06);const q=sp(head,.17,.09,.13,hair,.04,.35,.07);q.rotation.z=-.25;sp(head,.05,.1,.07,hair,-.205,.2,.03);sp(head,.05,.1,.07,hair,.205,.2,.03)}
  if(H==='short'){sp(head,.228,.15,.222,hair,0,.27,-.025);sp(head,.226,.19,.2,hair,0,.2,-.07);sp(head,.05,.09,.07,hair,-.208,.21,.02);sp(head,.05,.09,.07,hair,.208,.21,.02);
    if(L.beard){sp(head,.19,.12,.13,mat(L.beard,{roughness:.9}),0,.08,.08);R.mouth.position.z=.215;R.mouth.position.y=.1}}
  if(H==='bun'){sp(head,.232,.18,.228,hair,0,.25,-.02);sp(head,.225,.2,.2,hair,0,.18,-.06);sp(head,.1,.1,.1,hair,0,.38,-.13);const f=sp(head,.16,.07,.1,hair,-.06,.33,.11);f.rotation.z=.35;sp(head,.06,.14,.1,hair,-.2,.17,.04);sp(head,.06,.14,.1,hair,.2,.17,.04)}
  if(H==='long'){sp(head,.235,.18,.23,hair,0,.25,-.02);sp(head,.215,.25,.13,hair,0,.06,-.1);sp(head,.17,.18,.1,hair,0,-.1,-.12);sp(head,.06,.2,.09,hair,-.2,.06,.01);sp(head,.06,.2,.09,hair,.2,.06,.01);sp(head,.07,.09,.07,hair,-.19,-.1,-.02);sp(head,.07,.09,.07,hair,.19,-.1,-.02);const f=sp(head,.2,.08,.1,hair,.05,.33,.11);f.rotation.z=-.3}
  if(H==='curly'){[[0,.3,-.02,.2],[-.13,.27,.05,.12],[.13,.27,.05,.12],[-.17,.18,-.06,.12],[.17,.18,-.06,.12],[0,.22,-.12,.17],[-.1,.36,-.06,.12],[.1,.36,-.06,.12],[0,.37,.06,.11],[-.19,.1,-.04,.09],[.19,.1,-.04,.09]].forEach(q=>sp(head,q[3],q[3],q[3],hair,q[0],q[1],q[2]))}
  const arm=(sx)=>{const sh=grp(torso,sx*.19,.31,0);rb(sh,.095,.22,.095,.047,jacket,0,-.09,0);const el=grp(sh,0,-.18,0);rb(el,.085,.17,.085,.042,jacket,0,-.07,0);sp(el,.034,.012,.034,top,0,-.155,0).visible=true;
    const hand=grp(el,0,-.19,0);sp(hand,.045,.05,.04,skin,0,0,0);return {sh,el,hand}};
  const al=arm(-1),ar=arm(1);R.shL=al.sh;R.elL=al.el;R.hL=al.hand;R.shR=ar.sh;R.elR=ar.el;R.hR=ar.hand;
  root.traverse(o=>{if(o.isMesh&&o!==blob)o.castShadow=true});
  /* mjuk tecknad kontur (inverterat skal) i en mörkare ton av varje del */
  const ol=[];root.traverse(o=>{if(o.isMesh&&o!==blob&&o.visible&&!(o.material.transparent)&&!(o.material.emissive&&o.material.emissive.getHex()>0)&&o.material.color)ol.push(o)});
  ol.forEach(o=>{const hx=o.material.color.clone().multiplyScalar(.5).getHexString();const m=new THREE.Mesh(o.geometry,OLM[hx]||(OLM[hx]=new THREE.MeshBasicMaterial({color:'#'+hx,side:THREE.BackSide})));m.scale.setScalar(1.05);m.castShadow=false;if(o!==R.mouth)o.add(m)});
  root.scale.setScalar(1.08);
  return R}
const OLM={};
