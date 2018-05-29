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

module.exports = {
  $,
  $$,
  each
}