/* Pink Journey · application logic */
(() => {
  'use strict';
  const { acts: A, myth, choice, tf, seed } = window.PJ;
  const $ = (s) => document.querySelector(s);

const KEY = 'pinkJourney.v1';
const CATS = ['Play', 'Learn', 'Share'];

const blank = () => ({
  started: false,
  done: {},
  best: {},
  answers: {},
  wall: [],
  ach: []
});

// Reset progress whenever the page loads
localStorage.removeItem(KEY);
let S = blank();

const save = () => {
  try {
    localStorage.setItem(KEY, JSON.stringify(S));
  } catch {}
};

  const esc = (t) => t.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const act = (id) => A.find((a) => a.id === id);
  const total = () => Object.values(S.best).reduce((a, b) => a + b, 0);
  const catDone = (c) => A.some((a) => a.cat === c && S.done[a.id]);
  const nDone = () => CATS.filter(catDone).length;
  const STATUS = ['Pick an activity to begin', 'Journey in progress', 'Journey completed', 'Perfect Journey'];
  let stop = () => {};

  /* Achievements */
  const ACH = [
    { id: 'first', name: 'First Step', desc: 'Start the journey', ok: () => S.started },
    { id: 'game', name: 'Game On', desc: 'Finish a game', ok: () => catDone('Play') },
    { id: 'aware', name: 'Awareness', desc: 'Finish a quiz', ok: () => catDone('Learn') },
    { id: 'kind', name: 'Kind Words', desc: 'Post a message', ok: () => S.wall.length > 0 },
    { id: 'champ', name: 'Pink Champion', desc: 'Reach 150 points', ok: () => total() >= 150 },
    { id: 'perfect', name: 'Perfect Journey', desc: 'Play + Learn + Share', ok: () => nDone() === 3 }
  ];
  let toastTimer;
  function toast(msg) {
    const t = $('#toast');
    t.textContent = msg; t.classList.add('on');
    clearTimeout(toastTimer); toastTimer = setTimeout(() => t.classList.remove('on'), 2600);
  }
  function check() {
    ACH.forEach((a) => {
      if (!S.ach.includes(a.id) && a.ok()) { S.ach.push(a.id); toast('🏆 ' + a.name + ' unlocked'); }
    });
    save();
    $('#pts').textContent = '★ ' + total() + ' pts';
  }

  /*  Navigation */
  function show(id) {
    stop(); stop = () => {};
    document.querySelectorAll('.screen').forEach((s) => s.classList.toggle('on', s.id === id));
    document.body.className = ['welcome', 'about'].includes(id) ? 'light' : 'dark';
    document.querySelectorAll('nav button').forEach((b) => b.classList.toggle('on', b.dataset.go === id));
    ({ journey: renderJourney, final: renderFinal }[id] || (() => {}))();
    window.scrollTo(0, 0);
  }

  function renderJourney() {
    const n = nDone();
    $('#segs').innerHTML = CATS.map((_, i) => `<i class="${i < n ? 'on' : ''}"></i>`).join('');
    $('#status').textContent = `${n} / 3 · ${STATUS[n]}`;
    $('#results').hidden = n < 2;
    $('#map').innerHTML = CATS.map((c) => `
      <section class="cat" data-cat="${c}">
        <h3>${c} <span class="tag ${catDone(c) ? 'on' : ''}">${catDone(c) ? '✓ done' : 'to do'}</span></h3>
        <div class="cards">${A.filter((a) => a.cat === c).map((a) => `
          <button class="card ${S.done[a.id] ? 'done' : ''}" data-act="open" data-id="${a.id}">
            <span class="ic" aria-hidden="true">${a.icon}</span><b>${a.title}</b><small>${a.desc}</small>
            <em>${S.done[a.id] ? `✓ ${S.best[a.id]} / ${a.max} pts` : `up to ${a.max} pts`}</em>
          </button>`).join('')}
        </div>
      </section>`).join('');
  }

  function renderFinal() {
    const n = nDone(), done = Object.keys(S.done).length;
    $('#ftitle').textContent = n === 3 ? 'Perfect Journey!' : n === 2 ? 'Journey completed!' : 'Keep going!';
    $('#fstatus').textContent = n < 2 ? 'Finish 2 of 3 categories to complete your journey.' : 'You completed the Pink Journey. Thank you for making your mark.';
    $('#stats').innerHTML = `<div><b>${done}</b>Activities</div><div><b>${total()}</b>Total points</div><div><b>${S.wall.length}</b>New messages</div>`;
    $('#ach').innerHTML = ACH.map((a) => { const on = S.ach.includes(a.id);
      return `<li class="${on ? 'on' : ''}"><b>${on ? '🏆' : '🔒'} ${a.name}</b><small>${a.desc}</small></li>`; }).join('');
  }

  function open(id) {
    show('play');
    const a = act(id);
    $('#atitle').textContent = a.icon + ' ' + a.title;
    $('#adesc').textContent = a.desc;
    const b = $('#body'); b.innerHTML = '';
    ({ catch: gCatch, memory: gMemory, reaction: gReaction, wall: gWall,
       myth: (el) => quiz(el, 'myth', myth), choice: (el) => quiz(el, 'choice', choice), tf: (el) => quiz(el, 'tf', tf) })[id](b);
  }

  function finish(id, pts, note = '') {
    S.best[id] = Math.max(S.best[id] || 0, pts); S.done[id] = true; check();
    $('#body').innerHTML = `<div class="result"><svg class="rib" viewBox="0 0 100 140" aria-hidden="true"><use href="#ribbon"/></svg>
      <h3>Activity complete!</h3><p class="big">+${pts} Pink Points</p><p>${note}</p>
      <p class="muted">Best: ${S.best[id]} / ${act(id).max}. Continue your journey.</p>
      <div class="row c"><button class="btn" data-act="open" data-id="${id}">Play again</button><button class="btn pri" data-go="journey">Back to journey</button></div></div>`;
  }

  /* Games */
  function gCatch(b) {
    b.innerHTML = `<div class="hud"><span>Score <b id="sc">0</b></span><span>Time <b id="tm">30</b>s</span></div>
      <div class="arena" id="ar"><button class="btn pri" id="go">Start (30 s)</button></div>`;
    $('#go').onclick = () => {
      const ar = $('#ar'); ar.innerHTML = '';
      const kinds = [['🎀', 2, 'Ribbon'], ['💗', 1, 'Heart'], ['🌸', 3, 'Flower'], ['✖', -2, 'Distractor']];
      let sc = 0, t = 30;
      const spawn = setInterval(() => {
        const [g, p, name] = kinds[Math.random() < 0.25 ? 3 : Math.floor(Math.random() * 3)];
        const el = document.createElement('button');
        el.className = 'tok' + (p < 0 ? ' x' : ''); el.textContent = g; el.setAttribute('aria-label', `${name} ${p > 0 ? '+' : ''}${p}`);
        el.style.left = Math.random() * 88 + '%'; el.style.top = Math.random() * 82 + '%';
        el.onclick = () => {
          sc = Math.max(0, sc + p); $('#sc').textContent = sc;
          el.className = 'tok out' + (p < 0 ? ' neg' : ''); el.textContent = (p > 0 ? '+' : '') + p; el.disabled = true;
          setTimeout(() => el.remove(), 400);
        };
        ar.append(el); setTimeout(() => el.remove(), 1500);
      }, 550);
      const clock = setInterval(() => {
        $('#tm').textContent = --t;
        if (t > 0) return;
        stop();
        const pts = Math.min(100, sc);
        finish('catch', pts, `${pts >= 60 ? 'Pink champion!' : pts >= 30 ? 'Nice work!' : 'Good start. Try again!'} Score: ${sc}`);
      }, 1000);
      stop = () => { clearInterval(spawn); clearInterval(clock); };
    };
  }

  function gMemory(b) {
    const sym = ['🎀', '💗', '🌸', '⭐', '🦋', '🌷'];
    const deck = [...sym, ...sym].sort(() => Math.random() - 0.5);
    let open = [], moves = 0, pairs = 0, lock = false, secs = 0, clock = null;
    b.innerHTML = `<div class="hud"><span>Moves <b id="mv">0</b></span><span>Pairs <b id="pr">0/6</b></span><span>Time <b id="tt">0</b>s</span></div>
      <div class="grid mem">${deck.map((_, i) => `<button class="mc" data-i="${i}" aria-label="Hidden card">?</button>`).join('')}</div>`;
    stop = () => clearInterval(clock);
    b.querySelectorAll('.mc').forEach((c) => c.onclick = () => {
      if (lock || c.classList.contains('up') || c.classList.contains('ok')) return;
      if (!clock) clock = setInterval(() => { $('#tt').textContent = ++secs; }, 1000);
      c.classList.add('up'); c.textContent = deck[c.dataset.i]; c.setAttribute('aria-label', 'Card ' + deck[c.dataset.i]);
      open.push(c);
      if (open.length < 2) return;
      $('#mv').textContent = ++moves;
      const [x, y] = open; open = [];
      if (x.textContent === y.textContent) {
        x.classList.add('ok'); y.classList.add('ok'); $('#pr').textContent = ++pairs + '/6';
        if (pairs === 6) { stop(); setTimeout(() => finish('memory', Math.max(10, 50 - (moves - 6) * 3), `${moves} moves · ${secs} s`), 600); }
      } else {
        lock = true;
        setTimeout(() => { [x, y].forEach((k) => { k.classList.remove('up'); k.textContent = '?'; k.setAttribute('aria-label', 'Hidden card'); }); lock = false; }, 700);
      }
    });
  }

  function gReaction(b) {
    b.innerHTML = '<button class="orb" id="orb">Tap to begin</button>';
    const o = $('#orb'); let st = 'idle', timer, t0;
    stop = () => clearTimeout(timer);
    o.onclick = () => {
      if (st === 'idle') {
        st = 'wait'; o.className = 'orb'; o.textContent = 'Wait for Pink…';
        timer = setTimeout(() => { st = 'go'; o.classList.add('go'); o.textContent = 'Click now!'; t0 = performance.now(); }, 1500 + Math.random() * 2500);
      } else if (st === 'wait') {
        clearTimeout(timer); st = 'idle'; o.textContent = 'Too soon! Tap to retry';
      } else if (st === 'go') {
        const ms = Math.round(performance.now() - t0); st = 'end';
        finish('reaction', ms < 300 ? 50 : ms < 450 ? 40 : ms < 600 ? 30 : 20, `Your reaction time: ${ms} ms`);
      }
    };
  }

  /* Quizzes (myth / choice / true-false) */
  function quiz(b, id, list) {
    let i = 0, ok = 0; S.answers[id] = [];
    const render = () => {
      const it = list[i];
      const opts = id === 'choice' ? it.o : id === 'myth' ? ['Myth', 'Fact'] : ['True', 'False'];
      const right = id === 'choice' ? it.c : (id === 'myth' ? (it.a ? 1 : 0) : (it.a ? 0 : 1));
      b.innerHTML = `<div class="qh"><span>${i + 1} / ${list.length}</span><span>${ok * 10} pts</span></div>
        <p class="q">${it.q}</p>
        <div class="opts ${id}">${opts.map((o, k) => `<button class="opt" data-k="${k}">${id === 'choice' ? 'ABCD'[k] + '. ' : ''}${o}</button>`).join('')}</div>
        <div id="fb" aria-live="polite"></div>`;
      b.querySelectorAll('.opt').forEach((btn) => btn.onclick = () => {
        const k = +btn.dataset.k, good = k === right;
        if (good) ok++;
        S.answers[id].push(k); save();
        b.querySelectorAll('.opt').forEach((x) => { x.disabled = true; if (+x.dataset.k === right) x.classList.add('ok'); });
        if (!good) btn.classList.add('bad');
        const last = i === list.length - 1;
        $('#fb').innerHTML = `<p class="fb ${good ? 'ok' : 'bad'}"><b>${good ? '✓ Correct!' : '✗ Not quite.'}</b> ${it.e}</p>
          <button class="btn pri" id="nx">${last ? 'See result' : 'Next'}</button>`;
        $('#nx').focus();
        $('#nx').onclick = () => { if (last) finish(id, ok * 10, `${ok} / ${list.length} correct`); else { i++; render(); } };
      });
    };
    render();
  }

  /* Pink Wall */
  function gWall(b) {
    const draw = () => {
      $('#notes').innerHTML = [...seed.map((t) => ({ t })), ...S.wall].map((m, i) =>
        `<p class="note" style="--r:${(i * 37 % 9) - 4}deg">${esc(m.t)} 💗</p>`).join('');
    };
    b.innerHTML = `<div class="wallbox" id="notes"></div>
      <div class="compose"><label class="sr" for="msg">Your message</label>
      <input id="msg" maxlength="80" placeholder="Write something kind…" autocomplete="off"><button class="btn pri" id="send">Post</button></div>
      <p class="err" id="err" role="alert"></p>`;
    draw();
    const send = () => {
      const v = $('#msg').value.trim();
      if (!v) { $('#err').textContent = 'Write a message first.'; return; }
      $('#err').textContent = '';
      const first = !S.done.wall;
      S.wall.push({ t: v }); S.best.wall = 20; S.done.wall = true;
      $('#msg').value = ''; draw(); check();
      if (first) toast('+20 Pink Points');
    };
    $('#send').onclick = send;
    $('#msg').onkeydown = (e) => { if (e.key === 'Enter') send(); };
  }

  /*  Global events  */
  document.addEventListener('click', (e) => {
    const t = e.target.closest('[data-go],[data-act]');
    if (!t) return;
    if (t.dataset.go) return show(t.dataset.go);
    const a = t.dataset.act;
    if (a === 'start') { S.started = true; check(); show('journey'); }
    else if (a === 'how') $('#how').showModal();
    else if (a === 'open') open(t.dataset.id);
    else if (a === 'reset' && confirm('Restart your journey? Scores and messages will be erased.')) {
      S = blank(); save(); check(); show('welcome');
    }
  });
  $('#share').onclick = async () => {
    const text = `I earned ${total()} Pink Points on Pink Journey! Play. Learn. Share. #OctobreRose`;
    try {
      if (navigator.share) await navigator.share({ title: 'Pink Journey', text });
      else { await navigator.clipboard.writeText(text); toast('Copied to clipboard'); }
    } catch { /* cancelled */ }
  };
  
/* ABOUT SECTION INTERACTION*/

const aboutToggle = document.getElementById("aboutToggle");
const aboutMore = document.getElementById("aboutMore");
const aboutArrow = document.getElementById("aboutArrow");

if (aboutToggle && aboutMore && aboutArrow) {
  aboutToggle.addEventListener("click", () => {
    const isExpanded =
      aboutToggle.getAttribute("aria-expanded") === "true";

    aboutToggle.setAttribute("aria-expanded", String(!isExpanded));
    aboutMore.hidden = isExpanded;

    aboutToggle.firstChild.textContent = isExpanded
      ? "Discover Our Mission "
      : "Close Our Mission ";

    aboutArrow.textContent = isExpanded ? "↗" : "↙";
  });
}


  check();
  show('welcome');
  
})();