import '../../../../node_modules/govuk-frontend/govuk/vendor/polyfills/Function/prototype/bind'

/*
  Selected counts for filter

  Used with the FilterGroup component to display the
  number of selected items in the filter group list.

*/

function FilterGroupSelectedCounter ($module) {
  this.$module = $module
  this.$fieldset = $module.querySelector('fieldset')
  this.$inputs = this.$fieldset.querySelectorAll('input')
}

FilterGroupSelectedCounter.prototype.init = function () {
  var $inputs = this.$inputs

  // if no inputs then return
  if (!$inputs) {
    return
  }

  //
  var boundFetchCountElement = this.fetchCountElement.bind(this)
  this.countMessage = boundFetchCountElement()

  // if current count is 0 hide the message
  this.message_is_hidden = false
  if (this.currentCount === 0) {
    this.hideCountMessage()
  }

  // Bind event changes to the textarea
  var boundChangeEvents = this.bindChangeEvents.bind(this)
  boundChangeEvents()

  return this
}

FilterGroupSelectedCounter.prototype.fetchCountElement = function () {
  var $module = this.$module
  var countMessage = $module.querySelector('.dl-filter-group__selected-text')

  // if the count message doesn;t exist, create one
  if (!countMessage) {
    countMessage = this.createCountElement()
  }

  this.countElement = countMessage.querySelector('.dl-filter-group__selected-text__count')
  this.currentCount = parseInt(this.countElement.textContent)

  return countMessage
}

FilterGroupSelectedCounter.prototype.createCountElement = function () {
  var $module = this.$module
  var $summary = $module.querySelector('.dl-filter-group__summary')
  var firstIcon = $summary.querySelector('svg')

  var countMessage = document.createElement('span')
  countMessage.classList.add('dl-filter-group__selected-text')
  countMessage.textContent = ' selected'
  firstIcon.insertAdjacentElement('beforebegin', countMessage)

  countMessage.insertAdjacentHTML('afterbegin', '<span class="dl-filter-group__selected-text__count">0</span>')

  return countMessage
}

FilterGroupSelectedCounter.prototype.bindChangeEvents = function () {
  var $inputs = this.$inputs
  // console.log(this)
  $inputs.forEach(input => {
    input.addEventListener('change', this.updateCount.bind(this))
  })
}

FilterGroupSelectedCounter.prototype.updateCount = function () {
  var $fieldset = this.$fieldset
  var count = $fieldset.querySelectorAll('input:checked').length

  // if 0 hide
  if (count === 0) {
    this.countElement.textContent = 0
    this.hideCountMessage()
  } else if (count !== this.currentCount) {
    // if changed update
    this.countElement.textContent = count
    this.showCountMessage()
  }
  // if same, do nothing ----

  this.currentCount = count
}

FilterGroupSelectedCounter.prototype.hideCountMessage = function () {
  this.countMessage.classList.add('govuk-visually-hidden')
  this.message_is_hidden = true
}

FilterGroupSelectedCounter.prototype.showCountMessage = function () {
  this.countMessage.classList.remove('govuk-visually-hidden')
  this.message_is_hidden = false
}

export default FilterGroupSelectedCounter
