// TODO init highlighter at first hover element with positionInitial()
// hi there!
// let's define some component classes
class Highlighter {
  /* ------- Usage ---------------------------------------
      - Must pass a config variable to the constructor
      - Required config properties are
        - boundarySelector
        - targetsSelector
      - Optional config properties are
        - heightPx
        - offsetPx
        - color
        - transitionMs
        - windowMinWidth
      - The highlight will follow the pointer around over specified targets
      - The effect can be disabled when window is below specified width
     ----------------------------------------------------- */
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
    this.targets.forEach(t =>
      t.addEventListener('mouseenter', e => {
        this.currentTarget = e.target;
        this.highlight();
      })
    );
    this.boundary.addEventListener('mouseleave', () => {
      if (this.highlighter) this.highlighter.style.width = 0;
    });
  }
  initHighlighter() {
    this.initialTarget = this.currentTarget;
    const initialCoords = this.initialTarget.getBoundingClientRect();
    const highlighter = document.createElement('div');
    const styles = `
        transition: all ${this.transitionMs}ms;
        background: ${this.highlighterColor};
        position: absolute;
        z-index: 1000;
        top: ${initialCoords.top}px;
        left: ${initialCoords.left}px;
        pointer-events: none;
      `;

    highlighter.style.cssText = styles;
    document.body.append(highlighter);
    this.highlighter = highlighter;
  }
  highlight() {
    // on mobile, don't bother with hover effects
    if (this.windowMinWidth > window.innerWidth) return;

    if (this.firstHover) {
      this.initHighlighter();
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

// another component
class AutomaticSlideShow {
  /* ------- Usage ---------------------------------------
      - Must pass a config variable to the constructor
      - Required config properties are
        - componentElSelector
        - slidesContainerElSelector
      - Optional config properties are
        - slideDelayMs
        - transitionMs
      - Slides are all direct children of the slides container
      - Slides will advance automatically every slideDelayMs
      - The slideshow will pause on mouse hover
     ----------------------------------------------------- */
  constructor(config) {
    this.config = config;
    this.currentIndex = 1;
    this.element = document.querySelector(config.componentElSelector);
    this.slidesContainer = this.element.querySelector(config.slidesContainerElSelector);
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
  }
  resume() {
    this.run();
  }
  reset() {
    this.sliderWidth = this.slidesContainer.clientWidth;
    this.transitionSlide();
  }
}

// we'll show our nav menu when the user clicks the burger icon...
const burger = document.querySelector('.burger');
const navMenu = document.querySelector(`#${burger.dataset.target}`);

function toggleNavMenu() {
  burger.classList.toggle('is-active');
  navMenu.classList.toggle('is-active');
}

burger.addEventListener('click', toggleNavMenu);

// ...and add a fancy menu item highlight effect
const hl = new Highlighter({
  boundarySelector: 'nav .hover-effect-bound',
  targetsSelector: 'nav .navbar-menu a:not(.button)',
  heightPx: 4,
  offsetPx: 20,
  color: '#fc5e32',
  windowMinWidth: 700
});

// let's get some testimonials
// we make a call to the backend and parse the response
const ajaxResponse = [
  {
    name: 'Kate',
    location: 'Seattle',
    blurb: 'Bookr makes life worth living! 14/10 would recommend.',
    imgUrl: 'images/profiles/01.jpg'
  },
  {
    name: 'John',
    location: 'Denver',
    blurb:
      'I use Bookr religiously. My friends are sick of hearing me rave about the service. Keep up the good work!',
    imgUrl: 'images/profiles/02.jpg'
  },
  {
    name: 'Elba',
    location: 'Little Rock',
    blurb: "I've never had so much fun reading book reviews. Thanks Bookr!",
    imgUrl: 'images/profiles/03.jpg'
  }
];

// we need some HTML for our testimonials
function populateTestimonialTemplate(t) {
  return `
  <div class="testimonial ${t.name.toLowerCase()}">
    <div class="blurb">${t.blurb}</div>
    <div class="profile">
      <div class="name">${t.name}, ${t.location}</div>
      <div class="photo"><img src="${t.imgUrl}" alt="${t.name}" /></div>
    </div>
  </div>
  `;
}

// let's populate the testimonials container
const testimonials = ajaxResponse.map(t => populateTestimonialTemplate(t));
const insertLocation = document.querySelector('div.testimonials-container');
testimonials.forEach(t => {
  // LEARNING MOMENT - how do we create DOM nodes from an HTML string?
  const docFragment = document.createRange().createContextualFragment(t);
  insertLocation.append(docFragment);
});

// now that we have some testimonials on the page, we'll make
// a slideshow out of them
const slider = new AutomaticSlideShow({
  componentElSelector: '.testimonials-component',
  slidesContainerElSelector: '.testimonials-container',
  slideDelayMs: 6500
});
