describe('vsdropdown', function () {
    var elm, scope;

    beforeEach(module('vsdropdown'));

    beforeEach(inject(function ($rootScope, $compile) {

        scope = $rootScope;


        elm = angular.element('<vsdropdown options="opt"></vsdropdown>');

        $compile(elm)(scope);
        scope.$digest();

    }));

    it("test 1", function () {

    });


});