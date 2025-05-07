// ====================================
// Filter checkboxes module
// ====================================

// to do (see https://www.gov.uk/search/all?keywords=publications&content_purpose_supergroup%5B%5D=services&organisations%5B%5D=academy-for-social-justice&order=relevance)
// - aria-describedby, hidden span that counts how many options are showing and how many of them are selected
// - aria-controls, indicate that it controls the list of checkboxes
// - hide textbox when no js

function FilterCheckboxes ($module) {
  this.$module = $module
  this.$textbox = $module.querySelector('.dl-filter-group__auto-filter__input')
}

FilterCheckboxes.prototype.init = function (params) {
  this.setupOptions(params)
  var $module = this.$module
  this.checkboxArr = [...$module.querySelectorAll(this.listItemSelector)]
  var $checkboxes = this.checkboxArr

  // if no checkboxes then return
  if (!$checkboxes) {
    return
  }

  // returns true is the item has been hidden with display:none
  this.isDisplayNone = function (el) {
    var style = window.getComputedStyle(el)
    return ((style.display === 'none') || (style.visibility === 'hidden'))
  }

  // returns true if the item's checkbox is checked
  this.isItemChecked = function (el) {
    var chbx = el.querySelector('input')
    return chbx.checked
  }

  this.ariaDescription = $module.querySelector('.dl-filter-group__auto-filter__desc')
  // To do: check it exists
  // set initial aria message
  var boundUpdateAriaDescribedBy = this.updateAriaDescribedBy.bind(this)
  boundUpdateAriaDescribedBy()

  // Bind event changes to the textarea
  var boundInputEvents = this.bindInputEvents.bind(this)
  boundInputEvents()
}

FilterCheckboxes.prototype.getCheckboxInput = function (el) {
  return el.querySelector('input')
}

FilterCheckboxes.prototype.bindInputEvents = function () {
  var $textbox = this.$textbox
  var checkboxArr = this.checkboxArr.map(this.getCheckboxInput)

  $textbox.addEventListener('input', this.filterCheckboxes.bind(this))

  var boundUpdateAriaDescribedBy = this.updateAriaDescribedBy.bind(this)
  checkboxArr.forEach(chbxEl => chbxEl.addEventListener('change', boundUpdateAriaDescribedBy))
}

FilterCheckboxes.prototype.filterCheckboxes = function () {
  var $textbox = this.$textbox
  var boundFilterCheckboxesArr = this.filterCheckboxesArr.bind(this)
  // filter the array of checkboxes
  var reducedArr = boundFilterCheckboxesArr($textbox.value)

  var boundUpdateAriaDescribedBy = this.updateAriaDescribedBy.bind(this)

  // show only those checkboxes remaining
  var boundDisplayMatchingCheckboxes = this.displayMatchingCheckboxes.bind(this)
  boundDisplayMatchingCheckboxes(reducedArr, boundUpdateAriaDescribedBy)
}

FilterCheckboxes.prototype.filterCheckboxesArr = function (query) {
  var checkboxArr = this.checkboxArr
  return checkboxArr.filter(function (el) {
    const checkbox = el.querySelector('label')
    return checkbox.textContent.toLowerCase().indexOf(query.toLowerCase()) !== -1
  })
}

function setCheckboxDisplay (ckbx, displayValue) {
  ckbx.style.display = displayValue
}

FilterCheckboxes.prototype.displayMatchingCheckboxes = function (ckbxArr, cb) {
  // hide all
  this.checkboxArr.forEach((ckbx) => setCheckboxDisplay(ckbx, 'none'))
  // re show those in filtered array
  ckbxArr.forEach((ckbx) => setCheckboxDisplay(ckbx, 'block'))

  if (cb) {
    cb()
  }
}

FilterCheckboxes.prototype.updateAriaDescribedBy = function () {
  var checkboxArr = this.checkboxArr
  var displayedCheckboxes = checkboxArr.filter(chbx => !this.isDisplayNone(chbx))
  var checkedAndDisplayed = displayedCheckboxes.filter(chbx => this.isItemChecked(chbx))

  var boundGenerateAriaMessage = this.generateAriaMessage.bind(this)
  boundGenerateAriaMessage(displayedCheckboxes.length, checkedAndDisplayed.length)
}

FilterCheckboxes.prototype.generateAriaMessage = function (optionCount, selectedCount) {
  var ariaEl = this.ariaDescription
  var optionStr = ariaEl.dataset.single
  if (optionCount > 1) {
    optionStr = ariaEl.dataset.multiple
  }

  ariaEl.textContent = optionCount + ' ' + optionStr + ', ' + selectedCount + ' ' + ariaEl.dataset.selected
}

FilterCheckboxes.prototype.setupOptions = function (params) {
  params = params || {}
  this.listItemSelector = params.listItemSelector || '.govuk-checkboxes__item'
}

export default FilterCheckboxes
