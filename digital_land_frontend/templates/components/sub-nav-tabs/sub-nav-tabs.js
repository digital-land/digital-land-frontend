import '../../../../node_modules/govuk-frontend/govuk/vendor/polyfills/Function/prototype/bind'
import '../../../../node_modules/govuk-frontend/govuk/vendor/polyfills/Element/prototype/classList'
import '../../../../node_modules/govuk-frontend/govuk/vendor/polyfills/Element/prototype/nextElementSibling'
import '../../../../node_modules/govuk-frontend/govuk/vendor/polyfills/Element/prototype/previousElementSibling'
import '../../../../node_modules/govuk-frontend/govuk/vendor/polyfills/Event' // addEventListener and event.target normaliziation

function nodeListForEach (nodes, callback) {
  if (window.NodeList.prototype.forEach) {
    return nodes.forEach(callback)
  }
  for (var i = 0; i < nodes.length; i++) {
    callback.call(window, nodes[i], i, nodes)
  }
}

function SubNavTabs ($module) {
  this.$module = $module
  this.$body = document.querySelector('body')

  this.keys = { left: 37, right: 39, up: 38, down: 40 }
  this.jsHiddenClass = 'govuk-tabs__panel--hidden'
}

SubNavTabs.prototype.init = function (params) {
  this.setupOptions(params)
  this.$tabs = this.$module.querySelectorAll(this.subNavTabsSelector)

  if (typeof window.matchMedia === 'function') {
    this.setupResponsiveChecks()
  } else {
    this.setup()
  }

  return this
}

SubNavTabs.prototype.setupResponsiveChecks = function () {
  this.mql = window.matchMedia('(min-width: 40.0625em)')
  this.mql.addListener(this.checkMode.bind(this))
  this.checkMode()
}

SubNavTabs.prototype.checkMode = function () {
  if (this.mql.matches) {
    this.setup()
  } else {
    this.teardown()
  }
}

SubNavTabs.prototype.setup = function () {
  var $module = this.$module
  var $tabs = this.$tabs
  var $tabList = $module.querySelector(this.subNavListSelector)
  var $tabListItems = $module.querySelectorAll(this.subNavListItemSelector)

  if (!$tabs || !$tabList || !$tabListItems) {
    return
  }

  $tabList.setAttribute('role', 'tablist')

  nodeListForEach($tabListItems, function ($item) {
    $item.setAttribute('role', 'presentation')
  })

  nodeListForEach($tabs, function ($tab) {
    // Set HTML attributes
    this.setAttributes($tab)

    // Save bounded functions to use when removing event listeners during teardown
    $tab.boundTabClick = this.onTabClick.bind(this)
    $tab.boundTabKeydown = this.onTabKeydown.bind(this)

    // Handle events
    $tab.addEventListener('click', $tab.boundTabClick, true)
    $tab.addEventListener('keydown', $tab.boundTabKeydown, true)

    // Remove old active panels
    this.hideTab($tab)
  }.bind(this))

  // Show either the active tab according to the URL's hash or the first tab
  var $activeTab = this.getTab(window.location.hash) || this.$tabs[0]
  this.showTab($activeTab)

  // Handle hashchange events
  $module.boundOnHashChange = this.onHashChange.bind(this)
  window.addEventListener('hashchange', $module.boundOnHashChange, true)

  // Add class to acknowledge module has been initiated
  this.$body.classList.add(this.subNavActivatedClass)
}

SubNavTabs.prototype.teardown = function () {
  var $module = this.$module
  var $tabs = this.$tabs
  var $tabList = $module.querySelector(this.subNavListSelector)
  var $tabListItems = $module.querySelectorAll(this.subNavListItemSelector)

  if (!$tabs || !$tabList || !$tabListItems) {
    return
  }

  $tabList.removeAttribute('role')

  nodeListForEach($tabListItems, function ($item) {
    $item.removeAttribute('role', 'presentation')
  })

  nodeListForEach($tabs, function ($tab) {
    // Remove events
    $tab.removeEventListener('click', $tab.boundTabClick, true)
    $tab.removeEventListener('keydown', $tab.boundTabKeydown, true)

    // Unset HTML attributes
    this.unsetAttributes($tab)
  }.bind(this))

  // Remove hashchange event handler
  window.removeEventListener('hashchange', $module.boundOnHashChange, true)

  // Remove class acknowledging module was initiated
  this.$body.classList.remove(this.subNavActivatedClass)
}

SubNavTabs.prototype.onHashChange = function (e) {
  var hash = window.location.hash
  // if user hits back button to none hashed state then need to show the first tab
  var $tabWithHash = this.getTab(hash) || this.$tabs[0]

  // Prevent changing the hash
  if (this.changingHash) {
    this.changingHash = false
    return
  }

  // Show either the active tab according to the URL's hash or the first tab
  var $previousTab = this.getCurrentTab()

  this.hideTab($previousTab)
  this.showTab($tabWithHash)
  $tabWithHash.focus()
}

SubNavTabs.prototype.hideTab = function ($tab) {
  this.unhighlightTab($tab)
  this.hidePanel($tab)
}

SubNavTabs.prototype.showTab = function ($tab) {
  this.highlightTab($tab)
  this.showPanel($tab)
}

SubNavTabs.prototype.getTab = function (hash) {
  return this.$module.querySelector(`${this.subNavTabsSelector}[href="${hash}"]`)
}

