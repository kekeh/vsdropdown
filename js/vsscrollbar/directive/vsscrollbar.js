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
                var event = window.event || event;
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
