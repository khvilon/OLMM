function OLMM()
{
    this.layers = {};
    this.sources = {};
    this.firstLayers = [];
}



OLMM.prototype.createMap = function (divName)
{
    this.map = new ol.Map(
    {
        target: divName,
        layers: this.firstLayers,
        view: new ol.View({
            center: [0, 0],
           zoom: 10
          })
    });
};

//this.getMainLayers().concat([
//            this.lineLayer,
 //           this.graphLayer,
//            this.graphLayer2,
//            this.lastProjLayer,
//            this.allProjLayer,
//            this.mmProjLayer,
 //           this.goodProjLayer,
//            this.pntsLayer,
//            this.geoJSONLayer

OLMM.prototype.init = function (divName, selectPntFunction, mapClickFunction) {
//    this.initDefaults();
    this.createLayers();
    this.createMap(divName);
    //this.addPntSelect(selectPntFunction, mapClickFunction);

    //this.createLayers();
};

OLMM.prototype.initDefaults = function() {
    this.layers = {};
    this.sources = {};
};

OLMM.prototype.getLayerByName = function(name) {
    return this.layers[name];
};

OLMM.prototype.getSourceByName = function(name) {
    return this.sources[name];
};

OLMM.prototype.addSource = function(name, source) {
    this.sources[name] = source
};

OLMM.prototype.addLayer = function(name, layer, not_add_to_map) {
    this.layers[name] = layer;
    this.addSource(name, layer.getSource()); 
    //if (!not_add_to_map) 
    if(this.map)
    {
        this.map.addLayer(layer);
    }
    else this.firstLayers.push(layer);
};

OLMM.prototype.setLayerVisible = function(layer_name, visible) {
    this.getLayerByName(layer_name).setVisible(visible);
};


