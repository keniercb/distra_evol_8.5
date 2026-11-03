// if(!Ext.Cont)
Ext.namespace('Ext.Cont');

Ext.Cont.WinEnvioDoc = Ext.extend(Ext.util.Observable,{
    constructor: function(config) {
        this.destino = config.destino;
        Ext.Cont.WinEnvioDoc.superclass.constructor.call(this);
        this.crearFunciones();
        this.crearVentana();
    },
    init: function(win) {
        this.ventana = win;
        win.tools = [{
            id: 'search',
            qtip: 'Documentos enviados',
            handler: this.handlerTool
        }];
    },
    crearFunciones: function () {
        var me = this;
        this.handlerTool = function (event, toolEl, panel) {
            // win.tools.search.hide();
            me.mostrarVentanaDoc();
        };

    },
    crearVentana: function () {
        this.windowCargarDoc = new Ext.WinCargarDoc.Controller();
    },
    mostrarVentanaDoc: function () {
        console.log('lkkkk');
        this.windowCargarDoc.show();
    },
    ocultarVentanaDoc: function () {
        this.windowCargarDoc.hide();
    }
});