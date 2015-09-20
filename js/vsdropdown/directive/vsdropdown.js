/**
 * @ngdoc object
 * @name vsdropdown
 * @description vsdropdown is main directive of the component.
 */
_vsdd.directive('vsdropdown', ['$timeout', 'vsscrollbarEvent', function ($timeout, vsscrollbarEvent) {
    return {
        restrict: 'EA',
        templateUrl: 'templates/vsdropdown/vsdropdown.html',
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
}]);
