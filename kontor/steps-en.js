/* Stegvis förklaring per avdelning – miniatyrer i HTML/CSS */
const d=(s)=>' style="--d:'+s+'s"';
const row=(a,b,cls='',del)=>'<div class="m-row a '+cls+'"'+(del!=null?d(del):'')+'><span>'+a+'</span><b>'+b+'</b></div>';
const ok=(t,del=.6)=>'<span class="m-ok pop"'+d(del)+'>✓ '+t+'</span>';
const card=(inner,cls='',del=0)=>'<div class="m-card a '+cls+'"'+d(del)+'>'+inner+'</div>';
const head=(t,s)=>'<div class="m-h"><b>'+t+'</b>'+(s?'<span>'+s+'</span>':'')+'</div>';
const arrow=(del=.35)=>'<div class="m-arr a"'+d(del)+'></div>';
const ver=(rows,del0=.15)=>'<div class="m-ver"><div class="m-vh"><span>Account</span><span>Debit</span><span>Credit</span></div>'+rows.map((r,i)=>'<div class="m-vr a"'+d(del0+i*.28)+'><span><b>'+r[0]+'</b> '+r[1]+'</span><span>'+(r[2]||'')+'</span><span>'+(r[3]||'')+'</span></div>').join('')+'</div>';
const receipt=(hl)=>{const h=k=>hl?' class="hl"'+d(.3+k*.35):'';return '<div class="m-rcpt"><div class="m-logo">TeleNord AB</div><div class="m-sm">Invoice October 2026</div><div'+h(0)+'><span>Invoice date</span><b>2026-10-28</b></div><div class="m-sp"><span>Mobile subscription</span><b>399.20</b></div><div'+h(1)+'><span>VAT 25%</span><b>99.80</b></div><div class="m-tot"'+(hl?' data-hl':'')+'><span>Amount due</span><b'+(hl?' class="hl"'+d(1.0):'')+'>SEK 499.00</b></div></div>'};
const tags=(arr,del=.5)=>'<div class="m-tags">'+arr.map((t,i)=>'<span class="pop"'+d(del+i*.18)+'>'+t+'</span>').join('')+'</div>';
const bars=(pairs)=>'<div class="m-bars">'+pairs.map((p,i)=>'<div class="m-bp"><div><i class="grow" style="height:'+p[1]+'%;--d:'+(.15+i*.15)+'s"></i><i class="grow u" style="height:'+p[2]+'%;--d:'+(.25+i*.15)+'s"></i></div><small>'+p[0]+'</small></div>').join('')+'</div>';
const check=(items,last)=>'<div class="m-chk">'+items.map((t,i)=>'<div class="a"'+d(.1+i*.15)+'><i class="'+(i===items.length-1&&last?'pop late':'')+'"'+(i===items.length-1&&last?d(1.4):'')+'>✓</i>'+t+'</div>').join('')+'</div>';

