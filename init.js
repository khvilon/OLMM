function OLMM() {}

OLMM.prototype.createMap = function (divName) {
    this.map = new ol.Map({
        target: divName,
        layers: [
           new ol.layer.Tile({
              preload: 4,
              source: new ol.source.OSM()
            }),
                this.lastProjLayer,
                this.pointsProjLayer,
                this.projLayer,
                this.pntsLayer,
        ],
      });
}

OLMM.prototype.transform = function (data) {
    return ol.proj.transform(data, 'EPSG:4326', 'EPSG:3857');}

OLMM.prototype.createPntFeature = function(pnt, num) {
    var feature = new ol.Feature({geometry: new ol.geom.Point(pnt.coords),
                                 name: 'Point'});
    feature.rot = pnt.rot;
    feature.setId(num);
    return feature;
}

OLMM.prototype.createProjFeature = function(pnt, num) {
    var proj_coords = this.transform([pnt.proj.lon, pnt.proj.lat]);
    var line_feature = new ol.Feature({geometry: new ol.geom.LineString([
                pnt.coords,proj_coords])});
    line_feature.setId(num);
    return line_feature;
}

//adding points and main projections features to map hidden
OLMM.prototype.draw_points = function (data) {
    var features = [];
    var line_features = [];

    //points and main projections features creation
    for(var i = 0; i < data.length; i++) {
        data[i].coords = this.transform([data[i].lon, data[i].lat]);

        features.push(this.createPntFeature(data[i], i));

        if(data[i].proj) {
            if (Object.keys(data[i].proj).length == 2) {
                line_features.push(this.createProjFeature(data[i], i))
            }
        }
    }
    //adding features to map
    this.pntsSource.addFeatures(features);
    if (line_features.length > 0) {
        this.projSource.addFeatures(line_features);
    }

    //centering map to view all points
    var extent = this.pntsSource.getExtent();
    this.map.getView().fitExtent(extent, this.map.getSize());
}


OLMM.prototype.show_points = function (last_data) {
    this.lastProjSource.clear()
    var maxInd = last_data.point_num;
    for(var i = 0; i < this.pntsSource.getFeatures().length; i++) {
        var feature = this.pntsSource.getFeatureById(i);
        feature.visible = i < maxInd;
        feature.changed();
        var line_feature = this.projSource.getFeatureById(i);
        if(line_feature) {
            line_feature.visible = i < maxInd;
            line_feature.changed();
        }
    }
    var good_arc_proj = this.projSource.getFeatureById(maxInd);
    if(good_arc_proj) {
        good_arc_proj.visible = true;
        good_arc_proj.changed();
    }
    var lastPoint = this.pntsSource.getFeatureById(maxInd);
    lastPoint.visible = true;
    lastPoint.changed();
    var pointCoords = lastPoint.getGeometry().getCoordinates();
    if (last_data.proj) {
        for (var i = 0; i < last_data.proj.length; i++) {
            var projCoords = this.transform(
                    [last_data.proj[i].lon, last_data.proj[i].lat]);
            var line_feature = new ol.Feature({
                    geometry: new ol.geom.LineString([
                    pointCoords,projCoords])
            });

            line_feature.setId(maxInd.toString() + '_' + last_data.proj[i].arc_id);
            this.lastProjSource.addFeature(line_feature);
            if (line_feature) {
                line_feature.visible = true;
                line_feature.changed();
            }
        }
    }
}


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
        this.pointsProjSource.addFeature(line_feature);
        if (line_feature) {
            line_feature.visible = true;
            line_feature.changed();
        }
    }
}


OLMM.prototype.delete_projs = function () {
    this.pointsProjSource.clear();
}


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
    new_feature.changed()
    new_feature.setId(pointId);
    var old_feature = this.projSource.getFeatureById(pointId);
    if (old_feature) {
        this.projSource.removeFeature(old_feature);
    }
    this.projSource.addFeature(new_feature);
}


OLMM.prototype.init = function (divName, selectPntFunction) {
    this.createLayers();
    this.createMap(divName);
    this.addPntSelect(selectPntFunction);
}
