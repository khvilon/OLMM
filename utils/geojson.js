(function (module) {

    module.readGeoJSON = function(geojson, setId) {
        setId = setId || false;
        var transformer = ol.proj.transform;

        return new ol.format.GeoJSON().readFeatures(geojson).map(function (feature) {
            var geometry_type = feature.getGeometry().getType();
            var coords = feature.getGeometry().getCoordinates();
            var featureProperties = feature.getProperties();
            feature = module.transformWithGeometryFromLonLat(feature);

            if (setId) {
                if (featureProperties['id']) { feature.setId(featureProperties['id']) }
            }

            return feature;
        });
    };

})(OLMM.prototype);
