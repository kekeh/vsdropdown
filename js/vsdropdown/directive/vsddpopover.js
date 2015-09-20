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
