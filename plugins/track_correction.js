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