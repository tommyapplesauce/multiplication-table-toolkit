const TABLES = {
  1: {
    cycle: [1, 2, 3, 4, 5, 6, 7, 8, 9, 0],
    lessonName: 'The Straight Walker',
    personality: 'The straight walker',
    hook: 'The 1s walk through every digit in order. Can you follow the trail?',
    validators: ['groups', 'number line'],
  },
  2: {
    cycle: [2, 4, 6, 8, 0],
    lessonName: 'The March of the Twos',
    personality: 'The even-number march',
    hook: 'What if the 2 times table is hiding inside five numbers: 24680?',
    validators: ['repeated addition', 'groups', 'number line'],
  },
  3: {
    cycle: [3, 6, 9, 2, 5, 8, 1, 4, 7, 0],
    lessonName: 'The Zigzag Climber',
    personality: 'The full ten-step digit adventure',
    hook: 'The 3s visit every digit before landing on 0. Let’s catch the zigzag!',
    validators: ['digit sums', 'repeated addition'],
  },
  4: {
    cycle: [4, 8, 2, 6, 0],
    lessonName: 'The Double-Two Jumper',
    personality: 'The faster even pattern',
    hook: 'The 4s jump like the 2s, but with bigger springy steps.',
    validators: ['groups', 'repeated addition'],
  },
  5: {
    cycle: [5, 0],
    lessonName: 'The High-Five Switch',
    personality: 'The 5 and 0 alternator',
    hook: 'The 5s switch back and forth: high five, zero, high five, zero!',
    validators: ['groups', 'counting by fives'],
  },
  6: {
    cycle: [6, 2, 8, 4, 0],
    lessonName: 'The Mirror-Even March',
    personality: 'The tricky even loop',
    hook: 'The 6s are an even march with a mirror twist. Can you spot the loop?',
    validators: ['groups', 'direct multiplication'],
  },
  7: {
    cycle: [7, 4, 1, 8, 5, 2, 9, 6, 3, 0],
    lessonName: 'The Wild Explorer',
    personality: 'The all-digit explorer',
    hook: 'The 7s feel wild because they explore every digit before returning to 0.',
    validators: ['groups', 'direct multiplication'],
  },
  8: {
    cycle: [8, 6, 4, 2, 0],
    lessonName: 'The Backward Even March',
    personality: 'The countdown even loop',
    hook: 'The 8s march backward through the even digits: 86420.',
    validators: ['groups', 'direct multiplication'],
  },
  9: {
    cycle: [9, 8, 7, 6, 5, 4, 3, 2, 1, 0],
    lessonName: 'The Countdown Table',
    personality: 'The tens-up, ones-down wow moment',
    hook: 'The 9s have a secret countdown: ones go down while tens go up.',
    validators: ['digit sums', 'number line'],
  },
  10: {
    cycle: [0],
    lessonName: 'The Zero Stamp',
    personality: 'The place-value confidence builder',
    hook: 'The 10s place a friendly zero stamp after each step.',
    validators: ['place value', 'groups'],
  },
};

const state = {
  table: 2,
  challengeStep: 1,
  chosenDigit: null,
  chosenWrap: null,
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

    if (wrapped) {
      wrapCount += 1;
    }

    previousOnes = onesDigit;

    return {
      multiplier,
      expression: `${table} × ${multiplier}`,
      product,
      onesDigit,
      tensPart,
      wrapped,
      wrapCount,
    };
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

function byId(id) {
  return document.getElementById(id);
}

function renderTablePicker() {
  const container = byId('tableButtons');
  container.innerHTML = '';

  Object.keys(TABLES).forEach((tableKey) => {
    const table = Number(tableKey);
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'table-button';
    button.textContent = `${table}s`;
    button.setAttribute('aria-pressed', String(table === state.table));
    button.addEventListener('click', () => {
      state.table = table;
      state.challengeStep = 1;
      state.chosenDigit = null;
      state.chosenWrap = null;
      renderApp();
    });
    container.append(button);
  });
}

function renderCycle(config) {
  const cycleWheel = byId('cycleWheel');
  cycleWheel.innerHTML = '';

  config.cycle.forEach((digit, index) => {
    const item = document.createElement('li');
    item.className = 'cycle-wheel__digit';
    item.style.setProperty('--i', index);
    item.textContent = digit;
    item.setAttribute('aria-label', `Cycle digit ${index + 1}: ${digit}`);
    cycleWheel.append(item);
  });
}

function renderChallenge() {
  const challenge = getChallenge(state.table, state.challengeStep);
  const config = getTableConfig(state.table);
  const prompt = state.challengeStep === 1
    ? `The ${state.table}s begin. What ones digit appears in ${challenge.expression}?`
    : `The last ones digit was ${challenge.previousDigit}. What ones digit comes next for ${challenge.expression}?`;

  byId('challengePrompt').textContent = prompt;

  const choices = [...new Set([challenge.expectedDigit, ...config.cycle, 0, 5])]
    .sort((a, b) => a - b)
    .slice(0, Math.max(4, Math.min(6, config.cycle.length)));
  if (!choices.includes(challenge.expectedDigit)) choices[0] = challenge.expectedDigit;

  const answerChoices = byId('answerChoices');
  answerChoices.innerHTML = '';
  choices.forEach((digit) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'answer-button';
    button.textContent = digit;
    button.setAttribute('aria-pressed', String(state.chosenDigit === digit));
    button.addEventListener('click', () => {
      state.chosenDigit = digit;
      renderChallenge();
    });
    answerChoices.append(button);
  });

  document.querySelectorAll('[data-wrap-choice]').forEach((button) => {
    const choice = button.dataset.wrapChoice === 'yes';
    button.setAttribute('aria-pressed', String(state.chosenWrap === choice));
    button.onclick = () => {
      state.chosenWrap = choice;
      renderChallenge();
    };
  });
}

