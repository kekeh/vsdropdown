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
sampleapp.controller('sampleappctrl', function ($scope) {

    var items = [];
    var selectedItems = [];

    $scope.$watch('opt.selectedItems', function (newVal, oldVal) {
        if (newVal !== oldVal) {
            console.log('PARENT - watch: ', newVal);
        }
    }, true);

    var generatedCount = 100000;
    generateItems();

    // Configuration of the vsdropdown
    $scope.opt = {
        items: items,
        selectedItems: selectedItems,
        input: {
            isObject: true,
            visiblePropName: 'name',
            properties: {
                enabled: true,
                props: ['id', 'active', 'number'],
                propertyTitle: 'Property',
                valueTitle: 'Value'
            }
        },
        filter: {
            enabled: true,
            filterPlaceholderTxt: 'Type filter...',
            noHitsTxt: 'No hit(s)'
        },
        selection: {
            maximum: 20,
            selectionsTxt: 'selections',
            showCount: true
        },
        visibleItemCount: 4,
        showTooltip: true,
        fadeInEffects: true
    };

    // generate test items to the vsdropdown
    function generateItems() {
        for (var i = 0; i < generatedCount; i++) {
            items.push((i % 4 === 0) ?
            {
                id: (i + 1),
                name: 'Item #' + (i + 1) + ' with lorem ipsum dolor sit amet, consectetuer adipiscing elit sed posuere interdum sem',
                active: 'yes',
                number: Math.floor((Math.random() * 100000000) + 1000)
            }
                :
            {
                id: (i + 1),
                name: 'Item #' + (i + 1),
                active: 'no',
                number: Math.floor((Math.random() * 100000000) + 1000)
            });
        }

        selectedItems.push(items[99]);
    }

});
