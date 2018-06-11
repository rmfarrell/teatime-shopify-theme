import 'lazysizes/plugins/object-fit/ls.object-fit'
import 'lazysizes/plugins/parent-fit/ls.parent-fit'
import 'lazysizes/plugins/rias/ls.rias'
import 'lazysizes/plugins/bgset/ls.bgset'
import 'lazysizes'
import 'lazysizes/plugins/respimg/ls.respimg'
import '../../styles/theme.scss'
import '../../styles/theme.scss.liquid'

import 'object-fit-images'

// Polyfills
import 'closest'
import 'promise-polyfill/src/polyfill';

import { cookiesEnabled } from '@shopify/theme-cart';
import { wrapTable, wrapIframe } from '@shopify/theme-rte';
import { $, $$, each, debounce, parentUntil } from '../utilities';
import { resizeEvent, cart } from '../events';
import { windowWhen } from 'rxjs/operator/windowWhen';
import { Cart } from '../cart'
import textFit from 'textfit';

// Sections
import '../templates/product'
import '../sections/hero'
import '../sections/matcha101'
import '../sections/locate'

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

// -- Lazy load event handlers

// remove preload class when image has loaded
document.addEventListener('lazybeforeunveil', (e) => {
  const $container = parentUntil(e.target, (p) => p.classList.contains('preload'));
  if ($container) {
    $container.classList.remove('preload')
    setTimeout(() => {
      $container.classList.remove('preload')
    }, 300)
  }
});

// -- Intersection observer event handlers
// add an out-of-viewport class to all elements with 'data-observe-intersection'
// remove this when in view.
// early return if window.IntersectionObserver is undefined
(function () {
  if (!window.IntersectionObserver) return;
  const targs = document.querySelectorAll('[data-observe-intersection]');
  const observerOptions = {}
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.intersectionRatio > 0) entry.target.classList.remove('out-of-viewport');
    });
  }, observerOptions);
  each(targs, (targ) => {
    targ.classList.add('out-of-viewport')
    observer.observe(targ)
  })
})();