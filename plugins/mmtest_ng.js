OLMM.prototype.mmtestNextGenMainFunction = function(ajax_data) {
    this.addLayer('osm', this.createOSMLayer(this.createOSMLayer()));

    var json_string = JSON.stringify(ajax_data);
    var geojson = JSON.parse(json_string);

    var features = olmm.readGeoJSON(geojson);

    var line_layer = olmm.createVectorLayer(olmm.styleGraphFunction);
    this.addLayer('lines', line_layer);

    this.addLayer('main', olmm.createVectorLayer(

        new ol.style.Style({
            image: new ol.style.Circle({
                radius: 4,
                color: 'red'
            })
        })

        , features));

    olmm.transformPointsToLine(features, line_layer.getSource());

    olmm.fitToExtent(olmm.getSourceByName('lines'));
};
