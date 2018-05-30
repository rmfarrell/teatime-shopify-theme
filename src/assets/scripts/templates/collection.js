import { $, $$, each } from '../utlities';
import jq from 'jquery';

/**
 * Attach a pushstate handler to tabs and products.
 * Show/apply active state to each
 * @return {Object.Function} update state pass in hash
 */
function Tabs() {
  const activeClassName = 'active'
  const $tabbedContainer = $('article.tabbed')
  let $$tabs, $$products

  if ($tabbedContainer) {
    $$tabs = $tabbedContainer.querySelectorAll('.tabs li > a')
    $$products = $$('.product-container')

    // Attach pushState trigger to tabs
    each($$tabs, ($tab) => {
      $tab.addEventListener('click', (ev) => {
        if (!window.history.pushState) {
          return true;
        }
        ev.preventDefault();
        history.pushState({ tab: $tab.getAttribute('href') },
          null,
          $tab.getAttribute('href'));
        return false;
      })
    });

    // Intercept changes to pushstate
    (function (history) {
      var pushState = history.pushState;
      history.pushState = function (state, title, hash) {
        if (typeof history.onpushstate == 'function') {
          history.onpushstate(state);
        }
        update(hash)
        return pushState.apply(history, [state, title, hash]);
      };
    })(window.history)
  }

  /**
   * Update the state of tabs/shown section
   * @param {String} hash
   */
  function update(hash = '') {
    if (hash === '') return
    _updateTabs(hash)
    _updateProducts(hash)
  }

  /**
   * Set the active class on the current the current tab
   * @param {String} hash 
   */
  function _updateTabs(hash = '') {
    each($$tabs, ($t) => {
      if (hash === $t.getAttribute('href')) {
        return $t.classList.add(activeClassName)
      }
      $t.classList.remove(activeClassName)
    })
  }

  /**
   * Set the active class on the current the section content
   * @param {String} hash 
   */
  function _updateProducts(hash = '') {
    each($$products, ($p) => {
      if (hash === `#${$p.id}`) {
        return $p.classList.add(activeClassName)
      }
      $p.classList.remove(activeClassName)
    })
  }

  return { update }
}

Tabs().update(window.location.hash)