OLMM.prototype.createWayLayers = function() {
    var self = this;
    self.addLayer('osm', self.createOSMLayer());
    self.addLayer('ways', this.createVectorLayer(
        function (feature, resolution) {
            var featureStateMap = {
                '1': 'red',
                '0': 'blue'
            };

            var featureState = feature.getProperties()['is_federal'];
            var color = featureStateMap[featureState];
            console.log(color);

            var styles = [
                new ol.style.Style({
                    stroke: new ol.style.Stroke({
                        color: color,
                        width: 2
                    })
                })
            ];

            return styles;
        }
    ));
};

OLMM.prototype.waysGetCoordsForRequest = function () {
    var self = this;
    var coords = self.getViewPortCoords();

    var d = {
        lon0: coords[0][0],
        lat0: coords[0][1],
        lon1: coords[1][0],
        lat1: coords[1][1],
        type: 'nofed'
    };
    console.log(d);
    return d
};
