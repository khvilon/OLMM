(function (module) {

    module.getOverlayByName = function(name) {
        return this.overlays[name];
    };

    module.addOverlay = function(name, overlay) {
        this.overlays[name] = overlay;
        this.map.addOverlay(overlay)
    };

    module.closeOverlay = function(name) {
        name = name || 'overlay';
        var overlay = this.getOverlayByName(name);
        overlay.setPosition(undefined);
        return false;
    }

})(OLMM.prototype);
