OLMM.prototype.createLayers = function () {
    this.pointsSelectSource = new ol.source.Vector();
    this.pointsSelectLayer = new ol.layer.Vector({
        source: this.pointsSelectSource,
        style: this.stylePointSelectFunction
    });

    this.graphSource = new ol.source.Vector();
    this.graphLayer = new ol.layer.Vector({
        source: this.graphSource,
        style: this.styleGraphFunction });

	this.pntsSource = new ol.source.Vector();
    this.pntsLayer = new ol.layer.Vector({
    	source: this.pntsSource,
	  	style: this.stylePntFunction });

    this.geoJSONSource = new ol.source.GeoJSON();
    this.geoJSONLayer = new ol.layer.Vector({
        source: this.geoJSONSource,
        style: this.stylePntFunction
    });

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
};

OLMM.prototype.createCustomLineStyle = function(line_color, line_width){
    return new ol.style.Style({
        stroke: new ol.style.Stroke({
            color: line_color,
            width: line_width
        })
    })
};

OLMM.prototype.createVectorLayer = function(source, style){
    return new ol.layer.Vector({
        source: source,
        style: style
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
        console.log(feature.getGeometry().getCoordinates());
        if (feature && feature.get('name') == 'Point') {
            var id = feature.getId();
            console.log(feature.get('name'), id);
            handleFeatureFunction(id);
        } else {
            handleMapClickFunction(id)
        }
    });
};

OLMM.prototype.createIconLayer = function(coords, need_cluster, layer_style){

    //layer_style = {
    //    image: new ol.style.Circle({
    //        src: 'data/icon.png',
    //        size: [32, 32],
    //        offset: [0, 0],
    //        opacity: 1.0,
    //        rotation: 0.0,
    //        scale: 1.0,
    //        rotateWithView: true
    //    }),
    //    text: new ol.style.Text({
    //        text: "16",
    //        fill: new ol.style.Fill({
    //            color: '#fff'
    //        })
    //    })
    //};

    // layer_style = {
    //     image: new ol.style.Circle({
    //         radius: 10,
    //         stroke: n ol.style.Stroke({
    //             color: '#fff'
    //         }),
    //         fill: new ol.style.Fill({
    //             color: '#3399CC'
    //         })
    //     }),
    //     text: new ol.style.Text({
    //         text: "16",
    //         fill: new ol.style.Fill({
    //             color: '#fff'
    //         })
    //     })
    // };

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

