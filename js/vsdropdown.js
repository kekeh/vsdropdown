angular.module('vsscrollbar', [])
    .constant('vsscrollbarConfig', {
        ITEMS_IN_PAGE: 6,
        SCROLLBAR_HEIGHT: 0,
        SCROLLBOX_MIN_HEIGHT: 18
    })
    .factory('vsscrollbarEvent', function () {
        var factory = {};
        factory.setIndex = function ($scope, index) {
            broadcast($scope, 'setIndex', index);
        };

        factory.setPosition = function ($scope, position) {
            broadcast($scope, 'setPosition', position);
        };

        factory.filter = function ($scope, filterStr) {
            broadcast($scope, 'filter', filterStr);
        };

        factory.addItem = function ($scope, index, item) {
            broadcast($scope, 'addItem', {index: index, item: item});
        };

        factory.updateItem = function ($scope, index, item) {
            broadcast($scope, 'updateItem', {index: index, item: item});
        };

        factory.deleteItem = function ($scope, index) {
            broadcast($scope, 'deleteItem', index);
        };

        function broadcast($scope, type, data) {
            $scope.$broadcast('vsmessage', {type: type, value: data});
        }
        ;
        return factory;
    })
    .service('vsscrollbarService', function () {
        this.calcIndex = function (pos, maxIndex, maxPos) {
            var idx = 0;
            if (this.checkIsMaxPos(pos, maxPos)) {
                idx = maxIndex;
            }
            else if (pos > 0) {
                idx = this.validateIndex(Math.round(pos / maxPos * maxIndex), maxIndex);
            }
            return idx;
        };

        this.calcScrollPos = function (index, maxIndex, maxPos) {
            var pos = 0;
            if (index > 0) {
                if (this.checkIsMaxIndex(index, maxIndex)) {
                    pos = maxPos;
                }
                else {
                    pos = Math.round(index / maxIndex * maxPos);
                }
            }
            return this.validatePos(pos, maxPos, index, maxIndex);
        };

        this.validateIndex = function (index, maxIndex) {
            return index <= 0 ? 0 : this.checkIsMaxIndex(index, maxIndex) ? maxIndex : index;
        };

        this.validatePos = function (pos, maxPos, index, maxIndex) {
            if (angular.isUndefined(index) || angular.isUndefined(maxIndex)) {
                return pos <= 0 ? 0 : pos >= maxPos ? maxPos : pos;
            }
            return pos <= 0 && index > 0 ? 1 : pos >= maxPos && index < maxIndex ? maxPos - 1 : pos;
        };

        this.checkIsMaxIndex = function (index, maxIndex) {
            return index >= maxIndex;
        };

        this.checkIsMaxPos = function (pos, maxPos) {
            return pos >= maxPos;
        };
    })
    .directive('vsscrollbar', ['$filter', '$timeout', '$document', 'vsscrollbarService', 'vsscrollbarConfig', function ($filter, $timeout, $document, vsscrollbarService, vsscrollbarConfig) {
        return {
            restrict: 'AE',
            scope: {
                ngModel: '=?',
                items: '=items',
                onScrollChangeFn: '&',
                onFocusScrollboxFn: '&'
            },
            transclude: true,
            templateUrl: 'templates/vsscrollbar.html',
            link: function (scope, element, attrs) {
                scope.filteredItems = [];
                var scrollbarContent = angular.element(element[0].querySelector('.vsscrollbarcontent'));
                var scrollbar = angular.element(element[0].querySelector('.vsscrollbar'));
                var scrollbox = scrollbar.children();
                var itemsInPage = !angular.isUndefined(attrs.itemsInPage) ? scope.$eval(attrs.itemsInPage) : vsscrollbarConfig.ITEMS_IN_PAGE;
                var scrollbarHeight = !angular.isUndefined(attrs.height) ? scope.$eval(attrs.height) : vsscrollbarConfig.SCROLLBAR_HEIGHT;
                var scrollStart = 0, index = 0, maxIdx = 0, position = 0, maxPos = 0;
                var filterStr = '';

                scope.boxHeight = vsscrollbarConfig.SCROLLBOX_MIN_HEIGHT;
                scope.scrollbarVisible = true;

                scrollbox.on('mousedown touchstart', onScrollMoveStart);

                function onScrollMoveStart(event) {
                    event.preventDefault();
                    scrollStart = angular.isUndefined(event.changedTouches) ? event.clientY - position : event.changedTouches[0].clientY - position;
                    $document.on(angular.isUndefined(event.changedTouches) ? 'mousemove' : 'touchmove', onScrollMove);
                    $document.on(angular.isUndefined(event.changedTouches) ? 'mouseup' : 'touchend', onScrollMoveEnd)
                }

                function onScrollMove(event) {
                    var pos = angular.isUndefined(event.changedTouches) ? event.clientY - scrollStart : event.changedTouches[0].clientY - scrollStart;
                    setScrollPos(vsscrollbarService.validatePos(pos, maxPos));
                    scope.$apply();
                }

                function onScrollMoveEnd(event) {
                    $document.off(angular.isUndefined(event.changedTouches) ? 'mousemove' : 'touchmove', onScrollMove);
                    $document.off(angular.isUndefined(event.changedTouches) ? 'mouseup' : 'touchend', onScrollMoveEnd);
                }

                scrollbarContent.on('touchstart', onTouchStartList);

                function onTouchStartList(event) {
                    scrollStart = event.changedTouches[0].clientY;
                    $document.on('touchmove', onTouchMoveList);
                    $document.on('touchend', onTouchEndList);
                }

                function onTouchMoveList(event) {
                    event.preventDefault();
                    var pos = event.changedTouches[0].clientY;
                    indexChange(pos < scrollStart ? itemsInPage : -itemsInPage);
                    scrollStart = pos;
                    scope.$apply();
                }

                function onTouchEndList() {
                    $document.off('touchmove', onTouchMoveList);
                    $document.off('touchend', onTouchEndList);
                }

                scrollbar.on('click', onScrollbarClick);

                function onScrollbarClick(event) {
                    var value = event.offsetY || event.layerY;
                    setScrollPos(vsscrollbarService.validatePos(value < scope.boxHeight ? 0 : value, maxPos));
                    scope.$apply();
                }

                scrollbox.on('click', onScrollboxClick);

                function onScrollboxClick() {
                    scrollbox[0].focus();
                }

                scrollbarContent.on('mousewheel DOMMouseScroll', onScrollMouseWheel);
                scrollbar.on('mousewheel DOMMouseScroll', onScrollMouseWheel);

                function onScrollMouseWheel(event) {
                    event.preventDefault();
                    var isDown = (event.wheelDelta || -event.detail) <= 0;
                    indexChange(isDown ? itemsInPage : -itemsInPage);
                }

                scrollbox.on('keydown', onKeydown);

                function onKeydown(event) {
                    if (event.which === 38 || event.which === 40) {
                        event.preventDefault();
                        indexChange(event.which === 38 ? -itemsInPage : itemsInPage);
                    }
                }

                scope.$on('vsmessage', onScrollbarMessage);

                function onScrollbarMessage(event, data) {
                    if (data.type === 'setIndex' && data.value !== index && data.value >= 0) {
                        setIndex(Math.round(data.value), true);
                    }
                    else if (data.type === 'setPosition' && data.value !== position && data.value >= 0) {
                        setScrollPos(vsscrollbarService.validatePos(Math.round(data.value), maxPos));
                    }
                    else if (data.type === 'filter') {
                        filterStr = data.value;
                        filterItems(filterStr, 0);
                    }
                    else if (data.type === 'addItem' && data.value.index >= 0 && data.value.index <= scope.items.length) {
                        scope.items.splice(data.value.index, 0, data.value.item);
                        filterItems(filterStr, index);
                    }
                    else if (data.type === 'updateItem' && data.value.index >= 0 && data.value.index < scope.items.length) {
                        scope.items[data.value.index] = data.value.item;
                        filterItems(filterStr, index);
                    }
                    else if (data.type === 'deleteItem' && data.value >= 0 && data.value < scope.items.length) {
                        scope.items.splice(data.value, 1);
                        filterItems(filterStr, index);
                    }
                }

                scope.$on('$destroy', function () {
                    scrollbox.off('mousedown touchstart', onScrollMoveStart);
                    scrollbarContent.off('touchstart', onTouchStartList);
                    scrollbar.off('click', onScrollbarClick);
                    scrollbox.off('click', onScrollboxClick);
                    scrollbarContent.off('mousewheel DOMMouseScroll', onScrollMouseWheel);
                    scrollbar.off('mousewheel DOMMouseScroll', onScrollMouseWheel);
                    scrollbox.off('keydown', onKeydown);
                });

                function filterItems(filter, idx) {
                    scope.filteredItems = (filter === '') ? scope.items : $filter('filter')(scope.items, filter);
                    scope.scrollbarVisible = scope.filteredItems.length > itemsInPage;
                    initScrollValues();
                    setIndex(idx, false);
                }

                function initScrollValues() {
                    var height = Math.floor(scrollbarHeight / (scope.filteredItems.length / itemsInPage));
                    scope.boxHeight = height < vsscrollbarConfig.SCROLLBOX_MIN_HEIGHT ? vsscrollbarConfig.SCROLLBOX_MIN_HEIGHT : height;
                    maxIdx = scope.filteredItems.length - itemsInPage < 0 ? 0 : scope.filteredItems.length - itemsInPage;
                    maxPos = scrollbarHeight - scope.boxHeight < 0 ? 0 : scrollbarHeight - scope.boxHeight;
                }

                function setScrollPos(pos) {
                    if ((pos = Math.round(pos)) !== position) {
                        position = pos;
                        index = vsscrollbarService.calcIndex(position, maxIdx, maxPos);
                        moveScrollBox();
                    }
                }

                function setIndex(idx, verifyChange) {
                    if ((idx = vsscrollbarService.validateIndex(idx, maxIdx)) !== index || !verifyChange) {
                        index = idx;
                        position = vsscrollbarService.calcScrollPos(index, maxIdx, maxPos);
                        moveScrollBox();
                    }
                }

                function indexChange(idx) {
                    setIndex(index + idx, true);
                    scope.$apply();
                }

                function moveScrollBox() {
                    scrollbox.css('top', position + 'px');
                    onScrollChange();
                }

                function onScrollChange() {
                    var responseData = {
                        topIndex: index,
                        maxIndex: maxIdx,
                        topPos: position,
                        maxPos: maxPos,
                        filteredPageCount: scope.filteredItems.length / itemsInPage,
                        filteredItemCount: scope.filteredItems.length,
                        visibleItems: slice()
                    };
                    scope.onScrollChangeFn(responseData);
                    scope.ngModel = responseData;
                }

                function slice() {
                    return scope.filteredItems.slice(index, index + itemsInPage);
                }

                scope.scrollBoxFocus = function () {
                    scope.onFocusScrollboxFn({focused: true});
                }

                scope.scrollBoxBlur = function () {
                    scope.onFocusScrollboxFn({focused: false});
                }

                function init() {
                    scope.filteredItems = scope.items;
                    if (scrollbarHeight === 0) {
                        $timeout(setHeight, 0);
                    }
                    else {
                        scrollbar.css('height', scrollbarHeight + 'px');
                        initScrollValues();
                    }
                    setIndex(0, false);
                }

                function setHeight() {
                    scrollbarHeight = scrollbarContent.prop('offsetHeight');
                    scrollbar.css('height', scrollbarHeight + 'px');
                    initScrollValues();
                }

                init();
            }
        };
    }]);


