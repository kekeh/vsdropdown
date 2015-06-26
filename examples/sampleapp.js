/**
 * @ngdoc object
 * @name sampleapp
 * @description Module which uses the vsdropdown component.
 */
var sampleapp = angular.module('sampleapp', ['vsdropdown']);

/**
 * @ngdoc object
 * @name sampleappctrl1
 * @description Controller which uses the vsdropdown component. Multiple selection. String array as input.
 */
sampleapp.controller('sampleappctrl1', function ($scope) {

    var items = [];
    var selectedItems = [];

    $scope.$watch('opt.selectedItems', function (newVal, oldVal) {
        if (newVal !== oldVal) {
            console.log('PARENT - watch: ', newVal);
        }
    }, true);

    var generatedCount = 1000000;
    generateItems();

    // Configuration of the vsdropdown
    $scope.opt = {
        items: items,
        selectedItems: selectedItems,
        input: {
            isObject: false
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
            items.push((i % 6 === 0) ?
            'Item #' + (i + 1) + ' with lorem ipsum dolor sit amet, consectetuer adipiscing elit sed posuere interdum sem'
                :
            'Item #' + (i + 1));
        }
        // Set selcted item indecies 1 and 9999
        selectedItems = [items[0], items[999]];
    }

});

/**
 * @ngdoc object
 * @name sampleappctrl2
 * @description Controller which uses the vsdropdown component. Single selection. Object array as input.
 */
sampleapp.controller('sampleappctrl2', function ($scope) {

    function onSelectItem(items, selection, operation) {
        if (selection !== undefined) {
            console.log('PARENT - onSelectItem(): Selected item(s): ', items, ' - Selection: ', selection, ' - Operation: ', operation);
        }
    }

    var items = [];
    var selectedItems = [];

    var generatedCount = 20000;
    generateItems();

    // Configuration of the vsdropdown
    $scope.opt = {
        items: items,
        selectedItems: selectedItems,
        input: {
            isObject: true,
            visiblePropName: 'name'
        },
        filter: {
            filterPlaceholderTxt: 'Type filter...',
            noHitsTxt: 'No hit(s)'
        },
        selection: {
            maximum: 1
        },
        visibleItemCount: 5,
        showTooltip: true,
        fadeInEffects: true,
        itemSelectCb: onSelectItem
    };

    // generate test items to the vsdropdown
    function generateItems() {
        for (var i = 0; i < generatedCount; i++) {
            items.push((i % 8 === 0) ?
            {
                id: (i + 1),
                name: 'Item #' + (i + 1) + ' with lorem ipsum dolor sit amet, consectetuer adipiscing elit sed posuere interdum sem'
            }
                :
            {id: (i + 1), name: 'Item #' + (i + 1)});
        }
    }

});