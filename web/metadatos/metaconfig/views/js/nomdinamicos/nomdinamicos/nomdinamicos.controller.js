/**
 * Autor: Tte. Ing. Roberto León Socarrás
 */
Ext.ns('PVD.Persona.Nomdinamicos');
//Controlador de la vista del componente
PVD.Persona.Nomdinamicos.Controlador = {

    init: function (idioma, configuracion, disenno, gestionarconfiguracion) {
        var self = this;

        this.Viewport = new Ext.Viewport(
            {
                layout: 'border',
                region: 'center',
                // tbar  : ['->', self.btnAyuda],
                items: [disenno.panelPrincipal, configuracion.panelCentral]

            });

        configuracion.btnGestionarConfiguracion.setHandler(function () {
            var ventanaConfiguraciones = new Ext.Window({
                title:'Gestión de configuraciones',
                modal: true,
                enableTabScroll: true,
                closeAction: 'hide',
                closable: true,
                resizable: false,
                maximizable: false,
                constrain: true,
                minimizable: false,
                layout: 'fit',
                items: [gestionarconfiguracion.tbpActivo]
            });
            ventanaConfiguraciones.show();
            ventanaConfiguraciones.maximize();
            ventanaConfiguraciones.doLayout();
            });

        configuracion.gpConfiguracion.getSelectionModel().on('rowselect', function (_this, rowIndex, r ) {
            disenno.idconfiguracion=r.data.idconfiguracion;
            disenno.identificadorconfiguracion=r.data.denominacion;
            disenno.stEntidad.load({
                params: {
                    start: 0,
                    limit: 15,
                    idconfiguracion: r.data.idconfiguracion
                }
            });
            disenno.btnAdicionar.enable();

        }, this);

        configuracion.gpConfiguracion.getSelectionModel().on('rowdeselect', function (_this, rowIndex, r ) {

            disenno.btnAdicionar.disable();
            disenno.btnAdicionarAtributo.disable();

        }, this);

    }
};