const tl=(title,sub,rows,foot)=>card(head(title,sub)+'<div class="m-tl">'+rows.map((r,i)=>'<div class="a"'+d(.2+i*.3)+'><i class="pop"'+d(.3+i*.3)+'></i><b>'+r[0]+'</b><span>'+r[1]+'</span></div>').join('')+'</div>'+(foot?'<div class="m-sm a"'+d(.4+rows.length*.3)+' style="margin-top:5px">'+foot+'</div>':''),'m-wide');
export const STEPS={
re:[
 {t:'You send in the document',x:'Snap the receipt or forward the invoice, here a mobile subscription. It takes a few seconds and you don’t need to keep the original.',
  v:'<div class="m-flex"><div class="m-phone a"><div><div class="m-rcpt"><div class="m-logo">TeleNord AB</div><div class="m-sm">Faktura okt 2026</div><div><span>Abonnemang</span><b>399,20</b></div><div><span>VAT 25%</span><b>99.80</b></div><div class="m-tot"><span>Amount due</span><b>499,00</b></div></div>'+'<div class="m-send pop"'+d(.8)+'>Skickat ✓</div></div></div>'+arrow(.9)+card(head('Ekonomikas inkorg')+'<div class="m-file"><i></i><span>TeleNord_okt.pdf<small>499,00 kr</small></span></div>'+ok('Mottaget',1.4),'',1.1)+'</div>'},
 {t:'The document is read',x:'The Accountant checks the date, amount and VAT and makes sure the invoice relates to the business.',
  v:'<div class="m-flex">'+card(receipt(true),'m-wide')+'<div class="m-notes">'+['Datum','Moms','Belopp'].map((t,i)=>'<span class="pop"'+d(.4+i*.35)+'>'+t+' ✓</span>').join('')+'</div></div>'},
 {t:'Booked to the right accounts',x:'The cost goes to the right account, the VAT is deducted and the payment is booked against the business account.',
  v:card(head('Voucher A 1042','2026-10-28')+ver([['6212','Mobile phone','399.20',''],['2641','Input VAT','99.80',''],['1930','Business account','','499.00']])+'<div class="m-foot">'+ok('Debit = credit',1.1)+'</div>','m-wide')},
 {t:'Reconciled with the bank',x:'Every bank transaction is matched to a voucher. Anything that doesn’t add up is spotted right away.',
  v:'<div class="m-col">'+card(head('Bank','Business account')+'<div class="m-row"><span>28 Oct · TeleNord AB</span><b>−499.00</b></div>','m-wide')+'<div class="m-link pop"'+d(.7)+'>Matched</div>'+card(head('Bookkeeping')+'<div class="m-row"><span>A 1042 · Mobile phone</span><b>499.00</b></div>','m-wide',.35)+'</div>'},
 {t:'Done and ready for reporting',x:'The month is reconciled and the documents are stored digitally for seven years. The figures go on to the Controller and the Tax Advisor.',
  v:card(head('October 2026','Reconciled')+'<div class="m-prog"><i class="grow-x"></i></div><div class="m-row"><span>Bank transactions matched</span><b>214 of 214</b></div>'+tags(['Archived for 7 years','To the Controller','To the Tax Advisor'],.9),'m-wide')},
 {t:'Key dates',x:'The Swedish Bookkeeping Act sets how quickly transactions must be recorded. We book every week and reconcile every month.',
  v:tl('Bookkeeping','rules and routine',[['Next working day','Cash payments must be recorded'],['Every week','Documents are booked continuously'],['Working day 5','Bank and ledgers reconciled'],['7 years','Accounting records are kept']],'Other transactions are recorded as soon as possible.')}
],
co:[
 {t:'Compiling the month’s books',x:'Once October is reconciled, the Controller produces the income statement and balance sheet and compiles the month’s figures.',
  v:'<div class="m-two">'+card(head('Income statement','October')+row('Net sales','132,000','',.2)+row('Expenses','−103,600','',.4)+row('Operating profit','28,400','m-sum',.6),'',0)+card(head('Balance sheet','31 Oct')+row('Assets','688,700','',.5)+row('Equity','549,200','',.7)+row('Liabilities','139,500','',.9),'',.3)+'</div>'},
 {t:'Budget, actuals and last year',x:'Actuals are compared with both the budget and the same month last year. Variances are explained, so you can see whether things are heading the right way.',
  v:card(head('October','actuals vs budget and last year')+'<div class="m-cmp"><div class="m-vh"><span></span><span>Actual</span><span>Budget</span><span>Oct 2025</span></div>'+[['Net sales','132,000','125,000','118,000'],['Expenses','−103,600','−99,000','−93,900'],['Operating profit','28,400','26,000','24,100']].map((r,i)=>'<div class="m-vr a'+(i==2?' m-sum':'')+'"'+d(.15+i*.25)+'><span>'+r[0]+'</span><b>'+r[1]+'</b><span>'+r[2]+'</span><span>'+r[3]+'</span></div>').join('')+'</div><div class="m-tags"><span class="pop"'+d(1)+'>+9% vs budget</span><span class="pop"'+d(1.2)+'>+18% vs last year</span></div>','m-wide')},
 {t:'Key ratios are calculated',x:'A handful of ratios that say the most about your business: profitability, liquidity and stability.',
  v:'<div class="m-kpis">'+[['21.1%','Operating margin'],['433%','Quick ratio'],['79.7%','Equity ratio']].map((k,i)=>card('<div class="m-big">'+k[0]+'</div><div class="m-sm">'+k[1]+'</div>','',.15+i*.25)).join('')+'</div>'},
 {t:'You get the monthly report',x:'A short report with the figures and a comment on what stands out, so you can make decisions.',
  v:card(head('Monthly report October','to you')+'<div class="m-quote a"'+d(.3)+'>Sales were up 12% on October last year and profit is 9% above budget.</div>'+tags(['Income','Balance','Budget','Key ratios'],.8),'m-wide')},
 {t:'Key dates',x:'The Controller works to a fixed annual cycle, so you know when reports arrive and when the budget is prepared.',
  v:tl('Annual cycle','how we work',[['Working day 8','Monthly report for the previous month'],['Every quarter','The full-year forecast is updated'],['Oct–Nov','Next year’s budget is prepared'],['January','The full year is reviewed against budget']])}
],
sk:[
 {t:'Which returns apply to you?',dur:8.2,x:'The Tax Advisor works out which returns and applications your company needs, for example for trade outside Sweden, ROT and RUT or green technology. The one that applies to almost everyone is the VAT return, so we take a closer look at that.',
  v:card(head('Returns and applications','2026')+'<div class="m-grid2"><div class="a m-mv"'+d(.05)+'><i class="pop"'+d(.3)+'>✓</i><span><b>VAT return</b><small>Monthly, quarterly or yearly</small></span></div>'+[['Customs declaration','Import VAT outside the EU'],['EC sales list','Sales to EU businesses'],['OSS return','E-commerce to EU consumers'],['Reverse charge','Construction and EU purchases'],['ROT and RUT deductions','Payment for household work'],['Green technology','Solar panels, battery, charger'],['Employer declaration','Salaries and contributions monthly'],['Income tax return','The company’s tax for the year']].map((r,i)=>'<div class="a"'+d(.1+i*.12)+'><i class="pop"'+d(.4+i*.22)+'>✓</i><span><b>'+r[0]+'</b><small>'+r[1]+'</small></span></div>').join('')+'</div>','m-wide m-zoom')},
 {t:'The VAT return is prepared',x:'Now we go into the VAT return. The amounts from the reconciled books are transferred to the right boxes, the way the Swedish Tax Agency wants them.',
  v:card(head('VAT return','July–September')+['05|Taxable sales|120,000','10|Output VAT 25%|30,000','48|Input VAT|9,600'].map((r,i)=>{const p=r.split('|');return '<div class="m-row a"'+d(.2+i*.3)+'><span><em class="m-box">'+p[0]+'</em>'+p[1]+'</span><b>'+p[2]+'</b></div>'}).join('')+'<div class="m-row a m-sum"'+d(1.15)+'><span><em class="m-box f">49</em>VAT to pay</span><b>20,400</b></div>','m-wide m-zin')},
 {t:'Filed with the Tax Agency',x:'The return is filed digitally through the Swedish Tax Agency’s e-service before the deadline, 12 November. The receipt is saved.',
  v:'<div class="m-web a"><div class="m-wbar"><i></i><i></i><i></i><span>Swedish Tax Agency · VAT e-service</span></div><div class="m-wbody"><div class="m-row"><span>VAT return July–September</span><b>SEK 20,400</b></div><div class="m-row"><span>Deadline</span><b>12 November 2026</b></div><div class="m-wact"><span class="m-btn">Submit</span><span class="m-cur"></span></div><div class="m-prog"><i class="grow-x"'+d(1.1)+'></i></div><div class="m-wdone pop"'+d(2.2)+'>✓ Filed and received</div></div></div>'},
 {t:'Pay or get a refund',x:'If there is VAT to pay, you get the amount and the deadline in advance. If there is VAT to get back, it is credited to the company’s tax account.',
  v:'<div class="m-flex"><div class="m-cal a"><b>NOV</b><span>12</span></div>'+card(head('Tax account')+row('VAT July–September','−20,400','',.3)+row('Your payment','+20,400','',.6)+row('Balance','0','m-sum',.9)+'<div class="m-sm a"'+d(1.2)+' style="margin-top:5px">Due by 12 November</div>','',.15)+'</div>'},
 {t:'Key dates',x:'The Tax Advisor keeps track of every filing date. Applies to companies with turnover up to SEK 40 million and quarterly VAT.',
  v:tl('Tax calendar','2026–2027',[['The 12th','Employer declaration and tax'],['12 Nov 2026','VAT July–September'],['End of Jan','ROT, RUT and green tech for last year'],['12 Feb 2027','VAT October–December'],['2 Aug 2027','Income tax return (INK2)']],'In January and August the 17th applies instead of the 12th.')}
],
ra:[
 {t:'Reconciliations before year-end',x:'Every balance sheet item is reviewed and reconciled against supporting documents: accruals, assets, valuations, liabilities and loans. Nothing missing, nothing counted twice.',
  v:card(head('Year-end reconciliations','31 Dec 2026')+'<div class="m-grid2 m-g1">'+['Bank and cash','Receivables and payables','Accruals','Capitalised assets','Depreciation','Write-downs and revaluations','Inventory and work in progress','Liabilities and loans','VAT and tax account','Salaries and holiday pay','Tax allocation reserve','Equity'].map((t,i)=>'<div class="a"'+d(.1+i*.08)+'><i class="pop"'+d(.4+i*.22)+'>✓</i><span><b>'+t+'</b></span></div>').join('')+'</div>','m-wide')},
 {t:'Year-end entries are booked',x:'Costs and income are moved to the right year, and equipment is depreciated over its useful life.',
  v:card(head('Year-end vouchers','31 Dec')+ver([['7832','Depreciation, equipment','17,000',''],['1229','Accum. depreciation','','17,000'],['1710','Prepaid rent','12,000',''],['5010','Premises rent','','12,000']]),'m-wide')},
 {t:'The annual report is prepared',x:'Income statement, balance sheet, directors’ report and notes are compiled into a finished annual report.',
  v:'<div class="m-flex">'+'<div class="m-pages">'+['Directors’ report','Income statement','Balance sheet','Notes'].map((t,i)=>'<div class="a"'+d(.1+i*.18)+'>'+t+'</div>').join('')+'</div>'+card(head('Income statement')+row('Net sales','1,488,000','',.5)+row('Operating profit','312,400','',.7)+row('Profit for the year','246,855','m-sum',.9),'',.4)+'</div>'},
 {t:'Signing and filing',x:'The board signs digitally and the annual report is sent to the Swedish Companies Registration Office well before the deadline.',
  v:'<div class="m-flex">'+card(head('Annual report 2026')+'<div class="m-sig a"'+d(.3)+'><i></i>Board member</div><div class="m-sig a"'+d(.55)+'><i></i>Auditor</div>'+ok('Signed',.9),'',0)+arrow(1)+card(head('Companies Registration Office')+ok('Filed',1.6),'',1.2)+'</div>'},
 {t:'Key dates',x:'For a limited company whose financial year is the calendar year. The Head of Accounting tracks the dates and files in good time, so you avoid late-filing fees.',
  v:card(head('Year-end 2026','key dates')+'<div class="m-tl">'+[['31 Dec 2026','The financial year ends'],['30 Jun 2027','Latest date for the AGM'],['31 Jul 2027','Annual report to the Companies Office'],['2 Aug 2027','Income tax return (INK2) to the Tax Agency']].map((r,i)=>'<div class="a"'+d(.2+i*.35)+'><i class="pop"'+d(.3+i*.35)+'></i><b>'+r[0]+'</b><span>'+r[1]+'</span></div>').join('')+'</div><div class="m-sm a"'+d(1.8)+' style="margin-top:5px">If the annual report is filed late, the Companies Office charges a SEK 7,500 late fee (private limited company).</div>','m-wide')}
],
lo:[
 {t:'Time and absence are reported',x:'Employees report working hours, sick leave, VAB (care of a sick child) and holiday. The Payroll Administrator reviews and approves.',
  v:card(head('Timesheet November','Anna Berg')+row('Hours worked','128.0 h','',.15)+row('Sick, 2 days','16.0 h','',.35)+row('VAB, 1 day','8.0 h','',.55)+row('Holiday, 2 days','16.0 h','',.75)+'<div class="m-foot">'+ok('Approved',1.1)+'</div>','m-wide')},
 {t:'Pay is calculated',x:'The monthly salary is adjusted for absence and tax is withheld according to the tax table.',
  v:card(head('Payroll calculation','Anna Berg')+row('Monthly salary','36,000','',.15)+row('Sick-leave deduction','−1,994','',.35)+row('VAB deduction','−1,662','',.55)+row('Tax','−9,210','',.75)+row('Net pay','23,134','m-sum',1),'m-wide')},
 {t:'Payslips are sent',x:'Every employee gets their payslip digitally a few days before payday.',
  v:'<div class="m-flex"><div class="m-phone a"><div><div class="m-logo">Payslip</div><div class="m-sm">November 2026</div><div class="m-sp"><span>Gross pay</span><b>32,344</b></div><div class="m-sp"><span>Tax</span><b>−9,210</b></div><div class="m-tot"><span>Net 25/11</span><b>23,134</b></div><div class="m-send pop"'+d(.8)+'>New payslip</div></div></div></div>'},
 {t:'Salaries are paid',x:'All salaries are paid at the same time on the 25th via a payment file to the bank.',
  v:'<div class="m-flex"><div class="m-cal a"><b>NOV</b><span>25</span></div>'+card(head('Salary payment')+row('Employees','6','',.3)+row('Total paid','141,820','',.5)+ok('Payment file sent',.9),'',.2)+'</div>'},
 {t:'Employer contributions and bookkeeping',x:'The employer declaration is filed with the Swedish Tax Agency and the payroll file goes to the Accountant for booking.',
  v:card(head('After the payroll run')+row('Employer contributions 31.42%','10,162','',.2)+tags(['Employer declaration to the Tax Advisor','Payroll file to the Accountant'],.6),'m-wide')},
 {t:'Key dates',x:'Payroll follows the same rhythm every month, and some dates are set by law.',
  v:tl('Payroll calendar','every month',[['The 25th','Salaries are paid'],['The 12th','Employer declaration for last month'],['Sick day 15','Sick report to Försäkringskassan'],['1 April','New holiday year begins']],'The employer declaration is due on the 17th in January and August.')}
]};

