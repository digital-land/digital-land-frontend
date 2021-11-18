import BackToTop from "../../templates/components/back-to-top/back-to-top";
import FilterGroupSelectedCounter from "../../templates/components/dl-filter-group/filter-group-selected-counter";

function polyfill (options) {
  // polyfill for browsers without NodeList forEach method
  if (window.NodeList && !window.NodeList.prototype.forEach) {
    window.NodeList.prototype.forEach = window.Array.prototype.forEach
  }
}

export {
  polyfill,
  BackToTop,
  FilterGroupSelectedCounter
};