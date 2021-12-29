import { convertNodeListToArray } from "./helpers/nodelist_to_array";
import BackToTop from "../../templates/components/back-to-top/back-to-top";
import FilterCheckboxes from "../../templates/components/filter-checkboxes/filter-checkboxes";
import FilterGroupSelectedCounter from "../../templates/components/filter-group/filter-group-selected-counter";
import HorizontalScrollableTable from "../../templates/components/data-table/horizontal-scrollable-table";
import ListFilter from "../../templates/components/list-filter/list-filter";
import SubNavTabs from "../../templates/components/sub-nav-tabs/sub-nav-tabs";

function polyfill (options) {
  // polyfill for browsers without NodeList forEach method
  if (window.NodeList && !window.NodeList.prototype.forEach) {
    window.NodeList.prototype.forEach = window.Array.prototype.forEach
  }
}

function initAll (options) {
  // Set the options to an empty object by default if no options are passed.
  options = typeof options !== 'undefined' ? options : {}

  // Allow the user to initialise Digital Land Frontend in only certain sections of the page
  // Defaults to the entire document if nothing is set.
  var scope = typeof options.scope !== 'undefined' ? options.scope : document

  // load required polyfills
  polyfill()

  var $bttButtons = convertNodeListToArray(scope.querySelectorAll('[data-module="dl-back-to-top-button"]'))
  $bttButtons.forEach(function ($button) {
    new BackToTop($button).init()
  })

  var $formToFilterList = scope.querySelector('[data-module="dl-list-filter-form"]')
  if ($formToFilterList) {
    new ListFilter($formToFilterList).init()
  }

  var $filters = scope.querySelectorAll('[data-module="selected-counter"]')
  $filters.forEach(function($filter) {
    new FilterGroupSelectedCounter($filter).init()
  })

  var $filterCheckboxes = scope.querySelectorAll('[data-module="filter-checkboxes"]')
  $filterCheckboxes.forEach(function($el) {
    new FilterCheckboxes($el).init()
  })
}

export {
  initAll,
  polyfill,
  BackToTop,
  FilterCheckboxes,
  FilterGroupSelectedCounter,
  HorizontalScrollableTable,
  ListFilter,
  SubNavTabs
};
