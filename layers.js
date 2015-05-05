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
{	var selectSingleClick = new ol.interaction.Select(
	{		layers: [this.pntsLayer],
		condition: ol.events.condition.click,	});
	selectSingleClick.handleEvent = handleFunction;

	this.map.addInteraction(selectSingleClick);}


