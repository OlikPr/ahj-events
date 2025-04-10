import './click-counter.css';

export default class ClickCounter {
  constructor(container) {
    this.hitCount = 0;
    this.missCount = 0;
    this.container = container;

    this.initUI();
  }

  initUI() {
    if (!(this.container instanceof HTMLElement)) {
      throw new Error('container is not HTMLElement');
    }

    this.container.insertAdjacentHTML(
      'afterbegin',
      `
    <div class="click-counter">
        <div>Hit counts: <span class="hit-count">${this.getHitCount()}</span></div>
        <div>Miss counts: <span class="miss-count">${this.getMissCount()}</span></div>
    </div>
    `,
    );
    this.hitCountEl = this.container.querySelector('.hit-count');
    this.missCountEl = this.container.querySelector('.miss-count');
  }

  incrementHit() {
    this.hitCount += 1;
    this.updateUI();
  }

  incrementMiss() {
    this.missCount += 1;
    this.updateUI();
  }

  updateUI() {
    this.hitCountEl.textContent = this.getHitCount();
    this.missCountEl.textContent = this.getMissCount();
  }

  getHitCount() {
    return this.hitCount;
  }

  getMissCount() {
    return this.missCount;
  }

  reset() {
    this.missCount = 0;
    this.hitCount = 0;
    this.updateUI();
  }
}
