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

        // polygon && multilinestring
        if (data.length == 1) {
            data = data[0];
        }

        if (data[0] instanceof Array) {
            return data.map(function (line_coords) {
                return ol.proj.transform(line_coords, from, to)
            });
        }
        else {
            return ol.proj.transform(data, from, to)
        }
    };

    module.transformWithGeometryFromLonLat = function (feature) {
        return module.transformWithGeometry(feature, module.transform)
    };

    module.transformWithGeometryToLonLat = function (feature) {
        return module.transformWithGeometry(feature, module.transform_to_lot_lan)
    };

    module.transformWithGeometry = function (feature, transform_function) {
        var geometry = feature.getGeometry();
        var geometry_type = geometry.getType();
        var coords = geometry.getCoordinates();

        var geometry_type_map = {
            'LineString': ol.geom.LineString,
            'Point': ol.geom.Point,
            'Polygon': ol.geom.Polygon,
            'Circle': ol.geom.Circle,
            'MultiLineString': ol.geom.MultiLineString
        };

        var new_coords = transform_function(coords);
        var geometryType = geometry_type_map[geometry_type];
        if (geometry_type == 'Polygon' || geometry_type == 'MultiLineString') {
            new_coords = [new_coords]
        }
        var new_geometry = new geometryType(new_coords);
        feature.setGeometry(new_geometry);

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