export function stepsHtml(id){const S=STEPS[id];if(!S)return'';
  return '<div class="fl" data-i="0"><div class="fl-bar" role="tablist">'+S.map((s,i)=>'<button type="button" role="tab" aria-label="Step '+(i+1)+': '+s.t+'"><i'+(s.dur?' style="--dur:'+s.dur+'s"':'')+'></i></button>').join('')+'</div>'+
  '<div class="fl-stage">'+S.map((s,i)=>'<div class="fl-s" aria-hidden="true">'+s.v+'</div>').join('')+'</div>'+
  '<div class="fl-txt" aria-live="polite">'+S.map((s,i)=>'<div hidden><div class="fl-n">Step '+(i+1)+' of '+S.length+'</div><div class="fl-t">'+s.t+'</div><p class="fl-d">'+s.x+'</p></div>').join('')+'</div>'+
  '<div class="fl-ctl"><button type="button" class="fl-prev" aria-label="Previous step">←</button><button type="button" class="fl-play" aria-label="Pause">❚❚</button><button type="button" class="fl-next" aria-label="Next step">→</button></div></div>'}

export function mountSteps(root){const el=root.querySelector('.fl');if(!el)return;
  const segs=[...el.querySelectorAll('.fl-bar button')],sl=[...el.querySelectorAll('.fl-s')],tx=[...el.querySelectorAll('.fl-txt>div')],play=el.querySelector('.fl-play');
  const RM=matchMedia('(prefers-reduced-motion: reduce)').matches;let i=0,playing=!RM;
  function setPlay(p){playing=p;el.classList.toggle('paused',!p);play.textContent=p?'❚❚':(i===sl.length-1&&!p?'↺':'▶');play.setAttribute('aria-label',p?'Pause':'Play')}
  function go(n){i=(n+sl.length)%sl.length;segs.forEach((b,k)=>{b.classList.toggle('done',k<i);b.classList.remove('cur');b.setAttribute('aria-selected',k===i)});
    void segs[i].offsetWidth;segs[i].classList.add('cur');
    sl.forEach((s,k)=>{const on=k===i;if(on){s.classList.remove('on');void s.offsetWidth}s.classList.toggle('on',on);s.setAttribute('aria-hidden',!on)});
    tx.forEach((t,k)=>t.hidden=k!==i);if(!playing)setPlay(false)}
  segs.forEach((b,k)=>{b.onclick=()=>go(k);b.querySelector('i').addEventListener('animationend',()=>{if(!playing||k!==i)return;if(i<sl.length-1)go(i+1);else{segs[i].classList.add('done');setPlay(false)}})});
  el.querySelector('.fl-prev').onclick=()=>go(i-1);el.querySelector('.fl-next').onclick=()=>go(i+1);
  play.onclick=()=>{if(!playing&&i===sl.length-1&&segs[i].classList.contains('done')){setPlay(true);go(0);return}setPlay(!playing)};
  if(RM)el.classList.add('rm');setPlay(playing);go(0)}
