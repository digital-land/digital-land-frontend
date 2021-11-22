import BackToTop from "../../templates/components/back-to-top/back-to-top";
import FilterCheckboxes from "../../templates/components/dl-filter-checkboxes/filter-checkboxes";
import FilterGroupSelectedCounter from "../../templates/components/dl-filter-group/filter-group-selected-counter";
import HorizontalScrollableTable from "../../templates/components/dl-data-table/horizontal-scrollable-table";
import ListFilter from "../../templates/components/dl-list-filter/list-filter";
import SubNavTabs from "../../templates/components/dl-sub-nav-tabs/sub-nav-tabs";

function polyfill (options) {
  // polyfill for browsers without NodeList forEach method
  if (window.NodeList && !window.NodeList.prototype.forEach) {
    window.NodeList.prototype.forEach = window.Array.prototype.forEach
  }
}

export {
  polyfill,
  BackToTop,
  FilterCheckboxes,
  FilterGroupSelectedCounter,
  HorizontalScrollableTable,
  ListFilter,
  SubNavTabs
};
