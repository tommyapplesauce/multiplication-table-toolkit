const TABLES = {
  1: { cycle: [1, 2, 3, 4, 5, 6, 7, 8, 9, 0], lessonName: 'The Straight Walker' },
  2: { cycle: [2, 4, 6, 8, 0], lessonName: 'The March of the Twos' },
  3: { cycle: [3, 6, 9, 2, 5, 8, 1, 4, 7, 0], lessonName: 'The Zigzag Climber' },
  4: { cycle: [4, 8, 2, 6, 0], lessonName: 'The Double-Two Jumper' },
  5: { cycle: [5, 0], lessonName: 'The High-Five Switch' },
  6: { cycle: [6, 2, 8, 4, 0], lessonName: 'The Mirror-Even March' },
  7: { cycle: [7, 4, 1, 8, 5, 2, 9, 6, 3, 0], lessonName: 'The Wild Explorer' },
  8: { cycle: [8, 6, 4, 2, 0], lessonName: 'The Backward Even March' },
  9: { cycle: [9, 8, 7, 6, 5, 4, 3, 2, 1, 0], lessonName: 'The Countdown Table' },
  10: { cycle: [0], lessonName: 'The Zero Stamp' },
};

const VIEWS = [
  {
    id: 'hallway',
    title: 'View 1 · Hallway clue',
    backgroundKey: 'view1',
    prompt: 'A name is hiding in the hallway. Count its letters first.',
    action: 'Count the letters',
  },
  {
    id: 'locker-lock',
    title: 'View 2 · Locker lock',
    backgroundKey: 'view2',
    prompt: 'The locker needs the same number of clicks as the name has letters.',
    action: 'Try the lock',
  },
  {
    id: 'locker-unlocked',
    title: 'View 3 · Lock popped open',
    backgroundKey: 'view3',
    prompt: 'Nice! The lock popped open. The ones digit loop helped the tens step up.',
    action: 'Open the locker',
  },
  {
    id: 'locker-open',
    title: 'View 4 · Locker open',
    backgroundKey: 'view4',
    prompt: 'Something is inside the locker. The pattern trail continues.',
    action: 'Look closer',
  },
  {
    id: 'trapper-closeup',
    title: 'View 5 · Trapper Keeper dials',
    backgroundKey: 'view5',
    prompt: 'Place one dial for each letter. Dial 9 is the exact middle, so we build outward from there.',
    action: 'Open the keeper',
  },
  {
    id: 'keeper-open',
    title: 'View 6 · Secret paper',
    backgroundKey: 'view6',
    prompt: 'The name appears on the paper. Now validate the pattern with groups and repeated addition.',
    action: 'Start over',
  },
];

const ASSETS = {
  backgrounds: {
    view1: ['assets/source_assets/backgrounds/view 1.png', 'assets/source_assets/backgrounds/view_1.png', 'assets/source_assets/backgrounds/View 1.png'],
    view2: ['assets/source_assets/backgrounds/view 2.png', 'assets/source_assets/backgrounds/view_2.png', 'assets/source_assets/backgrounds/View 2.png'],
    view3: ['assets/source_assets/backgrounds/view 3.png', 'assets/source_assets/backgrounds/view_3.png', 'assets/source_assets/backgrounds/View 3.png'],
    view4: ['assets/source_assets/backgrounds/view 4.png', 'assets/source_assets/backgrounds/view_4.png', 'assets/source_assets/backgrounds/View 4.png'],
    view5: ['assets/source_assets/backgrounds/view 5.png', 'assets/source_assets/backgrounds/view_5.png', 'assets/source_assets/backgrounds/View 5.png'],
    view6: ['assets/source_assets/backgrounds/view 6.png', 'assets/source_assets/backgrounds/view_6.png', 'assets/source_assets/backgrounds/View 6.png'],
  },
  lock: {
    body: ['assets/source_assets/lock/lock body.png', 'assets/source_assets/lock/lock_body.png', 'assets/source_assets/lock/body.png'],
    closed: ['assets/source_assets/lock/lock on.png', 'assets/source_assets/lock/lock_on.png', 'assets/source_assets/lock/closed.png'],
    open: ['assets/source_assets/lock/lock open.png', 'assets/source_assets/lock/lock_open.png', 'assets/source_assets/lock/open.png'],
  },
  hand: [
    'assets/source_assets/hand with paper/hand 1.png',
    'assets/source_assets/hand with paper/hand_1.png',
    'assets/source_assets/hand with paper/1.png',
  ],
  mainDial: ['assets/source_assets/dial/main dial.png', 'assets/source_assets/dial/main_dial.png', 'assets/source_assets/dial/dial.png'],
};

