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
