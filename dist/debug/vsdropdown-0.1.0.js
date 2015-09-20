/* 
*  Name: vsdropdown 
*  Description: Virtual scroll dropdown - AngularJS reusable UI component 
*  Version: 0.1.0 
*  Author: kekeh 
*  Homepage: http://kekeh.github.io/vsdropdown 
*  License: MIT 
*  Date: 2015-09-20 
*/ 
angular.module('template-vsdropdown-0.1.0.html', []).run(['$templateCache', function($templateCache) {
  $templateCache.put("templates/vsdropdown/vsdditemcontent.html",
    "<table class=vsitemcontent><tr><td style=width:18px ng-if=options.input.isObject&&options.input.properties.enabled><span class=\"icon vsiconproperties\" popover-window ng-click=showProperties($event) ng-keydown=\"$event.which===13?showProperties($event):null\" ng-class=\"popover!==null?'icon-down':'icon-right'\" tabindex=0></span></td><td class=vsitemtext tooltip-window>{{getPropertyValue(visiblePropName, item)}}</td><td ng-if=\"id===1\" style=width:16px><span class=\"icon vsiconcross icon-cross\" tabindex=0 ng-click=\"removeItem($index, $event)\" ng-keydown=\"$event.which===13?removeItem($index, $event):null\"></span></td><td class=vsiconcheck ng-if=\"id===2\" ng-show=isItemSelected(item) style=width:22px><span class=\"icon icon-check\"></span></td></tr></table>");
  $templateCache.put("templates/vsdropdown/vsddoverlay.html",
    "<div class=vsoverlay opacity ng-style=\"{'opacity': opacity}\" ng-if=\"showOverlay&&selectedItems.length>1\" ng-mouseleave=closeOverlay()><div class=vsoverlaytitle><span class=vsoverlaytitletext>{{selectedItems.length}} {{options.selection.selectionsTxt}}</span> <span class=\"icon vsiconoverlaycross icon-cross\" ng-click=closeOverlay() ng-keydown=\"$event.which===13?closeOverlay():null\" tabindex=0></span></div><div class=\"vsselecteditem vsselecteditemcolor\" ng-click=$event.stopPropagation() ng-repeat=\"item in selectedItems track by $index\"><div class=vsiteminclude ng-include=\"'templates/vsdropdown/vsdditemcontent.html'\" ng-init=\"id=1\"></div></div></div>");
  $templateCache.put("templates/vsdropdown/vsddpopover.html",
    "<div class=vstooltip style=margin-top:-24px;margin-left:24px opacity ng-style=\"{'opacity': opacity}\"><table class=vsproperties ng-click=closeProperties();$event.stopPropagation()><tr><th>{{options.input.properties.propertyTitle}}</th><th>{{options.input.properties.valueTitle}}</th></tr><tr ng-repeat=\"prop in options.input.properties.props\"><td>{{prop}}</td><td>{{getPropertyValue(prop, item)}}</td></tr></table></div>");
  $templateCache.put("templates/vsdropdown/vsddtooltip.html",
    "<div class=vstooltip style=margin-top:-20px;margin-left:10px opacity ng-style=\"{'opacity': opacity}\" ng-click=closeTooltip($event) ng-keydown=\"$event.which===13?closeTooltip($event):null\" tabindex=0><span class=vstooltiptext>{{getPropertyValue(visiblePropName, item)}}</span></div>");
  $templateCache.put("templates/vsdropdown/vsdropdown.html",
    "<div class=vsdropdown ng-click=$event.stopPropagation() ng-style=\"{'border-radius':showSelector?'2px 2px 0 0':'2px'}\"><div class=vsselectiongroup><div ng-if=\"options.selection.maximum>1\" ng-include=\"'templates/vsdropdown/vsddoverlay.html'\"></div><div class=vsselection ng-style=\"{'padding-right': selectedItems.length>1?'60px':'30px'}\" ng-click=selector()><div class=\"vsselecteditem vsselecteditemcolor\" ng-show=\"$index===0\" ng-click=$event.stopPropagation() ng-repeat=\"item in selectedItems track by $index\"><div class=vsiteminclude ng-include=\"'templates/vsdropdown/vsdditemcontent.html'\" ng-init=\"id=1\"></div></div></div><span class=vsselbtngroup><button class=vsbtnselections ng-if=\"selectedItems.length>1\" ng-click=openOverlay()><span class=\"icon vsiconselections icon-selections\"></span></button> <button class=vsbtnselector ng-click=selector()><span class=\"icon vsiconselector\" ng-class=\"showSelector ? 'icon-up' : 'icon-down'\"></span></button> <span class=vsselectioncounttxt ng-if=\"options.selection.showCount&&selectedItems.length>1\" ng-click=openOverlay()>{{selectedItems.length}}</span></span></div><div class=vsselector ng-show=showSelector><table style=\"width: 100%\" class=vsfiltergroup ng-show=options.filter.enabled ng-class=\"{'vsnohitsfilter': filteredItemCount===0, 'vshitsfilter': filteredItemCount>0}\"><tr><td><input class=vsfilterinput ng-model=filterText ng-model-options=\"{debounce: config.FILTERING_BEGIN_DELAY}\" data-ng-trim=false placeholder={{options.filter.filterPlaceholderTxt}} ng-keydown=keyDown($event) ng-blur=\"focusIdx=-1\"></td><td class=vsfiltermatch><span class=vsfiltermatchtext>{{filteredItemCount>0?filteredItemCount:options.filter.noHitsTxt}}</span></td><td class=vsiconfilterclear style=width:24px ng-show=\"filterText.length>0\"><span class=\"icon vsiconclear icon-clear\" ng-click=clearFilter() ng-keydown=\"$event.which===13?clearFilter():null\" tabindex=0></span></td></tr></table><div class=vsscrollbar vsddscrollbar items=options.items items-in-page={{options.visibleItemCount}} ng-keydown=keyDown($event) ng-focus=focus() ng-blur=blur() list-focus height={{options.visibleItemCount*config.ITEM_HEIGHT+1}} on-scroll-change-fn=\"onScrollChange(topIndex, maxIndex, topPos, maxPos, filteredPageCount, filteredItemCount, visibleItems)\" on-focus-scrollbox-fn=onFocusScrollbox(focused) tabindex=0><div class=vsitem ng-repeat=\"item in visibleItems track by $index\" ng-click=\"itemClicked($index, $event)\" ng-class=\"{'vsselecteditemcolor':isItemSelected(item),'vsfocuseditemcolor':focusIdx===$index}\"><div class=vsiteminclude ng-include=\"'templates/vsdropdown/vsdditemcontent.html'\" ng-init=\"id=2\"></div></div></div></div></div>");
  $templateCache.put("templates/vsscrollbar/vsscrollbar.html",
    "<table class=vsscrollbarcontainer ng-show=\"filteredItems.length>0\" style=border-collapse:separate;border-spacing:0;padding:0;height:100%><tr><td style=width:100%;padding:0;vertical-align:top><div class=vsscrollbarcontent ng-style=\"{'margin': scrollbarVisible?'1px 0 1px 1px':'1px'}\" style=overflow-y:hidden;padding:0;outline:0 ng-transclude></div></td><td style=padding:0;height:100%><div class=vsscrollbar ng-show=scrollbarVisible style=float:right;height:100%;padding:0;margin:1px><div class=vsscrollbox tabindex=0 ng-focus=scrollBoxFocus() ng-blur=scrollBoxBlur() ng-style=\"{'height': boxHeight + 'px'}\" ng-click=$event.stopPropagation() style=position:relative;padding:0;outline:0></div></div></td></tr></table>");
}]);

