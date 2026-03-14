let items = [];
let currentIndex = 0;
const decisions = {};
let pointerStart = null;
let dragState = { dx: 0, dy: 0, active: false };

const screens = {
  landing: document.getElementById('screen-landing'),
  review: document.getElementById('screen-review'),
  summary: document.getElementById('screen-summary')
};

const els = {
  progressText: document.getElementById('progress-text'),
  progressPill: document.getElementById('progress-pill'),
  progressBar: document.getElementById('progress-bar'),
  itemImage: document.getElementById('item-image'),
  itemCategory: document.getElementById('item-category'),
  itemNote: document.getElementById('item-note'),
  itemName: document.getElementById('item-name'),
  itemReason: document.getElementById('item-reason'),
  itemQty: document.getElementById('item-qty'),
  productLink: document.getElementById('product-link'),
  itemCard: document.getElementById('item-card'),
  swipeHint: document.getElementById('swipe-hint'),
  decisionFlash: document.getElementById('decision-flash'),
  subsModal: document.getElementById('subs-modal'),
  subsList: document.getElementById('subs-list'),
  modalItemName: document.getElementById('modal-item-name'),
  keptCount: document.getElementById('kept-count'),
  maybeCount: document.getElementById('maybe-count'),
  skippedCount: document.getElementById('skipped-count'),
  summaryList: document.getElementById('summary-list')
};

function showScreen(name) {
  Object.values(screens).forEach(screen => screen.classList.remove('active'));
  screens[name].classList.add('active');
}

function currentItem() {
  return items[currentIndex];
}

function initDecisions() {
  Object.keys(decisions).forEach(k => delete decisions[k]);
  items.forEach(item => {
    decisions[item.id] = { status: 'undecided', qty: item.qty };
  });
}

function renderCard() {
  const item = currentItem();
  const decision = decisions[item.id];

  els.itemImage.src = item.image;
  els.itemImage.alt = item.name;
  els.itemCategory.textContent = item.category;
  els.itemNote.textContent = item.note;
  els.itemName.textContent = item.name;
  els.itemReason.textContent = item.reason;
  els.itemQty.textContent = formatQty(item, decision.qty);
  els.productLink.href = item.productUrl;

  const viewed = currentIndex + 1;
  const kept = Object.values(decisions).filter(d => d.status === 'keep').length;
  els.progressText.textContent = `${viewed} of ${items.length}`;
  els.progressPill.textContent = `${kept} kept`;
  els.progressBar.style.width = `${((viewed - 1) / items.length) * 100}%`;
  resetCardTransform();
  hideSwipeHint();
}

function formatQty(item, qty) {
  if (item.id === 'bananas') return `${qty} bananas`;
  if (item.id === 'noosa') return `${qty} tubs`;
  if (item.id === 'kombucha') return `${qty} bottles`;
  if (item.id === 'chips') return `${qty} bags`;
  if (item.id === 'ground-beef') return `${qty} packs`;
  return qty === 1 ? item.qtyLabel : `${qty} × ${item.qtyLabel}`;
}

function resetCardTransform() {
  els.itemCard.style.transition = 'transform 180ms ease, opacity 180ms ease';
  els.itemCard.style.transform = 'translate3d(0,0,0) rotate(0deg)';
  els.itemCard.style.opacity = '1';
}

function flashDecision(status) {
  const map = {
    keep: { text: '✓ Added', cls: 'keep' },
    skip: { text: '✕ Removed', cls: 'skip' },
    maybe: { text: '? Maybe', cls: 'maybe' }
  };
  const cfg = map[status];
  els.decisionFlash.textContent = cfg.text;
  els.decisionFlash.className = `decision-flash ${cfg.cls}`;
  requestAnimationFrame(() => {
    els.decisionFlash.classList.add('show');
  });
  setTimeout(() => {
    els.decisionFlash.classList.remove('show');
    setTimeout(() => {
      els.decisionFlash.className = 'decision-flash hidden';
    }, 180);
  }, 620);
}

function showSwipeHint(status) {
  const map = {
    keep: { text: 'KEEP', cls: 'keep' },
    skip: { text: 'SKIP', cls: 'skip' },
    maybe: { text: 'MAYBE', cls: 'maybe' }
  };
  const cfg = map[status];
  els.swipeHint.textContent = cfg.text;
  els.swipeHint.className = `swipe-hint ${cfg.cls}`;
}

function hideSwipeHint() {
  els.swipeHint.className = 'swipe-hint hidden';
}

function animateAdvance(status, callback) {
  const map = {
    keep: 'translate3d(120%, -4%, 0) rotate(14deg)',
    skip: 'translate3d(-120%, -4%, 0) rotate(-14deg)',
    maybe: 'translate3d(0, -120%, 0) rotate(0deg)'
  };
  flashDecision(status);
  els.itemCard.style.transition = 'transform 220ms ease, opacity 220ms ease';
  els.itemCard.style.transform = map[status] || 'scale(0.98)';
  els.itemCard.style.opacity = '0.15';
  hideSwipeHint();
  setTimeout(() => {
    callback();
    els.itemCard.style.transition = 'none';
    els.itemCard.style.transform = 'translateY(18px) scale(0.98)';
    els.itemCard.style.opacity = '0';
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        els.itemCard.style.transition = 'transform 180ms ease, opacity 180ms ease';
        els.itemCard.style.transform = 'translateY(0) scale(1)';
        els.itemCard.style.opacity = '1';
      });
    });
  }, 225);
}

