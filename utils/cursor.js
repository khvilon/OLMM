OLMM.prototype.makePointerCursor = function () {
    this.map.getViewport().style.cursor = 'pointer';
};

OLMM.prototype.makeDefaultCursor = function () {
    this.map.getViewport().style.cursor = '';
};
