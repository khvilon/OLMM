(function (module) {

    module.getOverlayByName = function(name) {
        return this.overlays[name];
    };

    module.addOverlay = function(name, overlay) {
        this.overlays[name] = overlay;
        this.map.addOverlay(overlay)
    };

})(OLMM.prototype);
