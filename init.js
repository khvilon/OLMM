/*
drop table if exists selected_nodes;
create temp table selected_nodes as
    select id, lat, lon from nodes where cube_union(ll_to_earth(55.723617, 37.554502), ll_to_earth(55.720383, 37.559002)) @> ll_to_earth(lat, lon);

select j1.id, j1.road_id, j1.lat0, j1.lon0, selected_nodes.lat as lat1, selected_nodes.lon as lon1
from (
select arcs.id, arcs.road_id, arcs.n0, arcs.n1, selected_nodes.lat as lat0, selected_nodes.lon as lon0
from arcs join selected_nodes on arcs.n0 = selected_nodes.id
) j1 join selected_nodes on j1.n1 = selected_nodes.id
*/

function OLMM() {}

window.olmm_server_config = {
    'preload': 4,
    'wms_server': '', // http://10.0.2.60/mapcache/demo/wms or http://10.0.2.60/mapcache/demo/wmts
    'tiled': true
};

OLMM.prototype.getMainLayers = function(){
    var config = window.olmm_server_config;
    if (config['wms_server']) {
        return [
            new ol.layer.Tile({
                source: new ol.source.MapQuest({layer: 'sat'})
            }),
            new ol.layer.Image({
                url: config['wms_server'],
                params: {'LAYERS': 'topp:states', 'TILED': config['tiled']},
                serverType: 'geoserver'
            })
        ]
    } else {
        return [new ol.layer.Tile({
            preload: config['preload'] || 4,
            source: new ol.source.OSM
        })]

    }
};

        style_config = {
            src: 'https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcRkHkmEhzOC4IIkv-iEVoS-5PrcsEsS6fEhxKJkHglRGiXaCh6W1qfG8Q',
            size: [32, 32],
            offset: [0, 0],
            opacity: 1.0,
            rotation: 0.0,
            scale: 1.0,
            rotateWithView: true
        };

    var points = [];
    var e = 25000000;

    for (var i = 0; i < 50000; ++i) {
        points.push([2 * e * Math.random() - e, 2 * e * Math.random() - e]);
    }


OLMM.prototype.createMap = function (divName) {
    this.map = new ol.Map({
        target: divName,
        layers: [

            olmm.createIconLayer(points, true, style_config),
            new ol.layer.Tile({
                preload: 4,
                source: new ol.source.OSM
            }),
        ]
        //layers: this.getMainLayers().concat([
        //    this.graphLayer,
        //    this.lastProjLayer,
        //    this.allProjLayer,
        //    this.mmProjLayer,
        //    this.goodProjLayer,
        //    this.pntsLayer
        //])
      });
};

OLMM.prototype.add_graph = function (data) {
    var features = [];
    for (var i = 0; i < data.length; i++) {
        var id = data[i][0];
        var coords_0 = this.transform([parseFloat(data[i][2]), parseFloat(data[i][1])]);
        var coords_1 = this.transform([parseFloat(data[i][4]), parseFloat(data[i][3])]);
        var labelCoords = this.transform([parseFloat(data[i][4]), parseFloat(data[i][3])]);
        var lineString = new ol.geom.LineString([coords_0, coords_1]);
        var feature = new ol.Feature({
            geometry: lineString,
            name: id
        });
        feature.setId(id);
        features.push(feature);

    }
    this.graphSource.addFeatures(features);
};

OLMM.prototype.transform = function (data) {
    return ol.proj.transform(data, 'EPSG:4326', 'EPSG:3857');}

OLMM.prototype.createPntFeature = function(pnt, num) {
    var feature = new ol.Feature({geometry: new ol.geom.Point(pnt.coords),
                                 name: 'Point'});
    feature.rot = pnt.rot;
    feature.setId(num);
    return feature;
}

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
    for(var i = 0; i < data.length; i++) {
        data[i].coords = this.transform([data[i].lon, data[i].lat]);

        features.push(this.createPntFeature(data[i], i));

        if(data[i].good_proj) {
            if (Object.keys(data[i].good_proj).length >= 2) {
                good_projs.push(this.createProjFeature(data[i], data[i].good_proj, i))
            }
        }
        if(data[i].mm_proj) {
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

    //centering map to view all points
    var extent = this.pntsSource.getExtent();
    this.map.getView().fitExtent(extent, this.map.getSize());

    var coords = ol.proj.transformExtent(extent, 'EPSG:3857', 'EPSG:4326');
    var url = "http://10.0.12.228:5000/mapm_tests/get_graph";
    $.ajax({ url: url, data: {min_lon : coords[0] - 0.001,
                              min_lat: coords[1] - 0.001,
                              max_lon: coords[2] + 0.001,
                              max_lat: coords[3] + 0.001},
            success: function( data ) {
                var arcs = JSON.stringify(data);
                arcs = JSON.parse(arcs);
                self.add_graph(arcs);
            },
            dataType: 'json'});
}


OLMM.prototype.show_points = function (last_data) {
    this.lastProjSource.clear()
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
        for (var i = 0; i < last_data.proj.length; i++) {
            var projCoords = this.transform(
                    [last_data.proj[i].lon, last_data.proj[i].lat]);
            var line_feature = new ol.Feature({
                    geometry: new ol.geom.LineString([
                    pointCoords,projCoords])
            });

            if (line_feature) {
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
        var line_feature = new ol.Feature({
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

OLMM.prototype.addLayer = function(layer){
    this.map.addLayer(layer);
};

OLMM.prototype.init = function (divName, selectPntFunction) {
    this.createLayers();
    this.createMap(divName);
    this.addPntSelect(selectPntFunction);
};
