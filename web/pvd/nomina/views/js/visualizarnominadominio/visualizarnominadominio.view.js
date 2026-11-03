Ext.ns('Pvd.Nomina.Pagos.VisualizarNominaDominio');
Ext.QuickTips.init();

Pvd.Nomina.Pagos.VisualizarNominaDominio.Vista = {
    init: function (perfil, idioma, modelo) {
        var self = this;
        //Panel de estructura y composición que cargo hasta el nivel de entidades.
        this.pEstEntidades = new Ext.pvd.persona.buscarestructura.panelBuscarestructura({
            layout: 'border',
            nivel : 5
            //nivelchequear: 3
        });

        //Botón  para cargar las personas pertenecientes a la unidad selecionada.
        this.btnAceptarEntidades = new Ext.Button({
            id      : 'btnAceptarEntidades',
            text    : idioma.btnAceptar,
            tooltip : 'Guardar datos y cerrar ventana (<b>ENTER</b>)',
            disabled: true,
            // icon: perfil.dirImg + 'aceptar.png',
            iconCls : 'aceptar'
        });

        //Vista para el componente Buscar estructura 
        this.winEstEntidades = new Ext.Window({
            title    : 'Entidades',
            modal    : true,
            height   : 350,
            width    : '30%',
            closable : false,
            constrain: true,
            resizable: false,
            layout   : 'fit',
            items    : [this.pEstEntidades],
            buttons  : [this.btnAceptarEntidades],
            keys     : [
                {
                    key      : Ext.EventObject.ENTER,
                    stopEvent: true,
                    fn       : function () {
                        self.btnAceptarEntidades.handler();
                    }
                }
            ]
        });

        this.objListarPeriodosPagos = new Pvd.Nomina.ElaborarPago.ListarPeriodosPago({});

        this.objListarPeriodosPagos.cbTipoPago.setSize(400,10);

        this.btnAceptarPeriodosPagos = new Ext.Button({
            id      : 'btnAceptarPeriodosPagos',
            text    : idioma.btnAceptar,
            tooltip : 'Guardar datos y cerrar ventana (<b>ENTER</b>)',
            disabled: true,
            //icon: perfil.dirImg + 'aceptar.png',
            iconCls : 'aceptar'
        });

        this.btnAyuda = new Ext.Button({
            id: 'btnAyuda',
            text: 'Ayuda',
            tooltip: 'Mostrar ayuda de la funcionalidad (<b>Alt+H</b>)',
            //icon: perfil.dirImg + 'ayuda.png',
            iconCls: 'ayuda',

        });

        this.winPeriodosPagos = new Ext.Window({
            title      : 'Per&iacute;odos de pago',
            modal      : true,
            height     : 400,
            width      : 550,
            closable   : true,
            closeAction: 'hide',
            constrain: true,
            resizable  : false,
            layout     : 'border',
            items      : [this.objListarPeriodosPagos],
            buttons    : [this.btnAceptarPeriodosPagos],
            keys       : [
                {
                    key      : Ext.EventObject.ENTER,
                    stopEvent: true,
                    fn       : function () {
                        self.btnAceptarPeriodosPagos.handler();
                    }
                }
            ]
        });

        this.winNomina = new Pvd.Nomina.VisualizarNominaDominio.winVisualizarNomina({});
    }
}
