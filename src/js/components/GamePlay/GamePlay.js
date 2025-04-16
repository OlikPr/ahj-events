import calcTileType from '../../utils/calcTileType';
import Modal from '../Modal/Modal';

import './game-play.css';

export default class GamePlay {
  constructor(boardSize) {
    this.boardSize = boardSize;
    this.container = null;
    this.boardEl = null;
    this.cells = [];
    this.cellClickListeners = [];
    this.cellEnterListeners = [];
    this.cellLeaveListeners = [];
    this.isModal = false;
    this.currentModal = null;
    this.missCount = 0;
    this.maxMisses = 5;
    this.goblinTimeout = null;
    this.currentGoblinIndex = null;
    this.gameActive = false;
    this.score = 0;
    this.initModalListener();
  }

  bindToDOM(container) {
    if (!(container instanceof HTMLElement)) {
      throw new Error('container is not HTMLElement');
    }
    this.container = container;
  }

  initModalListener() {
    document.addEventListener('click', (e) => {
      if (
        e.target.dataset.handler === 'modalHandlerCancel'
        && this.currentModal
      ) {
        this.currentModal.hide();
        this.isModal = false;
      }
    });
  }

  drawUi(theme) {
    this.checkBinding();

    this.container.innerHTML = `
      <div class="board-container">
        <div data-id="board" class="board"></div>
      </div>
    `;

    this.boardEl = this.container.querySelector('[data-id=board]');

    this.boardEl.classList.add(theme);
    for (let i = 0; i < this.boardSize ** 2; i += 1) {
      const cellEl = document.createElement('div');
      cellEl.classList.add(
        'cell',
        'map-tile',
        `map-tile-${calcTileType(i, this.boardSize)}`,
      );
      cellEl.addEventListener('mouseenter', (event) => this.onCellEnter(event));
      cellEl.addEventListener('mouseleave', (event) => this.onCellLeave(event));
      cellEl.addEventListener('click', (event) => this.onCellClick(event));
      this.boardEl.appendChild(cellEl);
    }

    this.cells = Array.from(this.boardEl.children);
  }
  showGoblin() {
    if (!this.gameActive) return null;
    this.clearBoard();
    const randomIndex = Math.floor(Math.random() * this.boardSize ** 2);
    this.currentGoblinIndex = randomIndex;
    const goblinEl = document.createElement('div');
    goblinEl.classList.add('goblin');
    this.cells[randomIndex].appendChild(goblinEl);
    this.goblinTimeout = setTimeout(() => {
      this.handleGoblinMiss();
    }, 1000);
    return randomIndex;
  }
  handleGoblinMiss() {
    if (!this.gameActive) return;

    this.missCount++;
    this.clearBoard();
    this.currentGoblinIndex = null;

    if (this.missCount >= this.maxMisses) {
      this.endGame(false);
    } else {
      const delay = 500 + Math.random() * 1500;
      setTimeout(() => this.showGoblin(), delay);
    }
  }

  handleGoblinClick(index) {
    if (index === this.currentGoblinIndex && this.gameActive) {
      clearTimeout(this.goblinTimeout);
      this.score++;
      this.clearBoard();
      this.currentGoblinIndex = null;

      const delay = 500 + Math.random() * 1500;
      setTimeout(() => this.showGoblin(), delay);
    }
  }

  startGame() {
    this.gameActive = true;
    this.score = 0;
    this.missCount = 0;
    this.showGoblin();
  }

  endGame(isWin) {
    this.gameActive = false;
    clearTimeout(this.goblinTimeout);
    this.clearBoard();

    if (isWin) {
      this.showModalMessage('Победа!', `Ваш счет: ${this.score}`);
    } else {
      this.showModalMessage('Игра окончена', `Вы пропустили 5 гоблинов. Счет: ${this.score}`);
    }
  }

  clearBoard() {
    const goblins = this.boardEl.querySelectorAll('.goblin');
    goblins.forEach(goblin => goblin.remove());
  }

  redrawPositions(position) {
    for (const cell of this.cells) {
      cell.innerHTML = '';
    }

    const cellEl = this.boardEl.children[position];
    const charEl = document.createElement('div');
    charEl.classList.add('character', 'generic');

    cellEl.appendChild(charEl);
  }

  addCellEnterListener(callback) {
    this.cellEnterListeners.push(callback);
  }

  addCellLeaveListener(callback) {
    this.cellLeaveListeners.push(callback);
  }

  addCellClickListener(callback) {
    this.cellClickListeners.push(callback);
  }

  onCellEnter(event) {
    event.preventDefault();
    const index = this.cells.indexOf(event.currentTarget);
    this.cellEnterListeners.forEach((o) => o.call(null, index));
  }

  onCellLeave(event) {
    event.preventDefault();
    const index = this.cells.indexOf(event.currentTarget);
    this.cellLeaveListeners.forEach((o) => o.call(null, index));
  }

  onCellClick(event) {
    const index = this.cells.indexOf(event.currentTarget);
    if (this.gameActive) {
      this.handleGoblinClick(index);
    }
    this.cellClickListeners.forEach((o) => o.call(null, index));
  }

  selectCell(index, color = 'yellow') {
    this.deselectCell(index);
    this.cells[index].classList.add('selected', `selected-${color}`);
  }

  deselectCell(index) {
    const cell = this.cells[index];
    cell.classList.remove(
      ...Array.from(cell.classList).filter((o) => o.startsWith('selected')),
    );
  }

  hideCellTooltip(index) {
    this.cells[index].title = '';
  }

  setCursor(cursor) {
    this.boardEl.style.cursor = cursor;
  }

  checkBinding() {
    if (this.container === null) {
      throw new Error('GamePlay not bind to DOM');
    }
  }

  showModalMessage(message, unicode) {
    if (!this.isModal) {
      this.isModal = true;
      this.showModal(message, unicode);
    }
  }

  showModal(message, unicode) {
    const modal = new Modal({
      title: message,
      content: `&#${unicode}`,
      footerButtons: [
        {
          class: 'btn btn__cancel',
          text: 'Close',
          handler: 'modalHandlerCancel',
        },
      ],
    });

    this.currentModal = modal;

    modal.show();
  }
}