const state = {
  sceneIndex: 0,
  secretName: 'Milo',
  clueText: 'blue backpack\nlikes patterns\nname has 4 letters',
  selectedTable: 4,
};

export function generateRows(table, limit = 10) {
  let previousOnes = null;
  let wrapCount = 0;

  return Array.from({ length: limit }, (_, index) => {
    const multiplier = index + 1;
    const product = table * multiplier;
    const onesDigit = product % 10;
    const tensPart = Math.floor(product / 10);
    const wrapped = previousOnes !== null && onesDigit < previousOnes;

    if (wrapped) wrapCount += 1;
    previousOnes = onesDigit;

    return { multiplier, expression: `${table} × ${multiplier}`, product, onesDigit, tensPart, wrapped, wrapCount };
  });
}

export function getTableConfig(table) {
  return TABLES[table];
}

export function getChallenge(table, step) {
  const rows = generateRows(table);
  const previousRow = rows[Math.max(0, step - 2)];
  const currentRow = rows[step - 1];

  return {
    previousDigit: previousRow.onesDigit,
    expectedDigit: currentRow.onesDigit,
    expectedWrap: currentRow.wrapped,
    product: currentRow.product,
    expression: currentRow.expression,
    multiplier: currentRow.multiplier,
  };
}

export function isCorrectPrediction(table, step, chosenDigit, chosenWrap) {
  const challenge = getChallenge(table, step);
  return Number(chosenDigit) === challenge.expectedDigit && Boolean(chosenWrap) === challenge.expectedWrap;
}

export function getCleanNameLength(name) {
  return Array.from(name.replace(/[^a-z]/gi, '')).length || 1;
}

export function getDialSlots(letterCount, totalDials = 17, centerDial = 9) {
  const count = Math.max(1, Math.min(totalDials, Number(letterCount) || 1));
  const slots = [centerDial];

  for (let offset = 1; slots.length < count; offset += 1) {
    const left = centerDial - offset;
    const right = centerDial + offset;
    if (left >= 1) slots.push(left);
    if (slots.length < count && right <= totalDials) slots.push(right);
  }

  return slots.sort((a, b) => a - b);
}

export function getDialImageCandidates(slot) {
  return [
    `assets/source_assets/dial/perspective/${slot}/dial.png`,
    `assets/source_assets/dial/perspective/${slot}/Dial ${slot}.png`,
    `assets/source_assets/dial/perspective/dial ${slot}.png`,
    `assets/source_assets/dial/perspective/${slot}.png`,
  ];
}

function byId(id) {
  return document.getElementById(id);
}

function setImageFromCandidates(element, candidates) {
  const sources = [...candidates];
  const tryNext = () => {
    const next = sources.shift();
    if (!next) {
      element.removeAttribute('src');
      element.dataset.assetMissing = 'true';
      return;
    }
    element.dataset.assetMissing = 'false';
    element.src = encodeURI(next);
  };
  element.onerror = tryNext;
  tryNext();
}

function getCurrentView() {
  return VIEWS[state.sceneIndex];
}

function getActiveTable() {
  return Math.max(1, Math.min(10, getCleanNameLength(state.secretName)));
}

function renderAssetImages() {
  const view = getCurrentView();
  const background = byId('sceneBackground');
  const candidates = ASSETS.backgrounds[view.backgroundKey];
  setImageFromCandidates(background, candidates);

  setImageFromCandidates(byId('lockBody'), ASSETS.lock.body);
  setImageFromCandidates(byId('lockShackle'), view.id === 'locker-unlocked' || view.id === 'locker-open' ? ASSETS.lock.open : ASSETS.lock.closed);
  setImageFromCandidates(byId('handPaper'), ASSETS.hand);
}

