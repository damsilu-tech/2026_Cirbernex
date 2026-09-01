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
    {q:'What is one reason monumental tombs mattered?',a:['They were marketplaces','They supported burial and royal memory','They were only houses','They were used as ships'],correct:1}
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

  const progressBar=document.getElementById('progressBar'), progressPercent=document.getElementById('progressPercent'), continueBtn=document.getElementById('continueBtn');
  const stored=Number(localStorage.getItem('egyptLearnProgress')||0); let current=Math.max(0,Math.min(100,stored));
  function renderProgress(){progressBar.style.width=`${current}%`;progressPercent.textContent=`${current}%`;document.querySelectorAll('.progress-items i').forEach(el=>{el.style.setProperty('--p',el.dataset.progress)})}
  continueBtn.addEventListener('click',()=>{current=Math.min(100,current+20);localStorage.setItem('egyptLearnProgress',String(current));renderProgress();continueBtn.textContent=current>=100?'Journey complete ✓':'Progress saved ✓';setTimeout(()=>continueBtn.textContent=current>=100?'Journey complete ✓':'Continue Learning',1300)});
  renderProgress();loadQuiz();
})();