/**
 * @ngdoc object
 * @name vsdropdown
 * @description vsdropdown is module of the vsdropdown
 */
var _vsdd = angular.module('vsdropdown', ["template-vsdropdown-0.1.0.html"]);

/**
 * @ngdoc object
 * @name vsdropdownConfig
 * @description vsdropdownConfig contain constants and configuration of the vsdropdown
 */
_vsdd.constant('vsdropdownConfig', {
    ITEM_HEIGHT: 31,
    LIST_FOCUS_EVENT: 'vsdropdown.listFocusEvent',
    OPERATION_ADD: '+',
    OPERATION_DEL: '-',
    DOT_SEPARATOR: '.',
    TOOLTIP_OPEN_DELAY: 900,
    FILTERING_BEGIN_DELAY: 500
});

/**
 * @ngdoc object
 * @name vsdropdownService
 * @description vsdropdownService contain common code of the vsdropdown.
 */
_vsdd.service('vsdropdownService', ['$templateCache', function ($templateCache) {
    this.getTemplate = function (name) {
        return $templateCache.get(name);
    };
}]);

/**
 * @ngdoc object
 * @name vsdropdown
 * @description vsdropdown is main directive of the component.
 */
_vsdd.directive('vsdropdown', ['$timeout', 'vsddsbEvent', function ($timeout, vsddsbEvent) {
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
                            vsddsbEvent.setIndex(scope, scope.topIndex - scope.options.visibleItemCount);
                            scope.focusIdx = scope.filteredItemCount < scope.options.visibleItemCount ? scope.filteredItemCount - 1 : scope.options.visibleItemCount - 1;
                        }
                        else {
                            scope.focusIdx--;
                        }
                    }
                    else if (event.which === 40) {
                        if (isFocusBottom()) {
                            vsddsbEvent.setIndex(scope, scope.topIndex + scope.options.visibleItemCount);
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
                    vsddsbEvent.filter(scope, createFilterObj(fltObj));
                }
                else {
                    vsddsbEvent.filter(scope, scope.filterText);
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

/**
 * @ngdoc object
 * @name listFocus
 * @description listFocus is directive which set focus to the list when the
 * selector is opened.
 */
_vsdd.directive('listFocus', ['$timeout', function ($timeout) {
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
            };

            scope.focus = function () {
                scope.focusIdx = 0;
            };
        }
    };
}]);

