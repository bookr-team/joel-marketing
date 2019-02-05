// navigation
const burger = document.querySelector('.burger');
const navMenu = document.querySelector(`#${burger.dataset.target}`);
const nav = document.querySelector('nav.navbar');

burger.addEventListener('click', () => {
  burger.classList.toggle('is-active');
  navMenu.classList.toggle('is-active');
});

// nav menu highlighter

// const followAlongLinks = document.querySelectorAll(
//   'nav .navbar-menu a:not(.button)'
// );
// const highlighter = document.createElement('span');
// const highlighterHeightPx = 4;
// highlighter.classList.add('menu-item-highlighter');
// const highlighterInitialY =
//   followAlongLinks[0].getBoundingClientRect().height - highlighterHeightPx - 15;
// const highlighterInitialX = followAlongLinks[0].getBoundingClientRect().left;

// highlighter.style.transform = `translate(${highlighterInitialX}px, ${highlighterInitialY}px)`;
// document.body.append(highlighter);

// function highlightItem() {
//   const itemCoords = this.getBoundingClientRect();
//   const highlightCoords = {
//     width: itemCoords.width,
//     // height: itemCoords.height,
//     height: highlighterHeightPx,
//     top:
//       itemCoords.top +
//       (itemCoords.height - highlighterHeightPx - 15) +
//       window.scrollY,
//     left: itemCoords.left + window.scrollX
//   };
//   highlighter.style.width = `${highlightCoords.width}px`;
//   highlighter.style.height = `${highlightCoords.height}px`;

//   highlighter.style.transform = `translate(${highlightCoords.left}px, ${
//     highlightCoords.top
//   }px)`;
// }

// function hideHighlighter() {
//   highlighter.style.width = 0;
// }

// followAlongLinks.forEach(l => l.addEventListener('mouseenter', highlightItem));
// navMenu.addEventListener('mouseleave', hideHighlighter);