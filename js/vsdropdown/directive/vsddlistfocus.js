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
