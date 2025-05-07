// Back to top module as seen in govuk-design-system
// https://github.com/alphagov/govuk-design-system/blob/master/src/javascripts/components/back-to-top.js
function BackToTop($module) {
  this.$module = $module;
}

BackToTop.prototype.init = function (params) {
  this.setupOptions(params);
  // Check if we can use Intersection Observers
  if (!("IntersectionObserver" in window)) {
    // If there's no support fallback to regular behaviour
    // Since JavaScript is enabled we can remove the default hidden state
    return this.$module.classList.remove(this.hideClass);
  }

  var $start = document.querySelector(this.startElementSelector);
  var $end = document.querySelector(this.endElementSelector);

  // Check if there is anything to observe
  if (!$end || !$start) {
    return;
  }

  let endIsIntersecting = false;
  let startIsIntersecting = false;
  let startIntersectionRatio = 0;

  var observer = new window.IntersectionObserver(
    function (entries) {
      // Find the elements we care about from the entries
      var endEntry = entries.find(function (entry) {
        return entry.target === $end;
      });
      var startEntry = entries.find(function (entry) {
        return entry.target === $start;
      });

      // If there is an entry this means the element has changed so lets check if it's intersecting.
      if (endEntry) {
        endIsIntersecting = endEntry.isIntersecting;
      }
      if (startEntry) {
        startIsIntersecting = startEntry.isIntersecting;
        startIntersectionRatio = startEntry.intersectionRatio;
      }

      // If the subnav or the footer not visible then fix the back to top link to follow the user
      if (startIsIntersecting || endIsIntersecting) {
        this.$module.classList.remove(this.fixClass);
      } else {
        this.$module.classList.add(this.fixClass);
      }

      // If the subnav is visible but you can see it all at once, then a back to top link is likely not as useful.
      // We hide the link but make it focusable for screen readers users who might still find it useful.
      if (startIsIntersecting && startIntersectionRatio === 1) {
        this.$module.classList.add(this.hideClass);
      } else {
        this.$module.classList.remove(this.hideClass);
      }
    }.bind(this)
  );

  observer.observe($end);
  observer.observe($start);
};

BackToTop.prototype.passedBottom = function ($el) {
  var $elPos = $el.getClientRects();
  var viewportBottom = window.scrollY + window.innerHeight;
  return $elPos < viewportBottom;
};

BackToTop.prototype.setupOptions = function (params) {
  params = params || {};
  this.endElementSelector = params.endElementSelector || ".back-to-top__end";
  this.startElementSelector = params.startElementSelector || ".back-to-top__start";
  this.hideClass = params.hideClass || "back-to-top--hidden";
  this.fixClass = params.fixClass || "back-to-top--fixed";
};

export default BackToTop;