/**
 * @ngdoc object
 * @name vsdropdown
 * @description vsdropdown is module of the vsdropdown
 */
angular.module('vsdropdown', ['vsscrollbar'])
    .constant('vsdropdownConfig', {
        ITEM_HEIGHT: 37,
        LIST_FOCUS_EVENT: 'vsdropdown.listFocusEvent',
        OPERATION_ADD: '+',
        OPERATION_DEL: '-',
        DOT_SEPARATOR: '.',
        TOOLTIP_OPEN_DELAY: 900,
        FILTERING_BEGIN_DELAY: 500
    })

/**
 * @ngdoc object
 * @name vsdropdownService
 * @description vsdropdownService contain common code of the vsdropdown.
 */
    .service('vsdropdownService', ['$http', '$templateCache', function ($http, $templateCache) {
        this.getTemplate = function (name) {
            var promise = $http.get(name, {cache: $templateCache}).success(function (response) {
                return response.data;
            });
            return promise;
        };
    }])

/**
 * @ngdoc object
 * @name vsdropdown
 * @description vsdropdown is main directive of the component.
 */
    .directive('vsdropdown', ['$timeout', 'vsscrollbarEvent', function ($timeout, vsscrollbarEvent) {
        return {
            restrict: 'EA',
            templateUrl: 'templates/vsdropdown.html',
            scope: {
                options: '='
            },
            controller: ['$scope', 'vsdropdownConfig', function ($scope, vsdropdownConfig) {
                $scope.config = vsdropdownConfig;
                $scope.filterText = '';
                $scope.showOverlay = false;
                $scope.topIndex = 0;
                $scope.focusIdx = -1;

                $scope.listFocusEvent = function () {
                    $scope.$broadcast($scope.config.LIST_FOCUS_EVENT);
                };
            }],
            link: function (scope, element, attrs) {
                scope.selectedItems = [];
                scope.showSelector = false;
                var scrollFocus = false;

                scope.selector = function () {
                    scope.showSelector = !scope.showSelector;
                    if (scope.showSelector) {
                        scope.listFocusEvent();
                        scope.focusIdx = 0;
                    }
                };

                scope.openOverlay = function () {
                    if (scope.showSelector) {
                        scope.selector();
                    }
                    scope.showOverlay = true;
                };

                scope.closeOverlay = function () {
                    scope.showOverlay = false;
                };

                scope.itemClicked = function (index, event) {
                    var item = scope.visibleItems[index];
                    if (!scope.isItemSelected(item)) {
                        scope.addItem(item, event);
                    }
                    else {
                        scope.removeItem(scope.selectedItems.indexOf(item), event);
                    }
                    if (scope.options.selection.maximum === 1) {
                        scope.showSelector = false;
                    }
                    else {
                        scope.focusIdx = index;
                    }
                };

                scope.addItem = function (item, event) {
                    event.stopPropagation();
                    if (scope.options.selection.maximum > 1) {
                        if (scope.selectedItems.length === scope.options.selection.maximum) {
                            scope.removeItem(scope.selectedItems.length - 1, event);
                        }
                        scope.selectedItems.push(item);
                    }
                    else {
                        scope.selectedItems[0] = item;
                    }
                    notifyParent(item, scope.config.OPERATION_ADD);
                };

                scope.removeItem = function (index, event) {
                    event.stopPropagation();
                    var item = scope.selectedItems[index];
                    if (index === scope.selectedItems.length - 1 || scope.selectedItems.length === 2) {
                        scope.closeOverlay();
                    }
                    scope.selectedItems.splice(index, 1);
                    notifyParent(item, scope.config.OPERATION_DEL);
                };

                scope.isItemSelected = function (item) {
                    return scope.selectedItems.indexOf(item) !== -1;
                };

                scope.getPropertyValue = function (prop, item) {
                    if (prop === null) {
                        return item;
                    }
                    else if (prop.indexOf(scope.config.DOT_SEPARATOR) === -1) {
                        return item[prop];
                    }

                    return processNestedObject(prop, item);
                };

                scope.onScrollChange = function (topIndex, maxIndex, topPos, maxPos, filteredPageCount, filteredItemCount, visibleItems) {
                    scope.topIndex = topIndex;
                    scope.filteredItemCount = filteredItemCount;
                    scope.visibleItems = visibleItems;
                };

                scope.onFocusScrollbox = function (focused) {
                    scrollFocus = focused;
                };

                scope.keyDown = function (event) {
                    if (!scrollFocus) {
                        if (event.which === 13 || event.which === 38 || event.which === 40 || event.which === 27) {
                            event.preventDefault();
                        }
                        if (event.which === 13 && scope.focusIdx > -1) {
                            scope.itemClicked(scope.focusIdx, event);
                        }
                        else if (event.which === 38) {
                            if (scope.focusIdx === 0) {
                                vsscrollbarEvent.setIndex(scope, scope.topIndex - scope.options.visibleItemCount);
                                scope.focusIdx = scope.filteredItemCount < scope.options.visibleItemCount ? scope.filteredItemCount - 1 : scope.options.visibleItemCount - 1;
                            }
                            else {
                                scope.focusIdx--;
                            }
                        }
                        else if (event.which === 40) {
                            if (isFocusBottom()) {
                                vsscrollbarEvent.setIndex(scope, scope.topIndex + scope.options.visibleItemCount);
                                scope.focusIdx = 0;
                            }
                            else {
                                scope.focusIdx++;
                            }
                        }
                        else if (event.which === 27) {
                            scope.showSelector = false;
                        }
                    }
                };

                scope.clearFilter = function () {
                    scope.filterText = '';
                    scope.listFocusEvent();
                };

                var filterWatch = scope.$watch('filterText', filterWatchFn);

                function filterWatchFn(newVal, oldVal) {
                    if (newVal !== oldVal) {
                        filter();
                    }
                }

                var itemsWatch = scope.$watch('options.items.length', itemsWatchFn);

                function itemsWatchFn(newVal, oldVal) {
                    if (newVal !== oldVal) {
                        $timeout(function () {
                            filter();
                        });
                    }
                }

                function filter() {
                    if (scope.options.input.isObject) {
                        var fltObj = {};
                        vsscrollbarEvent.filter(scope, createFilterObj(fltObj));
                    }
                    else {
                        vsscrollbarEvent.filter(scope, scope.filterText);
                    }
                }

                function createFilterObj(fltObj) {
                    var parts = scope.visiblePropName.split(scope.config.DOT_SEPARATOR);
                    var last = parts.pop();
                    for (var i = 0, tmp = fltObj; i < parts.length; i++) {
                        tmp = tmp[parts[i]] = {};
                    }
                    tmp[last] = scope.filterText;
                    return fltObj;
                }

                function notifyParent(item, oper) {
                    if (!angular.isUndefined(scope.options.itemSelectCb)) {
                        scope.options.itemSelectCb(scope.selectedItems, item, oper);
                    }
                }

                function isFocusBottom() {
                    return scope.focusIdx === scope.options.visibleItemCount - 1 || scope.focusIdx === scope.filteredItemCount - 1;
                }

                function processNestedObject(prop, item) {
                    var parts = prop.split(scope.config.DOT_SEPARATOR);
                    var tempVal = angular.copy(item);
                    angular.forEach(parts, function (p) {
                        tempVal = tempVal[p];
                    });
                    return tempVal;
                }

                function init() {
                    scope.visiblePropName = scope.options.input.isObject ? scope.options.input.visiblePropName : null;
                    scope.selectedItems = scope.options.selectedItems;
                }

                scope.$on('$destroy', function () {
                    filterWatch();
                    itemsWatch();
                });

                init();
            }
        };
    }])

