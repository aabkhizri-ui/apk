let L='en';const T=(e,u)=>L==='ur'?u:e,$=i=>document.getElementById(i);
const R=[['admin','Admin','ایڈمن'],['user','User','یوزر'],['employer','Employer','ایمپلائر'],['booker','Order Booker','آرڈر بکر'],['shopkeeper','Shopkeeper','شاپ کیپر']];
const D={bundles:[{id:1,paid:6,free:2,retail:3000,whole:2700,tok:50},{id:2,paid:12,free:4,retail:6000,whole:5300,tok:100}],
orders:[{id:1,src:'Website',who:'Guest',b:1,q:2,amt:6000,disc:0,st:'Pending'}],
reqs:[],ids:[{role:'Admin',id:'ADM-0001',pw:'admin123',name:'Admin',mob:''},{role:'User',id:'USR-0001',pw:'U5R8WN',name:'Sara',mob:'3005551111'},{role:'Employer',id:'EMP-0001',pw:'K7M2QX',name:'Ali',mob:'3001234567'},{role:'Booker',id:'BKR-0001',pw:'P4D9ZT',name:'Bilal',mob:'3007654321'}],
token:10,tick:0,shop:null,tokens:0,sel:1,cap:'0000'};
const rs=n=>'Rs '+Math.round(n).toLocaleString();
const PF={Admin:'ADM',User:'USR',Employer:'EMP',Booker:'BKR',Shopkeeper:'SHP'};
function nid(r){return PF[r]+'-'+String(D.ids.filter(i=>i.role===r).length+1).padStart(4,'0')}
function pw(){return Math.random().toString(36).slice(2,8).toUpperCase()}
const bn=id=>{const b=D.bundles.find(x=>x.id==id);return b.paid+'+'+b.free};
function addOrder(src,who,b,q,whole){const B=D.bundles.find(x=>x.id==b);const o={id:D.orders.length+1,src,who,b,q,amt:q*(whole?B.whole:B.retail),disc:0,st:'Pending'};D.orders.push(o);return o}
function ordTable(list,act){return `<div class="tw"><table><tr><th>#</th><th>${T('Source','ذریعہ')}</th><th>${T('By','نام')}</th><th>Pet</th><th>${T('Qty','تعداد')}</th><th>${T('Amount','رقم')}</th><th>${T('Status','حالت')}</th>${act?'<th></th>':''}</tr>`+
list.map(o=>`<tr><td>${o.id}</td><td>${o.src}</td><td>${o.who}</td><td>${bn(o.b)}</td><td>${o.q}</td><td>${rs(o.amt-o.disc)}</td><td><span class="tag">${o.st==='Pending'?T('Pending','زیر التوا'):T('Delivered','ڈیلیور')}</span></td>${act?`<td>${act(o)}</td>`:''}</tr>`).join('')+'</table></div>'}
function stats(a){return `<div class="grid">`+a.map(x=>`<div class="st"><b>${x[1]}</b><span>${x[0]}</span></div>`).join('')+'</div>'}
function bundleBtns(){return D.bundles.map(b=>`<button class="b2 ${D.sel==b.id?'on':''}" onclick="D.sel=${b.id};go()">${b.paid} + ${b.free} ${T('Free','فری')}</button>`).join('')}
function idForm(roles){return `<div class="card"><h3>${T('Create ID (automatic)','آئی ڈی بنائیں (خودکار)')}</h3><div class="mu">${T('ID and password are generated automatically. Each role has its own series: ADM / USR / EMP / BKR / SHP.','آئی ڈی اور پاس ورڈ خودکار بنتے ہیں۔ ہر کردار کی الگ سیریز: ADM / USR / EMP / BKR / SHP۔')}</div><div class="row"><select id="ir">${roles.map(r=>`<option>${r}</option>`).join('')}</select><input id="in" placeholder="${T('Name','نام')}"><span class="mu">+92</span><input id="im" inputmode="numeric" maxlength="10" placeholder="3XXXXXXXXX"><button class="b" onclick="mk()">${T('Create','بنائیں')}</button></div><div id="im2" class="ok">${D.last?T('Created: ','بن گئی: ')+D.last.id+' / '+D.last.pw:''}</div></div>`+
`${(roles.includes('User')?[...roles,'Shopkeeper']:roles).map(r=>`<div class="card"><h3>${r} IDs</h3><div class="tw"><table><tr><th>ID</th><th>${T('Name','نام')}</th><th>${T('Mobile','موبائل')}</th><th>${T('Password','پاس ورڈ')}</th></tr>${D.ids.filter(i=>i.role===r).map(i=>`<tr><td><b>${i.id}</b></td><td>${i.name}</td><td>+92 ${i.mob}</td><td>${i.pw}</td></tr>`).join('')}</table></div></div>`).join('')}`}
function mk(){const m=$('im').value,n=$('in').value.trim();if(!n||!/^\d{10}$/.test(m)){$('im2').textContent=T('Enter name and exactly 10 digits','نام اور پورے 10 ہندسے درج کریں');return}const r=$('ir').value,x={role:r,id:nid(r),pw:pw(),name:n,mob:m};D.ids.push(x);save();D.last=x;go()}
function newCap(){D.cap=String(Math.floor(Math.random()*9000)+1000)}
const V={
admin(){const tot=D.orders.reduce((s,o)=>s+o.amt-o.disc,0);
return `<h1>${T('Admin Panel','ایڈمن پینل')}</h1>`+stats([[T('Total sales','کل سیلز'),rs(tot)],[T('Orders','آرڈرز'),D.orders.length],[T('Pending discounts','زیر التوا ڈسکاؤنٹ'),D.reqs.filter(r=>!r.done).length],[T('Token rate','ٹوکن ریٹ'),rs(D.token)]])+
`<div class="card"><h3>${T('Pet bundles (editable)','پیٹ بنڈلز (ایڈٹ ایبل)')}</h3><div class="tw"><table><tr><th>${T('Paid','پیڈ')}</th><th>${T('Free','فری')}</th><th>${T('Retail','ریٹیل')}</th><th>${T('Wholesale','ہول سیل')}</th><th>${T('Tokens','ٹوکن')}</th></tr>`+
D.bundles.map((b,i)=>`<tr>${['paid','free','retail','whole','tok'].map(k=>`<td><input class="n" type="number" min="0" value="${b[k]}" onchange="D.bundles[${i}].${k}=+this.value"></td>`).join('')}</tr>`).join('')+`</table></div><div class="mu">${T('Changes show live in Booker and Shopkeeper portals.','تبدیلی بکر اور شاپ کیپر کو فوری نظر آئے گی۔')}</div></div>`+
`<div class="card"><h3>${T('Token market control','ٹوکن مارکیٹ کنٹرول')}</h3><div class="tick" id="tp"></div><div class="row"><button class="b2" onclick="adj(.5)">▲ +0.5</button><button class="b2" onclick="adj(-.5)">▼ −0.5</button></div></div>`+
`<div class="card"><h3>${T('Discount requests','ڈسکاؤنٹ درخواستیں')}</h3>`+(D.reqs.length?D.reqs.map((r,i)=>`<div class="row">#${r.o} — ${r.shop} ${r.done?`<span class="ok">${T('Approved','منظور')} ${rs(r.amt)}</span>`:`<input class="n" id="d${i}" type="number" placeholder="Rs"><button class="b" onclick="appr(${i})">${T('Approve','منظور کریں')}</button>`}</div>`).join(''):`<span class="mu">${T('No requests yet. Send one from Shopkeeper.','ابھی کوئی درخواست نہیں۔ شاپ کیپر سے بھیجیں۔')}</span>`)+`</div>`+
`<div class="card"><h3>${T('All orders','تمام آرڈرز')}</h3>${ordTable(D.orders)}</div>`+idForm(['User','Employer','Booker'])},
user(){const bk=D.ids.filter(i=>i.role==='Booker');return `<h1>${T('User (Sub-Admin) Panel','یوزر (سب ایڈمن) پینل')}</h1>`+stats([[T('Employers','ایمپلائرز'),D.ids.filter(i=>i.role==='Employer').length],[T('Order Bookers','آرڈر بکرز'),bk.length],[T('Booker orders','بکر آرڈرز'),D.orders.filter(o=>o.src==='Booker').length]])+idForm(['Employer','Booker'])+
`<div class="card"><h3>${T('Booker performance','بکرز کی کارکردگی')}</h3>${bk.map(b=>`<div class="row">${b.name}: <b>${D.orders.filter(o=>o.who===b.name).length}</b> ${T('orders','آرڈرز')}</div>`).join('')||'—'}</div>`},
employer(){const p=D.orders.filter(o=>o.st==='Pending');return `<h1>${T('Employer Dispatch','ایمپلائر ڈسپیچ')} · ${D.sess.employer.id}</h1>`+stats([[T('Pending','زیر التوا'),p.length],[T('Delivered','ڈیلیور'),D.orders.length-p.length],[T('Website orders','ویب آرڈرز'),D.orders.filter(o=>o.src==='Website').length]])+
`<div class="card"><h3>${T('Live queue (website + field)','لائیو قطار (ویب + فیلڈ)')}</h3>${ordTable(D.orders,o=>o.st==='Pending'?`<button class="b" onclick="D.orders[${o.id-1}].st='Done';go()">${T('Deliver','ڈیلیور')}</button>`:'✓')}</div>`},
booker(){const me=D.sess.booker.name,mine=D.orders.filter(o=>o.who===me);return `<h1>${T('Order Booker','آرڈر بکر')} · ${D.sess.booker.id}</h1>`+stats([[T('Booked','بُک'),mine.length],[T('Bottles','بوتلیں'),mine.reduce((s,o)=>{const b=D.bundles.find(x=>x.id==o.b);return s+o.q*(b.paid+b.free)},0)]])+
`<div class="card"><h3>${T('Book order','آرڈر بک کریں')}</h3><div class="row"><input id="shn" placeholder="${T('Shop name','دکان کا نام')}"></div><div class="row">${bundleBtns()}<input class="n" id="bq" type="number" min="1" value="1"></div><button class="b" onclick="bk()">${T('Book (wholesale)','بک کریں (ہول سیل)')}</button></div><div class="card"><h3>${T('My orders','میرے آرڈرز')}</h3>${ordTable(mine)}</div>`},
shopkeeper(){if(!D.shop)return shopAuth();
const mine=D.orders.filter(o=>o.who===D.shop);return `<h1>${T('Shopkeeper','شاپ کیپر')} ${D.sid} · +92 ${D.shop}</h1>`+(D.last?`<div class="card ok">${T('Your ID: ','آپ کی آئی ڈی: ')}${D.last.id}</div>`:'')+stats([[T('Tokens','ٹوکن'),D.tokens],[T('Wallet value','والٹ ویلیو'),rs(D.tokens*D.token)],[T('Orders','آرڈرز'),mine.length]])+
`<div class="card"><h3>${T('Order (wholesale rate)','آرڈر (ہول سیل ریٹ)')}</h3>`+D.bundles.map(b=>`<div class="pk"><div><b>${b.paid} + ${b.free} ${T('Free','فری')}</b><div class="mu">${b.paid+b.free} ${T('bottles','بوتلیں')} · +${b.tok} ${T('tokens','ٹوکن')}</div></div><div class="p">${rs(b.whole)}</div><div class="row"><button class="b2" onclick="sq(${b.id},-1)">−</button><b>${D.scart[b.id]||0}</b><button class="b2" onclick="sq(${b.id},1)">+</button></div></div>`).join('<hr style="border:0;border-top:1px solid var(--bd)">')+`<div class="row"><b>${T('Total','کل')}: <span class="p">${rs(D.bundles.reduce((s,b)=>s+(D.scart[b.id]||0)*b.whole,0))}</span></b><button class="b" onclick="so()">${T('Place order','آرڈر کریں')}</button></div></div>`+
`<div class="card"><h3>${T('My orders','میرے آرڈرز')}</h3>${ordTable(mine,o=>o.disc||D.reqs.some(r=>r.o==o.id)?'':`<button class="b2" onclick="D.reqs.push({o:${o.id},shop:'+92 ${D.shop}',done:0});go()">${T('Ask discount','ڈسکاؤنٹ مانگیں')}</button>`)}</div><div class="card"><h3>${T('Live token market','لائیو ٹوکن مارکیٹ')}</h3><div class="tick" id="tp"></div><div class="mu">${T('Non-cash: usable in-app only.','نان کیش: صرف ایپ کے اندر۔')}</div></div>`}};
function adj(d){D.token=Math.max(.5,D.token+d);paint(d)}
function paint(d){const e=$('tp');if(e)e.innerHTML='Rs '+D.token.toFixed(2)+' '+(d>=0?'<span class="up">▲</span>':'<span class="dn">▼</span>')}
function appr(i){const a=+$('d'+i).value;if(!(a>0))return;const r=D.reqs[i];r.done=1;r.amt=a;D.orders[r.o-1].disc=a;go()}
function bk(){const s=$('shn').value.trim()||'Shop';addOrder('Booker',D.sess.booker.name,D.sel,Math.max(1,+$('bq').value||1),1);go()}
function so(){const l=D.bundles.filter(b=>D.scart[b.id]>0);if(!l.length)return;l.forEach(b=>{const q=D.scart[b.id];addOrder('Shopkeeper',D.shop,b.id,q,1);D.tokens+=q*b.tok});D.scart={};go()}
function su(){const ok=/^\d{10}$/.test($('sm').value),pw=$('sp').value.length>=6,c=$('sc').value===D.cap;
if(ok&&pw&&c){const m=$('sm').value,x={role:'Shopkeeper',id:nid('Shopkeeper'),pw:$('sp').value,name:'Shop',mob:m};if(D.ids.some(i=>i.role==='Shopkeeper'&&i.mob===m)){$('sx').textContent=T('This mobile is already registered','یہ موبائل پہلے سے رجسٹرڈ ہے');return}D.ids.push(x);save();D.shop=m;D.sid=x.id;D.last=x;go();return}$('sx').textContent=!ok?T('Exactly 10 digits after +92','+92 کے بعد پورے 10 ہندسے'):!pw?T('Password: 6+ characters','پاس ورڈ کم از کم 6 حروف'):T('Captcha mismatch','کیپچا درست نہیں');if(!c){newCap();setTimeout(go,900)}}
D.sess={};D.scart={};D.lm='login';
try{const st=JSON.parse(localStorage.getItem('ak_ids')||'null');if(st&&st.length)D.ids=st}catch(e){}
if(!D.ids.some(i=>i.role==='Admin'))D.ids.unshift({role:'Admin',id:'ADM-0001',pw:'admin123',name:'Admin',mob:''});
const save=()=>{try{localStorage.setItem('ak_ids',JSON.stringify(D.ids))}catch(e){}};
const eye=i=>{$(i).type=$(i).type==='password'?'text':'password'};
const sq=(id,d)=>{D.scart[id]=Math.max(0,(D.scart[id]||0)+d);go()};
const RN={admin:'Admin',user:'User',employer:'Employer',booker:'Booker',shopkeeper:'Shopkeeper'},PX={admin:'ADM',user:'USR',employer:'EMP',booker:'BKR'};
let tries=0;const bad=()=>T('Wrong ID or password','آئی ڈی یا پاس ورڈ غلط ہے');
function loginView(k){const r=R.find(x=>x[0]===k);return `<h1>${T(r[1],r[2])} · ${T('Login','لاگ ان')}</h1><div class="card"><div class="row"><input id="li" placeholder="${T('ID','آئی ڈی')} (${PX[k]}-0001)"></div><div class="row"><input id="lp" type="password" placeholder="${T('Password','پاس ورڈ')}"><button class="b2" onclick="eye('lp')">👁</button></div><div id="sx" class="er"></div><button class="b" onclick="lg('${k}')">${T('Login','لاگ ان')}</button></div>`}
function lg(k){if(tries>=5){$('sx').textContent=T('Too many attempts. Reload the page.','بہت زیادہ کوششیں۔ صفحہ دوبارہ کھولیں۔');return}const q=$('li').value.trim().toUpperCase(),p=$('lp').value,a=D.ids.find(i=>i.role===RN[k]&&i.id===q&&i.pw===p);if(!a){tries++;$('sx').textContent=bad();return}tries=0;D.sess[k]=a;go()}
function sl(){const q=$('li').value.trim().toUpperCase(),p=$('lp').value,a=D.ids.find(i=>i.role==='Shopkeeper'&&(i.id===q||i.mob===q)&&i.pw===p);if(!a){$('sx').textContent=bad();return}D.shop=a.mob;D.sid=a.id;D.last=null;go()}
function lo(k){if(k==='shopkeeper'){D.shop=null;D.sid=null}else delete D.sess[k];D.last=null;go()}
function shopAuth(){const g=D.lm==='signup',pf=g?'sp':'lp';return `<h1>${T('Shopkeeper','شاپ کیپر')}</h1><div class="row"><button class="b2 ${g?'':'on'}" onclick="D.lm='login';go()">${T('Login','لاگ ان')}</button><button class="b2 ${g?'on':''}" onclick="D.lm='signup';go()">${T('Create ID','آئی ڈی بنائیں')}</button></div><div class="card">`+
(g?`<div class="row"><span class="mu">+92</span><input id="sm" inputmode="numeric" maxlength="10" placeholder="3XXXXXXXXX"></div>`:`<div class="row"><input id="li" placeholder="${T('ID (SHP-0001) or mobile','آئی ڈی (SHP-0001) یا موبائل')}"></div>`)+
`<div class="row"><input id="${pf}" type="password" placeholder="${T('Password','پاس ورڈ')}"><button class="b2" onclick="eye('${pf}')">👁</button></div>`+
(g?`<div class="row"><span class="cap">${D.cap}</span><button class="b2" onclick="newCap();go()">⟳</button><input class="n" id="sc" inputmode="numeric" maxlength="4"></div>`:'')+
`<div id="sx" class="er"></div><button class="b" onclick="${g?'su()':'sl()'}">${g?T('Create ID','آئی ڈی بنائیں'):T('Login','لاگ ان')}</button></div>`}
const AL={admin:'admin',administrator:'admin',user:'user',subadmin:'user',employer:'employer',employee:'employer',emp:'employer',booker:'booker',orderbooker:'booker',shopkeeper:'shopkeeper',shop:'shopkeeper'};

