export function main() {
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.get('grid') === 'true') {
    initGridOverlay();
  }
}

function initGridOverlay() {
  const overlay = document.createElement('div');
  overlay.classList.add('grid-overlay');
  const grid = document.createElement('div');
  grid.classList.add('grid');
  for (let i = 0; i < 12; i++) {
    const col = document.createElement('div');
    col.classList.add('grid__col');
    col.textContent = String(i + 1);
    grid.appendChild(col);
  }
  overlay.appendChild(grid);
  document.body.appendChild(overlay);
  document.body.setAttribute('grid-overlay', 'true');
}
