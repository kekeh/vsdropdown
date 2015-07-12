describe('vsdropdown', function () {
    var elm, scope;

    beforeEach(module('vsdropdown'));

    beforeEach(inject(function ($rootScope, $compile) {

        scope = $rootScope;

        scope.opt = {
            items: ['i1', 'i2', 'i3', 'i4', 'i5', 'i6', 'i7'],
            selectedItems: ['i2', 'i6'],
            input: {
                isObject: false
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
            visibleItemCount: 3,
            showTooltip: true,
            fadeInEffects: true
        };

        elm = angular.element('<vsdropdown options="opt"></vsdropdown>');

        $compile(elm)(scope);
        scope.$digest();

    }));

    it('is vsselectiongroup', function () {
        expect(elm[0].querySelectorAll('.vsselectiongroup').length).toBe(1);
    });

    it('is vsselection', function () {
        expect(elm[0].querySelectorAll('.vsselection').length).toBe(1);
    });

    it('is vsselecteditem', function () {
        expect(elm[0].querySelectorAll('.vsselecteditem').length).toBe(2);
    });

    it('is vsselbtngroup', function () {
        expect(elm[0].querySelectorAll('.vsselbtngroup').length).toBe(1);
    });


    it('is vsbtnselections', function () {
        expect(elm[0].querySelectorAll('.vsbtnselections').length).toBe(1);
    });

    it('is vsbtnselector', function () {
        expect(elm[0].querySelectorAll('.vsbtnselector').length).toBe(1);
    });

    it('is vsselectioncounttxt', function () {
        expect(elm[0].querySelectorAll('.vsselectioncounttxt').length).toBe(1);
    });

    it('is vsselectioncounttxt value 2', function () {
        var nbrElem = elm[0].querySelector('.vsselectioncounttxt');
        expect(angular.element(nbrElem).text()).toEqual('2');
    });


    it('is vsselector', function () {
        expect(elm[0].querySelectorAll('.vsselector').length).toBe(1);
    });

    it('is vsfiltergroup', function () {
        expect(elm[0].querySelectorAll('.vsfiltergroup').length).toBe(1);
    });

    it('is vsfilterinput', function () {
        expect(elm[0].querySelectorAll('.vsfilterinput').length).toBe(1);
    });

    it('is vsfiltermatch', function () {
        expect(elm[0].querySelectorAll('.vsfiltermatch').length).toBe(1);
    });

    it('is vsfiltermatchtext value 7', function () {
        var matchTxt = elm[0].querySelector('.vsfiltermatchtext');
        expect(angular.element(matchTxt).text()).toEqual('7');
    });


    it('is vsitem', function () {
        expect(elm[0].querySelectorAll('.vsitem').length).toBe(3);
    });

    it('is vsiteminclude', function () {
        expect(elm[0].querySelectorAll('.vsiteminclude').length).toBe(5);
    });

    it('is vsiconcross', function () {
        expect(elm[0].querySelectorAll('.vsiconcross').length).toBe(2);
    });



});