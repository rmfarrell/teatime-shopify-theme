import { $, $$, each, scrollToTarget } from '../utilities';
import fetch from 'unfetch';
import serialize from 'form-serialize'
import jq from 'jquery';
import { cart } from '../events';

// -- AJAX-ify the form
each($$('form[action="/cart/add"]'), ($form) => {
  $form.addEventListener('submit', (ev) => {
    ev.preventDefault()

    fetch('/cart/add.js', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify(serialize($form, { hash: true }))
    })
      .then((res) => res.json())
      // TODO: handle error
      .then(r => console.log(r))
      .then(() => window.dispatchEvent(cart.update))
      .catch(e => $form.submit())


    return false;
  })
})

// -- Intialize the tabbed section
if ($('article.tabbed')) {
  Tabs().init(window.location.hash)
}

// -- Swap images on hover/touch
each($$('[data-product-img-count]'), ($container) => {
  if (parseInt($container.getAttribute('data-product-img-count'), 10) < 2) {
    return;
  }
  const ec = ElementCycler($container.querySelectorAll('.img-wrapper'))
  $container.addEventListener('click', ec.next)
})

/**
 * Attach a pushstate handler to tabs and products.
 * Show/apply active state to each
 * @return {Object.Function} update update state pass in hash
 * @return {Object.Function} init initialize with a hash string
 */
function Tabs() {
  const activeClassName = 'active';
  const expandMobileClass = 'expanded';
  const animationTime = 300;
  const $tabbedContainer = $('article.tabbed');
  const $tabsParent = $tabbedContainer.querySelector('nav.tabs')
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
        history.pushState({}, null, $tab.getAttribute('href'));

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

    // collapse menu on mobile
    $tabbedContainer.classList.remove(expandMobileClass);
  }

  function init(hash = '') {
    if (!hash) return;
    _updateTabs(hash)
    _initPages(hash)
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
   * Trigger in and out animations for transition effect.
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
        $tabsParent.scrollIntoView({
          behavior: "smooth",
          block: "start"
        })

        return setTimeout(() => {
          $new.classList.remove('in')
        }, animationTime)
      })
      .catch((e) => console.log(e))
  }
  return { update, init }
}

/**
 * Cycle an active state accross an array of elements
 * @param {HTMLNodeList} $$imgs
 * @param {String} activeClass
 * @return {Object.Function} next applies the activeclass on the next element in $$imgs
 */
function ElementCycler($$imgs, activeClass = 'active') {
  $$imgs = Array.prototype.slice.call($$imgs)
  let activeIdx = _getActiveIndex()

  function next() {
    _reset()
    activeIdx = _getNext();
    $$imgs[activeIdx].classList.add(activeClass)
  }

  function _reset() {
    $$imgs.forEach(($img) => {
      $img.classList.remove(activeClass);
    });
  }

  function _getNext() {
    return $$imgs.length > activeIdx + 1 ? activeIdx + 1 : 0
  }

  function _getActiveIndex() {
    let out = 0
    $$imgs.forEach(($img, idx) => {
      if ($img.classList.contains(activeClass)) {
        out = idx;
      }
    });
    return out;
  }

  return {
    next,
  }
}