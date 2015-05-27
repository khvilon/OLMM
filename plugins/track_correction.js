OLMM.prototype.createRequiredLayers = function(){
    this.federalHighWayStyle = new ol.style.Style({
        stroke: new ol.style.Stroke({
            color: 'red',
            width: 4
        }),
        fill: new ol.style.Fill({
            color: 'red'
        })
    });
    this.federalHighWaySource = new ol.source.Vector();
    this.federalHighWayLayer = new ol.layer.Vector({
        source: this.federalHighWaySource,
        style: this.federalHighWayStyle });




    this.simpleRoadStyle = new ol.style.Style({
        stroke: new ol.style.Stroke({
            color: 'black',
            width: 4
        }),
        fill: new ol.style.Fill({
            color: 'black'
        })
    });
    this.simpleRoadSource = new ol.source.Vector();
    this.simpleRoadLayer = new ol.layer.Vector({
        source: this.simpleRoadSource,
        style: this.simpleRoadStyle
    });

    this.map.addLayer(this.simpleRoadLayer);
    this.map.addLayer(this.federalHighWayLayer);

};
