# vsdropdown v. 0.0.1

**Virtual scroll dropdown - AngularJS reusable UI component**

## Description
AngularJS directive which implements the virtual scroll dropdown.

### 1. virtualization
* only visible items are rendered in the browser
* good performance even millions of items

### 2. custom scrollbar
* scrollbar can be customized by CSS
* looks similar in all browsers

### 3. filtering
* built in global filter
* uses AngularJS filter

### 4. responsive UI
* vsdropdown UI is responsive and scalable to different size of devices

### 5. tooltips
* tooltips are used to shown the string which are not fit to the vsdropdown

### 6. touch and keyboard
* works with touch devices
* works with keyboard

### 7. accepts objects
* input object is array of objects (items) or array of strings

### 8. no dependencies
* Depends only AngularJS

## Usage

* include the **vsdropdown-0.0.1.min.js** and the **vsdropdown-0.0.1.min.css** files into your project. See the **Build project** and the **Installation** chapters below.
```html
<script src="vsscrollbar-0.0.1.min.js"></script>
<link href="vsscrollbar-0.0.1.min.css" rel="stylesheet" type="text/css">
```
* inject the **vsdropdown** module into your application module.
```js
angular.module('sampleapp', ['vsdropdown']);
```
* add **vsdropdown** HTML tag into your HTML file. See the **HTML example** chapter below.
* add needed Javascript code. See the **Javascript example** chapter below.

### HTML example
```html
<div ng-app="sampleapp" ng-controller="sampleappctrl">
    <vsdropdown options="opt"</vsdropdown>
</div>
```

### Tags
| Tag  | Description | Mandatory | 
| :------------ |:---------------|:---------------:|
| vsdropdown | vsdropdown tag | yes | 


### Attributes
| Attribute | Description | Mandatory | 
| :------------ |:---------------|:---------------:|
| options | vsdropdown configuration object. See below. | yes |


### Options data (an options attribute in the vsdropdown directive)

| Attribute | Description | Values | Mandatory |
| :------------ |:---------------|:---------------|:---------------|
| **items** | Array of data shown in the vsdropdown. | Array of strings or array of objects. | yes |
| **selectedItems** | Selected items. Contains all items. | Array of strings or array of objects| yes |
| **input** | Object which contain sub properties. | See below. | yes |
| input.**isObject** | Is items (see above) array of strings or array of objects. | true or false | yes |
| input.**visiblePropName** | This is visible property name. Only if **isObject** is true. | string | depends value of previous property |
| **filter** | Object which contain sub properties. | See below. | yes |
| filter.**filterPlaceholderTxt** | Filter input box placeholder text. | string | yes |
| filter.**noHitsTxt** | Filter no hits text. | string | yes |
| **selection** | Object which contain sub properties. | See below. | yes |
| selection.**maximum** | Maximum selection count. If the dropdown is single select, put number 1 to this. | number | yes |
| selection.**selectionsTxt** | Selections text. Visible in the overlay | text | if previous value is bigger than 1 |
| selection.**showCount** | Is selection count visible or not. Count is visible in the show overlay button. | true or false | if previous value is bigger than 1 |
| **visibleItemCount** | Visible item count in the selector. | number | yes |
| **showTooltip** | Is tooltips shown or not. | true or false | yes |
| **fadeInEffects** | Is fade in effects used in the overlay and the tooltips. | true or false | yes |
| **itemSelectCb** | Item selcect callback function. | function | no. It is also possible to use AngularJS watch. See chapter **Javascript example** |

### Javascript example
```js
var sampleapp = angular.module('sampleapp', ['vsdropdown']);
sampleapp.controller('sampleappctrl', function ($scope) {

    // Watch the user selections - invoked when the user select/deselect item from the vsdropdown
    $scope.$watch('opt.selectedItems', function (newVal, oldVal) {
        if (newVal !== oldVal) {
            console.log('PARENT - watch: ', newVal);
        }
    }, true);
    
    // Configuration example of the vsdropdown. This example doesn't show all configuration properties
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
        fadeInEffects: true,
        itemSelectCb: onSelectItem
    };
};
```


#### itemSelectCb

Example of the function. See description of the parameters below the example.

```js
function onSelectItem(items, selection, operation) {
    if (selection !== undefined) {
        console.log('PARENT - onSelectItem(): Selected item(s): ', items, ' - Selection: ', selection, ' - Operation: ', operation);
    }
}
```

| Function | Parameters | Description | 
| :------------ |:---------------|:---------------|
| onSelectItem | items, selection and operation | Called when the user selects/deselects item from the UI. |

##### Parameters
* items - all selected items
* selection - item which selection/deselection caused this event
* operation - select or deselect. select is + and deselect is -


## Demo
In the **examples** folder of this project has the sample application and the online demo is [here](http://kekeh.github.io/vsdropdown)

## Dependencies
Depends on AngularJS. Implemented using the AngularJS version 1.3.16.

## Build project
* Build can be done by executing the **grunt** command. It creates the **dist/debug** and the **dist/min** folders and put files to these folders.
```js
grunt
```

## Installation
* Installation can be done using the **bower**. It installs files from the **dist/debug** and the **dist/min** folders. Needed CSS and javascript files are located in these folders.
```js
bower install vsdropdown
```

## Compatibility (tested with)
* IE 9+
* Firefox 36.0.4
* Google Chrome 41.0.2272.101
* Opera 28.0
* Safari 5.1

## Licence
* License: MIT

## Author
* Author: kekeh
