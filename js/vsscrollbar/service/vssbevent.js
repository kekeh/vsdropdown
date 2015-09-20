/**
 * @ngdoc object
 * @name vsscrollbarEvent
 * @description vsscrollbarEvent contain event function of the vsscrollbar
 */
_vsdd.factory('vsscrollbarEvent', function () {
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
