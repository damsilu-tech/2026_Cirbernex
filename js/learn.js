const menuBtn=document.getElementById('menuBtn'), navLinks=document.getElementById('navLinks');
  if(menuBtn&&navLinks){menuBtn.addEventListener('click',()=>{const open=navLinks.classList.toggle('open');menuBtn.setAttribute('aria-expanded',String(open));menuBtn.textContent=open?'✕':'☰';});navLinks.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{navLinks.classList.remove('open');menuBtn.setAttribute('aria-expanded','false');menuBtn.textContent='☰';}));}

(() => {
  const stepData = [
    {kicker:'THE NILE',heading:'A river that made civilization possible.',text:'The Nile provided water, fertile soil and a reliable route through the landscape. Its rhythms shaped farming, settlement and trade—and helped connect communities into one civilization.',symbol:'𓈗'},
    {kicker:'THE PHARAOH',heading:'A ruler at the centre of order.',text:'The pharaoh was both a political ruler and a powerful religious symbol. Royal authority helped organize the state, while monuments made that authority visible.',symbol:'♕'},
    {kicker:'RELIGION',heading:'Gods were part of everyday life.',text:'Egyptian religion included many gods and local traditions. Rituals, temples and offerings connected people with divine powers and ideas about order, protection and renewal.',symbol:'𓂀'},
    {kicker:'WRITING',heading:'Ideas could be made visible.',text:'Egyptian writing used signs in different ways: some represented sounds, while others conveyed words or ideas. Scribes used writing to record administration, stories, rituals and more.',symbol:'𓂋'},
    {kicker:'MONUMENTS',heading:'Architecture made memory last.',text:'Temples and tombs were more than impressive buildings. Their spaces, images and inscriptions supported ritual and helped preserve the memory and status of kings and gods.',symbol:'𓉢'},
    {kicker:'AFTERLIFE',heading:'Life was imagined as a journey beyond death.',text:'Ancient Egyptians developed rich ideas about the afterlife. Burial practices, texts and objects were connected to hopes for protection, renewal and continued existence.',symbol:'𓋹'}
  ];
  const steps = [...document.querySelectorAll('.five-step')];
  const number = document.getElementById('fiveNumber');
  const symbol = document.getElementById('fiveSymbol');
  const kicker = document.getElementById('fiveKicker');
  const heading = document.getElementById('fiveHeading');
  const text = document.getElementById('fiveText');
  const progress = document.getElementById('fiveProgress');
  function showStep(i){
    const d=stepData[i];
    steps.forEach((el,n)=>{el.classList.toggle('active',n===i);el.setAttribute('aria-selected',String(n===i));});
    number.textContent=String(i+1).padStart(2,'0'); symbol.textContent=d.symbol; kicker.textContent=d.kicker; heading.textContent=d.heading; text.textContent=d.text; progress.style.width=`${((i+1)/stepData.length)*100}%`;
  }
  steps.forEach((step,i)=>step.addEventListener('click',()=>showStep(i)));

  document.querySelectorAll('.lesson-card').forEach(card=>card.addEventListener('click',()=>{
    const open=card.classList.toggle('open'); card.setAttribute('aria-expanded',String(open));
    const cta=card.querySelector('.lesson-cta'); if(cta) cta.textContent=open?'Tap to close −':'Tap to reveal +';
  }));

  const quizData=[
    {q:'Why was the Nile important to ancient Egypt?',a:['Only for transportation','Only for religion','For farming, transport and life','Mainly for building pyramids'],correct:2},
    {q:'What could hieroglyphic signs represent?',a:['Only pictures','Sounds, words and ideas','Only numbers','Only names of kings'],correct:1},
    {q:'What is one reason monumental tombs mattered?',a:['They were marketplaces','They supported burial and royal memory','They were only houses','They were used as ships'],correct:1},
    {q:'What did the concept of maat represent?',a:['A royal crown','Order, balance and justice','A type of pyramid','A writing system'],correct:1},
    {q:'Which of these was a major purpose of royal pyramids?',a:['Markets','Royal funerary complexes','Military barracks','Libraries'],correct:1}
  ];
  let qi=0,score=0,answered=false;
  const qEl=document.getElementById('quizQuestion'), options=[...document.querySelectorAll('.quiz-options button')], feedback=document.getElementById('quizFeedback'), next=document.getElementById('quizNext'), scoreEl=document.getElementById('quizScore');
  function loadQuiz(){
    const q=quizData[qi]; qEl.textContent=q.q; options.forEach((b,i)=>{b.textContent=q.a[i];b.dataset.correct=String(i===q.correct);b.disabled=false;b.classList.remove('correct','wrong')});feedback.textContent='';next.hidden=true;answered=false;scoreEl.textContent=`${score} correct`;
    const label=document.querySelector('.quiz-top span'); if(label) label.textContent=`QUESTION ${String(qi+1).padStart(2,'0')} / ${quizData.length}`;
  }
  options.forEach(btn=>btn.addEventListener('click',()=>{
    if(answered)return; answered=true; options.forEach(b=>b.disabled=true); const ok=btn.dataset.correct==='true'; btn.classList.add(ok?'correct':'wrong'); if(ok){score++;feedback.textContent='Correct. You connected the idea to the wider story.'}else{feedback.textContent='Not quite. The museum is about connections—try the next one.'} scoreEl.textContent=`${score} correct`; next.hidden=false;
  }));
  next.addEventListener('click',()=>{qi=(qi+1)%quizData.length;loadQuiz()});

  /* ---- Decode a Hieroglyph ---- */
  const HIERO_DECODE = {
    A:{sign:'𓄿',name:'Egyptian vulture',sound:'a'},
    B:{sign:'𓃀',name:'Leg',sound:'b'},
    C:{sign:'𓎡',name:'Basket (approximate)',sound:'k / s'},
    D:{sign:'𓂧',name:'Hand',sound:'d'},
    F:{sign:'𓆑',name:'Horned viper',sound:'f'},
    H:{sign:'𓉔',name:'Reed shelter',sound:'h'},
    I:{sign:'𓇋',name:'Reed leaf',sound:'i'},
    K:{sign:'𓎡',name:'Basket',sound:'k'},
    M:{sign:'𓅓',name:'Owl',sound:'m'},
    N:{sign:'𓈖',name:'Water ripple',sound:'n'},
    R:{sign:'𓂋',name:'Mouth',sound:'r'},
    S:{sign:'𓋴',name:'Folded cloth',sound:'s'},
    T:{sign:'𓏏',name:'Bread loaf',sound:'t'}
  };
  const decodeLetters=document.getElementById('decodeLetters');
  const decodeSign=document.querySelector('.decode-sign');
  const decodeLetterEl=document.getElementById('decodeLetter');
  const decodeNameEl=document.getElementById('decodeName');
  const decodeSoundEl=document.getElementById('decodeSound');
  if(decodeLetters){
    decodeLetters.addEventListener('click',(e)=>{
      const btn=e.target.closest('button');
      if(!btn)return;
      const letter=btn.dataset.letter;
      const d=HIERO_DECODE[letter];
      if(!d)return;
      decodeLetters.querySelectorAll('button').forEach(b=>b.classList.toggle('active',b===btn));
      decodeSign.textContent=d.sign;
      decodeLetterEl.textContent=letter;
      decodeNameEl.textContent=d.name;
      decodeSoundEl.textContent=`Sound represented: "${d.sound}"`;
    });
  }

  /* ---- Write Your Name ---- */
  const NAME_SIGNS = Object.fromEntries(Object.entries(HIERO_DECODE).map(([k,v])=>[k,v.sign]));
  NAME_SIGNS.E='𓇌'; NAME_SIGNS.G='𓎼'; NAME_SIGNS.J='𓆓'; NAME_SIGNS.L='𓃭';
  NAME_SIGNS.O='𓅱'; NAME_SIGNS.P='𓊪'; NAME_SIGNS.Q='𓎡'; NAME_SIGNS.U='𓅱';
  NAME_SIGNS.V='𓆑'; NAME_SIGNS.W='𓅱'; NAME_SIGNS.X='𓎡𓋴'; NAME_SIGNS.Y='𓇌'; NAME_SIGNS.Z='𓊃';
  const nameInput=document.getElementById('nameInput');
  const nameWriteBtn=document.getElementById('nameWriteBtn');
  const nameOutput=document.getElementById('nameOutput');
  if(nameWriteBtn){
    const writeName=()=>{
      const raw=(nameInput.value||'').toUpperCase().replace(/[^A-Z]/g,'');
      if(!raw){nameOutput.textContent='';return;}
      nameOutput.textContent=[...raw].map(ch=>NAME_SIGNS[ch]||'').join(' ');
    };
    nameWriteBtn.addEventListener('click',writeName);
    nameInput.addEventListener('keydown',(e)=>{if(e.key==='Enter')writeName();});
  }

  /* ---- A Day in Ancient Egypt: role picker ---- */
  const ROLE_DAYS = {
    farmer:{early:'The Nile begins another day. Fields wait beyond the riverbank.',morning:'A farmer heads out to work the flood-fed soil — sowing, tending or harvesting depending on the season.',midday:'Bread, beer and simple food break the day, often shared with fellow workers.',afternoon:'Work continues in the fields, tending animals or maintaining irrigation channels.',evening:'Families gather to share a meal as the working day gives way to rest.'},
    scribe:{early:'Ink, reed pens and papyrus are prepared before the day\'s work begins.',morning:'A scribe records administrative details, letters or religious texts for officials or temples.',midday:'A short break for food, often near the workplace rather than at home.',afternoon:'More writing and copying — training, record-keeping, or preparing documents.',evening:'The scribe returns home, a respected and literate member of the community.'},
    artisan:{early:'Tools and materials are laid out at the workshop.',morning:'Craftsmanship begins — shaping stone, wood, metal or faience into objects and decoration.',midday:'A meal shared with fellow artisans working on the same commission.',afternoon:'Detailed work continues, often on pieces destined for tombs, temples or officials.',evening:'The day\'s work is set aside, to continue again tomorrow.'},
    fisher:{early:'Boats are prepared before sunrise, when the water is calm.',morning:'Nets and lines are cast along the Nile, a vital source of food and income.',midday:'The catch is sorted; some kept for the household, some for trade.',afternoon:'Boats return, and fish may be dried or salted for storage.',evening:'A meal from the day\'s catch is shared with family.'},
    priest:{early:'Ritual purification begins the day within the temple precinct.',morning:'Offerings and rituals are performed before the image of the god, maintaining the temple\'s daily rhythm.',midday:'Temple administration continues — the temple was also an economic institution.',afternoon:'Further rituals, festival preparations, or teaching may fill the afternoon.',evening:'The sanctuary is sealed for the night, its rites complete until dawn.'},
    builder:{early:'Work gangs gather at the site as the sun rises.',morning:'Stone is moved, shaped and set in place under the direction of overseers.',midday:'A meal and rest, essential on demanding construction projects.',afternoon:'Work continues on temples, tombs or monuments, coordinated across many workers.',evening:'Tools are set down as the organised workday comes to a close.'}
  };
  const rolePicker=document.getElementById('rolePicker');
  const roleFields={early:'roleMorningEarly',morning:'roleMorning',midday:'roleMidday',afternoon:'roleAfternoon',evening:'roleEvening'};
  function showRole(role){
    const d=ROLE_DAYS[role]; if(!d)return;
    Object.entries(roleFields).forEach(([key,id])=>{
      const el=document.getElementById(id); if(el) el.textContent=d[key];
    });
    if(rolePicker) rolePicker.querySelectorAll('.role-btn').forEach(b=>b.classList.toggle('active', b.dataset.role===role));
  }
  if(rolePicker){
    rolePicker.addEventListener('click',(e)=>{
      const btn=e.target.closest('.role-btn');
      if(!btn)return;
      showRole(btn.dataset.role);
    });
  }

  const progressBar=document.getElementById('progressBar'), progressPercent=document.getElementById('progressPercent'), continueBtn=document.getElementById('continueBtn');
  const stored=Number(localStorage.getItem('egyptLearnProgress')||0); let current=Math.max(0,Math.min(100,stored));
  function renderProgress(){progressBar.style.width=`${current}%`;progressPercent.textContent=`${current}%`;document.querySelectorAll('.progress-items i').forEach(el=>{el.style.setProperty('--p',el.dataset.progress)})}
  continueBtn.addEventListener('click',()=>{current=Math.min(100,current+20);localStorage.setItem('egyptLearnProgress',String(current));renderProgress();continueBtn.textContent=current>=100?'Journey complete ✓':'Progress saved ✓';setTimeout(()=>continueBtn.textContent=current>=100?'Journey complete ✓':'Continue Learning',1300)});
  renderProgress();loadQuiz();
})();