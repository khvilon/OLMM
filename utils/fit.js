OLMM.prototype.fitToExtent = function (source) {
    this.map.getView().fitExtent(source.getExtent(), this.map.getSize());
};
