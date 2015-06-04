(function (module) {

    module.fitToExtent = function (source_name) {
        var self = this;
        self.map.getView().fitExtent(self.getSourceByName(source_name).getExtent(), self.map.getSize());
    };

})(OLMM.prototype);
