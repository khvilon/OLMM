(function (module) {

    module.transform = function (data) {
        return module._transform(data, 'EPSG:4326', 'EPSG:3857');
    };

    module.transform_to_lot_lan = function (data) {
        return module._transform(data, 'EPSG:3857', 'EPSG:4326');
    };

    module._transform = function (data, from, to) {

        if (!data) {
            return;
        }

        if (data[0].length > 1) {
            return data.map(function (line_coords) {
                return ol.proj.transform(line_coords, from, to)
            });
        }
        else {
            return ol.proj.transform(data, from, to)
        }
    };

    module.transformWithGeometry = function (feature) {
        var geometry = feature.getGeometry();
        var geometry_type = geometry.getType();
        var coords = geometry.getCoordinates();
        var geometry_type_map = {
            'LineString': ol.geom.LineString,
            'Point': ol.geom.Point,
            'Polygon': ol.geom.Polygon,
            'Circle': ol.geom.Circle
        };

        feature.setGeometry(new geometry_type_map[geometry_type](module.transform(coords)));

        return feature;
    };

    module.transformPointsToLine = function (features, source_name){
        var self = this;

        var line_coords = features.map(function (feature) {
            return feature.getGeometry().getCoordinates();
        });

        var feature = new ol.Feature({
            geometry: new ol.geom.LineString(line_coords)
        });

        if (source_name) {
            self.getSourceByName(source_name).addFeature(feature);
        }
        return feature
    };

})(OLMM.prototype);
