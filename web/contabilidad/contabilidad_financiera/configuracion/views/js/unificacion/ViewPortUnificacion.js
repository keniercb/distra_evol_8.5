Ext.namespace('Configuracion.Unificacion');
Ext.QuickTips.init();
Ext.Ajax.timeout = 6000000;

Ext.Ajax.request({
    method: "POST",
    url: "cargaretiquetas",
    callback: function (options, success, response) {
        new Configuracion.Unificacion.Viewport({
            idioma: Ext.decode(response.responseText),
            perfil: window.parent.perfil
        });
    }
});

Configuracion.Unificacion.Viewport = Ext.extend(Ext.Viewport, {
    constructor: function (params) {

        this.PanelConfiguracion = new Configuracion.Unificacion.PanelConfiguracion({
            idioma: params.idioma,
            perfil: params.perfil,
            scope: this,
            region: 'north',
            minSize: 100,
            maxSize: 100,
            height : 167,
            border: false
        });

        this.PanelCuentasMonedaUnificar = new Configuracion.Unificacion.PanelCuentasMonedaUnificar({
            idioma: params.idioma,
            perfil: params.perfil,
            scope: this,
            region: 'center',
            border: false,
            floatable: false,
            split: false,
            minSize: 100,
            maxSize: 1000
        });

        this.PanelInformacion = new Configuracion.Unificacion.PanelInformacion({
            idioma: params.idioma,
            perfil: params.perfil,
            scope: this,
            region: 'center',
            border: true,
            split: true,
            width: Ext.lib.Dom.getViewWidth() * 0.68,

        });

        this.border = {
            layout:'border',
            bodyBorder: false,
            defaults: {
                collapsible: false,
                split: false,
                animFloat: false,
                autoHide: false,
                useSplitTips: true,
                bodyStyle: 'padding:1px'
            },
            items: [{
                layout: 'border',
                region:'west',
                width: 600,
                defaults: {
                    collapsible: false,
                    split: false,
                    animFloat: false,
                    autoHide: false,
                    useSplitTips: true,
                    bodyStyle: 'padding:1px'
                },
                items: [this.PanelConfiguracion, this.PanelCuentasMonedaUnificar]
            }, this.PanelInformacion],
        };

        this.contentPanel = {
            id: 'content-panel',
            layout: 'card',
            region: 'center',
            margins: '2 5 5 0',
            activeItem: 0,
            border: false,
            items: [this.border]

        };
        Ext.apply(this, params);
        Ext.apply(this, {
            layout: 'border',
            idioma: params.idioma,
            items: [this.contentPanel]
        });

        Configuracion.Unificacion.Viewport.superclass.constructor.call(this, params);
    }
});
