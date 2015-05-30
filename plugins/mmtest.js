OLMM.prototype.wms_server = 
{
    'preload': 3,
    'host':'http://10.0.2.60/mapcache/', // http://10.0.2.60/mapcache/demo/wms or http://10.0.2.60/mapcache/demo/wmts
    'tiled': true,
    'layers': 'roads'
}

OLMM.prototype.createMMTestLayers = function()
{
    this.addLayer('osm', this.createOSMLayer(this.createOSMLayer()));
    this.addLayer('roads', this.createWMSLayer(this.wms_server['host'], this.wms_server['layers']));
    this.addLayer('tdr_lines', this.createVectorLayer(this.styleTDRLine));
    this.addLayer('tdr_points', this.createVectorLayer(this.styleTDRPoints));
    this.addLayer('tdr_geometry', this.createVectorLayer(this.styleTDRGeometry));   
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

 //   this.transformPointsToLine(features, this.lineSource);  
    this.fitToExtent(this.pntsSource);
};
 


OLMM.prototype.show_points = function (last_data, current_projection)
{
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
    return
    [
        new ol.style.Style({
          image: new ol.style.Circle({
            radius: 15,
            fill: new ol.style.Fill({color: 'red'}),
            stroke: new ol.style.Stroke({color: 'red', width: 15})
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
                width: width,
            }),
            fill: new ol.style.Fill({
                color: color,
            })
        })
    ];
};



/*
OLMM.prototype.add_graph = function (data)
{
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
};*/