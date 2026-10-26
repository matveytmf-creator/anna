(() => {
  const steps = [
    { chapter: '1 / 3', symbol: 'heart', title: 'Первое совпадение', copy: 'Наш шифр', answers: ['Не Вьетнам', 'Спидозная иголка', 'Азбука морзе'], correct: 0, response: 'Тихо, тихо' },
    { chapter: '2 / 3', symbol: 'messages-square', title: 'Наш маленький язык', copy: 'Что делает наши моменты по-настоящему нашими?', answers: ['Богдан', 'Свои шутки и взгляды, понятные без слов', 'Ничего'], correct: 1, response: 'Именно. Самое ценное часто понимаем только мы двое.' },
    { chapter: '3 / 3', symbol: 'stars', title: 'Самое важное впереди', copy: 'Что я больше всего хочу собирать дальше?', answers: ['Общие воспоминания и новые истории', 'Данные школьников', 'Круглые камушки'], correct: 0, response: 'Вот и добрались до главного. У меня для тебя вопрос…' }
  ];
  const $ = id => document.getElementById(id);
  const card = $('quest-card'), invitation = $('invitation-card');
  const stepEl = $('quest-step'), symbolEl = $('quest-symbol'), titleEl = $('quest-title'), copyEl = $('quest-copy');
  const optionsEl = $('quest-options'), feedbackEl = $('quest-feedback'), progress = $('quest-progress-fill');
  let index = 0, locked = false;
  const vibrate = pattern => { try { navigator.vibrate?.(pattern); } catch (_) {} };
  function render() {
    const s = steps[index];
    stepEl.textContent = s.chapter; symbolEl.innerHTML = `<i data-lucide="${s.symbol}" aria-hidden="true"></i>`; titleEl.textContent = s.title; copyEl.textContent = s.copy;
    if (window.lucide?.createIcons) window.lucide.createIcons({ attrs: { 'stroke-width': 1.5 } });
    feedbackEl.textContent = ''; optionsEl.innerHTML = '';
    progress.style.width = `${(index / steps.length) * 100}%`;
    s.answers.forEach((answer, i) => {
      const btn = document.createElement('button'); btn.type = 'button'; btn.textContent = answer;
      btn.addEventListener('click', () => choose(i)); optionsEl.appendChild(btn);
    });
  }
  function choose(choice) {
    if (locked) return;
    locked = true;
    const s = steps[index];
    const right = choice === s.correct;
    feedbackEl.textContent = right ? s.response : 'Не страшно, здесь нет неправильной версии нашей истории. Попробуй ещё раз ♡';
    feedbackEl.classList.toggle('is-correct', right);
    vibrate(right ? [12, 25, 12] : 8);
    if (!right) { locked = false; return; }
    [...optionsEl.children].forEach(btn => { btn.disabled = true; btn.classList.add('is-muted'); });
    const next = document.createElement('button'); next.type = 'button'; next.className = 'quest-next';
    next.textContent = index === steps.length - 1 ? 'Узнать вопрос ↗' : 'Дальше →';
    next.addEventListener('click', () => {
      index++;
      if (index >= steps.length) {
        card.hidden = true; invitation.hidden = false; progress.style.width = '100%';
        invitation.classList.add('is-visible'); invitation.scrollIntoView({ behavior: 'smooth', block: 'center' });
      } else { locked = false; render(); card.classList.remove('quest-card-pop'); void card.offsetWidth; card.classList.add('quest-card-pop'); }
    });
    optionsEl.appendChild(next);
  }
  $('invite-yes')?.addEventListener('click', () => {
    $('invitation-response').textContent = 'Тогда договорились. Люблю тебя, Анютка)';
    $('invite-yes').innerHTML = 'У нас будет наш танец <i data-lucide="heart" aria-hidden="true"></i>';
    if (window.lucide?.createIcons) window.lucide.createIcons({ attrs: { 'stroke-width': 1.5 } });
    $('invite-yes').disabled = true; vibrate([30, 40, 30]);
    const field = $('confetti-field');
    if (field) { field.innerHTML = ''; for (let i=0;i<34;i++) { const p=document.createElement('i'); p.style.left=`${Math.random()*100}%`; p.style.animationDelay=`${Math.random()*1.2}s`; p.style.width = `${3 + Math.random()*4}px`; p.style.height = `${3 + Math.random()*4}px`; field.appendChild(p); } }
  });
  $('invite-later')?.addEventListener('click', () => {
    $('invitation-response').textContent = 'Конечно. Тут нет неправильных ответов. Я просто хотел, чтобы ты знала, как сильно мне этого хочется ♡';
    vibrate(8);
  });
  render();
})();