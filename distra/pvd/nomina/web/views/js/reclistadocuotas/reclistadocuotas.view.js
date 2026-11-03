Ext.ns('Pvd.Nomina.Recuperacion.Reclistadocuotas');
Ext.QuickTips.init();
Pvd.Nomina.Recuperacion.Reclistadocuotas.Vista = {
    init: function (perfil, idioma, modelo) {
        var self = this;
        this.tipoafiliacion = 1;
        //Panel de estructura y composición que cargo hasta el nivel de entidades.
        this.pEstEntidades = new Ext.pvd.persona.buscarestructura.panelBuscarestructura({
            layout: 'border',
            nivel: 5
        });

        this.btnAceptarEntidades = new Ext.Button({
            id: 'btnAceptarEntidades',
            text: idioma.btnAceptar,
            tooltip: 'Guardar datos y cerrar ventana (<b>ENTER</b>)',
            disabled: true,
            iconCls: 'aceptar'
        });

        this.winEstEntidades = new Ext.Window({
            title: idioma.winEstructura,
            modal: true,
            height: 350,
            width: '30%',
            constrain: true,
            closable: false,
            resizable: false,
            layout: 'fit',
            items: [this.pEstEntidades],
            buttons: [this.btnAceptarEntidades],
            keys: [
                {
                    key: Ext.EventObject.ENTER,
                    stopEvent: true,
                    fn: function () {
                        self.btnAceptarEntidades.handler();
                    }
                }
            ]
        });

        this.smFechasCierre = new Ext.grid.CheckboxSelectionModel({});

        //Ventana con los resumenes de las fechas de cierre
        this.gpFechasCierre = new Ext.grid.GridPanel({
            id: 'gpFechasCierre',
            title: 'Fechas de cierre',
            region: 'center',
            layout: 'fit',
            border: true,
            columns: [
                new Ext.grid.RowNumberer(),
                this.smFechasCierre,
                {
                    header: 'Fecha cierre',
                    dataIndex: 'fechacierre',
                    width: 90,
                    hideable: false,
                    sortable: true
                },
                {
                    header: 'Año',
                    dataIndex: 'anno',
                    width: 90,
                    hideable: false,
                    sortable: true,
                    hidden: true
                }
            ],
            stripeRows: true,
            autoScroll: true,
            width: 430,
            height: 200,
            viewConfig: {forceFit: true},
            view: new Ext.grid.GroupingView({
                forceFit: true,
                groupTextTpl: '{text}'
            }),
            store: modelo.stFechasCierre,
            sm: this.smFechasCierre,
            loadMask: {msg: 'Cargando'}
        });

        this.btnAceptarResumenPeriodos = new Ext.Button({
            id: 'btnAceptarResumenPeriodos',
            iconCls: 'aceptar',
            text: 'Aceptar',
            tooltip: 'Guardar datos y cerrar ventana',
            disabled: true
        });

        this.btnCancelarResumenPeriodos = new Ext.Button({
            id: 'btnCancelarResumenPeriodos',
            iconCls: 'cancelar',
            text: 'Cancelar',
            tooltip: 'Cerrar ventana sin guardar los datos'
        });

        this.ventanaResumenPeriodos = new Ext.Window({
            region: 'center',
            layout: 'fit',
            title: 'Resumen de los per&iacute;odos de pago',
            modal: true,
            resizable: true,
            draggable: true,
            autoWidth: true,
            autoHeight: true,
            closeAction: 'hide',
            closable: true,
            items: [this.gpFechasCierre],
            bbar: ['->', this.btnCancelarResumenPeriodos, this.btnAceptarResumenPeriodos]
        });

        //Ventana de listado de personas afiliadas
        this.btnAcpReporte = new Ext.Button({
            disabled: true,
            id: 'btnAcpReporte',
            iconCls: 'aceptar',
            text: 'Aceptar',
            tooltip: 'Guardar datos y cerrar ventana (<b>ENTER</b>)',
        });

        this.btnCancReporte = new Ext.Button({
            id: 'btnCancReporte',
            tooltip: 'Cerrar ventana sin guardar los datos (<b>Alt + X</b>)',
            iconCls: 'cancelar',
            text: 'Cancelar',
            handler: function () {
                self.winTipoAfilacionReporte.hide();
            }.createDelegate(this)
        });

        this.radioPCC = new Ext.form.Radio({
            hideLabel: true,
            id: 'idradiopcc',
            align: 'center',
            boxLabel: 'Afiliados PCC',
            name: 'afiliacion',
            listeners: {
                'check': function (obj, ischeck) {
                    if (ischeck) {
                        self.tipoafiliacion = 1;
                        self.identidad = -1;
                        self.btnAcpReporte.enable();
                    }
                }.createDelegate(this)
            }
        });

        this.radioUJC = new Ext.form.Radio({
            hideLabel: true,
            id: 'idradioujc',
            align: 'center',
            boxLabel: 'Afiliados UJC',
            name: 'afiliacion',
            listeners: {
                'check': function (obj, ischeck) {
                    if (ischeck) {
                        self.tipoafiliacion = 2;
                        self.btnAcpReporte.enable();
                    }
                }.createDelegate(this)
            }
        });

        this.fsRadiosPdf = new Ext.form.FieldSet({
            region: 'center',
            defaultType: 'radio',
            items: [
                this.radioPCC,
                this.radioUJC
            ]
        });

        this.winTipoAfilacionReporte = new Ext.Window({
            title: 'Organizaciones pol&iacute;ticas',
            region: 'center',
            width: 200,
            height: 150,
            constrain: true,
            closable: true,
            closeAction: 'hide',
            resizable: false,
            layout: 'border',
            items: [
                this.fsRadiosPdf
            ],
            buttons: [this.btnCancReporte, this.btnAcpReporte]
        });

        this.cbConfAfiliaciones = new Ext.form.ComboBox({
            id: 'cbConfAfiliaciones',
            valueField: 'idconfafiliacion',
            displayField: 'denominacion',
            hiddenName: 'idconfafiliacion',
            allowBlank: false,
            mode: 'local',
            store: modelo.stAfiliaciones,
            emptyText: 'Seleccione...',
            blankText: idioma.lbErrorCampoVacio,
            readOnly: true,
            width: '100%',
            anchor: '100%',
            triggerAction: 'all'
        });

        this.btnExportarListado = new Ext.Button({
            id: 'idBtnExportarListado',
            text: idioma.lbBtnExportar,
            tooltip: '',
            iconCls: 'exportar',
            disabled: true,
            handler: function () {
                //self.winTipoAfilacionReporte.show();
            }

        });

        this.gpListadoPersonasAfiliadas = new Ext.grid.EditorGridPanel({
            region: 'center',
            border: false,
            loadMask: {text: 'Cargando...'},
            width: 200,
            autoScroll: true,
            columns: [],
            store: modelo.stPersonasAfiliadas,
            sm: new Ext.grid.RowSelectionModel({
                singleSelect: true
            }),
            viewConfig: {forceFit: true},
            view: new Ext.grid.GroupingView({
                forceFit: true,
                groupTextTpl: '{text}'
            })
        });

        this.panelAfiliaciones = new Ext.Panel({
            id: 'idpanelCentralAfiliacion',
            region: 'center',
            heigth: '100%',
            width: '100%',
            border: false,
            layout: 'fit',
            tbar: [' ', 'Afiliaci&oacute;n pol&iacute;tica: ', this.cbConfAfiliaciones, ' ', ' ', this.btnExportarListado],
            items: [this.gpListadoPersonasAfiliadas]
        });

        this.winPersonasAfiliadas = new Ext.Window({
            modal: true,
            maximized: true,
            constrain: true,
            closable: true,
            closeAction: 'hide',
            resizable: false,
            layout: 'border',
            items: [
                this.panelAfiliaciones
            ]
        });
    }
};

//Inicializando la vista.
UCID.portal.cargarEtiquetas('reclistadocuotas', function (perfil, idioma) {
    perfil = arguments[0];
    idioma = arguments[1];

    //Inicializando el modelo.
    var modelo = Pvd.Nomina.Recuperacion.Reclistadocuotas.Modelo;
    modelo.init();
    //Inicializando la vista.
    var vista = Pvd.Nomina.Recuperacion.Reclistadocuotas.Vista;
    vista.init(perfil, idioma, modelo);
    //Inicializar controlador.
    Pvd.Nomina.Recuperacion.Reclistadocuotas.Controlador.init(idioma, vista, modelo);
});
