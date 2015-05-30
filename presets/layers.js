OLMM.prototype.createLayers = function () {
    this.pointsSelectSource = new ol.source.Vector();
    this.pointsSelectLayer = new ol.layer.Vector({
        source: this.pointsSelectSource,
        style: this.stylePointSelectFunction
    }); // TODO REMOVE
    this.addLayer('this.pointsSelectLayer', this.pointsSelectLayer);

    this.lineSource = new ol.source.Vector();
    this.lineLayer = new ol.layer.Vector({
        source: this.lineSource,
        style: this.styleLineFunction });
    this.addLayer('this.lineLayer', this.lineLayer);

    this.graphSource = new ol.source.Vector();
    this.graphLayer = new ol.layer.Vector({
        source: this.graphSource,
        style: this.styleGraphFunction });
    this.addLayer('this.graphLayer', this.graphLayer);

    this.graphSource2 = new ol.source.Vector();
    this.graphLayer2 = new ol.layer.Vector({
        source: this.graphSource2,
        style: this.styleGraphFunction });
    this.addLayer('this.graphLayer2', this.graphLayer2);

	this.pntsSource = new ol.source.Vector();
    this.pntsLayer = new ol.layer.Vector({
    	source: this.pntsSource,
	  	style: this.stylePntFunction });
    this.addLayer('this.pntsLayer', this.pntsLayer);

    this.geoJSONSource = new ol.source.GeoJSON();
    this.geoJSONLayer = new ol.layer.Vector({
        source: this.geoJSONSource,
        style: this.stylePntFunction
    });
    this.addLayer('this.geoJSONLayer', this.geoJSONLayer);

	this.mmProjSource = new ol.source.Vector();
    this.mmProjLayer = new ol.layer.Vector({
    	source: this.mmProjSource,
	    style: this.styleMmProjFunction });
    this.addLayer('this.mmProjLayer', this.mmProjLayer);

	this.goodProjSource = new ol.source.Vector();
    this.goodProjLayer = new ol.layer.Vector({
    	source: this.goodProjSource,
	    style: this.styleGoodProjFunction });
    this.addLayer('pthis.goodProjLayer', this.goodProjLayer);

	this.lastProjSource = new ol.source.Vector();
    this.lastProjLayer = new ol.layer.Vector({
        source: this.lastProjSource,
        style: this.styleLastProjFunction });
    this.addLayer('this.lastProjLayer', this.lastProjLayer);

	this.allProjSource = new ol.source.Vector();
    this.allProjLayer = new ol.layer.Vector({
        source: this.allProjSource,
        style: this.styleLastProjFunction });
    this.addLayer('this.allProjLayer', this.allProjLayer);
};

OLMM.prototype.createCustomLineStyle = function(line_color, line_width){
    return new ol.style.Style({
        stroke: new ol.style.Stroke({
            color: line_color,
            width: line_width
        })
    })
};


styleCache = {};

OLMM.prototype.createVectorClusterLayer = function (source, style) {
    return new ol.layer.Vector({
        source: source,
        style: style
    //    style: function (feature, resolution) {
    //    var styleCache = {};
    //    var size = feature.get('features').length;
    //    var style = styleCache[size];
    //    if (!style) {
    //        style = [new ol.style.Style({
    //            //image: new ol.style.Circle({
    //            //    radius: 10,
    //            //    stroke: new ol.style.Stroke({
    //            //        color: '#fff'
    //            //    }),
    //            //    fill: new ol.style.Fill({
    //            //        color: '#3399CC'
    //            //    })
    //            //}),
    //            image: new ol.style.Icon({
    //                src: 'http://icons.iconarchive.com/icons/artua/mac/16/Setting-icon.png',
    //                size: [16, 16],
    //                offset: [0, 0],
    //                opacity: 1.0,
    //                rotation: 0.0,
    //                scale: 1.0,
    //                rotateWithView: true
    //            }),
    //            text: new ol.style.Text({
    //                text: size.toString(),
    //                fill: new ol.style.Fill({
    //                    color: '#fff'
    //                })
    //            })
    //        })];
    //        styleCache[size] = style;
    //    }
    //    return style;
    //}
    })
};

OLMM.prototype.addPntSelect = function (handleFeatureFunction, handleMapClickFunction) {
    this.map.on('singleclick', function(evt){
        var feature = this.forEachFeatureAtPixel(evt.pixel,
            function(feature, layer) {
                return feature;
            });
        if (feature && feature.get('name') == 'Point') {
            console.log(feature.getGeometry().getCoordinates());
            var id = feature.getId();
            console.log(feature.get('name'), id);
            handleFeatureFunction(id);
        } else {
            handleMapClickFunction(id)
        }
    });
};

OLMM.prototype.createIconLayer = function(coords, need_cluster, layer_style)
{
    var point, feature, icon_style, i, source;
    var features = [];

    for (i = 0; i < coords.length; ++i) {
        point = new ol.geom.Point(coords[i]);

        feature = new ol.Feature(point);

        features.push(feature);
    }

    source = new ol.source.Vector({features: features});

    if (need_cluster == true) {
        source = this.createClusterSource(source);
    }

    source.addFeatures(features);

    var layer = this.createVectorClusterLayer(source, layer_style);

    return layer;
};


OLMM.prototype.createOSMLayer = function()
{
    var osm_layer = new ol.layer.Tile(
    {
        preload: 3,
        source: new ol.source.OSM()
    });
    osm_layer.setProperties({layer_type: 'osm_layer'});
    return osm_layer;
}


OLMM.prototype.createWMSLayer= function(server, layers)
{
    var source = new ol.source.TileWMS(
    {
        url: server,
        params: {'LAYERS': layers, 'TILED': true},
        serverType: 'geoserver'
    });

    var wms_layer = new ol.layer.Tile({source: source});
    wms_layer.setProperties({layer_type: 'wms_layer'});

    return wms_layer;
}


OLMM.prototype.createVectorLayer = function(style, features)
{
    var source = new ol.source.Vector();

    if (features && features.length > 0) {
        source.addFeatures(features)
    }

    var layer = new ol.layer.Vector({
        source: source,
        style: style
    });

    //this.addSource(name, source);
    //this.addLayer(name, layer);

    return layer;
};
