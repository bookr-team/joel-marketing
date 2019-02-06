// navigation
const burger = document.querySelector('.burger');
const navMenu = document.querySelector(`#${burger.dataset.target}`);

burger.addEventListener('click', () => {
  burger.classList.toggle('is-active');
  navMenu.classList.toggle('is-active');
});

// TODO init highlighter at first hover element with positionInital()
class Highlighter {
  constructor(config) {
    this.boundary = document.querySelector(config.boundarySelector);
    this.targets = document.querySelectorAll(config.targetsSelector);
    this.highlighterHeight = config.heightPx || 'cover';
    this.highlighterOffset = config.offset || 0;
    this.highlighterColor = config.color || 'rgba(255, 165, 0, 0.5)';
    this.transitionMs = config.transitionMs || 200;
    this.windowMinWidth = config.windowMinWidth || 0;
    this.firstHover = true;

    this.initListeners();
  }
  initListeners() {
    this.targets.forEach(t => t.addEventListener('mouseenter', e => {
      this.currentTarget = e.target;
      this.highlight();
    }));
    this.boundary.addEventListener('mouseleave', () => {
      if (this.highlighter) this.highlighter.style.width = 0;
    });
  }
  initHighlighter() {
    const highlighter = document.createElement('div');
    const styles = `
      transition: all ${this.transitionMs}ms;
      background: ${this.highlighterColor};
      position: absolute;
      z-index: 1000;
      top: 0;
      left: 0;
      pointer-events: none;
    `;
    highlighter.style.cssText = styles;
    document.body.append(highlighter);
    this.highlighter = highlighter;
  }
  // positionInitial() {}
  highlight() {
    // on mobile, don't bother with hover effects
    if (this.windowMinWidth > window.innerWidth) return;

    if (this.firstHover) {
      this.initHighlighter();
      // this.positionInitial();
      this.firstHover = false;
    }

    const targetCoords = this.currentTarget.getBoundingClientRect();
    const heightConfig = this.highlighterHeight;
    const height = heightConfig == 'cover' ? targetCoords.height : heightConfig;
    const top = targetCoords.top + (targetCoords.height - height - this.highlighterOffset);
    const coords = {
      width: targetCoords.width,
      height: height,
      top: top + window.scrollY,
      left: targetCoords.left + window.scrollX
    };

    this.highlighter.style.width = `${coords.width}px`;
    this.highlighter.style.height = `${coords.height}px`;
    this.highlighter.style.transform = `translate(${coords.left}px, ${coords.top}px)`;
  }
}

const hl = new Highlighter({
  boundarySelector: 'nav .hover-effect-bound',
  targetsSelector: 'nav .navbar-menu a:not(.button)',
  heightPx: 4,
  color: '#fc5e32',
  windowMinWidth: 700
});