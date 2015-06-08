OLMM.prototype.getCoordsForRequest = function () {
    var self = this;
    var coords = self.getViewPortCoords();

    return {
        'min_lot': coords[0],
        'min_lat': coords[1],
        'max_lot': coords[2],
        'max_lat': coords[3]
    }

};
