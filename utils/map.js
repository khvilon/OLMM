(function (module) {

    module.getViewPortCoords = function () {
        var self = this;
        var extent = self.map.getView().calculateExtent(self.map.getSize());
        var extent_to_transform = [[extent[0], extent[1]], [extent[2], extent[3]]];
        return self.transform_to_lot_lan(extent_to_transform)
    };

})(OLMM.prototype);
