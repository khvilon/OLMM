(function (g) {
    g.OLMM.prototype.readGeoJSON = function(geojson, additionalParams) {
        additionParams = additionalParams || false;

        var transformer = ol.proj.transform;
        return rewrite_features = (new ol.format.GeoJSON()).readFeatures(geojson).map(function (feature) {
            var geometry_type = feature.getGeometry().getType();
            var coords = feature.getGeometry().getCoordinates();
            var featureProperties = feature.getProperties();

            if (geometry_type == 'LineString') {
                feature.setGeometry(new ol.geom.LineString(coords));
                coords = coords.map(function (point) { return transformer(point, 'EPSG:4326', 'EPSG:3857'); });
            } else if (geometry_type == 'Point') {
                coords = transformer(coords, 'EPSG:4326', 'EPSG:3857');
                feature.setGeometry(new ol.geom.Point(coords))
            }

            if (additionalParams) {
                if (featureProperties['id']) { feature.setId(featureProperties['id']) }
                if (featureProperties['projections']) {
                    feature.setProperties({'projections': featureProperties['projections']});
                }
            }

            return feature;
        });
    };
})(this);