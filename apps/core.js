function OLMM() {
    this.layers = {};
    this.sources = {};
    this.overlays = {};
    this.firstLayers = [];
    this.styles = {};

    this.config = {
        'add_callback': [],
        'edit_callback': [],
        'delete_callback': [],
        'drag_callback': []
    };

    this.select = null;
    this.interaction = null;
    this.defaultSourceName = null;
    this.defaultLayerName = null;

    this.polygonName = 'Polygon';
    this.lineStringName = 'LineString';
    this.multiLineStringName = 'MultiLineString';
    this.pointName = 'Point'
}

(function (module) {

    module.createMap = function (options) {
        options = options || {};
        var target = options['target'] || 'map';
        var projection = options['projection'] || 'EPSG:3857';
        var center = options['center'] || [4188115.1089405594,7509151.488234565];
        var zoom = options['zoom'] || 11;
        var maxZoom = options['maxZoom'] || 26;
        var minZoom = options['minZoom'] || 3;
        var controls = options['controls'];
        var interactions = options['interactions'];

        if (controls == false) {
            controls = []
        }

        if (interactions == false) {
            interactions = []
        }

        this.map = new ol.Map({
            controls: controls,
            interactions: interactions,
            target: target,
            layers: this.firstLayers,
            view: new ol.View({
                projection: projection,
                center: center,
                zoom: zoom,
                maxZoom: maxZoom,
                minZoom: minZoom,
                tileSize: [256, 256]
            })
        });

        if (controls == undefined) {
            this.map.addControl(new ol.control.ZoomSlider());
        }
    };

    module.setDefaultSourceName = function (name) {
        this.defaultSourceName = name;
        this.defaultLayerName = name;
    };

    module.getDefaultSourceName = function () {
        return this.defaultSourceName;
    };

    module.addToConfig = function (key, value) {
        var self = this;
        var config_value = self.config[key];

        if (config_value instanceof Array) {
            config_value.push(value)
        } else if (!!config_value) {
            if (config_value instanceof Array) {
                self.config[key].push(value);
            } else {
                self.config[key] = [config_value, value];
            }
        } else {
            self.config[key] = value
        }
    };

    module.getConfigValue = function (name) {
        return this.config[name]
    };

    module.getConfigValues = function (name) {
        var values = this.config[name];

        if (!values) {return []}

        if (values instanceof Array) {
            return values
        } else {
            return [values]
        }
    };

    module.readConfig = function (config) {
        var self = this;
        for (var name in config) {
            self.addToConfig(name, config[name]);
        }
    };

})(OLMM.prototype);
