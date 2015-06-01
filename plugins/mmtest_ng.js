OLMM.prototype.mmtestNextGenMainFunction = function(ajax_data) {
    var json_string = JSON.stringify(ajax_data);
    var geojson = JSON.parse(json_string)['tdrs'];

    var features = olmm.readGeoJSON(geojson);

    this.addLayer('main', olmm.createVectorLayer(olmm.styleGraphFunction, features));

    olmm.fitToExtent(olmm.getSourceByName('main'));
};