function renderSceneText() {
  const view = getCurrentView();
  const letterCount = getCleanNameLength(state.secretName);
  state.selectedTable = getActiveTable();

  byId('sceneTitle').textContent = view.title;
  byId('speechText').textContent = view.prompt;
  byId('nameCount').textContent = `${letterCount} letters`;
  byId('sceneAction').textContent = view.action;
  byId('secretNameDisplay').textContent = state.secretName.toUpperCase();
  byId('paperClues').textContent = state.clueText;
}

function renderSceneState() {
  const view = getCurrentView();
  const stage = byId('stage');
  stage.dataset.view = view.id;
  stage.classList.remove('paper-pop');
  if (view.id === 'hallway' || view.id === 'keeper-open') {
    window.requestAnimationFrame(() => stage.classList.add('paper-pop'));
  }

  document.querySelectorAll('.scene-dot').forEach((dot, index) => {
    dot.setAttribute('aria-current', String(index === state.sceneIndex));
  });
}

function renderDials() {
  const tray = byId('dialTray');
  const letterCount = getCleanNameLength(state.secretName);
  const slots = getDialSlots(letterCount);
  tray.innerHTML = '';
  tray.style.setProperty('--dial-count', slots.length);

  slots.forEach((slot, index) => {
    const dial = document.createElement('img');
    dial.className = 'keeper-dial';
    dial.alt = `Trapper Keeper dial ${slot} for letter ${index + 1}`;
    dial.style.setProperty('--slot', slot);
    dial.style.setProperty('--letter-index', index + 1);
    setImageFromCandidates(dial, getDialImageCandidates(slot));
    tray.append(dial);
  });
}

function renderPatternPanel() {
  const table = getActiveTable();
  const rows = generateRows(table, 10);
  const config = getTableConfig(table);

  byId('activeTable').textContent = `${table}s`;
  byId('lessonName').textContent = config.lessonName;
  byId('cycleDigits').textContent = config.cycle.join(' · ');
  byId('patternRule').textContent = `The name has ${table} letter${table === 1 ? '' : 's'}, so this lock practices the ${table}s. When the ones digit loops back down, the tens digit steps up.`;

  const rowList = byId('expandedRows');
  rowList.innerHTML = '';
  rows.forEach((row) => {
    const item = document.createElement('li');
    item.className = row.wrapped ? 'expanded-row expanded-row--wrap' : 'expanded-row';
    item.innerHTML = `<span>${row.expression}</span><strong>${String(row.product).padStart(2, '0')}</strong><em>${row.wrapped ? 'wrap!' : 'march'}</em>`;
    rowList.append(item);
  });
}

function renderStepper() {
  const steps = byId('sceneDots');
  steps.innerHTML = '';
  VIEWS.forEach((view, index) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'scene-dot';
    button.textContent = index + 1;
    button.setAttribute('aria-label', view.title);
    button.addEventListener('click', () => {
      state.sceneIndex = index;
      renderApp();
    });
    steps.append(button);
  });
}

function bindControls() {
  byId('secretName').addEventListener('input', (event) => {
    state.secretName = event.target.value || 'A';
    state.clueText = `blue backpack\nlikes patterns\nname has ${getCleanNameLength(state.secretName)} letters`;
    renderApp();
  });

  byId('clueText').addEventListener('input', (event) => {
    state.clueText = event.target.value;
    renderApp();
  });

  byId('sceneAction').addEventListener('click', () => {
    state.sceneIndex = state.sceneIndex >= VIEWS.length - 1 ? 0 : state.sceneIndex + 1;
    renderApp();
  });

  byId('previousScene').addEventListener('click', () => {
    state.sceneIndex = state.sceneIndex <= 0 ? VIEWS.length - 1 : state.sceneIndex - 1;
    renderApp();
  });
}

function renderApp() {
  renderSceneText();
  renderSceneState();
  renderAssetImages();
  renderDials();
  renderPatternPanel();
}

if (typeof document !== 'undefined') {
  renderStepper();
  bindControls();
  byId('secretName').value = state.secretName;
  byId('clueText').value = state.clueText;
  renderApp();
}
