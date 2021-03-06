(function (module) {

    module.polygonName = 'Polygon';
    module.lineStringName = 'LineString';
    module.multiLineStringName = 'MultiLineString';
    module.pointName = 'Point';
    module.MultiPoint = 'MultiPoint';

    module.geometryTypeMap = {};
    module.geometryTypeMap[module.lineStringName] = ol.geom.LineString;
    module.geometryTypeMap[module.pointName] = ol.geom.Point;
    module.geometryTypeMap[module.polygonName] = ol.geom.Polygon;
    module.geometryTypeMap[module.multiLineStringName] = ol.geom.MultiLineString;
    module.geometryTypeMap[module.MultiPoint] = ol.geom.MultiPoint;

    module._olmm_props = {};

    module.setOwnProp = function (name, value) {
        this._olmm_props[name] = value
    };

    module.getOwnProp = function (name) {
        return this._olmm_props[name]
    };

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
            'id': feature.getId() || '',
            'coords': geometry.getCoordinates() || '',
            'type': geometry.getType() || '',
            'geojson': feature.toGeoJSON(true),
            'properties': feature.getProperties()
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

        var new_coords = transform_function.call(feature, coords);
        var geometryType = feature.geometryTypeMap[geometry_type];
        if (geometry_type == feature.polygonName || geometry_type == feature.multiLineStringName) {
            new_coords = [new_coords]
        }
        var new_geometry = new geometryType(new_coords);
        feature.setGeometry(new_geometry);

        return feature
    };

    module.setProperty = function (name, value) {
        var feature = this;
        var newProp = {};
        newProp[name] = value;
        feature.setProperties(newProp);
    };

    module.getProperty = function (name) {
        var feature = this;
        return feature.getProperties()[name];
    };

    module.getPropertyList = function (name) {
        var feature = this;
        var property = feature.getProperty(name) || '';
        return property.split(' ')
    };

    module.moveToLonLat = function (lon, lat) {
        var feature = this;
        feature.getGeometry().setCoordinates([parseFloat(lon), parseFloat(lat)]);
        feature.transformWithGeometryFromLonLat();
        return feature
    };

    module.removeProperty = function (name) {
        var feature = this;
        var property = feature.getProperty(name);
        var propertyList = feature.getPropertyList(name);

        if (!property) {
            return;
        }

        if (propertyList.length > 1) {
            propertyList.splice(propertyList.indexOf(name), 1);
            feature.setProperty(name, propertyList.join(' '))
        }  else {
            feature.setProperty(name, '');
        }
    };

    module.updateProperty = function (name, value) {
        var feature = this;
        var featureProperty = feature.getProperty(name);
        if (featureProperty) {
            value = featureProperty + ' ' + value;
        }
        feature.setProperty(name, value.trim());
    };

    module.setRandomId = function () {
        var feature = this;
        var s = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        var n = 32;
        var id = Array.apply(null, Array(n)).map(function () {
            return s.charAt(Math.floor(Math.random() * s.length));
        }).join('');

        feature.setId(id);
        return id
    };

    module.isPoint = function () {
        return this.getGeometry().getType() == this.pointName;
    };

    module.isLineString = function () {
        return this.getGeometry().getType() == this.lineStringName;
    };

    module.isMultiLineString = function () {
        return this.getGeometry().getType() == this.multiLineStringName;
    };

    module.isPolygon = function () {
        return this.getGeometry().getType() == this.polygonName;
    };

    module.isLine = function () {
        return this.isLineString() || this.isMultiLineString();
    };

    module.makeHidden = function () {
        this.setOwnProp('visible', false);
    };

    module.makeHiddenByFilter = function () {
        this.setOwnProp('filterVisible', false);
    };

    module.isVisible = function () {
        return this.getOwnProp('visible') || this.getOwnProp('filterVisible');
    };

    module.isHidden = function () {
        return !this.isVisible();
    };

})(ol.Feature.prototype);


(function (module) {

    module.getFeaturesVisibleByType = function (sourceName, type) {
        var self = this;
        var features = self.getSourceByName(sourceName).getFeatures();
        var visible;

        if (type == self.pointName || type == self.polygonName) {
            var cached_visible = self[type.toLowerCase()+'Show'];
            if (cached_visible != undefined) {
                return cached_visible
            }
        }

        for (var i = 0; i <= features.length; i++) {
            var feature = features[i];
            if (feature && feature.getGeometry().getType() == type) {
                visible = feature.getProperties()['visible'];
                if (visible) {
                    break
                }
            }
        }

        if (visible == undefined) {
            visible = false;
        }

        return visible;
    };

    module.filterFeaturesByType = function (sourceName, type) {
        var self = this;
        return self.getSourceByName(sourceName).getFeatures().filter(function(feature){
            return feature.getGeometry().getType() == type
        })
    };

    module.toggleFeaturesByType = function (type) {
        var self = this;

        var new_visible = !self.getFeaturesVisibleByType(type);
        self[type.toLowerCase()+'Show'] = new_visible; // TODO gis hack :(

        self.filterFeaturesByType(type).forEach(function(feature){
            feature.setProperties({'visible': new_visible})
        })

    };

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

    module.updateFeaturesStyleWithFilter = function (options) {
        var source_name = options['source_name'];
        var filter_params = options['filter_params'];
        var style_name = options['style_name'];

        var self = this;
        var style = self.getStyleByName(style_name);
        var features = self.filterFeaturesByProperties(source_name, filter_params);

        self.updateFeaturesStyle(features, style)
    };

    module.updateFeatureProperties = function (options) {
        var self = this;

        var source_name = options['source_name'] || self.getDefaultSourceName();
        var filter_params = options['filter_params'];
        var update_params = options['update_params'];

        var features = self.filterFeaturesByProperties(source_name, filter_params);

        features.map(function(f){f.setProperties(update_params)});
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

    module.deleteFeatureById = function (feature_id, source_name) {
        var self = this;
        var source = self.getSourceByName(source_name || self.getDefaultSourceName());
        var feature = source.getFeatureById(feature_id);
        source.removeFeature(feature);
    };


    module.getPointFeaturesInExtent = function (extent, sourceName) {
        var self = this;
        var source = self.getSourceByName(sourceName);

        var features = source.getFeaturesInExtent(extent);

        return features.filter(function (feature) {
            return feature.getGeometry().getType() == self.pointName
        });
    };

})(OLMM.prototype);
