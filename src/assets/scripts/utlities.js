const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)

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

/**
 * Smooth scroll to a target
 * Optionally pass offest (in px) as second argument.
 * @param {HTMLElement} $el  
 * @param {Number} offset 
 */
function scrollToTarget($el, offset = 0) {
  var elementPosition = $el.getBoundingClientRect().top;
  var offsetPosition = elementPosition + offset;
  window.scrollTo({
    top: offsetPosition,
    behavior: 'smooth'
  });
}

module.exports = {
  $,
  $$,
  each,
  scrollToTarget
}