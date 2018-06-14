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

// -- Global Nav

// - Toggle header
const $globalHeader = $('#global-header')
const $navToggle = $globalHeader.querySelector('.hamburger')
const $nav = $globalHeader.querySelector('nav')

$navToggle.addEventListener('click', () => {
  $navToggle.classList.toggle('is-active');
  $nav.classList.toggle('is-active');
});

// - Highlight nav
const $navAs = $globalHeader.querySelectorAll('a')
each($navAs, ($a) => {
  if (window.location.href.includes($a.getAttribute('href'))) {
    $a.classList.add('active')
  }
});

// - Stagger in links on homepage header
(function () {
  const $navAs = $$('.template-index #global-header a')
  if (!$navAs) return;
  let timer = 900;
  each($navAs, ($a) => {
    setTimeout(() => $a.classList.add('show'), timer)
    timer += 100;
  })
})();


// -- Open targetd el if data-open directive present
const $$parentTogglers = $$('[data-open]')
each($$parentTogglers, (el) => {
  const targ = $(el.getAttribute('data-open'))
  el.addEventListener('click', (e) => {
    e.preventDefault();
    targ.classList.toggle('open')
    el.classList.toggle('open')
  })
})

// -- Shopping cart tray
const $closeCartButton = $('[data-close-shopping-cart-tray]')
const $shoppingCartIcon = $('[data-shopping-cart-icon]')
const $cartItemCounter = $shoppingCartIcon.querySelector('[data-cart-item-counter]');

// - initialize shopping cart
const shoppingCart = Cart((c) => {
  $cartItemCounter.innerText = `${c.item_count}`;
})

// - open the cart when button is clicked
$closeCartButton.addEventListener('click', shoppingCart.close)

// - close cart tray when close button is clicked
$shoppingCartIcon.addEventListener('click', (e) => {
  e.preventDefault();
  shoppingCart.open()
});

// -- Sliders
each($$('.accordion'), (el) => {
  const observer = new MutationObserver((ev) => {
    const targ = ev[0].target
    if (targ && targ.classList.contains('open')) {
      targ.style.height = `${targ.scrollHeight}px`;
      return;
    }
    targ.style.height = '0px';
    return;
  });

  observer.observe(el, {
    attributeFilter: ['class']
  });
});

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