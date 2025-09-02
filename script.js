(() => {
  const modeEl = document.getElementById('mode');
  const startBtn = document.getElementById('start');
  const resetBtn = document.getElementById('reset');
  const choiceBtns = Array.from(document.querySelectorAll('.buttons button'));
  const totalEl = document.getElementById('total');
  const turnEl = document.getElementById('turn');
  const logEl = document.getElementById('log');

  const TARGET = 21;
  let state = { total:0, current:'Player 1', active:false, mode:'pvc-smart' };

  function log(msg, cls='sys'){
    const p = document.createElement('p');
    p.textContent = msg;
    p.className=cls;
    logEl.appendChild(p);
    logEl.scrollTop = logEl.scrollHeight;
  }

  function updateUI(){
    totalEl.textContent = state.total;
    totalEl.classList.add('pop');
    setTimeout(()=>totalEl.classList.remove('pop'),300);
    turnEl.textContent = state.current;
    choiceBtns.forEach(b=>b.disabled=!state.active || state.current==='Computer');
    resetBtn.disabled=!state.active;
    startBtn.disabled=state.active;
  }

  function switchPlayer(){
    if(state.mode==='pvp'){
      state.current = state.current==='Player 1'?'Player 2':'Player 1';
    } else {
      state.current = state.current==='You'?'Computer':'You';
    }
  }

  function checkEnd(){
    if(state.total>=TARGET){
      const loser = state.current;
      const winner = (state.mode==='pvp') ? (loser==='Player 1'?'Player 2':'Player 1') : (loser==='You'?'Computer':'You');
      log(`💥 ${loser} reached ${TARGET}. ${winner} wins!`);
      state.active=false;
      confetti({particleCount:150,spread:70,origin:{y:0.6}});
      updateUI();
      return true;
    }
    return false;
  }

  function computerMove(){
    if(!state.active) return;
    let choice = Math.floor(Math.random()*3)+1;
    if(state.mode==='pvc-smart'){
      const mod = state.total%4;
      choice = mod?4-mod:choice;
    }
    state.total += choice;
    log(`💻 Computer picks +${choice}. Total=${state.total}`,'cpu');
    if(!checkEnd()){ switchPlayer(); updateUI(); }
  }

  function playerMove(n){
    if(!state.active || state.current==='Computer') return;
    state.total+=n;
    log(`➕ ${state.current} picks +${n}. Total=${state.total}`,'me');
    if(!checkEnd()){ switchPlayer(); updateUI(); if(state.current==='Computer') setTimeout(computerMove,500); }
  }

  startBtn.addEventListener('click',()=>{
    state.total=0;
    state.mode = modeEl.value;
    state.current = (state.mode==='pvp')?'Player 1':'You';
    state.active=true;
    logEl.innerHTML='';
    log(`Game started in mode: ${state.mode}`);
    updateUI();
  });

  resetBtn.addEventListener('click',()=>{
    state.total=0;
    state.active=false;
    state.current='—';
    logEl.innerHTML='';
    updateUI();
  });

  choiceBtns.forEach(b=>b.addEventListener('click',()=>playerMove(parseInt(b.dataset.val))));

  // Keyboard shortcuts
  window.addEventListener('keydown', (e)=>{
    if(!state.active || state.current==='Computer') return;
    if(['1','2','3'].includes(e.key)) playerMove(parseInt(e.key));
  });
})();
