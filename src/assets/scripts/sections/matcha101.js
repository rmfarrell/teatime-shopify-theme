import { $, $$ } from '../utilities'

(() => {
  const $stacksContainer = $('#how-it-stacks-up')
  if (!$stacksContainer) return;
  const containerClassesInital = $stacksContainer.className
  const $$tabs = $stacksContainer.querySelectorAll('[data-switch-to]')
  const $$contents = $stacksContainer.querySelectorAll('[data-contents]')
  const $$figureContents = $stacksContainer.querySelectorAll('[data-figure-contents]')

  const ss = simpleStateManager(0, (v) => {

    // update tagged content
    addActiveOnIndexChange($$tabs, v)
    addActiveOnIndexChange($$contents, v)
    addActiveOnIndexChange($$figureContents, v)

    // change container class name
    $stacksContainer.className = `active-frame-${v} ${containerClassesInital}`;

    // TODO: handle figure change
  })

  // attach handlers
  $$tabs.forEach(($tab, idx) => {
    $tab.addEventListener('click', () => ss.update(idx))
  })

  ss.update(0)

  function addActiveOnIndexChange($$els, targetIndex) {
    $$els.forEach(($el, idx) => {
      if (idx === targetIndex) {
        $el.classList.add('active');
        return;
      }
      $el.classList.remove('active');
    })
  }

  function simpleStateManager(value, onUpdate = function () { }) {
    let _value = value
    const obj = Object.assign(value, {
      get() {
        return _value
      },
      set(v) {
        onUpdate(v, _value)
        _value = v
      }
    })

    function update(v) {
      obj.set(v)
    }

    return { update }
  }
})()