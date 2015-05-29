OLMM.prototype.mmtestNextGenMainFunction = function(ajax_data) {
    var json_string = JSON.stringify(ajax_data);
    var geojson = JSON.parse(json_string);

    var features = olmm.readGeoJSON(geojson);

    olmm.createVectorLayer('lines', features, olmm.styleGraphFunction);

    olmm.fitToExtent(olmm.getSourceByName('lines'));
};
