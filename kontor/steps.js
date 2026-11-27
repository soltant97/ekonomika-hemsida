/* Stegvis förklaring per avdelning – miniatyrer i HTML/CSS */
const d=(s)=>' style="--d:'+s+'s"';
const row=(a,b,cls='',del)=>'<div class="m-row a '+cls+'"'+(del!=null?d(del):'')+'><span>'+a+'</span><b>'+b+'</b></div>';
const ok=(t,del=.6)=>'<span class="m-ok pop"'+d(del)+'>✓ '+t+'</span>';
const card=(inner,cls='',del=0)=>'<div class="m-card a '+cls+'"'+d(del)+'>'+inner+'</div>';
const head=(t,s)=>'<div class="m-h"><b>'+t+'</b>'+(s?'<span>'+s+'</span>':'')+'</div>';
const arrow=(del=.35)=>'<div class="m-arr a"'+d(del)+'></div>';
const ver=(rows,del0=.15)=>'<div class="m-ver"><div class="m-vh"><span>Konto</span><span>Debet</span><span>Kredit</span></div>'+rows.map((r,i)=>'<div class="m-vr a"'+d(del0+i*.28)+'><span><b>'+r[0]+'</b> '+r[1]+'</span><span>'+(r[2]||'')+'</span><span>'+(r[3]||'')+'</span></div>').join('')+'</div>';
const receipt=(hl)=>{const h=k=>hl?' class="hl"'+d(.3+k*.35):'';return '<div class="m-rcpt"><div class="m-logo">TeleNord AB</div><div class="m-sm">Faktura oktober 2026</div><div'+h(0)+'><span>Fakturadatum</span><b>2026-10-28</b></div><div class="m-sp"><span>Mobilabonnemang</span><b>399,20</b></div><div'+h(1)+'><span>Moms 25 %</span><b>99,80</b></div><div class="m-tot"'+(hl?' data-hl':'')+'><span>Att betala</span><b'+(hl?' class="hl"'+d(1.0):'')+'>499,00 kr</b></div></div>'};
const tags=(arr,del=.5)=>'<div class="m-tags">'+arr.map((t,i)=>'<span class="pop"'+d(del+i*.18)+'>'+t+'</span>').join('')+'</div>';
const bars=(pairs)=>'<div class="m-bars">'+pairs.map((p,i)=>'<div class="m-bp"><div><i class="grow" style="height:'+p[1]+'%;--d:'+(.15+i*.15)+'s"></i><i class="grow u" style="height:'+p[2]+'%;--d:'+(.25+i*.15)+'s"></i></div><small>'+p[0]+'</small></div>').join('')+'</div>';
const check=(items,last)=>'<div class="m-chk">'+items.map((t,i)=>'<div class="a"'+d(.1+i*.15)+'><i class="'+(i===items.length-1&&last?'pop late':'')+'"'+(i===items.length-1&&last?d(1.4):'')+'>✓</i>'+t+'</div>').join('')+'</div>';

