(() => {
  const symbols = [
    {s:'𓂀',name:'Eye of Horus',meaning:'Protection / well-being',function:'Symbol / concept',related:'Horus',group:'Sacred signs',category:'sacred',desc:'A protective sign associated with the eye of Horus. It became a powerful visual shorthand for protection and well-being.',search:'eye horus protection sacred'},
    {s:'𓋹',name:'Ankh',meaning:'Life',function:'Symbol / concept',related:'Life',group:'Sacred signs',category:'sacred',desc:'The ankh is a well-known Egyptian sign associated with life. It appears in royal and divine imagery across many periods.',search:'ankh life sacred'},
    {s:'𓆣',name:'Scarab beetle',meaning:'Renewal / transformation',function:'Ideographic symbol',related:'Khepri',group:'Animals',category:'animals',desc:'The scarab was associated with renewal and the solar cycle, especially through its connection with Khepri.',search:'scarab beetle khepri renewal'},
    {s:'𓉐',name:'House / building',meaning:'House / place',function:'Ideogram / determinative',related:'Place',group:'Objects',category:'objects',desc:'A plan-like sign representing a house or enclosed place. Signs like this could help communicate a word or clarify its meaning.',search:'house building place object'},
    {s:'𓅃',name:'Falcon',meaning:'Falcon / divine association',function:'Animal sign',related:'Horus',group:'Birds',category:'birds',desc:'Falcons were important in Egyptian imagery and are strongly associated with Horus and other royal or divine ideas.',search:'falcon bird horus'},
    {s:'𓀀',name:'Standing man',meaning:'Person / male',function:'Figure sign',related:'Human',group:'People',category:'people',desc:'A human figure can represent a person and, depending on context, can also help clarify grammatical or semantic meaning.',search:'person man human figure'},
    {s:'𓃠',name:'Cat',meaning:'Cat / feline',function:'Animal sign',related:'Feline imagery',group:'Animals',category:'animals',desc:'Cats appear throughout Egyptian art and writing. Feline imagery could connect to household life, symbolism and deities.',search:'cat feline animal'},
    {s:'𓆼',name:'Papyrus plant',meaning:'Papyrus / marsh',function:'Plant sign',related:'Nile landscape',group:'Plants',category:'plants',desc:'The papyrus plant was deeply connected to the Nile environment and became an important visual symbol in Egyptian culture.',search:'papyrus plant nile'},
    {s:'𓇳',name:'Sun disk',meaning:'Sun / solar power',function:'Ideogram / symbol',related:'Ra',group:'Sacred signs',category:'sacred',desc:'The solar disk is a recurring sign in Egyptian writing and imagery, often associated with the sun god and royal theology.',search:'sun disk solar ra'},
    {s:'𓏏',name:'Bread loaf',meaning:'T sound / bread',function:'Phonogram / sign',related:'Food',group:'Objects',category:'objects',desc:'This loaf-shaped sign commonly contributes the consonantal sound t and can also appear in words connected with bread or food.',search:'bread loaf t sound'},
    {s:'𓇋',name:'Reed leaf',meaning:'I / y sound',function:'Phonogram',related:'Sound value',group:'Plants',category:'plants',desc:'The reed leaf is commonly used for the sound i or y in simplified educational transliterations.',search:'reed leaf i y sound'},
    {s:'𓅓',name:'Owl',meaning:'M sound',function:'Phonogram',related:'Sound value',group:'Birds',category:'birds',desc:'The owl sign is famous for contributing the consonantal sound m in many Egyptian words.',search:'owl m sound bird'},
    {s:'𓅱',name:'Quail chick',meaning:'W / u sound',function:'Phonogram',related:'Sound value',group:'Birds',category:'birds',desc:'The quail chick is frequently used for the consonantal sound w and is a useful sign to recognize in phonetic examples.',search:'quail chick w u sound'},
    {s:'𓂋',name:'Mouth',meaning:'R sound / mouth',function:'Phonogram / ideogram',related:'Speech',group:'Body parts',category:'people',desc:'The mouth sign can contribute the r sound and can also represent the mouth itself in appropriate contexts.',search:'mouth r sound body'},
    {s:'𓉢',name:'Village / settlement',meaning:'Settlement / place',function:'Determinative / sign',related:'Community',group:'Objects',category:'objects',desc:'A settlement-like sign can help identify place and community concepts, depending on the word and context.',search:'village settlement place'},
    {s:'𓁶',name:'Head',meaning:'Head / person',function:'Body sign',related:'Human',group:'Body parts',category:'people',desc:'Human body signs appear frequently in Egyptian writing and can serve different functions according to the word they belong to.',search:'head body person'},
  ];

  const systems = {
    phonogram:{label:'PHONOGRAM',title:'A sign can carry a sound.',text:'Some hieroglyphs were used for their consonantal sounds. This is why a modern name can sometimes be rendered approximately by choosing signs whose sounds are close to its letters.',symbol:'𓅓',example:'sound → sign'},
    ideogram:{label:'IDEOGRAM',title:'A sign can point to an idea or thing.',text:'Some signs could represent the object or concept they depicted. Context matters: a sign’s visual form is only part of understanding how it works in a word or inscription.',symbol:'𓋹',example:'thing → idea'},
    determinative:{label:'DETERMINATIVE',title:'A sign can clarify a word.',text:'Determinatives are unpronounced signs placed at the end of words to help indicate a semantic category or distinguish meanings. They are clues for the reader, not decoration.',symbol:'𓉢',example:'word + clue → meaning'}
  };

  const challenges = {
    easy:[['𓇋 𓅓 𓏏','IMT','𓇋 ≈ I · 𓅓 ≈ M · 𓏏 ≈ T','Three signs. Use their common sound values.'],['𓅓 𓅱','MW','𓅓 ≈ M · 𓅱 ≈ W','Two familiar bird signs. What sounds do they suggest?']],
    medium:[['𓂋 𓅓 𓇋','RMI','𓂋 ≈ R · 𓅓 ≈ M · 𓇋 ≈ I','Look at the mouth, owl and reed leaf.'],['𓏏 𓅓 𓂋','TMR','𓏏 ≈ T · 𓅓 ≈ M · 𓂋 ≈ R','Three signs, three consonantal values.']],
    expert:[['𓇋 𓅓 𓏏 𓂋','IMTR','𓇋 ≈ I · 𓅓 ≈ M · 𓏏 ≈ T · 𓂋 ≈ R','Expert mode: remember that simplified transliteration is not a direct English translation.'],['𓅓 𓅱 𓂋 𓏏','MWRT','𓅓 ≈ M · 𓅱 ≈ W · 𓂋 ≈ R · 𓏏 ≈ T','Use the common educational sound values.']]
  };

  const facts = [
    'Hieroglyphic writing was used mainly in formal, monumental and religious contexts; faster scripts served many everyday needs.',
    'Egyptian writing systems changed over time. Hieroglyphic, hieratic and demotic were used for different purposes and periods.',
    'The direction of an inscription can often be inferred from the way human and animal signs face.',
    'The Rosetta Stone contains the same decree in hieroglyphic, demotic and Greek, creating a crucial bridge for decipherment.',
    'A determinative is normally not pronounced. It helps the reader understand the semantic category of a word.'
  ];

  const quiz = [
    {q:'What is a determinative mainly used to do?',a:['Decorate a temple','Clarify meaning','Count pyramids','Identify a pharaoh'],c:1,e:'Correct — determinatives provide semantic clues and are normally not pronounced.'},
    {q:'Which statement is most accurate about hieroglyphs?',a:['Every sign is only a picture','They can have different functions','They were used only for names','They always read left to right'],c:1,e:'Correct — signs can function as sound signs, ideograms, determinatives and more depending on context.'},
    {q:'What can help indicate the direction of an inscription?',a:['The size of the pyramid','The orientation of figures','The color of the stone','The number of signs'],c:1,e:'Correct — the orientation of human and animal figures can be an important visual clue.'},
    {q:'Why is a modern name rendering only an approximation?',a:['Egyptians had no names','Modern languages and Egyptian sound systems differ','Hieroglyphs cannot represent sounds','Names were never written'],c:1,e:'Correct — a phonetic rendering selects approximate sound values; it is not a historical Egyptian translation.'},
    {q:'Why was the Rosetta Stone important?',a:['It was the largest pyramid','It contained three scripts for one decree','It was a royal tomb','It invented hieroglyphs'],c:1,e:'Correct — the parallel texts in hieroglyphic, demotic and Greek helped scholars decipher Egyptian writing.'}
  ];

  const $ = id => document.getElementById(id);
  const grid = $('symbolGrid');
  let selected = symbols[0], currentCategory='all', currentChallengeLevel='easy', challengeIndex=0, quizIndex=0, score=0, answered=false;

  function renderSymbols(){
    const query=($('glyphSearch')?.value||'').trim().toLowerCase();
    const list=symbols.filter(x=>(currentCategory==='all'||x.category===currentCategory)&&(!query||`${x.name} ${x.meaning} ${x.search}`.toLowerCase().includes(query)));
    grid.innerHTML=list.map(x=>`<button class="symbol-button ${x.s===selected.s?'active':''}" data-symbol-value="${x.s}" aria-label="${x.name}"><strong>${x.s}</strong><small>${x.name}</small></button>`).join('') || '<p style="grid-column:1/-1;color:var(--text-soft);padding:25px">No matching signs found. Try another word or category.</p>';
    grid.querySelectorAll('.symbol-button').forEach(b=>b.addEventListener('click',()=>selectSymbol(b.dataset.symbolValue)));
  }
  function selectSymbol(char){
    selected=symbols.find(x=>x.s===char)||symbols[0];
    $('selectedGlyph').textContent=selected.s;$('selectedName').textContent=selected.name;$('selectedMeaning').textContent=selected.meaning;$('selectedFunction').textContent=selected.function;$('selectedRelated').textContent=selected.related;$('selectedGroup').textContent=selected.group;$('selectedCategory').textContent=selected.category==='sacred'?'SACRED SYMBOL':selected.category.toUpperCase();$('selectedDescription').textContent=selected.desc;renderSymbols();
  }
  renderSymbols();
  $('glyphSearch')?.addEventListener('input',renderSymbols);
  document.querySelectorAll('.cat-btn').forEach(btn=>btn.addEventListener('click',()=>{currentCategory=btn.dataset.category;document.querySelectorAll('.cat-btn').forEach(x=>x.classList.toggle('active',x===btn));renderSymbols();}));
  document.querySelectorAll('.popular-row button').forEach(btn=>btn.addEventListener('click',()=>{currentCategory='all';document.querySelectorAll('.cat-btn').forEach(x=>x.classList.toggle('active',x.dataset.category==='all'));selectSymbol(btn.dataset.pick);}));
  document.querySelectorAll('[data-category-jump]').forEach(btn=>btn.addEventListener('click',()=>{currentCategory=btn.dataset.category;document.querySelectorAll('.cat-btn').forEach(x=>x.classList.toggle('active',x.dataset.category===currentCategory));renderSymbols();$('explorer').scrollIntoView({behavior:'smooth'});}));
  $('randomGlyph')?.addEventListener('click',()=>selectSymbol(symbols[Math.floor(Math.random()*symbols.length)].s));
  $('jumpAnatomy')?.addEventListener('click',()=>$('anatomy').scrollIntoView({behavior:'smooth'}));
  document.querySelectorAll('.glyph-tile').forEach(btn=>btn.addEventListener('click',()=>{selectSymbol(btn.dataset.symbol);$('explorer').scrollIntoView({behavior:'smooth'});}));

  // writing systems cards
  function setSystem(key){const d=systems[key];$('systemLabel').textContent=d.label;$('systemTitle').textContent=d.title;$('systemText').textContent=d.text;$('systemExample').textContent=d.example;document.querySelector('.detail-symbol').textContent=d.symbol;document.querySelectorAll('.system-card').forEach(c=>{const on=c.dataset.system===key;c.classList.toggle('active',on);c.setAttribute('aria-expanded',String(on));});}
  document.querySelectorAll('.system-card').forEach(c=>c.addEventListener('click',()=>setSystem(c.dataset.system)));

  // name builder — intentionally approximate and educational
  const map={a:'𓄿',b:'𓃀',d:'𓂧',e:'𓇋',f:'𓆑',g:'𓎼',h:'𓉔',i:'𓇋',j:'𓆓',k:'𓎡',l:'𓃭',m:'𓅓',n:'𓈖',o:'𓅱',p:'𓊪',q:'𓈎',r:'𓂋',s:'𓊃',t:'𓏏',u:'𓅱',v:'𓆑',w:'𓅱',x:'𓐍',y:'𓇋',z:'𓊃',c:'𓎡'};
  function renderName(){const raw=($('nameInput').value||'').trim().toLowerCase();const chars=[...raw].filter(ch=>map[ch]);const glyphs=chars.length?chars.map(ch=>map[ch]).join(' '):'𓂀';$('nameGlyphs').textContent=glyphs;$('nameLatin').textContent=raw?raw.toUpperCase():'YOUR NAME';$('nameStatus').textContent=raw?`Rendered ${chars.length} sound sign${chars.length===1?'':'s'} as an educational approximation.`:'Try a short name in English.';}
  $('renderName')?.addEventListener('click',renderName);$('nameInput')?.addEventListener('keydown',e=>{if(e.key==='Enter')renderName();});renderName();

  // decode challenge
  function renderChallenge(){const d=challenges[currentChallengeLevel][challengeIndex];$('decodeSymbols').textContent=d[0];$('decodeWord').textContent=d[1];$('decodeExplanation').textContent=d[2];$('decodeHint').textContent=d[3];$('decodeAnswer').hidden=true;$('revealDecode').hidden=false;}
  document.querySelectorAll('.difficulty-btn').forEach(btn=>btn.addEventListener('click',()=>{currentChallengeLevel=btn.dataset.level;challengeIndex=0;document.querySelectorAll('.difficulty-btn').forEach(x=>x.classList.toggle('active',x===btn));renderChallenge();}));
  $('revealDecode')?.addEventListener('click',()=>{$('decodeAnswer').hidden=false;$('revealDecode').hidden=true;});$('nextChallenge')?.addEventListener('click',()=>{challengeIndex=(challengeIndex+1)%challenges[currentChallengeLevel].length;renderChallenge();});renderChallenge();

  // direction
  document.querySelectorAll('.dir-btn').forEach(btn=>btn.addEventListener('click',()=>{document.querySelectorAll('.dir-btn').forEach(x=>x.classList.toggle('active',x===btn));$('directionDemo').classList.toggle('rtl',btn.dataset.dir==='rtl');$('directionText').textContent=btn.dataset.dir==='rtl'?'Right-to-left is a common direction in Egyptian inscriptions. The signs face toward the beginning of the line, which helps readers identify the starting side.':'Left-to-right is also possible. Egyptian inscriptions could be arranged in different directions, so figure orientation and context matter.';}));

  // facts
  let factIndex=0;$('nextFact')?.addEventListener('click',()=>{factIndex=(factIndex+1)%facts.length;$('factText').textContent=facts[factIndex];});

  // quiz
  function renderQuiz(){const q=quiz[quizIndex];answered=false;$('quizCount').textContent=`QUESTION ${String(quizIndex+1).padStart(2,'0')} / 05`;$('quizProgressLabel').textContent=`${score} correct`;$('quizQuestion').textContent=q.q;$('quizFeedback').textContent='';$('nextQuiz').disabled=true;$('nextQuiz').textContent=quizIndex===quiz.length-1?'See your result →':'Next question →';$('quizOptions').innerHTML=q.a.map((x,i)=>`<button class="quiz-option" data-i="${i}">${x}</button>`).join('');$('quizOptions').querySelectorAll('button').forEach(btn=>btn.addEventListener('click',()=>answerQuiz(Number(btn.dataset.i))));}
  function answerQuiz(i){if(answered)return;answered=true;const q=quiz[quizIndex];const opts=[...$('quizOptions').children];opts.forEach((o,n)=>{o.disabled=true;if(n===q.c)o.classList.add('correct');if(n===i&&i!==q.c)o.classList.add('wrong');});if(i===q.c){score++;$('quizFeedback').textContent=q.e;}else{$('quizFeedback').textContent=`Not quite. ${q.e}`;}$('quizScore').textContent=score;$('quizProgressLabel').textContent=`${score} correct`;$('nextQuiz').disabled=false;}
  $('nextQuiz')?.addEventListener('click',()=>{if(!answered)return;if(quizIndex===quiz.length-1){$('quizQuestion').textContent=`Your score: ${score} / 5`;$('quizOptions').innerHTML='<p style="color:var(--text-soft);line-height:1.7">Nice work. Revisit the explorer or try the challenges again to strengthen what you learned.</p>';$('quizFeedback').textContent='';$('nextQuiz').textContent='Try again';$('nextQuiz').disabled=false;$('nextQuiz').dataset.restart='true';}else{quizIndex++;renderQuiz();}});$('nextQuiz')?.addEventListener('click',()=>{if($('nextQuiz').dataset.restart==='true'){quizIndex=0;score=0;$('quizScore').textContent='0';delete $('nextQuiz').dataset.restart;renderQuiz();}});renderQuiz();

  // mobile navigation fallback to match existing site
  const menuBtn=$('menuBtn'), navLinks=$('navLinks');
  menuBtn?.addEventListener('click',()=>{const open=navLinks.classList.toggle('open');menuBtn.setAttribute('aria-expanded',String(open));});
  navLinks?.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{navLinks.classList.remove('open');menuBtn?.setAttribute('aria-expanded','false');}));

  // reveal-on-scroll
  if('IntersectionObserver' in window && !matchMedia('(prefers-reduced-motion: reduce)').matches){const els=document.querySelectorAll('.system-card,.inscription-grid article,.category-cards button,.fact-box,.quiz-card,.more-grid a');const io=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.style.opacity='1';e.target.style.transform='translateY(0)';io.unobserve(e.target);}}),{threshold:.1});els.forEach(el=>{el.style.opacity='0';el.style.transform='translateY(18px)';el.style.transition='opacity .65s ease, transform .65s ease';io.observe(el);});}
})();
