let items = [];
let currentIndex = 0;
const decisions = {};

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
  els.itemCard.style.transform = 'scale(1)';
  els.itemCard.style.opacity = '1';
}

function formatQty(item, qty) {
  if (item.id === 'bananas') return `${qty} bananas`;
  if (item.id === 'noosa') return `${qty} tubs`;
  if (item.id === 'kombucha') return `${qty} bottles`;
  if (item.id === 'chips') return `${qty} bags`;
  if (item.id === 'ground-beef') return `${qty} packs`;
  return qty === 1 ? item.qtyLabel : `${qty} × ${item.qtyLabel}`;
}

function animateAdvance(direction, callback) {
  const map = {
    keep: 'translateX(24px) rotate(1deg)',
    skip: 'translateX(-24px) rotate(-1deg)',
    maybe: 'translateY(10px) scale(0.98)'
  };
  els.itemCard.style.transition = 'transform 140ms ease, opacity 140ms ease';
  els.itemCard.style.transform = map[direction] || 'scale(0.98)';
  els.itemCard.style.opacity = '0.35';
  setTimeout(() => {
    callback();
    els.itemCard.style.transition = 'none';
    requestAnimationFrame(() => {
      els.itemCard.style.transform = 'translateY(8px)';
      els.itemCard.style.opacity = '0';
      requestAnimationFrame(() => {
        els.itemCard.style.transition = 'transform 160ms ease, opacity 160ms ease';
        els.itemCard.style.transform = 'translateY(0)';
        els.itemCard.style.opacity = '1';
      });
    });
  }, 145);
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

fetch('items.json')
  .then(r => r.json())
  .then(data => {
    items = data;
    initDecisions();
  });
