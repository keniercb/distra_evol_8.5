Ext.ns('Ext.Log.ExpTec');

Ext.Log.ExpTec.VentataMostrarHistorial = Ext.extend(Ext.Window, {
    constructor: function (config) {
        this.closeAction = 'hide';
        Ext.apply(this, config);
        var _this = this;
        this.idioma = config.idioma;
        this.resizable = false;
        this.modal = true;
        this.width = 900;
        this.autoHeight = true;

        this.idregnumerico=config.idregnumerico;

        this.buttons = [
            {
                tooltip: _this.idioma.btnTtCerrar,
                iconCls: 'cerrar',
                text: "Cerrar",
                handler: function () {
                    _this.close();
                }
            }
        ];

        this.panelTrazas = new Ext.Log.ExpTec.PanelTrazas({
            id:'idpanelTrazas',
            idioma: _this.idioma,
            idregnumerico:_this.idregnumerico
        });

        this.panelCentral = new Ext.TabPanel({
            border: false,
            bodyBorder: false,
            layoutOnTabChange: true,
            activeTab: 0,
            items: [_this.panelTrazas]
        });

        this.items = [_this.panelTrazas];

        Ext.Log.ExpTec.VentataMostrarHistorial.superclass.constructor.apply(this, arguments);
    }
});