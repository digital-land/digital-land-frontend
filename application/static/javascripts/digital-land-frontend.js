(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.DLFrontend = {}));
})(this, (function (exports) { 'use strict';

  function convertNodeListToArray$1 (nl) {
    return Array.prototype.slice.call(nl)
  }

  (function (global, factory) {
  	typeof exports === 'object' && typeof module !== 'undefined' ? factory() :
  	typeof define === 'function' && define.amd ? define('GOVUKFrontend', factory) :
  	(factory());
  }(window, (function () {
  (function(undefined$1) {

  // Detection from https://github.com/Financial-Times/polyfill-service/blob/master/packages/polyfill-library/polyfills/Object/defineProperty/detect.js
  var detect = (
    // In IE8, defineProperty could only act on DOM elements, so full support
    // for the feature requires the ability to set a property on an arbitrary object
    'defineProperty' in Object && (function() {
    	try {
    		var a = {};
    		Object.defineProperty(a, 'test', {value:42});
    		return true;
    	} catch(e) {
    		return false
    	}
    }())
  );

  if (detect) return

  // Polyfill from https://cdn.polyfill.io/v2/polyfill.js?features=Object.defineProperty&flags=always
  (function (nativeDefineProperty) {

  	var supportsAccessors = Object.prototype.hasOwnProperty('__defineGetter__');
  	var ERR_ACCESSORS_NOT_SUPPORTED = 'Getters & setters cannot be defined on this javascript engine';
  	var ERR_VALUE_ACCESSORS = 'A property cannot both have accessors and be writable or have a value';

  	Object.defineProperty = function defineProperty(object, property, descriptor) {

  		// Where native support exists, assume it
  		if (nativeDefineProperty && (object === window || object === document || object === Element.prototype || object instanceof Element)) {
  			return nativeDefineProperty(object, property, descriptor);
  		}

  		if (object === null || !(object instanceof Object || typeof object === 'object')) {
  			throw new TypeError('Object.defineProperty called on non-object');
  		}

  		if (!(descriptor instanceof Object)) {
  			throw new TypeError('Property description must be an object');
  		}

  		var propertyString = String(property);
  		var hasValueOrWritable = 'value' in descriptor || 'writable' in descriptor;
  		var getterType = 'get' in descriptor && typeof descriptor.get;
  		var setterType = 'set' in descriptor && typeof descriptor.set;

  		// handle descriptor.get
  		if (getterType) {
  			if (getterType !== 'function') {
  				throw new TypeError('Getter must be a function');
  			}
  			if (!supportsAccessors) {
  				throw new TypeError(ERR_ACCESSORS_NOT_SUPPORTED);
  			}
  			if (hasValueOrWritable) {
  				throw new TypeError(ERR_VALUE_ACCESSORS);
  			}
  			Object.__defineGetter__.call(object, propertyString, descriptor.get);
  		} else {
  			object[propertyString] = descriptor.value;
  		}

  		// handle descriptor.set
  		if (setterType) {
  			if (setterType !== 'function') {
  				throw new TypeError('Setter must be a function');
  			}
  			if (!supportsAccessors) {
  				throw new TypeError(ERR_ACCESSORS_NOT_SUPPORTED);
  			}
  			if (hasValueOrWritable) {
  				throw new TypeError(ERR_VALUE_ACCESSORS);
  			}
  			Object.__defineSetter__.call(object, propertyString, descriptor.set);
  		}

  		// OK to define value unconditionally - if a getter has been specified as well, an error would be thrown above
  		if ('value' in descriptor) {
  			object[propertyString] = descriptor.value;
  		}

  		return object;
  	};
  }(Object.defineProperty));
  })
  .call('object' === typeof window && window || 'object' === typeof self && self || 'object' === typeof global && global || {});

  (function(undefined$1) {
    // Detection from https://github.com/Financial-Times/polyfill-service/blob/master/packages/polyfill-library/polyfills/Function/prototype/bind/detect.js
    var detect = 'bind' in Function.prototype;

    if (detect) return

    // Polyfill from https://cdn.polyfill.io/v2/polyfill.js?features=Function.prototype.bind&flags=always
    Object.defineProperty(Function.prototype, 'bind', {
        value: function bind(that) { // .length is 1
            // add necessary es5-shim utilities
            var $Array = Array;
            var $Object = Object;
            var ObjectPrototype = $Object.prototype;
            var ArrayPrototype = $Array.prototype;
            var Empty = function Empty() {};
            var to_string = ObjectPrototype.toString;
            var hasToStringTag = typeof Symbol === 'function' && typeof Symbol.toStringTag === 'symbol';
            var isCallable; /* inlined from https://npmjs.com/is-callable */ var fnToStr = Function.prototype.toString, tryFunctionObject = function tryFunctionObject(value) { try { fnToStr.call(value); return true; } catch (e) { return false; } }, fnClass = '[object Function]', genClass = '[object GeneratorFunction]'; isCallable = function isCallable(value) { if (typeof value !== 'function') { return false; } if (hasToStringTag) { return tryFunctionObject(value); } var strClass = to_string.call(value); return strClass === fnClass || strClass === genClass; };
            var array_slice = ArrayPrototype.slice;
            var array_concat = ArrayPrototype.concat;
            var array_push = ArrayPrototype.push;
            var max = Math.max;
            // /add necessary es5-shim utilities

            // 1. Let Target be the this value.
            var target = this;
            // 2. If IsCallable(Target) is false, throw a TypeError exception.
            if (!isCallable(target)) {
                throw new TypeError('Function.prototype.bind called on incompatible ' + target);
            }
            // 3. Let A be a new (possibly empty) internal list of all of the
            //   argument values provided after thisArg (arg1, arg2 etc), in order.
            // XXX slicedArgs will stand in for "A" if used
            var args = array_slice.call(arguments, 1); // for normal call
            // 4. Let F be a new native ECMAScript object.
            // 11. Set the [[Prototype]] internal property of F to the standard
            //   built-in Function prototype object as specified in 15.3.3.1.
            // 12. Set the [[Call]] internal property of F as described in
            //   15.3.4.5.1.
            // 13. Set the [[Construct]] internal property of F as described in
            //   15.3.4.5.2.
            // 14. Set the [[HasInstance]] internal property of F as described in
            //   15.3.4.5.3.
            var bound;
            var binder = function () {

                if (this instanceof bound) {
                    // 15.3.4.5.2 [[Construct]]
                    // When the [[Construct]] internal method of a function object,
                    // F that was created using the bind function is called with a
                    // list of arguments ExtraArgs, the following steps are taken:
                    // 1. Let target be the value of F's [[TargetFunction]]
                    //   internal property.
                    // 2. If target has no [[Construct]] internal method, a
                    //   TypeError exception is thrown.
                    // 3. Let boundArgs be the value of F's [[BoundArgs]] internal
                    //   property.
                    // 4. Let args be a new list containing the same values as the
                    //   list boundArgs in the same order followed by the same
                    //   values as the list ExtraArgs in the same order.
                    // 5. Return the result of calling the [[Construct]] internal
                    //   method of target providing args as the arguments.

                    var result = target.apply(
                        this,
                        array_concat.call(args, array_slice.call(arguments))
                    );
                    if ($Object(result) === result) {
                        return result;
                    }
                    return this;

                } else {
                    // 15.3.4.5.1 [[Call]]
                    // When the [[Call]] internal method of a function object, F,
                    // which was created using the bind function is called with a
                    // this value and a list of arguments ExtraArgs, the following
                    // steps are taken:
                    // 1. Let boundArgs be the value of F's [[BoundArgs]] internal
                    //   property.
                    // 2. Let boundThis be the value of F's [[BoundThis]] internal
                    //   property.
                    // 3. Let target be the value of F's [[TargetFunction]] internal
                    //   property.
                    // 4. Let args be a new list containing the same values as the
                    //   list boundArgs in the same order followed by the same
                    //   values as the list ExtraArgs in the same order.
                    // 5. Return the result of calling the [[Call]] internal method
                    //   of target providing boundThis as the this value and
                    //   providing args as the arguments.

                    // equiv: target.call(this, ...boundArgs, ...args)
                    return target.apply(
                        that,
                        array_concat.call(args, array_slice.call(arguments))
                    );

                }

            };

            // 15. If the [[Class]] internal property of Target is "Function", then
            //     a. Let L be the length property of Target minus the length of A.
            //     b. Set the length own property of F to either 0 or L, whichever is
            //       larger.
            // 16. Else set the length own property of F to 0.

            var boundLength = max(0, target.length - args.length);

            // 17. Set the attributes of the length own property of F to the values
            //   specified in 15.3.5.1.
            var boundArgs = [];
            for (var i = 0; i < boundLength; i++) {
                array_push.call(boundArgs, '$' + i);
            }

            // XXX Build a dynamic function with desired amount of arguments is the only
            // way to set the length property of a function.
            // In environments where Content Security Policies enabled (Chrome extensions,
            // for ex.) all use of eval or Function costructor throws an exception.
            // However in all of these environments Function.prototype.bind exists
            // and so this code will never be executed.
            bound = Function('binder', 'return function (' + boundArgs.join(',') + '){ return binder.apply(this, arguments); }')(binder);

            if (target.prototype) {
                Empty.prototype = target.prototype;
                bound.prototype = new Empty();
                // Clean up dangling references.
                Empty.prototype = null;
            }

            // TODO
            // 18. Set the [[Extensible]] internal property of F to true.

            // TODO
            // 19. Let thrower be the [[ThrowTypeError]] function Object (13.2.3).
            // 20. Call the [[DefineOwnProperty]] internal method of F with
            //   arguments "caller", PropertyDescriptor {[[Get]]: thrower, [[Set]]:
            //   thrower, [[Enumerable]]: false, [[Configurable]]: false}, and
            //   false.
            // 21. Call the [[DefineOwnProperty]] internal method of F with
            //   arguments "arguments", PropertyDescriptor {[[Get]]: thrower,
            //   [[Set]]: thrower, [[Enumerable]]: false, [[Configurable]]: false},
            //   and false.

            // TODO
            // NOTE Function objects created using Function.prototype.bind do not
            // have a prototype property or the [[Code]], [[FormalParameters]], and
            // [[Scope]] internal properties.
            // XXX can't delete prototype in pure-js.

            // 22. Return F.
            return bound;
        }
    });
  })
  .call('object' === typeof window && window || 'object' === typeof self && self || 'object' === typeof global && global || {});

  })));

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

  // ====================================
  // Filter checkboxes module
  // ====================================

  // to do (see https://www.gov.uk/search/all?keywords=publications&content_purpose_supergroup%5B%5D=services&organisations%5B%5D=academy-for-social-justice&order=relevance)
  // - aria-describedby, hidden span that counts how many options are showing and how many of them are selected
  // - aria-controls, indicate that it controls the list of checkboxes
  // - hide textbox when no js

  function FilterCheckboxes ($module) {
    this.$module = $module;
    this.$textbox = $module.querySelector('.dl-filter-group__auto-filter__input');
  }

  FilterCheckboxes.prototype.init = function (params) {
    this.setupOptions(params);
    var $module = this.$module;
    this.checkboxArr = [...$module.querySelectorAll(this.listItemSelector)];
    var $checkboxes = this.checkboxArr;

    // if no checkboxes then return
    if (!$checkboxes) {
      return
    }

    // returns true is the item has been hidden with display:none
    this.isDisplayNone = function (el) {
      var style = window.getComputedStyle(el);
      return ((style.display === 'none') || (style.visibility === 'hidden'))
    };

    // returns true if the item's checkbox is checked
    this.isItemChecked = function (el) {
      var chbx = el.querySelector('input');
      return chbx.checked
    };

    this.ariaDescription = $module.querySelector('.dl-filter-group__auto-filter__desc');
    // To do: check it exists
    // set initial aria message
    var boundUpdateAriaDescribedBy = this.updateAriaDescribedBy.bind(this);
    boundUpdateAriaDescribedBy();

    // Bind event changes to the textarea
    var boundInputEvents = this.bindInputEvents.bind(this);
    boundInputEvents();
  };

  FilterCheckboxes.prototype.getCheckboxInput = function (el) {
    return el.querySelector('input')
  };

  FilterCheckboxes.prototype.bindInputEvents = function () {
    var $textbox = this.$textbox;
    var checkboxArr = this.checkboxArr.map(this.getCheckboxInput);

    $textbox.addEventListener('input', this.filterCheckboxes.bind(this));

    var boundUpdateAriaDescribedBy = this.updateAriaDescribedBy.bind(this);
    checkboxArr.forEach(chbxEl => chbxEl.addEventListener('change', boundUpdateAriaDescribedBy));
  };

  FilterCheckboxes.prototype.filterCheckboxes = function () {
    var $textbox = this.$textbox;
    var boundFilterCheckboxesArr = this.filterCheckboxesArr.bind(this);
    // filter the array of checkboxes
    var reducedArr = boundFilterCheckboxesArr($textbox.value);

    var boundUpdateAriaDescribedBy = this.updateAriaDescribedBy.bind(this);

    // show only those checkboxes remaining
    var boundDisplayMatchingCheckboxes = this.displayMatchingCheckboxes.bind(this);
    boundDisplayMatchingCheckboxes(reducedArr, boundUpdateAriaDescribedBy);
  };

  FilterCheckboxes.prototype.filterCheckboxesArr = function (query) {
    var checkboxArr = this.checkboxArr;
    return checkboxArr.filter(function (el) {
      const checkbox = el.querySelector('label');
      return checkbox.textContent.toLowerCase().indexOf(query.toLowerCase()) !== -1
    })
  };

  function setCheckboxDisplay (ckbx, displayValue) {
    ckbx.style.display = displayValue;
  }

  FilterCheckboxes.prototype.displayMatchingCheckboxes = function (ckbxArr, cb) {
    // hide all
    this.checkboxArr.forEach((ckbx) => setCheckboxDisplay(ckbx, 'none'));
    // re show those in filtered array
    ckbxArr.forEach((ckbx) => setCheckboxDisplay(ckbx, 'flex'));

    if (cb) {
      cb();
    }
  };

  FilterCheckboxes.prototype.updateAriaDescribedBy = function () {
    var checkboxArr = this.checkboxArr;
    var displayedCheckboxes = checkboxArr.filter(chbx => !this.isDisplayNone(chbx));
    var checkedAndDisplayed = displayedCheckboxes.filter(chbx => this.isItemChecked(chbx));

    var boundGenerateAriaMessage = this.generateAriaMessage.bind(this);
    boundGenerateAriaMessage(displayedCheckboxes.length, checkedAndDisplayed.length);
  };

  FilterCheckboxes.prototype.generateAriaMessage = function (optionCount, selectedCount) {
    var ariaEl = this.ariaDescription;
    var optionStr = ariaEl.dataset.single;
    if (optionCount > 1) {
      optionStr = ariaEl.dataset.multiple;
    }

    ariaEl.textContent = optionCount + ' ' + optionStr + ', ' + selectedCount + ' ' + ariaEl.dataset.selected;
  };

  FilterCheckboxes.prototype.setupOptions = function (params) {
    params = params || {};
    this.listItemSelector = params.listItemSelector || '.govuk-checkboxes__item';
  };

  /*
    Selected counts for filter

    Used with the FilterGroup component to display the
    number of selected items in the filter group list.

  */

  function FilterGroupSelectedCounter ($module) {
    this.$module = $module;
    this.$fieldset = $module.querySelector('fieldset');
    this.$inputs = this.$fieldset.querySelectorAll('input');
  }

  FilterGroupSelectedCounter.prototype.init = function () {
    var $inputs = this.$inputs;

    // if no inputs then return
    if (!$inputs) {
      return
    }

    //
    var boundFetchCountElement = this.fetchCountElement.bind(this);
    this.countMessage = boundFetchCountElement();

    // if current count is 0 hide the message
    this.message_is_hidden = false;
    if (this.currentCount === 0) {
      this.hideCountMessage();
    }

    // Bind event changes to the textarea
    var boundChangeEvents = this.bindChangeEvents.bind(this);
    boundChangeEvents();

    return this
  };

  FilterGroupSelectedCounter.prototype.fetchCountElement = function () {
    var $module = this.$module;
    var countMessage = $module.querySelector('.dl-filter-group__selected-text');

    // if the count message doesn;t exist, create one
    if (!countMessage) {
      countMessage = this.createCountElement();
    }

    this.countElement = countMessage.querySelector('.dl-filter-group__selected-text__count');
    this.currentCount = parseInt(this.countElement.textContent);

    return countMessage
  };

  FilterGroupSelectedCounter.prototype.createCountElement = function () {
    var $module = this.$module;
    var $summary = $module.querySelector('.dl-filter-group__summary');
    var firstIcon = $summary.querySelector('svg');

    var countMessage = document.createElement('span');
    countMessage.classList.add('dl-filter-group__selected-text');
    countMessage.textContent = ' selected';
    firstIcon.insertAdjacentElement('beforebegin', countMessage);

    countMessage.insertAdjacentHTML('afterbegin', '<span class="dl-filter-group__selected-text__count">0</span>');

    return countMessage
  };

  FilterGroupSelectedCounter.prototype.bindChangeEvents = function () {
    var $inputs = this.$inputs;
    // console.log(this)
    $inputs.forEach(input => {
      input.addEventListener('change', this.updateCount.bind(this));
    });
  };

  FilterGroupSelectedCounter.prototype.updateCount = function () {
    var $fieldset = this.$fieldset;
    var count = $fieldset.querySelectorAll('input:checked').length;

    // if 0 hide
    if (count === 0) {
      this.countElement.textContent = 0;
      this.hideCountMessage();
    } else if (count !== this.currentCount) {
      // if changed update
      this.countElement.textContent = count;
      this.showCountMessage();
    }
    // if same, do nothing ----

    this.currentCount = count;
  };

  FilterGroupSelectedCounter.prototype.hideCountMessage = function () {
    this.countMessage.classList.add('govuk-visually-hidden');
    this.message_is_hidden = true;
  };

  FilterGroupSelectedCounter.prototype.showCountMessage = function () {
    this.countMessage.classList.remove('govuk-visually-hidden');
    this.message_is_hidden = false;
  };

  function HorizontalScrollableTable ($module) {
    this.$module = $module;
  }

  HorizontalScrollableTable.prototype.init = function () {
    this.data_table = this.$module.querySelector('table');

    // might be worth adding the shadows separately
    this.left_shadow = this.$module.querySelector('.dl-data-table-left-shadow');
    this.right_shadow = this.$module.querySelector('.dl-data-table-right-shadow');

    this.table_viewer = this.$module.querySelector('.wide-table');
    this.table_viewer.addEventListener('scroll', this.toggleShadows.bind(this));

    // trigger toggleShadow for set up
    this.toggleShadows();
  };

  HorizontalScrollableTable.prototype.toggleShadows = function () {
    function scrolledRight (containedEl, viewerEl) {
      return (
        containedEl.offsetWidth - (viewerEl.scrollLeft + viewerEl.offsetWidth)
      )
    }

    this.left_shadow.classList.toggle(
      'visible',
      scrolledRight(this.data_table, this.table_viewer) <
        this.data_table.offsetWidth - this.table_viewer.offsetWidth
    );

    this.right_shadow.classList.toggle(
      'visible',
      this.table_viewer.scrollLeft <
        this.data_table.offsetWidth - this.table_viewer.offsetWidth
    );

    setTimeout(
      function () {
        this.left_shadow.classList.add('with-transition');
        this.right_shadow.classList.add('with-transition');
      }.bind(this),
      2000
    );
  };

  function convertNodeListToArray (nl) {
    return Array.prototype.slice.call(nl)
  }

  // Currently works by looking for all lists and list items on the page, not confined to a section of a page.
  // We might want to change this so that it is more flexible.
  // Is there a situation where we need more than one list search on a page?

  // similar to
  // https://github.com/alphagov/collections/blob/e1f3c74facd889426d24ac730ed0057aa64e2801/app/assets/javascripts/organisation-list-filter.js
  function ListFilter ($form) {
    this.$form = $form;
    this.filterTimeout = null;
    this.$noMatches = document.querySelector('.dl-list-filter__no-filter-match');
  }

  ListFilter.prototype.init = function (params) {
    this.setupOptions(params);
    const $form = this.$form;
    // Form should only appear if the JS is working
    $form.classList.add('list-filter__form--active');

    // We don't want the form to submit/refresh the page on enter key
    $form.addEventListener('submit', function () { return false });

    const $input = $form.querySelector('input');
    const boundFilterViaTimeout = this.filterViaTimeout.bind(this);
    $input.addEventListener('keyup', boundFilterViaTimeout);

    // make sure no matches message is initially hidden
    this.$noMatches.classList.add('js-hidden');
  };

  ListFilter.prototype.filterViaTimeout = function (e) {
    clearTimeout(this.filterTimeout);

    const boundListFilter = this.ListFilter.bind(this);
    this.filterTimeout = setTimeout(function () {
      boundListFilter(e);
    }, 200);
  };

  ListFilter.prototype.ListFilter = function (e) {
    const itemsToFilter = convertNodeListToArray(document.querySelectorAll('[data-filter="item"]'));
    const listsToFilter = convertNodeListToArray(document.querySelectorAll('[data-filter="list"]'));
    const searchTerm = e.target.value;

    const boundMatchSearchTerm = this.matchSearchTerm.bind(this);
    itemsToFilter
      .filter(function ($item) {
        return boundMatchSearchTerm($item, searchTerm)
      })
      .forEach(function (item) {
        item.classList.add('js-hidden');
      });

    this.updateListCounts(listsToFilter);
  };

  ListFilter.prototype.termToMatchOn = function (item) {
    const toConsider = item.querySelectorAll('[data-filter="match-content"]');
    if (toConsider.length) {
      const toConsiderArr = convertNodeListToArray(toConsider);
      const toConsiderStrs = toConsiderArr.map(function (el) {
        return el.textContent
      });
      return toConsiderStrs.join(';')
    }
    return item.querySelector('a').textContent
  };

  ListFilter.prototype.matchSearchTerm = function (item, term) {
    // const itemLabels = item.dataset.filterItemLabels
    const contentToMatchOn = this.termToMatchOn(item);
    item.classList.remove('js-hidden');
    var searchTermRegexp = new RegExp(term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
    if (searchTermRegexp.exec(contentToMatchOn) !== null) {
      return false
    }
    return true
  };

  ListFilter.prototype.updateListCounts = function (lists) {
    var totalMatches = 0;
    const list_section_selector = this.list_section_selector;
    const count_wrapper_selector = this.count_wrapper_selector;

    lists.forEach(function (list) {
      var matchingCount = list.querySelectorAll('[data-filter="item"]:not(.js-hidden)').length;
      var listSection = list.closest(list_section_selector);
      var countWrapper = listSection.querySelector(count_wrapper_selector);
      var listCount = countWrapper.querySelector('.js-list-filter__count');
      var accessibleListCount = countWrapper.querySelector('.js-accessible-list-filter__count');

      // show/hide sections with matching items
      if (matchingCount > 0) {
        listSection.classList.remove('js-hidden');
        listCount.textContent = matchingCount;
        accessibleListCount.textContent = matchingCount;
      } else {
        listSection.classList.add('js-hidden');
      }

      totalMatches += matchingCount;

      var filteredEvent = new CustomEvent('list:filtered');
      list.dispatchEvent(filteredEvent);
    });

    // if no results show message
    if (this.$noMatches) {
      if (totalMatches === 0) {
        this.$noMatches.classList.remove('js-hidden');
      } else {
        this.$noMatches.classList.add('js-hidden');
      }
    }
  };

  ListFilter.prototype.setupOptions = function (params) {
    params = params || {};
    this.list_section_selector = params.list_section_selector || '.dl-list-filter__count';
    this.count_wrapper_selector = params.count_wrapper_selector || '.dl-list-filter__count__wrapper';
  };

  (function (global, factory) {
  	typeof exports === 'object' && typeof module !== 'undefined' ? factory() :
  	typeof define === 'function' && define.amd ? define('GOVUKFrontend', factory) :
  	(factory());
  }(window, (function () {
  (function(undefined$1) {

  // Detection from https://github.com/Financial-Times/polyfill-service/blob/master/packages/polyfill-library/polyfills/Object/defineProperty/detect.js
  var detect = (
    // In IE8, defineProperty could only act on DOM elements, so full support
    // for the feature requires the ability to set a property on an arbitrary object
    'defineProperty' in Object && (function() {
    	try {
    		var a = {};
    		Object.defineProperty(a, 'test', {value:42});
    		return true;
    	} catch(e) {
    		return false
    	}
    }())
  );

  if (detect) return

  // Polyfill from https://cdn.polyfill.io/v2/polyfill.js?features=Object.defineProperty&flags=always
  (function (nativeDefineProperty) {

  	var supportsAccessors = Object.prototype.hasOwnProperty('__defineGetter__');
  	var ERR_ACCESSORS_NOT_SUPPORTED = 'Getters & setters cannot be defined on this javascript engine';
  	var ERR_VALUE_ACCESSORS = 'A property cannot both have accessors and be writable or have a value';

  	Object.defineProperty = function defineProperty(object, property, descriptor) {

  		// Where native support exists, assume it
  		if (nativeDefineProperty && (object === window || object === document || object === Element.prototype || object instanceof Element)) {
  			return nativeDefineProperty(object, property, descriptor);
  		}

  		if (object === null || !(object instanceof Object || typeof object === 'object')) {
  			throw new TypeError('Object.defineProperty called on non-object');
  		}

  		if (!(descriptor instanceof Object)) {
  			throw new TypeError('Property description must be an object');
  		}

  		var propertyString = String(property);
  		var hasValueOrWritable = 'value' in descriptor || 'writable' in descriptor;
  		var getterType = 'get' in descriptor && typeof descriptor.get;
  		var setterType = 'set' in descriptor && typeof descriptor.set;

  		// handle descriptor.get
  		if (getterType) {
  			if (getterType !== 'function') {
  				throw new TypeError('Getter must be a function');
  			}
  			if (!supportsAccessors) {
  				throw new TypeError(ERR_ACCESSORS_NOT_SUPPORTED);
  			}
  			if (hasValueOrWritable) {
  				throw new TypeError(ERR_VALUE_ACCESSORS);
  			}
  			Object.__defineGetter__.call(object, propertyString, descriptor.get);
  		} else {
  			object[propertyString] = descriptor.value;
  		}

  		// handle descriptor.set
  		if (setterType) {
  			if (setterType !== 'function') {
  				throw new TypeError('Setter must be a function');
  			}
  			if (!supportsAccessors) {
  				throw new TypeError(ERR_ACCESSORS_NOT_SUPPORTED);
  			}
  			if (hasValueOrWritable) {
  				throw new TypeError(ERR_VALUE_ACCESSORS);
  			}
  			Object.__defineSetter__.call(object, propertyString, descriptor.set);
  		}

  		// OK to define value unconditionally - if a getter has been specified as well, an error would be thrown above
  		if ('value' in descriptor) {
  			object[propertyString] = descriptor.value;
  		}

  		return object;
  	};
  }(Object.defineProperty));
  })
  .call('object' === typeof window && window || 'object' === typeof self && self || 'object' === typeof global && global || {});

  (function(undefined$1) {

      // Detection from https://raw.githubusercontent.com/Financial-Times/polyfill-service/master/packages/polyfill-library/polyfills/DOMTokenList/detect.js
      var detect = (
        'DOMTokenList' in this && (function (x) {
          return 'classList' in x ? !x.classList.toggle('x', false) && !x.className : true;
        })(document.createElement('x'))
      );

      if (detect) return

      // Polyfill from https://raw.githubusercontent.com/Financial-Times/polyfill-service/master/packages/polyfill-library/polyfills/DOMTokenList/polyfill.js
      (function (global) {
        var nativeImpl = "DOMTokenList" in global && global.DOMTokenList;

        if (
            !nativeImpl ||
            (
              !!document.createElementNS &&
              !!document.createElementNS('http://www.w3.org/2000/svg', 'svg') &&
              !(document.createElementNS("http://www.w3.org/2000/svg", "svg").classList instanceof DOMTokenList)
            )
          ) {
          global.DOMTokenList = (function() { // eslint-disable-line no-unused-vars
            var dpSupport = true;
            var defineGetter = function (object, name, fn, configurable) {
              if (Object.defineProperty)
                Object.defineProperty(object, name, {
                  configurable: false === dpSupport ? true : !!configurable,
                  get: fn
                });

              else object.__defineGetter__(name, fn);
            };

            /** Ensure the browser allows Object.defineProperty to be used on native JavaScript objects. */
            try {
              defineGetter({}, "support");
            }
            catch (e) {
              dpSupport = false;
            }


            var _DOMTokenList = function (el, prop) {
              var that = this;
              var tokens = [];
              var tokenMap = {};
              var length = 0;
              var maxLength = 0;
              var addIndexGetter = function (i) {
                defineGetter(that, i, function () {
                  preop();
                  return tokens[i];
                }, false);

              };
              var reindex = function () {

                /** Define getter functions for array-like access to the tokenList's contents. */
                if (length >= maxLength)
                  for (; maxLength < length; ++maxLength) {
                    addIndexGetter(maxLength);
                  }
              };

              /** Helper function called at the start of each class method. Internal use only. */
              var preop = function () {
                var error;
                var i;
                var args = arguments;
                var rSpace = /\s+/;

                /** Validate the token/s passed to an instance method, if any. */
                if (args.length)
                  for (i = 0; i < args.length; ++i)
                    if (rSpace.test(args[i])) {
                      error = new SyntaxError('String "' + args[i] + '" ' + "contains" + ' an invalid character');
                      error.code = 5;
                      error.name = "InvalidCharacterError";
                      throw error;
                    }


                /** Split the new value apart by whitespace*/
                if (typeof el[prop] === "object") {
                  tokens = ("" + el[prop].baseVal).replace(/^\s+|\s+$/g, "").split(rSpace);
                } else {
                  tokens = ("" + el[prop]).replace(/^\s+|\s+$/g, "").split(rSpace);
                }

                /** Avoid treating blank strings as single-item token lists */
                if ("" === tokens[0]) tokens = [];

                /** Repopulate the internal token lists */
                tokenMap = {};
                for (i = 0; i < tokens.length; ++i)
                  tokenMap[tokens[i]] = true;
                length = tokens.length;
                reindex();
              };

              /** Populate our internal token list if the targeted attribute of the subject element isn't empty. */
              preop();

              /** Return the number of tokens in the underlying string. Read-only. */
              defineGetter(that, "length", function () {
                preop();
                return length;
              });

              /** Override the default toString/toLocaleString methods to return a space-delimited list of tokens when typecast. */
              that.toLocaleString =
                that.toString = function () {
                  preop();
                  return tokens.join(" ");
                };

              that.item = function (idx) {
                preop();
                return tokens[idx];
              };

              that.contains = function (token) {
                preop();
                return !!tokenMap[token];
              };

              that.add = function () {
                preop.apply(that, args = arguments);

                for (var args, token, i = 0, l = args.length; i < l; ++i) {
                  token = args[i];
                  if (!tokenMap[token]) {
                    tokens.push(token);
                    tokenMap[token] = true;
                  }
                }

                /** Update the targeted attribute of the attached element if the token list's changed. */
                if (length !== tokens.length) {
                  length = tokens.length >>> 0;
                  if (typeof el[prop] === "object") {
                    el[prop].baseVal = tokens.join(" ");
                  } else {
                    el[prop] = tokens.join(" ");
                  }
                  reindex();
                }
              };

              that.remove = function () {
                preop.apply(that, args = arguments);

                /** Build a hash of token names to compare against when recollecting our token list. */
                for (var args, ignore = {}, i = 0, t = []; i < args.length; ++i) {
                  ignore[args[i]] = true;
                  delete tokenMap[args[i]];
                }

                /** Run through our tokens list and reassign only those that aren't defined in the hash declared above. */
                for (i = 0; i < tokens.length; ++i)
                  if (!ignore[tokens[i]]) t.push(tokens[i]);

                tokens = t;
                length = t.length >>> 0;

                /** Update the targeted attribute of the attached element. */
                if (typeof el[prop] === "object") {
                  el[prop].baseVal = tokens.join(" ");
                } else {
                  el[prop] = tokens.join(" ");
                }
                reindex();
              };

              that.toggle = function (token, force) {
                preop.apply(that, [token]);

                /** Token state's being forced. */
                if (undefined$1 !== force) {
                  if (force) {
                    that.add(token);
                    return true;
                  } else {
                    that.remove(token);
                    return false;
                  }
                }

                /** Token already exists in tokenList. Remove it, and return FALSE. */
                if (tokenMap[token]) {
                  that.remove(token);
                  return false;
                }

                /** Otherwise, add the token and return TRUE. */
                that.add(token);
                return true;
              };

              return that;
            };

            return _DOMTokenList;
          }());
        }

        // Add second argument to native DOMTokenList.toggle() if necessary
        (function () {
          var e = document.createElement('span');
          if (!('classList' in e)) return;
          e.classList.toggle('x', false);
          if (!e.classList.contains('x')) return;
          e.classList.constructor.prototype.toggle = function toggle(token /*, force*/) {
            var force = arguments[1];
            if (force === undefined$1) {
              var add = !this.contains(token);
              this[add ? 'add' : 'remove'](token);
              return add;
            }
            force = !!force;
            this[force ? 'add' : 'remove'](token);
            return force;
          };
        }());

        // Add multiple arguments to native DOMTokenList.add() if necessary
        (function () {
          var e = document.createElement('span');
          if (!('classList' in e)) return;
          e.classList.add('a', 'b');
          if (e.classList.contains('b')) return;
          var native = e.classList.constructor.prototype.add;
          e.classList.constructor.prototype.add = function () {
            var args = arguments;
            var l = arguments.length;
            for (var i = 0; i < l; i++) {
              native.call(this, args[i]);
            }
          };
        }());

        // Add multiple arguments to native DOMTokenList.remove() if necessary
        (function () {
          var e = document.createElement('span');
          if (!('classList' in e)) return;
          e.classList.add('a');
          e.classList.add('b');
          e.classList.remove('a', 'b');
          if (!e.classList.contains('b')) return;
          var native = e.classList.constructor.prototype.remove;
          e.classList.constructor.prototype.remove = function () {
            var args = arguments;
            var l = arguments.length;
            for (var i = 0; i < l; i++) {
              native.call(this, args[i]);
            }
          };
        }());

      }(this));

  }).call('object' === typeof window && window || 'object' === typeof self && self || 'object' === typeof global && global || {});

  (function(undefined$1) {

  // Detection from https://github.com/Financial-Times/polyfill-service/blob/master/packages/polyfill-library/polyfills/Document/detect.js
  var detect = ("Document" in this);

  if (detect) return

  // Polyfill from https://cdn.polyfill.io/v2/polyfill.js?features=Document&flags=always
  if ((typeof WorkerGlobalScope === "undefined") && (typeof importScripts !== "function")) {

  	if (this.HTMLDocument) { // IE8

  		// HTMLDocument is an extension of Document.  If the browser has HTMLDocument but not Document, the former will suffice as an alias for the latter.
  		this.Document = this.HTMLDocument;

  	} else {

  		// Create an empty function to act as the missing constructor for the document object, attach the document object as its prototype.  The function needs to be anonymous else it is hoisted and causes the feature detect to prematurely pass, preventing the assignments below being made.
  		this.Document = this.HTMLDocument = document.constructor = (new Function('return function Document() {}')());
  		this.Document.prototype = document;
  	}
  }


  })
  .call('object' === typeof window && window || 'object' === typeof self && self || 'object' === typeof global && global || {});

  (function(undefined$1) {

  // Detection from https://github.com/Financial-Times/polyfill-service/blob/master/packages/polyfill-library/polyfills/Element/detect.js
  var detect = ('Element' in this && 'HTMLElement' in this);

  if (detect) return

  // Polyfill from https://cdn.polyfill.io/v2/polyfill.js?features=Element&flags=always
  (function () {

  	// IE8
  	if (window.Element && !window.HTMLElement) {
  		window.HTMLElement = window.Element;
  		return;
  	}

  	// create Element constructor
  	window.Element = window.HTMLElement = new Function('return function Element() {}')();

  	// generate sandboxed iframe
  	var vbody = document.appendChild(document.createElement('body'));
  	var frame = vbody.appendChild(document.createElement('iframe'));

  	// use sandboxed iframe to replicate Element functionality
  	var frameDocument = frame.contentWindow.document;
  	var prototype = Element.prototype = frameDocument.appendChild(frameDocument.createElement('*'));
  	var cache = {};

  	// polyfill Element.prototype on an element
  	var shiv = function (element, deep) {
  		var
  		childNodes = element.childNodes || [],
  		index = -1,
  		key, value, childNode;

  		if (element.nodeType === 1 && element.constructor !== Element) {
  			element.constructor = Element;

  			for (key in cache) {
  				value = cache[key];
  				element[key] = value;
  			}
  		}

  		while (childNode = deep && childNodes[++index]) {
  			shiv(childNode, deep);
  		}

  		return element;
  	};

  	var elements = document.getElementsByTagName('*');
  	var nativeCreateElement = document.createElement;
  	var interval;
  	var loopLimit = 100;

  	prototype.attachEvent('onpropertychange', function (event) {
  		var
  		propertyName = event.propertyName,
  		nonValue = !cache.hasOwnProperty(propertyName),
  		newValue = prototype[propertyName],
  		oldValue = cache[propertyName],
  		index = -1,
  		element;

  		while (element = elements[++index]) {
  			if (element.nodeType === 1) {
  				if (nonValue || element[propertyName] === oldValue) {
  					element[propertyName] = newValue;
  				}
  			}
  		}

  		cache[propertyName] = newValue;
  	});

  	prototype.constructor = Element;

  	if (!prototype.hasAttribute) {
  		// <Element>.hasAttribute
  		prototype.hasAttribute = function hasAttribute(name) {
  			return this.getAttribute(name) !== null;
  		};
  	}

  	// Apply Element prototype to the pre-existing DOM as soon as the body element appears.
  	function bodyCheck() {
  		if (!(loopLimit--)) clearTimeout(interval);
  		if (document.body && !document.body.prototype && /(complete|interactive)/.test(document.readyState)) {
  			shiv(document, true);
  			if (interval && document.body.prototype) clearTimeout(interval);
  			return (!!document.body.prototype);
  		}
  		return false;
  	}
  	if (!bodyCheck()) {
  		document.onreadystatechange = bodyCheck;
  		interval = setInterval(bodyCheck, 25);
  	}

  	// Apply to any new elements created after load
  	document.createElement = function createElement(nodeName) {
  		var element = nativeCreateElement(String(nodeName).toLowerCase());
  		return shiv(element);
  	};

  	// remove sandboxed iframe
  	document.removeChild(vbody);
  }());

  })
  .call('object' === typeof window && window || 'object' === typeof self && self || 'object' === typeof global && global || {});

  (function(undefined$1) {

      // Detection from https://raw.githubusercontent.com/Financial-Times/polyfill-service/8717a9e04ac7aff99b4980fbedead98036b0929a/packages/polyfill-library/polyfills/Element/prototype/classList/detect.js
      var detect = (
        'document' in this && "classList" in document.documentElement && 'Element' in this && 'classList' in Element.prototype && (function () {
          var e = document.createElement('span');
          e.classList.add('a', 'b');
          return e.classList.contains('b');
        }())
      );

      if (detect) return

      // Polyfill from https://cdn.polyfill.io/v2/polyfill.js?features=Element.prototype.classList&flags=always
      (function (global) {
        var dpSupport = true;
        var defineGetter = function (object, name, fn, configurable) {
          if (Object.defineProperty)
            Object.defineProperty(object, name, {
              configurable: false === dpSupport ? true : !!configurable,
              get: fn
            });

          else object.__defineGetter__(name, fn);
        };
        /** Ensure the browser allows Object.defineProperty to be used on native JavaScript objects. */
        try {
          defineGetter({}, "support");
        }
        catch (e) {
          dpSupport = false;
        }
        /** Polyfills a property with a DOMTokenList */
        var addProp = function (o, name, attr) {

          defineGetter(o.prototype, name, function () {
            var tokenList;

            var THIS = this,

            /** Prevent this from firing twice for some reason. What the hell, IE. */
            gibberishProperty = "__defineGetter__" + "DEFINE_PROPERTY" + name;
            if(THIS[gibberishProperty]) return tokenList;
            THIS[gibberishProperty] = true;

            /**
             * IE8 can't define properties on native JavaScript objects, so we'll use a dumb hack instead.
             *
             * What this is doing is creating a dummy element ("reflection") inside a detached phantom node ("mirror")
             * that serves as the target of Object.defineProperty instead. While we could simply use the subject HTML
             * element instead, this would conflict with element types which use indexed properties (such as forms and
             * select lists).
             */
            if (false === dpSupport) {

              var visage;
              var mirror = addProp.mirror || document.createElement("div");
              var reflections = mirror.childNodes;
              var l = reflections.length;

              for (var i = 0; i < l; ++i)
                if (reflections[i]._R === THIS) {
                  visage = reflections[i];
                  break;
                }

              /** Couldn't find an element's reflection inside the mirror. Materialise one. */
              visage || (visage = mirror.appendChild(document.createElement("div")));

              tokenList = DOMTokenList.call(visage, THIS, attr);
            } else tokenList = new DOMTokenList(THIS, attr);

            defineGetter(THIS, name, function () {
              return tokenList;
            });
            delete THIS[gibberishProperty];

            return tokenList;
          }, true);
        };

        addProp(global.Element, "classList", "className");
        addProp(global.HTMLElement, "classList", "className");
        addProp(global.HTMLLinkElement, "relList", "rel");
        addProp(global.HTMLAnchorElement, "relList", "rel");
        addProp(global.HTMLAreaElement, "relList", "rel");
      }(this));

  }).call('object' === typeof window && window || 'object' === typeof self && self || 'object' === typeof global && global || {});

  })));

  (function (global, factory) {
  	typeof exports === 'object' && typeof module !== 'undefined' ? factory() :
  	typeof define === 'function' && define.amd ? define('GOVUKFrontend', factory) :
  	(factory());
  }(window, (function () {
  (function(undefined$1) {

  // Detection from https://github.com/Financial-Times/polyfill-service/blob/master/packages/polyfill-library/polyfills/Object/defineProperty/detect.js
  var detect = (
    // In IE8, defineProperty could only act on DOM elements, so full support
    // for the feature requires the ability to set a property on an arbitrary object
    'defineProperty' in Object && (function() {
    	try {
    		var a = {};
    		Object.defineProperty(a, 'test', {value:42});
    		return true;
    	} catch(e) {
    		return false
    	}
    }())
  );

  if (detect) return

  // Polyfill from https://cdn.polyfill.io/v2/polyfill.js?features=Object.defineProperty&flags=always
  (function (nativeDefineProperty) {

  	var supportsAccessors = Object.prototype.hasOwnProperty('__defineGetter__');
  	var ERR_ACCESSORS_NOT_SUPPORTED = 'Getters & setters cannot be defined on this javascript engine';
  	var ERR_VALUE_ACCESSORS = 'A property cannot both have accessors and be writable or have a value';

  	Object.defineProperty = function defineProperty(object, property, descriptor) {

  		// Where native support exists, assume it
  		if (nativeDefineProperty && (object === window || object === document || object === Element.prototype || object instanceof Element)) {
  			return nativeDefineProperty(object, property, descriptor);
  		}

  		if (object === null || !(object instanceof Object || typeof object === 'object')) {
  			throw new TypeError('Object.defineProperty called on non-object');
  		}

  		if (!(descriptor instanceof Object)) {
  			throw new TypeError('Property description must be an object');
  		}

  		var propertyString = String(property);
  		var hasValueOrWritable = 'value' in descriptor || 'writable' in descriptor;
  		var getterType = 'get' in descriptor && typeof descriptor.get;
  		var setterType = 'set' in descriptor && typeof descriptor.set;

  		// handle descriptor.get
  		if (getterType) {
  			if (getterType !== 'function') {
  				throw new TypeError('Getter must be a function');
  			}
  			if (!supportsAccessors) {
  				throw new TypeError(ERR_ACCESSORS_NOT_SUPPORTED);
  			}
  			if (hasValueOrWritable) {
  				throw new TypeError(ERR_VALUE_ACCESSORS);
  			}
  			Object.__defineGetter__.call(object, propertyString, descriptor.get);
  		} else {
  			object[propertyString] = descriptor.value;
  		}

  		// handle descriptor.set
  		if (setterType) {
  			if (setterType !== 'function') {
  				throw new TypeError('Setter must be a function');
  			}
  			if (!supportsAccessors) {
  				throw new TypeError(ERR_ACCESSORS_NOT_SUPPORTED);
  			}
  			if (hasValueOrWritable) {
  				throw new TypeError(ERR_VALUE_ACCESSORS);
  			}
  			Object.__defineSetter__.call(object, propertyString, descriptor.set);
  		}

  		// OK to define value unconditionally - if a getter has been specified as well, an error would be thrown above
  		if ('value' in descriptor) {
  			object[propertyString] = descriptor.value;
  		}

  		return object;
  	};
  }(Object.defineProperty));
  })
  .call('object' === typeof window && window || 'object' === typeof self && self || 'object' === typeof global && global || {});

  (function(undefined$1) {

  // Detection from https://github.com/Financial-Times/polyfill-service/blob/master/packages/polyfill-library/polyfills/Document/detect.js
  var detect = ("Document" in this);

  if (detect) return

  // Polyfill from https://cdn.polyfill.io/v2/polyfill.js?features=Document&flags=always
  if ((typeof WorkerGlobalScope === "undefined") && (typeof importScripts !== "function")) {

  	if (this.HTMLDocument) { // IE8

  		// HTMLDocument is an extension of Document.  If the browser has HTMLDocument but not Document, the former will suffice as an alias for the latter.
  		this.Document = this.HTMLDocument;

  	} else {

  		// Create an empty function to act as the missing constructor for the document object, attach the document object as its prototype.  The function needs to be anonymous else it is hoisted and causes the feature detect to prematurely pass, preventing the assignments below being made.
  		this.Document = this.HTMLDocument = document.constructor = (new Function('return function Document() {}')());
  		this.Document.prototype = document;
  	}
  }


  })
  .call('object' === typeof window && window || 'object' === typeof self && self || 'object' === typeof global && global || {});

  (function(undefined$1) {

  // Detection from https://github.com/Financial-Times/polyfill-service/blob/master/packages/polyfill-library/polyfills/Element/detect.js
  var detect = ('Element' in this && 'HTMLElement' in this);

  if (detect) return

  // Polyfill from https://cdn.polyfill.io/v2/polyfill.js?features=Element&flags=always
  (function () {

  	// IE8
  	if (window.Element && !window.HTMLElement) {
  		window.HTMLElement = window.Element;
  		return;
  	}

  	// create Element constructor
  	window.Element = window.HTMLElement = new Function('return function Element() {}')();

  	// generate sandboxed iframe
  	var vbody = document.appendChild(document.createElement('body'));
  	var frame = vbody.appendChild(document.createElement('iframe'));

  	// use sandboxed iframe to replicate Element functionality
  	var frameDocument = frame.contentWindow.document;
  	var prototype = Element.prototype = frameDocument.appendChild(frameDocument.createElement('*'));
  	var cache = {};

  	// polyfill Element.prototype on an element
  	var shiv = function (element, deep) {
  		var
  		childNodes = element.childNodes || [],
  		index = -1,
  		key, value, childNode;

  		if (element.nodeType === 1 && element.constructor !== Element) {
  			element.constructor = Element;

  			for (key in cache) {
  				value = cache[key];
  				element[key] = value;
  			}
  		}

  		while (childNode = deep && childNodes[++index]) {
  			shiv(childNode, deep);
  		}

  		return element;
  	};

  	var elements = document.getElementsByTagName('*');
  	var nativeCreateElement = document.createElement;
  	var interval;
  	var loopLimit = 100;

  	prototype.attachEvent('onpropertychange', function (event) {
  		var
  		propertyName = event.propertyName,
  		nonValue = !cache.hasOwnProperty(propertyName),
  		newValue = prototype[propertyName],
  		oldValue = cache[propertyName],
  		index = -1,
  		element;

  		while (element = elements[++index]) {
  			if (element.nodeType === 1) {
  				if (nonValue || element[propertyName] === oldValue) {
  					element[propertyName] = newValue;
  				}
  			}
  		}

  		cache[propertyName] = newValue;
  	});

  	prototype.constructor = Element;

  	if (!prototype.hasAttribute) {
  		// <Element>.hasAttribute
  		prototype.hasAttribute = function hasAttribute(name) {
  			return this.getAttribute(name) !== null;
  		};
  	}

  	// Apply Element prototype to the pre-existing DOM as soon as the body element appears.
  	function bodyCheck() {
  		if (!(loopLimit--)) clearTimeout(interval);
  		if (document.body && !document.body.prototype && /(complete|interactive)/.test(document.readyState)) {
  			shiv(document, true);
  			if (interval && document.body.prototype) clearTimeout(interval);
  			return (!!document.body.prototype);
  		}
  		return false;
  	}
  	if (!bodyCheck()) {
  		document.onreadystatechange = bodyCheck;
  		interval = setInterval(bodyCheck, 25);
  	}

  	// Apply to any new elements created after load
  	document.createElement = function createElement(nodeName) {
  		var element = nativeCreateElement(String(nodeName).toLowerCase());
  		return shiv(element);
  	};

  	// remove sandboxed iframe
  	document.removeChild(vbody);
  }());

  })
  .call('object' === typeof window && window || 'object' === typeof self && self || 'object' === typeof global && global || {});

  (function(undefined$1) {

      // Detection from https://raw.githubusercontent.com/Financial-Times/polyfill-library/master/polyfills/Element/prototype/nextElementSibling/detect.js
      var detect = (
        'document' in this && "nextElementSibling" in document.documentElement
      );

      if (detect) return

      // Polyfill from https://raw.githubusercontent.com/Financial-Times/polyfill-library/master/polyfills/Element/prototype/nextElementSibling/polyfill.js
      Object.defineProperty(Element.prototype, "nextElementSibling", {
        get: function(){
          var el = this.nextSibling;
          while (el && el.nodeType !== 1) { el = el.nextSibling; }
          return el;
        }
      });

  }).call('object' === typeof window && window || 'object' === typeof self && self || 'object' === typeof global && global || {});

  })));

  (function (global, factory) {
  	typeof exports === 'object' && typeof module !== 'undefined' ? factory() :
  	typeof define === 'function' && define.amd ? define('GOVUKFrontend', factory) :
  	(factory());
  }(window, (function () {
  (function(undefined$1) {

  // Detection from https://github.com/Financial-Times/polyfill-service/blob/master/packages/polyfill-library/polyfills/Object/defineProperty/detect.js
  var detect = (
    // In IE8, defineProperty could only act on DOM elements, so full support
    // for the feature requires the ability to set a property on an arbitrary object
    'defineProperty' in Object && (function() {
    	try {
    		var a = {};
    		Object.defineProperty(a, 'test', {value:42});
    		return true;
    	} catch(e) {
    		return false
    	}
    }())
  );

  if (detect) return

  // Polyfill from https://cdn.polyfill.io/v2/polyfill.js?features=Object.defineProperty&flags=always
  (function (nativeDefineProperty) {

  	var supportsAccessors = Object.prototype.hasOwnProperty('__defineGetter__');
  	var ERR_ACCESSORS_NOT_SUPPORTED = 'Getters & setters cannot be defined on this javascript engine';
  	var ERR_VALUE_ACCESSORS = 'A property cannot both have accessors and be writable or have a value';

  	Object.defineProperty = function defineProperty(object, property, descriptor) {

  		// Where native support exists, assume it
  		if (nativeDefineProperty && (object === window || object === document || object === Element.prototype || object instanceof Element)) {
  			return nativeDefineProperty(object, property, descriptor);
  		}

  		if (object === null || !(object instanceof Object || typeof object === 'object')) {
  			throw new TypeError('Object.defineProperty called on non-object');
  		}

  		if (!(descriptor instanceof Object)) {
  			throw new TypeError('Property description must be an object');
  		}

  		var propertyString = String(property);
  		var hasValueOrWritable = 'value' in descriptor || 'writable' in descriptor;
  		var getterType = 'get' in descriptor && typeof descriptor.get;
  		var setterType = 'set' in descriptor && typeof descriptor.set;

  		// handle descriptor.get
  		if (getterType) {
  			if (getterType !== 'function') {
  				throw new TypeError('Getter must be a function');
  			}
  			if (!supportsAccessors) {
  				throw new TypeError(ERR_ACCESSORS_NOT_SUPPORTED);
  			}
  			if (hasValueOrWritable) {
  				throw new TypeError(ERR_VALUE_ACCESSORS);
  			}
  			Object.__defineGetter__.call(object, propertyString, descriptor.get);
  		} else {
  			object[propertyString] = descriptor.value;
  		}

  		// handle descriptor.set
  		if (setterType) {
  			if (setterType !== 'function') {
  				throw new TypeError('Setter must be a function');
  			}
  			if (!supportsAccessors) {
  				throw new TypeError(ERR_ACCESSORS_NOT_SUPPORTED);
  			}
  			if (hasValueOrWritable) {
  				throw new TypeError(ERR_VALUE_ACCESSORS);
  			}
  			Object.__defineSetter__.call(object, propertyString, descriptor.set);
  		}

  		// OK to define value unconditionally - if a getter has been specified as well, an error would be thrown above
  		if ('value' in descriptor) {
  			object[propertyString] = descriptor.value;
  		}

  		return object;
  	};
  }(Object.defineProperty));
  })
  .call('object' === typeof window && window || 'object' === typeof self && self || 'object' === typeof global && global || {});

  (function(undefined$1) {

  // Detection from https://github.com/Financial-Times/polyfill-service/blob/master/packages/polyfill-library/polyfills/Document/detect.js
  var detect = ("Document" in this);

  if (detect) return

  // Polyfill from https://cdn.polyfill.io/v2/polyfill.js?features=Document&flags=always
  if ((typeof WorkerGlobalScope === "undefined") && (typeof importScripts !== "function")) {

  	if (this.HTMLDocument) { // IE8

  		// HTMLDocument is an extension of Document.  If the browser has HTMLDocument but not Document, the former will suffice as an alias for the latter.
  		this.Document = this.HTMLDocument;

  	} else {

  		// Create an empty function to act as the missing constructor for the document object, attach the document object as its prototype.  The function needs to be anonymous else it is hoisted and causes the feature detect to prematurely pass, preventing the assignments below being made.
  		this.Document = this.HTMLDocument = document.constructor = (new Function('return function Document() {}')());
  		this.Document.prototype = document;
  	}
  }


  })
  .call('object' === typeof window && window || 'object' === typeof self && self || 'object' === typeof global && global || {});

  (function(undefined$1) {

  // Detection from https://github.com/Financial-Times/polyfill-service/blob/master/packages/polyfill-library/polyfills/Element/detect.js
  var detect = ('Element' in this && 'HTMLElement' in this);

  if (detect) return

  // Polyfill from https://cdn.polyfill.io/v2/polyfill.js?features=Element&flags=always
  (function () {

  	// IE8
  	if (window.Element && !window.HTMLElement) {
  		window.HTMLElement = window.Element;
  		return;
  	}

  	// create Element constructor
  	window.Element = window.HTMLElement = new Function('return function Element() {}')();

  	// generate sandboxed iframe
  	var vbody = document.appendChild(document.createElement('body'));
  	var frame = vbody.appendChild(document.createElement('iframe'));

  	// use sandboxed iframe to replicate Element functionality
  	var frameDocument = frame.contentWindow.document;
  	var prototype = Element.prototype = frameDocument.appendChild(frameDocument.createElement('*'));
  	var cache = {};

  	// polyfill Element.prototype on an element
  	var shiv = function (element, deep) {
  		var
  		childNodes = element.childNodes || [],
  		index = -1,
  		key, value, childNode;

  		if (element.nodeType === 1 && element.constructor !== Element) {
  			element.constructor = Element;

  			for (key in cache) {
  				value = cache[key];
  				element[key] = value;
  			}
  		}

  		while (childNode = deep && childNodes[++index]) {
  			shiv(childNode, deep);
  		}

  		return element;
  	};

  	var elements = document.getElementsByTagName('*');
  	var nativeCreateElement = document.createElement;
  	var interval;
  	var loopLimit = 100;

  	prototype.attachEvent('onpropertychange', function (event) {
  		var
  		propertyName = event.propertyName,
  		nonValue = !cache.hasOwnProperty(propertyName),
  		newValue = prototype[propertyName],
  		oldValue = cache[propertyName],
  		index = -1,
  		element;

  		while (element = elements[++index]) {
  			if (element.nodeType === 1) {
  				if (nonValue || element[propertyName] === oldValue) {
  					element[propertyName] = newValue;
  				}
  			}
  		}

  		cache[propertyName] = newValue;
  	});

  	prototype.constructor = Element;

  	if (!prototype.hasAttribute) {
  		// <Element>.hasAttribute
  		prototype.hasAttribute = function hasAttribute(name) {
  			return this.getAttribute(name) !== null;
  		};
  	}

  	// Apply Element prototype to the pre-existing DOM as soon as the body element appears.
  	function bodyCheck() {
  		if (!(loopLimit--)) clearTimeout(interval);
  		if (document.body && !document.body.prototype && /(complete|interactive)/.test(document.readyState)) {
  			shiv(document, true);
  			if (interval && document.body.prototype) clearTimeout(interval);
  			return (!!document.body.prototype);
  		}
  		return false;
  	}
  	if (!bodyCheck()) {
  		document.onreadystatechange = bodyCheck;
  		interval = setInterval(bodyCheck, 25);
  	}

  	// Apply to any new elements created after load
  	document.createElement = function createElement(nodeName) {
  		var element = nativeCreateElement(String(nodeName).toLowerCase());
  		return shiv(element);
  	};

  	// remove sandboxed iframe
  	document.removeChild(vbody);
  }());

  })
  .call('object' === typeof window && window || 'object' === typeof self && self || 'object' === typeof global && global || {});

  (function(undefined$1) {

      // Detection from https://raw.githubusercontent.com/Financial-Times/polyfill-library/master/polyfills/Element/prototype/previousElementSibling/detect.js
      var detect = (
        'document' in this && "previousElementSibling" in document.documentElement
      );

      if (detect) return

      // Polyfill from https://raw.githubusercontent.com/Financial-Times/polyfill-library/master/polyfills/Element/prototype/previousElementSibling/polyfill.js
      Object.defineProperty(Element.prototype, 'previousElementSibling', {
        get: function(){
          var el = this.previousSibling;
          while (el && el.nodeType !== 1) { el = el.previousSibling; }
          return el;
        }
      });

  }).call('object' === typeof window && window || 'object' === typeof self && self || 'object' === typeof global && global || {});

  })));

  (function (global, factory) {
  	typeof exports === 'object' && typeof module !== 'undefined' ? factory() :
  	typeof define === 'function' && define.amd ? define('GOVUKFrontend', factory) :
  	(factory());
  }(window, (function () {
  (function(undefined$1) {

  // Detection from https://github.com/Financial-Times/polyfill-service/blob/master/packages/polyfill-library/polyfills/Window/detect.js
  var detect = ('Window' in this);

  if (detect) return

  // Polyfill from https://cdn.polyfill.io/v2/polyfill.js?features=Window&flags=always
  if ((typeof WorkerGlobalScope === "undefined") && (typeof importScripts !== "function")) {
  	(function (global) {
  		if (global.constructor) {
  			global.Window = global.constructor;
  		} else {
  			(global.Window = global.constructor = new Function('return function Window() {}')()).prototype = this;
  		}
  	}(this));
  }

  })
  .call('object' === typeof window && window || 'object' === typeof self && self || 'object' === typeof global && global || {});

  (function(undefined$1) {

  // Detection from https://github.com/Financial-Times/polyfill-service/blob/master/packages/polyfill-library/polyfills/Document/detect.js
  var detect = ("Document" in this);

  if (detect) return

  // Polyfill from https://cdn.polyfill.io/v2/polyfill.js?features=Document&flags=always
  if ((typeof WorkerGlobalScope === "undefined") && (typeof importScripts !== "function")) {

  	if (this.HTMLDocument) { // IE8

  		// HTMLDocument is an extension of Document.  If the browser has HTMLDocument but not Document, the former will suffice as an alias for the latter.
  		this.Document = this.HTMLDocument;

  	} else {

  		// Create an empty function to act as the missing constructor for the document object, attach the document object as its prototype.  The function needs to be anonymous else it is hoisted and causes the feature detect to prematurely pass, preventing the assignments below being made.
  		this.Document = this.HTMLDocument = document.constructor = (new Function('return function Document() {}')());
  		this.Document.prototype = document;
  	}
  }


  })
  .call('object' === typeof window && window || 'object' === typeof self && self || 'object' === typeof global && global || {});

  (function(undefined$1) {

  // Detection from https://github.com/Financial-Times/polyfill-service/blob/master/packages/polyfill-library/polyfills/Element/detect.js
  var detect = ('Element' in this && 'HTMLElement' in this);

  if (detect) return

  // Polyfill from https://cdn.polyfill.io/v2/polyfill.js?features=Element&flags=always
  (function () {

  	// IE8
  	if (window.Element && !window.HTMLElement) {
  		window.HTMLElement = window.Element;
  		return;
  	}

  	// create Element constructor
  	window.Element = window.HTMLElement = new Function('return function Element() {}')();

  	// generate sandboxed iframe
  	var vbody = document.appendChild(document.createElement('body'));
  	var frame = vbody.appendChild(document.createElement('iframe'));

  	// use sandboxed iframe to replicate Element functionality
  	var frameDocument = frame.contentWindow.document;
  	var prototype = Element.prototype = frameDocument.appendChild(frameDocument.createElement('*'));
  	var cache = {};

  	// polyfill Element.prototype on an element
  	var shiv = function (element, deep) {
  		var
  		childNodes = element.childNodes || [],
  		index = -1,
  		key, value, childNode;

  		if (element.nodeType === 1 && element.constructor !== Element) {
  			element.constructor = Element;

  			for (key in cache) {
  				value = cache[key];
  				element[key] = value;
  			}
  		}

  		while (childNode = deep && childNodes[++index]) {
  			shiv(childNode, deep);
  		}

  		return element;
  	};

  	var elements = document.getElementsByTagName('*');
  	var nativeCreateElement = document.createElement;
  	var interval;
  	var loopLimit = 100;

  	prototype.attachEvent('onpropertychange', function (event) {
  		var
  		propertyName = event.propertyName,
  		nonValue = !cache.hasOwnProperty(propertyName),
  		newValue = prototype[propertyName],
  		oldValue = cache[propertyName],
  		index = -1,
  		element;

  		while (element = elements[++index]) {
  			if (element.nodeType === 1) {
  				if (nonValue || element[propertyName] === oldValue) {
  					element[propertyName] = newValue;
  				}
  			}
  		}

  		cache[propertyName] = newValue;
  	});

  	prototype.constructor = Element;

  	if (!prototype.hasAttribute) {
  		// <Element>.hasAttribute
  		prototype.hasAttribute = function hasAttribute(name) {
  			return this.getAttribute(name) !== null;
  		};
  	}

  	// Apply Element prototype to the pre-existing DOM as soon as the body element appears.
  	function bodyCheck() {
  		if (!(loopLimit--)) clearTimeout(interval);
  		if (document.body && !document.body.prototype && /(complete|interactive)/.test(document.readyState)) {
  			shiv(document, true);
  			if (interval && document.body.prototype) clearTimeout(interval);
  			return (!!document.body.prototype);
  		}
  		return false;
  	}
  	if (!bodyCheck()) {
  		document.onreadystatechange = bodyCheck;
  		interval = setInterval(bodyCheck, 25);
  	}

  	// Apply to any new elements created after load
  	document.createElement = function createElement(nodeName) {
  		var element = nativeCreateElement(String(nodeName).toLowerCase());
  		return shiv(element);
  	};

  	// remove sandboxed iframe
  	document.removeChild(vbody);
  }());

  })
  .call('object' === typeof window && window || 'object' === typeof self && self || 'object' === typeof global && global || {});

  (function(undefined$1) {

  // Detection from https://github.com/Financial-Times/polyfill-service/blob/master/packages/polyfill-library/polyfills/Object/defineProperty/detect.js
  var detect = (
    // In IE8, defineProperty could only act on DOM elements, so full support
    // for the feature requires the ability to set a property on an arbitrary object
    'defineProperty' in Object && (function() {
    	try {
    		var a = {};
    		Object.defineProperty(a, 'test', {value:42});
    		return true;
    	} catch(e) {
    		return false
    	}
    }())
  );

  if (detect) return

  // Polyfill from https://cdn.polyfill.io/v2/polyfill.js?features=Object.defineProperty&flags=always
  (function (nativeDefineProperty) {

  	var supportsAccessors = Object.prototype.hasOwnProperty('__defineGetter__');
  	var ERR_ACCESSORS_NOT_SUPPORTED = 'Getters & setters cannot be defined on this javascript engine';
  	var ERR_VALUE_ACCESSORS = 'A property cannot both have accessors and be writable or have a value';

  	Object.defineProperty = function defineProperty(object, property, descriptor) {

  		// Where native support exists, assume it
  		if (nativeDefineProperty && (object === window || object === document || object === Element.prototype || object instanceof Element)) {
  			return nativeDefineProperty(object, property, descriptor);
  		}

  		if (object === null || !(object instanceof Object || typeof object === 'object')) {
  			throw new TypeError('Object.defineProperty called on non-object');
  		}

  		if (!(descriptor instanceof Object)) {
  			throw new TypeError('Property description must be an object');
  		}

  		var propertyString = String(property);
  		var hasValueOrWritable = 'value' in descriptor || 'writable' in descriptor;
  		var getterType = 'get' in descriptor && typeof descriptor.get;
  		var setterType = 'set' in descriptor && typeof descriptor.set;

  		// handle descriptor.get
  		if (getterType) {
  			if (getterType !== 'function') {
  				throw new TypeError('Getter must be a function');
  			}
  			if (!supportsAccessors) {
  				throw new TypeError(ERR_ACCESSORS_NOT_SUPPORTED);
  			}
  			if (hasValueOrWritable) {
  				throw new TypeError(ERR_VALUE_ACCESSORS);
  			}
  			Object.__defineGetter__.call(object, propertyString, descriptor.get);
  		} else {
  			object[propertyString] = descriptor.value;
  		}

  		// handle descriptor.set
  		if (setterType) {
  			if (setterType !== 'function') {
  				throw new TypeError('Setter must be a function');
  			}
  			if (!supportsAccessors) {
  				throw new TypeError(ERR_ACCESSORS_NOT_SUPPORTED);
  			}
  			if (hasValueOrWritable) {
  				throw new TypeError(ERR_VALUE_ACCESSORS);
  			}
  			Object.__defineSetter__.call(object, propertyString, descriptor.set);
  		}

  		// OK to define value unconditionally - if a getter has been specified as well, an error would be thrown above
  		if ('value' in descriptor) {
  			object[propertyString] = descriptor.value;
  		}

  		return object;
  	};
  }(Object.defineProperty));
  })
  .call('object' === typeof window && window || 'object' === typeof self && self || 'object' === typeof global && global || {});

  (function(undefined$1) {

  // Detection from https://github.com/Financial-Times/polyfill-service/blob/master/packages/polyfill-library/polyfills/Event/detect.js
  var detect = (
    (function(global) {

    	if (!('Event' in global)) return false;
    	if (typeof global.Event === 'function') return true;

    	try {

    		// In IE 9-11, the Event object exists but cannot be instantiated
    		new Event('click');
    		return true;
    	} catch(e) {
    		return false;
    	}
    }(this))
  );

  if (detect) return

  // Polyfill from https://cdn.polyfill.io/v2/polyfill.js?features=Event&flags=always
  (function () {
  	var unlistenableWindowEvents = {
  		click: 1,
  		dblclick: 1,
  		keyup: 1,
  		keypress: 1,
  		keydown: 1,
  		mousedown: 1,
  		mouseup: 1,
  		mousemove: 1,
  		mouseover: 1,
  		mouseenter: 1,
  		mouseleave: 1,
  		mouseout: 1,
  		storage: 1,
  		storagecommit: 1,
  		textinput: 1
  	};

  	// This polyfill depends on availability of `document` so will not run in a worker
  	// However, we asssume there are no browsers with worker support that lack proper
  	// support for `Event` within the worker
  	if (typeof document === 'undefined' || typeof window === 'undefined') return;

  	function indexOf(array, element) {
  		var
  		index = -1,
  		length = array.length;

  		while (++index < length) {
  			if (index in array && array[index] === element) {
  				return index;
  			}
  		}

  		return -1;
  	}

  	var existingProto = (window.Event && window.Event.prototype) || null;
  	window.Event = Window.prototype.Event = function Event(type, eventInitDict) {
  		if (!type) {
  			throw new Error('Not enough arguments');
  		}

  		var event;
  		// Shortcut if browser supports createEvent
  		if ('createEvent' in document) {
  			event = document.createEvent('Event');
  			var bubbles = eventInitDict && eventInitDict.bubbles !== undefined$1 ? eventInitDict.bubbles : false;
  			var cancelable = eventInitDict && eventInitDict.cancelable !== undefined$1 ? eventInitDict.cancelable : false;

  			event.initEvent(type, bubbles, cancelable);

  			return event;
  		}

  		event = document.createEventObject();

  		event.type = type;
  		event.bubbles = eventInitDict && eventInitDict.bubbles !== undefined$1 ? eventInitDict.bubbles : false;
  		event.cancelable = eventInitDict && eventInitDict.cancelable !== undefined$1 ? eventInitDict.cancelable : false;

  		return event;
  	};
  	if (existingProto) {
  		Object.defineProperty(window.Event, 'prototype', {
  			configurable: false,
  			enumerable: false,
  			writable: true,
  			value: existingProto
  		});
  	}

  	if (!('createEvent' in document)) {
  		window.addEventListener = Window.prototype.addEventListener = Document.prototype.addEventListener = Element.prototype.addEventListener = function addEventListener() {
  			var
  			element = this,
  			type = arguments[0],
  			listener = arguments[1];

  			if (element === window && type in unlistenableWindowEvents) {
  				throw new Error('In IE8 the event: ' + type + ' is not available on the window object. Please see https://github.com/Financial-Times/polyfill-service/issues/317 for more information.');
  			}

  			if (!element._events) {
  				element._events = {};
  			}

  			if (!element._events[type]) {
  				element._events[type] = function (event) {
  					var
  					list = element._events[event.type].list,
  					events = list.slice(),
  					index = -1,
  					length = events.length,
  					eventElement;

  					event.preventDefault = function preventDefault() {
  						if (event.cancelable !== false) {
  							event.returnValue = false;
  						}
  					};

  					event.stopPropagation = function stopPropagation() {
  						event.cancelBubble = true;
  					};

  					event.stopImmediatePropagation = function stopImmediatePropagation() {
  						event.cancelBubble = true;
  						event.cancelImmediate = true;
  					};

  					event.currentTarget = element;
  					event.relatedTarget = event.fromElement || null;
  					event.target = event.target || event.srcElement || element;
  					event.timeStamp = new Date().getTime();

  					if (event.clientX) {
  						event.pageX = event.clientX + document.documentElement.scrollLeft;
  						event.pageY = event.clientY + document.documentElement.scrollTop;
  					}

  					while (++index < length && !event.cancelImmediate) {
  						if (index in events) {
  							eventElement = events[index];

  							if (indexOf(list, eventElement) !== -1 && typeof eventElement === 'function') {
  								eventElement.call(element, event);
  							}
  						}
  					}
  				};

  				element._events[type].list = [];

  				if (element.attachEvent) {
  					element.attachEvent('on' + type, element._events[type]);
  				}
  			}

  			element._events[type].list.push(listener);
  		};

  		window.removeEventListener = Window.prototype.removeEventListener = Document.prototype.removeEventListener = Element.prototype.removeEventListener = function removeEventListener() {
  			var
  			element = this,
  			type = arguments[0],
  			listener = arguments[1],
  			index;

  			if (element._events && element._events[type] && element._events[type].list) {
  				index = indexOf(element._events[type].list, listener);

  				if (index !== -1) {
  					element._events[type].list.splice(index, 1);

  					if (!element._events[type].list.length) {
  						if (element.detachEvent) {
  							element.detachEvent('on' + type, element._events[type]);
  						}
  						delete element._events[type];
  					}
  				}
  			}
  		};

  		window.dispatchEvent = Window.prototype.dispatchEvent = Document.prototype.dispatchEvent = Element.prototype.dispatchEvent = function dispatchEvent(event) {
  			if (!arguments.length) {
  				throw new Error('Not enough arguments');
  			}

  			if (!event || typeof event.type !== 'string') {
  				throw new Error('DOM Events Exception 0');
  			}

  			var element = this, type = event.type;

  			try {
  				if (!event.bubbles) {
  					event.cancelBubble = true;

  					var cancelBubbleEvent = function (event) {
  						event.cancelBubble = true;

  						(element || window).detachEvent('on' + type, cancelBubbleEvent);
  					};

  					this.attachEvent('on' + type, cancelBubbleEvent);
  				}

  				this.fireEvent('on' + type, event);
  			} catch (error) {
  				event.target = element;

  				do {
  					event.currentTarget = element;

  					if ('_events' in element && typeof element._events[type] === 'function') {
  						element._events[type].call(element, event);
  					}

  					if (typeof element['on' + type] === 'function') {
  						element['on' + type].call(element, event);
  					}

  					element = element.nodeType === 9 ? element.parentWindow : element.parentNode;
  				} while (element && !event.cancelBubble);
  			}

  			return true;
  		};

  		// Add the DOMContentLoaded Event
  		document.attachEvent('onreadystatechange', function() {
  			if (document.readyState === 'complete') {
  				document.dispatchEvent(new Event('DOMContentLoaded', {
  					bubbles: true
  				}));
  			}
  		});
  	}
  }());

  })
  .call('object' === typeof window && window || 'object' === typeof self && self || 'object' === typeof global && global || {});

  })));

  function nodeListForEach (nodes, callback) {
    if (window.NodeList.prototype.forEach) {
      return nodes.forEach(callback)
    }
    for (var i = 0; i < nodes.length; i++) {
      callback.call(window, nodes[i], i, nodes);
    }
  }

  function SubNavTabs ($module) {
    this.$module = $module;
    this.$body = document.querySelector('body');

    this.keys = { left: 37, right: 39, up: 38, down: 40 };
    this.jsHiddenClass = 'govuk-tabs__panel--hidden';
  }

  SubNavTabs.prototype.init = function (params) {
    this.setupOptions(params);
    this.$tabs = this.$module.querySelectorAll(this.subNavTabsSelector);

    if (typeof window.matchMedia === 'function') {
      this.setupResponsiveChecks();
    } else {
      this.setup();
    }

    return this
  };

  SubNavTabs.prototype.setupResponsiveChecks = function () {
    this.mql = window.matchMedia('(min-width: 40.0625em)');
    this.mql.addListener(this.checkMode.bind(this));
    this.checkMode();
  };

  SubNavTabs.prototype.checkMode = function () {
    if (this.mql.matches) {
      this.setup();
    } else {
      this.teardown();
    }
  };

  SubNavTabs.prototype.setup = function () {
    var $module = this.$module;
    var $tabs = this.$tabs;
    var $tabList = $module.querySelector(this.subNavListSelector);
    var $tabListItems = $module.querySelectorAll(this.subNavListItemSelector);

    if (!$tabs || !$tabList || !$tabListItems) {
      return
    }

    $tabList.setAttribute('role', 'tablist');

    nodeListForEach($tabListItems, function ($item) {
      $item.setAttribute('role', 'presentation');
    });

    nodeListForEach($tabs, function ($tab) {
      // Set HTML attributes
      this.setAttributes($tab);

      // Save bounded functions to use when removing event listeners during teardown
      $tab.boundTabClick = this.onTabClick.bind(this);
      $tab.boundTabKeydown = this.onTabKeydown.bind(this);

      // Handle events
      $tab.addEventListener('click', $tab.boundTabClick, true);
      $tab.addEventListener('keydown', $tab.boundTabKeydown, true);

      // Remove old active panels
      this.hideTab($tab);
    }.bind(this));

    // Show either the active tab according to the URL's hash or the first tab
    var $activeTab = this.getTab(window.location.hash) || this.$tabs[0];
    this.showTab($activeTab);

    // Handle hashchange events
    $module.boundOnHashChange = this.onHashChange.bind(this);
    window.addEventListener('hashchange', $module.boundOnHashChange, true);

    // Add class to acknowledge module has been initiated
    this.$body.classList.add(this.subNavActivatedClass);
  };

  SubNavTabs.prototype.teardown = function () {
    var $module = this.$module;
    var $tabs = this.$tabs;
    var $tabList = $module.querySelector(this.subNavListSelector);
    var $tabListItems = $module.querySelectorAll(this.subNavListItemSelector);

    if (!$tabs || !$tabList || !$tabListItems) {
      return
    }

    $tabList.removeAttribute('role');

    nodeListForEach($tabListItems, function ($item) {
      $item.removeAttribute('role', 'presentation');
    });

    nodeListForEach($tabs, function ($tab) {
      // Remove events
      $tab.removeEventListener('click', $tab.boundTabClick, true);
      $tab.removeEventListener('keydown', $tab.boundTabKeydown, true);

      // Unset HTML attributes
      this.unsetAttributes($tab);
    }.bind(this));

    // Remove hashchange event handler
    window.removeEventListener('hashchange', $module.boundOnHashChange, true);

    // Remove class acknowledging module was initiated
    this.$body.classList.remove(this.subNavActivatedClass);
  };

  SubNavTabs.prototype.onHashChange = function (e) {
    var hash = window.location.hash;
    // if user hits back button to none hashed state then need to show the first tab
    var $tabWithHash = this.getTab(hash) || this.$tabs[0];

    // Prevent changing the hash
    if (this.changingHash) {
      this.changingHash = false;
      return
    }

    // Show either the active tab according to the URL's hash or the first tab
    var $previousTab = this.getCurrentTab();

    this.hideTab($previousTab);
    this.showTab($tabWithHash);
    $tabWithHash.focus();
  };

  SubNavTabs.prototype.hideTab = function ($tab) {
    this.unhighlightTab($tab);
    this.hidePanel($tab);
  };

  SubNavTabs.prototype.showTab = function ($tab) {
    this.highlightTab($tab);
    this.showPanel($tab);
  };

  SubNavTabs.prototype.getTab = function (hash) {
    return this.$module.querySelector(`${this.subNavTabsSelector}[href="${hash}"]`)
  };

  SubNavTabs.prototype.setAttributes = function ($tab) {
    // set tab attributes
    var panelId = this.getHref($tab).slice(1);
    $tab.setAttribute('id', 'tab_' + panelId);
    $tab.setAttribute('role', 'tab');
    $tab.setAttribute('aria-controls', panelId);
    $tab.setAttribute('aria-selected', 'false');
    $tab.setAttribute('tabindex', '-1');

    // set panel attributes
    var $panel = this.getPanel($tab);
    $panel.setAttribute('role', 'tabpanel');
    $panel.setAttribute('aria-labelledby', $tab.id);
    $panel.classList.add(this.jsHiddenClass);
  };

  SubNavTabs.prototype.unsetAttributes = function ($tab) {
    // unset tab attributes
    $tab.removeAttribute('id');
    $tab.removeAttribute('role');
    $tab.removeAttribute('aria-controls');
    $tab.removeAttribute('aria-selected');
    $tab.removeAttribute('tabindex');

    // unset panel attributes
    var $panel = this.getPanel($tab);
    $panel.removeAttribute('role');
    $panel.removeAttribute('aria-labelledby');
    $panel.classList.remove(this.jsHiddenClass);
  };

  SubNavTabs.prototype.onTabClick = function (e) {
    const tabClass = this.subNavTabsSelector.replace('.', '');
    if (!e.target.classList.contains(tabClass)) {
    // Allow events on child DOM elements to bubble up to tab parent
      return false
    }
    e.preventDefault();
    var $newTab = e.target;
    var $currentTab = this.getCurrentTab();
    this.hideTab($currentTab);
    this.showTab($newTab);
    this.createHistoryEntry($newTab);
  };

  SubNavTabs.prototype.createHistoryEntry = function ($tab) {
    var $panel = this.getPanel($tab);

    // Save and restore the id
    // so the page doesn't jump when a user clicks a tab (which changes the hash)
    var id = $panel.id;
    $panel.id = '';
    this.changingHash = true;
    window.location.hash = this.getHref($tab).slice(1);
    $panel.id = id;
  };

  SubNavTabs.prototype.onTabKeydown = function (e) {
    switch (e.keyCode) {
      case this.keys.left:
      case this.keys.up:
        this.activatePreviousTab();
        e.preventDefault();
        break
      case this.keys.right:
      case this.keys.down:
        this.activateNextTab();
        e.preventDefault();
        break
    }
  };

  SubNavTabs.prototype.activateNextTab = function () {
    var currentTab = this.getCurrentTab();
    var nextTabListItem = currentTab.parentNode.nextElementSibling;
    if (nextTabListItem) {
      var nextTab = nextTabListItem.querySelector(this.subNavTabsSelector);
    }
    if (nextTab) {
      this.hideTab(currentTab);
      this.showTab(nextTab);
      nextTab.focus();
      this.createHistoryEntry(nextTab);
    }
  };

  SubNavTabs.prototype.activatePreviousTab = function () {
    var currentTab = this.getCurrentTab();
    var previousTabListItem = currentTab.parentNode.previousElementSibling;
    if (previousTabListItem) {
      var previousTab = previousTabListItem.querySelector(this.subNavTabsSelector);
    }
    if (previousTab) {
      this.hideTab(currentTab);
      this.showTab(previousTab);
      previousTab.focus();
      this.createHistoryEntry(previousTab);
    }
  };

  SubNavTabs.prototype.getPanel = function ($tab) {
    var $panel = this.$module.querySelector(this.getHref($tab));
    return $panel
  };

  SubNavTabs.prototype.showPanel = function ($tab) {
    var $panel = this.getPanel($tab);
    $panel.classList.remove(this.jsHiddenClass);
  };

  SubNavTabs.prototype.hidePanel = function (tab) {
    var $panel = this.getPanel(tab);
    $panel.classList.add(this.jsHiddenClass);
  };

  SubNavTabs.prototype.unhighlightTab = function ($tab) {
    $tab.setAttribute('aria-selected', 'false');
    $tab.parentNode.classList.remove(this.subNavTabSelectedClass);
    $tab.setAttribute('tabindex', '-1');
  };

  SubNavTabs.prototype.highlightTab = function ($tab) {
    $tab.setAttribute('aria-selected', 'true');
    $tab.parentNode.classList.add(this.subNavTabSelectedClass);
    $tab.setAttribute('tabindex', '0');
  };

  SubNavTabs.prototype.getCurrentTab = function () {
    const selector = `.${this.subNavTabSelectedClass} ${this.subNavTabsSelector}`;
    return this.$module.querySelector(selector)
  };

  // this is because IE doesn't always return the actual value but a relative full path
  // should be a utility function most prob
  // http://labs.thesedays.com/blog/2010/01/08/getting-the-href-value-with-jquery-in-ie/
  SubNavTabs.prototype.getHref = function ($tab) {
    var href = $tab.getAttribute('href');
    var hash = href.slice(href.indexOf('#'), href.length);
    return hash
  };

  SubNavTabs.prototype.setupOptions = function (params) {
    params = params || {};
    this.subNavActivatedClass = params.subNavActivatedClass || 'dl-subnav--init';
    this.subNavListSelector = params.subNavListSelector || '.dl-subnav__list';
    this.subNavListItemSelector = params.subNavListItemSelector || '.dl-subnav__list-item';
    this.subNavTabsSelector = params.subNavTabsSelector || '.dl-subnav__list-item__link';
    this.subNavTabSelectedClass = params.subNavTabSelectedClass || 'dl-subnav__list-item--selected';
    this.hideClass = params.hideClass || 'back-to-top--hidden';
    this.fixClass = params.fixClass || 'back-to-top--fixed';
  };

  function polyfill (options) {
    // polyfill for browsers without NodeList forEach method
    if (window.NodeList && !window.NodeList.prototype.forEach) {
      window.NodeList.prototype.forEach = window.Array.prototype.forEach;
    }
  }

  function initAll (options) {
    // Set the options to an empty object by default if no options are passed.
    options = typeof options !== 'undefined' ? options : {};

    // Allow the user to initialise Digital Land Frontend in only certain sections of the page
    // Defaults to the entire document if nothing is set.
    var scope = typeof options.scope !== 'undefined' ? options.scope : document;

    // load required polyfills
    polyfill();

    var $bttButtons = convertNodeListToArray$1(scope.querySelectorAll('[data-module="dl-back-to-top-button"]'));
    $bttButtons.forEach(function ($button) {
      new BackToTop($button).init();
    });

    var $formToFilterList = scope.querySelector('[data-module="dl-list-filter-form"]');
    if ($formToFilterList) {
      new ListFilter($formToFilterList).init();
    }

    var $filters = scope.querySelectorAll('[data-module="selected-counter"]');
    $filters.forEach(function($filter) {
      new FilterGroupSelectedCounter($filter).init();
    });

    var $filterCheckboxes = scope.querySelectorAll('[data-module="filter-checkboxes"]');
    $filterCheckboxes.forEach(function($el) {
      new FilterCheckboxes($el).init();
    });

    var $subNavTabs = scope.querySelector('[data-module="dl-subnav"]');
    // check element was found before initialising
    if ($subNavTabs) {
      new SubNavTabs($subNavTabs).init({});
    }

    var $scrollableTables = scope.querySelectorAll('[data-module="scrollable-table"]');
    $scrollableTables.forEach(function($table) {
      new HorizontalScrollableTable($table).init();
    });
  }

  exports.BackToTop = BackToTop;
  exports.FilterCheckboxes = FilterCheckboxes;
  exports.FilterGroupSelectedCounter = FilterGroupSelectedCounter;
  exports.HorizontalScrollableTable = HorizontalScrollableTable;
  exports.ListFilter = ListFilter;
  exports.SubNavTabs = SubNavTabs;
  exports.initAll = initAll;
  exports.polyfill = polyfill;

  Object.defineProperty(exports, '__esModule', { value: true });

}));
