import { $, $$, each } from '../utlities';
import jq from 'jquery';

/**
 * Attach a pushstate handler to tabs and products.
 * Show/apply active state to each
 * @return {Object.Function} update update state pass in hash
 * @return {Object.Function} init initialize with a hash string
 */
function Tabs() {
  const activeClassName = 'active';
  const expandMobileClass = 'expanded';
  const animationTime = 250;
  const $tabbedContainer = $('article.tabbed');
  let $$tabs;
  let $$pages;
  let $currentPage;
  let $oldPage;

  if ($tabbedContainer) {
    $$tabs = $tabbedContainer.querySelectorAll('.tabs li > a')
    $$pages = $$('.product-container')
    $currentPage = Array.prototype.find.call($$pages,
      ($p) => $p.classList.contains(activeClassName));

    // Attach pushState trigger to tabs
    each($$tabs, ($tab) => {
      $tab.addEventListener('click', (ev) => {

        // update pushstate
        if (!window.history.pushState) {
          return true;
        }
        ev.preventDefault();

        // handle mobile nav expanding/collapsing
        if ($tab.classList.contains(activeClassName)) {
          $tabbedContainer.classList.toggle(expandMobileClass);
          return false;
        }

        // push to pushState
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
    _updatePage(hash)
  }

  function init(hash = '') {
    if (!hash) return;
    _updateTabs(hash)
    _initPages(hash)
    console.log($currentPage)
  }

  function _initPages(hash = '') {
    each($$pages, ($p) => {
      if (hash === `#${$p.id}`) {
        $currentPage = $p
        return $p.classList.add(activeClassName)
      }
      $p.classList.remove(activeClassName)
    })
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
      return $t.classList.remove(activeClassName)
    })
  }

  /**
   * Set the active class on the current the section content
   * @param {String} hash 
   */
  function _updatePage(hash = '') {
    $oldPage = $currentPage
    each($$pages, ($p) => {
      if (hash === `#${$p.id}`) { $currentPage = $p }
    })
    return _animate($currentPage, $oldPage, animationTime)
  }

  function _animate($new, $old, t) {
    $old.classList.add('out')
    return new Promise((resolve) => {
      return setTimeout(() => {
        $old.classList.remove('out', activeClassName);
        resolve()
      }, animationTime)
    })
      .then(() => {
        $new.classList.add('in', activeClassName)
        return setTimeout(() => {
          $new.classList.remove('in')
        }, animationTime)
      })
      .catch((e) => {
        console.log(e)
      })
  }
  return { update, init }
}

Tabs().init(window.location.hash)