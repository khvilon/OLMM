OLMM.prototype.createLayers = function ()
{
	this.pntsSource = new ol.source.Vector();
    this.pntsLayer = new ol.layer.Vector({
    	source: this.pntsSource,
	  	style: this.stylePntFunction });

	this.projSource = new ol.source.Vector();
    this.projLayer = new ol.layer.Vector({
    	source: this.projSource,
	  style: this.styleProjFunction

	});

}


OLMM.prototype.addPntSelect = function (handleFunction)
{
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
