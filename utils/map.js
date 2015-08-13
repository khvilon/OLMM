(function (module) {

    module.getViewPortCoords = function () {
        var self = this;
        var extent = self.map.getView().calculateExtent(self.map.getSize());
        var extent_to_transform = [[extent[0], extent[1]], [extent[2], extent[3]]];
        return self.transform_to_lot_lan(extent_to_transform)
    };

    module.fitToCoords = function (lon, lat) {
        var self = this;
        self.map.getView().setCenter(self.transform([lon, lat]));
    };

    module.fitToFeature = function (feature) {
        var self = this;
        self.map.getView().setCenter(feature.getGeometry().getCoordinates());
    };

    module.fitToExtent = function (source_name) {
        var self = this;
        var source = self.getSourceByName(source_name);
        self.map.getView().fitExtent(source.getExtent(), self.map.getSize());
    };

    module.getCoordsForRequest = function () {
        var coords = this.getViewPortCoords();

        return {
            'min_lot': coords[0],
            'min_lat': coords[1],
            'max_lot': coords[2],
            'max_lat': coords[3]
        }
    };

})(OLMM.prototype);
