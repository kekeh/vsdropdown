/**
 * @ngdoc object
 * @name sampleapp
 * @description Module which uses the vsdropdown component.
 */
var sampleapp = angular.module('sampleapp', ['vsdropdown']);

/**
 * @ngdoc object
 * @name sampleappctrl
 * @description Controller which uses the vsdropdown component. Multiple selection. String array as input.
 */
sampleapp.controller('sampleappctrl', function ($scope, $http) {

    function onSelectItem(items, selection, operation) {
        if (selection !== undefined) {
            console.log('PARENT - onSelectItem(): Selected item(s): ', items, ' - Selection: ', selection, ' - Operation: ', operation);
        }
    }

    var selectedItems = [];

    // Read the items from the file
    function getDataFromFile() {
        setTimeout(function () {
            $http.get('demo/data/items.json').success(function (data) {
                $scope.opt.items = data;
            });
        }, 10);
    }

    // Configuration of the vsdropdown
    $scope.opt = {
        items: [],
        selectedItems: [],
        input: {
            isObject: true,
            visiblePropName: 'name',
            properties: {
                enabled: true,
                props: ['id', 'active', 'date', 'car.price'],
                propertyTitle: 'Property',
                valueTitle: 'Value'
            }
        },
        filter: {
            enabled: true,
            filterPlaceholderTxt: 'Type filter...',
            noHitsTxt: 'No hits'
        },
        selection: {
            maximum: 20,
            selectionsTxt: 'selections',
            showCount: true
        },
        visibleItemCount: 4,
        showTooltip: false,
        fadeInEffects: true,
        itemSelectCb: onSelectItem
    };

    getDataFromFile();

});