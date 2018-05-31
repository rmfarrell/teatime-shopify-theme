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
import { resizeEvent, cart } from '../events';
import { windowWhen } from 'rxjs/operator/windowWhen';
import { Cart } from '../cart'

window.slate = window.slate || {};
window.theme = window.theme || {};

// -- Resize handler
const debouncedResize = debounce(() => window.dispatchEvent(resizeEvent), 250);
window.addEventListener('resize', debouncedResize);

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

// -- Shopping cart
const $closeCartButton = $('[data-close-shopping-cart-tray]')
const $shoppingCartIcon = $('[data-shopping-cart-icon]')
const $cartItemCounter = $shoppingCartIcon.querySelector('[data-cart-item-counter]');
const shoppingCart = Cart((c) => {
  $cartItemCounter.innerText = `(${c.item_count})`;
})
$closeCartButton.addEventListener('click', shoppingCart.close)
$shoppingCartIcon.addEventListener('click', (e) => {
  e.preventDefault();
  shoppingCart.open()
});

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