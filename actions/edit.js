OLMM.prototype.enableEditMode = function(layer_name) {
    var self = this;

    self.disableActions();

    var interaction_name = 'edit';
    var select_name = 'select';

    if (layer_name) {
        interaction_name += '-' + layer_name;
        select_name += '-' + layer_name;
    }

    var select = self.getInteractionsByName(select_name);
    var interaction = self.getInteractionsByName(interaction_name);

    if (select) {
        select.setActive(true)
    } else {
        if (layer_name) {
            var layer = self.getLayerByName(layer_name);
            select = new ol.interaction.Select({
                layers: [layer]
            });
        } else {
            select = new ol.interaction.Select()
        }

        this.addInteraction(select_name, select);
    }

    if (interaction) {
        interaction.setActive(true);
    } else {
        var features = select.getFeatures();

        var modify = new ol.interaction.Modify({
            features: features
        });

        features.on('remove', function(event) {
            self.config['edit_callback'](event, event.element);
        });

        this.addInteraction(interaction_name, modify);
    }
};
