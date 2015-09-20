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
