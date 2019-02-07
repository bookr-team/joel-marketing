// hi there!
// let's define some component classes
// this bad boy was a DOOZY!
// TODO use x scaling to shrink highlighter from center, https://developer.mozilla.org/en-US/docs/Web/CSS/transform-function/scale
// instead of transitioning the width, transition scale-x from 1 to 0
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
    this.highlighterOffset = config.offsetPx || 0;
    this.highlighterColor = config.color || 'rgba(255, 255, 0, 0.5)';
    this.highlighterHeight = config.heightPx || 'cover';
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
    window.addEventListener('resize', () => {
      this.firstHover = true;
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
        top: ${this.calcTopValue(initialCoords) - initialCoords.top}px;
        left: ${initialCoords.left}px;
        width: 0;
        pointer-events: none;
      `;

    highlighter.style.cssText = styles;
    document.body.append(highlighter);
    this.highlighter = highlighter;
  }
  calcHighlighterHeight() {
    const heightCfg = this.highlighterHeight;
    return heightCfg === 'cover' ? this.currentTarget.getBoundingClientRect().height : heightCfg;
  }
  calcTopValue(targetCoords) {
    const height = this.calcHighlighterHeight();
    return targetCoords.top + (targetCoords.height - height - this.highlighterOffset);
  }
  highlight() {
    // on mobile, don't bother with hover effects
    if (this.windowMinWidth > window.innerWidth) return;

    if (this.firstHover) {
      this.initHighlighter();
      this.firstHover = false;
    }

    const targetCoords = this.currentTarget.getBoundingClientRect();
    const coords = {
      width: targetCoords.width,
      height: this.calcHighlighterHeight(),
      top: this.calcTopValue(targetCoords) + window.scrollY,
      left: targetCoords.left + window.scrollX
    };

    // compensate for initial positioning
    const initialCoords = this.initialTarget.getBoundingClientRect();
    const leftDelta = coords.left - initialCoords.left;
    // const topDelta = coords.top - initialCoords.top;  // THIS!!! this line took 3 hours to debug
    const topDelta = 0 - initialCoords.top; // solution

    this.highlighter.style.width = `${coords.width}px`;
    this.highlighter.style.height = `${coords.height}px`;
    this.highlighter.style.transform = `translate(${leftDelta}px, ${topDelta}px)`;
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
function initNavigation() {
  const burger = document.querySelector('.burger');
  const navMenu = document.querySelector(`#${burger.dataset.target}`);

  function toggleNavMenu() {
    burger.classList.toggle('is-active');
    navMenu.classList.toggle('is-active');
  }

  burger.addEventListener('click', toggleNavMenu);
}

function initHighlighterEffect() {
  // ...and add a fancy menu item highlight effect
  const hl = new Highlighter({
    boundarySelector: 'nav .hover-effect-bound',
    targetsSelector: 'nav .navbar-menu a:not(.button)',
    heightPx: 4,
    offsetPx: 20,
    color: '#fc5e32',
    windowMinWidth: 700
  });
}

// let's get some testimonials
// we make a call to the backend and parse the response
function initTestimonials() {
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
}

// let's fetch some recent blog posts for our news page
function initRecentPosts() {
  // get some dummy data
  const endpoint = 'https://my.api.mockaroo.com/blog-posts.json?key=23239c30';
  const container = document.querySelector('.posts-container');
  const loadingStatus = document.querySelector('.content-loading');

  function dismissLoadingStatus() {
    loadingStatus.style.display = 'none';
  }

  function getPostHtml(post) {
    // LEARNING MOMENT - how to get human-friendly strings from a Date object
    const date = new Date(post.date);
    const year = date.getFullYear();
    const month = date.toLocaleString('en-us', { month: 'long' });
    // date object date is zero-based but our data is not
    const day = date.getDate() + 1;
    const weekday = date.toLocaleString('en-us', { weekday: 'long' });
    return `
      <div class="post content">
        <div class="post-title title is-size-4">${post.title}</div>
        <div class="post-byline subtitle is-size-6 is-italic">by ${
          post.author
        } on ${weekday}, ${month} ${day}, ${year}</div>
        <div class="post-preview">${post.preview}</div>
        <a href="#" class="button">Continue Reading</a>
      </div>
    `;
  }

  function createDomNodeFromString(string) {
    return document.createRange().createContextualFragment(string);
  }

  function addNodesToDOM(nodesArray) {
    nodesArray.forEach(n => container.append(n));
  }

  function parseResponse(posts) {
    // LEARNING MOMENT - how to sort objects by a date string
    const postsSortedByDate = posts.sort((p1, p2) => new Date(p2.date) - new Date(p1.date));
    postNodes = postsSortedByDate.map(p => getPostHtml(p)).map(p => createDomNodeFromString(p));
    dismissLoadingStatus();
    addNodesToDOM(postNodes);
  }

  function handleError(error) {
    console.error(error);
    const errorMessage = `
      <div class="notification error">There was an error loading recent posts.</div>
    `;
    container.append(createDomNodeFromString(errorMessage));
  }

  // LEARNING MOMENT - how to make a request with the new fetch API
  fetch(endpoint)
    .then(r => r.json())
    .then(parseResponse)
    .catch(handleError);
}

// FIRE!
console.log('👋 Welcome.');
const currentPage = document.body.dataset.page;
// all pages
initNavigation();
initHighlighterEffect();
// page-specific stuff
if (currentPage === 'home') initTestimonials();
if (currentPage === 'news') initRecentPosts();