const tl=(title,sub,rows,foot)=>card(head(title,sub)+'<div class="m-tl">'+rows.map((r,i)=>'<div class="a"'+d(.2+i*.3)+'><i class="pop"'+d(.3+i*.3)+'></i><b>'+r[0]+'</b><span>'+r[1]+'</span></div>').join('')+'</div>'+(foot?'<div class="m-sm a"'+d(.4+rows.length*.3)+' style="margin-top:5px">'+foot+'</div>':''),'m-wide');
export const STEPS={
re:[
 {t:'Du skickar in underlaget',x:'Fota kvittot eller vidarebefordra fakturan, här ett mobilabonnemang. Det tar några sekunder och originalet behöver du inte spara.',
  v:'<div class="m-flex"><div class="m-phone a"><div><div class="m-rcpt"><div class="m-logo">TeleNord AB</div><div class="m-sm">Faktura okt 2026</div><div><span>Abonnemang</span><b>399,20</b></div><div><span>Moms 25 %</span><b>99,80</b></div><div class="m-tot"><span>Att betala</span><b>499,00</b></div></div>'+'<div class="m-send pop"'+d(.8)+'>Skickat ✓</div></div></div>'+arrow(.9)+card(head('Ekonomikas inkorg')+'<div class="m-file"><i></i><span>TeleNord_okt.pdf<small>499,00 kr</small></span></div>'+ok('Mottaget',1.4),'',1.1)+'</div>'},
 {t:'Underlaget läses av',x:'Redovisningsekonomen kontrollerar datum, belopp och moms och ser att fakturan gäller verksamheten.',
  v:'<div class="m-flex">'+card(receipt(true),'m-wide')+'<div class="m-notes">'+['Datum','Moms','Belopp'].map((t,i)=>'<span class="pop"'+d(.4+i*.35)+'>'+t+' ✓</span>').join('')+'</div></div>'},
 {t:'Bokförs och konteras',x:'Kostnaden hamnar på rätt konto, momsen dras av och betalningen bokas mot företagskontot.',
  v:card(head('Verifikation A 1042','2026-10-28')+ver([['6212','Mobiltelefon','399,20',''],['2641','Ingående moms','99,80',''],['1930','Företagskonto','','499,00']])+'<div class="m-foot">'+ok('Debet = kredit',1.1)+'</div>','m-wide')},
 {t:'Stäms av mot banken',x:'Varje bankhändelse matchas mot en verifikation. Det som inte stämmer upptäcks direkt.',
  v:'<div class="m-col">'+card(head('Bank','Företagskonto')+'<div class="m-row"><span>28 okt · TeleNord AB</span><b>−499,00</b></div>','m-wide')+'<div class="m-link pop"'+d(.7)+'>Matchad</div>'+card(head('Bokföring')+'<div class="m-row"><span>A 1042 · Mobiltelefon</span><b>499,00</b></div>','m-wide',.35)+'</div>'},
 {t:'Klart och redo för rapporterna',x:'Månaden är avstämd och underlagen sparas digitalt i sju år. Siffrorna går vidare till Controllern och Skatterådgivaren.',
  v:card(head('Oktober 2026','Avstämd')+'<div class="m-prog"><i class="grow-x"></i></div><div class="m-row"><span>Bankhändelser matchade</span><b>214 av 214</b></div>'+tags(['Arkiverat i 7 år','Till Controllern','Till Skatterådgivaren'],.9),'m-wide')},
 {t:'Viktiga datum',x:'Bokföringslagen styr hur snabbt saker ska bokföras. Vi bokför löpande varje vecka och stämmer av varje månad.',
  v:tl('Bokföring','regler och rutin',[['Nästa arbetsdag','Kontanta betalningar ska vara bokförda'],['Varje vecka','Underlag bokförs löpande'],['Arbetsdag 5','Bank och reskontror avstämda'],['7 år','Räkenskapsinformation sparas']],'Övriga affärshändelser bokförs så snart det kan ske.')}
],
co:[
 {t:'Sammanställer månadens bokföring',x:'När oktober är avstämd tar Controllern fram resultatrapport och balansrapport och sammanställer månadens siffror.',
  v:'<div class="m-two">'+card(head('Resultatrapport','oktober')+row('Nettoomsättning','132 000','',.2)+row('Kostnader','−103 600','',.4)+row('Rörelseresultat','28 400','m-sum',.6),'',0)+card(head('Balansrapport','31 okt')+row('Tillgångar','688 700','',.5)+row('Eget kapital','549 200','',.7)+row('Skulder','139 500','',.9),'',.3)+'</div>'},
 {t:'Budget, utfall och föregående år',x:'Utfallet jämförs både mot budget och mot samma månad förra året. Avvikelserna förklaras, så att du ser om utvecklingen går åt rätt håll.',
  v:card(head('Oktober','utfall mot budget och fg år')+'<div class="m-cmp"><div class="m-vh"><span></span><span>Utfall</span><span>Budget</span><span>Okt 2025</span></div>'+[['Nettoomsättning','132 000','125 000','118 000'],['Kostnader','−103 600','−99 000','−93 900'],['Rörelseresultat','28 400','26 000','24 100']].map((r,i)=>'<div class="m-vr a'+(i==2?' m-sum':'')+'"'+d(.15+i*.25)+'><span>'+r[0]+'</span><b>'+r[1]+'</b><span>'+r[2]+'</span><span>'+r[3]+'</span></div>').join('')+'</div><div class="m-tags"><span class="pop"'+d(1)+'>+9 % mot budget</span><span class="pop"'+d(1.2)+'>+18 % mot förra året</span></div>','m-wide')},
 {t:'Nyckeltalen räknas',x:'Några få nyckeltal som säger mest om just din verksamhet: lönsamhet, betalningsförmåga och stabilitet.',
  v:'<div class="m-kpis">'+[['21,1 %','Rörelsemarginal'],['433 %','Kassalikviditet'],['79,7 %','Soliditet']].map((k,i)=>card('<div class="m-big">'+k[0]+'</div><div class="m-sm">'+k[1]+'</div>','',.15+i*.25)).join('')+'</div>'},
 {t:'Du får månadsrapporten',x:'En kort rapport med siffrorna och en kommentar om vad som sticker ut, så att du kan fatta beslut.',
  v:card(head('Månadsrapport oktober','till dig')+'<div class="m-quote a"'+d(.3)+'>Försäljningen ökade 12 % mot oktober förra året och resultatet ligger 9 % över budget.</div>'+tags(['Resultat','Balans','Budget','Nyckeltal'],.8),'m-wide')},
 {t:'Viktiga datum',x:'Controllerns arbete följer ett fast årshjul, så att du vet när rapporterna kommer och när budgeten tas fram.',
  v:tl('Årshjul','så arbetar vi',[['Arbetsdag 8','Månadsrapport för förra månaden'],['Varje kvartal','Prognosen för året uppdateras'],['Okt–nov','Budget för nästa år tas fram'],['Januari','Helåret följs upp mot budget']])}
],
sk:[
 {t:'Vilka deklarationer gäller för dig?',dur:8.2,x:'Skatterådgivaren går igenom vilka deklarationer och ansökningar ditt företag behöver, till exempel vid handel utanför Sverige, ROT och RUT eller grön teknik. Den som gäller nästan alla är momsdeklarationen, så den tittar vi närmare på.',
  v:card(head('Deklarationer och ansökningar','2026')+'<div class="m-grid2"><div class="a m-mv"'+d(.05)+'><i class="pop"'+d(.3)+'>✓</i><span><b>Momsdeklaration</b><small>Varje månad, kvartal eller år</small></span></div>'+[['Tulldeklaration','Importmoms utanför EU'],['Periodisk sammanställning','Försäljning till EU-företag'],['OSS-deklaration','E-handel till konsumenter i EU'],['Omvänd skattskyldighet','Bygg och inköp från EU'],['ROT- och RUT-avdrag','Utbetalning för husarbete'],['Grön teknik','Solceller, batteri, laddbox'],['Arbetsgivardeklaration','Löner och avgifter varje månad'],['Inkomstdeklaration','Bolagets skatt för året']].map((r,i)=>'<div class="a"'+d(.1+i*.12)+'><i class="pop"'+d(.4+i*.22)+'>✓</i><span><b>'+r[0]+'</b><small>'+r[1]+'</small></span></div>').join('')+'</div>','m-wide m-zoom')},
 {t:'Momsdeklarationen upprättas',x:'Nu går vi in i momsdeklarationen. Beloppen från den avstämda bokföringen förs över till rätt ruta i momsdeklarationen, så som Skatteverket vill ha dem.',
  v:card(head('Momsdeklaration','juli–september')+['05|Momspliktig försäljning|120 000','10|Utgående moms 25 %|30 000','48|Ingående moms|9 600'].map((r,i)=>{const p=r.split('|');return '<div class="m-row a"'+d(.2+i*.3)+'><span><em class="m-box">'+p[0]+'</em>'+p[1]+'</span><b>'+p[2]+'</b></div>'}).join('')+'<div class="m-row a m-sum"'+d(1.15)+'><span><em class="m-box f">49</em>Moms att betala</span><b>20 400</b></div>','m-wide m-zin')},
 {t:'Lämnas in till Skatteverket',x:'Deklarationen skickas in digitalt via Skatteverkets e-tjänst före sista dag, den 12 november. Kvittensen sparas.',
  v:'<div class="m-web a"><div class="m-wbar"><i></i><i></i><i></i><span>Skatteverket · e-tjänst Moms</span></div><div class="m-wbody"><div class="m-row"><span>Momsdeklaration juli–september</span><b>20 400 kr</b></div><div class="m-row"><span>Sista dag</span><b>12 november 2026</b></div><div class="m-wact"><span class="m-btn">Skicka in</span><span class="m-cur"></span></div><div class="m-prog"><i class="grow-x"'+d(1.1)+'></i></div><div class="m-wdone pop"'+d(2.2)+'>✓ Inlämnad och mottagen</div></div></div>'},
 {t:'Betala eller få tillbaka',x:'Blir det moms att betala får du beloppet och sista dag i förväg. Blir det moms att få tillbaka sätts den in på företagets skattekonto.',
  v:'<div class="m-flex"><div class="m-cal a"><b>NOV</b><span>12</span></div>'+card(head('Skattekonto')+row('Moms juli–september','−20 400','',.3)+row('Din inbetalning','+20 400','',.6)+row('Saldo','0','m-sum',.9)+'<div class="m-sm a"'+d(1.2)+' style="margin-top:5px">Att betala senast 12 november</div>','',.15)+'</div>'},
 {t:'Viktiga datum',x:'Skatterådgivaren bevakar alla deklarationsdatum. Gäller företag med omsättning upp till 40 miljoner kronor och kvartalsmoms.',
  v:tl('Skattekalender','2026–2027',[['Den 12:e','Arbetsgivardeklaration och skatt'],['12 nov 2026','Moms juli–september'],['Slutet av jan','ROT, RUT och grön teknik för fjolåret'],['12 feb 2027','Moms oktober–december'],['2 aug 2027','Inkomstdeklaration 2']],'I januari och augusti gäller den 17:e i stället för den 12:e.')}
],
ra:[
 {t:'Avstämningar inför bokslutet',x:'Varje balanspost gås igenom och stäms av mot underlag: periodiseringar, tillgångar, värderingar, skulder och lån. Inget ska saknas och inget ska vara dubbelt.',
  v:card(head('Bokslutsavstämningar','31 dec 2026')+'<div class="m-grid2 m-g1">'+['Bank och kassa','Kund- och lev.reskontra','Periodiseringar','Aktivering av tillgångar','Avskrivningar','Ned- och uppskrivningar','Lager och pågående arbete','Skulder och lån','Moms och skattekonto','Löner och semesterskuld','Periodiseringsfond','Eget kapital'].map((t,i)=>'<div class="a"'+d(.1+i*.08)+'><i class="pop"'+d(.4+i*.22)+'>✓</i><span><b>'+t+'</b></span></div>').join('')+'</div>','m-wide')},
 {t:'Bokslutsposter bokförs',x:'Kostnader och intäkter flyttas till rätt år, och inventarier skrivs av över sin livslängd.',
  v:card(head('Bokslutsverifikationer','31 dec')+ver([['7832','Avskrivning inventarier','17 000',''],['1229','Ack. avskrivningar','','17 000'],['1710','Förutbetald hyra','12 000',''],['5010','Lokalhyra','','12 000']]),'m-wide')},
 {t:'Årsredovisningen upprättas',x:'Resultat- och balansräkning, förvaltningsberättelse och noter sammanställs i en färdig årsredovisning.',
  v:'<div class="m-flex">'+'<div class="m-pages">'+['Förvaltningsberättelse','Resultaträkning','Balansräkning','Noter'].map((t,i)=>'<div class="a"'+d(.1+i*.18)+'>'+t+'</div>').join('')+'</div>'+card(head('Resultaträkning')+row('Nettoomsättning','1 488 000','',.5)+row('Rörelseresultat','312 400','',.7)+row('Årets resultat','246 855','m-sum',.9),'',.4)+'</div>'},
 {t:'Signering och inlämning',x:'Styrelsen signerar digitalt och årsredovisningen skickas till Bolagsverket långt före sista dag.',
  v:'<div class="m-flex">'+card(head('Årsredovisning 2026')+'<div class="m-sig a"'+d(.3)+'><i></i>Styrelseledamot</div><div class="m-sig a"'+d(.55)+'><i></i>Revisor</div>'+ok('Signerad',.9),'',0)+arrow(1)+card(head('Bolagsverket')+ok('Inlämnad',1.6),'',1.2)+'</div>'},
 {t:'Viktiga datum',x:'För ett aktiebolag med kalenderår som räkenskapsår. Redovisningsansvarig bevakar datumen och lämnar in i god tid, så att du slipper förseningsavgift.',
  v:card(head('Bokslut 2026','viktiga datum')+'<div class="m-tl">'+[['31 dec 2026','Räkenskapsåret slutar'],['30 jun 2027','Senast årsstämma'],['31 jul 2027','Årsredovisningen in till Bolagsverket'],['2 aug 2027','Inkomstdeklaration 2 till Skatteverket']].map((r,i)=>'<div class="a"'+d(.2+i*.35)+'><i class="pop"'+d(.3+i*.35)+'></i><b>'+r[0]+'</b><span>'+r[1]+'</span></div>').join('')+'</div><div class="m-sm a"'+d(1.8)+' style="margin-top:5px">Lämnas årsredovisningen in för sent tar Bolagsverket ut 7 500 kr i förseningsavgift (privat aktiebolag).</div>','m-wide')}
],
lo:[
 {t:'Tid och frånvaro rapporteras',x:'De anställda rapporterar arbetstid, sjukdom, VAB och semester. Löneadministratören går igenom och attesterar.',
  v:card(head('Tidrapport november','Anna Berg')+row('Arbetad tid','128,0 h','',.15)+row('Sjuk 2 dagar','16,0 h','',.35)+row('VAB 1 dag','8,0 h','',.55)+row('Semester 2 dagar','16,0 h','',.75)+'<div class="m-foot">'+ok('Attesterad',1.1)+'</div>','m-wide')},
 {t:'Lönen räknas',x:'Månadslönen justeras för frånvaro och skatten dras enligt skattetabellen.',
  v:card(head('Löneberäkning','Anna Berg')+row('Månadslön','36 000','',.15)+row('Sjukavdrag inkl. karens','−1 994','',.35)+row('VAB-avdrag','−1 662','',.55)+row('Skatt','−9 210','',.75)+row('Att betala ut','23 134','m-sum',1),'m-wide')},
 {t:'Lönebeskedet skickas',x:'Varje anställd får sitt lönebesked digitalt några dagar innan utbetalningen.',
  v:'<div class="m-flex"><div class="m-phone a"><div><div class="m-logo">Lönebesked</div><div class="m-sm">November 2026</div><div class="m-sp"><span>Bruttolön</span><b>32 344</b></div><div class="m-sp"><span>Skatt</span><b>−9 210</b></div><div class="m-tot"><span>Netto 25/11</span><b>23 134</b></div><div class="m-send pop"'+d(.8)+'>Nytt besked</div></div></div></div>'},
 {t:'Lönen betalas ut',x:'Alla löner betalas ut samtidigt den 25:e via en betalfil till banken.',
  v:'<div class="m-flex"><div class="m-cal a"><b>NOV</b><span>25</span></div>'+card(head('Löneutbetalning')+row('Anställda','6','',.3)+row('Totalt utbetalt','141 820','',.5)+ok('Betalfil skickad',.9),'',.2)+'</div>'},
 {t:'Arbetsgivaravgifter och bokföring',x:'Arbetsgivardeklarationen lämnas till Skatteverket och lönefilen går till Redovisningsekonomen för bokföring.',
  v:card(head('Efter lönekörningen')+row('Arbetsgivaravgifter 31,42 %','10 162','',.2)+tags(['Arbetsgivardeklaration till Skatterådgivaren','Lönefil till Redovisningsekonomen'],.6),'m-wide')},
 {t:'Viktiga datum',x:'Lönearbetet följer samma rytm varje månad, och några datum styrs av lagen.',
  v:tl('Lönekalender','varje månad',[['Den 25:e','Lönen betalas ut'],['Den 12:e','Arbetsgivardeklaration för förra månaden'],['Sjukdag 15','Sjukanmälan till Försäkringskassan'],['1 april','Nytt semesterår börjar']],'Arbetsgivardeklarationen lämnas den 17:e i januari och augusti.')}
]};