/**
 * @ngdoc object
 * @name tooltipWindow
 * @description tooltipWindow directive implements overlay window to long values in the columns.
 */
_vsdd.directive('tooltipWindow', ['$compile', '$timeout', 'vsdropdownService', function ($compile, $timeout, vsdropdownService) {
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
                        tooltip = angular.element(vsdropdownService.getTemplate('templates/vsdropdown/vsddtooltip.html'));
                        element.append($compile(tooltip)(scope));
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
}]);

/**
 * @ngdoc object
 * @name popoverWindow
 * @description popoverWindow directive implements popover window which show all properties of the item.
 */
_vsdd.directive('popoverWindow', ['$compile', 'vsdropdownService', function ($compile, vsdropdownService) {
    return {
        restrict: 'A',
        scope: false,
        link: function (scope, element, attrs) {
            scope.popover = null;
            var scrollChangeWatch = null;

            scope.showProperties = function (event) {
                event.stopPropagation();
                if (angular.equals(scope.popover, null)) {
                    scope.popover = angular.element(vsdropdownService.getTemplate('templates/vsdropdown/vsddpopover.html'));
                    element.append($compile(scope.popover)(scope));
                }
                else {
                    scope.closeProperties();
                }
            };

            scope.closeProperties = function () {
                if (!angular.equals(scope.popover, null)) {
                    scope.popover.remove();
                    scope.popover = null;
                }
            };

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
}]);

/**
 * @ngdoc object
 * @name opacity
 * @description opacity is directive which adds opacity effect to the windows (overlay and tooltip).
 */
_vsdd.directive('opacity', ['$interval', function ($interval) {
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

/**
 * @ngdoc object
 * @name vssbConf
 * @description vssbConf contain constants and configuration of the vsscrollbar
 */
_vsdd.constant('vssbConf', {
    ITEMS_IN_PAGE: 6,
    SCROLLBAR_HEIGHT: 0,
    SCROLLBOX_MIN_HEIGHT: 18
});

/**
 * @ngdoc object
 * @name vsddsbEvent
 * @description vsddsbEvent contain event function of the vsddscrollbar
 */
_vsdd.factory('vsddsbEvent', function () {
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

    return factory;
});

/**
 * @ngdoc object
 * @name vsddsbService
 * @description vsddsbService contain service functions of the vsddscrollbar
 */
_vsdd.service('vsddsbService', function () {
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
});

/**
 * @ngdoc object
 * @name vsddscrollbar
 * @description vsddscrollbar is main directive of the vsddscrollbar component.
 */
_vsdd.directive('vsddscrollbar', ['$filter', '$timeout', '$document', 'vsddsbService', 'vssbConf', function ($filter, $timeout, $document, vsddsbService, vssbConf) {
    return {
        restrict: 'AE',
        scope: {
            ngModel: '=?',
            items: '=items',
            onScrollChangeFn: '&',
            onFocusScrollboxFn: '&'
        },
        transclude: true,
        templateUrl: 'templates/vsscrollbar/vsscrollbar.html',
        link: function (scope, element, attrs) {
            scope.filteredItems = [];
            var scrollbarContent = angular.element(element[0].querySelector('.vsscrollbarcontent'));
            var scrollbar = angular.element(element[0].querySelector('.vsscrollbar'));
            var scrollbox = scrollbar.children();
            var itemsInPage = !angular.isUndefined(attrs.itemsInPage) ? scope.$eval(attrs.itemsInPage) : vssbConf.ITEMS_IN_PAGE;
            var scrollbarHeight = !angular.isUndefined(attrs.height) ? scope.$eval(attrs.height) : vssbConf.SCROLLBAR_HEIGHT;
            var scrollStart = 0, index = 0, maxIdx = 0, position = 0, maxPos = 0;
            var filterStr = '';

            scope.boxHeight = vssbConf.SCROLLBOX_MIN_HEIGHT;
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
                setScrollPos(vsddsbService.validatePos(pos, maxPos));
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
                setScrollPos(vsddsbService.validatePos(value < scope.boxHeight ? 0 : value, maxPos));
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
                    setScrollPos(vsddsbService.validatePos(Math.round(data.value), maxPos));
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
                scope.boxHeight = height < vssbConf.SCROLLBOX_MIN_HEIGHT ? vssbConf.SCROLLBOX_MIN_HEIGHT : height;
                maxIdx = scope.filteredItems.length - itemsInPage < 0 ? 0 : scope.filteredItems.length - itemsInPage;
                maxPos = scrollbarHeight - scope.boxHeight < 0 ? 0 : scrollbarHeight - scope.boxHeight;
            }

            function setScrollPos(pos) {
                if ((pos = Math.round(pos)) !== position) {
                    position = pos;
                    index = vsddsbService.calcIndex(position, maxIdx, maxPos);
                    moveScrollBox();
                }
            }

            function setIndex(idx, verifyChange) {
                if ((idx = vsddsbService.validateIndex(idx, maxIdx)) !== index || !verifyChange) {
                    index = idx;
                    position = vsddsbService.calcScrollPos(index, maxIdx, maxPos);
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