SubNavTabs.prototype.setAttributes = function ($tab) {
  // set tab attributes
  var panelId = this.getHref($tab).slice(1)
  $tab.setAttribute('id', 'tab_' + panelId)
  $tab.setAttribute('role', 'tab')
  $tab.setAttribute('aria-controls', panelId)
  $tab.setAttribute('aria-selected', 'false')
  $tab.setAttribute('tabindex', '-1')

  // set panel attributes
  var $panel = this.getPanel($tab)
  $panel.setAttribute('role', 'tabpanel')
  $panel.setAttribute('aria-labelledby', $tab.id)
  $panel.classList.add(this.jsHiddenClass)
}

SubNavTabs.prototype.unsetAttributes = function ($tab) {
  // unset tab attributes
  $tab.removeAttribute('id')
  $tab.removeAttribute('role')
  $tab.removeAttribute('aria-controls')
  $tab.removeAttribute('aria-selected')
  $tab.removeAttribute('tabindex')

  // unset panel attributes
  var $panel = this.getPanel($tab)
  $panel.removeAttribute('role')
  $panel.removeAttribute('aria-labelledby')
  $panel.classList.remove(this.jsHiddenClass)
}

SubNavTabs.prototype.onTabClick = function (e) {
  const tabClass = this.subNavTabsSelector.replace('.', '')
  if (!e.target.classList.contains(tabClass)) {
  // Allow events on child DOM elements to bubble up to tab parent
    return false
  }
  e.preventDefault()
  var $newTab = e.target
  var $currentTab = this.getCurrentTab()
  this.hideTab($currentTab)
  this.showTab($newTab)
  this.createHistoryEntry($newTab)
}

SubNavTabs.prototype.createHistoryEntry = function ($tab) {
  var $panel = this.getPanel($tab)

  // Save and restore the id
  // so the page doesn't jump when a user clicks a tab (which changes the hash)
  var id = $panel.id
  $panel.id = ''
  this.changingHash = true
  window.location.hash = this.getHref($tab).slice(1)
  $panel.id = id
}

SubNavTabs.prototype.onTabKeydown = function (e) {
  switch (e.keyCode) {
    case this.keys.left:
    case this.keys.up:
      this.activatePreviousTab()
      e.preventDefault()
      break
    case this.keys.right:
    case this.keys.down:
      this.activateNextTab()
      e.preventDefault()
      break
  }
}

SubNavTabs.prototype.activateNextTab = function () {
  var currentTab = this.getCurrentTab()
  var nextTabListItem = currentTab.parentNode.nextElementSibling
  if (nextTabListItem) {
    var nextTab = nextTabListItem.querySelector(this.subNavTabsSelector)
  }
  if (nextTab) {
    this.hideTab(currentTab)
    this.showTab(nextTab)
    nextTab.focus()
    this.createHistoryEntry(nextTab)
  }
}

SubNavTabs.prototype.activatePreviousTab = function () {
  var currentTab = this.getCurrentTab()
  var previousTabListItem = currentTab.parentNode.previousElementSibling
  if (previousTabListItem) {
    var previousTab = previousTabListItem.querySelector(this.subNavTabsSelector)
  }
  if (previousTab) {
    this.hideTab(currentTab)
    this.showTab(previousTab)
    previousTab.focus()
    this.createHistoryEntry(previousTab)
  }
}

SubNavTabs.prototype.getPanel = function ($tab) {
  var $panel = this.$module.querySelector(this.getHref($tab))
  return $panel
}

SubNavTabs.prototype.showPanel = function ($tab) {
  var $panel = this.getPanel($tab)
  $panel.classList.remove(this.jsHiddenClass)
}

SubNavTabs.prototype.hidePanel = function (tab) {
  var $panel = this.getPanel(tab)
  $panel.classList.add(this.jsHiddenClass)
}

SubNavTabs.prototype.unhighlightTab = function ($tab) {
  $tab.setAttribute('aria-selected', 'false')
  $tab.parentNode.classList.remove(this.subNavTabSelectedClass)
  $tab.setAttribute('tabindex', '-1')
}

SubNavTabs.prototype.highlightTab = function ($tab) {
  $tab.setAttribute('aria-selected', 'true')
  $tab.parentNode.classList.add(this.subNavTabSelectedClass)
  $tab.setAttribute('tabindex', '0')
}

SubNavTabs.prototype.getCurrentTab = function () {
  const selector = `.${this.subNavTabSelectedClass} ${this.subNavTabsSelector}`
  return this.$module.querySelector(selector)
}

// this is because IE doesn't always return the actual value but a relative full path
// should be a utility function most prob
// http://labs.thesedays.com/blog/2010/01/08/getting-the-href-value-with-jquery-in-ie/
SubNavTabs.prototype.getHref = function ($tab) {
  var href = $tab.getAttribute('href')
  var hash = href.slice(href.indexOf('#'), href.length)
  return hash
}

SubNavTabs.prototype.setupOptions = function (params) {
  params = params || {}
  this.subNavActivatedClass = params.subNavActivatedClass || 'dl-subnav--init'
  this.subNavListSelector = params.subNavListSelector || '.dl-subnav__list'
  this.subNavListItemSelector = params.subNavListItemSelector || '.dl-subnav__list-item'
  this.subNavTabsSelector = params.subNavTabsSelector || '.dl-subnav__list-item__link'
  this.subNavTabSelectedClass = params.subNavTabSelectedClass || 'dl-subnav__list-item--selected'
  this.hideClass = params.hideClass || 'back-to-top--hidden'
  this.fixClass = params.fixClass || 'back-to-top--fixed'
}

export default SubNavTabs
