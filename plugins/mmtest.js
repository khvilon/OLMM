OLMM.prototype.wms_server = {
    'preload': 3,
    //'host':'http://10.0.2.60/mapcache/', // http://10.0.2.60/mapcache/demo/wms or http://10.0.2.60/mapcache/demo/wmts
    'tiled': true,
    'layers': 'roads'
};

OLMM.prototype.createMMTestLayers = function() {
    this.addLayer('osm', this.createOSMLayer(this.createOSMLayer()));
    this.addLayer('roads', this.createWMSLayer(this.wms_server['host'], this.wms_server['layers']));
    this.addLayer('tdr_lines', this.createVectorLayer(this.styleTDRLine));
    this.addLayer('tdr_points', this.createVectorLayer(this.styleTDRPoints));
    this.addLayer('tdr_geometry', this.createVectorLayer(this.styleTDRGeometry));

    this.addLayer('points', this.createVectorLayer(this.stylePntFunction));
    this.addLayer('lines', this.createVectorLayer(this.styleLineFunction));
    this.addLayer('graph', this.createVectorLayer(this.styleGraphFunction));

    this.addLayer('mm_proj', this.createVectorLayer(this.styleMmProjFunction));
    this.addLayer('good_proj', this.createVectorLayer(this.styleGoodProjFunction));
    this.addLayer('last_proj', this.createVectorLayer(this.styleLastProjFunction));
    this.addLayer('all_proj', this.createVectorLayer(this.styleLastProjFunction));

    this.addLayer('current_point_projections', this.createVectorLayer(this.styleGraphFunction));
};

OLMM.prototype.createPntFeature = function(pnt, num) {
    var feature = new ol.Feature({
        geometry: new ol.geom.Point(pnt.coords),
        name: 'Point'
    });
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
    var projections, projection, projection_coords, point, point_coords, projection_feature, point_good_arc;

    var features = [];
    var projections_to_add = [];

    var point_source = this.getSourceByName('points');
    var all_proj_source = this.getSourceByName('all_proj');
    var good_proj_source = this.getSourceByName('good_proj');
    var mm_proj_source = this.getSourceByName('mm_proj');

    //points and main projections features creation
    for (var i = 0; i < data.length; i++) {
        var point_data = data[i];

        point_coords = this.transform([point_data.point_data.location.lon, point_data.point_data.location.lat]);
        projections = point_data.projections;

        point_data.coords = point_coords;

        point = this.createPntFeature(data[i], i);

        point.setProperties({
            "mm_arc": point_data.mm_arc,
            "good_arc": point_data.good_arc,
            "visible": false,
            "state": ''
        });

        point_good_arc = point_data.good_arc;
        features.push(point);

        if (projections) {
            point.setProperties({"projections": projections});
            for (var j = 0; j < projections.length; j++) {
                projection = projections[j];
                projection_coords = this.transform([projection.lon, projection.lat]);
                projection_feature = new ol.Feature({
                    geometry: new ol.geom.LineString([point_coords, projection_coords])
                });
                projection_feature.setId(i);
                projection_feature.state = 'good';
                projections_to_add.push(projection_feature)
            }
        }
    }
    //adding features to map
    point_source.addFeatures(features);

    all_proj_source.addFeatures(projections_to_add);

    this.fitToExtent(point_source);
};
 

OLMM.prototype.show_points = function (last_data, current_projection) {
    var point_source = this.getSourceByName('points');
    var good_proj_source = this.getSourceByName('good_proj');
    var mm_proj_source = this.getSourceByName('mm_proj');
    var last_proj_source = this.getSourceByName('last_proj');
    var all_proj_source = this.getSourceByName('all_proj');

    last_proj_source.clear();

    var maxInd = last_data.point_num;
    for(var i = 0; i < point_source.getFeatures().length; i++) {
        var feature = point_source.getFeatureById(i);
        feature.visible = i <= maxInd;
        feature.changed();
        var good_proj = good_proj_source.getFeatureById(i);
        if(good_proj) {
            good_proj.visible = i <= maxInd;
            good_proj.changed();
        }
        var mm_proj = mm_proj_source.getFeatureById(i);
        if(mm_proj) {
            mm_proj.visible = i <= maxInd;
            mm_proj.changed();
        }
    }
    var lastPoint = point_source.getFeatureById(maxInd);
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
            last_proj_source.addFeature(line_feature);
            line_feature.visible = true;
            line_feature.changed();
            }
        }
    }
};