function advance(status) {
  const item = currentItem();
  decisions[item.id].status = status;
  animateAdvance(status, () => {
    if (currentIndex < items.length - 1) {
      currentIndex += 1;
      renderCard();
    } else {
      renderSummary();
      showScreen('summary');
    }
  });
}

function changeQty(delta) {
  const item = currentItem();
  const next = Math.max(1, decisions[item.id].qty + delta);
  decisions[item.id].qty = next;
  els.itemQty.textContent = formatQty(item, next);
}

function openSubs() {
  const item = currentItem();
  els.modalItemName.textContent = item.name;
  els.subsList.innerHTML = '';
  item.substitutes.forEach(sub => {
    const li = document.createElement('li');
    li.textContent = sub;
    els.subsList.appendChild(li);
  });
  els.subsModal.classList.remove('hidden');
}

function closeSubs() {
  els.subsModal.classList.add('hidden');
}

function renderSummary() {
  const values = Object.entries(decisions);
  const kept = values.filter(([, d]) => d.status === 'keep');
  const maybe = values.filter(([, d]) => d.status === 'maybe');
  const skipped = values.filter(([, d]) => d.status === 'skip');

  els.keptCount.textContent = kept.length;
  els.maybeCount.textContent = maybe.length;
  els.skippedCount.textContent = skipped.length;
  els.summaryList.innerHTML = '';

  const ordered = [
    { label: 'Kept', rows: kept },
    { label: 'Maybe', rows: maybe },
    { label: 'Skipped', rows: skipped }
  ];

  ordered.forEach(group => {
    group.rows.slice(0, 6).forEach(([id, decision]) => {
      const item = items.find(i => i.id === id);
      const div = document.createElement('div');
      div.className = 'summary-item';
      div.innerHTML = `<strong>${group.label}: ${item.name}</strong><small>${formatQty(item, decision.qty)}</small>`;
      els.summaryList.appendChild(div);
    });
  });
}

function restart() {
  currentIndex = 0;
  initDecisions();
  renderCard();
  showScreen('landing');
}

function dragDecision(dx, dy) {
  if (Math.abs(dy) > 80 && dy < 0 && Math.abs(dy) > Math.abs(dx)) return 'maybe';
  if (dx > 80) return 'keep';
  if (dx < -80) return 'skip';
  return null;
}

function onPointerDown(e) {
  if (screens.review.classList.contains('active') === false) return;
  if (e.target.closest('.action-grid, .qty-controls, .secondary-actions, .modal, button, a')) return;
  pointerStart = { x: e.clientX, y: e.clientY };
  dragState = { dx: 0, dy: 0, active: true };
  els.itemCard.style.transition = 'none';
}

function onPointerMove(e) {
  if (!dragState.active || !pointerStart) return;
  dragState.dx = e.clientX - pointerStart.x;
  dragState.dy = e.clientY - pointerStart.y;
  const rot = dragState.dx * 0.04;
  els.itemCard.style.transform = `translate3d(${dragState.dx}px, ${dragState.dy}px, 0) rotate(${rot}deg)`;
  const decision = dragDecision(dragState.dx, dragState.dy);
  if (decision) showSwipeHint(decision); else hideSwipeHint();
}

function onPointerEnd() {
  if (!dragState.active) return;
  const decision = dragDecision(dragState.dx, dragState.dy);
  dragState.active = false;
  pointerStart = null;
  if (decision) {
    advance(decision);
  } else {
    hideSwipeHint();
    resetCardTransform();
  }
}

document.getElementById('start-review').addEventListener('click', () => {
  currentIndex = 0;
  renderCard();
  showScreen('review');
});

document.getElementById('keep-btn').addEventListener('click', () => advance('keep'));
document.getElementById('skip-btn').addEventListener('click', () => advance('skip'));
document.getElementById('maybe-btn').addEventListener('click', () => advance('maybe'));
document.getElementById('qty-up').addEventListener('click', () => changeQty(1));
document.getElementById('qty-down').addEventListener('click', () => changeQty(-1));
document.getElementById('subs-btn').addEventListener('click', openSubs);
document.getElementById('close-modal').addEventListener('click', closeSubs);
document.getElementById('restart-btn').addEventListener('click', restart);
document.getElementById('subs-modal').addEventListener('click', (e) => {
  if (e.target.id === 'subs-modal') closeSubs();
});

els.itemCard.addEventListener('pointerdown', onPointerDown);
window.addEventListener('pointermove', onPointerMove);
window.addEventListener('pointerup', onPointerEnd);
window.addEventListener('pointercancel', onPointerEnd);

fetch('items.json')
  .then(r => r.json())
  .then(data => {
    items = data;
    initDecisions();
  });
