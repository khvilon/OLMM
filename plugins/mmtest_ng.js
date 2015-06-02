OLMM.prototype.mmtestNextGenMainFunction = function(ajax_data) {
    this.addLayer('osm', this.createOSMLayer(this.createOSMLayer()));

    var json_string = JSON.stringify(ajax_data);
    var geojson = JSON.parse(json_string);

    var features = this.readGeoJSON(geojson);

    var line_layer = this.createVectorLayer(this.styleGraphFunction);
    this.addLayer('lines', line_layer);

    this.addLayer('main', this.createVectorLayer(

        new ol.style.Style({
            image: new ol.style.Circle({
                radius: 4,
                color: 'red'
            })
        })

        , features));

    this.transformPointsToLine(features, line_layer.getSource());

    this.fitToExtent(this.getSourceByName('lines'));
};
