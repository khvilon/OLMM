OLMM.prototype.gisMainFunction = function(ajax_data) {
    var json_string = JSON.stringify(ajax_data);
    var geojson = JSON.parse(json_string);

    var features = this.readGeoJSON(geojson);

    this.addLayer('main', this.createVectorLayer(this.styleLineFunction, features));

    this.fitToExtent(this.getSourceByName('main'));
};

OLMM.prototype.styleGisLine = function(feature, resolution) {
    var width, opacity, color;

    width = 7;
    opacity = 0.3;
    color = 'red';

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
