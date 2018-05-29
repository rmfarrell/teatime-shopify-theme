import { $, $$, each } from '../utlities';
import jq from 'jquery';

const activeClassName = 'active'



// Attach a pushstate handler to tabs and products.
// Show/apply active state to each 
function Tabs() {
  const $tabbedContainer = $('article.tabbed')
  const $$tabs = $tabbedContainer.querySelectorAll('.tabs li > a')
  const $$products = $$('.product-container')

  if ($tabbedContainer) {

    // Attach pushState trigger to tabs
    each($$tabs, ($tab) => {
      $tab.addEventListener('click', (ev) => {
        if (!window.history.pushState) {
          return true;
        }
        ev.preventDefault();
        history.pushState({ tab: $tab.getAttribute('href') }, null, $tab.getAttribute('href'));
        // history.replaceState({ tab: $tab.getAttribute('href') }, null, $tab.getAttribute('href'));
        return false;
      })
    });

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

  function update(hash = '') {
    if (hash === '') return
    updateTabs(hash)
    updateProducts(hash)
  }

  function updateTabs(hash = '') {
    each($$tabs, ($t) => {
      if (hash === $t.getAttribute('href')) {
        return $t.classList.add('active')
      }
      $t.classList.remove(activeClassName)
    })
  }

  function updateProducts(hash = '') {
    each($$products, ($p) => {
      // console.log(hash)
      console.log($p.id)
      if (hash === `#${$p.id}`) {
        return $p.classList.add('active')
      }
      $p.classList.remove(activeClassName)
    })
  }

  return { update }
}

Tabs().update(window.location.hash)