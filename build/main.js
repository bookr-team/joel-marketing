// navigation
const burger = document.querySelector('.burger');
const navMenu = document.querySelector(`#${burger.dataset.target}`);

burger.addEventListener('click', () => {
  burger.classList.toggle('is-active');
  navMenu.classList.toggle('is-active');
});

// TODO init highlighter at first hover element with positionInitial()
class Highlighter {
  constructor(config) {
    this.boundary = document.querySelector(config.boundarySelector);
    this.targets = document.querySelectorAll(config.targetsSelector);
    this.highlighterHeight = config.heightPx || 'cover';
    this.highlighterOffset = config.offsetPx || 0;
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
  offsetPx: 20,
  color: '#fc5e32',
  windowMinWidth: 700
});

class AutomaticSlideShow {
  constructor(config) {
    this.config = config;
    this.currentIndex = 1;
    this.element = document.querySelector(config.componentElSelector);
    this.slidesContainer = this.element.querySelector(config.slidesContainer);
    this.sliderWidth = this.slidesContainer.clientWidth;
    this.slides = this.slidesContainer.children;
    this.slideDelayMs = config.slideDelayMs || 5000;
    this.transitionMs = config.transitionMs || 300;
    this.attachListeners();
    this.cloneFirstAndLast();
    this.transitionSlide();
    this.run();
  }
  run() {
    this.interval = setInterval(() => this.showNext(), this.slideDelayMs);
  }
  attachListeners() {
    this.slidesContainer.addEventListener('mouseenter', () => this.pause());
    this.slidesContainer.addEventListener('mouseleave', () => this.resume());
    this.slidesContainer.addEventListener('transitionend', () => this.completeTransition());
    window.addEventListener('resize', () => this.reset());
  }
  cloneFirstAndLast() {
    const first = this.slides[0].cloneNode(true);
    const last = this.slides[this.slides.length - 1].cloneNode(true);
    first.id = 'first-clone';
    last.id = 'last-clone';
    this.slidesContainer.prepend(last);
    this.slidesContainer.append(first);
    this.slides = this.slidesContainer.children;
  }
  transitionSlide() {
    const transformPx = -this.sliderWidth * this.currentIndex;
    this.slidesContainer.style.transform = `translateX(${transformPx}px)`;
  }
  showNext() {
    if (this.currentIndex >= this.slides.length - 1) return;
    this.slidesContainer.style.transition = `transform ${this.transitionMs}ms ease-in-out`;
    this.currentIndex++;
    this.transitionSlide();
  }
  completeTransition() {
    const slideId = this.slides[this.currentIndex].id || null;
    if (slideId === 'last-clone' || slideId === 'first-clone') {
      const offset = slideId === 'last-clone' ? 2 : this.currentIndex;
      this.slidesContainer.style.transition = '';
      this.currentIndex = this.slides.length - offset;
      this.transitionSlide();
    }
  }
  pause() {
    clearInterval(this.interval);
    console.log('pause');
  }
  resume() {
    this.run();
    console.log('resume');
  }
  reset() {
    this.sliderWidth = this.slidesContainer.clientWidth;
    this.transitionSlide();
  }
}

// slides are all direct children of slidesContainer
const slider = new AutomaticSlideShow({
  componentElSelector: '.testimonials-component',
  slidesContainer: '.testimonials-container'
});