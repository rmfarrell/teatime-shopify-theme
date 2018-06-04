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
import 'object-fit-images'

// Polyfills
import 'closest'
import 'promise-polyfill/src/polyfill';

import { cookiesEnabled } from '@shopify/theme-cart';
import { wrapTable, wrapIframe } from '@shopify/theme-rte';
import { $, $$, each, debounce } from '../utilities';
import { resizeEvent, cart } from '../events';
import { windowWhen } from 'rxjs/operator/windowWhen';
import { Cart } from '../cart'
import textFit from 'textfit';

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
  $cartItemCounter.innerText = `${c.item_count}`;
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
  maxFontSize: 400, alignVertWithFlexbox:
    true
}
textFit($$('.text-fit'), textFitOptions)
window.addEventListener('matchabar:resize', () => textFit($$('.text-fit'), textFitOptions));

// -- Set 'supports-no-cookies' / 'supports-cookies' class
if (cookiesEnabled()) {
  document.documentElement.className = document.documentElement.className.replace(
    'supports-no-cookies',
    'supports-cookies',
  );
}

// -- Dynamic handlers

// apply class on load
// move data-src to src on load
// applies data-onload as class
each($$('[data-onload]'), ($el) => {
  const className = $el.getAttribute('data-onload')
  const url = $el.getAttribute('data-onload-src')
  preloadImage(url, ($img) => {
    $el.setAttribute('src', url)
    $el.classList.add(className)
  })
})

// -- Utilities

/**
 * Parse a string into HTML
 * @param {*} str 
 */
function parseHtml(str = '') {
  const parser = new DOMParser()
  return parser.parseFromString(str, 'text/html')
}

/**
 * Preload an image and apply callback
 * @param {String} url 
 * @param {Function} fn callback after loaded
 */
function preloadImage(url = '', fn = function () { }) {
  const img = new Image();
  img.src = url;
  img.onload = () => { fn(img) }
}