OLMM.prototype.createRequiredLayers = function(){
    this.federalHighWayStyle = new ol.style.Style({
        stroke: new ol.style.Stroke({
            color: 'red',
            width: 4
        }),
        fill: new ol.style.Fill({
            color: 'red'
        })
    });
    this.federalHighWaySource = new ol.source.Vector();
    this.federalHighWayLayer = new ol.layer.Vector({
        source: this.federalHighWaySource,
        style: this.federalHighWayStyle });

    this.simpleRoadStyle = new ol.style.Style({
        stroke: new ol.style.Stroke({
            color: 'black',
            width: 4
        }),
        fill: new ol.style.Fill({
            color: 'black'
        })
    });
    this.simpleRoadSource = new ol.source.Vector();
    this.simpleRoadLayer = new ol.layer.Vector({
        source: this.simpleRoadSource,
        style: this.simpleRoadStyle
    });

    this.map.addLayer(this.simpleRoadLayer);
    this.map.addLayer(this.federalHighWayLayer);
};

OLMM.prototype.geoJSONEachfeatureFunction = function(feature, additional_params) {
    var features, coords, geometry_type, format, i, style, feature_properties, j, way_number;

    way_number = additional_params['way_number'];
    feature_properties = feature.getProperties();

    if (feature_properties['color']) {
        style = new ol.style.Style({
            fill: new ol.style.Fill({
                color: feature_properties['color'],
                opacity: 1,
                width: 6
            }),
            stroke: new ol.style.Stroke({
                color: feature_properties['color'],
                opacity: 1,
                width: 6
            })
        });
        feature.setStyle(style);
    }

    if (way_number) {
        feature.setProperties({way_number: way_number})
    }

    return feature;

};

OLMM.prototype.trackCorrectionMainFunction = function(ajax_data) {
    var json_string = JSON.stringify(ajax_data);
    var json = JSON.parse(json_string);

    var line_before_geojson = json['points_before'];
    var line_after_geojson = json['points_after'];
    var ways_geojson = json['ways'][0]['line'];
    var ways2_geojson = json['ways'][1]['line'];

    var points_before_features = olmm.readGeoJSON(line_before_geojson);
    var points_after_features = olmm.readGeoJSON(line_after_geojson);
    var ways_features = olmm.readGeoJSON(ways_geojson, olmm.geoJSONEachfeatureFunction, {way_number: '1'});
    var ways_features2 = olmm.readGeoJSON(ways2_geojson, olmm.geoJSONEachfeatureFunction, {way_number: '2'});

    olmm.createVectorLayer('ways_1', ways_features, olmm.styleGraphFunction);
    olmm.createVectorLayer('ways_2', ways_features2, olmm.styleGraphFunction);

    olmm.fitToExtent(olmm.getSourceByName('ways_1'));

    olmm.initLayersForHoverEvent([olmm.getLayerByName('ways_1'), olmm.getLayerByName('ways_2')]);
    olmm.addSelectOnHoverEvent('.hover');
    olmm.addUnselectOnHoverEvent('.hover');

    olmm.transformPointsToLine(points_before_features, olmm.lineSource);
    olmm.transformPointsToLine(points_after_features, olmm.lineSource);
};