/**
 * @ngdoc object
 * @name listFocus
 * @description listFocus is directive which set focus to the list when the
 * selector is opened.
 */
    .directive('listFocus', ['$timeout', function ($timeout) {
        return {
            restrict: 'A',
            scope: false,
            link: function (scope, element, attrs) {
                scope.$on(scope.config.LIST_FOCUS_EVENT, function () {
                    $timeout(function () {
                        element[0].focus();
                    });
                });

                scope.blur = function () {
                    scope.focusIdx = -1;
                }

                scope.focus = function () {
                    scope.focusIdx = 0;
                }
            }
        };
    }])

/**
 * @ngdoc object
 * @name tooltipWindow
 * @description tooltipWindow directive implements overlay window to long values in the columns.
 */
    .directive('tooltipWindow', ['$compile', '$timeout', 'vsdropdownService', function ($compile, $timeout, vsdropdownService) {
        return {
            restrict: 'A',
            scope: false,
            link: function (scope, element, attrs) {
                var tooltip = null;
                var timer = null;
                var scrollChangeWatch = null;

                scope.closeTooltip = function (event) {
                    event.stopPropagation();
                    onMouseLeave();
                };

                function onMouseEnter() {
                    if (element[0].scrollWidth > element[0].offsetWidth) {
                        timer = $timeout(function () {
                            vsdropdownService.getTemplate('vstooltip.html').then(function (tpl) {
                                tooltip = angular.element(tpl.data);
                                element.append($compile(tooltip)(scope));
                            });
                        }, scope.config.TOOLTIP_OPEN_DELAY);
                    }
                }

                function onMouseLeave() {
                    cancelTimer();
                    if (!angular.equals(tooltip, null)) {
                        tooltip.remove();
                        tooltip = null;
                    }
                }

                function cancelTimer() {
                    $timeout.cancel(timer);
                    timer = null;
                }

                function scrollChangeWatchFn(newVal, oldVal) {
                    if (!angular.equals(newVal, oldVal)) {
                        onMouseLeave();
                    }
                }

                scope.$on('$destroy', function () {
                    element.off('mouseenter', onMouseEnter);
                    element.off('mouseleave', onMouseLeave);
                    if (!angular.equals(scrollChangeWatch, null)) {
                        scrollChangeWatch();
                    }
                });

                function init() {
                    if (scope.options.showTooltip) {
                        element.on('mouseenter', onMouseEnter);
                        element.on('mouseleave', onMouseLeave);
                        scrollChangeWatch = scope.$watch('topIndex', scrollChangeWatchFn);
                    }
                }

                init();
            }
        };
    }])

