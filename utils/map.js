(function (module) {

    module.getViewPortCoords = function () {
        var self = this;
        var extent = self.map.getView().calculateExtent(self.map.getSize());
        var extent_to_transform = [[extent[0], extent[1]], [extent[2], extent[3]]];
        return self.transform_to_lot_lan(extent_to_transform)
    };

    module.getMapImage = function (elementId) {
        var self = this;

        self.map.once('postcompose', function(event) {
            var canvas = event.context.canvas;
            document.getElementById(elementId).href = canvas.toDataURL('image/png');
            this.renderSync();
        })
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

})(OLMM.prototype);
