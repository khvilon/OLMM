(function (module) {

    module.toGeoJSON = function (useOriginFeature) {
        var feature;

        if (useOriginFeature == true) {
            feature = this;
        } else {
            feature = this.clone();
        }

        var format = new ol.format.GeoJSON();

        return format.writeFeature(feature);
    };

    module.getMainData = function () {
        var feature = this;
        var geometry = feature.getGeometry();
        return {
            'id': this.getId() || '',
            'coords': geometry.getCoordinates() || '',
            'type': geometry.getType() || '',
            'geojson': feature.toGeoJSON(true)
        }
    };

    module.getMainDataWithCloneAndTransform = function () {
        var feature = this;
        var id = feature.getId();
        feature = feature.clone();
        feature.setId(id);
        return feature.transformWithGeometryToLonLat().getMainData()
    };

    module.transform_from_lot_lan = function () {
        return this._transform('EPSG:4326', 'EPSG:3857');
    };

    module.transform_to_lot_lan = function () {
        return this._transform('EPSG:3857', 'EPSG:4326');
    };

    module._transform = function (from, to) {

        var data = this.getGeometry().getCoordinates();

        if (!data) {
            return;
        }

        // TODO Polygon wtf :( [[[], [], []]]
        if (data.length == 1) {
            data = data[0];
        }

        if (data[0] instanceof Array) {
            var coords = data.map(function (line_coords) {
                return ol.proj.transform(line_coords, from, to)
            });
            return coords;
        }
        else {
            return ol.proj.transform(data, from, to)
        }
    };

    module.transformWithGeometryFromLonLat = function () {
        var self = this;
        return self.transformWithGeometry(self.transform_from_lot_lan)
    };

    module.transformWithGeometryToLonLat = function () {
        var self = this;
        return self.transformWithGeometry(self.transform_to_lot_lan)
    };

    module.transformWithGeometry = function (transform_function) {
        var feature = this;
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

        var new_coords = transform_function.call(feature, coords);
        var geometryType = geometry_type_map[geometry_type];
        if (geometry_type == 'Polygon' || geometry_type == 'MultiLineString') { // TODO Polygon wtf :( [[[], [], []]]
            new_coords = [new_coords]
        }
        var new_geometry = new geometryType(new_coords);
        feature.setGeometry(new_geometry);

        return feature
    };

})(ol.Feature.prototype);


(function (module) {

    module.filterFeaturesByProperties = function (source_name, filter_params) {
        var self = this;

        filter_params = filter_params || undefined;
        if (!filter_params) { return [] }

        return self.getSourceByName(source_name).getFeatures().filter(function(feature){
            var pass_filter = true;
            var feature_properties = feature.getProperties();

            if (!feature_properties) {
                pass_filter = false;
            } else if (filter_params) {
                for (var param in filter_params) {
                    if (pass_filter && (feature_properties[param] != filter_params[param])) {
                        pass_filter = false
                    }
                }
            }

            return pass_filter
        });
    };

    module.updateFeaturesStyle = function (features, style) {
        features.map(function(feature){feature.setStyle(style);feature.changed()});
    };

    module.updateFeaturesStyleWithFilter = function (kwargs) {
        var source_name = kwargs['source_name'];
        var filter_params = kwargs['filter_params'];
        var style_name = kwargs['style_name'];

        var self = this;
        var style = self.getStyleByName(style_name);
        var features = self.filterFeaturesByProperties(source_name, filter_params);

        console.log(style);
        console.log(style_name);
        console.log(self.styles);
        console.log(features);

        self.updateFeaturesStyle(features, style)
    };

    module.updateFeature = function (source_name, geojson) {
        var self = this;
        var featureId = undefined;

        if (geojson.id) {
            featureId = geojson.id
        } else if (geojson.properties && geojson.properties.id) {
            featureId = geojson.properties.id
        }

        if (!featureId) {
            return;
        }

        self.updateFeatureWithGeoJSON(featureId, source_name, geojson)

    };

})(OLMM.prototype);
