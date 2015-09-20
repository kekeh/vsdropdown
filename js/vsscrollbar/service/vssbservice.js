/**
 * @ngdoc object
 * @name vsddsbService
 * @description vsddsbService contain service functions of the vsddscrollbar
 */
_vsdd.service('vsddsbService', function () {
    this.calcIndex = function (pos, maxIndex, maxPos) {
        var idx = 0;
        if (this.checkIsMaxPos(pos, maxPos)) {
            idx = maxIndex;
        }
        else if (pos > 0) {
            idx = this.validateIndex(Math.round(pos / maxPos * maxIndex), maxIndex);
        }
        return idx;
    };

    this.calcScrollPos = function (index, maxIndex, maxPos) {
        var pos = 0;
        if (index > 0) {
            if (this.checkIsMaxIndex(index, maxIndex)) {
                pos = maxPos;
            }
            else {
                pos = Math.round(index / maxIndex * maxPos);
            }
        }
        return this.validatePos(pos, maxPos, index, maxIndex);
    };

    this.validateIndex = function (index, maxIndex) {
        return index <= 0 ? 0 : this.checkIsMaxIndex(index, maxIndex) ? maxIndex : index;
    };

    this.validatePos = function (pos, maxPos, index, maxIndex) {
        if (angular.isUndefined(index) || angular.isUndefined(maxIndex)) {
            return pos <= 0 ? 0 : pos >= maxPos ? maxPos : pos;
        }
        return pos <= 0 && index > 0 ? 1 : pos >= maxPos && index < maxIndex ? maxPos - 1 : pos;
    };

    this.checkIsMaxIndex = function (index, maxIndex) {
        return index >= maxIndex;
    };

    this.checkIsMaxPos = function (pos, maxPos) {
        return pos >= maxPos;
    };
});
