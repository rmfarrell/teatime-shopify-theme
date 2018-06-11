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

/**
 * Delay callback on an event listener
 * @param {Function} func 
 * @param {Number} wait 
 */
function debounce(func, wait = 100) {
  let timeout;
  return function (...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      func.apply(this, args);
    }, wait);
  };
}

/**
 * delagate an event
 * @param {HTMLElement} element 
 * @param {String} eventName 
 * @param {String} selector html selector
 * @param {Function} fn 
 */
function delegate(element, eventName, selector, fn) {
  element.addEventListener(eventName, function (event) {
    var possibleTargets = element.querySelectorAll(selector);
    var target = event.target;

    for (var i = 0, l = possibleTargets.length; i < l; i++) {
      var el = target;
      var p = possibleTargets[i];

      while (el && el !== element) {
        if (el === p) {
          return fn.call(p, event);
        }

        el = el.parentNode;
      }
    }
  });
}

function wrap(el, wrapper) {
  el.parentNode.insertBefore(wrapper, el);
  wrapper.appendChild(el);
}

function remove(el) {
  el.parentNode.removeChild(el);
}

/**
 * Find an element based on criteria defined in a filter function
 * @param {HTMLElement} el target element
 * @param {Function} fn filter function should return 
 */
function parentUntil(el, fn = function () { return true }) {
  if (!el.parentElement) return null;
  if (fn(el.parentElement)) return el.parentElement;
  return parentUntil(el.parentElement, fn);
}


module.exports = {
  $,
  $$,
  each,
  scrollToTarget,
  debounce,
  delegate,
  wrap,
  remove,
  parentUntil,
}