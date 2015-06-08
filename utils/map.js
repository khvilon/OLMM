(function (module) {

    module.getViewPortCoords = function () {
        var self = this;
        var extent = self.map.getView().calculateExtent(self.map.getSize());
        return self.transform_to_lot_lan(extent)
    };

})(OLMM.prototype);
