function OLMM() {}


OLMM.prototype.createMap = function (divName)
{	this.map = new ol.Map({
        target: divName,
        layers: [
           new ol.layer.Tile({
		      preload: 4,
		      source: new ol.source.OSM()
		    }), this.pntsLayer, this.projLayer
        ],
      });}

OLMM.prototype.transform = function (data)
{	return ol.proj.transform(data, 'EPSG:4326', 'EPSG:3857');}

OLMM.prototype.createPntFeature = function(pnt, num)
{
	var feature = new ol.Feature({geometry: new ol.geom.Point(pnt.coords)});
	feature.rot = pnt.rot;
    feature.setId(num);
    return feature;}

OLMM.prototype.createProjFeature = function(pnt, num)
{	var proj_coords = this.transform([pnt.proj.lon, pnt.proj.lat]);
    var line_feature = new ol.Feature({geometry: new ol.geom.LineString([pnt.coords,proj_coords])});
    line_feature.setId(num);
    return line_feature;}

//adding points and main projections features to map hidden
OLMM.prototype.draw_points = function (data)
{
	var features = [];
	var line_features = [];

	//points and main projections features creation	for(var i = 0; i < data.length; i++)
	{		data[i].coords = this.transform([data[i].lon, data[i].lat]);

		features.push(this.createPntFeature(data[i], i));

		if(data[i].proj) line_features.push(this.createProjFeature(data[i], i))	}
	//adding features to map
	this.pntsSource.addFeatures(features);
	this.projSource.addFeatures(line_features);

	//centering map to view all points
	var extent = this.projSource.getExtent();
	this.map.getView().fitExtent(extent, this.map.getSize());}


OLMM.prototype.show_points = function (last_num)
{
	var features = [];
	for(var i = 0; i < this.pntsSource.getFeatures().length; i++)
	{		var feature =  this.pntsSource.getFeatureById(i);
		feature.visible = i <= last_num;
		feature.changed();
		var line_feature = this.projSource.getFeatureById(i);
		if(line_feature)
		{			line_feature.visible = i <= last_num;
			line_feature.changed();
		}
	}
}


OLMM.prototype.init = function (divName, selectPntFunction)
{
	this.createLayers();

	this.createMap(divName);

	this.addPntSelect(selectPntFunction);
}