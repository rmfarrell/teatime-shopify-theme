import 'lazysizes/plugins/object-fit/ls.object-fit';
import 'lazysizes/plugins/parent-fit/ls.parent-fit';
import 'lazysizes/plugins/rias/ls.rias';
import 'lazysizes/plugins/bgset/ls.bgset';
import 'lazysizes';
import 'lazysizes/plugins/respimg/ls.respimg';

import '../../styles/theme.scss';
import '../../styles/theme.scss.liquid';

import { cookiesEnabled } from '@shopify/theme-cart';
import { wrapTable, wrapIframe } from '@shopify/theme-rte';

window.slate = window.slate || {};
window.theme = window.theme || {};

const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)

// toggle header
const $globalHeader = $('#global-header')
const $navToggle = $globalHeader.querySelector('.hamburger')
const $nav = $globalHeader.querySelector('nav')

$navToggle.addEventListener('click', () => {
  $navToggle.classList.toggle('is-active')
  $nav.classList.toggle('is-active')
})

// open parent el if data-open-parent toggler present
const $$parentTogglers = $$('[data-open-parent]')
each($$parentTogglers, (el) => {
  el.addEventListener('click', () => el.parentElement.classList.toggle('open'))
})

// set 'supports-no-cookies' / 'supports-cookies' class
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
 * Safely iterate through elements
 * @param {HTMLNodeList} els
 * @param {Function} cb callback passes current element and index as args
 */
function each(els, cb = function () { }) {
  for (let x = 0; x < els.length; x++) {
    cb(els[x], x)
  }
}