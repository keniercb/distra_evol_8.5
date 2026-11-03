var perfil = window.parent.UCID.portal.perfil;
var lang = (perfil.idioma) ? perfil.idioma.toUpperCase() : 'ES';

Ext.application({
    name: 'PRT',

    paths: {
        'PRT': '../../views/js/app',
        'CostoComun': '../../../comun'
    },
    requires: [
        //'Ext.container.Viewport',
        //'Ext.grid.column.Action',
        //'Ext.util.KeyMap',
        'PRT.language.' + lang,
        'CostoComun.overrides.Overrides',
        'CostoComun.messages.Messages',
        'CostoComun.formats.NumberFormat',
        'CostoComun.components.SearchField'
    ],

    //appFolder: 'app',

    controllers: [
        'CtrCosteo'
    ],

    launch: function () {
        Ext.create('Ext.container.Viewport', {
            layout: 'fit',
            items: [
                {
                    xtype: 'panelprorrateo'
                }
            ]
        });
    }
});