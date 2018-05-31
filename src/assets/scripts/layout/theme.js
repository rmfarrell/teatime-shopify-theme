import fetch from 'unfetch'
import 'lazysizes/plugins/object-fit/ls.object-fit'
import 'lazysizes/plugins/parent-fit/ls.parent-fit'
import 'lazysizes/plugins/rias/ls.rias'
import 'lazysizes/plugins/bgset/ls.bgset'
import 'lazysizes'
import 'lazysizes/plugins/respimg/ls.respimg'
import '../../styles/theme.scss'
import '../../styles/theme.scss.liquid'
import '../templates/product'
import '../sections/hero'
import textFit from 'textfit';

import { cookiesEnabled } from '@shopify/theme-cart';
import { wrapTable, wrapIframe } from '@shopify/theme-rte';
import { $, $$, each, debounce } from '../utilities';
import { windowWhen } from 'rxjs/operator/windowWhen';

window.slate = window.slate || {};
window.theme = window.theme || {};

// -- Resize events
// Fires event `matchabar:resize`
const debouncedResize = debounce(onResize, 250);
const resizeEvent = document.createEvent('Event');

resizeEvent.initEvent('matchabar:resize', true, true);
window.addEventListener('resize', debouncedResize);
function onResize() {
  window.dispatchEvent(resizeEvent)
}

// -- Toggle header
const $globalHeader = $('#global-header')
const $navToggle = $globalHeader.querySelector('.hamburger')
const $nav = $globalHeader.querySelector('nav')

$navToggle.addEventListener('click', () => {
  $navToggle.classList.toggle('is-active');
  $nav.classList.toggle('is-active');
});

// -- Open targetd el if data-open directive present
const $$parentTogglers = $$('[data-open]')
each($$parentTogglers, (el) => {
  const targ = $(el.getAttribute('data-open'))
  el.addEventListener('click', () => {
    targ.classList.toggle('open')
    el.classList.toggle('open')
  })
})

// -- Sliders
each($$('.accordion'), (el) => {
  const observer = new MutationObserver((ev) => {
    const targ = ev[0].target
    if (targ && targ.classList.contains('open')) {
      targ.style.height = `${targ.scrollHeight}px`
      return;
    }
    targ.style.height = '0px'
    return
  })

  observer.observe(el, {
    attributeFilter: ['class']
  })
})

// -- Load pages with Ajax
each($$('[data-load-page]'), (el) => {
  const pageUrl = el.getAttribute('data-load-page')
  return fetch(pageUrl)
    .then((res) => res.text())
    .then((txt) => parseHtml(txt))
    .then((html) => el.replaceWith(html.querySelector('.product-container')))
    .catch(e => console.log(e))
})

// -- Textfit
const textFitOptions = {
  widthOnly: true,
  maxFontSize: 280, alignVertWithFlexbox:
    true
}
textFit($$('.text-fit'), textFitOptions)
window.addEventListener('matchabar:resize', () => {
  console.log('resize')
  textFit($$('.text-fit'), textFitOptions)
});

// -- Set 'supports-no-cookies' / 'supports-cookies' class
if (cookiesEnabled()) {
  document.documentElement.className = document.documentElement.className.replace(
    'supports-no-cookies',
    'supports-cookies',
  );
}

// $(document).ready(() => {

// // Target tables to make them scrollable
// const tableSelectors = '.rte table';

// wrapTable({
//   $tables: $(tableSelectors),
//   tableWrapperClass: 'rte__table-wrapper',
// });

// // Target iframes to make them responsive
// const iframeSelectors =
//   '.rte iframe[src*="youtube.com/embed"],' +
//   '.rte iframe[src*="player.vimeo"]';

// wrapIframe({
//   $iframes: $(iframeSelectors),
//   iframeWrapperClass: 'rte__video-wrapper',
// });

// Apply a specific class to the html element for browser support of cookies.
// });

// -- Utilities

/**
 * Parse a string into HTML
 * @param {*} str 
 */
function parseHtml(str = '') {
  const parser = new DOMParser()
  return parser.parseFromString(str, 'text/html')
}
