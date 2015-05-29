OLMM.prototype.add_graph = function (data) {
    var features;

    for (var i = 0; i < data.length; i++) {
        var id = data[i][0];
        var coords_0 = this.transform([parseFloat(data[i][2]), parseFloat(data[i][1])]);
        var coords_1 = this.transform([parseFloat(data[i][4]), parseFloat(data[i][3])]);
        var labelCoords = this.transform([parseFloat(data[i][4]), parseFloat(data[i][3])]);
        var lineString = new ol.geom.LineString([coords_0, coords_1]);
        var feature = new ol.Feature({
            geometry: lineString,
            name: id,
            id: id
        });
        features.push(feature);

    }

    if (features) {
        this.graphSource.addFeatures(features);
    }
};

OLMM.prototype.createPntFeature = function(pnt, num) {
    var feature = new ol.Feature({geometry: new ol.geom.Point(pnt.coords),
                                 name: 'Point'});
    feature.rot = pnt.rot;
    feature.setId(num);
    return feature;
};

OLMM.prototype.createProjFeature = function(pnt, proj, num) {
    var proj_coords = this.transform([proj.lon, proj.lat]);
    var line_feature = new ol.Feature({geometry: new ol.geom.LineString([
                pnt.coords,proj_coords])});
    line_feature.setId(num);
    return line_feature;
};

//adding points and main projections features to map hidden
OLMM.prototype.draw_points = function (data) {
    var self = this;
    var features = [];
    var good_projs = [];
    var mm_projs = [];

    //points and main projections features creation
    for (var i = 0; i < data.length; i++) {
        data[i].coords = this.transform([data[i].lon, data[i].lat]);

        features.push(this.createPntFeature(data[i], i));

        if (data[i].good_proj) {
            if (Object.keys(data[i].good_proj).length >= 2) {
                good_projs.push(this.createProjFeature(data[i], data[i].good_proj, i))
            }
        }
        if (data[i].mm_proj) {
            if (Object.keys(data[i].mm_proj).length >= 2) {
                mm_projs.push(this.createProjFeature(data[i], data[i].mm_proj, i))
            }
        }
    }
    //adding features to map
    this.pntsSource.addFeatures(features);

    if (good_projs.length > 0) {
        this.goodProjSource.addFeatures(good_projs);
    }
    if (mm_projs.length > 0) {
        this.mmProjSource.addFeatures(mm_projs);
    }

    this.transformPointsToLine(features, this.lineSource);
    this.fitToExtent(this.lineSource);
};

OLMM.prototype.setLayerVisible = function (layer_name, visible) {
    var layers = this.map.getLayers().a;

    if (layer_name == 'osm') {
        this.osm_layer.setVisible(visible)
    } else if (layer_name == 'wms') {
        this.wms_layer.setVisible(visible)
    }
};

OLMM.prototype.show_points = function (last_data, current_projection) {
    this.lastProjSource.clear();
    var maxInd = last_data.point_num;
    for(var i = 0; i < this.pntsSource.getFeatures().length; i++) {
        var feature = this.pntsSource.getFeatureById(i);
        feature.visible = i <= maxInd;
        feature.changed();
        var good_proj = this.goodProjSource.getFeatureById(i);
        if(good_proj) {
            good_proj.visible = i <= maxInd;
            good_proj.changed();
        }
        var mm_proj = this.goodProjSource.getFeatureById(i);
        if(mm_proj) {
            mm_proj.visible = i <= maxInd;
            mm_proj.changed();
        }
    }
    var good_arc_proj = this.goodProjSource.getFeatureById(maxInd);
    if(good_arc_proj) {
        good_arc_proj.visible = true;
        good_arc_proj.changed();
    }
    var lastPoint = this.pntsSource.getFeatureById(maxInd);
    var pointCoords = lastPoint.getGeometry().getCoordinates();
    if (last_data.proj) {

        var projections_length = last_data.proj.length;

        for (var i = 0; i < projections_length; i++) {
            var projCoords = this.transform(
                    [last_data.proj[i].lon, last_data.proj[i].lat]);
            var line_feature = new ol.Feature({
                    geometry: new ol.geom.LineString([
                    pointCoords,projCoords])
            });

            if (projections_length > 1 && current_projection == i) {
                line_feature.setStyle(
                    new ol.style.Style({
                        stroke: new ol.style.Stroke({
                            color: [150, 0, 255, 1],
                            width: 6
                        })
                    })
                );
                line_feature.setId(maxInd.toString() + '_' + last_data.proj[i].arc_id);
                this.lastProjSource.addFeature(line_feature);
                line_feature.visible = true;
                line_feature.changed();
            }
        }
    }
};

OLMM.prototype.show_point_info = function (data) {
    var pointId = data.point_num;
    var point = this.pntsSource.getFeatureById(pointId);
    point.visible = true;
    point.changed();
    var pointCoords = point.getGeometry().getCoordinates();
    var projs = data.proj;
    for (var i = 0; i < projs.length; i++) {
        var projCoords = this.transform(
                [projs[i].lon, projs[i].lat]);
        var line_feature = new ol.Feature
        ({
                geometry: new ol.geom.LineString([
                pointCoords,projCoords])
        });

        line_feature.setId(pointId.toString() + '_' + projs[i].arc_id);
        this.allProjSource.addFeature(line_feature);
        if (line_feature) {
            line_feature.visible = true;
            line_feature.changed();
        }
    }
};

OLMM.prototype.delete_projs = function () {
    this.allProjSource.clear();
};

OLMM.prototype.set_good_arc = function (data) {
    var pointId = data.point_num;
    var proj = data.proj;
    var point = this.pntsSource.getFeatureById(pointId);
    var pointCoords = point.getGeometry().getCoordinates();
    var projCoords = this.transform([proj.lon, proj.lat]);
    var new_feature = new ol.Feature({
            geometry: new ol.geom.LineString([
            pointCoords, projCoords])
    });
    new_feature.visible = true;
    new_feature.changed();
    new_feature.setId(pointId);
    var old_feature = this.goodProjSource.getFeatureById(pointId);
    if (old_feature) {
        this.goodProjSource.removeFeature(old_feature);
    }
    this.goodProjSource.addFeature(new_feature);
};

OLMM.prototype.styleTDRPoint = function(feature, resolution) {
    return new ol.style.Style({
        image: new ol.style.Icon({
            src: 'pnt.png'
        })
    });
};

OLMM.prototype.draw_tdr_points = function(json_data) {
    var points_features = olmm.points_features_from_coords(json_data);

    var points_layer = olmm.createVectorLayer('points', points_features, olmm.styleTDRPoint);

    olmm.fitToExtent(olmm.getSourceByName('points'))
};

OLMM.prototype.draw_tdr_lines = function(json_data) {
    olmm.getSourceByName('lines').clear();

    var points_features_to_line = olmm.points_features_from_coords(json_data);

    var line_feature = olmm.transformPointsToLine(points_features_to_line);

    var line_layer = olmm.createVectorLayer('lines', [line_feature], olmm.styleGraphFunction);

    olmm.fitToExtent(olmm.getSourceByName('lines'))
};