OLMM.prototype.show_point_info = function (pointId) {

    var point_feature, point_coords, i;
    var point_source = this.getSourceByName('points');
    var all_proj_source = this.getSourceByName('all_proj');
    var point_features = point_source.getFeatures();

    all_proj_source.clear();

    for (i = 0; i < point_features.length; i++) {
        point_feature = point_features[i];
        point_feature.visible = false;
        point_feature.changed();
    }

    for (i = 0; i <= pointId; i++) {
        point_feature = point_source.getFeatureById(i);
        point_coords = point_feature.getGeometry().getCoordinates();
        point_feature.visible = true;
        point_feature.changed();
    }

    point_feature = point_source.getFeatureById(pointId);

    var point_projections = point_feature.getProperties().projections || [];

    for (var j = 0; j < point_projections.length; j++) {
        var point_projection = point_projections[j];

        var projection_coords = this.transform([point_projection.lon, point_projection.lat]);
        var projection_feature = new ol.Feature({
            geometry: new ol.geom.LineString([point_coords, projection_coords])
        });
        projection_feature.setId(pointId.toString() + '_' + point_projection.arc_id);

        all_proj_source.addFeature(projection_feature);
    }
};

OLMM.prototype.delete_projs = function () {
    var all_proj_source = this.getSourceByName('all_proj');
    all_proj_source.clear();
};

OLMM.prototype.set_good_arc = function (data) {
    var point_source = this.getSourceByName('points');
    var good_proj_source = this.getSourceByName('good_proj');
    var mm_proj_source = this.getSourceByName('mm_proj');
    var last_proj_source = this.getSourceByName('last_proj');
    var all_proj_source = this.getSourceByName('all_proj');

    var pointId = data.point_num;
    var proj = data.proj;
    var point = point_source.getFeatureById(pointId);
    var pointCoords = point.getGeometry().getCoordinates();
    var projCoords = this.transform([proj.lon, proj.lat]);
    var new_feature = new ol.Feature({
            geometry: new ol.geom.LineString([
            pointCoords, projCoords])
    });
    new_feature.visible = true;
    new_feature.changed();
    new_feature.setId(pointId);
    var old_feature = good_proj_source.getFeatureById(pointId);
    if (old_feature) {
        good_proj_source.removeFeature(old_feature);
    }
    good_proj_source.addFeature(new_feature);
};

OLMM.prototype.draw_tdr_lines = function(json_data, layer_name)
{
    if (!json_data) return;

    var tdrLineFeatures = this.readGeoJSON(json_data);

    this.getSourceByName(layer_name).addFeatures(tdrLineFeatures);
};

OLMM.prototype.draw_tdr_geometry = function(json_data, layer_name)
{
    if (!json_data) return;

    var source = this.getSourceByName(layer_name);

    if (source) source.clear();
    
    var tdrGeometryFeatures = this.readGeoJSON(json_data);

    source.addFeatures(tdrGeometryFeatures);

    //this.fitToExtent(source);
};

OLMM.prototype.draw_tdr_points = function(coords, layer_name)
{
    if (!coords) return;

 /*   var features = [];
    for(var i = 0; i < coords.length; i++)
    {
        for(var j = 0; j < coords.length; j++)
        {
            features.push(new ol.Feature({geometry: new ol.geom.Point(this.transform(coords[i][j])), name: 'pnt'}));
        }
    }

    this.getSourceByName(layer_name).addFeatures(features);*/

};


OLMM.prototype.styleTDRPoints = function(feature, resolution)
{
    var color = 'red';
    return [
        new ol.style.Style({
          image: new ol.style.Circle({
            radius: 15,
            fill: new ol.style.Fill({color: color}),
            stroke: new ol.style.Stroke({color: color, width: 15})
          })
        })
    ]
};

OLMM.prototype.styleTDRLine = function(feature, resolution)
{
    var width, opacity, color;

    width = 6;
    opacity = 1;
    color = 'blue';
    if(feature.getProperties().is_federal) color = 'red';

    return [
        new ol.style.Style({
            stroke: new ol.style.Stroke({
                color: color,
                width: width
            }),
            fill: new ol.style.Fill({
                color: color
            })
        })
    ];
};

OLMM.prototype.styleTDRGeometry = function(feature, resolution) {

    var width, opacity, color;

    width = 14;
    opacity = 0.4;
    color = [255, 255,0, 0.6];

    return [
        new ol.style.Style({
            stroke: new ol.style.Stroke({
                color: color,
                width: width
            }),
            fill: new ol.style.Fill({
                color: color
            })
        })
    ];
};
