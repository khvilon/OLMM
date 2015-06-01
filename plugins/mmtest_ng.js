OLMM.prototype.mmtestNextGenMainFunction = function(ajax_data) {
    this.addLayer('osm', this.createOSMLayer(this.createOSMLayer()));

    var json_string = JSON.stringify(ajax_data);
    var geojson = JSON.parse(json_string)['tdrs'];

    var features = olmm.readGeoJSON(geojson);

    this.addLayer('main', olmm.createVectorLayer(olmm.styleGraphFunction, features));
    this.addLayer('main2', olmm.createVectorLayer(olmm.styleGraphFunction, features));
    this.addLayer('main3', olmm.createVectorLayer(olmm.styleGraphFunction, features));

    olmm.fitToExtent(olmm.getSourceByName('main'));
};
