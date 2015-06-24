OLMM.prototype.initGisApp = function () {
    var self = this;

    self.addStyle('icon', self.createIconStyle(olmm.config['ssk_icon']));

    var layer_name = 'edit';
    var layer = self.getLayerByName(layer_name);
    if (!layer) {
        self.addLayer(layer_name, self.createVectorLayer(
            [
                new ol.style.Style({
                    stroke: new ol.style.Stroke({
                        color: 'green',
                        width: 3
                    }),
                    image: new ol.style.Circle({
                      radius: 7,
                      fill: new ol.style.Fill({
                        color: '#ff9900',
                        opacity: 0.6
                      }),
                      stroke: new ol.style.Stroke({
                        color: '#ffcc00',
                        opacity: 0.4
                      })
                    })
                })
            ]
        ));
    }
};

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

OLMM.prototype.updateSSKPoints = function () {
    var self = this;
    self.updateFeaturesStyleWithFilter({
        source_name: 'edit',
        style_name: 'icon',
        filter_params: {"objecttype": 1}
    })
};
