OLMM.prototype.createLayers = function () {
    this.graphSource = new ol.source.Vector();
    this.graphLayer = new ol.layer.Vector({
        source: this.graphSource,
        style: this.styleGraphFunction });

	this.pntsSource = new ol.source.Vector();
    this.pntsLayer = new ol.layer.Vector({
    	source: this.pntsSource,
	  	style: this.stylePntFunction });

	this.mmProjSource = new ol.source.Vector();
    this.mmProjLayer = new ol.layer.Vector({
    	source: this.mmProjSource,
	    style: this.styleMmProjFunction });

	this.goodProjSource = new ol.source.Vector();
    this.goodProjLayer = new ol.layer.Vector({
    	source: this.goodProjSource,
	    style: this.styleGoodProjFunction });

	this.lastProjSource = new ol.source.Vector();
    this.lastProjLayer = new ol.layer.Vector({
        source: this.lastProjSource,
        style: this.styleLastProjFunction });

	this.allProjSource = new ol.source.Vector();
    this.allProjLayer = new ol.layer.Vector({
        source: this.allProjSource,
        style: this.styleLastProjFunction });
}


OLMM.prototype.addPntSelect = function (handleFunction) {
    this.map.on('singleclick', function(evt){
        var feature = this.forEachFeatureAtPixel(evt.pixel,
            function(feature, layer) {
                return feature;
            });
        if (feature && feature.get('name') == 'Point') {
            var id = feature.getId()
            console.log(feature.get('name'), id)
            handleFunction(id)
        }
    });
}