function renderRows() {
  const rows = generateRows(state.table);
  const tableBody = byId('tableBody');
  tableBody.innerHTML = '';

  rows.forEach((row) => {
    const tr = document.createElement('tr');
    if (row.multiplier === state.challengeStep) tr.classList.add('is-current');
    tr.innerHTML = `
      <td>${row.multiplier}</td>
      <td>${row.expression}</td>
      <td>${row.tensPart}</td>
      <td><span class="ones-pill">${row.onesDigit}</span></td>
      <td><strong>${String(row.product).padStart(2, '0')}</strong></td>
      <td>${row.wrapped ? 'Looped back ⤴' : 'Keep marching'}</td>
    `;
    tableBody.append(tr);
  });

  byId('tableCaption').textContent = `Expanded ${state.table}s table through 10 steps`;
}

function renderValidation() {
  const challenge = getChallenge(state.table, state.challengeStep);
  const additions = Array.from({ length: challenge.multiplier }, () => state.table).join(' + ');
  byId('validationText').textContent = `${challenge.expression} means ${challenge.multiplier} groups of ${state.table}. ${additions} = ${challenge.product}. The pattern checks out.`;

  const visual = byId('groupsVisual');
  visual.innerHTML = '';
  Array.from({ length: Math.min(challenge.multiplier, 10) }, (_, groupIndex) => {
    const group = document.createElement('div');
    group.className = 'dot-group';
    group.setAttribute('aria-label', `Group ${groupIndex + 1} with ${state.table} dots`);
    Array.from({ length: Math.min(state.table, 10) }, () => {
      const dot = document.createElement('span');
      dot.className = 'dot';
      group.append(dot);
    });
    visual.append(group);
  });
}

function handleReveal() {
  const feedback = byId('feedback');

  if (state.chosenDigit === null || state.chosenWrap === null) {
    feedback.textContent = 'Pick a ones digit and decide if the tens should step up.';
    feedback.className = 'feedback feedback--notice';
    return;
  }

  const challenge = getChallenge(state.table, state.challengeStep);
  const correct = isCorrectPrediction(state.table, state.challengeStep, state.chosenDigit, state.chosenWrap);
  const wrapMessage = challenge.expectedWrap
    ? 'The ones digit looped back down, so the tens digit gets a point.'
    : 'No loop back this time, so the tens digit keeps marching.';

  feedback.textContent = correct
    ? `Pattern piece found! ${challenge.expression} = ${challenge.product}. ${wrapMessage}`
    : `Almost, detective. ${challenge.expression} has ones digit ${challenge.expectedDigit}. ${wrapMessage}`;
  feedback.className = correct ? 'feedback feedback--success' : 'feedback feedback--try';
}

function bindActions() {
  byId('checkAnswer').addEventListener('click', handleReveal);
  byId('nextChallenge').addEventListener('click', () => {
    state.challengeStep = state.challengeStep >= 10 ? 1 : state.challengeStep + 1;
    state.chosenDigit = null;
    state.chosenWrap = null;
    byId('feedback').textContent = '';
    renderApp();
  });
}

function renderApp() {
  const config = getTableConfig(state.table);
  byId('lesson-name').textContent = config.lessonName;
  byId('lesson-personality').textContent = config.personality;
  byId('hookText').textContent = config.hook;
  byId('activeTable').textContent = state.table;

  renderTablePicker();
  renderCycle(config);
  renderChallenge();
  renderRows();
  renderValidation();
}

if (typeof document !== 'undefined') {
  bindActions();
  renderApp();
}
