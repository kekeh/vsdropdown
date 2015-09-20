/**
 * @ngdoc object
 * @name vsdropdownService
 * @description vsdropdownService contain common code of the vsdropdown.
 */
_vsdd.service('vsdropdownService', ['$templateCache', function ($templateCache) {
    this.getTemplate = function (name) {
        return $templateCache.get(name);
    };
}]);