export function stepsHtml(id){const S=STEPS[id];if(!S)return'';
  return '<div class="fl" data-i="0"><div class="fl-bar" role="tablist">'+S.map((s,i)=>'<button type="button" role="tab" aria-label="Steg '+(i+1)+': '+s.t+'"><i'+(s.dur?' style="--dur:'+s.dur+'s"':'')+'></i></button>').join('')+'</div>'+
  '<div class="fl-stage">'+S.map((s,i)=>'<div class="fl-s" aria-hidden="true">'+s.v+'</div>').join('')+'</div>'+
  '<div class="fl-txt" aria-live="polite">'+S.map((s,i)=>'<div hidden><div class="fl-n">Steg '+(i+1)+' av '+S.length+'</div><div class="fl-t">'+s.t+'</div><p class="fl-d">'+s.x+'</p></div>').join('')+'</div>'+
  '<div class="fl-ctl"><button type="button" class="fl-prev" aria-label="Föregående steg">←</button><button type="button" class="fl-play" aria-label="Pausa">❚❚</button><button type="button" class="fl-next" aria-label="Nästa steg">→</button></div></div>'}

export function mountSteps(root){const el=root.querySelector('.fl');if(!el)return;
  const segs=[...el.querySelectorAll('.fl-bar button')],sl=[...el.querySelectorAll('.fl-s')],tx=[...el.querySelectorAll('.fl-txt>div')],play=el.querySelector('.fl-play');
  const RM=matchMedia('(prefers-reduced-motion: reduce)').matches;let i=0,playing=!RM;
  function setPlay(p){playing=p;el.classList.toggle('paused',!p);play.textContent=p?'❚❚':(i===sl.length-1&&!p?'↺':'▶');play.setAttribute('aria-label',p?'Pausa':'Spela')}
  function go(n){i=(n+sl.length)%sl.length;segs.forEach((b,k)=>{b.classList.toggle('done',k<i);b.classList.remove('cur');b.setAttribute('aria-selected',k===i)});
    void segs[i].offsetWidth;segs[i].classList.add('cur');
    sl.forEach((s,k)=>{const on=k===i;if(on){s.classList.remove('on');void s.offsetWidth}s.classList.toggle('on',on);s.setAttribute('aria-hidden',!on)});
    tx.forEach((t,k)=>t.hidden=k!==i);if(!playing)setPlay(false)}
  segs.forEach((b,k)=>{b.onclick=()=>go(k);b.querySelector('i').addEventListener('animationend',()=>{if(!playing||k!==i)return;if(i<sl.length-1)go(i+1);else{segs[i].classList.add('done');setPlay(false)}})});
  el.querySelector('.fl-prev').onclick=()=>go(i-1);el.querySelector('.fl-next').onclick=()=>go(i+1);
  play.onclick=()=>{if(!playing&&i===sl.length-1&&segs[i].classList.contains('done')){setPlay(true);go(0);return}setPlay(!playing)};
  if(RM)el.classList.add('rm');setPlay(playing);go(0)}