const AK=window.AK||{};let sb=null;try{if(AK.url&&window.supabase)sb=window.supabase.createClient(AK.url,AK.key)}catch(e){}
D.f={};D.cart={};D.msg=null;D.tres='';
const esc=s=>String(s||'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const cq=(id,d)=>{D.cart[id]=Math.max(0,(D.cart[id]||0)+d);go()};
const items=()=>D.bundles.filter(b=>D.cart[b.id]>0).map(b=>({bundle_id:b.id,qty:D.cart[b.id]}));
const ok=()=>{const f=D.f;return (f.n||'').trim()&&/^\d{10}$/.test(f.p||'')&&(f.a||'').trim()&&items().length};
async function po(){if(!ok()){D.msg={e:1,t:T('Fill name, 10-digit mobile, address and pick a bundle.','نام، 10 ہندسوں کا موبائل، پتہ درج کریں اور بنڈل منتخب کریں۔')};go();return}
 const f=D.f;let no=null;
 if(sb){try{const r=await sb.rpc('place_guest_order',{p_name:f.n,p_phone:f.p,p_address:f.a,p_items:items()});if(!r.error)no=r.data}catch(e){}}
 const ids=items().map(i=>addOrder('Website',f.n,i.bundle_id,i.qty,0).id);
 D.msg={t:T('Order received! Number: ','آرڈر موصول ہو گیا! نمبر: ')+(no||ids.join(', '))};D.cart={};D.f={};go()}
function wa(){if(!ok()){po();return}const f=D.f,t='Aab-e-Khizri order\n'+items().map(i=>bn(i.bundle_id)+' x '+i.qty).join('\n')+'\n'+f.n+' +92'+f.p+'\n'+f.a;window.open('https://wa.me/'+(AK.whatsapp||'')+'?text='+encodeURIComponent(t),'_blank')}
async function tr(){const n=+(D.f.t||0);let st=null;
 if(sb&&D.f.tp){try{const r=await sb.rpc('track_order',{p_no:n,p_phone:D.f.tp});if(!r.error&&r.data)st=r.data}catch(e){}}
 if(!st){const o=D.orders.find(x=>x.id===n);if(o)st=o.st==='Pending'?'pending':'delivered'}
 D.tres=st?T('Status: ','حالت: ')+st:T('Order not found.','آرڈر نہیں ملا۔');go()}
V.home=function(){const f=D.f,tot=D.bundles.reduce((s,b)=>s+(D.cart[b.id]||0)*b.retail,0);
const feats=[['🎁',T('Free bottles','فری بوتلیں'),T('Every Pet bundle comes with bonus bottles.','ہر پیٹ بنڈل کے ساتھ اضافی فری بوتلیں۔')],['🏪',T('Wholesale for shopkeepers','دکانداروں کے لیے ہول سیل'),T('Register as a shopkeeper for wholesale rates.','ہول سیل ریٹ کے لیے شاپ کیپر کے طور پر رجسٹر ہوں۔')],['🪙',T('Reward tokens','ریوارڈ ٹوکن'),T('Earn non-cash tokens with every bundle.','ہر بنڈل پر نان کیش ٹوکن حاصل کریں۔')],['🚚',T('Order tracking','آرڈر ٹریکنگ'),T('Track your order with its number.','آرڈر نمبر سے اپنا آرڈر ٹریک کریں۔')]];
return `<section class="hero"><img src="logo.png" alt="Aab-e-Khizri Cumin Water"><div><h1>${T('Aab-e-Khizri Cumin Water','آبِ خضری زیرہ پانی')}</h1><p>${T('Traditional Ayurvedic formulation, bottled fresh. Order Pet bundles with free bottles.','روایتی آیورویدک فارمولا، تازہ بوتل بند۔ فری بوتلوں کے ساتھ پیٹ بنڈل آرڈر کریں۔')}</p><button class="b" onclick="document.getElementById('order').scrollIntoView({behavior:'smooth'})">${T('Order now','ابھی آرڈر کریں')}</button></div></section>`+
`<div class="grid">${feats.map(x=>`<div class="st"><b>${x[0]}</b><span><b style="font-size:15px;display:inline">${x[1]}</b><br>${x[2]}</span></div>`).join('')}</div>`+
`<div class="card" id="order"><h3>${T('Pet bundles','پیٹ بنڈلز')}</h3>`+D.bundles.map(b=>`<div class="pk"><div><b>${b.paid} + ${b.free} ${T('Free','فری')}</b><div class="mu">${b.paid+b.free} ${T('bottles','بوتلیں')}</div></div><div class="p">${rs(b.retail)}</div><div class="row"><button class="b2" onclick="cq(${b.id},-1)">−</button><b>${D.cart[b.id]||0}</b><button class="b2" onclick="cq(${b.id},1)">+</button></div></div>`).join('<hr style="border:0;border-top:1px solid var(--bd)">')+
`<div class="row"><b>${T('Total','کل')}: <span class="p">${rs(tot)}</span></b></div></div>`+
`<div class="card"><h3>${T('Delivery details','ڈیلیوری کی تفصیل')}</h3><div class="row"><input placeholder="${T('Full name','پورا نام')}" value="${esc(f.n)}" oninput="D.f.n=this.value"></div><div class="row"><span class="mu">+92</span><input inputmode="numeric" maxlength="10" placeholder="3XXXXXXXXX" value="${esc(f.p)}" oninput="D.f.p=this.value"></div><div class="row"><input style="width:100%" placeholder="${T('Full address','مکمل پتہ')}" value="${esc(f.a)}" oninput="D.f.a=this.value"></div>${D.msg?`<div class="${D.msg.e?'er':'ok'}">${D.msg.t}</div>`:''}<div class="row"><button class="b" onclick="po()">${T('Place order','آرڈر کریں')}</button><button class="b2" onclick="wa()">WhatsApp</button></div></div>`+
`<div class="card"><h3>${T('Track your order','اپنا آرڈر ٹریک کریں')}</h3><div class="row"><input class="n" inputmode="numeric" placeholder="#" value="${esc(f.t)}" oninput="D.f.t=this.value"><input placeholder="${T('Mobile (optional)','موبائل (اختیاری)')}" value="${esc(f.tp)}" oninput="D.f.tp=this.value"><button class="b" onclick="tr()">${T('Track','ٹریک')}</button></div><div class="ok">${D.tres}</div></div><div class="ft">© Aab-e-Khizri · Traditional Ayurvedic Formulation</div>`};

function go(){let h=decodeURIComponent(location.hash.slice(1)).toLowerCase().replace(/^[\/!]+/,'').replace(/[\s_-]+/g,'');const k=AL[h]||'home';
$('nav').innerHTML='<a href="#" class="'+(k==='home'?'on':'')+'">⌂</a>'+R.map(r=>`<a href="#${r[0]}" class="${r[0]===k?'on':''}">${T(r[1],r[2])}</a>`).join('');
$('nav').innerHTML='';$('brand').textContent=T('Aab-e-Khizri','آبِ خضری');$('sw').textContent=L==='en'?'اردو':'English';
document.documentElement.lang=L;document.documentElement.dir=L==='ur'?'rtl':'ltr';
const need=k!=='home'&&k!=='shopkeeper'&&!D.sess[k],inn=k==='shopkeeper'?D.shop:D.sess[k];
const bar=k!=='home'&&inn?`<div class="row" style="justify-content:space-between"><span class="tag">${k==='shopkeeper'?D.sid:D.sess[k].id}</span><button class="b2" onclick="lo('${k}')">${T('Logout','لاگ آؤٹ')}</button></div>`:'';
$('v').innerHTML=need?loginView(k):bar+V[k]();paint(0)}
$('sw').onclick=()=>{L=L==='en'?'ur':'en';go()};
addEventListener('hashchange',()=>{scrollTo(0,0);D.last=null;go()});
setInterval(()=>{D.token=Math.max(.5,D.token+(Math.random()-.5)*.2);paint(0)},3000);
newCap();go();
if(sb)sb.from('ak_bundles').select('*').eq('active',true).order('id').then(r=>{if(r&&r.data&&r.data.length){D.bundles=r.data.map(x=>({id:x.id,paid:x.paid,free:x.free,retail:+x.retail,whole:+x.wholesale,tok:x.tokens}));go()}}).catch(()=>{});