/**
 * @ngdoc object
 * @name popoverWindow
 * @description popoverWindow directive implements popover window which show all properties of the item.
 */
    .directive('popoverWindow', ['$compile', 'vsdropdownService', function ($compile, vsdropdownService) {
        return {
            restrict: 'A',
            scope: false,
            link: function (scope, element, attrs) {
                scope.popover = null;
                var scrollChangeWatch = null;

                scope.showProperties = function (event) {
                    event.stopPropagation();
                    if (angular.equals(scope.popover, null)) {
                        vsdropdownService.getTemplate('vspopover.html').then(function (tpl) {
                            scope.popover = angular.element(tpl.data);
                            element.append($compile(scope.popover)(scope));
                        });
                    }
                    else {
                        scope.closeProperties();
                    }
                }

                scope.closeProperties = function () {
                    if (!angular.equals(scope.popover, null)) {
                        scope.popover.remove();
                        scope.popover = null;
                    }
                }

                function scrollChangeWatchFn(newVal, oldVal) {
                    if (!angular.equals(newVal, oldVal)) {
                        scope.closeProperties();
                    }
                }

                scope.$on('$destroy', function () {
                    if (!angular.equals(scrollChangeWatch, null)) {
                        scrollChangeWatch();
                    }
                });

                function init() {
                    scrollChangeWatch = scope.$watch('topIndex', scrollChangeWatchFn);
                }

                init();
            }
        };
    }])

/**
 * @ngdoc object
 * @name opacity
 * @description opacity is directive which adds opacity effect to the windows (overlay and tooltip).
 */
    .directive('opacity', ['$interval', function ($interval) {
        return {
            restrict: 'A',
            scope: false,
            link: function (scope, element, attrs) {
                scope.opacity = scope.options.fadeInEffects ? 0 : 1;
                var interval = null;

                function fadeIn() {
                    scope.opacity += 0.05;
                }

                function init() {
                    if (scope.options.fadeInEffects) {
                        interval = $interval(fadeIn, 10, 20);
                    }
                }

                scope.$on('$destroy', function () {
                    if (!angular.equals(interval, null)) {
                        $interval.cancel(interval);
                    }
                });

                init();
            }
        };
    }]);