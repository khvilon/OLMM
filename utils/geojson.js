(function (module) {

    module.readGeoJSON = function(geojson, setId) {
        setId = setId || false;
        var transformer = ol.proj.transform;

        return new ol.format.GeoJSON().readFeatures(geojson).map(function (feature) {
            var geometry_type = feature.getGeometry().getType();
            var coords = feature.getGeometry().getCoordinates();
            var featureProperties = feature.getProperties();

            if (geometry_type == 'LineString') {
                coords = coords.map(function (point) { return transformer(point, 'EPSG:4326', 'EPSG:3857'); });
                feature.setGeometry(new ol.geom.LineString(coords));
            } else if (geometry_type == 'Point') {
                coords = transformer(coords, 'EPSG:4326', 'EPSG:3857');
                feature.setGeometry(new ol.geom.Point(coords))
            }

            if (setId) {
                if (featureProperties['id']) { feature.setId(featureProperties['id']) }
            }

            return feature;
        });
    };

})(OLMM.prototype);
