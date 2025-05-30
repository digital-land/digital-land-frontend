function convertNodeListToArray (nl) {
  return Array.prototype.slice.call(nl)
}

// Currently works by looking for all lists and list items on the page, not confined to a section of a page.
// We might want to change this so that it is more flexible.
// Is there a situation where we need more than one list search on a page?

// similar to
// https://github.com/alphagov/collections/blob/e1f3c74facd889426d24ac730ed0057aa64e2801/app/assets/javascripts/organisation-list-filter.js
function ListFilter ($form) {
  this.$form = $form
  this.filterTimeout = null
  this.$noMatches = document.querySelector('.dl-list-filter__no-filter-match')
}

ListFilter.prototype.init = function (params) {
  this.setupOptions(params)
  const $form = this.$form
  // Form should only appear if the JS is working
  $form.classList.add('list-filter__form--active')

  // We don't want the form to submit/refresh the page on enter key
  $form.addEventListener('submit', function () { return false })

  const $input = $form.querySelector('input')
  const boundFilterViaTimeout = this.filterViaTimeout.bind(this)
  $input.addEventListener('keyup', boundFilterViaTimeout)

  // make sure no matches message is initially hidden
  this.$noMatches.classList.add('js-hidden')
}

ListFilter.prototype.filterViaTimeout = function (e) {
  clearTimeout(this.filterTimeout)

  const boundListFilter = this.ListFilter.bind(this)
  this.filterTimeout = setTimeout(function () {
    boundListFilter(e)
  }, 200)
}

ListFilter.prototype.ListFilter = function (e) {
  const itemsToFilter = convertNodeListToArray(document.querySelectorAll('[data-filter="item"]'))
  const listsToFilter = convertNodeListToArray(document.querySelectorAll('[data-filter="list"]'))
  const searchTerm = e.target.value

  // set a class if a search/filter is in progress
  this.setActiveClasses(listsToFilter, searchTerm)

  const boundMatchSearchTerm = this.matchSearchTerm.bind(this)
  itemsToFilter
    .filter(function ($item) {
      return boundMatchSearchTerm($item, searchTerm)
    })
    .forEach(function (item) {
      item.classList.add('js-hidden')
    })

  this.updateListCounts(listsToFilter)
}

ListFilter.prototype.termToMatchOn = function (item) {
  const toConsider = item.querySelectorAll('[data-filter="match-content"]')
  if (toConsider.length) {
    const toConsiderArr = convertNodeListToArray(toConsider)
    const toConsiderStrs = toConsiderArr.map(function (el) {
      return el.textContent
    })
    return toConsiderStrs.join(';')
  }
  return item.querySelector('a').textContent
}

ListFilter.prototype.matchSearchTerm = function (item, term) {
  // const itemLabels = item.dataset.filterItemLabels
  const contentToMatchOn = this.termToMatchOn(item)
  item.classList.remove('js-hidden')
  var searchTermRegexp = new RegExp(term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i')
  if (searchTermRegexp.exec(contentToMatchOn) !== null) {
    return false
  }
  return true
}

ListFilter.prototype.setActiveClasses = function(lists, searchTerm) {
  lists.forEach(list => {
    if (searchTerm !== '') {
      list.classList.add(this.list_filtered_class);
    } else {
      list.classList.remove(this.list_filtered_class);
    }
  })
}

ListFilter.prototype.updateListCounts = function (lists) {
  var totalMatches = 0
  const list_section_selector = this.list_section_selector
  const count_wrapper_selector = this.count_wrapper_selector

  lists.forEach(function (list) {
    var matchingCount = list.querySelectorAll('[data-filter="item"]:not(.js-hidden)').length
    var listSection = list.closest(list_section_selector)
    var countWrapper = listSection.querySelector(count_wrapper_selector)
    var listCount = countWrapper.querySelector('.js-list-filter__count')
    var accessibleListCount = countWrapper.querySelector('.js-accessible-list-filter__count')

    // show/hide sections with matching items
    if (matchingCount > 0) {
      listSection.classList.remove('js-hidden')
      listCount.textContent = matchingCount
      accessibleListCount.textContent = matchingCount
    } else {
      listSection.classList.add('js-hidden')
    }

    totalMatches += matchingCount

    var filteredEvent = new CustomEvent('list:filtered')
    list.dispatchEvent(filteredEvent)
  })

  // if no results show message
  if (this.$noMatches) {
    if (totalMatches === 0) {
      this.$noMatches.classList.remove('js-hidden')
    } else {
      this.$noMatches.classList.add('js-hidden')
    }
  }
}

ListFilter.prototype.setupOptions = function (params) {
  params = params || {}
  this.list_section_selector = params.list_section_selector || '.dl-list-filter__count'
  this.count_wrapper_selector = params.count_wrapper_selector || '.dl-list-filter__count__wrapper'
  this.list_filtered_class = params.list_filtered_class || 'dl-list-filter__filtered-listed'
}

export default ListFilter
